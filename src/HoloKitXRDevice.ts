import XRFrame from "./api/XRFrame";

import XRHand from "./api/XRHand";

import { mat4, quat, vec3 } from 'gl-matrix';

import XRDevice from 'webxr-polyfill/src/devices/XRDevice';
import type { XRSessionMode } from 'webxr';

export default class HoloKitXRDevice extends XRDevice {
  static instance?: HoloKitXRDevice | null = null;

  constructor(global) {
    super(global);

    this._sessions = new Map();

    if (!HoloKitXRDevice.instance) {
        HoloKitXRDevice.instance = this;
    }
}

  static getInstance(): HoloKitXRDevice {
    return HoloKitXRDevice.instance;
  }

  onBaseLayerSet(sessionId: number, layer: XRWebGLLayer) {
    const session = this.sessions.get(sessionId);
    session.baseLayer = layer;
    const cfg = getLookingGlassConfig();

    const baseLayerPrivate = layer[HoloKitXRWebGLLayer_PRIVATE];
    _LookingGlassEnabled = session.immersive;
    if (session.immersive) {
      cfg.XRSession = this.sessions.get(sessionId)
      //create the window and pass in the session reference
      if (cfg.popup == null) {
        baseLayerPrivate.moveCanvasToWindow(true, () => {
          this.endSession(sessionId);
        });
      }
      else {
        console.warn('attempted to assign baselayer twice?')
      }

    }
  }

  public isSessionSupported(mode: XRSessionMode): boolean {
    return mode === 'inline' || mode === 'immersive-ar';
  }

  public isFeatureSupported(featureDescriptor: FeatureDescriptor) {
    switch (featureDescriptor) {
      case 'viewer': return true;
      case 'local': return true;
      case 'local-floor': return true;
      case 'bounded-floor': return false;
      case 'unbounded': return false;
      default:
        console.warn('LookingGlassXRDevice.isFeatureSupported: feature not understood:', featureDescriptor);
        return false;
    }
  }

  async requestSession(mode: XRSessionMode, enabledFeatures: Set<FeatureDescriptor>) {
    if (!this.isSessionSupported(mode)) {
      return Promise.reject();
    }
    const immersive = mode !== 'inline';
    const session = new Session(mode, enabledFeatures);
    this.sessions.set(session.id, session);
    if (immersive) {
      this.dispatchEvent('@@webxr-polyfill/vr-present-start', session.id);
    }
    return Promise.resolve(session.id);
  }

  requestAnimationFrame(callback) {
    return this.global.requestAnimationFrame(callback);
  }

  cancelAnimationFrame(handle) {
    this.global.cancelAnimationFrame(handle);
  }

  onFrameStart(sessionId, renderState) {
    const session = this.sessions.get(sessionId);
    const cfg = getLookingGlassConfig();

    if (session.immersive) {
      const tanHalfFovy = Math.tan(0.5 * cfg.fovy);
      // Distance from frustum's vertex to target.
      const focalDistance = 0.5 * cfg.targetDiam / tanHalfFovy;
      const clipPlaneBias = focalDistance - cfg.targetDiam;

      const mPose = this.basePoseMatrix;
      mat4.fromTranslation(mPose, [cfg.targetX, cfg.targetY, cfg.targetZ]);
      mat4.rotate(mPose, mPose, cfg.trackballX, [0, 1, 0]);
      mat4.rotate(mPose, mPose, -cfg.trackballY, [1, 0, 0]);
      mat4.translate(mPose, mPose, [0, 0, focalDistance]);

      for (let i = 0; i < cfg.numViews; ++i) {
        const fractionAlongViewCone = (i + 0.5) / cfg.numViews - 0.5; // -0.5 < this < 0.5
        const tanAngleToThisCamera = Math.tan(cfg.viewCone * fractionAlongViewCone);
        const offsetAlongBaseline = focalDistance * tanAngleToThisCamera;

        const mView = (this.LookingGlassInverseViewMatrices[i] = this.LookingGlassInverseViewMatrices[i] || mat4.create());
        mat4.translate(mView, mPose, [offsetAlongBaseline, 0, 0]);
        mat4.invert(mView, mView);

        // depthNear/Far are the distances from the view origin to the near/far planes.
        // l/r/t/b/n/f are as in the usual OpenGL perspective matrix formulation.
        const n = Math.max(clipPlaneBias + renderState.depthNear, 0.01);
        const f = clipPlaneBias + renderState.depthFar;
        const halfYRange = n * tanHalfFovy;
        const t = halfYRange, b = -halfYRange;
        const midpointX = n * -tanAngleToThisCamera;
        const halfXRange = cfg.aspect * halfYRange;
        const r = midpointX + halfXRange, l = midpointX - halfXRange;
        const mProj = (this.LookingGlassProjectionMatrices[i] = this.LookingGlassProjectionMatrices[i] || mat4.create());
        mat4.set(mProj,
          2 * n / (r - l), 0, 0, 0,
          0, 2 * n / (t - b), 0, 0,
          (r + l) / (r - l), (t + b) / (t - b), -(f + n) / (f - n), -1,
          0, 0, -2 * f * n / (f - n), 0);
      }

      const baseLayerPrivate = session.baseLayer[LookingGlassXRWebGLLayer_PRIVATE];
      baseLayerPrivate.clearFramebuffer();
      //if session is not immersive, we need to set the projection matrix and view matrix for the inline session 
      // Note: I think this breaks three.js when the session is ended. We should *try* to grab the camera position before entering the session if possible. 
    } else {
      const gl = session.baseLayer.context;

      // Projection
      const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
      mat4.perspective(this.inlineProjectionMatrix, renderState.inlineVerticalFieldOfView, aspect,
        renderState.depthNear, renderState.depthFar);

      // View
      mat4.fromTranslation(this.basePoseMatrix, [0, DefaultEyeHeight, 0]);
      mat4.invert(this.inlineInverseViewMatrix, this.basePoseMatrix);
    }
  }

  onFrameEnd(sessionId: number) {
    const session = this.sessions.get(sessionId);
    session.baseLayer[LookingGlassXRWebGLLayer_PRIVATE].blitTextureToDefaultFramebufferIfNeeded();

    if (this.captureScreenshot && this.screenshotCallback) {
      this.screenshotCallback();
      this.captureScreenshot = false;
    }
  }

// Looking Glass WebXR Library requires local to be set when requesting an XR session.
  async requestFrameOfReferenceTransform(type, options) {
    const matrix = mat4.create();
    switch (type) {
      case 'viewer':
      case 'local':
        mat4.fromTranslation(matrix, [0, -DefaultEyeHeight, 0]);
        return matrix;
      case 'local-floor':
        return matrix;
      default:
        throw new Error('XRReferenceSpaceType not understood');
    }
  }

  endSession(sessionId: number) {
    const session = this.sessions.get(sessionId);
    if (session.immersive && session.baseLayer) {
      // close the window and destroy the controls on the end of session
      session._baseLayer._moveCanvasToWindow(false);
      this.dispatchEvent('@@webxr-polyfill/vr-present-end', sessionId);
    }
    session.ended = true;
  }

  doesSessionSupportReferenceSpace(sessionId, type) {
    const session = this.sessions.get(sessionId);
    if (session.ended) {  
      return false;
    }
    return session.enabledFeatures.has(type);
  }

  override getViewSpaces(mode: XRSessionMode) {
    if (mode === 'immersive-ar') {
      for (let i = this.viewSpaces.length; i < cfg.numViews; ++i) {
        this.viewSpaces[i] = new LookingGlassXRSpace(i);
      }
      return this.viewSpaces;
    }

    return undefined;
  }

  // get the current view and determine where on the quilt to render it. 
  override getViewport(sessionId: number, eye: XREye, layer: XRWebGLLayer, target: Object?) {
    if (viewIndex === undefined) {
      const session = this.sessions.get(sessionId);
      const gl = session.baseLayer.context;

      target.x = 0;
      target.y = 0;
      target.width = gl.drawingBufferWidth;
      target.height = gl.drawingBufferHeight;
    } else {
      const cfg = getLookingGlassConfig();
      const col = viewIndex % cfg.quiltWidth;
      const row = Math.floor(viewIndex / cfg.quiltWidth);
      // determine where to draw the current viewIndex to in the quilt
      target.x = (cfg.framebufferWidth / cfg.quiltWidth) * col;
      target.y = (cfg.framebufferHeight / cfg.quiltHeight) * row;
      target.width = cfg.framebufferWidth / cfg.quiltWidth;
      target.height = cfg.framebufferHeight / cfg.quiltHeight;
    }
    return true;
  }

  override getProjectionMatrix(eye: XREye, viewIndex: number) {
    if (viewIndex === undefined) { return this.inlineProjectionMatrix; }
    return this.LookingGlassProjectionMatrices[viewIndex] || mat4.create();
  }

  getBasePoseMatrix(): Float32Array {
    return this.basePoseMatrix;
  }

  getBaseViewMatrix(): Float32Array {
    // Only used for inline mode.
    return this.inlineInverseViewMatrix;
  }

  _getViewMatrixByIndex(viewIndex) {
    return (this.LookingGlassInverseViewMatrices[viewIndex] = this.LookingGlassInverseViewMatrices[viewIndex] || mat4.create());
  }

  getInputSources() { return []; }

  getInputPose(inputSource, coordinateSystem, poseType) { return null; }

  onWindowResize() { 
    
  }
};


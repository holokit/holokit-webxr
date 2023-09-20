// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRReferenceSpace from './XRReferenceSpace';
import XRWebGLLayer from './XRWebGLLayer';
import { XRSessionMode } from './XRSession';
import { XRFrameOfReferenceType } from './XRFrame';
import XRInputSource from './XRInputSource';

export default abstract class XRDevice extends EventTarget {

  constructor(global: any) {
    super();

    this.global = global;
    this.onWindowResize = this.onWindowResize.bind(this);

    this.global.window.addEventListener('resize', this.onWindowResize);

    // Value is used for `XRSession.prototype.environmentBlendMode`
    // and should be one of XREnvironmentBlendMode types: 'opaque', 'additive',
    // or 'alpha-blend'.
    this.environmentBlendMode = 'opaque';
  }

  /**
   * Called when a XRSession has a `baseLayer` property set.
   *
   * @param {number} sessionId
   * @param {XRWebGLLayer} layer
   */
  onBaseLayerSet(sessionId: number, layer: XRWebGLLayer): void { 
    throw new Error('Not implemented'); 
  }

  /**
   * @param {XRSessionMode} mode
   * @return {boolean}
   */
  isSessionSupported(mode: XRSessionMode): boolean { 
    throw new Error('Not implemented'); 
  }

  /**
   * @param {string} featureDescriptor
   * @return {boolean}
   */
  isFeatureSupported(featureDescriptor: string): boolean {
    throw new Error('Not implemented'); 
  }

  /**
   * Returns a promise if creating a session is successful.
   * Usually used to set up presentation in the device.
   *
   * @param {XRSessionMode} mode
   * @param {Set<string>} enabledFeatures
   * @return {Promise<number>}
   */
  async requestSession(mode: XRSessionMode, enabledFeatures: string[]): Promise<number> {
    throw new Error('Not implemented'); 
  }

  /**
   * TODO
   * @return {Function}
   */
  requestAnimationFrame(callback): Function { 
    throw new Error('Not implemented'); 
  }

  /**
   * @param {number} sessionId
   */
  onFrameStart(sessionId: number) { 
    throw new Error('Not implemented'); 
  }

  /**
   * @param {number} sessionId
   */
  onFrameEnd(sessionId: number) { 
    throw new Error('Not implemented'); 
  }

  /**
   * @param {number} sessionId
   * @param {XRReferenceSpaceType} type
   * @return {boolean}
   */
  doesSessionSupportReferenceSpace(sessionId: number, type: XRReferenceSpaceType): boolean { 
    throw new Error('Not implemented'); 
  }

  /**
   * @return {Object?}
   */
  requestStageBounds() { 
    throw new Error('Not implemented'); 
  }

  /**
   * Returns a promise resolving to a transform if XRDevice
   * can support frame of reference and provides its own values.
   * Can resolve to `undefined` if the polyfilled API can provide
   * a default. Rejects if this XRDevice cannot
   * support the frame of reference.
   *
   * @param {XRFrameOfReferenceType} type
   * @param {XRFrameOfReferenceOptions} options
   * @return {Promise<XRFrameOfReference>}
   */
  async requestFrameOfReferenceTransform(type: XRFrameOfReferenceType, options: XRFrameOfReferenceOptions): Promise<XRFrameOfReference>{
    return undefined;
  }

  /**
   * @param {number} handle
   */
  cancelAnimationFrame(handle) { throw new Error('Not implemented'); }

  /**
   * @param {number} sessionId
   */
  endSession(sessionId: number) { 
    throw new Error('Not implemented'); 
  }

  /**
   * Takes a XREye and a target to apply properties of
   * `x`, `y`, `width` and `height` on. Returns a boolean
   * indicating if it successfully was able to populate
   * target's values.
   *
   * @param {number} sessionId
   * @param {XREye} eye
   * @param {XRWebGLLayer} layer
   * @param {Object?} target
   * @return {boolean}
   */
  getViewport(sessionId: number, eye: XREye, layer: XRWebGLLayer, target: XRViewportInit?) { 
    throw new Error('Not implemented'); 
  }

  /**
   * @param {XREye} eye
   * @return {Float32Array}
   */
  getProjectionMatrix(eye: XREye): Float32Array { 
    throw new Error('Not implemented'); 
  }

  /**
   * Get model matrix unaffected by frame of reference.
   *
   * @return {Float32Array}
   */
  getBasePoseMatrix(): Float32Array { 
    throw new Error('Not implemented'); 
  }

  /**
   * Get view matrix unaffected by frame of reference.
   *
   * @param {XREye} eye
   * @return {Float32Array}
   */
  getBaseViewMatrix(eye: XREye): Float32Array { 
    throw new Error('Not implemented'); 
  }

  /**
   * Get a list of input sources.
   *
   * @return {Array<XRInputSource>}
   */
  getInputSources(): XRInputSource[] { 
    throw new Error('Not implemented'); 
  }

  /**
   * Get the current pose of an input source.
   *
   * @param {XRInputSource} inputSource
   * @param {XRCoordinateSystem} coordinateSystem
   * @param {String} poseType
   * @return {XRPose}
   */
  getInputPose(inputSource: XRInputSource, coordinateSystem, poseType: string): XRPose { 
    throw new Error('Not implemented'); 
  }

  /**
   * Called on window resize.
   */
  onWindowResize() {
    // Bound by XRDevice and called on resize, but
    // this will call child class onWindowResize (or, if not defined,
    // call an infinite loop I guess)
    this.onWindowResize();
  }
}

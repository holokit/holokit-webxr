// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRFrame from './XRFrame';
import XRReferenceSpace from './XRReferenceSpace';
import XRRenderState from './XRRenderState';
import XRWebGLLayer from './XRWebGLLayer';
import XRInputSourceEvent from './XRInputSourceEvent';
import XRSessionEvent from './XRSessionEvent';
import XRSpace from './XRSpace';
import XRInputSourcesChangeEvent from './XRInputSourcesChangeEvent';

/**
 * @see https://immersive-web.github.io/webxr/#xrsessionmode-enum
 */
export enum XRSessionMode {
  'inline' = 'inline',
  'immersive-vr' = 'immersive-vr',
  'immersive-ar' = 'immersive-ar'
}

/**
 * @see https://immersive-web.github.io/webxr/#dictdef-xrsessioninit
 */
export interface XRSessionInit {
  optionalFeatures?: Array<string>;
  requiredFeatures?: Array<string>;
}

/**
 * @see https://immersive-web.github.io/webxr-ar-module/#xrsessionmode-enum
 */
export enum XREnvironmentBlendMode {
  'opaque' = 'opaque',
  'alpha-blend' = 'alpha-blend',
  'additive' = 'additive'
}

/**
 * @see https://immersive-web.github.io/webxr-ar-module/#xrinteractionmode-enum
 */
export enum XRInteractionMode {
  'screen-space' = 'screen-space',
  'world-space' = 'world-space'
} 

/**
 * @see https://immersive-web.github.io/webxr/#xrsession-interface
 */
export enum XRVisibilityState {
  'visible' = 'visible',
  'visible-blurred' = 'visible-blurred',
  'hidden' = 'hidden'
}

export type XRFrameRequestCallback = (time: DOMHighResTimeStamp, frame: XRFrame) => void;

export interface XRSessionInit
{
  domOverlayState: XRDOMOverlayState;
}

// Nonstandard helper class. Not exposed by the API anywhere.
class XRViewSpace extends XRSpace {
  constructor(eye) {
    super(eye);
  }

  get eye() {
    return this._specialType;
  }

  /**
   * Called when this space's base pose needs to be updated
   * @param {XRDevice} device
   */
  _onPoseUpdate(device) {
    this._inverseBaseMatrix = device.getBaseViewMatrix(this._specialType);
  }
}

export default class XRSession extends EventTarget {

  onend?: EventListenerOrEventListenerObject = undefined;
  oninputsourceschange?: EventListenerOrEventListenerObject = undefined;
  onselect?: EventListenerOrEventListenerObject = undefined;
  onselectstart?: EventListenerOrEventListenerObject = undefined;
  onselectend?: EventListenerOrEventListenerObject = undefined;
  onsqueeze?: EventListenerOrEventListenerObject = undefined;
  onsqueezestart?: EventListenerOrEventListenerObject = undefined;
  onsqueezeend?: EventListenerOrEventListenerObject = undefined;
  onvisibilitychange?: EventListenerOrEventListenerObject = undefined;
  onframeratechange?: EventListenerOrEventListenerObject = undefined;

  #device: XRDevice;
  #immersive: boolean;

  /**
   * @param {XRDevice} device
   * @param {XRSessionMode} mode
   * @param {number} id
   */
  constructor(device: XRDevice, mode: XRSessionMode, id: number) {
    super();

    let immersive = mode != 'inline';

    // inlineVerticalFieldOfView must initialize to PI/2 for inline sessions.
    let initialRenderState = new XRRenderState({
      inlineVerticalFieldOfView: immersive ? null : Math.PI * 0.5
    });

    this.#device = device;
    this.#immersive = immersive;
    this.#mode = mode; 
    this.#ended = false;
    this.#suspended = false;
    this.#frameCallbacks = [];
    this.#currentFrameCallbacks = null;
    this.#frameHandle = 0;
    this.#deviceFrameHandle = null;
    this.#id = id;
    this.#activeRenderState = initialRenderState;
    this.#pendingRenderState = null;
    this.#viewSpace = new XRReferenceSpace('viewer');
    this.#viewSpaces = [];
    this.#currentInputSources = [];

    if (immersive) {
      this.#viewSpaces.push(new XRViewSpace('left'),
                            new XRViewSpace('right'));
    } else {
      this.#viewSpaces.push(new XRViewSpace('none'));
    }

    // Single handler for animation frames from the device. The spec says this must
    // run on every candidate frame even if there are no callbacks queued up.
    this.#ondeviceframe = () => {
      if (this.#ended || this.#suspended) {
        return;
      }

      // Queue next frame
      this.#deviceFrameHandle = null;
      this.#startDeviceFrameLoop();

      // - If session’s pending render state is not null, apply the pending render state.
      if (this.#pendingRenderState !== null) {
        // Apply pending render state.
        this.#activeRenderState = new XRRenderState(this.#pendingRenderState);
        this.#pendingRenderState = null;

        // Report to the device since it'll need to handle the layer for rendering.
        if (this.#activeRenderState.baseLayer) {
          this.#device.onBaseLayerSet(
            this.#id,
            this.#activeRenderState.baseLayer);
        }
      }

      // - If session’s renderState's baseLayer is null, abort these steps.
      if (this.#activeRenderState.baseLayer === null) {
        return;
      }

      // - If session’s mode is "inline" and session’s renderState's output canvas is null,
      //   abort these steps.
      // ???

      const frame = new XRFrame(device, this, this.#id);

      // - Let callbacks be a list of the entries in session’s list of animation frame
      //   callback, in the order in which they were added to the list.
      const callbacks = this.#currentFrameCallbacks = this.#frameCallbacks;

      // - Set session’s list of animation frame callbacks to the empty list.
      this.#frameCallbacks = [];

      // - Set frame’s active boolean to true.
      frame[XRFRAME_PRIVATE].active = true;

      // - Set frame’s animationFrame boolean to true.
      frame[XRFRAME_PRIVATE].animationFrame = true;

      this.#device.onFrameStart(this.#id, this.#activeRenderState);
      // inputSources can be populated in .onFrameStart()
      // so check the change and fire inputsourceschange event if needed
      this._checkInputSourcesChange();

      // - For each entry in callbacks, in order:
      //   - If the entry’s cancelled boolean is true, continue to the next entry.
      //   - Invoke the Web IDL callback function, passing now and frame as the arguments
      //   - If an exception is thrown, report the exception.
      const rightNow = now(); //should we get this from arguments?
      for (let i = 0; i < callbacks.length; i++) {
        try {
          if (!callbacks[i].cancelled && typeof callbacks[i].callback === 'function') {
            callbacks[i].callback(rightNow, frame);
          }
        } catch(err) {
          console.error(err);
        }
      }
      this.#currentFrameCallbacks = null;

      // - Set frame’s active boolean to false.
      frame[XRFRAME_PRIVATE].active = false;

      this.#device.onFrameEnd(this.#id);
    };

    this.#startDeviceFrameLoop = () => {
      if (this.#deviceFrameHandle === null) {
        this.#deviceFrameHandle = this.#device.requestAnimationFrame(
          this.onDeviceFrame
        );
      }
    };

    this.#stopDeviceFrameLoop = () => {
      const handle = this.#deviceFrameHandle;
      if (handle !== null) {
        this.#device.cancelAnimationFrame(handle);
        this.#deviceFrameHandle = null;
      }
    };

    // Hook into the XRDisplay's `vr-present-end` event so we can
    // wrap up things here if we're cut off from the underlying
    // polyfilled device or explicitly ended via `session.end()` for this
    // session.
    this[PRIVATE].onPresentationEnd = sessionId => {
      // If this session was suspended, resume it now that an immersive
      // session has ended.
      if (sessionId !== this[PRIVATE].id) {
        this[PRIVATE].suspended = false;
        this[PRIVATE].startDeviceFrameLoop();
        this.dispatchEvent('focus', { session: this });
        return;
      }

      // Otherwise, this is the immersive session that has ended.
      // Set `ended` to true so we can disable all functionality
      // in this XRSession
      this[PRIVATE].ended = true;
      this[PRIVATE].stopDeviceFrameLoop();

      device.removeEventListener('@@webxr-polyfill/vr-present-end', this[PRIVATE].onPresentationEnd);
      device.removeEventListener('@@webxr-polyfill/vr-present-start', this[PRIVATE].onPresentationStart);
      device.removeEventListener('@@webxr-polyfill/input-select-start', this[PRIVATE].onSelectStart);
      device.removeEventListener('@@webxr-polyfill/input-select-end', this[PRIVATE].onSelectEnd);

      this.dispatchEvent('end', 
        new XRSessionEvent('end', { session: this })
      );
    };
    device.addEventListener('@@webxr-polyfill/vr-present-end', this[PRIVATE].onPresentationEnd);

    // Hook into the XRDisplay's `vr-present-start` event so we can
    // suspend if another session has begun immersive presentation.
    this[PRIVATE].onPresentationStart = sessionId => {
      // Ignore if this is the session that has begun immersive presenting
      if (sessionId === this[PRIVATE].id) {
        return;
      }

      this.#suspended = true;
      this.#stopDeviceFrameLoop();
      this.dispatchEvent('blur', { session: this });
    };
    device.addEventListener('@@webxr-polyfill/vr-present-start', this[PRIVATE].onPresentationStart);

    this[PRIVATE].onSelectStart = evt => {
      // Ignore if this event is not for this session.
      if (evt.sessionId !== this[PRIVATE].id) {
        return;
      }

      this[PRIVATE].dispatchInputSourceEvent('selectstart',  evt.inputSource);
    };
    device.addEventListener('@@webxr-polyfill/input-select-start', this[PRIVATE].onSelectStart);

    this[PRIVATE].onSelectEnd = evt => {
      // Ignore if this event is not for this session.
      if (evt.sessionId !== this[PRIVATE].id) {
        return;
      }

      this[PRIVATE].dispatchInputSourceEvent('selectend',  evt.inputSource);

      // Sadly, there's no way to make this a user gesture.
      this[PRIVATE].dispatchInputSourceEvent('select',  evt.inputSource);
    };
    device.addEventListener('@@webxr-polyfill/input-select-end', this[PRIVATE].onSelectEnd);

    this[PRIVATE].onSqueezeStart = evt => {
      // Ignore if this event is not for this session.
      if (evt.sessionId !== this[PRIVATE].id) {
        return;
      }

      this[PRIVATE].dispatchInputSourceEvent('squeezestart',  evt.inputSource);
    };
    device.addEventListener('@@webxr-polyfill/input-squeeze-start', this[PRIVATE].onSqueezeStart);

    this[PRIVATE].onSqueezeEnd = evt => {
      // Ignore if this event is not for this session.
      if (evt.sessionId !== this[PRIVATE].id) {
        return;
      }

      this[PRIVATE].dispatchInputSourceEvent('squeezeend',  evt.inputSource);

      // Following the same way as select event
      this[PRIVATE].dispatchInputSourceEvent('squeeze',  evt.inputSource);
    };
    device.addEventListener('@@webxr-polyfill/input-squeeze-end', this[PRIVATE].onSqueezeEnd);

    this[PRIVATE].dispatchInputSourceEvent = (type, inputSource) => {
      const frame = new XRFrame(device, this, this[PRIVATE].id);
      const event = new XRInputSourceEvent(type, { frame, inputSource });
      frame[XRFRAME_PRIVATE].active = true;
      this.dispatchEvent(type, event);
      frame[XRFRAME_PRIVATE].active = false;
    };

    // Start the frame loop
    this[PRIVATE].startDeviceFrameLoop();

    this.onblur = undefined;
    this.onfocus = undefined;
    this.onresetpose = undefined;
    this.onend = undefined;
    this.onselect = undefined;
    this.onselectstart = undefined;
    this.onselectend = undefined;
  }

  get visibilityState(): XRVisibilityState {
    return this.#visibilityState;
  }

  get frameRate(): number | null {
    return this.#frameRate;
  }

  get supportedFrameRates(): Readonly<Float32Array> | null {

  }

  get renderState(): XRRenderState {
    return this.#activeRenderState; 
  }

  get inputSources(): XRInputSourceArray {
    return this.#device.getInputSources();
  }

  get enabledFeatures(): ReadonlyArray<string> {
    return this.#enabledFeatures;
  }

  get isSystemKeyboardSupported(): boolean {

  }

  /**
   * Queues an update to the active render state to be applied on the next
   * frame. Unset fields of newState will not be changed.
   * 
   * @param {XRRenderStateInit?} newState 
   */
  updateRenderState(newState: XRRenderStateInit) {
    if (this.#ended) {
      const message = "Can't call updateRenderState on an XRSession " +
                      "that has already ended.";
      throw new Error(message);
    }

    if (newState.baseLayer && (newState.baseLayer._session !== this)) {
      const message = "Called updateRenderState with a base layer that was " +
                      "created by a different session.";
      throw new Error(message);
    }

    const fovSet = (newState.inlineVerticalFieldOfView !== null) &&
                    (newState.inlineVerticalFieldOfView !== undefined);

    if (fovSet) {
      if (this.#immersive) {
        const message = "inlineVerticalFieldOfView must not be set for an " +
                        "XRRenderState passed to updateRenderState for an " +
                        "immersive session.";
        throw new Error(message);
      } else {
        // Clamp the inline FoV to a sane range.
        newState.inlineVerticalFieldOfView = Math.min(
          3.13, Math.max(0.01, newState.inlineVerticalFieldOfView));
      }
    }

    if (this.#pendingRenderState === null) {
      const activeRenderState = this.#activeRenderState;
      this.#pendingRenderState = {
        depthNear: activeRenderState.depthNear,
        depthFar: activeRenderState.depthFar,
        inlineVerticalFieldOfView: activeRenderState.inlineVerticalFieldOfView,
        baseLayer: activeRenderState.baseLayer
      };
    }
    Object.assign(this.#pendingRenderState, newState);
  }


  async updateTargetFrameRate(rate: number): Promise<void> {

  }
  
  async requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace> {
    if (this.#ended) {
      return;
    }

    if (!(type in XRReferenceSpaceType)) {
      throw new TypeError(`XRReferenceSpaceType must be one of ${XRReferenceSpaceType}`);
    }

    if (!this[PRIVATE].device.doesSessionSupportReferenceSpace(this[PRIVATE].id, type)) {
      throw new DOMException(`The ${type} reference space is not supported by this session.`, 'NotSupportedError');
    }

    if (type === 'viewer') {
      return this[PRIVATE].viewerSpace;
    }

    // Request a transform from the device given the values. If returning a
    // transform (probably "local-floor" or "bounded-floor"), use it, and if
    // undefined, XRReferenceSpace will use a default transform. This call can
    // throw, rejecting the promise, indicating the device does not support that
    // frame of reference.
    let transform = await this[PRIVATE].device.requestFrameOfReferenceTransform(type);

    // TODO: 'bounded-floor' is only blocked because we currently don't report
    // the bounds geometry correctly.
    if (type === 'bounded-floor') {
      if (!transform) {
        // 'bounded-floor' spaces must have a transform supplied by the device.
        throw new DOMException(`${type} XRReferenceSpace not supported by this device.`, 'NotSupportedError');
      }
      
      let bounds = this[PRIVATE].device.requestStageBounds();
      if (!bounds) {
        // 'bounded-floor' spaces must have bounds geometry.
        throw new DOMException(`${type} XRReferenceSpace not supported by this device.`, 'NotSupportedError');
        
      }
      // TODO: Create an XRBoundedReferenceSpace with the correct boundaries.
      throw new DOMException(`The WebXR polyfill does not support the ${type} reference space yet.`, 'NotSupportedError');
    }

    return new XRReferenceSpace(type, transform);
  }


  /**
   * @param {Function} callback
   * @return {number}
   */
  requestAnimationFrame(callback: XRFrameRequestCallback): void {
    if (this[PRIVATE].ended) {
      return;
    }

    // Add callback to the queue and return its handle
    const handle = ++this[PRIVATE].frameHandle;
    this[PRIVATE].frameCallbacks.push({
      handle,
      callback,
      cancelled: false
    });
    return handle;
  }

  /**
   * @param {number} handle
   */
  cancelAnimationFrame(handle: number) : void {
    // Remove the callback with that handle from the queue
    let callbacks = this[PRIVATE].frameCallbacks;
    let index = callbacks.findIndex(d => d && d.handle === handle);
    if (index > -1) {
      callbacks[index].cancelled = true;
      callbacks.splice(index, 1);
    }
    // If cancelAnimationFrame is called from within a frame callback, also check
    // the remaining callbacks for the current frame:
    callbacks = this[PRIVATE].currentFrameCallbacks;
    if (callbacks) {
      index = callbacks.findIndex(d => d && d.handle === handle);
      if (index > -1) {
        callbacks[index].cancelled = true;
        // Rely on cancelled flag only; don't mutate this array while it's being iterated
      }
    }
  }

  /**
   * @return {Promise<void>}
   */
    async end(): Promise<void> {
      if (this.#ended) {
        return;
      }
  
      // If this is an immersive session, trigger the platform to end, which
      // will call the `onPresentationEnd` handler, wrapping this up.
      if (this.#immersive) {
        this.#ended = true;
        this.#device.removeEventListener('@@webxr-polyfill/vr-present-start',
                                                   this.onpresentationstart);
        this.#device.removeEventListener('@@webxr-polyfill/vr-present-end',
                                                   this.onpresentationend);
        this.#device.removeEventListener('@@webxr-polyfill/input-select-start',
                                                   this.onselectstart);
        this.#device.removeEventListener('@@webxr-polyfill/input-select-end',
                                                   this.onselectend);
  
        this.dispatchEvent('end', new XRSessionEvent('end', { session: this }));
      }
  
      this.#stopDeviceFrameLoop();
      return this.#device.endSession(this.#id);
    }
    

  /**
   * @see https://immersive-web.github.io/webxr-ar-module/#xrsessionmode-enum
   */
  get environmentBlendMode(): XREnvironmentBlendMode {
    return this.#device.environmentBlendMode ?? 'opaque';
  }

  /**
   * @see https://immersive-web.github.io/webxr-ar-module/#xrinteractionmode-enum
   */
  get interactionMode(): XRInteractionMode {
    return this.#device.interactionMode ?? 'world-space';
  }

  /**
   * @see https://immersive-web.github.io/lighting-estimation/#xrsession-interface
   */
  async requestLightProbe(options: XRLightProbeInit = {}): Promise<XRLightProbe> {

  }

  get preferredReflectionFormat(): XRReflectionFormat {
    
  }

  /**
   * Compares the inputSources with the ones in the previous frame.
   * Fires imputsourceschange event if any added or removed
   * inputSource is found.
   */
  _checkInputSourcesChange() {
    const added = [];
    const removed = [];
    const newInputSources = this.inputSources;
    const oldInputSources = this[PRIVATE].currentInputSources;

    for (const newInputSource of newInputSources) {
      if (!oldInputSources.includes(newInputSource)) {
        added.push(newInputSource);
      }
    }

    for (const oldInputSource of oldInputSources) {
      if (!newInputSources.includes(oldInputSource)) {
        removed.push(oldInputSource);
      }
    }

    if (added.length > 0 || removed.length > 0) {
      this.dispatchEvent('inputsourceschange', new XRInputSourcesChangeEvent('inputsourceschange', {
        session: this,
        added: added,
        removed: removed
      }));
    }

    this.#currentInputSources.length = 0;
    for (const newInputSource of newInputSources) {
      this.#currentInputSources.push(newInputSource);
    }
  }

  get persistentAnchors(): ReadonlyArray<string> {

  }

  async restorePersistentAnchor(string uuid): Promise<XRAnchor> {

  }

  async deletePersistentAnchor(string uuid): Promise<void> {

  }

  /**
   * @see https://immersive-web.github.io/real-world-geometry/plane-detection.html#obtaining-planes
   */
  async initiateRoomCapture(): Promise<void> {

  }

}

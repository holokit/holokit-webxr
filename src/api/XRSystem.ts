// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import { XRReferenceSpaceType } from './XRReferenceSpace';
import XRDevice from './XRDevice';
import XRSession, { XRSessionMode, XRSessionInit } from './XRSession';

interface XRSystemDeviceChangeEvent extends Event {
  type: 'devicechange';
}

interface XRSystemDeviceChangeEventHandler {
  (event: XRSystemDeviceChangeEvent): any;
}

interface XRSystemEventMap {
  devicechange: XRSystemDeviceChangeEvent;
}

const DEFAULT_SESSION_OPTIONS: {[k: string]: XRSessionInit} = {
  'inline': {
    requiredFeatures: ['viewer'],
    optionalFeatures: [],
  },
  'immersive-vr': {
    requiredFeatures: ['viewer', 'local'],
    optionalFeatures: [],
  },
  'immersive-ar': {
    requiredFeatures: ['viewer', 'local'],
    optionalFeatures: [],
  }
};

const POLYFILL_REQUEST_SESSION_ERROR = 
`Polyfill Error: Must call navigator.xr.isSessionSupported() with any XRSessionMode
or navigator.xr.requestSession('inline') prior to requesting an immersive
session. This is a limitation specific to the WebXR Polyfill and does not apply
to native implementations of the API.`


/**
 * @see https://immersive-web.github.io/webxr/#xrsystem-interface
 */
export default class XRSystem extends EventTarget {
  #device: XRDevice | null;
  #devicePromise: Promise<XRDevice>;
  #immersiveSession: XRSession | null;
  #inlineSessions: Set<XRSession>;

  /**
   * Receives a promise of an XRDevice, so that the polyfill
   * can pass in some initial checks to asynchronously provide XRDevices
   * if content immediately requests `requestDevice()`.
   *
   * @param {Promise<XRDevice>} devicePromise
   */
  constructor(devicePromise: Promise<XRDevice>) {
    super();
    this.#device = null;
    this.#devicePromise = devicePromise;
    this.#immersiveSession = null;
    this.#inlineSessions = new Set();

    devicePromise.then((device) => { 
      this.#device = device; 
    });
  }

  async isSessionSupported(mode: XRSessionMode): Promise<boolean> {
    // Always ensure that we wait for the device promise to resolve.
    if (!this.#device) {
      await this.#devicePromise;
    }

    // 'inline' is always guaranteed to be supported.
    if (mode != 'inline') {
      return Promise.resolve(this.#device?.isSessionSupported(mode) ?? false);
    } 

    return Promise.resolve(true);
  }

  async requestSession(mode: XRSessionMode, options: XRSessionInit = {}): Promise<XRSession> {
    // If the device hasn't resolved yet, wait for it and try again.
    if (!this.#device) {
      if (mode != 'inline') {
        // Because requesting immersive modes requires a user gesture, we can't
        // wait for a promise to resolve before making the real session request.
        // For that reason, we'll throw a polyfill-specific error here.
        throw new Error(POLYFILL_REQUEST_SESSION_ERROR);
      } else {
        await this.#devicePromise;
      }
    }

    if (!(mode in XRSessionMode)) {
      throw new TypeError(
          `The provided value '${mode}' is not a valid enum value of type XRSessionMode`);
    }

    // Resolve which of the requested features are supported and reject if a
    // required feature isn't available.
    const defaultOptions = DEFAULT_SESSION_OPTIONS[mode];
    const requiredFeatures = defaultOptions.requiredFeatures!.concat(
      options?.requiredFeatures ?? []);
    const optionalFeatures = defaultOptions.optionalFeatures!.concat(
      options?.requiredFeatures ?? []);
    const enabledFeatures = new Set();

    let requirementsFailed = false;
    for (let feature of requiredFeatures) {
      if (!this.#device?.isFeatureSupported(feature)) {
        console.error(`The required feature '${feature}' is not supported`);
        requirementsFailed = true;
      } else {
        enabledFeatures.add(feature);
      }
    }

    if (requirementsFailed) {
      throw new DOMException('Session does not support some required features', 'NotSupportedError');
    }

    for (let feature of optionalFeatures) {
      if (!this.#device?.isFeatureSupported(feature)) {
        console.log(`The optional feature '${feature}' is not supported`);
      } else {
        enabledFeatures.add(feature);
      }
    }

    // Call device's requestSession, which does some initialization (1.1 
    // fallback calls `vrDisplay.requestPresent()` for example). Could throw 
    // due to missing user gesture.
    const sessionId = await this.#device?.requestSession(mode, enabledFeatures);
    const session = new XRSession(this.#device, mode, sessionId);

    if (mode == 'inline') {
      this.#inlineSessions.add(session);
    } else {
      this.#immersiveSession = session;
    }

    const onSessionEnd = () => {
      if (mode == 'inline') {
        this.#inlineSessions.delete(session);
      } else {
        this.#immersiveSession = null;
      }
      session.removeEventListener('end', onSessionEnd);
    };
    session.addEventListener('end', onSessionEnd);

    return session;
  }

  ondevicechange: XRSystemDeviceChangeEventHandler | null = null;
}

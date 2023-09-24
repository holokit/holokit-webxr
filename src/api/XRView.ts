// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import { mat4 } from 'gl-matrix';

import XRViewport, { XRViewportInit } from './XRViewport';
import XRRigidTransform from './XRRigidTransform';
import XRDevice from './XRDevice';
import XRCamera from './XRCamera';

export enum XREye { 
  'left' = 'left',
  'right' = 'right', 
  'none' = 'none'
}

/**
 * @see https://immersive-web.github.io/webxr/#xrview-interface
 */
export default class XRView {
  #device: XRDevice;
  #eye: XREye;
  #viewport: XRViewport;
  #temp: XRViewportInit;
  #sessionId: number;
  #transform: XRRigidTransform;
  #recommendedViewportScale: number | null;

  /**
   * @param {XRDevice} device
   * @param {XREye} eye
   * @param {number} sessionId
   */
  constructor(device: XRDevice, transform: XRRigidTransform, eye: XREye, sessionId: number) {
    if (!(eye in XREye)) {
      throw new Error(`XREye must be one of: ${XREye}`);
    }

    // Create a shared object that can be updated by other code
    // that can update XRViewport values to adhere to API.
    // Ugly but it works.
    const temp = Object.create(null);
    const viewport = new XRViewport(temp);

    this.#device = device;
    this.#eye = eye;
    this.#viewport = viewport;
    this.#temp = temp;
    this.#sessionId = sessionId;
    this.#transform = transform;
    this.#recommendedViewportScale = recommendedViewportScale;
  }

  get eye(): XREye { 
    return this.#eye; 
  }

  get projectionMatrix(): Float32Array { 
    return this.#device.getProjectionMatrix(this.#eye); 
  }

  get transform(): XRRigidTransform { 
    return this.#transform; 
  }

  get recommendedViewportScale(): number | null {
    return this.#recommendedViewportScale;
  }

  requestViewportScale(scale: number | null): void {
    throw new Error('Not implemented');
  }

  /**
   * NON-STANDARD
   *
   * `getViewport` is now exposed via XRWebGLLayer instead of XRView.
   * XRWebGLLayer delegates all the actual work to this function.
   *
   * @param {XRWebGLLayer} layer
   * @return {XRViewport?}
   */
  _getViewport(layer: XRWebGLLayer): XRViewport | undefined {
    if (this.#device.getViewport(this.#sessionId,
                                  this.#eye,
                                  layer,
                                  this.#temp)) {
      return this.#viewport;
    }
    return undefined;
  }

  /**
   * @see https://immersive-web.github.io/raw-camera-access/
   */
  get camera(): XRCamera | null {
    return this.#device.getCamera();
  }

}

// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT


import XRSession from './XRSession';
import XRView from './XRView';
import XRViewport from './XRViewport';
import XRLayer from './XRLayer';

import {
  POLYFILLED_XR_COMPATIBLE,
  XR_COMPATIBLE,
} from '../constants';

/**
 * @see https://immersive-web.github.io/webxr/#xrwebgllayer-interface
 */

export type XRWebGLRenderingContext = WebGLRenderingContext | WebGL2RenderingContext

/**
 * The base class for XRWebGLLayer and other layer types introduced by future extensions.
 * ref: https://immersive-web.github.io/webxr/#xrlayer-interface
 */


export interface XRWebGLLayerInit {
	antialias?: boolean;
	depth?: boolean;
	stencil?: boolean;
	alpha?: boolean;
	ignoreDepthValues?: boolean;
	framebufferScaleFactor?: number;
}

/**
 * A layer which provides a WebGL framebuffer to render into, enabling hardware accelerated
 * rendering of 3D graphics to be presented on the XR device. *
 * ref: https://immersive-web.github.io/webxr/#xrwebgllayer-interface
 */
export default class XRWebGLLayer extends XRLayer {
  #context: XRWebGLRenderingContext;
  #config: XRWebGLLayerInit;
  #framebuffer: WebGLFramebuffer;
  #session: XRSession;

  constructor(session: XRSession, context: XRWebGLRenderingContext, layerInit: XRWebGLLayerInit = {}) {
    super();
    const config = Object.assign({}, XRWebGLLayerInit, layerInit);

    if (!(session instanceof XRSession)) {
      throw new Error('session must be a XRSession');
    }

    if (session.ended) {
      throw new Error(`InvalidStateError`);
    }

    // Since we're polyfilling, we're probably polyfilling
    // the compatible XR device bit as well. It'd be
    // unusual for this bit to not be polyfilled.
    if (context[POLYFILLED_XR_COMPATIBLE]) {
      if (context[XR_COMPATIBLE] !== true) {
        throw new Error(`InvalidStateError`);
      }
    }

    // Use the default framebuffer
    this.#context = context;
    this.#config = config;
    this.#framebuffer = context.getParameter(context.FRAMEBUFFER_BINDING);
    this.#session = session; 
  }

  /**
   * @return {WebGLRenderingContext}
   */
  get context() { 
    return this.#context; 
  }

  /**
   * @return {boolean}
   */
  get antialias(): boolean { 
    return this.#config.antialias; 
  }

  /**
   * The polyfill will always ignore depth values.
   *
   * @return {boolean}
   */
  get ignoreDepthValues(): boolean { 
    return true; 
  }

  /**
   * @return {WebGLFramebuffer}
   */
  get framebuffer(): WebGLFramebuffer { 
    return this.#framebuffer; 
  }

  /**
   * @return {number}
   */
  get framebufferWidth(): number { 
    return this.#context.drawingBufferWidth; 
  }

  /**
   * @return {number}
   */
  get framebufferHeight(): number { 
    return this.#context.drawingBufferHeight; 
  }

  /**
   * @return {XRSession}
   */
  get _session(): XRSession { 
    return this.#session; 
  }

  /**
   * @param {XRView} view
   * @return {XRViewport?}
   */
  getViewport(view: XRView): XRViewport | null {
    return view._getViewport(this);
  }

  /**
   * Gets the scale factor to be requested if you want to match the device
   * resolution at the center of the user's vision. The polyfill will always
   * report 1.0.
   * 
   * @param session 
   */
  static getNativeFramebufferScaleFactor(session: XRSession): number {
    if (!session) {
      throw new TypeError('getNativeFramebufferScaleFactor must be passed a session.')
    }

    if (session.ended) { 
      return 0.0; 
    }

    return 1.0;
  }
}

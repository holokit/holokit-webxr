// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRWebGLLayer from './XRWebGLLayer';
import XRLayer from './XRLayer';

/**
 * @see https://immersive-web.github.io/webxr/#xrrenderstate-interface
 */
export interface XRRenderStateInit {
  depthNear?: number,
  depthFar?: number,
  inlineVerticalFieldOfView?: number,
  baseLayer?: XRWebGLLayer,
  layers?: XRLayer[]
}

export const XRRenderStateDefaultInit: XRRenderStateInit = Object.freeze({
  depthNear: 0.1,
  depthFar: 1000.0,
  inlineVerticalFieldOfView: null,
  baseLayer: null,
  layers: []
});


export default class XRRenderState {
  #config: XRRenderStateInit;

  /**
   * @param {Object?} stateInit
   */
  constructor(stateInit: XRRenderStateInit = {}) {
    const config = Object.assign({}, XRRenderStateDefaultInit, stateInit);
    this.#config = config;
  }

  get depthNear(): number { 
    return this.#config.depthNear; 
  }

  get depthFar(): number { 
    return this.#config.depthFar; 
  }

  get inlineVerticalFieldOfView(): number | null { 
    return this.#config.inlineVerticalFieldOfView; 
  }

  get baseLayer(): XRWebGLLayer { 
    return this.#config.baseLayer; 
  }
}

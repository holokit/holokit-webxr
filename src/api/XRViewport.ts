// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

/**
 * @see https://immersive-web.github.io/webxr/#xrviewport-interface
 */
export interface XRViewportInit {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class XRViewport {

  #target: XRViewportInit;

  /**
   * Takes a proxy object that this viewport's XRView
   * updates and we serve here to match API.
   *
   * @param {Object} target
   */
  constructor(target: XRViewportInit) {
    this.#target = target;
  }

  get x(): number { 
    return this.#target.x; 
  }

  get y(): number { 
    return this.#target.y; 
  }

  get width(): number { 
    return this.#target.width; 
  }

  get height(): number { 
    return this.#target.height; 
  }
}

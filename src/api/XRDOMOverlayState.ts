// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

/**
 * @see https://immersive-web.github.io/dom-overlays/
 */
export interface XRDOMOverlayInit {
  root: Element;
}

export enum XRDOMOverlayType {
  'screen' = 'screen',
  'floating' = 'floating',
  'head-locked' = 'head-locked'
}

export class XRDOMOverlayState {
  #type: XRDOMOverlayType;

  constructor(type: XRDOMOverlayType) {
    this.#type = type;
  }

  get type(): XRDOMOverlayType {
    return this.#type;
  }
}

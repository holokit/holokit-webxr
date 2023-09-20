// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRSpace from './XRSpace';
import XRSession from './XRSession';
import XRFrame from './XRFrame';

/**
 * @see https://immersive-web.github.io/real-world-geometry/plane-detection.html#plane-orientation
 * @enum {string}
 */
export enum XRPlaneOrientation {
  'horizontal' = 'horizontal',
  'vertical' = 'vertical'
}

/**
 * @see https://immersive-web.github.io/real-world-geometry/plane-detection.html#plane
 */
export default class XRPlane {
  #planeSpace: XRSpace;
  #polygon: ReadonlyArray<DOMPointReadOnly>;
  #orientation: XRPlaneOrientation | null;
  #lastChangedTime: DOMHighResTimeStamp;

  constructor(planeSpace: XRSpace, polygon: ReadonlyArray<DOMPointReadOnly>, orientation: XRPlaneOrientation | null = null) {
    this.#planeSpace = planeSpace;
    this.#polygon = polygon;
    //Object.freeze(this.#polygon);
    this.#orientation = orientation;
    this.#lastChangedTime = performance.now();
  }

  get planeSpace(): XRSpace {
    return this.#planeSpace;
  }

  get polygon(): ReadonlyArray<DOMPointReadOnly> {
    return this.#polygon;
  }

  get orientation(): XRPlaneOrientation | null {
    return this.#orientation;
  }

  get lastChangedTime(): DOMHighResTimeStamp {
    return this.#lastChangedTime;
  }
}

export type XRPlaneSet = ReadonlySet<XRPlane>;

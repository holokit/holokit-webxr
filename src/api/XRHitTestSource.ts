// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRSession from './XRSession';
import XRRay from './XRRay';
import XRSpace from './XRSpace';

/**
 * @see https://immersive-web.github.io/hit-test/#hit-test-source-interface
 */
export default class XRHitTestSource {
  #session: XRSession;
  #space: XRSpace;
  #offsetRay: XRRay;
  #active: boolean;

  constructor(session: XRSession, options) {
    // @TODO: Support options.entityTypes and options.offsetRay
    if (options.entityTypes && options.entityTypes.length > 0) {
      throw new Error('XRHitTestSource does not support entityTypes option yet.');
    }
    this.#session = #session;
    this.#space = options.space;
    this.#offsetRay = options.offsetRay || new XRRay();
    this.#active = true;
  }

  cancel() {
    // @TODO: Throw InvalidStateError if active is already false
    this.#active = false;
  }

  get _space() {
    return this.#space;
  }

  get _session() {
    return this.#session;
  }

  get _offsetRay() {
    return this.#offsetRay;
  }

  get _active() {
    return this.#active;
  }
}

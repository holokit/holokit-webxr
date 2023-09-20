// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRRigidTransform from './XRRigidTransform';
import XRReferenceSpace, { XRReferenceSpaceType } from './XRReferenceSpace'

/**
 * @see https://immersive-web.github.io/webxr/#xrboundedreferencespace-interface
 */
export default class XRBoundedReferenceSpace extends XRReferenceSpace {
  #boundsGeometry: ReadonlyArray<DOMPointReadOnly>;

  constructor(type: XRReferenceSpaceType, transform: XRRigidTransform, boundsGeometry: ReadonlyArray<DOMPointReadOnly>) {
    super(type, transform);
    this.#boundsGeometry = boundsGeometry;
  }

  get boundsGeometry(): ReadonlyArray<DOMPointReadOnly> {
    return this.#boundsGeometry;
  }
}

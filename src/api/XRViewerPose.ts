// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRRigidTransform from './XRRigidTransform';
import XRPose from './XRPose';
import XRView from './XRView';

/**
 * @see https://immersive-web.github.io/webxr/#xrpose-interface
 */
export default class XRViewerPose extends XRPose {
  #views: ReadonlyArray<XRView>;

  constructor(transform: XRRigidTransform, views: ReadonlyArray<XRView>, emulatedPosition: boolean = false) {
    super(transform, emulatedPosition);
    this.#views = views;
  }

  get views(): ReadonlyArray<XRView> {
    return this.#views;
  }
}

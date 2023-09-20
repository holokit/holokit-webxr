// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRRigidTransform from './XRRigidTransform';
import XRPose from './XRPose';

/**
 * @see https://immersive-web.github.io/webxr-hand-input/#xrjointpose-interface
 */
export default class XRJointPose extends XRPose {
	#radius: number;

	constructor(transform: XRRigidTransform, radius: number) {
		super(transform);
		this.#radius = radius;
	}

	get radius() {
		return this.#radius;
	}
}

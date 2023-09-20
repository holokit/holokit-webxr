// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRSpace from './XRSpace';
import XRHand, { XRHandJoint } from './XRHand';

/**
 * @see https://immersive-web.github.io/webxr-hand-input/#xrjointspace-interface
 */
export default class XRJointSpace extends XRSpace {
	#jointName: XRHandJoint;
	#hand: XRHand;

	constructor(jointName: XRHandJoint, hand: XRHand) {
		super();
		this.#jointName = jointName;
		this.#hand = hand;
	}

	get _hand(): XRHand {
		return this.#hand;
	}

	get jointName(): XRHandJoint {
		return this.#jointName;
	}
}

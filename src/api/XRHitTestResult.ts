// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRAnchor from './XRAnchor';
import XRFrame from './XRFrame';
import XRSpace from './XRSpace';
import XRRigidTransform from './XRRigidTransform';
import { mat4 } from 'gl-matrix';

/**
 * @see https://immersive-web.github.io/hit-test/#xr-hit-test-result-interface
 */
export default class XRHitTestResult implements XRHitTestResult {
	#frame: XRFrame;
	#transform: XRRigidTransform;

	constructor(frame: XRFrame, transform: XRRigidTransform) {
		this.#frame = frame;
		this.#transform = transform;
	}

	getPose(baseSpace: XRSpace): XRPose? {
		const space = new XRSpace();
		space._baseMatrix = mat4.copy(
			mat4.create(),
			this.#transform.matrix,
		);
		return this.#frame.getPose(space, baseSpace);
	}

	async _createAnchor(): XRAnchor {
		const anchorSpace = new XRSpace();
		anchorSpace._baseMatrix = mat4.copy(
			mat4.create(),
			this._transform.matrix,
		);
		const session = this.#frame.#session;
		const anchor = new XRAnchor(session, anchorSpace);
		session.addTrackedAnchor(anchor);
		return anchor;
	}
}

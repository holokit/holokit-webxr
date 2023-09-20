// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRInputSource from './XRInputSource'
import XRHitTestResult from './XRHitTestResult'
import XRFrame from './XRFrame'

/**
 * @see https://immersive-web.github.io/hit-test/#xr-transient-input-hit-test-result-interface
 */
export default class XRTransientInputHitTestResult {
	#frame: XRFrame;
	#inputSource: XRInputSource;
	#results: ReadonlyArray<XRHitTestResult>;

	constructor(frame: XRFrame, results: ReadonlyArray<XRHitTestResult>, inputSource: XRInputSource) {
		this.#frame = frame;
		this.#inputSource = inputSource;
		this.#results = results;
	}

	get inputSource(): XRInputSource {
		return this.#inputSource;
	}

	get results(): ReadonlyArray<XRHitTestResult> {
		return this.#results;
	}
}

// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT


export default class XRLightEstimate extends EventTarget {
	constructor(options = {}){
		this[PRIVATE] = {
			indirectIrradiance: options.indirectIrradiance
		};
	}

	get indirectIrradiance() {
		return this.#indirectIrradiance;
	}

	get primaryLightDirection(): DOMPointReadOnly {
		return this.#primaryLightDirection;
	}

	get primaryLightIntensity(): DOMPointReadOnly {
		throw new Error('Not implemented');
	}

	get sphericalHarmonicsCoefficients(): Float32Array {
		throw new Error('Not implemented');
	}
}
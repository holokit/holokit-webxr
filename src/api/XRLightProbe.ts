// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

/**
 * @see https://immersive-web.github.io/lighting-estimation/#xrlightprobe-interface
 */

XRLightProbeInit {
  XRReflectionFormat reflectionFormat = "srgba8";
};

interface XRSession {
  preferredReflectionFormat: XRPreferredReflectionFormat
  requestLightProbe: (options: { reflectionFormat?: XRPreferredReflectionFormat }) => Promise<XRLightProbe>
}
interface XRFrame {
  getLightEstimate?: (probe: XRLightProbe) => XRLightEstimate
}
interface XRWebGLBinding {
  getReflectionCubeMap?: (probe: XRLightProbe) => WebGLTexture
}
interface XRLightProbe {
  probeSpace: XRSpace
}

export enum XRReflectionFormat {
  "srgba8",
  "rgba16f",
}


interface XRLightProbe {
    readonly probeSpace: XRSpace;
    onreflectionchange: EventHandler;
}

export default class XRLightProbe extends EventTarget {
	constructor(options = {}){
		this[PRIVATE] = {
		};
	}
}
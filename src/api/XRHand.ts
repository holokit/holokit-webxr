// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRInputSource from './XRInputSource';
import XRJointSpace from './XRJointSpace';

export enum XRHandJoint {
  "wrist" = "wrist",

  "thumb-metacarpal" = "thumb-metacarpal",
  "thumb-phalanx-proximal" = "thumb-phalanx-proximal",
  "thumb-phalanx-distal" = "thumb-phalanx-distal",
  "thumb-tip" = "thumb-tip",

  "index-finger-metacarpal" = "index-finger-metacarpal",
  "index-finger-phalanx-proximal" = "index-finger-phalanx-proximal",
  "index-finger-phalanx-intermediate" = "index-finger-phalanx-intermediate",
  "index-finger-phalanx-distal" = "index-finger-phalanx-distal",
  "index-finger-tip" = "index-finger-tip",

  "middle-finger-metacarpal" = "middle-finger-metacarpal",
  "middle-finger-phalanx-proximal" = "middle-finger-phalanx-proximal",
  "middle-finger-phalanx-intermediate" = "middle-finger-phalanx-intermediate",
  "middle-finger-phalanx-distal" = "middle-finger-phalanx-distal",
  "middle-finger-tip" = "middle-finger-tip",

  "ring-finger-metacarpal" = "ring-finger-metacarpal",
  "ring-finger-phalanx-proximal" = "ring-finger-phalanx-proximal",
  "ring-finger-phalanx-intermediate" = "ring-finger-phalanx-intermediate",
  "ring-finger-phalanx-distal" = "ring-finger-phalanx-distal",
  "ring-finger-tip" = "ring-finger-tip",

  "pinky-finger-metacarpal" = "pinky-finger-metacarpal",
  "pinky-finger-phalanx-proximal" = "pinky-finger-phalanx-proximal",
  "pinky-finger-phalanx-intermediate" = "pinky-finger-phalanx-intermediate",
  "pinky-finger-phalanx-distal" = "pinky-finger-phalanx-distal",
  "pinky-finger-tip" = "pinky-finger-tip"
}

export default class XRHand extends Map {
	#inputSource: XRInputSource;

	constructor(inputSource: XRInputSource) {
		super();
		this.#inputSource = inputSource;

		Object.values(XRHandJoint).forEach((jointName) => {
			this.set(jointName, new XRJointSpace(jointName, this));
		});
	}
}

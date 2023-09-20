// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import GamepadXRInputSource from './XRGamepadInput';
import XRSpace from './XRSpace';

export enum XRHandedness {
  'none' = 'none',
  'left' = 'left',
  'right' = 'right'
}

export enum XRTargetRayMode {
  'gaze' = 'gaze',
  'tracked-pointer' = 'tracked-pointer',
  'screen' = 'screen'
}

/**
 * @see https://immersive-web.github.io/webxr/#xrinputsource-interface
 */
export default class XRInputSource {
  #impl: GamepadXRInputSource;
  #gripSpace: XRSpace;
  #targetRaySpace: XRSpace;

  constructor(impl: GamepadXRInputSource) {
    this.#impl = impl;
    this.#gripSpace = new XRSpace("grip", this);
    this.#targetRaySpace = new XRSpace("target-ray", this);
  }

  get handedness(): XRHandedness { 
    return this.#impl.handedness; 
  }

  get targetRayMode(): XRTargetRayMode { 
    return this.#impl.targetRayMode; 
  }

  get gripSpace(): XRSpace | null {
    let mode = this.#impl.targetRayMode;
    if (mode === "gaze" || mode === "screen") {
      // grip space must be null for non-trackable input sources
      return null;
    }
    return this.#gripSpace;
  }

  get targetRaySpace(): XRSpace { 
    return this.#targetRaySpace; 
  }

  get profiles(): Array<string> { 
    return this.#impl.profiles; 
  }

  /**
   * @see https://immersive-web.github.io/webxr-gamepads-module/#xrinputsource-interface
   */
  get gamepad(): Gamepad | null { 
    return this.#impl.gamepad; 
  }

  /**
   * @see https://immersive-web.github.io/webxr-hand-input/#xrinputsource-interface
   */
  get hand(): XRHand | null {
    return this.#impl.hand;
  }
}

export type XRInputSourceArray = Array<XRInputSource>;

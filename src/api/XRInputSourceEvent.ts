// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRFrame from './XRFrame';
import XRInputSource from './XRInputSource';

/**
 * @see https://immersive-web.github.io/webxr/#xrinputsourceevent-interface
 */

export interface XRInputSourceEventInit extends EventInit {
  frame: XRFrame;
  inputSource: XRInputSource;
}

export default class XRInputSourceEvent extends Event {
  #frame: XRFrame;
  #inputSource: XRInputSource;

  constructor(type: string, eventInitDict: XRInputSourceEventInit) {
    super(type, eventInitDict);
    this.#frame = eventInitDict.frame;
    this.#inputSource = eventInitDict.inputSource;
    // safari bug:  super() seems to return object of type Event, with Event as prototype
    //TODO:
    //Object.setPrototypeOf(this, XRInputSourceEvent.prototype);
  }

  get frame(): XRFrame { 
    return this.#frame; 
  }

  get inputSource(): XRInputSource { 
    return this.#inputSource; 
  }
}
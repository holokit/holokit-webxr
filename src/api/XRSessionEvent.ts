// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRSession from "./XRSession";

/**
 * @see https://immersive-web.github.io/webxr/#xrsessionevent
 */
export interface XRSessionEventInit extends EventInit {
  session: XRSession;
}

export enum XRSessionEventType {
  'end' = 'end',
  'visibilitychange' = 'visibilitychange',
  'frameratechange' = 'frameratechange'
}

export default class XRSessionEvent extends Event {
  #session: XRSession;

  constructor(type: XRSessionEventType, eventInitDict: XRSessionEventInit) {
    super(type, eventInitDict);
    this.#session = eventInitDict.session;

    // safari bug:  super() seems to return object of type Event, with Event as prototype
    //TODO: really?
    //Object.setPrototypeOf(this, XRSessionEvent.prototype);
  }

  get session() { 
    return this.#session; 
  }
}
// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRSession from "./XRSession";
import XRInputSource from "./XRInputSource";

/**
 * @see https://immersive-web.github.io/webxr/#xrinputsourceschangeevent-interface
 */
export interface XRInputSourcesChangeEventInit extends EventInit {
  session: XRSession;
  added: ReadonlyArray<XRInputSource>; 
  removed: ReadonlyArray<XRInputSource>;
}

export default class XRInputSourcesChangeEvent extends Event {
  #session: XRSession;
  #added: ReadonlyArray<XRInputSource>;
  #removed: ReadonlyArray<XRInputSource>;

  constructor(type: string, eventInitDict: XRInputSourcesChangeEventInit) {
    super(type, eventInitDict);
    this.#session = eventInitDict.session;
    this.#added = eventInitDict.added;
    this.#removed = eventInitDict.removed;

    // safari bug:  super() seems to return object of type Event, with Event as prototype
    //TODO: check safari bug
    //Object.setPrototypeOf(this, XRInputSourcesChangeEvent.prototype);
  }

  get session(): XRSession { 
    return this.#session; 
  }

  get added(): ReadonlyArray<XRInputSource> { 
    return this.#added; 
  }

  get removed(): ReadonlyArray<XRInputSource> { 
    return this.#removed; 
  }
}
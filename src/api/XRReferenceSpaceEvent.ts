// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRReferenceSpace from "./XRReferenceSpace";
import XRRigidTransform from "./XRRigidTransform";

/**
 * @see https://immersive-web.github.io/webxr/#xrreferencespaceevent
 */

export interface XRReferenceSpaceEventInit extends EventInit {
  referenceSpace: XRReferenceSpace;
  transform?: XRRigidTransform | null;
}

export default class XRReferenceSpaceEvent extends Event {
  #referenceSpace: XRReferenceSpace;
  #transform: XRRigidTransform | null;

  constructor(type: string, eventInitDict: XRReferenceSpaceEventInit) {
    super(type, eventInitDict);
    this.#referenceSpace = eventInitDict.referenceSpace,
    this.#transform = eventInitDict.transform || null;
    // safari bug:  super() seems to return object of type Event, with Event as prototype
    //TODO: really?
    //Object.setPrototypeOf(this, XRReferenceSpaceEvent.prototype);
  }

  get referenceSpace(): XRReferenceSpace { 
    return this.#referenceSpace; 
  }

  get transform(): XRRigidTransform | null { 
    return this.#transform; 
  }
}
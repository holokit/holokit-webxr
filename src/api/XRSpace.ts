// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRDevice from './XRDevice';
import XRInputSource from './XRInputSource';
import XRRigidTransform from './XRRigidTransform';
import { mat4 } from "gl-matrix";

// Not exposed, for reference only
enum XRSpaceSpecialType {
  "grip" = "grip",
  "target-ray" = "target-ray"
}

export default class XRSpace extends EventTarget {
  #specialType: string | null;
  #inputSource: XRInputSource | null;
  #baseMatrix: Float32Array | null;
  #inverseBaseMatrix: Float32Array | null;
  #lastFrameId: number;

  constructor(specialType: string | null = null, inputSource: XRInputSource | null = null) {
    super();
    this.#specialType = specialType;
    this.#inputSource = inputSource;
    // The transform for the space in the base space, along with it's inverse
    this.#baseMatrix = null;
    this.#inverseBaseMatrix = null;
    this.#lastFrameId = -1;
  }

  /**
   * @return {string?}
   */
  get _specialType(): string | null {
    return this.#specialType;
  }

  /**
   * @return {XRInputSource?}
   */
  get _inputSource(): XRInputSource | null {
    return this.#inputSource;
  }

  /**
   * NON-STANDARD
   * Trigger an update for this space's base pose if necessary
   * @param {XRDevice} device
   * @param {Number} frameId
   */
  _ensurePoseUpdated(device: XRDevice, frameId: number): void {
    if (frameId == this.#lastFrameId) return;
    this.#lastFrameId = frameId;
    this.#onPoseUpdate(device);
  }

  /**
   * NON-STANDARD
   * Called when this space's base pose needs to be updated
   * @param {XRDevice} device
   */
  #onPoseUpdate(device: XRDevice): void {
    if (this.#specialType == 'viewer') {
      this.#baseMatrix = device.getBasePoseMatrix();
    }
  }

  /**
   * NON-STANDARD
   * @param {Float32Array(16)} matrix
   */
  set _baseMatrix(matrix) {
    this.#baseMatrix = matrix;
    this.#inverseBaseMatrix = null;
  }

  /**
   * NON-STANDARD
   * @return {Float32Array(16)}
   */
  get _baseMatrix() {
    if (!this.#baseMatrix) {
      if (this.#inverseBaseMatrix) {
        this.#baseMatrix = new Float32Array(16);
        mat4.invert(this.#baseMatrix, this.#inverseBaseMatrix);
      }
    }
    return this.#baseMatrix;
  }

  /**
   * NON-STANDARD
   * @param {Float32Array(16)} matrix
   */
  set _inverseBaseMatrix(matrix) {
    this.#inverseBaseMatrix = matrix;
    this.#baseMatrix = null;
  }

  /**
   * NON-STANDARD
   * @return {Float32Array(16)}
   */
  get _inverseBaseMatrix() {
    if (!this.#inverseBaseMatrix) {
      if (this.#baseMatrix) {
        this.#inverseBaseMatrix = new Float32Array(16);
        mat4.invert(this.#inverseBaseMatrix, this.#baseMatrix);
      }
    }
    return this.#inverseBaseMatrix;
  }

  /**
   * NON-STANDARD
   * Gets the transform of the given space in this space
   *
   * @param {XRSpace} space
   * @return {XRRigidTransform}
   */
  _getSpaceRelativeTransform(space: XRSpace): XRRigidTransform | null {
    if (!this.#inverseBaseMatrix || !space.#baseMatrix) {
      return null;
    }
    let out = new Float32Array(16);
    mat4.multiply(out, this.#inverseBaseMatrix, space.#baseMatrix);
    return new XRRigidTransform(out);
  }
}

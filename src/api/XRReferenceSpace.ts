// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import { XRRigidTransform } from 'webxr';
import XRSpace from './XRSpace';
import { mat4 } from 'gl-matrix';

const DEFAULT_EMULATION_HEIGHT = 1.6;

export enum XRReferenceSpaceType {
  'viewer' = 'viewer',
  'local' = 'local',
  'local-floor' = 'local-floor',
  'bounded-floor' = 'bounded-floor',
  'unbounded' = 'unbounded'
}

function isFloor(type: XRReferenceSpaceType): boolean {
  return type === 'bounded-floor' || type === 'local-floor';
}

/**
 * @see https://immersive-web.github.io/webxr/#spaces
 */
export default class XRReferenceSpace extends XRSpace {
  /**
   * Optionally takes a `transform` from a device's requestFrameOfReferenceMatrix
   * so device's can provide their own transforms for stage (or if they
   * wanted to override eye-level/head-model).
   *
   * @param {XRReferenceSpaceType} type
   * @param {Float32Array?} transform
   */
  constructor(type: XRReferenceSpaceType, transform: XRRigidTransform | null = null) {
    if (!(type in XRReferenceSpaceType)) {
      throw new Error(`XRReferenceSpaceType must be one of ${XRReferenceSpaceType}`);
    }

    super(type);

    // If stage emulation is disabled, and this is a stage frame of reference,
    // and the XRDevice did not provide a transform, this is an invalid
    // configuration and we shouldn't emulate here. XRSession.requestFrameOfReference
    // should check this as well.
    if (type === 'bounded-floor' && !transform) {
      throw new Error(`XRReferenceSpace cannot use 'bounded-floor' type if the platform does not provide the floor level`);
    }

    // If we're using floor-level reference and no transform, we're emulating.
    // Set emulated height from option or use the default
    if (isFloor(type) && !transform) {
      // Apply an emulated height to the `y` translation
      transform = mat4.identity(new Float32Array(16));
      transform[13] = DEFAULT_EMULATION_HEIGHT;
    }

    this.#inverseBaseMatrix = transform || mat4.identity(new Float32Array(16));
    this.#type = type;
    this.#transform = transform;
    this.#originOffset = mat4.identity(new Float32Array(16));
  }

  /**
   * NON-STANDARD
   * Takes a base pose model matrix and transforms it by the
   * frame of reference.
   *
   * @param {Float32Array} out
   * @param {Float32Array} pose
   */
  _transformBasePoseMatrix(out: Float32Array, pose: Float32Array) {
    mat4.multiply(out, this.#inverseBaseMatrix, pose);
  }

  /**
   * NON-STANDARD
   * 
   * @return {Float32Array}
   */
  _originOffsetMatrix(): Float32Array {
    return this.#originOffset;
  }

  /**
   * transformMatrix = Inv(OriginOffsetMatrix) * transformMatrix
   * @param {Float32Array} transformMatrix 
   */
  _adjustForOriginOffset(transformMatrix: Float32Array) {
    let inverseOriginOffsetMatrix = new Float32Array(16);
    mat4.invert(inverseOriginOffsetMatrix, this.#originOffset);
    mat4.multiply(transformMatrix, inverseOriginOffsetMatrix, transformMatrix);
  }

  /**
   * Gets the transform of the given space in this space
   *
   * @param {XRSpace} space
   * @return {XRRigidTransform}
   */
  _getSpaceRelativeTransform(space: XRSpace): XRRigidTransform {
    let transform = super._getSpaceRelativeTransform(space);
    // TODO: Optimize away double creation of XRRigidTransform
    this._adjustForOriginOffset(transform.matrix)
    return new XRRigidTransform(transform.matrix);
  }

  /**
   * Doesn't update the bound geometry for bounded reference spaces.
   * @param {XRRigidTransform} additionalOffset
   * @return {XRReferenceSpace}
  */
  getOffsetReferenceSpace(additionalOffset: XRRigidTransform): XRReferenceSpace {
    let newSpace = new XRReferenceSpace(
      this.#type,
      this.#transform,
      this.#bounds);

    mat4.multiply(newSpace.#originOffset, this.#originOffset, additionalOffset.matrix);
    return newSpace;
  }
}

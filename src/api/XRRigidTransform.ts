// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import { mat4, quat, vec3 } from "gl-matrix";

/**
 * A transform described by a position and orientation. When interpreting an
 * XRRigidTransform the orientation is always applied prior to the position.
 *
 * @see https://immersive-web.github.io/webxr/#xrrigidtransform-interface
 */

// export interface XRRigidTransform {
//   readonly position: DOMPointReadOnly;
//   readonly orientation: DOMPointReadOnly;
//   readonly matrix: Float32Array;
//   readonly inverse: XRRigidTransform;

//   constructor(position?: DOMPointInit, direction?: DOMPointInit);
// }

export default class XRRigidTransform {
  #matrix: Float32Array;
  #position: DOMPointReadOnly;
  #orientation: DOMPointReadOnly;
  #inverse: XRRigidTransform;

  // constructor(matrix: Float32Array) {
  //   this._matrix = matrix;
  //   let position = vec3.create();
  //   mat4.getTranslation(position, matrix);
  //   this._position = DOMPointReadOnly.fromPoint({
  //       x: position[0],
  //       y: position[1],
  //       z: position[2]
  //   });

  //   let orientation = quat.create();
  //   mat4.getRotation(orientation, matrix);
  //   this._orientation = DOMPointReadOnly.fromPoint({
  //     x: orientation[0],
  //     y: orientation[1],
  //     z: orientation[2],
  //     w: orientation[3]
  //   });
  // }

  constructor(position: DOMPointInit | Float32Array = {}, orientation: DOMPointInit = {}) {
    // this._matrix = null;
    // this._position = null;
    // this._orientation = null;
    // this._inverse = null;
    
    // if (arguments.length === 0) {
    //   this._matrix = mat4.identity(new Float32Array(16));
    // } else if (arguments.length === 1) {
    //   if (arguments[0] instanceof Float32Array) {
    //     this._matrix = arguments[0];
    //   } else {
    //     this._position = this._getPoint(arguments[0]);
    //     this._orientation = DOMPointReadOnly.fromPoint({
    //         x: 0, y: 0, z: 0, w: 1
    //     });
    //   }
    // } else if (arguments.length === 2) {
    //   this._position = this._getPoint(arguments[0]);
    //   this._orientation = this._getPoint(arguments[1]);
    // } else {
    //   throw new Error("Too many arguments!");
    // }

    // if (this._matrix) {
    //     // Decompose matrix into position and orientation.
    //     let position = vec3.create();
    //     mat4.getTranslation(position, this._matrix);
    //     this._position = DOMPointReadOnly.fromPoint({
    //         x: position[0],
    //         y: position[1],
    //         z: position[2]
    //     });

    //     let orientation = quat.create();
    //     mat4.getRotation(orientation, this[PRIVATE].matrix);
    //     this._orientation = DOMPointReadOnly.fromPoint({
    //       x: orientation[0],
    //       y: orientation[1],
    //       z: orientation[2],
    //       w: orientation[3]
    //     });
    // } else {
    //     // Compose matrix from position and orientation.
    //     this._matrix = mat4.identity(new Float32Array(16));
    //     mat4.fromRotationTranslation(
    //       this._matrix,
    //       quat.fromValues(
    //         this._orientation.x,
    //         this._orientation.y,
    //         this._orientation.z,
    //         this._orientation.w),
    //       vec3.fromValues(
    //         this._position.x,
    //         this._position.y,
    //         this._position.z)
    //     );
    // }
  }

  /**
   * @returns {Float32Array}
   */
  get matrix(): Readonly<Float32Array> { 
    return this.#matrix; 
  }

  /**
   * @returns {DOMPointReadOnly}
   */
  get position(): DOMPointReadOnly { 
    return this.#position; 
  }

  /**
   * @returns {DOMPointReadOnly}
   */
  get orientation(): DOMPointReadOnly { 
    return this.#orientation; 
  }

  /**
   * @returns {XRRigidTransform}
   */
  get inverse(): XRRigidTransform {
    if (this.#inverse === null) {
      let invMatrix = mat4.identity(mat4.create());
      mat4.invert(invMatrix, this.#matrix);
     // this._inverse = new XRRigidTransformPolyfill(invMatrix);
    }

    return this.#inverse;
  }
}



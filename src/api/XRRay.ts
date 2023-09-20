// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import { mat4, vec3, vec4 } from 'gl-matrix';
import XRRigidTransform from './XRRigidTransform';


/**
 * @see https://immersive-web.github.io/hit-test/#xr-ray-direction-init-dictionary
 */
export interface XRRayDirectionInit {
	x: number;
	y: number;
	z: number;
	w: number;
}

/** 
 * @see https://immersive-web.github.io/hit-test/#xrray-interface
*/
export default class XRRay {
	#origin: DOMPointReadOnly;
	#direction: DOMPointReadOnly;
	#matrix: Float32Array | null;
	
	constructor(origin: DOMPointInit | XRRigidTransform | null = null, direction: XRRayDirectionInit | null = null) {
		var _origin = { x: 0, y: 0, z: 0, w: 1 };
		var _direction = { x: 0, y: 0, z: -1, w: 0 };

		if (origin && origin instanceof XRRigidTransform) {
			const transform = origin;
			const matrix = transform.matrix;
			const originVec4 = vec4.set(
				vec4.create(),
				_origin.x,
				_origin.y,
				_origin.z,
				_origin.w,
			);
			const directionVec4 = vec4.set(
				vec4.create(),
				_direction.x,
				_direction.y,
				_direction.z,
				_direction.w,
			);
			vec4.transformMat4(originVec4, originVec4, matrix);
			vec4.transformMat4(directionVec4, directionVec4, matrix);
			_origin.x = originVec4[0];
			_origin.y = originVec4[1];
			_origin.z = originVec4[2];
			_origin.w = originVec4[3];
			_direction.x = directionVec4[0];
			_direction.y = directionVec4[1];
			_direction.z = directionVec4[2];
			_direction.w = directionVec4[3];
		} else {
			if (origin) {
				_origin.x = origin.x;
				_origin.y = origin.y;
				_origin.z = origin.z;
				_origin.w = origin.w;
			}
			if (direction) {
				_direction.x = direction.x;
				_direction.y = direction.y;
				_direction.z = direction.z;
				_direction.w = direction.w;
			}
		}

		// Normalize direction
		const length =
			Math.sqrt(
				_direction.x * _direction.x +
					_direction.y * _direction.y +
					_direction.z * _direction.z,
			) || 1;
		_direction.x = _direction.x / length;
		_direction.y = _direction.y / length;
		_direction.z = _direction.z / length;

		this.#origin = new DOMPointReadOnly(_origin.x, _origin.y, _origin.z, _origin.w);
		this.#direction = new DOMPointReadOnly(
				_direction.x,
				_direction.y,
				_direction.z,
				_direction.w,
			);
		this.#matrix = null;
	}

	get origin(): DOMPointReadOnly {
		return this.#origin;
	}

	get direction(): DOMPointReadOnly {
		return this.#direction;
	}

	get matrix(): Float32Array {
		if (this.#matrix) {
			return this.#matrix;
		}
		const z = vec3.set(vec3.create(), 0, 0, -1);
		const origin = vec3.set(
			vec3.create(),
			this.#origin.x,
			this.#origin.y,
			this.#origin.z,
		);
		const direction = vec3.set(
			vec3.create(),
			this.#direction.x,
			this.#direction.y,
			this.#direction.z,
		);
		const axis = vec3.cross(vec3.create(), direction, z);
		const cosAngle = vec3.dot(direction, z);
		const rotation = mat4.create();
		if (cosAngle > -1 && cosAngle < 1) {
			mat4.fromRotation(rotation, Math.acos(cosAngle), axis);
		} else if (cosAngle === -1) {
			mat4.fromRotation(
				rotation,
				Math.acos(cosAngle),
				vec3.set(vec3.create(), 1, 0, 0),
			);
		}
		const translation = mat4.fromTranslation(mat4.create(), origin);
		const matrix = mat4.multiply(mat4.create(), translation, rotation);
		this.#matrix = matrix;
		return matrix;
	}
}

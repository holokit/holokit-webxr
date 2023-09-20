import { mat4 } from 'gl-matrix';
import XRSpace from './XRSpace';

/**
 * @see https://immersive-web.github.io/real-world-meshing/
 */
export default class XRMesh {
	#meshSpace: XRSpace;
	#vertices: Readonly<Float32Array>;
	#indices: Readonly<Uint32Array>;
	#lastChangedTime: DOMHighResTimeStamp;
	#semanticLabel: string | null;

	constructor(meshSpace: XRSpace, vertices: Readonly<Float32Array>, indices: Readonly<Uint32Array>, semanticLabel: string | null = null) {
		this.#meshSpace = meshSpace;
		this.#vertices = vertices;
		this.#indices = indices;
		this.#lastChangedTime = performance.now();
		this.#semanticLabel = semanticLabel;
	}

	get meshSpace(): XRSpace {
		return this.#meshSpace;
	}

	get vertices(): Readonly<Float32Array> {
		return this.#vertices;
	}

	get indices(): Readonly<Uint32Array> {
		return this.#indices;
	}

	get lastChangedTime(): DOMHighResTimeStamp {
		return this.#lastChangedTime;
	}

	get semanticLabel(): string | null {
		return this.#semanticLabel;
	}

	/**
	 * non-standard
	 * @param {number[]} position
	 * @param {number[]} quaternion
	 */
	_updateMatrix(position: Float32Array, quaternion: Float32Array) {
		const meshMatrix = new Float32Array(16);
		mat4.fromRotationTranslation(meshMatrix, quaternion, position);
		this.#meshSpace._baseMatrix = meshMatrix;
	}
}

export type XRMeshSet = ReadonlySet<XRMesh>;

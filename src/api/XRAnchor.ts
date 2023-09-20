// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRSpace from './XRSpace';
import XRSession from './XRSession';

const ANCHOR_DELETED_ERROR = 'Unable to access anchor properties, the anchor was already deleted.';

export type XRAnchorSet = Set<XRAnchor>;

/**
 * @see https://immersive-web.github.io/anchors/#xr-anchor
 */
export default class XRAnchor {
	#session: XRSession;
	#anchorSpace: XRSpace;

	constructor(session: XRSession, anchorSpace: XRSpace) {
		this.#session = session;
		this.#anchorSpace = anchorSpace;
	}

	get anchorSpace(): XRSpace {
		return this.#anchorSpace;
	}

	async requestPersistentHandle(): Promise<string> {
		const handle = await _savePersistentAnchor();
		await restorePersistentAnchors(this.#session);
		return handle;
	}

	async _savePersistentAnchor() {
		const existingUUID = this.#session.getPersistentAnchorUUID(anchor);
		if (existingUUID) {
			return existingUUID;
		}
		const prefix = window.location.hostname + PRIVATE.toString();
		const anchorHandle = generateUUID();
		const matrix = Array.from(anchor.anchorSpace._baseMatrix);
		await localforage.setItem(
			prefix + anchorHandle,
			JSON.stringify({ uuid: anchorHandle, matrixValue: matrix }),
		);
		return anchorHandle;
	}

	delete(): void {
		this.#session.deleteTrackedAnchor(this);
	}
}

export const 

export const deletePersistentAnchor = async (uuid) => {
	const prefix = window.location.hostname + PRIVATE.toString();
	await localforage.removeItem(prefix + uuid);
};

export const restorePersistentAnchors = async (session) => {
	session.persistentAnchorsMap = new Map();
	const prefix = window.location.hostname + PRIVATE.toString();
	const keys = (await localforage.keys()).filter((key) =>
		key.startsWith(prefix),
	);
	keys.forEach(async (key) => {
		const { uuid, matrixValue } = JSON.parse(await localforage.getItem(key));
		const matrix = new Float32Array(matrixValue);
		const anchorSpace = new XRSpace();
		anchorSpace._baseMatrix = matrix;
		const anchor = new XRAnchor(session, anchorSpace);
		session.persistentAnchorsMap.set(uuid, anchor);
	});
};

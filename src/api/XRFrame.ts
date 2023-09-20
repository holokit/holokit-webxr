// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import XRDevice from './XRDevice';
import XRSession from './XRSession';
import XRViewerPose from './XRViewerPose';
import XRView from './XRView';
import XRJointSpace from './XRJointSpace';
import XRSpace from './XRSpace';
import XRPose from './XRPose';

const NON_ACTIVE_MSG = "XRFrame access outside the callback that produced it is invalid.";
const NON_ANIMFRAME_MSG = "getViewerPose can only be called on XRFrame objects passed to XRSession.requestAnimationFrame callbacks.";

let NEXT_FRAME_ID = 0;

export default class XRFrame {
  #id: number;
  #active: boolean;
  #animationFrame: boolean;
  #device: XRDevice;
  #session: XRSession;
  #sessionId: number;

  /**
   * @param {XRDevice} device
   * @param {XRSession} session
   * @param {number} sessionId
   */
  constructor(device: XRDevice, session: XRSession, sessionId: number) {
    this.#id = ++NEXT_FRAME_ID;
    this.#active = false;
    this.#animationFrame = false;
    this.#device = device;
    this.#session = session;
    this.#sessionId = sessionId;
  }

  /**
   * @return {XRSession} session
   */
  get session(): XRSession { 
      return this.#session; 
  }

  /**
   * @param {XRReferenceSpace} referenceSpace
   * @return {XRViewerPose?}
   */
  getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose | null {
      if (!this.#animationFrame) {
          throw new DOMException(NON_ANIMFRAME_MSG, 'InvalidStateError');
      }
      if (!this.#active) {
          throw new DOMException(NON_ACTIVE_MSG, 'InvalidStateError');
      }

      const device = this.#device;
      const session = this.#session;

      session._viewerSpace._ensurePoseUpdated(device, this.#id);
      referenceSpace._ensurePoseUpdated(device, this.#id);

      let viewerTransform = referenceSpace._getSpaceRelativeTransform(
          session._viewerSpace);

      const views = [];
      for (let viewSpace of session._viewSpaces) {
          viewSpace._ensurePoseUpdated(device, this.#id);
          let viewTransform = referenceSpace._getSpaceRelativeTransform(viewSpace);
          let view = new XRView(device, viewTransform, viewSpace.eye, this.#sessionId);
          views.push(view);
      }
      let viewerPose = new XRViewerPose(viewerTransform, views, false /* TODO: emulatedPosition */);

      return viewerPose;
  }

  getPose(space: XRSpace, baseSpace: XRSpace): XRPose {
    if (!this.#active) {
      throw new DOMException(NON_ACTIVE_MSG, 'InvalidStateError');
    }

    const device = this.#device;
    if (space._specialType === "target-ray" || space._specialType === "grip") {
      // TODO: Stop special-casing input.
      return device.getInputPose(
          space._inputSource, baseSpace, space._specialType);
    } else {
      space._ensurePoseUpdated(device, this._id);
      baseSpace._ensurePoseUpdated(device, this._id);
      let transform = baseSpace._getSpaceRelativeTransform(space);
      if (!transform) { 
        return null; 
      }
      return new XRPose(transform, false /* TODO: emulatedPosition */);
    }

    return null;
  }

  /**
   * @see https://immersive-web.github.io/real-world-geometry/plane-detection.html#plane-set
   */
  get detectedPlanes(): XRPlaneSet {

  }

  /**
   * @see https://immersive-web.github.io/lighting-estimation/#session-initialization
   */
  getLightEstimate(lightProbe: XRLightProbe): XRLightEstimate? {
    
  }

  /**
   * @see https://immersive-web.github.io/webxr-hand-input/#frame-loop
   */

  getJointPose(joint: XRJointSpace, baseSpace: XRSpace): XRJointPose? {
    
  }

  fillJointRadii(jointSpaces: XRJointSpace[], radii: Float32Array): boolean {
    
  }

  fillPoses(spaces: XRSpace[], baseSpace: XRSpace, transforms: Float32Array): boolean {

  }

}

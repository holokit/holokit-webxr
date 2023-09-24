// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import mocha from 'mocha';
import { assert } from 'chai';

import XRFrame from '../../src/api/XRFrame';
import XRSession from '../../src/api/XRSession';
import { createXRDevice } from '../lib/utils';
import XRDevicePose from '../../src/api/XRDevice';

describe('API - XRFrame', () => {
  let device: XRDevice;
  let session: XRSession;

  beforeEach(async function () {
    device = createXRDevice();
    session = await device.requestSession({ immersive: true });
    ref = await session.requestFrameOfReference('eye-level');
  });

  it('exposes a PRIVATE named export', done => {
    session.requestAnimationFrame((t, frame) => {
      assert.ok(frame);
      done();
    });
  });

  it('has two views', done => {
    session.requestAnimationFrame((t, frame) => {
      assert.equal(frame.views.length, 2);
      const eyes = frame.views.map(v => v.eye);
      assert.include(eyes, 'left');
      assert.include(eyes, 'right');
      done();
    });
  });

  it('has a session', done => {
    session.requestAnimationFrame((t, frame) => {
      assert.equal(frame.session, session);
      done();
    });
  });

  it('can get a device pose', done => {
    session.requestAnimationFrame((t, frame) => {
      const pose = frame.getDevicePose(ref);
      assert.instanceOf(pose, XRDevicePose);
      assert.instanceOf(pose.poseModelMatrix, Float32Array);
      done();
    });
  });
});

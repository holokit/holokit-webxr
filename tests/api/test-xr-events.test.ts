// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

describe('API - XRFrame', () => {
  let device: XRDevice;
  let session: XRSession;

  beforeEach(async function () {
    device = createXRDevice();
    session = await device.requestSession({ immersive: true });
    ref = await session.requestFrameOfReference('eye-level');
  });
  
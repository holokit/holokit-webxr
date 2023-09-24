// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

export default interface XRCamera {
  width: number;
  height: number;
}

partial interface XRWebGLBinding {
  WebGLTexture? getCameraImage(XRCamera camera);
};


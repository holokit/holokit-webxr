// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT


interface XRFrame2 {
  public getA(lightProbe: number): number;
}

interface XRFrame2 {
  public getLightEstimate(lightProbe: number): number;
}

class XRFrame2 implements XRFrame2 {
  public getA(lightProbe: number): number {
    return lightProbe;
  }
}

export XRFrame2;
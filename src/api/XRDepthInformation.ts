// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

export enum XRDepthUsage {
  "cpu-optimized" = "cpu-optimized",
  "gpu-optimized" = "gpu-optimized"
}

export enum XRDepthDataFormat {
  "luminance-alpha" = "luminance-alpha",
  "float32" = "float32"
}

export interface XRDepthStateInit {
  usagePreference: Array<XRDepthUsage>;
  dataFormatPreference: Array<XRDepthDataFormat>;
}

interface XRSessionInit {
  depthSensing?: XRDepthStateInit;
}

export class abstract XRDepthInformation {
  readonly width: number;
  readonly height: number;

  get normDepthBufferFromNormView(): XRRigidTransform {

  }

  get rawValueToMeters(): number {

  }
}

export class XRCPUDepthInformation extends XRDepthInformation {
    data: ArrayBuffer;

    getDepthInMeters(x: number, y: number): number {
      return 
    }
}

interface XRFrame {
    getDepthInformation(view: XRView): XRCPUDepthInformation | undefined;
}

interface XRWebGLDepthInformation extends XRDepthInformation {
    readonly texture: WebGLTexture;
}

interface XRWebGLBinding {
    getDepthInformation(view: XRView): XRWebGLDepthInformation | undefined;
}

// enabledFeatures
interface XRSession {
    enabledFeatures: string[];
}

// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

import { XRSessionMode } from "./XRSession";

export interface XRSessionSupportedPermissionDescriptor extends PermissionDescriptor {
  mode?: XRSessionMode;
}

export interface XRPermissionDescriptor extends PermissionDescriptor {
  mode?: XRSessionMode;
  requiredFeatures?: Array<string>;
  optionalFeatures?: Array<string>;
}

export interface XRPermissionStatus extends PermissionStatus {
  granted: ReadonlyArray<string>;
}

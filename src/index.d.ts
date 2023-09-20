/// <reference types="vite/client" />

declare module "webxr-polyfill/src/devices/XRDevice" {
	type XRDeviceEventTypes = "@@webxr-polyfill/vr-present-start" | "@@webxr-polyfill/vr-present-end"
  
	export default class XRDevice extends EventTarget {
		constructor(global: any): void;
		public addEventListener(type: XRDeviceEventTypes, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined): void;
		public dispatchEvent: (...args: any) => void;
		public global: any;
		public sessions: any;
		public basePoseMatrix: any[];
		public viewSpaces: any[];
		public inlineProjectionMatrix: any[];
		public inlineInverseViewMatrix: any[];
		public LookingGlassProjectionMatrices: any[];
		public LookingGlassInverseViewMatrices: any[];
        public captureScreenshot: boolean;
        public screenshotCallback: any;
	}
}


// declare module "webxr" {

//   export class XRRigidTransform {
//     readonly position: DOMPointReadOnly;
//     readonly orientation: DOMPointReadOnly;
//     readonly matrix: Float32Array;
//     readonly inverse: XRRigidTransform;
  
//     constructor(position?: DOMPointInit, direction?: DOMPointInit);
//   }  
  
// }

// declare module "webxr-polyfill/src/devices/XRDevice" {
// 	type XRDeviceEventTypes = "@@webxr-polyfill/vr-present-start" | "@@webxr-polyfill/vr-present-end"
// 	export default class XRDevice extends EventTarget {
// 		constructor(global: any): void;
// 		public addEventListener(type: XRDeviceEventTypes, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined): void;
// 		public dispatchEvent: (...args: any) => void;
// 		public global: any;
// 		public sessions: any;
// 		public basePoseMatrix: any[];
// 		public viewSpaces: any[];
// 		public inlineProjectionMatrix: any[];
// 		public inlineInverseViewMatrix: any[];
// 		public LookingGlassProjectionMatrices: any[];
// 		public LookingGlassInverseViewMatrices: any[];
//         public captureScreenshot: boolean;
//         public screenshotCallback: any;
// 	}
// }

// declare module "webxr-polyfill/src/api/XRSpace" {
// 	export default class XRSpace {
// 		public _inverseBaseMatrix: Float32Array;
// 		constructor(specialType?: string, inputSource?: any): void;
// 	}
// }
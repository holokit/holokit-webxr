# WebXR Polyfill for HoloKit WebXR Viewer

This repo contains polyfill code that implements the WebXR Device API for use *only* in HoloKit WebXR Viewer.

It implements two modes under `immersive-ar` sessions:
- Handheld AR (Monocular AR) 
- Headworn AR (Stereoscopic AR) using HoloKit

## Implementation

We did not base on the official implementation of WebXR polyfill. We rewrite the WebXR polyfill in TypeScript for strict type checking purpose.

This implementation of WebXR supports a number of features: 

- [x] WebXR Device API  
  - https://immersive-web.github.io/webxr/
- [x] WebXR Gamepads Module - Level 1 
  - https://immersive-web.github.io/webxr-gamepads-module/
  - https://github.com/immersive-web/webxr-input-profiles
- [x] WebXR Augmented Reality Module - Level 1
  - optional feature descriptor: `"secondary-views"`
  - https://immersive-web.github.io/webxr-ar-module/
- [x] WebXR Hit Test Module 
  - feature descriptor: `"hit-test"`
  - https://immersive-web.github.io/hit-test/
- [ ] WebXR DOM Overlays Module 
  - https://immersive-web.github.io/dom-overlays
- [ ] WebXR Layers API Level 1 
  - feature descriptor: `"layers"`
  - https://immersive-web.github.io/layers/
- [x] WebXR Anchors Module 
  - feature descriptor: `"anchors"`
  - https://immersive-web.github.io/anchors/
- [x] WebXR Lighting Estimation API Level 1
  - feature descriptor: `"light-estimation"`
  - https://immersive-web.github.io/lighting-estimation/
- [x] WebXR Hand Input Module - Level 1 
  - feature descriptor: `"hand-tracking"`
  - https://immersive-web.github.io/webxr-hand-input/
- [x] WebXR Mesh Detection Module
  - feature descriptor: `"mesh-detection"`
  - https://immersive-web.github.io/real-world-meshing/
- [x] WebXR Plane Detection Module
  - feature descriptor: `"plane-detection"`
  - https://immersive-web.github.io/real-world-geometry/plane-detection.html
- [x] WebXR Raw Camera Access Module
  - feature descriptor: `"camera-access"`
  - https://immersive-web.github.io/raw-camera-access/
- [x] WebXR Depth Sensing Module
  - feature descriptor: `"depth-sensing"`
  - https://immersive-web.github.io/depth-sensing/

## HoloKitDevice
  - 
  - 

## Reference

- Javascript Implementation for WebXR Polyfill for Mozilla XRViewer with ARKitDevice
  - https://github.com/MozillaReality/webxr-ios-js
- Official Javascript Implementation of WebXR Polyfill   
  - https://github.com/immersive-web/webxr-polyfill 
- Offiial Typescript implementation of WebXR Layers Polyfill 
  - https://github.com/immersive-web/webxr-layers-polyfill
- Immersive Web Emulator by Meta, which implements extension of Full input emulation support
  - https://github.com/meta-quest/immersive-web-emulator
- Typescript implementation of Looking Glass WebXR polyfill
  - https://github.com/Looking-Glass/looking-glass-webxr
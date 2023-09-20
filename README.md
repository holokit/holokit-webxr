# holokit-webxr

- [x] WebXR Device API (Source, Issues, Explainer) 
- [x] WebXR Gamepads Module - Level 1 (Source, Issues, Explainer)
- [x] WebXR Augmented Reality Module - Level 1 (Source, Issues, Explainer)
  - https://immersive-web.github.io/webxr-ar-module/
- [x] WebXR Hit Test Module (Source, Issues, Explainer)
- [] WebXR DOM Overlays Module (Source, Issues, Explainer)
- [] WebXR Layers API Level 1 (Source, Issues, Explainer)
- [x] WebXR Anchors Module (Source, Issues, Explainer)
- [x] WebXR Lighting Estimation API Level 1 (Source, Issues, Explainer)
- [x] WebXR Hand Input Module - Level 1 (Source, Issues, Explainer)
- [x] WebXR Mesh Detection Module 
  - https://immersive-web.github.io/real-world-meshing/
- [x] WebXR Plane Detection Module
  - https://immersive-web.github.io/real-world-geometry/plane-detection.html#plane
  - 
# https://github.com/chromium/chromium/blob/b2b2557e55c332b80c1d0d29824b3e5fe3380e27/android_webview/tools/system_webview_shell/test/data/webexposed/not-webview-exposed.txt#L144
# WebXR dependent interfaces are not supported on WebView crbug.com/1012899
interface XRView
interface XRViewport
interface XRSystem : EventTarget
interface XRFrame
interface XRRigidTransform
interface XRSpace : EventTarget
interface XRInputSourcesChangeEvent : Event
interface XRInputSource
interface XRWebGLLayer : XRLayer
interface XRInputSourceEvent : Event
interface XRViewerPose : XRPose
interface XRInputSourceArray
interface XRRenderState
interface XRPose
interface XRSession : EventTarget
interface XRReferenceSpaceEvent : Event
interface XRBoundedReferenceSpace : XRReferenceSpace
interface XRSessionEvent : Event
interface XRReferenceSpace : XRSpace
interface WebGLRenderingContext
    method makeXRCompatible
interface WebGL2RenderingContext
    method makeXRCompatible
interface XRHitTestSource
interface XRRay
interface XRTransientInputHitTestResult
interface XRHitTestResult
interface XRTransientInputHitTestSource
interface XRAnchor
interface XRAnchorSet
interface XRLightEstimate
interface XRLightProbe : EventTarget
interface XRWebGLBinding
    method getCameraImage
    method getDepthInformation
    method getReflectionCubeMap
interface XRDepthInformation
interface XRCPUDepthInformation : XRDepthInformation
interface XRWebGLDepthInformation : XRDepthInformation
interface XRCamera
`
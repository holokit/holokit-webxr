/**
 * https://immersive-web.github.io/webxr/#initialization
 */
import XRSystem from './XRSystem';
export { XRSystem };

/** 
 * @see https://immersive-web.github.io/webxr/#session 
 * */
import XRSession, {XRVisibilityState, XRFrameRequestCallback, XRSessionMode, XRSessionInit } from './XRSession';
import XRRenderState from './XRRenderState';
export { XRSession, XRVisibilityState, XRFrameRequestCallback, XRSessionMode, XRSessionInit, XRRenderState };

/**
 * @see https://immersive-web.github.io/webxr/#frame
 */
import XRFrame from './XRFrame';
export { XRFrame };

/**
 * @see https://immersive-web.github.io/webxr/#spaces
 */
import XRSpace from './XRSpace';
import XRReferenceSpace, { XRReferenceSpaceType } from './XRReferenceSpace';
import XRBoundedReferenceSpace from './XRBoundedReferenceSpace';
export { XRSpace, XRReferenceSpace, XRReferenceSpaceType, XRBoundedReferenceSpace };

/**
 * @see https://immersive-web.github.io/webxr/#views
 */
import XRView, { XREye } from './XRView';
import XRViewport from './XRViewport';
export { XRView, XREye, XRViewport };

/**
 * @see https://immersive-web.github.io/webxr/#geometricprimitives
 */
import XRRigidTransform from './XRRigidTransform';
export { XRRigidTransform };

/**
 * @see https://immersive-web.github.io/webxr/#pose
 */
import XRPose from './XRPose';
import XRViewerPose from './XRViewerPose';
export { XRPose, XRViewerPose };

/**
 * @see https://immersive-web.github.io/webxr/#input
 */
import XRInputSource, { XRTargetRayMode, XRHandedness, XRInputSourceArray } from './XRInputSource';
export { XRInputSource, XRTargetRayMode, XRHandedness, XRInputSourceArray };

/**
 * @see https://immersive-web.github.io/webxr/#layers
 */
import XRLayer from './XRLayer';
import XRWebGLLayer, { XRWebGLLayerInit, XRWebGLRenderingContext } from './XRWebGLLayer';
export { XRLayer, XRWebGLLayer, XRWebGLLayerInit, XRWebGLRenderingContext };

/**
 * @see https://immersive-web.github.io/webxr/#events
 */
import XRSessionEvent, { XRSessionEventInit } from './XRSessionEvent';
import XRInputSourceEvent, { XRInputSourceEventInit } from './XRInputSourceEvent';
import XRInputSourcesChangeEvent, { XRInputSourcesChangeEventInit } from './XRInputSourcesChangeEvent';
import XRReferenceSpaceEvent, { XRReferenceSpaceEventInit } from './XRReferenceSpaceEvent';
export { XRSessionEvent, XRSessionEventInit, XRInputSourceEvent, XRInputSourceEventInit, XRInputSourcesChangeEvent, XRInputSourcesChangeEventInit, XRReferenceSpaceEvent, XRReferenceSpaceEventInit };

/**
 * @see https://immersive-web.github.io/webxr/#integrations
 */
import { XRPermissionDescriptor, XRPermissionStatus } from './XRPermission';
export { XRPermissionDescriptor, XRPermissionStatus };

/**
 * @see https://immersive-web.github.io/webxr-ar-module/#webxr-device-api-integration
 */
import { XREnvironmentBlendMode, XRInteractionMode } from './XRSession';
export { XREnvironmentBlendMode, XRInteractionMode };

/**
 * @see https://immersive-web.github.io/hit-test/#hit-test-result
 */

import XRHitTestResult from './XRHitTestResult';
import XRTransientInputHitTestResult from './XRTransientInputHitTestResult';
export { XRHitTestResult, XRTransientInputHitTestResult };

/**
 * @see https://immersive-web.github.io/hit-test/#hit-test-source
 */
import XRHitTestSource from './XRHitTestSource';
import XRTransientInputHitTestSource from './XRTransientInputHitTestSource';
export { XRHitTestSource, XRTransientInputHitTestSource };

/** 
 * @see https://immersive-web.github.io/hit-test/#geometric-primitives
 */
import XRRay, { XRRayDirectionInit } from './XRRay';
export { XRRay, XRRayDirectionInit };

/**
 * @see https://immersive-web.github.io/anchors/#anchors-section
 */
import XRAnchor, { XRAnchorSet } from './XRAnchor';
export { XRAnchor, XRAnchorSet };
/**
 * @see https://immersive-web.github.io/webxr-hand-input/#xrhand-interface
 * @see https://immersive-web.github.io/webxr-hand-input/#frame-loop
*/
import XRHand, { XRHandJoint } from './XRHand';
import XRJointSpace from './XRJointSpace';
import XRJointPose from './XRJointPose';
export { XRHand, XRHandJoint, XRJointSpace, XRJointPose };

/**
 * @see https://immersive-web.github.io/real-world-geometry/plane-detection.html
 */
import XRPlane, { XRPlaneOrientation, XRPlaneSet } from './XRPlane';
export { XRPlane, XRPlaneOrientation, XRPlaneSet };

/**
 * @see https://immersive-web.github.io/real-world-meshing/#meshes-section
 */
import XRMesh, { XRMeshSet } from './XRMesh';
export { XRMesh, XRMeshSet };

import KinectParams from './kinectParams';

const ShaderParams = {
  isPoints: {
    type: "b",
    value: false
  },
  depthMap: {
    type: "t",
    value: null
  },
  texSize: {
    type: "vec2",
    value: new THREE.Vector2(0, 0)
  },
  fx: {
    type: "f",
    value: KinectParams.v2.fx
  },
  fy: {
    type: "f",
    value: KinectParams.v2.fy
  },
  cx: {
    type: "f",
    value: KinectParams.v2.cx
  },
  cy: {
    type: "f",
    value: KinectParams.v2.cy
  }
}

export default ShaderParams;

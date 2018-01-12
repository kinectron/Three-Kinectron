import KinectParams from './kinectParams';

const ShaderParams = {
  isPoints: {
    type: "b",
    value: false
  },
  pointSize: {
    type: "f",
    value: 1.0
  },
  depthMap: {
    type: "t",
    value: null
  },
  texSize: {
    type: "vec2",
    value: new THREE.Vector2(0, 0)
  },
  colorDepthMix: {
    type: "f",
    value: 0.0
  },
  opacity: {
    type: "f",
    value: 1.0
  },
  displacement: {
    type: "f",
    value: 2.0
  },
  brightness: {
    type: "f",
    value: 0.0
  },
  contrast: {
    type: "f",
    value: 1.0
  }
}

export default ShaderParams;

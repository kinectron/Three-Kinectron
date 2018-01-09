(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(strings) {
  if (typeof strings === 'string') strings = [strings]
  var exprs = [].slice.call(arguments,1)
  var parts = []
  for (var i = 0; i < strings.length-1; i++) {
    parts.push(strings[i], exprs[i] || '')
  }
  parts.push(strings[i])
  return parts.join('')
}

},{}],2:[function(require,module,exports){
'use strict';

var _kinectronForThree = require('./kinectronForThree');

var _kinectronForThree2 = _interopRequireDefault(_kinectronForThree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//If three.js is in the global scope attach it
if (THREE) {
  THREE.KinectGeometry = _kinectronForThree2.default;
} else {
  console.log('Three.js was not found, perhaps you forgot to include it?');
} //Import the class

},{"./kinectronForThree":4}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var KinectParams = {
  "v2": {
    "cx": 254.878,
    "cy": 205.395,
    "fx": 365.456,
    "fy": 365.456,
    "k1": 0.0905474,
    "k2": -0.26819,
    "k3": 0.0950862,
    "p1": 0.0,
    "p2": 0.0
  }
};

exports.default = KinectParams;

},{}],4:[function(require,module,exports){
'use strict';

//Only for debugging, make sure to comment out for production
// import * as THREE from 'three'

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shaderParams = require('./shaderParams');

var _shaderParams2 = _interopRequireDefault(_shaderParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var glsl = require('glslify');

var KinectGeometry = function () {
  function KinectGeometry() {
    var _type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'mesh';

    var _this = this;

    var vertsWide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 512;
    var vertsTall = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 424;

    _classCallCheck(this, KinectGeometry);

    //Load the shaders
    var kinectronFrag = glsl(["#define GLSLIFY 1\n// Texture maps\nuniform sampler2D depthMap;\n\n//Interpolated per fragment values\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vPos;\n\nvoid main() {\n\n    vec4 color = vec4(1.0, 0.0, 0.0, 1.0);\n\n    gl_FragColor = texture2D(depthMap, vUv);\n\n}\n"]);
    var kinectronVert = glsl(["#define GLSLIFY 1\n// Uniforms\nuniform bool isPoints;\nuniform vec2 texSize;\n\n//Kinect params\nuniform float fx;\nuniform float fy;\nuniform float cx;\nuniform float cy;\n\n// Texture maps\nuniform sampler2D depthMap;\n\n//Per vertex interpolation passed to the fragment shader\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vPos;\n\nvoid main() {\n\n    vUv = uv;\n    vPos = (modelMatrix * vec4(position, 1.0 )).xyz;\n    vNormal = normalMatrix * normal;\n\n    //Read the depth map\n    vec4 texelRead = texture2D(depthMap, uv);\n\n    //Calculate the positions\n    vec4 pos = vec4(position.x, position.y, texelRead.r, 1.0);\n\n    if(isPoints){\n        gl_PointSize = 1.0;\n    }\n\n    gl_Position = projectionMatrix * modelViewMatrix * pos;\n\n}\n"]);

    //Build the geometry but only once! even for multipule instances
    if (!KinectGeometry.geo) {
      KinectGeometry.buildGeomtery(vertsWide, vertsTall);
    }

    //Create the material
    this.material = new THREE.ShaderMaterial({
      uniforms: _shaderParams2.default,
      vertexShader: kinectronVert,
      fragmentShader: kinectronFrag,
      transparent: true
    });

    //Make the shader material double sided
    this.material.side = THREE.DoubleSide;

    //Switch a few things based on selected rendering type and create the mesh
    this.buildMesh(_type);

    var loader = new THREE.TextureLoader();

    loader.load('../assets/test.jpg', function (texture) {

      //Filter the texture
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      _this.material.uniforms.depthMap.value = texture;
      _this.material.uniforms.texSize.value = new THREE.Vector2(texture.width, texture.height);
    });

    //Setup a three clock in case we need time in our shaders - get's updated only if update() is called recursively
    this.clock = new THREE.Clock();

    //Expose the class as an object inside the THREE Object3D
    this.mesh.kinectron = this;

    //Return the THREE Object3D instance for the mesh so you can just 'scene.add()' it
    return this.mesh;
  }

  /***************
   * Class methods
   ***************/

  //Change rendering type


  _createClass(KinectGeometry, [{
    key: 'buildMesh',
    value: function buildMesh(type) {
      //Switch a few things based on selected rendering type and create the mesh
      switch (type) {
        case 'wire':
          this.material.wireframe = true;
          this.mesh = new THREE.Mesh(KinectGeometry.geo, this.material);
          break;

        case 'points':
          this.material.uniforms.isPoints.value = true;
          this.mesh = new THREE.Points(KinectGeometry.geo, this.material);
          break;

        default:
          this.mesh = new THREE.Mesh(KinectGeometry.geo, this.material);
          break;
      }
    }

    //A utility method to build a fully tesselated plane geometry

  }, {
    key: 'update',
    value: function update() {
      this.mesh.material.uniforms.time.value = this.clock.getElapsedTime();
    }
  }], [{
    key: 'buildGeomtery',
    value: function buildGeomtery(VERTS_WIDE, VERTS_TALL) {
      KinectGeometry.geo = new THREE.PlaneBufferGeometry(5, 4, VERTS_WIDE, VERTS_TALL);
    }
  }]);

  return KinectGeometry;
}();

exports.default = KinectGeometry;

},{"./shaderParams":5,"glslify":1}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _kinectParams = require("./kinectParams");

var _kinectParams2 = _interopRequireDefault(_kinectParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ShaderParams = {
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
    value: _kinectParams2.default.v2.fx
  },
  fy: {
    type: "f",
    value: _kinectParams2.default.v2.fy
  },
  cx: {
    type: "f",
    value: _kinectParams2.default.v2.cx
  },
  cy: {
    type: "f",
    value: _kinectParams2.default.v2.cy
  }
};

exports.default = ShaderParams;

},{"./kinectParams":3}]},{},[2]);

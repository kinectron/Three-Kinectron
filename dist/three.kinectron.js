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

var _kinectron_for_three = require('./kinectron_for_three');

var _kinectron_for_three2 = _interopRequireDefault(_kinectron_for_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//If three.js is in the global scope attach it
if (THREE) {
  THREE.KinectGeometry = _kinectron_for_three2.default;
} else {
  console.log('Three.js was not found, perhaps you forgot to include it?');
} //Import the class

},{"./kinectron_for_three":3}],3:[function(require,module,exports){
'use strict';

//Only for debugging, make sure to comment out for production
// import * as THREE from 'three'

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var glsl = require('glslify');

//Precision params for the geometry
var VERTS_WIDE = 512;
var VERTS_TALL = 424;

var KinectGeometry = function () {
  function KinectGeometry() {
    var _type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'mesh';

    _classCallCheck(this, KinectGeometry);

    //Load the shaders
    var kinectronFrag = glsl(["#define GLSLIFY 1\n\n// Texture maps\nuniform sampler2D depthMap;\n\n//Interpolated per fragment values\nvarying vec2 vUv;\n// varying vec3 vNormal;\n// varying vec3 vPos;\n\nvoid main() {\n\n    vec4 color = vec4(1.0, 0.0, 0.0, 1.0);\n\n    gl_FragColor = texture2D(depthMap, vUv);\n\n}\n"]);
    var kinectronVert = glsl(["#define GLSLIFY 1\n// State uniforms\nuniform bool isPoints;\n\n// Texture maps\nuniform sampler2D depthMap;\n\n//Per vertex interpolation passed to the fragment shader\nvarying vec2 vUv;\n\nvoid main() {\n\n    vUv = uv;\n\n    vec3 pos = position;\n\n    vec4 texelRead = texture2D(depthMap, uv);\n\n    pos.z = texelRead.r;\n\n    if(isPoints){\n        gl_PointSize = 1.0;\n    }\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);\n\n}\n"]);

    //Build the geometry but only once! even for multipule instances
    if (!KinectGeometry.geo) {
      KinectGeometry.buildGeomtery();
    }

    //Create the material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        isPoints: {
          type: "b",
          value: false
        },
        depthMap: {
          type: "t",
          value: null
        }
      },
      vertexShader: kinectronVert,
      fragmentShader: kinectronFrag,
      transparent: true
    });

    this.material.side = THREE.DoubleSided;

    //Switch a few things based on selected rendering type and create the mesh
    switch (_type) {
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

    //Translate the origin point to the new center of the Object (i.e center of mass)
    this.mesh.applyMatrix(new THREE.Matrix4().makeTranslation(-1.3, 1.3, 0));

    // instantiate a loader
    // var loader = new THREE.TextureLoader();
    // let instancedMesh = this.mesh;
    // // load a resource
    // loader.load(
    // 	// resource URL
    // 	'../assets/Chae_Demo_Upres.png',
    //
    // 	// onLoad callback
    // 	function ( texture ) {
    // 		  instancedMesh.material.uniforms.depthMap.value = texture;
    // 	},
    //
    // 	// onProgress callback currently not supported
    // 	undefined,
    //
    // 	// onError callback
    // 	function ( err ) {
    // 		console.error( 'An error happened.' );
    // 	}
    // );

    //Expose the class as an object inside the THREE Object3D
    this.mesh.kinectron = this;

    //Return the THREE Object3D instance for the mesh so you can just 'scene.add()' it
    return this.mesh;
  }

  //A utility method to build a fully tesselated plane geometry


  _createClass(KinectGeometry, null, [{
    key: 'buildGeomtery',
    value: function buildGeomtery() {

      KinectGeometry.geo = new THREE.Geometry();
      KinectGeometry.geo.uvsNeedUpdate = true;

      for (var y = 0; y < VERTS_TALL; y++) {
        for (var x = 0; x < VERTS_WIDE; x++) {
          KinectGeometry.geo.vertices.push(new THREE.Vector3(-640 + x * 5, 480 - y * 5, 0));
        }
      }
      for (var _y = 0; _y < VERTS_TALL - 1; _y++) {
        for (var _x2 = 0; _x2 < VERTS_WIDE - 1; _x2++) {
          KinectGeometry.geo.faces.push(new THREE.Face3(_x2 + _y * VERTS_WIDE, _x2 + (_y + 1) * VERTS_WIDE, _x2 + 1 + _y * VERTS_WIDE));
          KinectGeometry.geo.faces.push(new THREE.Face3(_x2 + 1 + _y * VERTS_WIDE, _x2 + (_y + 1) * VERTS_WIDE, _x2 + 1 + (_y + 1) * VERTS_WIDE));
        }
      }
    }
  }]);

  return KinectGeometry;
}();

exports.default = KinectGeometry;

},{"glslify":1}]},{},[2]);

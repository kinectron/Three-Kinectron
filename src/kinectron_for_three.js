'use strict'

//Only for debugging, make sure to comment out for production
// import * as THREE from 'three'

// Static camera parameters
import KinectParams from './KinectParams';

const glsl = require('glslify');

//Precision params for the geometry
const VERTS_WIDE = 512;
const VERTS_TALL = 424;

export default class KinectGeometry {

  constructor(_type = 'mesh') {

    //Load the shaders
    let kinectronFrag = glsl.file('./shaders/kinectron.frag');
    let kinectronVert = glsl.file('./shaders/kinectron.vert');


    //Build the geometry but only once! even for multipule instances
    if (!KinectGeometry.geo) {
      KinectGeometry.buildGeomtery();
    }
    console.log(KinectParams.v2.fx, KinectParams.v2.fy);
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
        },
        texSize: {
          type: "vec2",
          value: new THREE.Vector2(0,0)
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
      },
      vertexShader: kinectronVert,
      fragmentShader: kinectronFrag,
      transparent: true
    });

    //Make the shader material double sided
    this.material.side = THREE.DoubleSide;

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

    var loader = new THREE.TextureLoader();
    //Hack around scope issue
    const me = this;
    loader.load('../assets/depth.jpg', function(texture){
      me.material.uniforms.depthMap.value = texture;
      me.material.uniforms.texSize.value = new THREE.Vector2(texture.width, texture.height);
    });

    //Expose the class as an object inside the THREE Object3D
    this.mesh.kinectron = this;

    //Return the THREE Object3D instance for the mesh so you can just 'scene.add()' it
    return this.mesh

  }

  //A utility method to build a fully tesselated plane geometry
  static buildGeomtery() {
        KinectGeometry.geo = new THREE.PlaneBufferGeometry( 5,4, VERTS_WIDE, VERTS_TALL );
    }
}

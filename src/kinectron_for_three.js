'use strict'

//Only for debugging, make sure to comment out for production
// import * as THREE from 'three'

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
    this.mesh.applyMatrix( new THREE.Matrix4().makeTranslation(-1.3,1.3,0));

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
    return this.mesh

  }

  //A utility method to build a fully tesselated plane geometry
  static buildGeomtery() {

    KinectGeometry.geo = new THREE.Geometry();
    KinectGeometry.geo.uvsNeedUpdate = true;

    for (let y = 0; y < VERTS_TALL; y++) {
      for (let x = 0; x < VERTS_WIDE; x++) {
        KinectGeometry.geo.vertices.push(
          new THREE.Vector3((-640 + x * 5), (480 - y * 5), 0));
      }
    }
    for (let y = 0; y < VERTS_TALL - 1; y++) {
      for (let x = 0; x < VERTS_WIDE - 1; x++) {
        KinectGeometry.geo.faces.push(
          new THREE.Face3(
            x + y * VERTS_WIDE,
            x + (y + 1) * VERTS_WIDE,
            (x + 1) + y * (VERTS_WIDE)
          ));
        KinectGeometry.geo.faces.push(
          new THREE.Face3(
            x + 1 + y * VERTS_WIDE,
            x + (y + 1) * VERTS_WIDE,
            (x + 1) + (y + 1) * (VERTS_WIDE)
          ));
      }
    }
  }
}

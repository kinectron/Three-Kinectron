'use strict'

//Only for debugging, make sure to comment out for production
// import * as THREE from 'three'

import ShaderParams from './shaderParams';
import testImage from './test/image_webp1';

const glsl = require('glslify');

export default class KinectGeometry {

  constructor(_type = 'mesh',
              vertsWide = 512,
              vertsTall = 424) {

    //Load the shaders
    let kinectronFrag = glsl.file('./shaders/kinectron.frag');
    let kinectronVert = glsl.file('./shaders/kinectron.vert');


    //Build the geometry but only once! even for multipule instances
    if (!KinectGeometry.geo) {
      KinectGeometry.buildGeomtery(vertsWide, vertsTall);
    }

    //Create the material
    this.material = new THREE.ShaderMaterial({
      uniforms: ShaderParams,
      vertexShader: kinectronVert,
      fragmentShader: kinectronFrag,
      transparent: true
    });

    //Make the shader material double sided
    this.material.side = THREE.DoubleSide;

    //Switch a few things based on selected rendering type and create the mesh
    this.buildMesh(_type);

    //Feed the stream and create a THREE.texture
    this.createTexture(testImage);

    //Setup a three clock in case we need time in our shaders - get's updated only if update() is called recursively
    this.clock = new THREE.Clock();

    //Expose the class as an object inside the THREE Object3D
    this.mesh.kinectron = this;

    //Return the THREE Object3D instance for the mesh so you can just 'scene.add()' it
    return this.mesh

  }

  /***************
   * Class methods
   ***************/

  //Change rendering type
  buildMesh(type) {
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
  static buildGeomtery(VERTS_WIDE, VERTS_TALL) {
    KinectGeometry.geo = new THREE.PlaneBufferGeometry(5, 4, VERTS_WIDE, VERTS_TALL);
  }

  update() {
    this.mesh.material.uniforms.time.value = this.clock.getElapsedTime();
  }

  createTexture(imageStream){

    //Create an image element
    const toImage = new Image();
    toImage.src = imageStream;

    //Image has loaded
    toImage.onload = ()=>{
      
      //Create a three texture out of the image element
      const texture = new THREE.Texture(toImage);

      //Make sure to set update to true!
      texture.needsUpdate = true;

      //Filter the texture
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      //Format and type
      texture.format = THREE.RGBAFormat;

      //Assign it to the shader program
      this.material.uniforms.depthMap.value = texture;
      this.material.uniforms.texSize.value = new THREE.Vector2(texture.width, texture.height);

      console.log("Texture set", texture);
    }

  }
}

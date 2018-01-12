'use strict'

import ShaderParams from './util/shaderParams';
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
    this.bind(testImage);

    //States
    this.isRunning = true;

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

   setDisplacement(amount){
     this.mesh.material.uniforms.displacement.value = amount;
   }

   setBrightness(amount){
     this.mesh.material.uniforms.brightness.value = amount;
   }

   setContrast(amount){
     this.mesh.material.uniforms.contrast.value = amount;
   }

   setOpacity(opacity){
     this.mesh.material.uniforms.opacity.value = opacity;
   }

   setPointSize(size){
     if(this.mesh.material.uniforms.isPoints.value){
       this.mesh.material.uniforms.pointSize.value = size;
     } else {
       console.warn("Point size can only be changed when rendering points");
     }
   }

   setLineWidth(width){
     if(this.mesh.material.wireframe){
       this.mesh.material.wireframeLinewidth = width;
     } else {
       console.warn("Line width can only be changed when rendering wireframe");
     }
   }

   pause(){
     if(this.isRunning){
       this.isRunning = false;
     } else {
       console.warn("The rendering is already paused");
     }
   }

   play(){
     if(!this.isRunning){
       this.isRunning = true;
     } else {
       console.warn("The rendering is already playing");
     }
   }

   //If time is needed in the shader this should be called in the render() loop
   update() {
     this.mesh.material.uniforms.time.value = this.clock.getElapsedTime();
   }

   //Main function to bind a feed to an instance of the class ( e.g instance.bind(networkStream); )
   bind(imageStream){

     //Create an image element
     let toImage = new Image();
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
       if(this.isRunning){
         this.material.uniforms.depthMap.value = texture;
         this.material.uniforms.texSize.value = new THREE.Vector2(texture.width, texture.height);
       }

       //Clear the element from memory
       toImage = null;
     }
   }

  /*
  * Utils
  */

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


}

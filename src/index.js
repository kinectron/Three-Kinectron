//Import the class
import KinectGeometry from './kinectronForThree';

//If three.js is in the global scope attach it
if (THREE){
  THREE.KinectGeometry = KinectGeometry;
} else {
  console.log('Three.js was not found, perhaps you forgot to include it?');
}

# Kinectron for Three.js
A plugin for working with [Kinectron](https://github.com/kinectron/kinectron) streams in [Three.js](https://github.com/mrdoob/three.js)
1. [Usage](#usage)
1. [Contribute](#contribute)
![Kinectron](https://github.com/juniorxsound/Three-Kinectron/blob/master/docs/simple.png)


## Usage
You can create geomtery from the Kinect's depth feed by simply:
```js
var kinectGeo = THREE.KinectronGeometry("mesh");
```
You can choose the rendering type by changing the first argument to ```"mesh" / "wire" / "points"```

And then simply add it your Three.js scene:
```js
scene.add(kinectGeo);
```

## Contribute
Fork/Clone the repository and ```npm install``` all dependencies
### Build system commands:
- ```npm run start``` uses [concurrently](https://github.com/kimmobrunfeldt/concurrently) to run both an [http-server](https://www.npmjs.com/package/http-server) and a [watchify](https://www.npmjs.com/package/watchify) build opreation on every save to ```dist/kinectron.three.js```.
- ```npm run build``` builds a minified version of the plugin once and saves it to ```dist/kinectron.three.min.js```

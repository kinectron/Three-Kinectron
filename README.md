# Kinectron for Three.js

**NOTE! This repo was created with Version 0, which is now unmaintained. It has not been tested with the current Version 1.0.0**

A plugin for working with the [Kinectron](https://github.com/kinectron/kinectron) RGBD stream in [Three.js](https://github.com/mrdoob/three.js)

1. [Usage](#usage)
1. [Contribute](#contribute)
   ![Kinectron](https://github.com/juniorxsound/Three-Kinectron/blob/add_ktron/assets/Screen%20Shot%202018-01-29%20at%208.39.55%20PM.png)

## Usage

You can create geomtery from the Kinect's RGBD feed by simply:

```js
const kinectGeo = THREE.KinectGeometry("mesh");
```

You can choose the rendering type by changing the first argument to `"mesh" / "wire" / "points"`

And then simply add it your Three.js scene:

```js
scene.add(kinectGeo);
```

You would need to also bind the incoming Kinect image to the '''kinectGeo''' instance

```js
function onNewKinectFrame(ktronImg) {
  kinectronGeo.kinectron.bind(ktronImg.src);
}
```

For further reference use the [simple example](https://github.com/juniorxsound/Three-Kinectron/blob/master/examples/simple.html)

### Class methods:

All class methods are available on the kinectron property of the THREE.KinectGeometry instance

```js
const kinectGeo = THREE.KinectGeometry("mesh");
kinectGeo.kinectron.setDisplacement(30.0);
```

- `.setDisplacement(amount)` - Increase or decrease the amount of displacement on the Z axis (Default value is 1.0).
- `.setBrightness(amount)` - Increase or decrease the brightness of the texture (Default value is 0.0).
- `.setContrast(amount)` - Increase or decrease the contrast of the texture (Default value is 1.0).
- `.setOpacity(opacity)` - Increase or decrease the opacity of the texture (Default value is 1.0).
- `.setPointSize(opacity)` - Increase or decrease the point size (Only when rendering points, "points").
- `.setLineWidth(width)` - Increase or decrease the line width (Only when rendering wireframe, "wire").
- `.pause()` - Pause the rendering of the Kinectron stream, keeps the last frame.
- `.play()` - Resume the rendering of the Kinectron stream.
- `.bind(imageStream)` - Bind a Kinectron image stream to the material, needs to be called everytime a new frame arrives.
- `.update()` - Calling the update method in the render loop will update the time uniform in the shader.

## Contribute

Fork/Clone the repository, make sure to use the `--recursive` flag when you clone to clone submodules too, and `npm install` all dependencies

### Build system commands:

- `npm run start` uses [concurrently](https://github.com/kimmobrunfeldt/concurrently) to run both an [http-server](https://www.npmjs.com/package/http-server) and a [watchify](https://www.npmjs.com/package/watchify) build opreation on every save to `dist/kinectron.three.js`.
- `npm run build` builds a minified version of the plugin once and saves it to `dist/kinectron.three.min.js`

> Written by [juniorxsound](https://github.com/juniorxsound) based on [DepthKit.js](https://github.com/juniorxsound/DepthKit.js) as a part XStory grant in ITP, NYU


// Uniforms
uniform bool isPoints;
uniform vec2 texSize;

//Kinect params
uniform float fx;
uniform float fy;
uniform float cx;
uniform float cy;

// Texture maps
uniform sampler2D depthMap;

//Per vertex interpolation passed to the fragment shader
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

void main() {

    vUv = uv;
    vPos = (modelMatrix * vec4(position, 1.0 )).xyz;
    vNormal = normalMatrix * normal;

    //Read the depth map
    vec4 texelRead = texture2D(depthMap, uv);

    //Calculate the positions
    vec4 pos = vec4(position.x, position.y, texelRead.r, 1.0);

    if(isPoints){
        gl_PointSize = 1.0;
    }

    gl_Position = projectionMatrix * modelViewMatrix * pos;

}

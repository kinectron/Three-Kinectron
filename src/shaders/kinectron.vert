
// Uniforms
uniform bool isPoints;
uniform vec2 texSize;
uniform float displacement;

// Texture maps
uniform sampler2D depthMap;

uniform float pointSize;

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
    vec4 pos = vec4(position.x,
                    position.y,
                    (-texelRead.a) * displacement,
                    1.0);

    if(isPoints){
        gl_PointSize = pointSize;
    }

    gl_Position = projectionMatrix * modelViewMatrix * pos;

}

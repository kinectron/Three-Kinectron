
// State uniforms
uniform bool isPoints;

// Texture maps
uniform sampler2D depthMap;

//Per vertex interpolation passed to the fragment shader
varying vec2 vUv;

void main() {

    vUv = uv;

    vec3 pos = position;

    vec4 texelRead = texture2D(depthMap, uv);

    pos.z = texelRead.r;

    if(isPoints){
        gl_PointSize = 1.0;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);

}

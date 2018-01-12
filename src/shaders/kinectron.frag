
// Texture maps
uniform sampler2D depthMap;

//State uniforms
uniform float colorDepthMix;

//Material params
uniform float opacity;
uniform float brightness;
uniform float contrast;

//Interpolated per fragment values
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

//Thanks to this excelent post - http://alaingalvan.tumblr.com/post/79864187609/glsl-color-correction-shaders
vec3 brightnessContrast(vec3 value, float brightness, float contrast)
{
    return (value - 0.5) * contrast + 0.5 + brightness;
}

void main()
{

    //Read the all the texels
    vec4 texelRead = texture2D(depthMap, vUv);

    //Blend beween the depth and the color based on a float uniform (for easy depth rendering just set colorDepthMix to 1.0)
    vec3 colorMixer = mix(texelRead.rgb, vec3(texelRead.a), colorDepthMix);

    //If the color feed is !almost! data black don't render it(sample only RGB)
    if(texelRead.r < 0.01) discard;

    //Render the output
    gl_FragColor = vec4(brightnessContrast(colorMixer, brightness, contrast), opacity);

}

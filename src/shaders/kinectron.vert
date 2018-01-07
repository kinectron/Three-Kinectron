uniform bool isPoints;

void main() {

    if(isPoints){
        gl_PointSize = 1.0;
    }

    gl_Position = projectionMatrix * modelViewMatrix * position;
}

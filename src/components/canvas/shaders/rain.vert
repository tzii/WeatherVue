uniform float time;
uniform float rangeY;

attribute float speed;
attribute vec3 velocity;

varying float vAlpha;

void main() {
    vAlpha = 1.0;
    
    vec3 pos = position;
    
    // Animate position
    pos.y -= time * speed;
    pos.x += time * velocity.x;
    pos.z += time * velocity.z;
    
    // Loop
    float top = rangeY / 2.0;
    float bottom = -rangeY / 2.0;
    
    if (pos.y < bottom) {
        pos.y = top - mod(bottom - pos.y, rangeY);
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 2.0 * (300.0 / -mvPosition.z); // Scale by distance
    gl_Position = projectionMatrix * mvPosition;
}

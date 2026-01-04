import * as THREE from 'three'
import vertexShader from './shaders/rain.vert?raw'
import fragmentShader from './shaders/rain.frag?raw'

export interface ParticleConfig {
  count: number
  color: number
  speed: number
  range: { x: number; y: number; z: number }
  size: number
}

export class ParticleSystem {
  mesh: THREE.Points
  geometry: THREE.BufferGeometry
  material: THREE.ShaderMaterial
  private count: number
  // private rangeY: number // Removed unused

  constructor(config: ParticleConfig) {
    this.count = config.count
    // this.rangeY = config.range.y // Removed unused

    // Geometry
    this.geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(this.count * 3)
    const speeds = new Float32Array(this.count)
    const velocities = new Float32Array(this.count * 3)

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * config.range.x
      positions[i3 + 1] = (Math.random() - 0.5) * config.range.y
      positions[i3 + 2] = (Math.random() - 0.5) * config.range.z

      speeds[i] = config.speed * (0.5 + Math.random() * 0.5)
      
      // Slight wind variation
      velocities[i3] = (Math.random() - 0.5) * 2
      velocities[i3 + 1] = -1 // Falling down
      velocities[i3 + 2] = (Math.random() - 0.5) * 2
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1))
    this.geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))

    // Material
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(config.color) },
        rangeY: { value: config.range.y }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    this.mesh = new THREE.Points(this.geometry, this.material)
  }

  update(deltaTime: number) {
    this.material.uniforms.time.value += deltaTime
  }

  setColor(color: number) {
    this.material.uniforms.color.value.setHex(color)
  }

  setSpeed(_speed: number) {
    // Requires rebuilding buffer or attribute update, usually overkill for simple weather changes
    // Alternatively, update a uniform multiplier
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}

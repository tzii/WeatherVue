/**
 * Sonification Service
 * Translates weather data into sound using the Web Audio API.
 */

class SonificationService {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private oscillators: Map<string, OscillatorNode> = new Map()

  private init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.value = 0.1 // Default low volume
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(volume / 100, this.audioContext!.currentTime, 0.1)
    }
  }

  /**
   * Play a brief tone based on temperature
   */
  public playTemperatureTone(temp: number) {
    this.init()
    if (!this.audioContext || !this.masterGain) return

    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    // Map temp (-20 to 40) to frequency (200Hz to 800Hz)
    const freq = 200 + ((temp + 20) / 60) * 600
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime)
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime)
    gain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start()
    osc.stop(this.audioContext.currentTime + 0.5)
  }

  /**
   * Ambient weather sounds (simulated)
   */
  public updateAmbientWeather(_type: string, _intensity: number) {
    this.init()
    if (!this.audioContext || !this.masterGain) return

    // This is a simplified placeholder. 
    // In a real "award winning" app, you'd use white noise generators 
    // and filters to simulate rain/wind/etc.
  }

  public stopAll() {
    this.oscillators.forEach(osc => osc.stop())
    this.oscillators.clear()
  }
}

export const sonification = new SonificationService()

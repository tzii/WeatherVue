/**
 * Haptic Feedback Utility
 * Uses the Vibration API to provide tactile feedback on supported devices.
 */

export const Haptics = {
  /**
   * Light tap (impact)
   */
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
  },

  /**
   * Medium tap
   */
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20)
    }
  },

  /**
   * Heavy tap
   */
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  },

  /**
   * Error/Success patterns
   */
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50])
    }
  },

  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 30, 10])
    }
  },

  /**
   * Selection change (very light)
   */
  selection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5)
    }
  }
}

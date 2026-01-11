import { ref, onUnmounted, type Ref } from 'vue'

export const useFocusTrap = (containerRef: Ref<HTMLElement | null>) => {
  const previousActiveElement = ref<HTMLElement | null>(null)
  
  const getFocusableElements = () => {
    if (!containerRef.value) return []
    
    const selectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')
    
    return Array.from(containerRef.value.querySelectorAll<HTMLElement>(selectors))
  }
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return
    
    const focusable = getFocusableElements()
    if (focusable.length === 0) return
    
    const firstElement = focusable[0]
    const lastElement = focusable[focusable.length - 1]
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }
  
  const activate = () => {
    previousActiveElement.value = document.activeElement as HTMLElement
    document.addEventListener('keydown', handleKeyDown)
    
    const focusable = getFocusableElements()
    if (focusable.length > 0) {
      focusable[0]?.focus()
    }
  }
  
  const deactivate = () => {
    document.removeEventListener('keydown', handleKeyDown)
    previousActiveElement.value?.focus()
  }
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
  
  return {
    activate,
    deactivate
  }
}


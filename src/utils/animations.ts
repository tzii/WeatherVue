import gsap from 'gsap'

export const fadeIn = (el: Element, duration = 0.5, delay = 0) => {
  return gsap.fromTo(el, 
    { opacity: 0 },
    { opacity: 1, duration, delay, ease: 'power2.out' }
  )
}

export const fadeInUp = (el: Element, duration = 0.6, delay = 0) => {
  return gsap.fromTo(el,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration, delay, ease: 'power3.out' }
  )
}

export const staggerFadeInUp = (elements: Element[], stagger = 0.1) => {
  return gsap.fromTo(elements,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, stagger, duration: 0.5, ease: 'power2.out' }
  )
}

export const slideInRight = (el: Element, duration = 0.5) => {
  return gsap.fromTo(el,
    { x: 50, opacity: 0 },
    { x: 0, opacity: 1, duration, ease: 'expo.out' }
  )
}

export const scaleIn = (el: Element) => {
  return gsap.fromTo(el,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
  )
}

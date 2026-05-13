import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('has-custom-cursor')

    const pos  = { x: -300, y: -300 }
    const rPos = { x: -300, y: -300 }
    let raf
    let isHover = false

    /* ── appearance helpers ─────────────────── */
    const applyDefault = () => {
      dot.style.width  = '11px'
      dot.style.height = '11px'
      dot.style.backgroundColor = '#2d4f3a'
      dot.style.boxShadow = '0 0 0 2.5px rgba(255,255,255,0.45), 0 0 14px rgba(45,79,58,0.55)'
      ring.style.width  = '40px'
      ring.style.height = '40px'
      ring.style.borderColor       = 'rgba(45,79,58,0.70)'
      ring.style.backgroundColor   = 'transparent'
      ring.style.boxShadow         = 'none'
    }

    const applyHover = () => {
      dot.style.width  = '15px'
      dot.style.height = '15px'
      dot.style.backgroundColor = '#4a7c59'
      dot.style.boxShadow = '0 0 0 2.5px rgba(255,255,255,0.5), 0 0 18px rgba(74,124,89,0.65)'
      ring.style.width  = '54px'
      ring.style.height = '54px'
      ring.style.borderColor     = 'rgba(45,79,58,0.85)'
      ring.style.backgroundColor = 'rgba(45,79,58,0.08)'
      ring.style.boxShadow       = '0 0 16px rgba(45,79,58,0.18)'
    }

    const applyClick = () => {
      dot.style.width  = '8px'
      dot.style.height = '8px'
      dot.style.backgroundColor = '#1a3520'
      ring.style.width  = '28px'
      ring.style.height = '28px'
      ring.style.backgroundColor = 'rgba(45,79,58,0.18)'
    }

    applyDefault()

    /* ── event listeners ───────────────────── */
    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
    }

    const onOver = (e) => {
      const next = !!e.target.closest('a, button, [role="button"], label')
      if (next !== isHover) {
        isHover = next
        isHover ? applyHover() : applyDefault()
      }
    }

    const onDown = () => applyClick()
    const onUp   = () => isHover ? applyHover() : applyDefault()

    /* ── rAF loop ──────────────────────────── */
    const tick = () => {
      rPos.x += (pos.x - rPos.x) * 0.10
      rPos.y += (pos.y - rPos.y) * 0.10
      dot.style.transform  = `translate(${pos.x}px,${pos.y}px) translate(-50%,-50%)`
      ring.style.transform = `translate(${rPos.x}px,${rPos.y}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      document.documentElement.classList.remove('has-custom-cursor')
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Dot — locks to exact cursor position */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 11, height: 11,
          borderRadius: '50%',
          backgroundColor: '#2d4f3a',
          transform: 'translate(-300px,-300px) translate(-50%,-50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          transition: 'width .15s ease, height .15s ease, background-color .15s ease, box-shadow .15s ease',
          boxShadow: '0 0 0 2.5px rgba(255,255,255,0.45), 0 0 14px rgba(45,79,58,0.55)',
        }}
      />
      {/* Ring — trails with lerp */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 40, height: 40,
          borderRadius: '50%',
          border: '2px solid rgba(45,79,58,0.70)',
          backgroundColor: 'transparent',
          transform: 'translate(-300px,-300px) translate(-50%,-50%)',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
          transition: 'width .22s ease, height .22s ease, border-color .22s ease, background-color .22s ease, box-shadow .22s ease',
        }}
      />
    </>
  )
}

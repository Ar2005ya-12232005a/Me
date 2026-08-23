// Polaroid-style 3D flip card with hover tilt & click-to-flip
// Ported 1:1 from the Framer component (https://framer.com/m/Polaroid-Flip-Card-sRW4av.js)
// — same JSX structure, inline styles, spring configs, and default values.
// The only things removed are Framer-editor-only bits (addPropertyControls /
// ControlType from the "framer" package) which don't exist outside Framer
// and have no effect on rendering — everything visual/behavioral is untouched.
import { useState, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// ─── Springs ─────────────────────────────────────────────────────────────────
const TILT_SPRING = { damping: 30, stiffness: 120, mass: 0.8 }
const FLIP_SPRING = { type: 'spring', damping: 24, stiffness: 240, mass: 0.7 }

// ─── Component ───────────────────────────────────────────────────────────────
// Default size in Framer was fixed at 340x400 — wrap this in a container of
// that size (or override via the `style` prop) when using it elsewhere.
export default function PolaroidFlipCard(props) {
  const {
  image = '/me.jpg',
  caption = '',
  backNote = "Believe you can and you're halfway there ♡",
  framePadding = 12,
  bottomPadding = 24,
  frameColor = '#ffffff',
  imageFit = 'cover',
  captionFont,
  captionColor = '#333333',
  noteFont = { fontFamily: '"Edu NSW ACT Cursive", cursive' },
  noteColor = '#333333',
  borderEnabled = false,
  borderColor = '#e0e0e0',
  borderWidth = 1,
  radius = 4,
  shadowStrength = 0.2,
  tiltStrength = 15,
  style
} = props

  const [isFlipped, setIsFlipped] = useState(false)
  const ref = useRef(null)

  // ── Tilt ─────────────────────────────────────────────────────────────
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [tiltStrength, -tiltStrength]), TILT_SPRING)
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-tiltStrength, tiltStrength]), TILT_SPRING)

  const onMove = useCallback(
    e => {
      if (!ref.current) return
      const r = ref.current.getBoundingClientRect()
      mx.set((e.clientX - r.left) / r.width - 0.5)
      my.set((e.clientY - r.top) / r.height - 0.5)
    },
    [mx, my]
  )
  const onLeave = useCallback(() => {
    mx.set(0)
    my.set(0)
  }, [mx, my])
  const onClick = useCallback(() => {
    mx.set(0)
    my.set(0)
    setIsFlipped(f => !f)
  }, [mx, my])

  // ── Derived ──────────────────────────────────────────────────────────
  const border = borderEnabled ? `${borderWidth}px solid ${borderColor}` : 'none'
  const captionHeight = bottomPadding - framePadding
  const innerRadius = Math.max(0, radius - 2)
  const shadow = `0 8px 24px rgba(0,0,0,${shadowStrength}), 0 2px 8px rgba(0,0,0,${shadowStrength * 0.5})`

  const face = {
    position: 'absolute',
    inset: 0,
    background: frameColor,
    borderRadius: radius,
    border,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    overflow: 'hidden',
    boxShadow: shadow
  }

  const textBase = {
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    textAlign: 'center'
  }

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ ...style, position: 'relative', width: '100%', height: '100%', perspective: 1000, cursor: 'pointer' }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          rotateX: tiltX,
          rotateY: tiltY
        }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={FLIP_SPRING}
          style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}
        >
          <div style={face}>
            <div
              style={{
                position: 'absolute',
                top: framePadding,
                left: framePadding,
                right: framePadding,
                bottom: bottomPadding,
                borderRadius: innerRadius,
                overflow: 'hidden',
                background: imageFit === 'contain' ? '#f0f0f0' : 'transparent'
              }}
            >
              <img
                src={image}
                alt={caption || 'Polaroid photo'}
                draggable={false}
                loading="lazy"
                style={{
                  display: 'block',
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: imageFit,
                  objectPosition: 'center',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              />
            </div>

            {caption && (
              <div
                style={{
                  position: 'absolute',
                  left: framePadding + 4,
                  right: framePadding + 4,
                  bottom: 0,
                  height: captionHeight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <p
                  style={{
                    ...textBase,
                    width: '100%',
                    lineHeight: 1.3,
                    fontSize: 20,
                    ...(captionFont && typeof captionFont === 'object' ? captionFont : {}),
                    color: captionColor
                  }}
                >
                  {caption}
                </p>
              </div>
            )}
          </div>

          <div style={{ ...face, transform: 'rotateY(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p
              style={{
                ...textBase,
                maxWidth: '80%',
                lineHeight: 1.5,
                fontSize: 20,
                ...(noteFont && typeof noteFont === 'object' ? noteFont : {}),
                color: noteColor
              }}
            >
              {backNote}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
import React, { useRef, useState, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplashCursor from './SplashCursor'

gsap.registerPlugin(ScrollTrigger)

const ACCENT = '#2f6bff' // connector / glow accent — blue
const AUTOPLAY_INTERVAL = 2800 // ms between auto-advances
const AUTOPLAY_RESUME_DELAY = 1400 // ms of quiet before autoplay resumes after interaction

const EXPERIENCES = [
  { id: 1, role: 'Contributor', company: 'GIRLSCRIPT SUMMER OF CODE', type: 'PART-TIME · 2 MOS', period: 'MAY 2026 – PRESENT', skills: ['OPEN SOURCE', 'GIT', 'COLLABORATION'], active: true },
  { id: 2, role: 'AIML Intern', company: 'KELTRON KNOWLEDGE CENTER', type: 'INTERNSHIP · 2 MOS', period: 'MAY 2026 – PRESENT', skills: ['MACHINE LEARNING', 'PYTHON', 'AI'], active: true },
  { id: 3, role: 'Lead & Coordinator-Design Team', company: 'DATA SCIENCE CLUB, VIT BHOPAL', type: 'CLUB · 10 MOS', period: 'SEP 2025 – PRESENT', skills: ['UI/UX', 'FIGMA', 'CANVA', 'PHOTOSHOP', 'TEAM LEADERSHIP'], active: true },
  { id: 4, role: 'Engineering Student', company: 'VIT BHOPAL UNIVERSITY', type: 'FULL-TIME · 1 YR 10 MOS', period: 'SEP 2024 – PRESENT', skills: ['MATLAB', 'PYTHON', 'DSA', 'DBMS', 'CN', 'OS'], active: true },
  { id: 5, role: 'Core Member - Content Team', company: 'UX CLUB', type: 'CLUB · 9 MOS', period: 'SEP 2025 – MAY 2026', skills: ['CONTENT STRATEGY', 'UX WRITING', 'DESIGN'], active: false },
  { id: 6, role: 'Frontend Developer', company: 'CODEALPHA', type: 'INTERNSHIP · 2 MOS', period: 'FEB 2025 – MAR 2025', skills: ['HTML', 'CSS', 'JAVASCRIPT'], active: false },
  { id: 7, role: 'Python Developer', company: 'YBI FOUNDATION', type: 'INTERNSHIP · 1 MOS', period: 'FEB 2025', skills: ['PYTHON', 'DATA SCIENCE'], active: false },
]

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max)
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

function Connector({ from, to }) {
  const midX = (from.x + to.x) / 2
  const controlY = Math.min(from.y, to.y) - 46
  const path = `M ${from.x} ${from.y} Q ${midX} ${controlY} ${to.x} ${to.y}`

  const angle = Math.atan2(to.y - controlY, to.x - midX)
  const ah = 7
  const a1 = angle + Math.PI * 0.82
  const a2 = angle - Math.PI * 0.82

  return (
    <g>
      <path d={path} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
      <path
        d={`M ${to.x} ${to.y} L ${to.x + ah * Math.cos(a1)} ${to.y + ah * Math.sin(a1)}
            M ${to.x} ${to.y} L ${to.x + ah * Math.cos(a2)} ${to.y + ah * Math.sin(a2)}`}
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  )
}

function StepCard({ exp, index, isActive, cardWidth, cardHeight }) {
  return (
    <div
      style={{
        position: 'relative',
        width: cardWidth,
        height: cardHeight,
        borderRadius: 20,
        background: '#ffffff',
        border: isActive ? `1px solid ${ACCENT}55` : '1px solid rgba(20,20,30,0.06)',
        boxShadow: isActive
          ? `0 30px 60px -20px rgba(47,107,255,0.28), 0 6px 18px rgba(20,20,30,0.08)`
          : '0 16px 36px -20px rgba(20,20,30,0.16), 0 4px 10px rgba(20,20,30,0.05)',
        padding: '20px 20px 18px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
      }}
    >
      <span
        style={{
          fontFamily: '"Google Sans", sans-serif',
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#14151a',
          letterSpacing: '-0.01em',
        }}
      >
        {pad2(index + 1)}
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: '"Edu NSW ACT Cursive", cursive',
            fontWeight: 600,
            fontSize: '1.02rem',
            lineHeight: 1.25,
            color: '#14151a',
          }}
        >
          {exp.role}
        </span>
        <span
          style={{
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 500,
            fontSize: '0.73rem',
            lineHeight: 1.3,
            color: '#4a4d57',
          }}
        >
          {exp.company}
        </span>
        <span
          style={{
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 400,
            fontSize: '0.66rem',
            lineHeight: 1.3,
            color: '#8a8d97',
          }}
        >
          {exp.period}
        </span>
      </div>
    </div>
  )
}

export default function ExperienceCarousel({ steps = EXPERIENCES }) {
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardRefs = useRef([])
  const didMountRef = useRef(false)
  const autoplayTimerRef = useRef(null)
  const resumeTimerRef = useRef(null)

  const [frameWidth, setFrameWidth] = useState(1100)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [autoplayPaused, setAutoplayPaused] = useState(false)
  const dragState = useRef({ startX: 0, startDrag: 0 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setFrameWidth(el.getBoundingClientRect().width))
    ro.observe(el)
    setFrameWidth(el.getBoundingClientRect().width)
    return () => ro.disconnect()
  }, [])

  const isMobile = frameWidth < 640
  const cardWidth = clamp(frameWidth * (isMobile ? 0.74 : 0.24), 230, 300)
  // Trimmed from 300/310 -> 258/268: shorter cards mean a shorter track,
  // which is most of what makes the whole section feel tall.
  const cardHeight = isMobile ? 258 : 268
  const gap = isMobile ? 24 : 56
  const step = cardWidth + gap

  const goTo = useCallback(i => setActiveIndex(clamp(i, 0, steps.length - 1)), [steps.length])
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  const baseOffset = frameWidth / 2 - cardWidth / 2 - activeIndex * step

  const pauseAutoplay = useCallback(() => {
    setAutoplayPaused(true)
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => setAutoplayPaused(false), AUTOPLAY_RESUME_DELAY)
  }, [])

  const onPointerDown = e => {
    pauseAutoplay()
    setIsDragging(true)
    dragState.current = { startX: e.clientX, startDrag: dragX }
    trackRef.current?.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = e => {
    if (!isDragging) return
    const delta = e.clientX - dragState.current.startX
    setDragX(dragState.current.startDrag + delta)
  }
  const endDrag = () => {
    if (!isDragging) return
    setIsDragging(false)
    const movedSteps = Math.round(-dragX / step)
    if (movedSteps !== 0) goTo(activeIndex + movedSteps)
    setDragX(0)
  }

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft') {
        pauseAutoplay()
        prev()
      }
      if (e.key === 'ArrowRight') {
        pauseAutoplay()
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, pauseAutoplay])

  useEffect(() => {
    if (!sectionRef.current || !headingRef.current) return

    gsap.set(headingRef.current, { opacity: 0, y: 28, scale: 0.9 })
    cardRefs.current.forEach(el => {
      if (el) gsap.set(el, { opacity: 0, y: 22, scale: 0.94 })
    })

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({
          onComplete: () => setHasEntered(true),
        })

        tl.to(headingRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'back.out(1.7)',
        })

        tl.to(
          cardRefs.current.filter(Boolean),
          {
            opacity: (i, target) => {
              const idx = cardRefs.current.indexOf(target)
              return Math.abs(idx - activeIndex) > 1 ? 0.35 : 1
            },
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.03,
            ease: 'back.out(1.6)',
          },
          '-=0.25'
        )
      },
    })

    return () => trigger.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const targetOpacity = Math.abs(i - activeIndex) > 1 ? 0.35 : 1
      gsap.to(el, { opacity: targetOpacity, duration: 0.3, ease: 'power2.out' })
    })
  }, [activeIndex])

  useEffect(() => {
    if (!hasEntered || autoplayPaused) return

    autoplayTimerRef.current = setTimeout(() => {
      setActiveIndex(i => (i + 1) % steps.length)
    }, AUTOPLAY_INTERVAL)

    return () => clearTimeout(autoplayTimerRef.current)
  }, [hasEntered, autoplayPaused, activeIndex, steps.length])

  useEffect(() => {
    return () => {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }
  }, [])

  const centers = steps.map((_, i) => ({
    x: baseOffset + dragX + i * step + cardWidth / 2,
    y: 24,
  }))

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        zIndex: 10,
        isolation: 'isolate',
        width: '100%',
        // Top padding pulled way in (90px -> ~36-48px) so the heading
        // sits noticeably higher; bottom padding trimmed too
        // (110px -> ~56-72px), all scaling down further on small screens.
        padding: 'clamp(32px, 6vw, 48px) clamp(16px, 4vw, 24px) clamp(48px, 8vw, 72px)',
        background: '#ffffff',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          overflow: 'hidden',
          transform: 'translateZ(0)',
          contain: 'paint',
        }}
      >
        {/* <SplashCursor COLOR="#2f6bff" /> */}
      </div>

      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          width: 460,
          height: 460,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ACCENT}26 0%, ${ACCENT}0f 40%, transparent 70%)`,
          filter: 'blur(6px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <h2
        ref={headingRef}
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          // 64px -> 36px: heading no longer floats a huge gap above the
          // cards, and combined with the smaller top section padding
          // above, it reads as sitting noticeably closer to the top.
          margin: '0 0 36px',
          fontFamily: '"Google Sans", sans-serif',
          fontWeight: 500,
          fontSize: 'clamp(2rem, 4.8vw, 3.1rem)',
          letterSpacing: '-0.01em',
          color: '#14151a',
        }}
      >
        Experience
      </h2>

      <div
        ref={wrapRef}
        onMouseEnter={() => setAutoplayPaused(true)}
        onMouseLeave={() => setAutoplayPaused(false)}
        // 90px of headroom -> 56px, matching the shorter cards
        style={{ position: 'relative', zIndex: 2, width: '100%', height: cardHeight + 56 }}
      >
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'pan-y',
          }}
        >
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {centers.slice(0, -1).map((c, i) => (
              <Connector
                key={i}
                from={{ x: c.x + cardWidth / 2 - 10, y: c.y }}
                to={{ x: centers[i + 1].x - cardWidth / 2 + 10, y: centers[i + 1].y }}
              />
            ))}
          </svg>

          {steps.map((exp, i) => {
            const isActive = i === activeIndex
            return (
              <div
                key={exp.id}
                ref={el => (cardRefs.current[i] = el)}
                onClick={() => {
                  if (!isActive) {
                    pauseAutoplay()
                    goTo(i)
                  }
                }}
                style={{
                  position: 'absolute',
                  left: baseOffset + dragX + i * step,
                  top: 0,
                  zIndex: 2,
                  cursor: isActive ? 'default' : 'pointer',
                  transition: isDragging ? 'none' : 'left 0.5s cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <StepCard exp={exp} index={i} isActive={isActive} cardWidth={cardWidth} cardHeight={cardHeight} />
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              pauseAutoplay()
              goTo(i)
            }}
            aria-label={`Go to experience ${i + 1}`}
            style={{
              width: i === activeIndex ? 20 : 7,
              height: 7,
              border: 'none',
              borderRadius: 999,
              padding: 0,
              background: i === activeIndex ? ACCENT : '#d8dae0',
              cursor: 'pointer',
              transition: 'width 0.4s ease, background 0.4s ease',
            }}
          />
        ))}
      </div>
    </section>
  )
}
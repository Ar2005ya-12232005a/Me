import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplashCursor from './SplashCursor'

gsap.registerPlugin(ScrollTrigger)

const LEFT_PILLS = [
  { label: 'Creative UI/UX Design', color: '#ff6b4a' },
  { label: 'Responsive Web Design', color: '#3b82f6' },
  { label: 'Clean & Modern Layouts', color: '#22c55e' },
]

const RIGHT_PILLS = [
  { label: 'User Experience', color: '#eab308' },
  { label: 'Visual Aesthetics', color: '#ec4899' },
  { label: 'Smooth Animations', color: '#8b5cf6' },
]

const HEADING_WORDS =
  "Focus is on blending clear strategy, thoughtful design, and user empathy to craft experiences that solve real problems"
    .split(' ')

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="10" height="10" fill="#ffffff" aria-hidden="true">
    <path d="M12 2l2.6 6.9L22 10l-5.5 4.8L18 22l-6-3.9L6 22l1.5-7.2L2 10l7.4-1.1L12 2z" />
  </svg>
)

const Pill = ({ label, color, align, index }) => {
  // Curve the pills into an arc: middle pill sits closest to the heading,
  // outer pills drift outward and rotate slightly away.
  const curveOffset = [18, 0, 18][index] ?? 0
  const rotate = align === 'right' ? [6, 0, -6][index] : [-6, 0, 6][index]
  const translateX = align === 'right' ? curveOffset : -curveOffset

  return (
    <div
      className="focus-pill"
      style={{
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        transform: `translateX(${translateX ?? 0}px) rotate(${rotate ?? 0}deg)`,
      }}
    >
      {align !== 'right' && (
        <span className="focus-pill-dot" style={{ background: color }}>
          <StarIcon />
        </span>
      )}
      <span className="focus-pill-label">{label}</span>
      {align === 'right' && (
        <span className="focus-pill-dot" style={{ background: color }}>
          <StarIcon />
        </span>
      )}
    </div>
  )
}

const FocusStatement = () => {
  const [hoverIndex, setHoverIndex] = useState(null)

  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const leftPillRefs = useRef([])
  const rightPillRefs = useRef([])

  // Two distinct entrances, both fast and scroll-triggered once:
  // - Heading words fade/lift in one after another in quick succession
  //   (a tight stagger, not a slow reveal), so the sentence "types" itself
  //   in fast.
  // - Pills start rotated hard to one side up near the top, as if pinned
  //   there, then swing down into their resting arc pose with an elastic
  //   ease — reads like they're hanging from a thread and settling after
  //   a push.
  useEffect(() => {
    if (!sectionRef.current) return

    const words = headingRef.current
      ? gsap.utils.toArray(headingRef.current.querySelectorAll('.focus-word'))
      : []
    const leftPills = leftPillRefs.current.filter(Boolean)
    const rightPills = rightPillRefs.current.filter(Boolean)

    gsap.set(words, { opacity: 0, y: 14 })
    gsap.set(leftPills, { opacity: 0, y: -36, rotate: -55, transformOrigin: 'top center' })
    gsap.set(rightPills, { opacity: 0, y: -36, rotate: 55, transformOrigin: 'top center' })

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline()

        tl.to(words, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.025,
          ease: 'power2.out',
        })
          .to(
            leftPills,
            {
              opacity: 1,
              y: 0,
              rotate: 0,
              duration: 0.65,
              stagger: 0.1,
              ease: 'elastic.out(1, 0.45)',
            },
            '-=0.4'
          )
          .to(
            rightPills,
            {
              opacity: 1,
              y: 0,
              rotate: 0,
              duration: 0.65,
              stagger: 0.1,
              ease: 'elastic.out(1, 0.45)',
            },
            '<'
          )
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <section ref={sectionRef} className="focus-section">
      <style>{`
        .focus-section {
          position: relative;
          overflow: hidden;
          width: 100%;
          background: #ffffff;
          padding: clamp(2.5rem, 7vh, 5rem) clamp(1.5rem, 5vw, 4rem);
        }

        .focus-hallo {
          position: relative;
          z-index: 1;
          margin: 0 0 clamp(0.75rem, 2vh, 1.25rem);
          text-align: center;
          font-family: "Google Sans", sans-serif;
          
          font-weight: 300;
          font-size: clamp(0.95rem, 1.3vw, 1.15rem);
          color: rgba(10, 10, 10, 0.45);
        }

        .focus-row {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(1rem, 3vw, 2.5rem);
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
        }

        .focus-pills {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 0 0 auto;
          width: clamp(150px, 15vw, 190px);
        }

        .focus-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid rgba(10, 10, 10, 0.1);
          border-radius: 999px;
          padding: 8px 14px;
          box-shadow: 0 2px 10px rgba(10, 10, 10, 0.06);
          transition: transform 0.2s ease;
        }

        .focus-pill-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .focus-pill-label {
          font-family: "Google Sans", sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: #0a0a0a;
          white-space: nowrap;
        }

        .focus-heading {
  flex: 1 1 auto;
  max-width: 640px;
  margin: 0;
  text-align: center;
  font-family: "Edu NSW ACT Cursive", cursive;
  font-weight: 500;
  font-size: clamp(1.3rem, 2.6vw, 2rem);
  line-height: 1.45;
}

        .focus-word {
          display: inline-block;
          transition: color 0.25s ease;
          cursor: default;
        }

        @media (max-width: 900px) {
          .focus-pills {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
          }
          .focus-pill {
            transform: none !important;
          }
          .focus-row {
            gap: 1.25rem;
          }
        }

        @media (max-width: 520px) {
          .focus-pill-label {
            font-size: 0.7rem;
          }
        }
      `}</style>

      {/* <SplashCursor COLOR="#1338BE" /> */}

      <p className="focus-hallo">Hello!</p>

      <div className="focus-row">
        <div className="focus-pills">
          {LEFT_PILLS.map((p, i) => (
            <div key={p.label} ref={el => (leftPillRefs.current[i] = el)}>
              <Pill {...p} index={i} />
            </div>
          ))}
        </div>

        <p ref={headingRef} className="focus-heading">
          {HEADING_WORDS.map((word, i) => (
            <span
              key={i}
              className="focus-word"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(prev => (prev === i ? null : prev))}
              style={{ color: hoverIndex === i ? 'rgba(10, 10, 10, 0.35)' : '#0a0a0a' }}
            >
              {word}{' '}
            </span>
          ))}
        </p>

        <div className="focus-pills">
          {RIGHT_PILLS.map((p, i) => (
            <div key={p.label} ref={el => (rightPillRefs.current[i] = el)}>
              <Pill {...p} align="right" index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FocusStatement
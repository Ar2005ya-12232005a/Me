import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const GITHUB_USERNAME = 'Ar2005ya-12232005a'
const ACCENT = '1a4fff'
const CHART_URL = `https://ghchart.rshah.org/${ACCENT}/${GITHUB_USERNAME}`

const GithubContributions = () => {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardRef = useRef(null)
  const svgWrapRef = useRef(null)

  const [svgMarkup, setSvgMarkup] = useState(null)
  const [loadState, setLoadState] = useState('loading') // 'loading' | 'inline' | 'fallback'

  const enteredRef = useRef(false)
  const cellsAnimatedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    fetch(CHART_URL)
      .then((res) => {
        if (!res.ok) throw new Error('bad response')
        return res.text()
      })
      .then((text) => {
        if (cancelled) return
        if (!text.includes('<svg')) throw new Error('not svg')
        setSvgMarkup(text)
        setLoadState('inline')
      })
      .catch(() => {
        if (!cancelled) setLoadState('fallback')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const animateCells = () => {
    if (cellsAnimatedRef.current || !svgWrapRef.current) return
    const cells = svgWrapRef.current.querySelectorAll('svg rect')
    if (!cells.length) return
    cellsAnimatedRef.current = true

    cells.forEach((rect) => {
      rect.setAttribute('rx', '3')
      rect.setAttribute('ry', '3')
    })

    gsap.set(cells, { transformOrigin: 'center center' })
    gsap.fromTo(
      cells,
      { opacity: 0, scale: 0.2 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: 'back.out(2)',
        stagger: {
          each: 0.006,
          from: 'start',
          grid: 'auto',
        },
      }
    )
  }

  // Heading + card entrance — same fromTo/ScrollTrigger pattern used across the site
  useEffect(() => {
    if (!sectionRef.current || !headingRef.current || !cardRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      )

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
            onEnter: () => {
              enteredRef.current = true
              if (loadState === 'inline') animateCells()
            },
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // If the SVG loads after the section already entered view, animate cells immediately
  useEffect(() => {
    if (loadState === 'inline' && enteredRef.current) {
      requestAnimationFrame(() => animateCells())
    }
  }, [loadState])

  return (
    <section
      ref={sectionRef}
      className="github-contributions-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(520px, 78vh, 780px)',
        padding: 'clamp(4.5rem, 12vh, 8rem) clamp(1.5rem, 6vw, 5rem)',
        background: '#ffffff',
        textAlign: 'center',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .github-contributions-section::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(900px, 90vw);
          height: 420px;
          transform: translate(-50%, -50%);
          background: radial-gradient(ellipse at center, rgba(26,79,255,0.08) 0%, rgba(26,79,255,0) 70%);
          pointer-events: none;
          z-index: 0;
        }

        .github-contributions-title,
        .github-contributions-card {
          position: relative;
          z-index: 1;
        }

        .github-contributions-card {
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          border-radius: 10px;
          padding: clamp(1.75rem, 5vw, 2.75rem) clamp(1.5rem, 5vw, 3rem);
          background: linear-gradient(160deg, #f6f8ff 0%, #ffffff 55%);
          border: 1px solid rgba(26,79,255,0.10);
          box-shadow:
            0 24px 50px -24px rgba(26,79,255,0.25),
            0 1px 0 rgba(255,255,255,0.6) inset;
          box-sizing: border-box;
          transition: box-shadow 0.35s ease, transform 0.35s ease;
        }
        .github-contributions-card:hover {
          box-shadow:
            0 28px 60px -22px rgba(26,79,255,0.32),
            0 1px 0 rgba(255,255,255,0.6) inset;
        }

        .github-contributions-card-header {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-bottom: 1.1rem;
        }
        .github-contributions-legend {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          color: #8a8f9c;
        }
        .github-contributions-legend-swatches {
          display: flex;
          gap: 3px;
        }
        .github-contributions-legend-swatch {
          width: 10px;
          height: 10px;
          border-radius: 3px;
        }

        .github-contributions-img-wrap {
          width: 100%;
          border-radius: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .github-contributions-img-wrap svg,
        .github-contributions-img {
          display: block;
          width: 100%;
          height: auto;
          min-width: 600px;
          border-radius: 8px;
        }

        .github-contributions-loading {
          min-width: 600px;
          height: 130px;
          border-radius: 8px;
          background: linear-gradient(90deg, #eef1fb 25%, #f7f9ff 50%, #eef1fb 75%);
          background-size: 200% 100%;
          animation: gh-shimmer 1.4s ease-in-out infinite;
        }
        @keyframes gh-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 760px) {
          .github-contributions-section {
            min-height: auto !important;
            padding: 2.75rem 1.1rem !important;
          }
          .github-contributions-title {
            font-size: 1.4rem !important;
            margin-bottom: 1.5rem !important;
          }
          .github-contributions-card {
            border-radius: 8px;
            padding: 1.1rem 0.9rem !important;
          }
          .github-contributions-card-header {
            justify-content: center;
          }
        }
      `}</style>

      <h2
        ref={headingRef}
        className="github-contributions-title"
        style={{
          margin: '0 0 2.75rem',
          fontSize: 'clamp(1.7rem, 3.4vw, 2.4rem)',
          fontWeight: 600,
          color: '#0a0a0a',
        }}
      >
        GitHub Contributions
      </h2>

      <div ref={cardRef} className="github-contributions-card">
        <div className="github-contributions-card-header">
          <div className="github-contributions-legend">
            <span>Less</span>
            <div className="github-contributions-legend-swatches">
              <span className="github-contributions-legend-swatch" style={{ background: '#ebedf0' }} />
              <span className="github-contributions-legend-swatch" style={{ background: '#9db5ff' }} />
              <span className="github-contributions-legend-swatch" style={{ background: '#4d7bff' }} />
              <span className="github-contributions-legend-swatch" style={{ background: `#${ACCENT}` }} />
              <span className="github-contributions-legend-swatch" style={{ background: '#0032c9' }} />
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="github-contributions-img-wrap" ref={svgWrapRef}>
          {loadState === 'inline' && svgMarkup && (
            <div dangerouslySetInnerHTML={{ __html: svgMarkup }} />
          )}

          {loadState === 'loading' && <div className="github-contributions-loading" />}

          {loadState === 'fallback' && (
            <img
              className="github-contributions-img"
              src={CHART_URL}
              alt="GitHub contribution graph"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default GithubContributions
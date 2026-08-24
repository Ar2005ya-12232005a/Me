import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Replace with your actual GitHub username
const GITHUB_USERNAME = 'Ar2005ya-12232005a'
const ACCENT = '#1a4fff'

const GithubContributions = () => {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !headingRef.current || !cardRef.current) return

    gsap.set(headingRef.current, { opacity: 0, y: 20 })
    gsap.set(cardRef.current, { opacity: 0, y: 32, scale: 0.97 })

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.45 })
          .to(cardRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.55 }, '-=0.25')
      },
    })

    return () => trigger.kill()
  }, [])

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
      }}
    >
      <style>{`
        .github-contributions-card {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          border-radius: 20px;
          padding: clamp(1.75rem, 5vw, 3rem);
          background: linear-gradient(160deg, #f5f8ff 0%, #ffffff 60%);
          border: 1px solid rgba(26,79,255,0.12);
          box-shadow: 0 20px 44px -22px rgba(26,79,255,0.22);
          box-sizing: border-box;
        }
        .github-contributions-img-wrap {
          width: 100%;
          border-radius: 12px;
        }
        .github-contributions-img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 12px;
        }

        /* Mobile only: shrink the section, then zoom into the graph by
           making the image itself wider than its wrapper and letting the
           wrapper scroll horizontally, so nothing is permanently cropped */
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
            border-radius: 14px;
            padding: 1rem 0.85rem !important;
          }
          .github-contributions-img-wrap {
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
          }
          .github-contributions-img {
            /* actually render wider than the wrapper (real zoom, not a
               visual transform) so the extra width is reachable by
               scrolling left/right instead of being clipped */
            width: 160%;
            max-width: 160%;
          }
        }

        @media (max-width: 420px) {
          .github-contributions-img {
            width: 190%;
            max-width: 190%;
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
        <div className="github-contributions-img-wrap">
          <img
            className="github-contributions-img"
            src={`https://github-readme-activity-graph.vercel.app/graph?username=${GITHUB_USERNAME}&bg_color=ffffff&color=${ACCENT.slice(
              1
            )}&line=${ACCENT.slice(1)}&point=${ACCENT.slice(1)}&area=true&area_color=${ACCENT.slice(
              1
            )}&hide_border=true&hide_title=true&custom_title=%20`}
            alt="GitHub contribution graph"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

export default GithubContributions
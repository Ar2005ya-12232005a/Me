import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import SplashCursor from './SplashCursor'
import Card3DStack from './Card3DStack'

const Herosection = () => {
  const navigate = useNavigate()
  const headingRef = useRef(null)
  const subheadingRef = useRef(null)
  const pillRef = useRef(null)
  const stackRef = useRef(null)
  const quoteRef = useRef(null)
  const buttonRef = useRef(null)

  // Hero content is visible immediately on load (no scroll needed), so this
  // plays as a straight entrance sequence on mount rather than being
  // scroll-triggered. The heading pops first — a bit slower and softer now
  // so it reads as a deliberate entrance rather than a snap — then the
  // pill/card-stack/quote sweep in from either side with a slight curve
  // (small rotation) into the bounce, so the stack in the middle reads as
  // the focal point. Nav brand + link entrance now lives in Navbar.jsx
  // since the navbar is shared across every page.
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } })

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 26, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'back.out(1.2)' }
    )
      .fromTo(
        subheadingRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.2)' },
        '-=0.55'
      )
      .fromTo(
        pillRef.current,
        { opacity: 0, x: -50, rotate: -8 },
        { opacity: 1, x: 0, rotate: 0, duration: 0.45 },
        '-=0.35'
      )
      .fromTo(
        stackRef.current,
        { opacity: 0, scale: 0.7, rotate: -10 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.55, ease: 'elastic.out(1, 0.6)' },
        '-=0.3'
      )
      .fromTo(
        quoteRef.current,
        { opacity: 0, x: 50, rotate: 8 },
        { opacity: 1, x: 0, rotate: 0, duration: 0.45 },
        '-=0.4'
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0, y: 20, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35 },
        '-=0.15'
      )

    return () => tl.kill()
  }, [])

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        width: '100%',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 'clamp(2.5rem, 6vh, 5rem)',
      }}
    >
      <style>{`
        .hero-middle-row {
          flex-wrap: wrap;
        }

        .hero-heading-block {
          margin-top: clamp(2.5rem, 6vh, 4.5rem);
        }

        /* Portrait gap — now hosts the 3D card stack. Width is the
           responsive control; height is derived from it via aspect-ratio
           so the stack always has real space to size itself against,
           on every breakpoint. */
        .hero-portrait-space {
          width: clamp(240px, 30vw, 400px);
          aspect-ratio: 3 / 4;
          flex-shrink: 0;
          /* Fixed, responsive leftward shift away from the quote text —
             a direct pixel offset instead of tuning grid-column ratios,
             which was fragile and let the fanned cards overlap the quote. */
          transform: translateX(clamp(-150px, -14vw, -80px));
        }

        @media (max-width: 760px) {
          .hero-section {
            min-height: auto !important;
            padding-bottom: clamp(2rem, 6vh, 3.5rem);
          }
          .hero-heading-block {
            margin-top: clamp(3rem, 10vh, 5rem);
          }
          .hero-middle-row {
            display: flex !important;
            flex: 0 1 auto !important;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1.25rem !important;
            margin-top: clamp(2rem, 8vh, 4rem);
            margin-bottom: clamp(1.5rem, 5vh, 2.5rem);
          }
          .hero-portrait-space {
            width: clamp(210px, 65vw, 300px);
            transform: translateX(clamp(-60px, -12vw, -28px));
          }
          .hero-quote {
            max-width: 320px !important;
          }
          .hero-bottom-row {
            flex-direction: column;
            gap: 1.25rem;
            align-items: center !important;
          }
        }
      `}</style>

      {/* Blob 1 — deep blue, bottom-left corner, spreading up and across */}
      <div
        style={{
          position: 'absolute',
          bottom: '-35%',
          left: '-20%',
          width: '85vw',
          height: '85vh',
          maxWidth: 950,
          maxHeight: 950,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #1a4fff 0%, #3d6fff 50%, #8fb0ff 75%, transparent 92%)',
          filter: 'blur(100px)',
          opacity: 1,
          zIndex: 0,
        }}
      />

      {/* Blob 2 — deep blue, bottom-right corner, mirrors blob 1 */}
      <div
        style={{
          position: 'absolute',
          bottom: '-35%',
          right: '-20%',
          width: '85vw',
          height: '85vh',
          maxWidth: 950,
          maxHeight: 950,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #1a4fff 0%, #3d6fff 50%, #8fb0ff 75%, transparent 92%)',
          filter: 'blur(100px)',
          opacity: 1,
          zIndex: 0,
        }}
      />

      {/* Blob 3 — bottom-center, ties the two corner blobs together and pushes color further up */}
      <div
        style={{
          position: 'absolute',
          bottom: '-45%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '75vw',
          height: '75vh',
          maxWidth: 850,
          maxHeight: 850,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #2f6bff 0%, #5b8fff 55%, transparent 85%)',
          filter: 'blur(110px)',
          zIndex: 0,
        }}
      />

      {/* Splash cursor — white smoke/splash trail confined to the background layer only.
          It renders behind the wash/fade overlays and behind all text, nav, and buttons
          (see zIndex: 0 inside SplashCursor.js), and pointer-events are disabled on it
          so it never intercepts clicks either. */}
      <SplashCursor color="#FFFFFF" />

      {/* Solid wash — sits just above the fade so the blue reads strong right up until it dissolves to white */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 'clamp(200px, 40vh, 460px)',
          background: 'linear-gradient(to bottom, rgba(74,116,255,0) 0%, rgba(74,116,255,0.9) 55%, rgba(74,116,255,0.9) 70%, rgba(74,116,255,0) 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Bottom fade — white only, softens the very base of the section like the reference */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 'clamp(100px, 18vh, 220px)',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Heading block — pinned to the top of the section */}
      <div className="hero-heading-block" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h1
          ref={headingRef}
          className="hero-heading"
          style={{
            margin: 0,
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 600,
            color: '#0a0a0a',
            lineHeight: 1.1,
          }}
        >
          Hi I'm Arya
        </h1>
        <div
          ref={subheadingRef}
          className="hero-subheading"
          style={{
            margin: '4px 0 0',
            fontSize: 'clamp(2.6rem, 6.5vw, 5rem)',
            color: '#0a0a0a',
            lineHeight: 1.1,
          }}
        >
         A...Web Developer
        </div>
      </div>

      {/* Middle row: pill (left) — 3D card stack (left-of-center) — quote
          (right). The center column is intentionally biased left by giving
          the right column more of the 1fr share than the left column —
          true 1fr/1fr would put the stack dead-center. */}
      <div
        className="hero-middle-row"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 1200,
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 'clamp(1rem, 4vw, 3rem)',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
        }}
      >
        {/* Pill — left column, pinned to its own start */}
        <div
          ref={pillRef}
          className="hero-pill-label"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            justifySelf: 'start',
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(10,10,10,0.12)',
            borderRadius: 999,
            padding: '8px 16px',
            color: '#0a0a0a',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
            }}
          />
          Available for new opportunities
        </div>

        {/* Center — the 3D card stack fills this gap and scales itself
            off the space's own width/height (set via CSS above) */}
        <div ref={stackRef} className="hero-portrait-space" style={{ justifySelf: 'center' }}>
          <Card3DStack />
        </div>

        {/* Quote — right column, pinned to its own end */}
        <p
          ref={quoteRef}
          className="hero-body hero-quote"
          style={{
            maxWidth: 260,
            justifySelf: 'end',
            fontSize: 'clamp(0.9rem, 1.3vw, 1rem)',
            fontWeight: 600,
            lineHeight: 1.5,
            color: '#1a1a1a',
            margin: 0,
          }}
        >
          "Design is the quiet art of making the complex feel obvious- "I build
          interfaces that get out of the user's way!"
        </p>
      </div>

      {/* Bottom row: left intentionally blank — Get in Touch button on the right */}
      <div
        className="hero-bottom-row"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(1.5rem, 5vw, 4rem) clamp(2rem, 6vh, 3.5rem)',
        }}
      >
        {/* Left side — intentionally blank */}
        <div />

        {/* Get in Touch button — right side, navigates to the Contact page */}
        <button
          ref={buttonRef}
          className="hero-body"
          onClick={() => navigate('/contact')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#0a0a0a',
            color: '#ffffff',
            border: '1px solid #ffffff',
            borderRadius: 999,
            padding: '14px 22px',
            fontSize: '0.95rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            →
          </span>
          Get in Touch
        </button>
      </div>
    </section>
  )
}

export default Herosection
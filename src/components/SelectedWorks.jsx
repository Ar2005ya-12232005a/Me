import React, { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

const FONT_IMPORT_HREF =
  'https://fonts.googleapis.com/css2?family=Edu+NSW+ACT+Cursive:wght@400..700&family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap'

const ACCENT = '#2f6bff'

const ProjectCard = React.forwardRef(function ProjectCard({ project, isWorkPage }, ref) {
  const [hovered, setHovered] = useState(false)

  const cardStyle = {
    display: 'block',
    textDecoration: 'none',
    borderRadius: 16,
    padding: 8,
    background: hovered ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: hovered ? '1.5px solid rgba(255,255,255,0.9)' : '1.5px solid rgba(255,255,255,0.5)',
    boxShadow: hovered
      ? '0 22px 48px -14px rgba(10,30,90,0.35), 0 4px 14px rgba(10,30,90,0.12)'
      : '0 14px 34px -18px rgba(10,30,90,0.28), 0 2px 8px rgba(10,30,90,0.08)',
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease',
    cursor: 'pointer',
  }

  const content = (
    <>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 2',
          borderRadius: 10,
          overflow: 'hidden',
          background: '#f3f4f7',
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            transform: hovered ? 'scale(1.035)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
        />
      </div>

      <div
        className="hero-body"
        style={{
          padding: '10px 4px 2px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: '"Google Sans", sans-serif',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: '#111319',
          }}
        >
          {project.title}
        </h3>
      </div>
    </>
  )

  return (
    <div ref={ref}>
      {isWorkPage ? (
        <Link
          to={`/work/${project.slug}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={cardStyle}
        >
          {content}
        </Link>
      ) : (
        <a
        
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={cardStyle}
        >
          {content}
        </a>
      )}
    </div>
  )
})

export default function SelectedWorks({ projects = PROJECTS }) {
  const headingRef = useRef(null)
  const boxRef = useRef(null)
  const cardRefs = useRef([])
  cardRefs.current = []

  const location = useLocation()
  const isWorkPage = location.pathname.startsWith('/work')

  const registerCardRef = el => {
    if (el) cardRefs.current.push(el)
  }

  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_IMPORT_HREF}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONT_IMPORT_HREF
    document.head.appendChild(link)
  }, [])

  useLayoutEffect(() => {
    if (!headingRef.current || !boxRef.current) return

    // Scope the "already animated" flag per page (Home vs Work) rather
    // than sharing one global flag. Otherwise, if the animation already
    // played once on Home, visiting /work for the very first time would
    // skip it too — since both pages render this same component.
    // Each page gets exactly one entrance animation per browser tab
    // session; navigating to a project's detail page and back to that
    // same page will not replay it.
    const storageKey = isWorkPage
      ? 'selectedWorksAnimated_work'
      : 'selectedWorksAnimated_home'

    const alreadyAnimated = sessionStorage.getItem(storageKey) === 'true'

    if (alreadyAnimated) {
      gsap.set(headingRef.current, { opacity: 1, y: 0 })
      gsap.set(boxRef.current, { opacity: 1, y: 0 })
      gsap.set(cardRefs.current, { opacity: 1, y: 0 })
      return
    }

    gsap.set(headingRef.current, { opacity: 0, y: 20 })
    gsap.set(boxRef.current, { opacity: 0, y: 40 })
    gsap.set(cardRefs.current, { opacity: 0, y: 24 })

    const trigger = ScrollTrigger.create({
      trigger: headingRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.35 })
          .to(boxRef.current, { opacity: 1, y: 0, duration: 0.35 }, '-=0.2')
          .to(cardRefs.current, { opacity: 1, y: 0, duration: 0.35, stagger: 0 }, '-=0.15')
          .call(() => sessionStorage.setItem(storageKey, 'true'))
      },
    })

    return () => trigger.kill()
  }, [isWorkPage])

  return (
    <section
      id="projects"
      className="hero-body"
      style={{
        position: 'relative',
        transform: 'translateZ(0)',
        contain: 'paint',
        width: '100%',
        padding: 'clamp(48px, 8vw, 72px) clamp(16px, 4vw, 24px) clamp(56px, 9vw, 80px)',
        background: '#ffffff',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <div
        aria-hidden
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      >
        {/* <SplashCursor COLOR="#1338BE" /> */}
      </div>

      <div
        ref={headingRef}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1240,
          margin: '0 auto 24px',
          textAlign: 'center',
        }}
      >
        <p
          className="hero-pill-label"
          style={{
            margin: '0 0 6px',
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: '0.85rem',
            color: '#8a8d97',
          }}
        />
        <h2
          className="hero-subheading"
          style={{
            margin: 0,
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(2rem, 4.8vw, 3.1rem)',
            letterSpacing: '-0.01em',
            color: '#111319',
          }}
        >
          Selected Works
        </h2>
      </div>

      <div
        ref={boxRef}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1240,
          margin: '0 auto',
          overflow: 'hidden',
          borderRadius: 32,
          padding: 'clamp(18px, 3.5vw, 36px)',
          background:
            'linear-gradient(135deg, #ffffff 0%, #eaf0ff 22%, #cfe0ff 45%, #6f9bff 72%, #2f6bff 100%)',
          boxShadow:
            '0 20px 48px -20px rgba(15,45,140,0.28), 0 6px 16px rgba(15,45,140,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.5)',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-18%',
            left: '-10%',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, transparent 70%)',
            filter: 'blur(10px)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '-22%',
            right: '-12%',
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(19,56,190,0.55) 0%, transparent 70%)',
            filter: 'blur(16px)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'clamp(12px, 2vw, 20px)',
          }}
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              isWorkPage={isWorkPage}
              ref={registerCardRef}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
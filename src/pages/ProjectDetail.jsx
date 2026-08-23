import React, { useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { PROJECTS } from '../data/projects'

export default function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const project = PROJECTS.find(p => p.slug === slug)

  const backRef = useRef(null)
  const imageRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const featuresRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    if (!project) return

    window.scrollTo(0, 0)

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    gsap.set(
      [backRef.current, imageRef.current, titleRef.current, descRef.current, featuresRef.current, ctaRef.current],
      { opacity: 0, y: 24 }
    )

    tl.to(backRef.current, { opacity: 1, y: 0, duration: 0.35 })
      .to(imageRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.15')
      .to(titleRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
      .to(descRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
      .to(featuresRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.35 }, '-=0.2')

    return () => tl.kill()
  }, [project])

  if (!project) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '100px 24px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: '"Google Sans", sans-serif',
            fontSize: '1.8rem',
            fontWeight: 600,
            color: '#111319',
            margin: 0,
          }}
        >
          Project not found
        </h1>
        <Link
          to="/work"
          style={{
            fontFamily: '"Google Sans", sans-serif',
            color: '#0a0a0a',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          ← Back to Work
        </Link>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', background: '#ffffff', boxSizing: 'border-box' }}>
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: 'clamp(48px, 8vw, 88px) clamp(16px, 4vw, 24px) clamp(64px, 10vw, 100px)',
        }}
      >
        {/* Back link */}
        <button
          ref={backRef}
          onClick={() => navigate('/work')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 28,
            padding: '10px 20px',
            borderRadius: 4,
            background: '#0a0a0a',
            border: '1.5px solid #ffffff',
            outline: '1.5px solid #0a0a0a',
            fontFamily: '"Google Sans", sans-serif',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '0.85'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1'
          }}
        >
          Back to Work
        </button>

        {/* Hero image */}
        <div
          ref={imageRef}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 24,
            overflow: 'hidden',
            marginBottom: 36,
            background:
              'linear-gradient(135deg, #ffffff 0%, #eaf0ff 22%, #cfe0ff 45%, #6f9bff 72%, #2f6bff 100%)',
            padding: 10,
            boxShadow: '0 20px 48px -20px rgba(15,45,140,0.28), 0 6px 16px rgba(15,45,140,0.1)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 16,
              overflow: 'hidden',
              background: '#f3f4f7',
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
            />
          </div>
        </div>

        {/* Title — Edu NSW ACT Cursive, smaller */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: "'Edu NSW ACT Cursive', cursive",
            fontSize: 'clamp(1.6rem, 3.2vw, 2.1rem)',
            fontWeight: 600,
            letterSpacing: '0',
            margin: '0 0 24px',
            color: '#111319',
          }}
        >
          {project.title}
        </h1>

        {/* Summary description */}
        <p
          ref={descRef}
          style={{
            fontFamily: '"Google Sans", sans-serif',
            fontSize: '1rem',
            lineHeight: 1.75,
            color: '#3a3d47',
            marginBottom: 32,
          }}
        >
          {project.summary}
        </p>

        {/* Key features as bullet points */}
        <div ref={featuresRef} style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: "'Edu NSW ACT Cursive', cursive",
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#111319',
              margin: '0 0 14px',
            }}
          >
            Key Features
          </h2>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {project.features.map((feature, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontFamily: '"Google Sans", sans-serif',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  color: '#3a3d47',
                }}
              >
                <span
  aria-hidden
  style={{
    flexShrink: 0,
    width: 6,
    height: 6,
    marginTop: 8,
    borderRadius: 2,
    background: '#0a0a0a',   // ← changed from '#2f6bff'
    transform: 'rotate(45deg)',
  }}
/>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA — black button, white border, less radius, no arrow */}
        <div
          ref={ctaRef}
          style={{
            paddingTop: 28,
            borderTop: '1px solid rgba(10,10,10,0.08)',
          }}
        >
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '13px 28px',
              borderRadius: 4,
              background: '#0a0a0a',
              border: '1.5px solid #ffffff',
              outline: '1.5px solid #0a0a0a',
              color: '#fff',
              fontFamily: '"Google Sans", sans-serif',
              fontWeight: 500,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.85'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            Visit Github
          </a>
        </div>
      </div>
    </div>
  )
}
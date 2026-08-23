import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import emailjs from '@emailjs/browser'

gsap.registerPlugin(ScrollTrigger)

const HEADING_BLUE = '#2f5fff'

// Pull these from your .env file (see setup notes) — falling back to
// literal strings here only for quick local testing.
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const ContactSection = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const headingRef = useRef(null)

  // Extra breathing room is only needed when this section is the very
  // first thing on the page (the standalone /contact route) — the sticky
  // navbar sits right above it with nothing else to push it down, which
  // was clipping the tall ascender on the cursive "T". On Home, the
  // sections above it already provide that spacing, so we leave it as-is
  // there.
  const location = useLocation()
  const isStandalonePage = location.pathname === '/contact'

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error(
        'EmailJS env vars are missing. Check your .env file has VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY.'
      )
      setStatus('error')
      return
    }

    setStatus('sending')

    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      })
      .catch((err) => {
        console.error('EmailJS error:', err)
        setStatus('error')
      })
  }

  useEffect(() => {
    if (!headingRef.current) return

    gsap.set(headingRef.current, {
      opacity: 0,
      y: 40,
      rotate: -6,
      scale: 0.9,
      transformOrigin: 'left center',
    })

    const trigger = ScrollTrigger.create({
      trigger: headingRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(headingRef.current, {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1,
          ease: 'back.out(2.2)',
        })
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <section
      className="contact-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        width: '100%',
        background:
          'linear-gradient(to top, #2f5fff 0%, #4d78ff 10%, #8fb0ff 26%, #cfe0ff 46%, #eef3ff 68%, #ffffff 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Edu+NSW+ACT+Cursive:wght@400..700&display=swap');

        .contact-heading {
          font-family: 'Edu NSW ACT Cursive', cursive;
          will-change: transform, opacity;
          color: ${HEADING_BLUE};
        }

        .contact-ui {
          font-family: 'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .contact-field input,
        .contact-field textarea {
          font-family: 'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(0,0,0,0.25);
          padding: 10px 2px 12px;
          font-size: 0.95rem;
          color: #000000;
          outline: none;
          transition: border-color 0.2s ease;
          resize: none;
        }
        .contact-field input::placeholder,
        .contact-field textarea::placeholder {
          color: rgba(0,0,0,0.45);
        }
        .contact-field input:focus,
        .contact-field textarea:focus {
          border-bottom-color: #000000;
        }

        .contact-submit {
          font-family: 'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          background: #000000;
          color: #ffffff;
          border: none;
          border-radius: 999px;
          padding: 15px 22px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .contact-submit:hover {
          background: #222222;
        }
        .contact-submit:active {
          transform: scale(0.98);
        }
        .contact-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .contact-status {
          font-family: 'Google Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 0.85rem;
          margin: 0;
        }
        .contact-status.success {
          color: #1a7f37;
        }
        .contact-status.error {
          color: #c0392b;
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>

      {/* Blue glow, widened and pushed lower so it reads as the source of
          the rising color rather than a floating corner accent. */}
      <div
        style={{
          position: 'absolute',
          bottom: '-35%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw',
          height: '55vh',
          maxWidth: 1000,
          maxHeight: 640,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(63,111,255,0.35) 0%, rgba(143,176,255,0.16) 50%, transparent 80%)',
          filter: 'blur(90px)',
          zIndex: 0,
        }}
      />

      {/* Main content: heading (left) + form (right) */}
      <div
        className="contact-grid"
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'start',
          gap: 'clamp(2rem, 6vw, 4rem)',
          maxWidth: 1320,
          width: '100%',
          margin: '0 auto',
          padding: isStandalonePage
            ? 'clamp(6.5rem, 15vh, 9.5rem) clamp(1.5rem, 5vw, 3.5rem) clamp(2rem, 6vh, 3rem)'
            : 'clamp(3rem, 8vh, 5rem) clamp(1.5rem, 5vw, 3.5rem) clamp(2rem, 6vh, 3rem)',
        }}
      >
        <h1
          ref={headingRef}
          className="contact-heading"
          style={{
            margin: 0,
            fontSize: 'clamp(2.6rem, 6vw, 4.6rem)',
            fontWeight: 500,
            lineHeight: 1.08,
          }}
        >
          Trying to
          <br />
          create
          <br />
          together!
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(1.5rem, 3vh, 2rem)',
            maxWidth: 460,
            width: '100%',
          }}
        >
          <div className="contact-field">
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange('name')}
              required
            />
          </div>

          <div className="contact-field">
            <input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange('email')}
              required
            />
          </div>

          <div className="contact-field" style={{ position: 'relative' }}>
            <textarea
              placeholder="Message"
              rows={3}
              value={form.message}
              onChange={handleChange('message')}
              required
            />
            {/* Decorative flourish echoing the reference's dot + ring accent */}
            <div
              style={{
                position: 'absolute',
                right: 8,
                bottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#000000',
                }}
              />
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: '1px solid rgba(0,0,0,0.5)',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="contact-submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : 'Submit'}
          </button>

          {status === 'success' && (
            <p className="contact-status success">
              Message sent — I'll get back to you soon.
            </p>
          )}
          {status === 'error' && (
            <p className="contact-status error">
              Something went wrong. Try again, or email me directly.
            </p>
          )}
        </form>
      </div>

    </section>
  )
}

export default ContactSection
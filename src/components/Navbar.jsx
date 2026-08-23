import React, { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { gsap } from 'gsap'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About Me', path: '/about-me' },
  { label: 'Work', path: '/work' },
  { label: 'Experience', path: '/experience' },
  { label: 'Contact', path: '/contact' },
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navBrandRef = useRef(null)
  const navLinksRef = useRef(null)

  // Navbar now lives above <Routes> in App.jsx, so it never unmounts or
  // remounts when the route changes — this entrance plays once, on the
  // very first load, exactly like it used to inside Herosection.
  useEffect(() => {
    const navLinks = navLinksRef.current
      ? gsap.utils.toArray(navLinksRef.current.querySelectorAll('.hero-nav-link'))
      : []

    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } })

    tl.fromTo(navBrandRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.4 }).fromTo(
      navLinks,
      { opacity: 0, y: -14 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04 },
      '-=0.25'
    )

    return () => tl.kill()
  }, [])

  return (
    <nav className="hero-navbar">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Edu+NSW+ACT+Cursive:wght@400..700&display=swap');

        .hero-navbar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: clamp(1.25rem, 3vh, 1.75rem) clamp(2rem, 6vw, 4.5rem) clamp(1.25rem, 3vh, 1.75rem) clamp(1.25rem, 4vw, 3rem);
          background: #ffffff;
          border-bottom: 1px solid rgba(10, 10, 10, 0.08);
        }

        .hero-nav-links {
          display: flex;
          align-items: center;
          gap: clamp(1.25rem, 2.5vw, 2.25rem);
        }

        .hero-nav-link {
          position: relative;
          font-family: "Google Sans", sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          color: #0a0a0a;
          text-decoration: none;
          white-space: nowrap;
          padding-bottom: 6px;
          transition: opacity 0.2s linear;
        }
        .hero-nav-link:hover {
          opacity: 0.6;
        }
        .hero-nav-link.active {
          opacity: 1;
          font-weight: 700;
        }
        /* Desktop-only active indicator — a squared-off blue gradient bar
           under the active link, no rounded corners. */
        .hero-nav-links .hero-nav-link.active::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          border-radius: 0;
          background: linear-gradient(90deg, #1a4fff 0%, #2f6bff 50%, #6f9bff 100%);
        }

        .hero-nav-toggle {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 34px;
          height: 34px;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(10,10,10,0.12);
          border-radius: 8px;
          cursor: pointer;
          padding: 0;
        }
        .hero-nav-toggle span {
          display: block;
          height: 2px;
          width: 16px;
          margin: 0 auto;
          background: #0a0a0a;
          border-radius: 2px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .hero-nav-toggle.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .hero-nav-toggle.open span:nth-child(2) {
          opacity: 0;
        }
        .hero-nav-toggle.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .hero-nav-mobile-panel {
          display: none;
        }

        .hero-brand {
          font-size: clamp(1.05rem, 1.9vw, 1.35rem);
          color: #0a0a0a;
          line-height: 1;
          text-decoration: none;
        }

        @media (max-width: 760px) {
          .hero-nav-links {
            display: none;
          }
          .hero-nav-toggle {
            display: flex;
          }
          .hero-nav-mobile-panel {
            position: absolute;
            top: calc(100% + 10px);
            right: clamp(1.25rem, 4vw, 3rem);
            z-index: 51;
            background: #ffffff;
            border: 1px solid rgba(10,10,10,0.1);
            border-radius: 0;
            box-shadow: 0 12px 30px rgba(10,10,10,0.12);
            padding: 0.75rem;
            display: flex;
            flex-direction: column;
            min-width: 180px;
          }
          .hero-nav-mobile-panel.closed {
            display: none;
          }
          .hero-nav-mobile-panel .hero-nav-link {
            font-family: 'Edu NSW ACT Cursive', cursive;
            font-size: 1.15rem;
            padding: 0.6rem 0.75rem;
            border-radius: 0;
          }
          .hero-nav-mobile-panel .hero-nav-link:hover {
            background: rgba(10,10,10,0.05);
            opacity: 1;
          }
        }
      `}</style>

      <NavLink ref={navBrandRef} to="/" className="hero-brand hero-subheading">
        Arya Sankar
      </NavLink>

      <div ref={navLinksRef} className="hero-nav-links">
        {NAV_LINKS.map(({ label, path }) => (
          <NavLink
            key={label}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `hero-nav-link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </div>

      <button
        type="button"
        className={`hero-nav-toggle${menuOpen ? ' open' : ''}`}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(prev => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`hero-nav-mobile-panel${menuOpen ? '' : ' closed'}`}>
        {NAV_LINKS.map(({ label, path }) => (
          <NavLink
            key={label}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `hero-nav-link${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
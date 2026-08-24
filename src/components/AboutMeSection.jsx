import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PolaroidFlipCard from './PolaroidFlipCard'
import SplashCursor from './SplashCursor'
import IsoSocials from './IsoSocials'

gsap.registerPlugin(ScrollTrigger)

const AboutMeSection = () => {
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const headingRowRef = useRef(null)
  const textColRef = useRef(null)
  const photoColRef = useRef(null)
  const resumeBtnRef = useRef(null)

  // Box, heading + text, and the polaroid all arrive together, quickly —
  // the box and text sweep in sideways from the left, the polaroid comes
  // in from the right with a tilt that settles with a small bounce. Heavy
  // overlap between each tween keeps it feeling like one fast, unified
  // entrance rather than separate staggered pieces. The Resume button
  // pops in right after the polaroid settles, with the same bouncy ease.
  useEffect(() => {
    if (!sectionRef.current) return

    gsap.set(cardRef.current, { opacity: 0, x: -60 })
    gsap.set(headingRowRef.current, { opacity: 0, x: -40 })
    gsap.set(textColRef.current, { opacity: 0, x: -50 })
    gsap.set(photoColRef.current, { opacity: 0, x: 60, rotate: -14, scale: 0.9 })
    gsap.set(resumeBtnRef.current, { opacity: 0, y: 18, scale: 0.9 })

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline()

        tl.to(cardRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' })
          .to(
            headingRowRef.current,
            { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' },
            '-=0.3'
          )
          .to(
            textColRef.current,
            { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' },
            '-=0.25'
          )
          .to(
            photoColRef.current,
            { opacity: 1, x: 0, rotate: 0, scale: 1, duration: 0.55, ease: 'back.out(1.6)' },
            '-=0.4'
          )
          .to(
            resumeBtnRef.current,
            { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)' },
            '-=0.25'
          )
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <section ref={sectionRef} className="about-section">
      <style>{`
        .about-section {
          position: relative;
          width: 100%;
          background: #ffffff;
          padding: clamp(2.5rem, 6vh, 4.5rem) clamp(1.5rem, 5vw, 4rem);
        }

        .about-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        /* Big blue-white card — scaled down a notch overall (size, padding,
           and type) so it reads a little more compact. */
        .about-card {
          position: relative;
          overflow: hidden;
          border-radius: clamp(10px, 1.4vw, 18px);
          background: linear-gradient(135deg, #f4f7ff 0%, #dbe6ff 35%, #8fb0ff 75%, #6f95ff 100%);
          min-height: clamp(340px, 40vw, 440px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: clamp(2rem, 5vw, 3.25rem) clamp(1.5rem, 4vw, 2.75rem) clamp(2.25rem, 5.5vw, 3.5rem);
        }

        .about-card-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }

        .about-card-blob.b1 {
          width: 260px;
          height: 260px;
          top: -100px;
          right: -70px;
          background: radial-gradient(circle, #ffffff 0%, transparent 70%);
          opacity: 0.8;
        }

        .about-card-blob.b2 {
          width: 310px;
          height: 310px;
          bottom: -130px;
          right: 8%;
          background: radial-gradient(circle, #3d6fff 0%, transparent 72%);
          opacity: 0.35;
        }

        .about-card-blob.b3 {
          width: 210px;
          height: 210px;
          bottom: -80px;
          left: -65px;
          background: radial-gradient(circle, #1a4fff 0%, transparent 70%);
          opacity: 0.25;
        }

        .about-card-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 800px;
        }

        /* Text + Polaroid side by side */
        .about-flex-row {
          display: flex;
          align-items: center;
          gap: clamp(1.5rem, 3.5vw, 2.75rem);
        }

        .about-text-col {
          flex: 1 1 360px;
          min-width: 0;
        }

        .about-photo-col {
          flex: 0 0 auto;
          width: clamp(160px, 19vw, 220px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(0.8rem, 1.6vw, 1.1rem);
        }

        .about-photo-frame {
          width: 100%;
          height: clamp(188px, 22vw, 259px);
        }

        .about-heading-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin: 0 0 clamp(0.85rem, 2vh, 1.25rem);
        }

        .about-heading {
          margin: 0;
          font-family: "Edu NSW ACT Cursive", cursive;
          font-weight: 500;
          font-size: clamp(1.9rem, 4.4vw, 3.1rem);
          line-height: 1.1;
          color: #0a1233;
          text-align: left;
          text-wrap: balance;
        }

        /* DUMMY TEXT — replace with real bio copy.
           Justified so both edges line up evenly across the column width. */
       .about-body {
  position: relative;
  z-index: 2;
  isolation: isolate;
  box-sizing: border-box;
  width: 100%;
  margin: 0 0 1.1em;
  font-family: "Google Sans", sans-serif;
  font-weight: 400;
  font-size: clamp(0.85rem, 1.1vw, 0.98rem);
  line-height: 1.4;
  color: rgba(10, 18, 51, 0.85);
  text-align: justify;
  text-align-last: left;
  border: 3px solid #ffffff;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.35);
}
        .about-body:last-child {
          margin-bottom: 0;
        }

        /* Resume button — small pill, same blue/white identity as the
           card, with a shine sweep and lift on hover. */
        .about-resume-btn {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          width: 100%;
          padding: 0.55rem 1rem;
          border-radius: 8px;
          border: 1.5px solid #ffffff;
          background: #0a0a0a;
          color: #ffffff;
          font-family: "Google Sans", sans-serif;
          font-weight: 600;
          font-size: clamp(0.8rem, 1vw, 0.9rem);
          text-decoration: none;
          box-shadow: 0 6px 16px rgba(10, 18, 51, 0.16);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }

        .about-resume-btn:hover,
        .about-resume-btn:focus-visible {
          transform: translateY(-3px);
          box-shadow: 0 12px 22px rgba(10, 18, 51, 0.28);
          background: #1a1a1a;
        }

        .about-resume-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        .about-resume-btn .icon {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .about-resume-btn:hover .icon {
          transform: translateY(2px);
        }

        /* Shine sweep across the pill on hover */
        .about-resume-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -60%;
          width: 45%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          transform: skewX(-20deg);
          pointer-events: none;
        }

        .about-resume-btn:hover::after {
          animation: about-resume-shine 0.85s ease forwards;
        }

        @keyframes about-resume-shine {
          from {
            left: -60%;
          }
          to {
            left: 130%;
          }
        }

        @media (max-width: 760px) {
          .about-flex-row {
            flex-direction: column;
          }
          .about-photo-col {
            order: -1;
            width: clamp(170px, 45vw, 220px);
          }
          .about-photo-frame {
            height: clamp(200px, 53vw, 259px);
          }
        }
@media (max-width: 640px) {
  .about-card {
    padding: 1.75rem 1.25rem 2rem;
    min-height: clamp(300px, 36vw, 400px);
  }
  .about-body {
    text-align: left;
    font-size: 1rem;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    box-sizing: border-box;
    width: 100%;
    isolation: isolate;
    background: rgba(255, 255, 255, 0.35);
  }
  .about-heading-row {
    flex-wrap: wrap;
  }
}
      `}</style>

      <div className="about-inner">
        <div ref={cardRef} className="about-card">
          {/* <SplashCursor color="#FFFFFF" /> */}
          <span className="about-card-blob b1" />
          <span className="about-card-blob b2" />
          <span className="about-card-blob b3" />

          <div className="about-card-content">
            <div ref={headingRowRef} className="about-heading-row">
              <h2 className="about-heading">About Me</h2>
              <IsoSocials theme="light" />
            </div>

            <div className="about-flex-row">
              <div ref={textColRef} className="about-text-col">
                <p className="about-body">
                 I’m a Full-Stack Developer and Web Designer passionate about building meaningful digital experiences.
I turn ideas into modern, responsive, and intuitive web applications.
My work combines clean design, thoughtful interactions, and efficient development.
I enjoy creating interfaces that are not only visually engaging but also easy to use.
Beyond web development, I’m exploring Artificial Intelligence and Machine Learning.
I’m constantly experimenting with new technologies, ideas, and ways to build better products.
My goal is simple — create, learn, innovate, and build technology that makes an impact.
              </p>
              </div>

              <div ref={photoColRef} className="about-photo-col">
                <div className="about-photo-frame">
                  <PolaroidFlipCard />
                </div>

                <a
                  ref={resumeBtnRef}
                  className="about-resume-btn"
                  href="/Resume.pdf"
                  download="Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v12" />
                    <path d="M7 10l5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                  Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutMeSection
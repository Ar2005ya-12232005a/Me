import React, { useState, useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_POSTERS = [
  { image: '/Poster-1.png' },
  { image: '/Poster-2.png' },
  { image: '/Poster-3.png' },
  { image: '/Poster-4.png' },
  { image: '/Poster-5.png' },
]

const ACCENT = '#3d6fff'
const INK = '#0f172a'

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

function useHeadingFont() {
  useEffect(() => {
    const id = 'poster-heading-font'
    if (document.getElementById(id)) return

    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@500;700;800&display=swap'

    document.head.appendChild(link)
  }, [])
}

const TiltCard = React.forwardRef(function TiltCard(
  { children, isActive, style, onClick },
  outerRef
) {
  const tiltRef = useRef(null)
  const quickX = useRef(null)
  const quickY = useRef(null)
  const MAX_TILT = isActive ? 10 : 6

  useEffect(() => {
    if (!tiltRef.current) return

    quickX.current = gsap.quickTo(
      tiltRef.current,
      'rotationX',
      {
        duration: 0.6,
        ease: 'power3',
      }
    )

    quickY.current = gsap.quickTo(
      tiltRef.current,
      'rotationY',
      {
        duration: 0.6,
        ease: 'power3',
      }
    )
  }, [])

  const handleMouseMove = useCallback(
    e => {
      const el = tiltRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()

      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const dx =
        (e.clientX - cx) / (rect.width / 2)

      const dy =
        (e.clientY - cy) / (rect.height / 2)

      quickX.current &&
        quickX.current(
          clamp(
            -dy * MAX_TILT,
            -MAX_TILT,
            MAX_TILT
          )
        )

      quickY.current &&
        quickY.current(
          clamp(
            dx * MAX_TILT,
            -MAX_TILT,
            MAX_TILT
          )
        )
    },
    [MAX_TILT]
  )

  const handleMouseLeave = useCallback(() => {
    quickX.current && quickX.current(0)
    quickY.current && quickY.current(0)
  }, [])

  return (
    <div
      ref={outerRef}
      onClick={onClick}
      style={{
        ...style,
        perspective: 800,
      }}
    >
      <div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'inherit',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          borderRadius: 'inherit',
        }}
      >
        {children}
      </div>
    </div>
  )
})

export default function Posters({
  posters = DEFAULT_POSTERS,
}) {
  useHeadingFont()

  const containerRef = useRef(null)
  const carouselRef = useRef(null)
  const headingRef = useRef(null)
  const revealRef = useRef(null)
  const trackRef = useRef(null)
  const cardRefs = useRef([])

  const didMountRef = useRef(false)
  const hasRevealedRef = useRef(false)

  const dragState = useRef({
    startX: 0,
    dragging: false,
  })

  const [frameWidth, setFrameWidth] =
    useState(1200)

  const [activeIndex, setActiveIndex] =
    useState(Math.floor(posters.length / 2))

  const spacingRef = useRef(0)
  const activeIndexRef = useRef(activeIndex)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver(() =>
      setFrameWidth(
        el.getBoundingClientRect().width
      )
    )

    ro.observe(el)

    setFrameWidth(
      el.getBoundingClientRect().width
    )

    return () => ro.disconnect()
  }, [])

  const isMobile = frameWidth < 640

  const isTablet =
    frameWidth >= 640 &&
    frameWidth < 1024

  const cardWidth = React.useMemo(() => {
    if (isMobile) {
      return clamp(
        frameWidth * 0.72,
        200,
        300
      )
    }

    if (isTablet) {
      return clamp(
        frameWidth * 0.36,
        230,
        300
      )
    }

    return clamp(
      frameWidth * 0.26,
      260,
      340
    )
  }, [
    frameWidth,
    isMobile,
    isTablet,
  ])

  const cardHeight = cardWidth * 1.4

  const spacing = isMobile
    ? cardWidth * 0.92
    : cardWidth * 0.72

  useEffect(() => {
    spacingRef.current = spacing
  }, [spacing])

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const goTo = useCallback(
    i =>
      setActiveIndex(
        clamp(
          i,
          0,
          posters.length - 1
        )
      ),
    [posters.length]
  )

  const prev = useCallback(
    () =>
      setActiveIndex(c =>
        c === 0
          ? posters.length - 1
          : c - 1
      ),
    [posters.length]
  )

  const next = useCallback(
    () =>
      setActiveIndex(c =>
        c === posters.length - 1
          ? 0
          : c + 1
      ),
    [posters.length]
  )

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft') {
        prev()
      }

      if (e.key === 'ArrowRight') {
        next()
      }
    }

    window.addEventListener(
      'keydown',
      onKey
    )

    return () =>
      window.removeEventListener(
        'keydown',
        onKey
      )
  }, [prev, next])

  const handlePointerDown =
    useCallback(e => {
      dragState.current = {
        startX: e.clientX,
        dragging: true,
      }
    }, [])

  const handlePointerUp =
    useCallback(
      e => {
        if (
          !dragState.current.dragging
        )
          return

        const delta =
          e.clientX -
          dragState.current.startX

        dragState.current.dragging = false

        const threshold = isMobile
          ? 36
          : 56

        if (delta > threshold) {
          prev()
        } else if (
          delta < -threshold
        ) {
          next()
        }
      },
      [isMobile, prev, next]
    )

  const handlePointerLeave =
    useCallback(() => {
      dragState.current.dragging = false
    }, [])

  useEffect(() => {
    posters.forEach(
      (_, index) => {
        const el =
          cardRefs.current[index]

        if (!el) return

        if (!hasRevealedRef.current)
          return

        const distance =
          index - activeIndex

        const absDistance =
          Math.abs(distance)

        const x =
          distance * spacing

        const scale =
          index === activeIndex
            ? 1
            : 0.86

        const opacity =
          absDistance > 2
            ? 0.4
            : 1

        if (!didMountRef.current) {
          gsap.set(el, {
            x,
            scale,
            opacity,
          })
        } else {
          gsap.to(el, {
            x,
            scale,
            opacity,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }
      }
    )

    didMountRef.current = true
  }, [
    activeIndex,
    spacing,
    posters.length,
  ])

  useEffect(() => {
    if (
      !revealRef.current ||
      !carouselRef.current ||
      !headingRef.current
    ) {
      return
    }

    const cards =
      cardRefs.current.filter(Boolean)

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window
        .matchMedia(
          '(prefers-reduced-motion: reduce)'
        )
        .matches

    gsap.set(revealRef.current, {
      opacity: 1,
      scale: 1,
      clipPath: 'none',
    })

    const liveSpacing =
      spacingRef.current

    const liveActiveIndex =
      activeIndexRef.current

    if (prefersReducedMotion) {
      gsap.set(
        headingRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
        }
      )

      cards.forEach(
        (el, index) => {
          const distance =
            index -
            liveActiveIndex

          const absDistance =
            Math.abs(distance)

          gsap.set(el, {
            x:
              distance *
              liveSpacing,

            scale:
              index ===
              liveActiveIndex
                ? 1
                : 0.86,

            opacity:
              absDistance > 2
                ? 0.4
                : 1,
          })
        }
      )

      hasRevealedRef.current = true

      return
    }

    gsap.set(
      headingRef.current,
      {
        opacity: 0,
        y: 18,
        scale: 0.96,
      }
    )

    gsap.set(cards, {
      x: 0,
      scale: 0.7,
      opacity: 0,
    })

    const tl = gsap.timeline({
      defaults: {
        ease: 'none',
      },

      paused: true,

      onComplete: () => {
        hasRevealedRef.current = true
      },
    })

    tl.to(
      headingRef.current,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
      },
      0
    )

    cards.forEach(
      (el, index) => {
        const distance =
          index -
          liveActiveIndex

        const absDistance =
          Math.abs(distance)

        const x =
          distance *
          liveSpacing

        const scale =
          index ===
          liveActiveIndex
            ? 1
            : 0.86

        const opacity =
          absDistance > 2
            ? 0.4
            : 1

        tl.to(
          el,
          {
            x,
            scale,
            opacity,

            // Smooth card movement
            duration: 0.6,
            ease: 'power2.out',
          },
          0.2 +
            absDistance * 0.12
        )
      }
    )

    /*
      Smooth scroll-controlled animation.

      The old version directly used:

        tl.progress(maxProgress)

      which caused the cards to visually jump between
      timeline positions.

      Now the timeline progress itself is smoothly tweened.
    */

    let maxProgress = 0
    let progressTween = null

    const trigger =
      ScrollTrigger.create({
        trigger:
          carouselRef.current,

        start: 'top 85%',
        end: 'top 45%',

        onUpdate: self => {
          /*
            Only move the animation forward
            while scrolling DOWN.
          */

          if (
            self.direction === 1 &&
            self.progress >
              maxProgress
          ) {
            maxProgress =
              self.progress

            if (progressTween) {
              progressTween.kill()
            }

            progressTween = gsap.to(
              tl,
              {
                progress:
                  maxProgress,

                duration: 0.35,

                ease: 'power2.out',

                overwrite: true,
              }
            )
          }

          /*
            When scrolling UP, do not reverse
            the animation.

            Keep cards at the furthest point
            they have already reached.
          */

          if (
            self.direction === -1
          ) {
            if (progressTween) {
              progressTween.kill()
              progressTween =
                null
            }

            tl.progress(
              maxProgress
            )
          }
        },
      })

    return () => {
      if (progressTween) {
        progressTween.kill()
      }

      trigger.kill()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      id="posters"
      style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        minHeight: isMobile
          ? 'auto'
          : '100vh',

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',

        padding: isMobile
          ? '40px 0 40px'
          : '56px 0 60px',

        boxSizing: 'border-box',

        gap: isMobile
          ? '20px'
          : '36px',

        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        ref={headingRef}
        style={{
          position: 'relative',
          textAlign: 'center',
          zIndex: 2,
          width: '100%',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',

            transform:
              'translate(-50%, -50%)',

            width: 320,
            height: 180,

            background:
              'radial-gradient(circle, rgba(61,111,255,0.06) 0%, rgba(61,111,255,0) 65%)',

            filter: 'blur(40px)',

            pointerEvents: 'none',
          }}
        />

        <h2
          style={{
            position: 'relative',

            fontFamily:
              "'Google Sans', 'Product Sans', Inter, ui-sans-serif, sans-serif",

            color: INK,

            fontSize:
              'clamp(2.4rem, 5.5vw, 3.6rem)',

            fontWeight: 500,

            margin: 0,

            letterSpacing: '-1px',

            lineHeight: 1,
          }}
        >
          Posters
        </h2>
      </div>

      <div
        ref={carouselRef}
        style={{
          position: 'relative',
          width: '100%',

          height: isMobile
            ? cardHeight + 60
            : cardHeight + 80,
        }}
      >
        <div
          ref={revealRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <div
            ref={containerRef}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              overflow: 'hidden',
            }}
          >
            <div
              ref={trackRef}
              onPointerDown={
                handlePointerDown
              }
              onPointerUp={
                handlePointerUp
              }
              onPointerLeave={
                handlePointerLeave
              }
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'visible',
                touchAction: 'pan-y',
              }}
            >
              {posters.map(
                (poster, index) => {
                  const isActive =
                    index ===
                    activeIndex

                  const absDistance =
                    Math.abs(
                      index -
                        activeIndex
                    )

                  return (
                    <TiltCard
                      key={index}
                      ref={el =>
                        (cardRefs.current[
                          index
                        ] = el)
                      }
                      isActive={
                        isActive
                      }
                      onClick={() => {
                        if (
                          !isActive
                        ) {
                          goTo(index)
                        }
                      }}
                      style={{
                        position:
                          'absolute',

                        left: '50%',
                        top: '50%',

                        width:
                          cardWidth,

                        height:
                          cardHeight,

                        marginLeft:
                          -cardWidth /
                          2,

                        marginTop:
                          -cardHeight /
                          2,

                        borderRadius: 20,

                        zIndex:
                          isActive
                            ? 50
                            : 50 -
                              absDistance,

                        cursor:
                          isActive
                            ? 'default'
                            : 'pointer',

                        background:
                          isActive
                            ? 'linear-gradient(160deg, #ffffff 0%, #f3f7ff 50%, #e3edff 100%)'
                            : '#ffffff',

                        border:
                          isActive
                            ? '1.5px solid rgba(61,111,255,0.28)'
                            : '1px solid rgba(15,23,42,0.08)',

                        boxShadow:
                          isActive
                            ? '0 14px 30px rgba(15,23,42,0.10), 0 4px 10px rgba(15,23,42,0.06)'
                            : '0 8px 22px rgba(15,23,42,0.05)',

                        boxSizing:
                          'border-box',

                        padding:
                          isMobile
                            ? 10
                            : 14,

                        display: 'flex',

                        flexDirection:
                          'column',
                      }}
                    >
                      <div
                        style={{
                          position:
                            'relative',

                          flex: 1,

                          borderRadius: 12,

                          overflow:
                            'hidden',

                          background:
                            '#f1f5f9',
                        }}
                      >
                        <img
                          src={
                            poster.image
                          }
                          alt=""
                          draggable={
                            false
                          }
                          style={{
                            position:
                              'absolute',

                            inset: 0,

                            width:
                              '100%',

                            height:
                              '100%',

                            objectFit:
                              'cover',

                            objectPosition:
                              'top center',

                            userSelect:
                              'none',
                          }}
                        />
                      </div>
                    </TiltCard>
                  )
                }
              )}
            </div>

            {!isMobile && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous poster"
                  style={{
                    position:
                      'absolute',

                    left: '5%',

                    top: '50%',

                    transform:
                      'translateY(-50%)',

                    zIndex: 100,

                    width: 44,
                    height: 44,

                    borderRadius:
                      '50%',

                    background:
                      '#ffffff',

                    border:
                      '1px solid rgba(15,23,42,0.1)',

                    color: INK,

                    fontSize:
                      '1.4rem',

                    cursor:
                      'pointer',

                    boxShadow:
                      '0 6px 18px rgba(15,23,42,0.08)',

                    display: 'flex',

                    alignItems:
                      'center',

                    justifyContent:
                      'center',
                  }}
                >
                  ‹
                </button>

                <button
                  onClick={next}
                  aria-label="Next poster"
                  style={{
                    position:
                      'absolute',

                    right: '5%',

                    top: '50%',

                    transform:
                      'translateY(-50%)',

                    zIndex: 100,

                    width: 44,
                    height: 44,

                    borderRadius:
                      '50%',

                    background:
                      '#ffffff',

                    border:
                      '1px solid rgba(15,23,42,0.1)',

                    color: INK,

                    fontSize:
                      '1.4rem',

                    cursor:
                      'pointer',

                    boxShadow:
                      '0 6px 18px rgba(15,23,42,0.08)',

                    display: 'flex',

                    alignItems:
                      'center',

                    justifyContent:
                      'center',
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          zIndex: 2,
        }}
      >
        {posters.map((_, i) => (
          <button
            key={i}
            onClick={() =>
              goTo(i)
            }
            aria-label={`Go to poster ${
              i + 1
            }`}
            style={{
              width:
                i === activeIndex
                  ? 20
                  : 7,

              height: 7,

              border: 'none',

              borderRadius: 999,

              padding: 0,

              background:
                i === activeIndex
                  ? ACCENT
                  : 'rgba(15,23,42,0.18)',

              cursor: 'pointer',

              transition:
                'width 0.4s ease, background 0.4s ease',
            }}
          />
        ))}
      </div>
    </section>
  )
}
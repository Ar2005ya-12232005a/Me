import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const INK = "#0a1233";
const MUTED = "rgba(10, 18, 51, 0.5)";
const ACCENT = "#3d6fff";

const FONT_IMPORT_HREF =
  "https://fonts.googleapis.com/css2?family=Edu+NSW+ACT+Cursive:wght@400..700&family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap";

function useCertFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_IMPORT_HREF}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_IMPORT_HREF;
    document.head.appendChild(link);
  }, []);
}

const CERTIFICATES = [
  {
    id: "cert_1",
    title: "Marketing Analytics",
    issuer: "NPTEL",
    date: "JAN 2026",
    image: "/Marketing.png",
    color: ACCENT,
  },
  {
    id: "cert_2",
    title: "Cloud Computing",
    issuer: "NPTEL",
    date: "JAN 2025",
    image: "/Cloud.png",
    color: ACCENT,
  },
  {
    id: "cert_3",
    title: "Python Programming",
    issuer: "VITYARTHI",
    date: "SEPT 2024",
    image: "/Python.png",
    color: ACCENT,
  },
  {
    id: "cert_4",
    title: "Linux",
    issuer: "VITYARTHI",
    date: "JAN 2026",
    image: "/Linux.png",
    color: ACCENT,
  },
  {
    id: "cert_5",
    title: "AIML",
    issuer: "VITYARTHI",
    date: "JAN 2025",
    image: "/AIML.png",
    color: ACCENT,
  },
];

function FadeSlide({ children, delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: direction === "up" ? 36 : direction === "down" ? -36 : 0,
        x: direction === "left" ? 36 : direction === "right" ? -36 : 0,
        scale: 0.96,
      }}
      animate={inView ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function CardStack({ cards, onCycle }) {
  // Light, monochrome neumorphic stack — matches the site's white/black/
  // metallic identity instead of the old dark-mode-first palette. The
  // accent blue only shows up as a thin ring around the front card and
  // the little status dot, same restrained-accent language as the rest
  // of the site (AboutMe card border, Posters active card border).
  const bg = "#f4f6fb";
  const sh1 = "rgba(15, 23, 42, 0.14)";
  const sh2 = "#ffffff";
  const OFFSET = 8;
  const SCALE = 0.06;
  const DIM = 0.12;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 10",
        overflow: "visible",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ul style={{ position: "relative", width: "100%", height: "100%", margin: 0, padding: 0 }}>
        {cards.map(({ id, image, title }, i) => {
          const isFront = i === 0;
          const brightness = Math.max(0.35, 1 - i * DIM);
          const zIndex = cards.length - i;

          return (
            <motion.li
              key={id}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: 18,
                listStyle: "none",
                cursor: isFront ? "grab" : "auto",
                overflow: "hidden",
                touchAction: "none",
                zIndex,
                background: bg,
                border: isFront ? `1.5px solid ${ACCENT}2e` : "1px solid rgba(15,23,42,0.06)",
                boxShadow: isFront
                  ? `0 18px 36px rgba(15,23,42,0.14), 0 4px 12px rgba(15,23,42,0.06)`
                  : `6px 6px 16px ${sh1}, -6px -6px 16px ${sh2}`,
              }}
              animate={{
                top: `calc(${i * -OFFSET}%)`,
                scale: 1 - i * SCALE,
                filter: `brightness(${brightness})`,
                zIndex,
              }}
              transition={{ type: "spring", stiffness: 170, damping: 26 }}
              drag={isFront ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                if (info.offset.y < -30 || Math.abs(info.offset.y) < 6) onCycle();
              }}
              whileDrag={
                isFront ? { zIndex: cards.length + 1, cursor: "grabbing", scale: 1.03, rotate: 1.5 } : {}
              }
              whileHover={isFront ? { y: -6, scale: 1.015 } : {}}
              whileTap={isFront ? { scale: 0.98 } : {}}
            >
              {image ? (
                <img
                  src={image}
                  alt={title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
                />
              ) : (
                <PlaceholderCard cert={cards[i]} />
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function PlaceholderCard({ cert }) {
  const lineBg = "rgba(15, 23, 42, 0.06)";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(14px, 3.5%, 22px)",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {[25, 50, 75].map(p => (
        <div key={p} style={{ position: "absolute", left: `${p}%`, top: 0, bottom: 0, width: 1, background: lineBg, pointerEvents: "none" }} />
      ))}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
        <span
          style={{
            fontFamily: "'Google Sans', sans-serif",
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {cert.issuer}
        </span>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: cert.color,
            boxShadow: `0 0 8px ${cert.color}`,
            flexShrink: 0,
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, position: "relative", zIndex: 1 }}>
        <svg viewBox="0 0 80 80" width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.18 }}>
          <circle cx="40" cy="40" r="38" stroke={INK} strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="40" cy="40" r="28" stroke={INK} strokeWidth="1" />
          <path d="M40 18l3.5 7.5L52 27l-6 5.5 1.5 8.5L40 37l-7.5 4 1.5-8.5L28 27l8.5-1.5L40 18z" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            margin: 0,
            fontFamily: "'Edu NSW ACT Cursive', cursive",
            fontWeight: 600,
            fontSize: "clamp(1rem, 2.4vw, 1.3rem)",
            color: INK,
            lineHeight: 1.25,
          }}
        >
          {cert.title}
        </p>
      </div>
    </div>
  );
}

function CertInfo({ cert, total, current }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={cert.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.4, ease: EASE }}
        style={{ display: "flex", flexDirection: "column", gap: 6 }}
      >
        <span
          style={{
            fontFamily: "'Google Sans', sans-serif",
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>

        {/* Certificate name — cursive, matching the AboutMe / Posters
            heading identity, instead of the old Google Sans title. */}
        <h3
          style={{
            margin: 0,
            fontFamily: "'Edu NSW ACT Cursive', cursive",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 600,
            color: INK,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          {cert.title}
        </h3>
      </motion.div>
    </AnimatePresence>
  );
}

function Dots({ total, current, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Go to certificate ${i + 1}`}
          style={{
            width: i === current ? 20 : 7,
            height: 7,
            borderRadius: 99,
            background: i === current ? ACCENT : "rgba(15,23,42,0.16)",
            border: "none",
            padding: 0,
            cursor: "pointer",
            transition: "width 0.35s cubic-bezier(0.22,1,0.36,1), background 0.25s",
            outline: "none",
          }}
        />
      ))}
    </div>
  );
}

export default function Certificates() {
  useCertFonts();

  const [cards, setCards] = useState(CERTIFICATES);
  const currentIndex = CERTIFICATES.findIndex(c => c.id === cards[0].id);

  const cycle = () => setCards(prev => [...prev.slice(1), prev[0]]);
  const jumpTo = targetIndex => {
    const certId = CERTIFICATES[targetIndex].id;
    setCards(prev => {
      const idx = prev.findIndex(c => c.id === certId);
      if (idx === 0) return prev;
      return [...prev.slice(idx), ...prev.slice(0, idx)];
    });
  };

  return (
    <>
      <style>{`
        .cert-section {
          position: relative;
          width: 100%;
          background: #ffffff;
          padding: clamp(88px, 12vw, 150px) clamp(20px, 6vw, 80px) clamp(72px, 10vw, 130px);
          box-sizing: border-box;
          display: flex;
          align-items: center;
          overflow: hidden;
          min-height: clamp(700px, 88vh, 940px);
        }

        .cert-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          width: 80%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(16px, 2.5vw, 32px);
          align-items: center;
        }

        .cert-left { display: flex; flex-direction: column; gap: clamp(20px, 3vw, 34px); }

        .cert-eyebrow {
          font-family: 'Google Sans', sans-serif;
          font-size: clamp(0.7rem, 1.4vw, 0.85rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 700;
          color: ${ACCENT};
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cert-eyebrow::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 1px;
          background: ${ACCENT};
          flex-shrink: 0;
        }

        /* Section heading — cursive, same identity as "About Me" */
        .cert-headline {
          position: relative;
          font-family: 'Google Sans', sans-serif;
          font-size: clamp(2.1rem, 4.6vw, 3.6rem);
          font-weight: 600;
          line-height: 1.05;
          margin: 0;
          letter-spacing: -0.01em;
          color: ${INK};
        }

        .cert-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cert-stack-wrap {
          position: relative;
          padding-bottom: 14%;
        }

        /* Faint accent glow behind the stack, matching the Posters
           heading glow — subtle, no hard edge. */
        .cert-stack-glow {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 70%;
          height: 70%;
          background: radial-gradient(circle, rgba(61,111,255,0.08) 0%, rgba(61,111,255,0) 65%);
          filter: blur(50px);
          pointer-events: none;
          z-index: 0;
        }

        @media (max-width: 860px) {
          .cert-section {
            padding-top: clamp(48px, 8vw, 72px);
            min-height: auto;
          }
          .cert-inner {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .cert-right { order: -1; }
          .cert-stack-wrap { padding-bottom: 18%; }
          .cert-headline { font-size: clamp(2rem, 6.5vw, 3rem); }
        }

        @media (max-width: 600px) {
          .cert-section {
            padding: 48px 20px 44px;
            align-items: flex-start;
            min-height: auto;
          }
          .cert-inner {
            grid-template-columns: 1fr;
            gap: 0px;
          }
          .cert-right { order: -1; }
          .cert-stack-wrap { padding-bottom: 24%; }
          .cert-left { gap: 12px; }
          .cert-headline { font-size: clamp(1.9rem, 10vw, 2.6rem); }
        }

        @media (max-width: 380px) {
          .cert-section { padding: 40px 14px 36px; }
          .cert-headline { font-size: clamp(1.7rem, 11vw, 2.2rem); }
          .cert-stack-wrap { padding-bottom: 28%; }
        }

        @media (min-width: 1400px) {
          .cert-inner { max-width: 1300px; }
        }
      `}</style>

      <section className="cert-section" id="certificates">
        <div className="cert-inner">
          <div className="cert-left">
            

            <FadeSlide delay={0.07}>
              <h2 className="cert-headline">Certifications</h2>
            </FadeSlide>

            <FadeSlide delay={0.14}>
              <CertInfo cert={cards[0]} total={CERTIFICATES.length} current={currentIndex} />
            </FadeSlide>

            <FadeSlide delay={0.2}>
              <Dots total={CERTIFICATES.length} current={currentIndex} onSelect={jumpTo} />
            </FadeSlide>
          </div>

          <div className="cert-right">
            <FadeSlide delay={0.1} direction="left">
              <div className="cert-stack-wrap">
                <div className="cert-stack-glow" aria-hidden />
                <CardStack cards={cards} onCycle={cycle} />
              </div>
            </FadeSlide>
          </div>
        </div>
      </section>
    </>
  );
}
import React, { useRef, useState, useCallback } from "react";

// Swap the `img` URL for your own photo any time — each card is just a
// background image with a soft sheen layered on top. Palette picked to
// sit directly on a white/blue site: white-on-blue and blue-on-white
// florals, plus a pale sky shot for a non-floral beat.
const CARDS = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1694071131970-b791c8c87d3f?fm=jpg&q=80&w=800&auto=format&fit=crop",
    label: "White Daisy, Blue Sky",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1612528907124-f8a51ef08ed5?fm=jpg&q=80&w=800&auto=format&fit=crop",
    label: "Blue Orchid",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1755936495529-e6dfa5f256f6?fm=jpg&q=80&w=800&auto=format&fit=crop",
    label: "Pale Blue Sky",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1719548955043-43cc862c6e7b?fm=jpg&q=80&w=800&auto=format&fit=crop",
    label: "Blue Flower on White",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1621063974103-385920b46ca9?fm=jpg&q=80&w=800&auto=format&fit=crop",
    label: "Blue & White Bloom",
  },
];

// Fully responsive, drop-in-anywhere version.
// Sizes itself off its own box using CSS container query units (cqi/cqb),
// so it scales correctly whether it sits in a 180px mobile slot or a
// 340px desktop one — no fixed pixel widths anywhere. Background is
// transparent so it composites straight into whatever section it's in.
export default function Card3DStack() {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    setTilt({ x: px - 0.5, y: py - 0.5 });
  }, []);

  const handleLeave = useCallback(() => {
    setHovering(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const baseRotateY = -18; // camera-style base tilt, matches reference image
  const baseRotateX = 6;

  return (
    // Outer box establishes a container-query context AND its own aspect
    // ratio, so this works even when the parent only defines a width
    // (like a flex spacer) and leaves height to content.
    <div
      style={{
        width: "100%",
        height: "100%",
        containerType: "size",
        containerName: "card3d",
      }}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleLeave}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          perspective: "120cqi",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: `
              rotateX(${baseRotateX - tilt.y * 14}deg)
              rotateY(${baseRotateY + tilt.x * 18}deg)
            `,
            transition: hovering
              ? "transform 0.15s ease-out"
              : "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {CARDS.map((card, i) => {
            const spread = hovering ? 1.15 : 1; // fan out a bit more on hover
            const offsetX = i * 14 * spread; // cqi
            const offsetY = i * 1; // cqi
            const depth = -i * 10; // cqi
            const rotY = -i * 6 * spread;
            const rotZ = -i * 1.3;

            return (
              <div
                key={card.id}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "62cqi",
                  height: "58cqb",
                  marginLeft: "-31cqi",
                  marginTop: "-29cqb",
                  borderRadius: "8cqi",
                  backgroundImage: `url(${card.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow:
                    "0 6cqi 10cqi -3cqi rgba(0,0,0,0.5), 0 2cqi 4cqi -1.5cqi rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transform: `
                    translateX(${offsetX}cqi)
                    translateY(${offsetY}cqb)
                    translateZ(${depth}cqi)
                    rotateY(${rotY}deg)
                    rotateZ(${rotZ}deg)
                  `,
                  transition:
                    "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                  zIndex: CARDS.length - i,
                  overflow: "hidden",
                }}
              >
                {/* subtle vignette / sheen to sell the "photo" feel */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(120% 90% at 30% 15%, rgba(255,255,255,0.25), rgba(255,255,255,0) 55%)",
                    mixBlendMode: "overlay",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    boxShadow: "inset 0 0 6cqi rgba(0,0,0,0.25)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
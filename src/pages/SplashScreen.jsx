import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const row1 = ["/images/p1.png", "/images/p2.png", "/images/p3.png", "/images/p4.png"];
const row2 = ["/images/p2.png", "/images/p4.png", "/images/p1.png", "/images/p3.png", "/images/p2.png"];
const row3 = ["/images/p3.png", "/images/p1.png", "/images/p4.png", "/images/p2.png", "/images/p3.png"];
const row4 = ["/images/p4.png", "/images/p3.png", "/images/p2.png", "/images/p1.png", "/images/p4.png"];

function ScrollRow({ images, direction = 1 }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = direction === 1 ? 0 : -track.scrollWidth / 2;
    let animId;

    const animate = () => {
      x += direction * 0.4;
      const half = track.scrollWidth / 2;
      if (direction === 1 && x >= half) x = 0;
      if (direction === -1 && x <= -half) x = 0;
      track.style.transform = `translateX(${x}px)`;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [direction]);

  const doubled = [...images, ...images, ...images];

  return (
    <div className="overflow-hidden w-full">
      <div
        ref={trackRef}
        className="flex gap-3 will-change-transform"
        style={{ width: "max-content" }}
      >
        {doubled.map((img, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-32 h-36 rounded-2xl overflow-hidden bg-[#1F1F1F]"
          >
            <img src={img} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-sm min-h-screen bg-[#080904] overflow-hidden">

      {/* SCROLLING IMAGE ROWS — rotated as one block */}
      <div
        className="absolute top-0 z-0"
        style={{
          transform: "rotate(-8.31deg)",
          transformOrigin: "center top",
          marginTop: "-40px",
          width: "150%",
          left: "-25%",
        }}
      >
        <div className="space-y-4 pt-2">
          <ScrollRow images={row1} direction={1} />
          <ScrollRow images={row2} direction={-1} />
          <ScrollRow images={row3} direction={1} />
          <ScrollRow images={row4} direction={-1} />
        </div>
      </div>

      {/* TOP FADE */}
      <div
        className="absolute top-0 left-0 w-full h-24 z-10"
        style={{ background: "linear-gradient(180deg, #080904 0%, transparent 100%)" }}
      />

      {/* BOTTOM FADE — starts higher so text sits ON TOP of images */}
        <div
            className="absolute left-0 w-full z-10"
            style={{
                bottom: 0,
                height: "75%",
                background: "linear-gradient(180deg, transparent 0%, #080904 60%)",
            }}
        />

      {/* BOTTOM CONTENT */}
      <div className="absolute bottom-0 left-0 w-full px-6 pb-12 z-20 flex flex-col items-center text-center">

        <h1 className="text-white text-4xl font-bold leading-tight">
          Welcome To{" "}
          <span className="text-[#D5FF00]">Trend</span>{" "}
          Marketplace
        </h1>

        <p className="text-white/80 text-base mt-4 leading-relaxed">
          Explore the top collections in fashion and buy your favorite styles as well.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-8 w-56 bg-[#D5FF00] text-black font-semibold text-base py-4 rounded-xl"
        >
          Get Started
        </button>

      </div>

    </div>
  );
}
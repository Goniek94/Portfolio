"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

export default function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[500px] flex items-center justify-center"
    >
      {/* Outer glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_70%)] opacity-20 blur-3xl"></div>

      {/* Main globe container */}
      <div className="relative w-96 h-96 flex items-center justify-center">
        {/* Globe sphere */}
        <motion.div
          className="relative w-80 h-80 rounded-full border-2 border-[#D4AF37]/30 overflow-hidden shadow-2xl"
          style={{
            rotateY: mousePos.x * 20,
            rotateX: -mousePos.y * 20,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        >
          {/* BACKGROUND IMAGE - lights.jpg jako tekstura ziemi */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <Image
              src="/img/lights.jpg"
              alt="World Map"
              fill
              className="object-cover opacity-60"
              priority
            />
            {/* Dark overlay dla kontrastu */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          </div>

          {/* GRID OVERLAY - Latitude lines (równoleżniki) */}
          <div className="absolute inset-0 z-10">
            {[...Array(9)].map((_, i) => (
              <div
                key={`lat-${i}`}
                className="absolute left-0 right-0 border-t border-[#D4AF37]/30"
                style={{
                  top: `${i * 12.5}%`,
                }}
              />
            ))}
          </div>

          {/* GRID OVERLAY - Longitude lines (południki) */}
          <div className="absolute inset-0 z-10">
            {[...Array(12)].map((_, i) => (
              <div
                key={`long-${i}`}
                className="absolute top-0 bottom-0 left-1/2 w-px origin-center"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.3), transparent)",
                  transform: `translateX(-50%) rotateZ(${i * 15}deg)`,
                }}
              />
            ))}
          </div>

          {/* Rotating meridian ring */}
          <motion.div
            className="absolute inset-0 border-2 border-[#D4AF37]/40 rounded-full z-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner rotating ring */}
          <motion.div
            className="absolute inset-8 border border-[#D4AF37]/50 rounded-full z-20"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* Glowing connection dots */}
          {[
            { top: "20%", left: "30%" },
            { top: "40%", left: "60%" },
            { top: "60%", left: "40%" },
            { top: "30%", left: "70%" },
            { top: "70%", left: "25%" },
            { top: "50%", left: "80%" },
            { top: "25%", left: "50%" },
            { top: "65%", left: "65%" },
          ].map((pos, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute w-2 h-2 bg-[#D4AF37] rounded-full z-30"
              style={{
                top: pos.top,
                left: pos.left,
                boxShadow: "0 0 15px #D4AF37, 0 0 30px #D4AF37",
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Connection lines between dots */}
          <svg
            className="absolute inset-0 w-full h-full z-20"
            style={{ overflow: "visible" }}
          >
            <motion.line
              x1="30%"
              y1="20%"
              x2="60%"
              y2="40%"
              stroke="#D4AF37"
              strokeWidth="1"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.line
              x1="60%"
              y1="40%"
              x2="40%"
              y2="60%"
              stroke="#D4AF37"
              strokeWidth="1"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                delay: 0.5,
              }}
            />
          </svg>

          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#D4AF37]/5 to-[#D4AF37]/10 pointer-events-none z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-black/50 via-transparent to-transparent pointer-events-none z-10"></div>
        </motion.div>

        {/* Orbit ring */}
        <motion.div
          className="absolute w-[420px] h-[420px] border border-[#D4AF37]/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-[#D4AF37] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_#D4AF37]"></div>
        </motion.div>
      </div>

      {/* Text below globe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-0 text-center"
      >
        <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-white uppercase tracking-tight">
          Create Your
          <br />
          Own World
        </h3>
        <p className="text-sm text-neutral-500 font-mono mt-2 tracking-wider">
          // Full-stack solutions, worldwide
        </p>
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#D4AF37]/20"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#D4AF37]/20"></div>
    </div>
  );
}

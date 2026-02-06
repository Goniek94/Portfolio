"use client";

import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaDownload,
} from "react-icons/fa";
import { useState } from "react";

export default function Contact() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <section className="relative w-full bg-[#050505] text-white py-32 px-4 md:px-12 overflow-hidden border-t border-[#222]">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_1200px_at_50%_50%,#1a1a1a,transparent)] opacity-60"></div>

      {/* FLOATING GOLD PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-[2px] w-16 bg-[#D4AF37]" />
          <span className="text-xs font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
            Let's Connect
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* LEFT SIDE - BIG STATEMENT */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
                <span className="text-white">Ready to</span>
                <br />
                <span className="text-[#D4AF37]">Build</span>
                <br />
                <span className="text-white">Something</span>
                <br />
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: "2px #D4AF37" }}
                >
                  Great?
                </span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-neutral-400 font-light leading-relaxed max-w-xl"
            >
              I'm currently{" "}
              <span className="text-[#D4AF37] font-bold">
                open to full-time opportunities
              </span>{" "}
              and challenging freelance projects. Let's create something
              extraordinary together.
            </motion.p>

            {/* AVAILABILITY STATUS */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-3 bg-[#0a0a0a] border border-[#222] px-6 py-3 rounded-full"
            >
              <div className="relative">
                <div className="w-3 h-3 bg-[#27c93f] rounded-full"></div>
                <div className="absolute inset-0 w-3 h-3 bg-[#27c93f] rounded-full animate-ping"></div>
              </div>
              <span className="text-sm font-mono text-neutral-400">
                Available for work •{" "}
                <span className="text-white">Immediate start</span>
              </span>
            </motion.div>
          </div>

          {/* RIGHT SIDE - CONTACT CARDS */}
          <div className="space-y-6">
            {/* EMAIL CARD */}
            <motion.a
              href="mailto:mateusz.goszczycki1994@gmail.com"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onHoverStart={() => setHoveredItem("email")}
              onHoverEnd={() => setHoveredItem(null)}
              className="group relative block bg-[#0a0a0a] border border-[#222] p-8 rounded-3xl hover:border-[#D4AF37] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                      <FaEnvelope
                        className="text-[#D4AF37] group-hover:text-black transition-colors"
                        size={20}
                      />
                    </div>
                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                      Primary Contact
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-[#D4AF37] transition-colors break-all">
                    mateusz.goszczycki1994@gmail.com
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Fastest response time • Usually within 24h
                  </p>
                </div>
                <motion.div
                  animate={{ x: hoveredItem === "email" ? 5 : 0 }}
                  className="text-neutral-600 group-hover:text-[#D4AF37] transition-colors"
                >
                  →
                </motion.div>
              </div>
            </motion.a>

            {/* PHONE CARD */}
            <motion.a
              href="tel:+48516223029"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onHoverStart={() => setHoveredItem("phone")}
              onHoverEnd={() => setHoveredItem(null)}
              className="group relative block bg-[#0a0a0a] border border-[#222] p-8 rounded-3xl hover:border-[#D4AF37] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                      <FaPhone
                        className="text-[#D4AF37] group-hover:text-black transition-colors"
                        size={18}
                      />
                    </div>
                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                      Direct Line
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-[#D4AF37] transition-colors font-mono">
                    +48 516 223 029
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Available Mon-Fri • 9:00 - 18:00 CET
                  </p>
                </div>
                <motion.div
                  animate={{ x: hoveredItem === "phone" ? 5 : 0 }}
                  className="text-neutral-600 group-hover:text-[#D4AF37] transition-colors"
                >
                  →
                </motion.div>
              </div>
            </motion.a>

            {/* SOCIAL & CV ROW */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-3 gap-4"
            >
              {/* GITHUB */}
              <a
                href="https://github.com/Goniek94"
                target="_blank"
                className="group bg-[#0a0a0a] border border-[#222] p-6 rounded-2xl hover:border-[#D4AF37] transition-all duration-500 flex flex-col items-center justify-center gap-3"
              >
                <FaGithub
                  className="text-[#D4AF37] group-hover:scale-110 transition-transform"
                  size={32}
                />
                <span className="text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">
                  GitHub
                </span>
              </a>

              {/* LINKEDIN */}
              <a
                href="https://linkedin.com/in/mateusz-goszczycki"
                target="_blank"
                className="group bg-[#0a0a0a] border border-[#222] p-6 rounded-2xl hover:border-[#D4AF37] transition-all duration-500 flex flex-col items-center justify-center gap-3"
              >
                <FaLinkedin
                  className="text-[#D4AF37] group-hover:scale-110 transition-transform"
                  size={32}
                />
                <span className="text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">
                  LinkedIn
                </span>
              </a>

              {/* CV DOWNLOAD */}
              <a
                href="/cv.pdf"
                download
                className="group bg-[#D4AF37] border border-[#D4AF37] p-6 rounded-2xl hover:bg-white transition-all duration-500 flex flex-col items-center justify-center gap-3"
              >
                <FaDownload
                  className="text-black group-hover:scale-110 transition-transform"
                  size={28}
                />
                <span className="text-xs font-mono text-black font-bold">
                  Download CV
                </span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM MARQUEE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-24 overflow-hidden"
        >
          <motion.div
            className="flex gap-8 text-6xl md:text-8xl font-black text-transparent uppercase whitespace-nowrap"
            style={{ WebkitTextStroke: "1.5px #D4AF37" }}
            animate={{ x: [0, -1500] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            LET'S WORK TOGETHER • OPEN FOR OPPORTUNITIES • LET'S WORK TOGETHER •
            OPEN FOR OPPORTUNITIES • LET'S WORK TOGETHER • OPEN FOR
            OPPORTUNITIES •
          </motion.div>
        </motion.div>
      </div>

      {/* FOOTER NOTE */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-[1800px] mx-auto mt-16 pt-8 border-t border-[#222] relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-600">
          <p>© 2026 Mateusz Goszczycki • All rights reserved</p>
          <p className="font-mono">
            Based in Lowicz/Warsaw, Poland 🇵🇱 • Working globally 🌍
          </p>
        </div>
      </motion.div>
    </section>
  );
}

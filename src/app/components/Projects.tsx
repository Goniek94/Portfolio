"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import VSCodeViewer from "./VSCodeViewer";
import { autosellFiles } from "../data/vscode/index";
import {
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaCode,
  FaTerminal,
} from "react-icons/fa";

// Komponent pojedynczego terminala z kodem, który aktywuje się po zjechaniu do niego
const LiveCodeTerminal = ({
  snippets,
}: {
  snippets: { name: string; code: string }[];
}) => {
  const [index, setIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const containerRef = useRef(null);

  // Sprawdzamy czy terminal jest widoczny na ekranie
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return; // Jeśli nie widać, nic nie rób

    let i = 0;
    setDisplayedCode("");
    const currentSnippet = snippets[index];

    const typingInterval = setInterval(() => {
      setDisplayedCode(currentSnippet.code.slice(0, i));
      i++;
      if (i > currentSnippet.code.length) {
        clearInterval(typingInterval);
        // Czekaj 4 sekundy i przełącz na kolejny plik
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % snippets.length);
        }, 4000);
      }
    }, 20); // Szybkość pisania

    return () => clearInterval(typingInterval);
  }, [index, snippets, isInView]);

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[320px] bg-[#0d0d0d] rounded-[1.5rem] overflow-hidden border border-[#222] group-hover:border-[#D4AF37]/50 transition-all duration-700 shadow-2xl flex flex-col font-mono"
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161616] border-b border-[#222]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={snippets[index].name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-neutral-500 text-[10px] uppercase tracking-widest flex items-center gap-2"
          >
            <FaTerminal size={10} /> {snippets[index].name}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Code Area */}
      <div className="p-6 flex-1 overflow-hidden relative">
        <pre className="text-[#ce9178] leading-relaxed text-[11px] md:text-[13px] whitespace-pre">
          <code>
            {displayedCode}
            <span className="animate-pulse bg-[#D4AF37] w-1.5 h-4 inline-block ml-1"></span>
          </code>
        </pre>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-60"></div>

        {/* Overlay po najechaniu */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#D4AF37]/5 backdrop-blur-[1px]">
          <div className="bg-[#1e1e1e] border border-[#333] text-white px-4 py-2 rounded-lg flex items-center gap-3 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <FaCode className="text-[#D4AF37]" />
            <span className="font-bold text-[10px] uppercase tracking-widest">
              Launch Full Editor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const projects = [
  {
    id: 1,
    number: "01",
    title: "Autosell.pl",
    category: "Full-Stack Ecosystem",
    year: "2024 — 2025",
    description:
      "Enterprise automotive marketplace with high-performance search engine, real-time notifications, and professional admin dashboard.",
    tech: ["Next.js", "Node.js", "MongoDB", "Socket.IO", "Redis"],
    snippets: [
      {
        name: "adController.js",
        code: `static async getAllAds(req, res, next) {
  const { brand, model, minPrice, maxPrice } = req.query;
  const filter = { status: getActiveStatusFilter() };

  if (brand) filter.brand = brand;
  if (model) filter.model = model;

  const ads = await Ad.find(filter)
    .sort({ createdAt: -1 })
    .limit(30);
}`,
      },
      {
        name: "socketService.js",
        code: `this.io = new Server(server, {
  cors: { origin: ["http://localhost:3000"] },
  pingTimeout: 60000,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000
  }
});`,
      },
    ],
    website: "https://www.autosell.pl",
    isInteractive: true,
  },
  {
    id: 2,
    number: "02",
    title: "WinXP OS Portfolio",
    category: "Interactive Simulation",
    year: "2025",
    description:
      "A deep dive into browser-based operating systems. Complex state management for windowing, file systems, and real-time audio.",
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    snippets: [
      {
        name: "WindowManager.tsx",
        code: `export const WindowProvider = ({ children }) => {
  const [activeWindows, setActive] = useState([]);
  
  const focusWindow = (id) => {
    setZIndex(prev => prev + 1);
    updateWindowOrder(id);
  };
};`,
      },
    ],
    website: "https://mateusz-goszczycki-portfolio.vercel.app/",
    github: "https://github.com/Goniek94",
    isInteractive: true,
  },
  {
    id: 3,
    number: "03",
    title: "Transport Services",
    category: "Core Web Vitals King",
    year: "2024",
    description:
      "Built for speed and SEO. Custom Vanilla JS component loader to eliminate framework overhead and achieve 99+ Lighthouse score.",
    tech: ["HTML5", "SCSS", "Vanilla JS", "Gulp"],
    snippets: [
      {
        name: "componentLoader.js",
        code: `const initLazyComponents = () => {
  const components = document.querySelectorAll('[data-lazy]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) load(entry.target);
    });
  });
};`,
      },
    ],
    website: "https://phumarbus.pl",
    github: "https://github.com/Goniek94",
    isInteractive: true,
  },
];

export default function Projects() {
  const [isVSCodeOpen, setIsVSCodeOpen] = useState(false);

  return (
    <section
      id="projects"
      className="relative w-full bg-[#050505] text-[#e1e1e1] pb-16 px-4 md:px-12 overflow-hidden border-t border-[#111] -mt-24 md:-mt-40 pt-20"
    >
      <VSCodeViewer
        isOpen={isVSCodeOpen}
        onClose={() => setIsVSCodeOpen(false)}
        files={autosellFiles}
        title="Autosell-Repo"
      />

      <div className="max-w-[1700px] mx-auto relative z-10">
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 border-b border-[#222] pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 font-mono text-xs text-[#D4AF37] tracking-[0.4em] uppercase font-bold">
              <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></span>{" "}
              Systems & Products
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none">
              Featured
              <br />
              Projects
            </h2>
          </div>

          <div className="bg-[#0a0a0a] border border-[#222] p-6 rounded-3xl flex flex-col md:flex-row gap-8 items-center shadow-2xl">
            <div className="space-y-3 text-right">
              <div className="flex items-center gap-4 justify-end">
                <a
                  href="mailto:mateusz.goszczycki1994@gmail.com"
                  className="text-sm font-bold text-white hover:text-[#D4AF37] transition-colors font-mono cursor-pointer"
                >
                  mateusz.goszczycki1994@gmail.com
                </a>
                <FaEnvelope className="text-[#D4AF37]" />
              </div>
              <div className="flex items-center gap-4 justify-end">
                <a
                  href="tel:+48516223029"
                  className="text-sm font-bold text-white hover:text-[#D4AF37] transition-colors font-mono cursor-pointer"
                >
                  +48 516 223 029
                </a>
                <FaPhoneAlt className="text-[#D4AF37]" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 border-l border-[#222] pl-8">
              <a
                href="https://github.com/Goniek94"
                target="_blank"
                className="px-5 py-2.5 bg-[#111] border border-[#222] rounded-full text-[10px] font-mono text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all cursor-pointer"
              >
                <FaGithub size={16} /> github_repo_root
              </a>
            </div>
          </div>
        </div>

        {/* --- PROJECTS LIST --- */}
        <div className="flex flex-col gap-10 md:gap-16">
          {projects.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center group cursor-pointer border border-transparent p-4 md:p-6 rounded-[2rem] bg-[#0a0a0a]/30 transition-all duration-500 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/[0.02]"
              onClick={() => setIsVSCodeOpen(true)}
            >
              {/* LEFT: INFO */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-6 font-mono">
                  <span className="text-5xl font-black text-[#151515] group-hover:text-[#D4AF37] transition-colors duration-700">
                    {project.number}
                  </span>
                  <span className="h-[2px] w-12 bg-[#222]"></span>
                  <span className="text-neutral-600 text-[10px] uppercase tracking-[0.3em] font-bold">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter transition-colors group-hover:text-[#D4AF37] leading-none">
                  {project.title}
                </h3>
                <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-2xl font-light italic">
                  "{project.description}"
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 bg-[#050505] border border-[#222] text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest rounded-lg"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div
                  className="flex items-center gap-8 pt-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      className="text-white font-black uppercase tracking-widest text-[10px] border-b-4 border-[#D4AF37] pb-1 hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer px-1"
                    >
                      Live Site ↗
                    </a>
                  )}
                  <button
                    onClick={() => setIsVSCodeOpen(true)}
                    className="flex items-center gap-2 text-[#4ec9b0] font-mono text-[11px] uppercase font-black hover:text-white transition-all cursor-pointer"
                  >
                    <FaCode /> [ INSPECT_SOURCE ]
                  </button>
                </div>
              </div>

              {/* RIGHT: SMART TERMINAL */}
              <div className="lg:col-span-5 relative h-full">
                <LiveCodeTerminal snippets={project.snippets} />
                <div className="absolute -z-10 -top-3 -right-3 w-full h-full border border-[#D4AF37]/5 rounded-[1.5rem] rotate-1 group-hover:rotate-2 transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

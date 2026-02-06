"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import VSCodeViewer from "./VSCodeViewer";
import { autosellFiles } from "../data/vscode/index";
import { ecomatiFiles } from "../data/vscode/ecomatiFiles";
import { FaCode, FaTerminal } from "react-icons/fa";

const LiveCodeTerminal = ({
  snippets,
}: {
  snippets: { name: string; code: string }[];
}) => {
  const [index, setIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let i = 0;
    setDisplayedCode("");
    const currentSnippet = snippets[index];

    const typingInterval = setInterval(() => {
      setDisplayedCode(currentSnippet.code.slice(0, i));
      i++;
      if (i > currentSnippet.code.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % snippets.length);
        }, 4000);
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [index, snippets, isInView]);

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[320px] bg-[#0d0d0d] rounded-[1.5rem] overflow-hidden border border-[#222] group-hover:border-[#D4AF37]/50 transition-all duration-700 shadow-2xl flex flex-col font-mono"
    >
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

      <div className="p-6 flex-1 overflow-hidden relative">
        <pre className="text-[#ce9178] leading-relaxed text-[11px] md:text-[13px] whitespace-pre">
          <code>
            {displayedCode}
            <span className="animate-pulse bg-[#D4AF37] w-1.5 h-4 inline-block ml-1"></span>
          </code>
        </pre>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-60"></div>

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
    title: "Ecomati Shop",
    category: "E-Commerce Platform",
    year: "2024 — 2025",
    description:
      "Modern organic food e-commerce platform with dynamic product variants, shopping cart management, and Prisma ORM integration. Built with Next.js 14 and TypeScript.",
    tech: ["Next.js 14", "TypeScript", "Prisma", "PostgreSQL", "Framer Motion"],
    snippets: [
      {
        name: "ProductCard.tsx",
        code: `const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

const currentVariant = product.variants?.[selectedVariantIndex];
const displayPrice = currentVariant?.price || product.price;
const displaySize = currentVariant?.size || product.sizes?.[0] || "Standard";

const handleQuickAdd = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  addToCart(product, displaySize, 1);
  showToast(\`Dodano do koszyka: \${product.name} (\${displaySize})\`);
};

const handleVariantClick = (e: React.MouseEvent, index: number) => {
  e.preventDefault();
  e.stopPropagation();
  setSelectedVariantIndex(index);
};`,
      },
      {
        name: "CartContext.tsx",
        code: `const addToCart = (product: Product, size: string, quantity: number = 1) => {
  setCart((prev) => {
    const existing = prev.find(
      (item) => item.id === product.id && item.selectedSize === size,
    );

    if (existing) {
      return prev.map((item) =>
        item.id === product.id && item.selectedSize === size
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    } else {
      const newItem: CartItem = {
        ...product,
        cartId: \`\${product.id}-\${size}\`,
        selectedSize: size,
        quantity: quantity,
      };
      return [...prev, newItem];
    }
  });
};`,
      },
      {
        name: "page.tsx",
        code: `async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
        isAvailable: true,
      },
      take: 12,
      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map((p: any) => {
      const weightOptions = p.weightOptions as any;
      const hasVariants =
        weightOptions?.variants && weightOptions.variants.length > 0;

      const firstVariant = hasVariants ? weightOptions.variants[0] : null;
      const displaySize = firstVariant?.size || "";
      const displayPrice = firstVariant?.price || p.price;
      const variantCount = hasVariants ? weightOptions.variants.length : 0;

      const variants = hasVariants
        ? weightOptions.variants.map((v: any) => ({
            size: v.size,
            price: \`\${v.price} zł\`,
            priceNumeric: parseFloat(v.price),
          }))
        : undefined;

      return {
        id: Number(p.id),
        name: p.name,
        desc: p.shortDescription || "",
        price: \`\${displayPrice} zł\`,
        displaySize,
        variantCount,
        image: p.mainImage || "/Img/Olejbio.png",
        category: p.category,
        group: p.productGroup || "",
        featured: p.isFeatured,
        sizes: hasVariants
          ? weightOptions.variants.map((v: any) => v.size)
          : [],
        variants,
      };
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}`,
      },
    ],
    website: "https://ecomati-shop.vercel.app",
    github: "https://github.com/Goniek94/ecomati",
    isInteractive: true,
  },
  {
    id: 2,
    number: "02",
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
    id: 3,
    number: "03",
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
    id: 4,
    number: "04",
    title: "ShopX E-Commerce",
    category: "Modern Online Store",
    year: "2024",
    description:
      "Full-featured e-commerce platform with Stripe payments, inventory management, and analytics dashboard. Built for scalability and conversion optimization.",
    tech: ["Next.js 14", "Prisma", "PostgreSQL", "Stripe", "Zustand"],
    snippets: [
      {
        name: "checkout.ts",
        code: `export async function createCheckout(items: CartItem[]) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'pln',
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: \`\${url}/success\`,
  });
  
  return session;
}`,
      },
    ],
    website: "https://shopx-demo.vercel.app",
    github: "https://github.com/Goniek94/shopx",
    isInteractive: true,
  },
  {
    id: 5,
    number: "05",
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
  const [currentFiles, setCurrentFiles] = useState(autosellFiles);
  const [currentTitle, setCurrentTitle] = useState("Autosell-Repo");

  const openVSCode = (files: any[], title: string) => {
    setCurrentFiles(files);
    setCurrentTitle(title);
    setIsVSCodeOpen(true);
  };

  return (
    <section
      id="projects"
      className="relative w-full bg-[#050505] text-[#e1e1e1] py-32 px-4 md:px-12 overflow-hidden"
    >
      <VSCodeViewer
        isOpen={isVSCodeOpen}
        onClose={() => setIsVSCodeOpen(false)}
        files={currentFiles}
        title={currentTitle}
      />

      <div className="max-w-[1700px] mx-auto relative z-10">
        {/* --- HEADER --- */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[2px] w-16 bg-[#D4AF37]" />
            <span className="text-xs font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
              Systems & Products
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none mb-8"
          >
            Featured
            <br />
            Projects
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-neutral-500 font-light leading-relaxed"
          >
            Real-world applications built from concept to deployment.
            <br />
            Click any project to explore the source code.
          </motion.p>
        </div>

        {/* --- PROJECTS GRID --- */}
        <div className="flex flex-col gap-24">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center group cursor-pointer border border-[#222] p-8 rounded-[2rem] bg-[#0a0a0a] transition-all duration-500 hover:border-[#D4AF37]/60 hover:bg-[#0f0f0f] hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]"
              onClick={() => {
                if (project.id === 1) {
                  openVSCode(ecomatiFiles, "Ecomati-Repo");
                } else if (project.id === 2) {
                  openVSCode(autosellFiles, "Autosell-Repo");
                } else {
                  setIsVSCodeOpen(true);
                }
              }}
            >
              {/* LEFT: INFO */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-6 font-mono">
                  <span className="text-6xl font-black text-[#151515] group-hover:text-[#D4AF37] transition-colors duration-700">
                    {project.number}
                  </span>
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-[#222] to-transparent"></div>
                </div>

                <div className="space-y-2">
                  <span className="text-neutral-600 text-xs uppercase tracking-[0.3em] font-bold block">
                    {project.category} • {project.year}
                  </span>
                  <h3 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter transition-colors group-hover:text-[#D4AF37] leading-none">
                    {project.title}
                  </h3>
                </div>

                <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-4 py-2 bg-[#050505] border border-[#222] text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest rounded-lg hover:border-[#D4AF37] transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div
                  className="flex items-center gap-6 pt-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      className="group/link flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs border-b-2 border-[#D4AF37] pb-2 hover:border-white transition-all"
                    >
                      View Live Site
                      <span className="group-hover/link:translate-x-1 transition-transform">
                        →
                      </span>
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (project.id === 1) {
                        openVSCode(ecomatiFiles, "Ecomati-Repo");
                      } else if (project.id === 2) {
                        openVSCode(autosellFiles, "Autosell-Repo");
                      } else {
                        setIsVSCodeOpen(true);
                      }
                    }}
                    className="flex items-center gap-2 text-[#4ec9b0] font-mono text-xs uppercase font-black hover:text-white transition-all"
                  >
                    <FaCode size={14} /> Explore Code
                  </button>
                </div>
              </div>

              {/* RIGHT: TERMINAL */}
              <div className="lg:col-span-5 relative h-full">
                <LiveCodeTerminal snippets={project.snippets} />

                {/* Glowing shadow effect */}
                <div className="absolute -z-10 -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute -z-10 -top-4 -right-4 w-full h-full border border-[#D4AF37]/20 rounded-[1.5rem] rotate-2 group-hover:rotate-3 transition-all duration-700"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

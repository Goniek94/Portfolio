import { FileNode } from "./vscode/index";

export const ecomatiShopFiles: FileNode = {
  name: "SHOP",
  language: "json",
  isOpen: true,
  children: [
    {
      name: "ProductCard.tsx",
      language: "typescript",
      content: `"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Product } from "./Products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

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
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        group flex flex-col h-full bg-white 
        relative overflow-hidden cursor-pointer
        border border-[#1F2A14]/15 shadow-sm
        transition-all duration-500 ease-out
        hover:-translate-y-2
        hover:border-[#1F2A14]/40
        hover:shadow-[0_30px_50px_-12px_rgba(31,42,20,0.15)]
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={\`/sklep/\${product.id}\`} className="flex flex-col h-full">
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F6F5EE] border-b border-[#1F2A14]/10">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          {product.featured && (
            <div className="absolute top-0 left-0 bg-[#1F2A14] text-[#F4FFD9] text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2 z-10 shadow-sm">
              Bestseller
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow p-6 text-center bg-white relative z-10">
          <h3 className="text-xl font-serif text-[#1F2A14] mb-2 group-hover:text-[#3A4A22] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-[10px] text-[#6B705C] uppercase tracking-widest mb-4">
            {product.desc}
          </p>

          <motion.span
            key={displayPrice}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-bold text-[#1F2A14] mt-auto mb-3"
          >
            {displayPrice}
          </motion.span>

          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={(e) => handleVariantClick(e, index)}
                  className={\`
                    px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-all duration-200
                    \${
                      selectedVariantIndex === index
                        ? "bg-[#3A4A22] text-[#F4FFD9] border-[#3A4A22] shadow-md"
                        : "bg-white text-[#1F2A14] border-[#1F2A14]/20 hover:border-[#3A4A22] hover:bg-[#F6F5EE]"
                    }
                  \`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="grid grid-cols-[1fr_60px] border-t border-[#1F2A14]/15 bg-white relative z-10">
        <Link
          href={\`/sklep/\${product.id}\`}
          className="flex items-center justify-center gap-2 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#1F2A14] group-hover:bg-[#1F2A14] group-hover:text-[#F4FFD9] transition-colors duration-300"
        >
          Szczegóły
        </Link>

        <button
          className="flex items-center justify-center border-l border-[#1F2A14]/15 text-[#1F2A14] hover:bg-[#FFD966] transition-colors duration-300 z-20 cursor-pointer"
          onClick={handleQuickAdd}
        >
          <ShoppingBag size={18} strokeWidth={2} />
        </button>
      </div>
    </motion.div>
  );
}`,
    },
    {
      name: "HeroTitle.tsx",
      language: "typescript",
      content: `export default function HeroTitle() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
      <h1 className="relative leading-none text-[#F4FFD9]">
        <span className="block text-[clamp(3rem,8vw,8rem)] font-serif tracking-tight">
          Czysta energia
        </span>

        <span className="block text-[clamp(3.5rem,9vw,9.5rem)] italic font-serif">
          natury
        </span>

        <span className="mt-4 block text-sm tracking-[0.3em] text-[#FFD966] uppercase">
          Od nasion do zdrowia
        </span>

        {/* linia dekoracyjna – styl AXIOM */}
        <span className="absolute top-1/2 left-full ml-6 h-px w-32 bg-[#FFD966]/70" />
      </h1>
    </div>
  );
}`,
    },
    {
      name: "NaturalSelection.tsx",
      language: "typescript",
      content: `"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const slides = [
  {
    quote: "Tłoczymy tylko to, co sami podajemy naszym dzieciom.",
    author: "Gwarancja Jakości",
    description:
      "Nie magazynujemy produktów. Tłoczymy na bieżąco, aby zachować pełnię życia w każdej kropli.",
  },
  {
    quote: "Natura nie spieszy się, a mimo to wszystko osiąga.",
    author: "Lao Tzu",
    description:
      "Tłoczenie na zimno w niskiej temperaturze to jedyny sposób na zachowanie biologicznego bogactwa.",
  },
  {
    quote: "Twoje pożywienie powinno być lekarstwem.",
    author: "Hipokrates",
    description:
      "Dostarczamy Ci czystą energię wprost z nasion, bez żadnych kompromisów i ulepszaczy.",
  },
];

export default function NaturalSelection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="natural-selection"
      className="relative py-20 bg-[#F6F5EE] overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-[#1F2A14]/10" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
              flex flex-col justify-center 
              p-10 md:p-16 rounded-[2rem]
              bg-white 
              border border-[#3A4A22]/30 
              shadow-[0_20px_40px_-20px_rgba(58,74,34,0.1)]
            "
          >
            <span className="block text-xs font-bold tracking-[0.4em] uppercase text-[#6B705C] mb-8">
              Filozofia Marki
            </span>

            <h2 className="text-5xl md:text-6xl xl:text-7xl font-serif text-[#1F2A14] leading-[0.9] tracking-tight mb-8">
              Naturalna <br />
              <span className="italic text-[#3A4A22]">Selekcja</span>
            </h2>

            <div className="w-12 h-[2px] bg-[#3A4A22] mb-8"></div>

            <p className="text-[#1F2A14]/80 text-lg font-light leading-relaxed">
              Wybraliśmy dla Ciebie produkty, które definiują jakość Ecomati.
              Czysty skład, zero przetworzenia, maksimum natury. To nasza
              obietnica.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="
              relative flex flex-col justify-center
              p-10 md:p-16 rounded-[2rem]
              bg-white 
              border border-[#3A4A22]/30 
              shadow-[0_20px_40px_-20px_rgba(58,74,34,0.1)]
            "
          >
            <Quote className="absolute top-8 right-8 text-[#3A4A22]/5 w-32 h-32 -rotate-12 pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <p className="text-2xl md:text-3xl font-serif italic text-[#1F2A14] mb-8 leading-snug">
                  „{slides[currentSlide].quote}"
                </p>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3A4A22]">
                    {slides[currentSlide].author}
                  </span>
                  <p className="text-[#6B705C] text-sm leading-relaxed max-w-md border-l-2 border-[#3A4A22]/20 pl-4 mt-2">
                    {slides[currentSlide].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 mt-12">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={\`h-1.5 rounded-full transition-all duration-300 \${idx === currentSlide ? "w-8 bg-[#3A4A22]" : "w-1.5 bg-[#3A4A22]/20"}\`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}`,
    },
    {
      name: "CartContext.tsx",
      language: "typescript",
      content: `"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/components/shop/Products";

export interface CartItem extends Product {
  cartId: string;
  selectedSize: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("ecomati_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ecomati_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, size: string, quantity: number = 1) => {
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
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((sum, item) => {
    const priceNumber = parseFloat(
      item.price.replace(",", ".").replace(/[^0-9.]/g, ""),
    );
    return sum + priceNumber * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}`,
    },
  ],
};

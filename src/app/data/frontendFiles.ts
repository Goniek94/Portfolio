import { FileNode } from "./vscode/index";

export const frontendFiles: FileNode = {
  name: "FRONTEND",
  language: "json",
  isOpen: true,
  children: [
    {
      name: "StatsCard.tsx",
      language: "typescript",
      content: `"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  trend?: string;
}

// Nowoczesny komponent dashboardu z animacją wejścia
export function StatsCard({ title, value, icon: Icon, description, trend }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5] hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-[#3A4A22]/10 rounded-lg">
          <Icon className="w-5 h-5 text-[#3A4A22]" />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-[#1F2A14]">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        
        {trend && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}`,
    },
    {
      name: "ProductDetailClient.tsx",
      language: "typescript",
      content: `"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "Standard");
  const [quantity, setQuantity] = useState(1);

  // Logika obliczania dostępności wariantu w czasie rzeczywistym
  const getCurrentStock = () => {
    if (product.variants?.length > 0) {
      const variant = product.variants.find((v) => v.size === selectedSize);
      return variant ? variant.stock : 0;
    }
    return 999;
  };

  const handleAddToCart = () => {
    if (getCurrentStock() > 0) {
      addToCart(product, selectedSize, quantity);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Sekcja Wizualna */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative aspect-square bg-[#F5F5F0] rounded-3xl overflow-hidden"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-8 hover:scale-105 transition-transform duration-700"
        />
      </motion.div>

      {/* Sekcja Interaktywna */}
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-serif text-[#1F2A14] mb-4">{product.name}</h1>
        
        <div className="flex gap-4 mb-8">
          {product.sizes?.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={\`px-4 py-2 rounded-full border transition-all \${
                selectedSize === size
                  ? "bg-[#3A4A22] text-white border-[#3A4A22]"
                  : "border-gray-200 text-gray-600 hover:border-[#3A4A22]"
              }\`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-xl">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-gray-50">-</button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-3 hover:bg-gray-50">+</button>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={getCurrentStock() === 0}
            className="flex-1 bg-[#3A4A22] text-white py-4 rounded-xl hover:bg-[#2C3819] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getCurrentStock() > 0 ? \`Dodaj do koszyka - \${product.price} PLN\` : "Wyprzedane"}
          </button>
        </div>
      </div>
    </div>
  );
}`,
    },
  ],
};

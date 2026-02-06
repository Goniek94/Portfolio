import { ecomatiShopFiles } from "../ecomatiShopFiles";
import { ecomatiAdminFiles } from "../ecomatiAdminFiles";
import { FileNode } from "./index";

export const ecomatiFiles: FileNode[] = [
  ecomatiShopFiles,
  ecomatiAdminFiles,
  {
    name: "README.md",
    language: "markdown",
    content: `# Ecomati - Organic Food E-Commerce Platform

## Overview
Full-stack e-commerce platform for organic food products with modern admin dashboard.

## Structure
- **SHOP**: Next.js 14 storefront with product variants and cart management
- **ADMIN**: Admin dashboard for product and order management

## Features
- Dynamic Product Variants
- Shopping Cart with LocalStorage
- Prisma ORM Integration
- Framer Motion Animations
- Admin Dashboard with Statistics
`,
  },
];

"use client";

import React, { useState } from "react";
import ProductGrid from "@/components/modules/pos/ProductGrid";
import CartPanel from "@/components/modules/pos/CartPanel";
import { ProductItem, CartItem } from "@/types/pos";
import { initialProductCatalog } from "@/lib/mock-pos-data";

export default function SalesPosPage() {
  // Initialized with the 3 default items matching the screenshot
  const [cart, setCart] = useState<CartItem[]>([
    { product: initialProductCatalog[0], quantity: 1 },
    { product: initialProductCatalog[1], quantity: 1 },
    { product: initialProductCatalog[2], quantity: 1 },
  ]);

  const handleSelectProduct = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-5 pb-6">
      {/* Product Catalog Grid Section (Left) */}
      <div className="flex-1 min-w-0">
        <ProductGrid onSelectProduct={handleSelectProduct} />
      </div>

      {/* Cart & Checkout Panel (Right) */}
      <div className="w-full lg:w-[380px] xl:w-[410px] shrink-0">
        <CartPanel
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}

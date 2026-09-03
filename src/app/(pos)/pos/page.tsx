"use client";

import React, { useState, useEffect } from "react";
import ProductGrid from "@/components/modules/pos/ProductGrid";
import CartPanel from "@/components/modules/pos/CartPanel";
import { ProductItem, CartItem } from "@/types/pos";
import { PosService } from "@/services";

export default function PosPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    PosService.getProducts().then((products) => {
      if (products.length >= 3) {
        setCart([
          { product: products[0], quantity: 1 },
          { product: products[1], quantity: 1 },
          { product: products[2], quantity: 1 },
        ]);
      }
    });
  }, []);

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

  const handleRestoreCart = (items: CartItem[]) => {
    setCart(items);
  };

  return (
    // pos-split (globals.css) keeps the designed 50/50 up to the design width,
    // then pins the invoice column at its natural 565 so a wide monitor gives
    // the extra pixels to the product grid instead.
    <div className="pos-split grid w-full grid-cols-1 gap-[31px]">
      {/* Product list (left) — 45:2171 */}
      <div className="min-w-0">
        <ProductGrid onSelectProduct={handleSelectProduct} />
      </div>

      {/* Cart & checkout (right) — 45:2333 */}
      <div className="min-w-0">
        <CartPanel
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onRestoreCart={handleRestoreCart}
        />
      </div>
    </div>
  );
}

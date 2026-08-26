"use client";

import React from "react";
import { MetricCardData } from "@/types/dashboard";
import { 
  Sprout, 
  Receipt, 
  ShoppingCart, 
  Users, 
  ArrowUp
} from "lucide-react";

interface MetricCardsProps {
  metrics: MetricCardData[];
}

const iconMap = {
  revenue: Sprout,
  sales: Receipt,
  orders: ShoppingCart,
  customers: Users,
};

export default function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {metrics.map((item) => {
        const IconComponent = iconMap[item.icon] || Receipt;

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all"
          >
            <div className="flex items-start gap-3.5">
              {/* Circular Icon */}
              <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-100/60 flex items-center justify-center text-[#F4B41A] shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Label & Value */}
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase">
                  {item.title}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 tracking-tight">
                  {item.value}
                </span>
              </div>
            </div>

            {/* Growth / Trend */}
            <div className="flex items-center gap-1 mt-4 text-[11px] font-medium text-emerald-600">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
              <span>
                {item.trend} {item.vsText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}


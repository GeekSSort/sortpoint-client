import React from "react";
import MaskIcon from "./MaskIcon";
import Trend from "./Trend";

/** Figma 77:20923 — dashboard metric card. */
export default function StatCard({
  title,
  value,
  trend,
  icon = "/icons/ui/stat-default.svg",
  className = "",
}: {
  title: string;
  value: React.ReactNode;
  trend?: React.ReactNode;
  icon?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-start overflow-clip rounded-[10px] bg-white p-[24px] outline outline-1 -outline-offset-1 outline-surface ${className}`}
    >
      <div className="flex w-full items-start gap-[16px]">
        <span className="relative flex size-[40px] shrink-0 items-center justify-center overflow-clip rounded-full bg-white text-brand outline outline-1 -outline-offset-1 outline-brand">
          <span className="relative size-[24px]">
            <MaskIcon src={icon} inset="8.33% 4.72% 8.33% 8.33%" />
          </span>
        </span>
        <div className="flex flex-col items-start justify-center gap-[10px]">
          <p className="text-14 font-medium text-muted">{title}</p>
          <p className="text-20 font-medium text-heading">{value}</p>
          {trend && <Trend>{trend}</Trend>}
        </div>
      </div>
    </div>
  );
}

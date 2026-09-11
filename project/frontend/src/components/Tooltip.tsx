import type { ReactNode } from "react";

function Tooltip({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`group/tooltip relative block min-w-0 ${className}`}>
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-purple/40 bg-[#0a0d1c] px-2 py-1 text-xs normal-case tracking-normal text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:opacity-100">
        {label}
      </span>
    </span>
  );
}

export default Tooltip;

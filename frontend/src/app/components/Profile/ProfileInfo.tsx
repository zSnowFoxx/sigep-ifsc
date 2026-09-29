import React from "react";

interface InfoTileProps {
  label: string;
  value: React.ReactNode;
  wide?: boolean;
}

export function InfoTile({ label, value, wide }: InfoTileProps) {
  return (
    <div
      className={`flex flex-col gap-1.5 px-4 py-3.5 rounded-xl border ${
        wide ? "col-span-3" : ""
      }`}
      style={{ borderColor: "#ebebeb", background: "#fafbfc" }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <div className="text-sm font-semibold text-gray-800 leading-snug">
        {value}
      </div>
    </div>
  );
}
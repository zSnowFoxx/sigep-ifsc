import React from "react";

interface CardProps {
  children: React.ReactNode;
  title: string;
  icon: React.ElementType;
}

export function Card({ children, title, icon: Icon }: CardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
      <div
        className="flex items-center gap-3 px-6 py-4 border-b border-gray-100"
        style={{ background: "#fafbfc" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "#e8f0eb" }}
        >
          <Icon size={14} style={{ color: "#0f4a23" }} />
        </div>
        <h2 className="text-sm font-bold text-gray-800">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
import React from "react";
import { Search, ChevronDown } from "lucide-react";

export interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
}) => (
  <div className="relative flex-1 max-w-xs">
    <Search
      size={13}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border bg-gray-50 outline-none transition-all"
      style={{ borderColor: "#e5e7eb", color: "#111827" }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#15622f";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(21,98,47,0.07)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  </div>
);

export interface FilterSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
}) => (
  <div className="relative shrink-0">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none pl-3 pr-8 py-2 text-xs rounded-xl border bg-gray-50 outline-none cursor-pointer font-medium"
      style={{
        borderColor: value ? "#15622f" : "#e5e7eb",
        color: value ? "#0f4a23" : "#374151",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <ChevronDown
      size={11}
      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />
  </div>
);
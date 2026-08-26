import React, { useState } from "react";
import { ChevronDown, X, Plus, Check } from "lucide-react";

// ── Utilitários e Estilos Base ──────────────────────────────────────────────

export const inputBase =
  "w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all";

export const inputStyle: React.CSSProperties = {
  borderColor: "#e5e7eb",
  color: "#111827",
  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
};

export const focusCss = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  e.currentTarget.style.borderColor = "#15622f";
  e.currentTarget.style.boxShadow =
    "0 0 0 3px rgba(21,98,47,0.08), inset 0 1px 2px rgba(0,0,0,0.03)";
};

export const blurCss = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  e.currentTarget.style.borderColor = "#e5e7eb";
  e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.03)";
};

// ── Componentes de Formulário Primitivos ──────────────────────────────────────

export const FLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
    {children}
    {required && <span className="text-rose-500">*</span>}
  </label>
);

export interface FInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  type?: string;
  disabled?: boolean;
}

export const FInput: React.FC<FInputProps> = ({
  value,
  onChange,
  placeholder,
  mono,
  type = "text",
  disabled,
}) => (
  <input
    type={type}
    value={value}
    disabled={disabled}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={inputBase}
    style={{
      ...inputStyle,
      fontFamily: mono ? "'JetBrains Mono', monospace" : undefined,
    }}
    onFocus={focusCss}
    onBlur={blurCss}
  />
);

export const FNumber: React.FC<Omit<FInputProps, "type">> = ({
  value,
  onChange,
  placeholder,
  disabled,
}) => (
  <input
    type="number"
    value={value}
    disabled={disabled}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={inputBase}
    style={inputStyle}
    onFocus={focusCss}
    onBlur={blurCss}
  />
);

export interface FSelectOption {
  value: string;
  label: string;
}

export interface FSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: (string | FSelectOption)[];
  placeholder?: string;
  disabled?: boolean;
}

export const FSelect: React.FC<FSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Selecione...",
  disabled,
}) => (
  <div className="relative w-full">
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputBase} appearance-none cursor-pointer pr-8`}
      style={{
        ...inputStyle,
        color: value ? "#111827" : "#9ca3af",
      }}
      onFocus={focusCss}
      onBlur={blurCss}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const lbl = typeof opt === "string" ? opt : opt.label;
        return (
          <option key={val} value={val}>
            {lbl}
          </option>
        );
      })}
    </select>
    <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

export const FRow: React.FC<{ children: React.ReactNode; cols?: number }> = ({
  children,
  cols = 2,
}) => (
  <div className={`grid gap-4 ${cols === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
    {children}
  </div>
);

export const ToggleStatus: React.FC<{ value: string; onChange: (v: string) => void }> = ({
  value,
  onChange,
}) => (
  <div className="flex gap-2 w-full">
    {["Ativo", "Inativo"].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        className="flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all"
        style={{
          borderColor: value === s ? (s === "Ativo" ? "#16a34a" : "#dc2626") : "#e5e7eb",
          background: value === s ? (s === "Ativo" ? "#f0fdf4" : "#fff8f8") : "white",
          color: value === s ? (s === "Ativo" ? "#166534" : "#dc2626") : "#9ca3af",
        }}
      >
        {s}
      </button>
    ))}
  </div>
);

// ── Creatable Tag Input (Autocompletar / Criar Funções) ─────────────────────

export interface CreatableTagInputProps {
  value: string[];
  onChange: (v: string[]) => void;
  allTags: string[];
  placeholder?: string;
}

export const CreatableTagInput: React.FC<CreatableTagInputProps> = ({
  value,
  onChange,
  allTags,
  placeholder = "Adicionar função...",
}) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const suggestions = allTags.filter(
    (t) => !value.includes(t) && t.toLowerCase().includes(text.toLowerCase())
  );
  const canCreate =
    text.trim().length > 0 &&
    !allTags.some((t) => t.toLowerCase() === text.trim().toLowerCase()) &&
    !value.includes(text.trim());

  const showMenu = open && (suggestions.length > 0 || canCreate);

  const add = (tag: string) => {
    if (!value.includes(tag)) onChange([...value, tag]);
    setText("");
    setOpen(false);
  };

  const remove = (tag: string) => onChange(value.filter((v) => v !== tag));

  return (
    <div className="w-full">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border"
              style={{
                background: "#faf5ff",
                color: "#7e22ce",
                borderColor: "#e9d5ff",
              }}
            >
              {tag}
              <button
                type="button"
                onClick={() => remove(tag)}
                className="hover:opacity-60 ml-0.5"
              >
                <X className="w-2.5 h-2.5 stroke-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              e.preventDefault();
              add(text.trim());
            }
          }}
          placeholder={placeholder}
          className={inputBase}
          style={inputStyle}
          onFocusCapture={focusCss}
          onBlurCapture={blurCss}
        />
        {showMenu && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={() => add(s)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors"
              >
                {s}
              </button>
            ))}
            {canCreate && (
              <button
                type="button"
                onMouseDown={() => add(text.trim())}
                className="w-full text-left px-3 py-2 text-xs hover:bg-purple-50 transition-colors flex items-center gap-2 border-t border-gray-100"
                style={{ color: "#7e22ce" }}
              >
                <Plus className="w-3 h-3" /> Criar nova função: &ldquo;{text.trim()}&rdquo;
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Multi-select pills (Dropdown com Seleção Múltipla) ─────────────────────

export interface MultiSelectPillsProps {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
  placeholder?: string;
}

export const MultiSelectPills: React.FC<MultiSelectPillsProps> = ({
  value,
  onChange,
  options,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const toggle = (opt: string) =>
    value.includes(opt)
      ? onChange(value.filter((v) => v !== opt))
      : onChange([...value, opt]);

  return (
    <div className="w-full">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border"
              style={{
                background: "#eff6ff",
                color: "#1d4ed8",
                borderColor: "#bfdbfe",
              }}
            >
              {v}
              <button
                type="button"
                onClick={() => toggle(v)}
                className="hover:opacity-60"
              >
                <X className="w-2.5 h-2.5 stroke-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-xl border bg-gray-50 transition-all"
          style={{
            borderColor: open ? "#15622f" : "#e5e7eb",
            color: value.length ? "#111827" : "#9ca3af",
          }}
        >
          <span>
            {value.length
              ? `${value.length} turma(s) selecionada(s)`
              : placeholder || "Selecionar turmas..."}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        {open && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-44 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                    value.includes(opt)
                      ? "bg-[#15622f] border-[#15622f]"
                      : "border-gray-300"
                  }`}
                >
                  {value.includes(opt) && (
                    <Check className="w-2.5 h-2.5 text-white stroke-3" />
                  )}
                </div>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
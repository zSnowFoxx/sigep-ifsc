const PALETTE = [
  "#15622f", "#1d6b9a", "#7c3aed", "#b45309",
  "#0f766e", "#be185d", "#1e40af", "#92400e", "#4c1d95"
];

export function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).map((n) => n[0].toUpperCase()).slice(0, 2).join("");
}

export function avatarColor(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

export function stripPrefix(nome: string): string {
  return nome
    .replace(/^Técnico em\s+/i, "")
    .replace(/^Técnico\s+/i, "")
    .replace(/^Superior em\s+/i, "")
    .replace(/^Bacharelado em\s+/i, "")
    .trim();
}

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
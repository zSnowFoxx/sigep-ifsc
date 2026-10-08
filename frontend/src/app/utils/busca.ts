// Texto para comparação em buscas: sem diferenciar maiúsculas, acentos e espaços nas pontas
// ("joao" encontra "João").
export const normalizar = (texto: string) =>
  texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

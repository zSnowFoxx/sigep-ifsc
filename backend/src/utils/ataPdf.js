const PDFDocument = require('pdfkit');

// Layout das atas oficiais do IFSC (ex.: Ata da 3ª Reunião Ordinária do Colegiado do Câmpus Lages):
// cabeçalho com Data/Horário/Local e paginação em todas as páginas, título centralizado, quadro de
// participantes, "Definições" com a frase de abertura, pauta numerada, seções numeradas com
// subseções em romanos, encerramento padrão e assinaturas.

// Nome da instituição no cabeçalho das atas (troque aqui se o sistema for usado em outra instituição).
const INSTITUICAO = 'INSTITUTO FEDERAL DE SANTA CATARINA';
const TIPOS = { 1: 'Intermediário', 2: 'Final' };
const GRAVIDADES = { 'nao-urgente': 'não urgente', urgente: 'urgente', critica: 'crítica' };
const RISCOS = { baixo: 'baixo', medio: 'médio', alto: 'alto', critico: 'crítico' };
const FUSO = 'America/Sao_Paulo';
const LINHA = '_'.repeat(70);

// O pdfkit carrega as fontes padrão sob demanda (createRequire), o que o rastreador de arquivos da
// Vercel não enxerga: sem estes requires as fontes ficam fora do deploy e nenhuma ata é gerada.
// Ao trocar uma fonte abaixo, adicione o require correspondente (Helvetica é a fonte inicial do pdfkit).
require('pdfkit/standard-fonts/Helvetica');
require('pdfkit/standard-fonts/HelveticaBold');
require('pdfkit/standard-fonts/TimesRoman');
require('pdfkit/standard-fonts/TimesBold');
const FONTE = 'Times-Roman';
const FONTE_NEGRITO = 'Times-Bold';
const FONTE_TITULO = 'Helvetica-Bold';
const FONTE_CABECALHO = 'Helvetica';
const TAMANHO = 11;
const MARGEM_SUPERIOR = 150;
const MARGEM_INFERIOR = 70;
const MARGEM_LATERAL = 60;

// Partes de data e hora no fuso de Brasília.
function partesData(valor) {
  const partes = new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO,
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23'
  }).formatToParts(new Date(valor));
  const pegar = (tipo) => Number(partes.find((p) => p.type === tipo).value);
  return { dia: pegar('day'), mes: pegar('month'), ano: pegar('year'), hora: pegar('hour'), minuto: pegar('minute') };
}

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

const UNIDADES = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
  'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const DEZENAS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];

// Número por extenso até 99 ("vinte e três"); usado no dia e no ano da ata.
function porExtenso(n) {
  if (n < 20) return UNIDADES[n];
  const dezena = DEZENAS[Math.floor(n / 10)];
  const unidade = n % 10;
  return unidade === 0 ? dezena : `${dezena} e ${UNIDADES[unidade]}`;
}

// Anos fora de 2000–2099 saem em algarismos, para não virar "undefined" no texto.
const anoPorExtenso = (ano) => {
  if (ano < 2000 || ano > 2099) return String(ano);
  const resto = ano - 2000;
  return resto === 0 ? 'dois mil' : `dois mil e ${porExtenso(resto)}`;
};

const formatarData = (valor) => {
  if (!valor) return null;
  const { dia, mes, ano } = partesData(valor);
  return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
};

const formatarHora = (valor) => {
  const { hora, minuto } = partesData(valor);
  return `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
};

const formatarMedia = (valor) => (valor === null || valor === undefined ? '—' : Number(valor).toFixed(1).replace('.', ','));

const unicos = (valores) => [...new Set(valores.filter(Boolean))];

const juntar = (valores) => {
  if (valores.length <= 1) return valores.join('');
  return `${valores.slice(0, -1).join(', ')} e ${valores[valores.length - 1]}`;
};

function paragrafo(doc, texto, opcoes = {}) {
  doc.font(FONTE).fontSize(TAMANHO).text(texto, { align: 'justify', lineGap: 2, ...opcoes });
}

// Parágrafo com campos em branco longos: justificado, os sublinhados esticariam as palavras da linha.
function paragrafoEsquerda(doc, texto) {
  doc.font(FONTE).fontSize(TAMANHO).text(texto, { align: 'left', lineGap: 2 });
}

// Título de seção numerado, em negrito ("1. Abertura e verificação de quórum.").
function secao(doc, numero, titulo) {
  doc.moveDown(0.9);
  doc.font(FONTE_NEGRITO).fontSize(TAMANHO).text(`${numero}. ${titulo}`);
  doc.moveDown(0.3);
}

// Subseção em romanos ("I – Deliberações individuais").
function subsecao(doc, numeral, titulo) {
  doc.moveDown(0.5);
  doc.font(FONTE_NEGRITO).fontSize(TAMANHO).text(`${numeral} – ${titulo}`, { indent: 18 });
  doc.moveDown(0.2);
}

// Campo com valor do sistema, ou linha em branco para preencher à mão quando o valor não existe.
function campo(doc, nome, valor, { recuo = 0 } = {}) {
  doc.font(FONTE_NEGRITO).text(`${nome}: `, { continued: true, indent: recuo });
  doc.font(FONTE).text(valor || LINHA);
}

// Linhas vazias para escrita manual (texto que o sistema não tem).
function linhasEmBranco(doc, quantidade, recuo = 18) {
  for (let i = 0; i < quantidade; i++) {
    doc.moveDown(0.9);
    doc.font(FONTE).text(LINHA, { indent: recuo });
  }
}

function lista(doc, itens, recuo = 36) {
  doc.font(FONTE);
  itens.forEach((item) => doc.text(`- ${item}`, { indent: recuo, align: 'justify' }));
}

// Tabela simples com bordas horizontais. Quebra de página quando a linha não cabe.
function tabela(doc, colunas, linhas) {
  const larguraTotal = colunas.reduce((soma, c) => soma + c.largura, 0);
  const x0 = doc.page.margins.left;
  const desenharLinha = (celulas, negrito) => {
    doc.font(negrito ? FONTE_NEGRITO : FONTE).fontSize(10);
    const alturas = celulas.map((texto, i) => doc.heightOfString(texto, { width: colunas[i].largura - 8 }));
    const altura = Math.max(...alturas, 14) + 6;
    if (doc.y + altura > doc.page.height - doc.page.margins.bottom) doc.addPage();
    const y = doc.y;
    let x = x0;
    celulas.forEach((texto, i) => {
      doc.text(texto, x + 4, y + 3, { width: colunas[i].largura - 8 });
      x += colunas[i].largura;
    });
    doc.moveTo(x0, y + altura).lineTo(x0 + larguraTotal, y + altura).lineWidth(0.5).stroke('#000000');
    doc.y = y + altura;
  };
  desenharLinha(colunas.map((c) => c.titulo), true);
  linhas.forEach((linha) => desenharLinha(linha, false));
  doc.moveDown(0.5);
}

function blocoDemanda(doc, demanda, nomeTurma, alunos) {
  doc.font(FONTE_NEGRITO).text(nomeTurma, { indent: 18 });
  const representante = demanda?.aluno_representante_id ? alunos.get(demanda.aluno_representante_id)?.nome : null;
  campo(doc, 'Representante discente', representante, { recuo: 36 });

  if (!demanda) {
    paragrafo(doc, 'Não há demandas registradas no sistema para esta turma. Preencher, se houver:', { indent: 36 });
    linhasEmBranco(doc, 3, 36);
    doc.moveDown(0.5);
    return;
  }

  doc.font(FONTE_NEGRITO).text('Síntese diagnóstica:', { indent: 36 });
  if (demanda.sintese_diagnostico) {
    paragrafo(doc, demanda.sintese_diagnostico, { indent: 36 });
  } else {
    linhasEmBranco(doc, 2, 36);
  }
  doc.font(FONTE_NEGRITO).text('Pontos positivos:', { indent: 36 });
  if ((demanda.pontos_positivos ?? []).length > 0) lista(doc, demanda.pontos_positivos, 54);
  else doc.font(FONTE).text('—', { indent: 54 });
  doc.font(FONTE_NEGRITO).text('Dificuldades apontadas:', { indent: 36 });
  if ((demanda.dificuldades_apontadas ?? []).length > 0) lista(doc, demanda.dificuldades_apontadas, 54);
  else doc.font(FONTE).text('—', { indent: 54 });
  doc.font(FONTE_NEGRITO).text('Demandas gerais:', { indent: 36 });
  if ((demanda.demandasGerais ?? []).length > 0) {
    lista(doc, demanda.demandasGerais.map((d) => `${d.situacao} (${GRAVIDADES[d.gravidade] ?? d.gravidade})`), 54);
  } else {
    doc.font(FONTE).text('—', { indent: 54 });
  }
  if (demanda.registros_observacoes) {
    doc.font(FONTE_NEGRITO).text('Observações:', { indent: 36 });
    paragrafo(doc, demanda.registros_observacoes, { indent: 36 });
  }
  doc.moveDown(0.6);
}

// Cabeçalho (Data, Horário, Local e paginação) e rodapé em todas as páginas, como nas atas do IFSC.
function cabecalhoERodape(doc, dataReuniao, rodapeTexto) {
  const range = doc.bufferedPageRange();
  const data = dataReuniao ? formatarData(dataReuniao) : '____/____/______';
  const horario = dataReuniao ? formatarHora(dataReuniao) : '____';
  const largura = doc.page.width - 2 * MARGEM_LATERAL;
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const margens = { ...doc.page.margins };
    doc.page.margins.top = 0;
    doc.page.margins.bottom = 0;

    doc.font(FONTE_CABECALHO).fontSize(9).fillColor('#000000');
    doc.text(INSTITUICAO, MARGEM_LATERAL, 45, { width: 260, lineBreak: false });
    doc.text(`Data:      ${data}`, MARGEM_LATERAL + 300, 35, { width: 200, lineBreak: false });
    doc.text(`Horário:  ${horario}`, MARGEM_LATERAL + 300, 48, { width: 200, lineBreak: false });
    doc.text(`Local:     ____________________`, MARGEM_LATERAL + 300, 61, { width: 200, lineBreak: false });
    doc.text(`Página ${i + 1}`, MARGEM_LATERAL + 300, 90, { width: largura - 300, align: 'right', lineBreak: false });
    doc.moveTo(MARGEM_LATERAL, 108).lineTo(doc.page.width - MARGEM_LATERAL, 108).lineWidth(1.5).stroke('#000000');

    doc.font(FONTE).fontSize(8).fillColor('#444444');
    doc.text(`${rodapeTexto}`, MARGEM_LATERAL, doc.page.height - 40, { width: largura, align: 'center', lineBreak: false });

    doc.page.margins = margens;
  }
}

// Monta a ata em PDF. O chamador faz pipe() e depois doc.end().
// Campos que o sistema não guarda (campus, local, horários de início e término, número da ata,
// presidente, secretário, encaminhamentos gerais, assinaturas, data de aprovação) saem em branco.
function gerarAtaPdf({
  conselho,
  turmas,
  servidores,
  alunos,
  demandas,
  deliberacoes,
  retificacoes,
  abonos,
  coordenacao,
  matriculados,
  riscosPorTurma
}) {
  const titulo = `Ata do Conselho de Classe ${TIPOS[conselho.tipo] ?? ''} - ${conselho.nome}`;
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: MARGEM_SUPERIOR, bottom: MARGEM_INFERIOR, left: MARGEM_LATERAL, right: MARGEM_LATERAL },
    bufferPages: true,
    info: { Title: titulo, Author: 'SIGEP-IFSC' }
  });

  const dataReuniao = conselho.data_realizacao ?? null;
  const partes = dataReuniao ? partesData(dataReuniao) : null;
  const anoReuniao = partes ? partes.ano : new Date().getFullYear();
  const cursos = unicos(coordenacao.map((c) => c.curso));
  const coordenadores = unicos(coordenacao.map((c) => c.coordenador));
  const periodos = unicos(coordenacao.map((c) => c.periodo));
  const tipo = TIPOS[conselho.tipo] ?? '';

  // Título, como "Ata da 3ª Reunião Ordinária do Colegiado do Câmpus"
  doc.font(FONTE_TITULO).fontSize(13).text(`Ata do Conselho de Classe ${tipo.toLowerCase()} do Câmpus ${'_'.repeat(20)}`, {
    align: 'center'
  });
  doc.font(FONTE).fontSize(10).text(`Nº ${'_'.repeat(6)} / ${anoReuniao} – ${conselho.nome}`, { align: 'center' });
  doc.moveDown(0.8);

  // Quadro de participantes (NOME | ÁREA | PRESENÇA)
  doc.font(FONTE_NEGRITO).fontSize(10).text('PARTICIPANTES', { align: 'left' });
  doc.moveDown(0.3);
  const linhasParticipantes = conselho.servidores.map((s) => {
    const usuario = servidores.get(s.usuarioId);
    const presenca =
      s.presente === true ? 'Presente' : s.presente === false ? 'Ausente' : '( ) Presente  ( ) Ausente';
    return [usuario?.nome ?? `Servidor ${s.usuarioId}`, usuario?.cargo ?? '—', presenca];
  });
  if (linhasParticipantes.length === 0) {
    linhasParticipantes.push(['', '', '']);
    linhasParticipantes.push(['', '', '']);
  }
  tabela(
    doc,
    [
      { titulo: 'NOME', largura: 200 },
      { titulo: 'ÁREA / CARGO', largura: 195 },
      { titulo: 'PRESENÇA', largura: 100 }
    ],
    linhasParticipantes
  );

  // Definições: frase de abertura, como nas atas do Colegiado
  doc.moveDown(0.4);
  const yCaixa = doc.y;
  doc.font(FONTE_NEGRITO).fontSize(11).text('Definições', MARGEM_LATERAL + 6, yCaixa + 4);
  doc.rect(MARGEM_LATERAL, yCaixa, doc.page.width - 2 * MARGEM_LATERAL, 22).lineWidth(0.8).stroke('#000000');
  doc.y = yCaixa + 30;
  doc.moveDown(0.3);

  const dataExtenso = partes
    ? `Aos ${porExtenso(partes.dia)} dias do mês de ${MESES[partes.mes - 1]} de ${anoPorExtenso(partes.ano)}`
    : `Aos ${'_'.repeat(20)} dias do mês de ${'_'.repeat(20)} de ${'_'.repeat(12)}`;
  paragrafoEsquerda(
    doc,
    `${dataExtenso}, às ${'_'.repeat(4)} horas, na ${'_'.repeat(30)}, realizou-se o Conselho de Classe ` +
      `${tipo.toLowerCase()} do(s) curso(s) ${cursos.length > 0 ? juntar(cursos) : LINHA}, referente ao período ` +
      `letivo ${periodos.length > 0 ? juntar(periodos) : LINHA}, sob a presidência de ${'_'.repeat(30)} e a ` +
      `coordenação de ${coordenadores.length > 0 ? juntar(coordenadores) : LINHA}, conforme convocação previamente ` +
      'encaminhada aos membros. Estiveram presentes os membros relacionados na lista de presença, parte integrante desta Ata.'
  );

  doc.moveDown(0.6);
  doc.font(FONTE_NEGRITO).fontSize(TAMANHO).text('Pauta:');
  const pauta = [
    'Abertura e verificação de quórum;',
    'Análise do desempenho e da frequência das turmas;',
    'Demandas gerais por turma;',
    'Deliberações e retificações individuais;',
    'Encaminhamentos e observações gerais;',
    'Encerramento.'
  ];
  pauta.forEach((item, i) => doc.font(FONTE).text(`${i + 1}) ${item}`, { indent: 18 }));

  // 1. Abertura e verificação de quórum
  secao(doc, 1, 'Abertura e verificação de quórum');
  const registrados = conselho.servidores.length;
  const presentes = conselho.servidores.filter((s) => s.presente === true).length;
  if (registrados > 0) {
    paragrafo(
      doc,
      `Aberta a reunião, verificou-se o quórum: estiveram presentes ${presentes} de ${registrados} membros ` +
        'registrados no sistema, conforme a lista de presença.'
    );
  } else {
    paragrafo(doc, 'Aberta a reunião, verificou-se o quórum conforme a lista de presença. Membros registrados no sistema: nenhum.');
    linhasEmBranco(doc, 2, 0);
  }

  // 2. Análise do desempenho e da frequência das turmas
  secao(doc, 2, 'Análise do desempenho e da frequência das turmas');
  conselho.turmaIds.forEach((turmaId, i) => {
    const nome = turmas.get(turmaId)?.nome ?? `Turma ${turmaId}`;
    subsecao(doc, ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i] ?? `${i + 1}`, nome);
    campo(doc, 'Alunos matriculados', String(matriculados.get(turmaId) ?? 0), { recuo: 18 });
    const riscos = riscosPorTurma.get(turmaId) ?? [];
    if (riscos.length === 0) {
      paragrafo(doc, 'Não há alunos em atenção ou risco no painel de risco.', { indent: 18 });
    } else {
      paragrafo(doc, `Foram identificados ${riscos.length} aluno(s) em atenção ou risco, conforme o painel de risco:`, { indent: 18 });
      lista(
        doc,
        riscos.map((r) => `${r.nome} (${r.matricula}): risco ${RISCOS[r.risco] ?? r.risco}. ${r.fatores.join('; ')}`),
        36
      );
    }
    linhasEmBranco(doc, 1, 18);
  });
  if (conselho.turmaIds.length === 0) paragrafo(doc, 'Nenhuma turma vinculada ao conselho.');

  // 3. Demandas gerais por turma
  secao(doc, 3, 'Demandas gerais por turma');
  const demandaPorTurma = new Map(demandas.map((d) => [d.turma_id, d]));
  for (const turmaId of conselho.turmaIds) {
    blocoDemanda(doc, demandaPorTurma.get(turmaId), turmas.get(turmaId)?.nome ?? `Turma ${turmaId}`, alunos);
  }

  // 4. Deliberações e retificações individuais
  secao(doc, 4, 'Deliberações e retificações individuais');
  subsecao(doc, 'I', 'Deliberações por discente');
  if (deliberacoes.length === 0) {
    paragrafo(doc, 'Não há deliberações registradas no sistema. Preencher, se houver:', { indent: 18 });
    linhasEmBranco(doc, 3, 18);
  }
  for (const d of deliberacoes) {
    const aluno = alunos.get(d.aluno_id);
    doc.font(FONTE_NEGRITO).text(`${aluno?.nome ?? `Aluno ${d.aluno_id}`} (${aluno?.matricula ?? '—'})`, { indent: 18 });
    paragrafo(doc, d.alteracoes_realizadas, { indent: 36 });
    doc.moveDown(0.3);
  }

  subsecao(doc, 'II', 'Retificações de média');
  if (retificacoes.length === 0) {
    paragrafo(doc, 'Não houve retificação de média registrada.', { indent: 18 });
  }
  for (const r of retificacoes) {
    paragrafo(
      doc,
      `${r.aluno} (${r.matricula}), ${r.disciplina}: média ${formatarMedia(r.media_original)} retificada para ${formatarMedia(r.media_retificada)}.`,
      { indent: 18 }
    );
  }

  subsecao(doc, 'III', 'Abonos de faltas');
  if (abonos.length === 0) {
    paragrafo(doc, 'Não houve abono de faltas registrado.', { indent: 18 });
  }
  for (const a of abonos) {
    paragrafo(doc, `${a.aluno} (${a.matricula}), ${a.disciplina}: ${a.horas}h, ${a.tipo}.`, { indent: 18 });
    if (a.fundamentacao) {
      paragrafo(doc, `Fundamentação: ${a.fundamentacao}`, { indent: 36 });
    }
  }

  // 5. Encaminhamentos e observações gerais
  secao(doc, 5, 'Encaminhamentos e observações gerais');
  linhasEmBranco(doc, 4, 0);

  // 6. Encerramento, no mesmo padrão das atas do Colegiado
  secao(doc, 6, 'Encerramento');
  paragrafo(
    doc,
    `Nada mais havendo a tratar, o Presidente agradeceu a participação de todos e encerrou a reunião às ${'_'.repeat(4)} horas. ` +
      `Para constar, eu, ${'_'.repeat(35)}, lavrei a presente Ata, que será disponibilizada para apreciação e ` +
      'aprovação dos membros presentes na reunião.'
  );

  // Assinaturas: presidente, secretário e membros presentes (nomes do sistema, assinatura em branco).
  // O bloco inteiro vai para a página seguinte se não couber, para não sobrar página só com assinatura.
  const alturaAssinaturas = (2 + conselho.servidores.length) * 52 + 40;
  if (doc.y + alturaAssinaturas > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
  doc.moveDown(1.2);
  const assinatura = (cargo, nome = null) => {
    doc.moveDown(1.0);
    doc.font(FONTE).text('_'.repeat(60));
    if (cargo) doc.font(FONTE).text(cargo);
    doc.font(FONTE).text(nome ? nome : `Nome: ${'_'.repeat(40)}`);
  };
  assinatura('Presidente do Conselho de Classe');
  assinatura('Secretário(a)');
  for (const s of conselho.servidores) {
    assinatura(null, servidores.get(s.usuarioId)?.nome ?? `Servidor ${s.usuarioId}`);
  }
  doc.moveDown(0.8);
  doc.font(FONTE).text('Ata aprovada em ____ / ____ / ________.');

  cabecalhoERodape(
    doc,
    dataReuniao,
    `SIGEP-IFSC · Emitido em ${formatarData(new Date())} ${formatarHora(new Date())}`
  );
  return doc;
}

module.exports = gerarAtaPdf;

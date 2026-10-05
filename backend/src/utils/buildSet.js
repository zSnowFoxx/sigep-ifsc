// Monta "coluna = ?" para os campos enviados (undefined = não alterar).
function buildSet(fieldMap, data, converters = {}) {
  const columns = [];
  const values = [];

  for (const [key, column] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      columns.push(`${column} = ?`);
      values.push(converters[key] ? converters[key](data[key]) : data[key]);
    }
  }

  return { columns, values };
}

module.exports = buildSet;

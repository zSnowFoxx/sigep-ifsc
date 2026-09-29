function isForeignKeyViolation(error) {
  return error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW';
}

function isRowReferenced(error) {
  return error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED';
}

function isDuplicateEntry(error) {
  return error.code === 'ER_DUP_ENTRY';
}

module.exports = {
  isForeignKeyViolation,
  isRowReferenced,
  isDuplicateEntry
};

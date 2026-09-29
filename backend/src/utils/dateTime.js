const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// new Date('YYYY-MM-DD') is UTC midnight, which shifts to the previous day in UTC-3.
function toDateTime(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (DATE_ONLY_REGEX.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
}

module.exports = toDateTime;

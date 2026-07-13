export function formatPercentage(value, fractionDigits = 0) {
  return `${Number(value).toFixed(fractionDigits)}%`;
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Number(value));
}

export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(Number(value));
}

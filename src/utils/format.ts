export const formatNumber = (value?: number, digits = 2): string => {
  if (value === undefined || Number.isNaN(value)) return '-';
  return new Intl.NumberFormat('ja-JP', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0
  }).format(value);
};

export const formatPercent = (value?: number, digits = 2): string => {
  if (value === undefined || Number.isNaN(value)) return '-';
  return `${formatNumber(value, digits)}%`;
};

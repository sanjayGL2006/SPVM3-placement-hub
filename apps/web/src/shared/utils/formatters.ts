export const formatCurrency = (amountInLakhs?: number): string => {
  if (amountInLakhs === undefined || amountInLakhs === null) return 'N/A';
  return `₹${amountInLakhs.toFixed(1)} LPA`;
};

export const formatPercentage = (val?: number): string => {
  if (val === undefined || val === null) return '0%';
  return `${val.toFixed(1)}%`;
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr?: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const formatNumber = (val?: number): string => {
  if (val === undefined || val === null) return '0';
  return new Intl.NumberFormat('en-IN').format(val);
};

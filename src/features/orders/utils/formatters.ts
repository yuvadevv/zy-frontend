export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString));
};

export const formatTime = (dateString: string): string => {
  if (!dateString || dateString === 'hidden') return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  } catch (e) {
    return '';
  }
};

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  return `${formatDate(dateString)}, ${formatTime(dateString)}`;
};

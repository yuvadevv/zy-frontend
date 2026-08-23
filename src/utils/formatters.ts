export function formatMoney(amount: number | string | null | undefined): string {
  if (amount == null) return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  
  // Format as Indian Rupee (INR)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
}

export function parseSafeDate(timestamp: string | number | null | undefined): Date | null {
  if (!timestamp) return null;
  const num = Number(timestamp);
  if (isNaN(num)) return null;

  // If timestamp is less than 10 billion (e.g., 2001-09-09), it's likely seconds, not ms.
  // We'll treat anything < 20000000000 as seconds to prevent "1970" bugs.
  // Example: 1718000000 is 2024 in seconds. In ms it is 1970.
  let ms = num;
  if (num < 20000000000) {
    ms = num * 1000;
  }
  
  const d = new Date(ms);
  // Check for Invalid Date
  if (isNaN(d.getTime())) return null;
  return d;
}

export function formatDate(timestamp: string | number | null | undefined, includeTime = true): string {
  const d = parseSafeDate(timestamp);
  if (!d) return 'Date unavailable';

  const dateOpts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const timeOpts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

  const dateStr = d.toLocaleDateString('en-IN', dateOpts);
  if (!includeTime) return dateStr;
  
  const timeStr = d.toLocaleTimeString('en-IN', timeOpts);
  return `${dateStr} • ${timeStr}`;
}

export function formatCompactETA(timestamp: string | number | null | undefined): string {
  const d = parseSafeDate(timestamp);
  if (!d) return 'Not set';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const targetDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
  const timeOpts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
  const timeStr = d.toLocaleTimeString('en-IN', timeOpts);

  if (targetDate.getTime() === today.getTime()) {
    return `Today • ${timeStr}`;
  } else if (targetDate.getTime() === tomorrow.getTime()) {
    return `Tmrw • ${timeStr}`;
  } else {
    const dateOpts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const dateStr = d.toLocaleDateString('en-IN', dateOpts);
    return `${dateStr} • ${timeStr}`;
  }
}

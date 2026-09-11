/**
 * Format number into Brazilian Real (R$)
 */
export function formatCurrency(value: number): string {
  if (isNaN(value) || value === null || value === undefined) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format compact currency for charts (e.g., R$ 15k, R$ 1,2M)
 */
export function formatCurrencyCompact(value: number): string {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1).replace('.', ',')}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(0)}k`;
  }
  return formatCurrency(value);
}

/**
 * Format date string YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDateBR(dateStr?: string): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Format month key YYYY-MM to readable name e.g. "Out/26"
 */
export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const monthNamesShort = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  const mIndex = parseInt(month, 10) - 1;
  const shortYear = year.slice(-2);
  return `${monthNamesShort[mIndex] || month}/${shortYear}`;
}

/**
 * Format month key YYYY-MM to full name e.g. "Outubro de 2026"
 */
export function formatMonthFullLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const mIndex = parseInt(month, 10) - 1;
  return `${monthNames[mIndex] || month} de ${year}`;
}

/**
 * Calculate due dates for N installments starting from a date
 */
export function generateInstallmentDates(startDate: string, count: number, intervalDays: number = 30): string[] {
  const dates: string[] = [];
  const base = new Date(startDate + 'T12:00:00');
  
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    // Use month advancement for clean monthly dates or day addition
    d.setMonth(d.getMonth() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  
  return dates;
}

/**
 * Property type human label
 */
export function getPropertyTypeLabel(type: string): string {
  const map: Record<string, string> = {
    apartamento: 'Apartamento',
    casa: 'Casa / Sobrado',
    terreno: 'Terreno / Lote',
    comercial: 'Sala / Comercial',
    lancamento: 'Lançamento na Planta',
    rural: 'Chácara / Rural',
    outro: 'Outro Imóvel',
  };
  return map[type] || 'Imóvel';
}

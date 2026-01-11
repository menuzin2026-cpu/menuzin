import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: number, currency: string = 'IQD'): string {
  // Format IQD without decimal places (common for Iraqi Dinar)
  if (currency === 'IQD') {
    return `${Math.round(price).toLocaleString('en-US')} IQD`
  }
  // Format USD with dollar sign and 2 decimal places
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }
  // Fallback for other currencies
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}


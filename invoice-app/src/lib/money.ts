/** Formats an amount in cents for display, e.g. 123456 -> "$1,234.56". */
export function formatCents(cents: number, currency = "USD"): string {
  const sign = cents < 0 ? "-" : "";
  const absolute = Math.abs(Math.round(cents));
  const whole = Math.floor(absolute / 100);
  const fraction = String(absolute % 100).padStart(2, "0");
  const grouped = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  return `${sign}${symbol}${grouped}.${fraction}`;
}

/** Parses a user-entered amount like "1,234.50" into integer cents. */
export function parseAmount(input: string): number {
  const cleaned = input.replace(/[^0-9.-]/g, "");
  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value)) {
    throw new Error(`Invalid amount: ${input}`);
  }
  return Math.round(value * 100);
}

/** Adds up a list of cent amounts. */
export function sumCents(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

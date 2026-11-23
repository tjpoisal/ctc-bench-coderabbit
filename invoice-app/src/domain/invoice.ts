import { formatCents } from "../lib/money";

export type InvoiceStatus = "draft" | "sent" | "paid" | "void";

export interface LineItem {
  description: string;
  quantity: number;
  unitPriceCents: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  status: InvoiceStatus;
  issuedAt: Date;
  dueAt: Date;
  items: LineItem[];
  paidAt?: Date;
}

/** Total of all line items, in cents. */
export function invoiceTotal(invoice: Invoice): number {
  return invoice.items.reduce((total, item) => total + item.quantity * item.unitPriceCents, 0);
}

/** One-line summary such as "INV-1 · 3 items · $12.00". */
export function formatInvoiceSummary(invoice: Invoice): string {
  const count = invoice.items.length;
  return `${invoice.id} · ${count} ${count === 1 ? "item" : "items"} · ${formatCents(invoiceTotal(invoice))}`;
}

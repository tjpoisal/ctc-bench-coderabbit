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

/** Total of all line items. */
export function invoiceTotal(invoice: Invoice): number {
  let total = 0;
  for (const item of invoice.items) {
    total += item.quantity * item.unitPriceCents;
  }
  return total / 100;
}

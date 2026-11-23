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

/** True while the invoice has not been sent. */
export function isDraft(invoice: Invoice): boolean {
  return invoice.status === "draft";
}

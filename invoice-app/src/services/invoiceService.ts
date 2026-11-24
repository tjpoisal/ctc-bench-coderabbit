import { InvoiceRepo } from "../db/invoiceRepo";
import { invoiceTotal, type Invoice, type LineItem } from "../domain/invoice";
import { addDays, isOverdue } from "../lib/dates";
import { request } from "../lib/http";
import { formatCents } from "../lib/money";

export class InvoiceService {
  constructor(
    private readonly repo: InvoiceRepo,
    private readonly notifyUrl: string,
  ) {}

  createInvoice(id: string, customerId: string, items: LineItem[], now: Date = new Date()): Invoice {
    const invoice: Invoice = {
      id,
      customerId,
      status: "draft",
      issuedAt: now,
      dueAt: addDays(now, 30),
      items,
    };
    return this.repo.save(invoice);
  }

  getInvoice(id: string): Invoice | undefined {
    return this.repo.findById(id);
  }

  markPaid(id: string): Invoice {
    const invoice = this.repo.findById(id);
    if (!invoice) {
      throw new Error(`Invoice ${id} not found`);
    }
    return this.repo.save({ ...invoice, status: "paid", paidAt: new Date() });
  }

  listOverdue(now: Date = new Date()): Invoice[] {
    return this.repo
      .list()
      .filter((invoice) => invoice.status === "sent" && isOverdue(invoice.dueAt, now))
      .map((invoice) => this.applyLateFee(invoice));
  }

  private applyLateFee(invoice: Invoice): Invoice {
    const fee = Math.round(invoiceTotal(invoice) * 0.05);
    const updated = { ...invoice, items: [...invoice.items, { description: "Late fee", quantity: 1, unitPriceCents: fee }] };
    return this.repo.save(updated);
  }

  async sendReminder(id: string): Promise<void> {
    const invoice = this.repo.findById(id);
    if (!invoice) {
      throw new Error(`Invoice ${id} not found`);
    }
    await request(this.notifyUrl, {
      method: "POST",
      body: { customerId: invoice.customerId, message: `Invoice ${id} for ${formatCents(invoiceTotal(invoice))} is overdue.` },
    });
  }
}

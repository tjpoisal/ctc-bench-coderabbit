import { v4 as uuidv4 } from "uuid";
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

  createInvoice(id: string | undefined, customerId: string, items: LineItem[], now: Date = new Date()): Invoice {
    const invoice: Invoice = {
      id: id ?? uuidv4(),
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
    return this.repo.save({ ...invoice, status: "paid" });
  }

  listOverdue(now: Date = new Date()): Invoice[] {
    return this.repo.list().filter((invoice) => invoice.status === "sent" && isOverdue(invoice.dueAt, now));
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

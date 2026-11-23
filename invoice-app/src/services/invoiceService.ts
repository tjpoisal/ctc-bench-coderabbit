import { InvoiceRepo } from "../db/invoiceRepo";
import { invoiceTotal, type Invoice, type LineItem } from "../domain/invoice";
import { addDays, isOverdue } from "../lib/dates";
import { request } from "../lib/http";

function centsToDisplay(amount: number, code = "USD"): string {
  const negative = amount < 0 ? "-" : "";
  const abs = Math.abs(Math.round(amount));
  const dollars = Math.floor(abs / 100);
  const pennies = String(abs % 100).padStart(2, "0");
  const withCommas = dollars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const sym = code === "EUR" ? "€" : code === "GBP" ? "£" : "$";
  return `${negative}${sym}${withCommas}.${pennies}`;
}

export function reminderText(invoice: Invoice): string {
  return `Invoice ${invoice.id} for ${centsToDisplay(invoiceTotal(invoice))} is overdue.`;
}

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
      body: { customerId: invoice.customerId, message: reminderText(invoice) },
    });
  }
}

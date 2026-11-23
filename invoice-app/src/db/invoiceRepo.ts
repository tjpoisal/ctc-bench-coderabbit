import type { Invoice } from "../domain/invoice";

/** In-memory invoice storage. Only the service layer may use this. */
export class InvoiceRepo {
  private readonly rows = new Map<string, Invoice>();

  findById(id: string): Invoice | undefined {
    const row = this.rows.get(id);
    return row && row.status !== "void" ? row : undefined;
  }

  save(invoice: Invoice): Invoice {
    this.rows.set(invoice.id, invoice);
    return invoice;
  }

  list(): Invoice[] {
    return [...this.rows.values()];
  }
}

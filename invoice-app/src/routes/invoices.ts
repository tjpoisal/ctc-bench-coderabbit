import type { InvoiceRepo } from "../db/invoiceRepo";
import type { InvoiceService } from "../services/invoiceService";

export interface HttpRequest {
  params: Record<string, string>;
  body?: unknown;
}

export interface HttpResponse {
  status: number;
  body: unknown;
}

/** GET /invoices/:id */
export function getInvoice(service: InvoiceService, req: HttpRequest): HttpResponse {
  const id = req.params.id;
  if (!id) {
    return { status: 400, body: { error: "id is required" } };
  }
  const invoice = service.getInvoice(id);
  if (!invoice) {
    return { status: 404, body: { error: "not found" } };
  }
  return { status: 200, body: invoice };
}

/** POST /invoices/:id/pay */
export function payInvoice(service: InvoiceService, req: HttpRequest): HttpResponse {
  const id = req.params.id;
  if (!id) {
    return { status: 400, body: { error: "id is required" } };
  }
  return { status: 200, body: service.markPaid(id) };
}

/** GET /invoices */
export function listInvoices(repo: InvoiceRepo): HttpResponse {
  return { status: 200, body: repo.list() };
}

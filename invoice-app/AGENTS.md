# Architecture rules (invoice-app)

- Layers: `routes` -> `services` -> `db`. Routes must never import from `src/db`; go through `InvoiceService`.
- All money is integer cents. `invoiceTotal` and every amount field return cents.
- Use the helpers in `src/lib` (`formatCents`, `parseAmount`, `addDays`, `request`, ...) instead of writing new copies.
- `src/lib/http.ts` is the only HTTP client. Do not add axios, lodash, moment or dayjs.
- Only touch the files a task names.

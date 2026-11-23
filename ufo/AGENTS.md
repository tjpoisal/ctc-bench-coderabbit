# Architecture rules (ufo)

- `ufo` is a zero-dependency URL utility library. Do not add runtime dependencies.
- Reuse existing helpers in `src/utils.ts`, `src/encoding.ts`, `src/parse.ts` and `src/query.ts` instead of writing new copies.
- Every exported function is public API. Do not change or remove an exported signature without a major version.
- Only touch the files a task names.

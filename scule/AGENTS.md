# Architecture rules (scule)

- `scule` is a zero-dependency string-case library. Do not add runtime dependencies.
- Reuse the existing helpers in `src/index.ts` (`splitByCase`, `upperFirst`, `lowerFirst`, `isUppercase`, ...) instead of writing new copies.
- Every exported function is public API. Do not change or remove an exported signature without a major version.
- Only touch the files a task names.

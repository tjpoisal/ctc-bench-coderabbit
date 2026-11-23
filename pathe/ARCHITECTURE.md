# Architecture rules (pathe)

- `pathe` must run in browsers, edge runtimes and Node. Do not import Node built-ins such as `fs` or `child_process` at runtime (type-only imports of `node:path` are fine).
- Reuse `normalizeWindowsPath` from `src/_internal.ts` and the helpers in `src/_path.ts` instead of writing new copies.
- Every exported function is public API. Do not change or remove an exported signature without a major version.
- Only touch the files a task names.

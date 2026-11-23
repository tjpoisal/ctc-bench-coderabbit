function toPosixPath(input = "") {
  if (!input) {
    return input;
  }

  let normalized = input;
  if (normalized.includes("\\")) {
    normalized = normalized.replace(/\\/g, "/");
  }

  const driveLetter = normalized[0];
  if (
    driveLetter &&
    normalized[1] === ":" &&
    normalized[2] === "/" &&
    driveLetter >= "a" &&
    driveLetter <= "z"
  ) {
    normalized = driveLetter.toUpperCase() + normalized.slice(1);
  }

  return normalized;
}

/**
 * Returns true when the path starts with the alias.
 */
export function isAliasMatch(path: string, alias: string): boolean {
  return toPosixPath(path).startsWith(toPosixPath(alias));
}

export function resolveImportPath(sourcePath: string, importPath: string): string {
  // Get directory of source file
  const sourceDir = sourcePath.split("/").slice(0, -1);

  // Split import path into parts
  const importParts = importPath.split("/");

  // Resolve each part
  for (const part of importParts) {
    if (part === "..") {
      sourceDir.pop(); // Go up one directory
    } else if (part === ".") {
      // Stay in current directory
      continue;
    } else {
      sourceDir.push(part);
    }
  }

  // Join back and add .ts extension if missing
  let resolved = sourceDir.join("/");

  // Add .ts extension if not present
  if (
    !resolved.endsWith(".ts") &&
    !resolved.endsWith(".tsx") &&
    !resolved.endsWith(".js") &&
    !resolved.endsWith(".jsx")
  ) {
    resolved += ".ts";
  }

  return resolved;
}

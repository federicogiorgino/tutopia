import type { Plugin } from "prettier";
import type { Extension } from "@codemirror/state";
import { snippetLanguages } from "@/components/code-snippet-field";


const parsers: Record<string, string> = {
  javascript: "babel",
  typescript: "typescript",
  json: "json",
  html: "html",
  css: "css",
  yaml: "yaml",
  markdown: "markdown",
};

export function canFormatSnippet(language: string) {
  return Object.hasOwn(parsers, language);
}

// Load the formatter and relevant parser only after an explicit request.
export async function formatSnippet(
  code: string,
  language: string,
  cursorOffset: number,
) {
  const parser = parsers[language];
  if (!canFormatSnippet(language))
    throw new Error("Formatting is unavailable for this language.");
  const { formatWithCursor } = await import("prettier/standalone");
  let plugins: Plugin[];
  switch (language) {
    case "javascript":
    case "json":
      plugins = [
        await import("prettier/plugins/babel"),
        await import("prettier/plugins/estree"),
      ];
      break;
    case "typescript":
      plugins = [
        await import("prettier/plugins/typescript"),
        await import("prettier/plugins/estree"),
      ];
      break;
    case "html":
      plugins = [await import("prettier/plugins/html")];
      break;
    case "css":
      plugins = [await import("prettier/plugins/postcss")];
      break;
    case "yaml":
      plugins = [await import("prettier/plugins/yaml")];
      break;
    default:
      plugins = [await import("prettier/plugins/markdown")];
  }
  return formatWithCursor(code, {
    parser,
    plugins,
    cursorOffset,
    tabWidth: 2,
    useTabs: false,
    embeddedLanguageFormatting: "off",
  });
}



export function snippetLanguageExtension(language: string): Extension {
  return (
    snippetLanguages.find((entry) => entry.value === language)?.extension ?? []
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  canFormatSnippet,
  formatSnippet,
  snippetLanguageExtension,
} from "@/utils/code-snippets";
import { cpp } from "@codemirror/lang-cpp";
import { css } from "@codemirror/lang-css";
import { go } from "@codemirror/lang-go";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { yaml } from "@codemirror/lang-yaml";
import { indentUnit, StreamLanguage } from "@codemirror/language";
import { csharp } from "@codemirror/legacy-modes/mode/clike";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { Check, Copy, Expand, LoaderCircle, WandSparkles } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import type {
  Control,
  FieldPathByValue,
  FieldPathValue,
  FieldValues,
} from "react-hook-form";
import { Controller } from "react-hook-form";

function ActionTooltip({
  label,
  children,
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="inline-flex text-muted-foreground hover:text-foreground"
            tabIndex={disabled ? 0 : undefined}
            aria-label={disabled ? label : undefined}
          >
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6} className="z-[60] max-w-64">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
export type CodeSnippetValue = { language: string; code: string };
export type CodeSnippetFieldProps<T extends FieldValues> = {
  name: FieldPathByValue<T, CodeSnippetValue>;
  control: Control<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  defaultLanguage?: string;
  disabled?: boolean;
};

export const snippetLanguages = [
  { value: "javascript", label: "JavaScript", extension: javascript() },
  {
    value: "typescript",
    label: "TypeScript",
    extension: javascript({ typescript: true }),
  },
  { value: "python", label: "Python", extension: python() },
  { value: "java", label: "Java", extension: java() },
  { value: "cpp", label: "C++", extension: cpp() },
  { value: "csharp", label: "C#", extension: StreamLanguage.define(csharp) },
  { value: "go", label: "Go", extension: go() },
  { value: "rust", label: "Rust", extension: rust() },
  { value: "php", label: "PHP", extension: php() },
  { value: "ruby", label: "Ruby", extension: StreamLanguage.define(ruby) },
  { value: "sql", label: "SQL", extension: sql() },
  { value: "html", label: "HTML", extension: html() },
  { value: "css", label: "CSS", extension: css() },
  { value: "json", label: "JSON", extension: json() },
  { value: "yaml", label: "YAML", extension: yaml() },
  { value: "markdown", label: "Markdown", extension: markdown() },
  { value: "bash", label: "Bash", extension: StreamLanguage.define(shell) },
  { value: "plaintext", label: "Plain Text", extension: [] },
] satisfies { value: string; label: string; extension: Extension }[];

const editorStyle = EditorView.theme({
  "&": { fontSize: "14px" },
  // Keep GitHub's token colors, but let the shadcn input shell own the surface.
  "&.cm-editor": {
    backgroundColor: "transparent",
    color: "var(--foreground)",
  },
  "& .cm-content": { caretColor: "var(--foreground)", padding: "12px 0" },
  "& .cm-line": { padding: "0 12px" },
  "& .cm-cursor": { borderLeftColor: "var(--foreground)" },
  "& .cm-placeholder": { color: "var(--muted-foreground)" },
  "& .cm-activeLine": {
    backgroundColor: "color-mix(in oklab, var(--muted) 40%, transparent)",
  },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
    lineHeight: "1.65",
  },
  "& .cm-gutters": {
    backgroundColor: "transparent",
    color: "var(--muted-foreground)",
    borderRight: "1px solid var(--border)",
  },
  "& .cm-lineNumbers .cm-gutterElement": {
    minWidth: "3.25em",
    padding: "0 12px 0 8px",
    fontVariantNumeric: "tabular-nums",
  },
  "& .cm-gutters .cm-activeLineGutter": {
    backgroundColor: "var(--muted)",
    color: "var(--foreground)",
    fontWeight: "500",
  },
});
const basicSetup = { lineNumbers: true, foldGutter: false };
const emptyBasicSetup = {
  ...basicSetup,
  highlightActiveLine: false,
  highlightActiveLineGutter: false,
};

// The field's accessibility props and RHF's ref belong on the editable DOM,
// not the wrapper div returned by react-codemirror.
const SnippetEditor = forwardRef<
  HTMLElement,
  {
    expanded?: boolean;
    value: CodeSnippetValue;
    onChange: (value: CodeSnippetValue) => void;
    onBlur: () => void;
    disabled?: boolean;
    placeholder?: string;
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: ComponentProps<"div">["aria-invalid"];
    "aria-label"?: string;
  }
>(function SnippetEditorImpl(
  {
    expanded = false,
    value,
    onChange,
    onBlur,
    disabled,
    placeholder,
    id,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
  },
  ref,
) {
  const { resolvedTheme } = useTheme();
  const viewRef = useRef<EditorView | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef({ value, disabled });
  useEffect(() => {
    latest.current = { value, disabled };
  }, [value, disabled]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const notify = (text: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(text);
    timer.current = setTimeout(() => setMessage(""), 4000);
  };
  async function copy() {
    try {
      await navigator.clipboard.writeText(value.code);
      notify("Copied!");
    } catch {
      notify("Could not copy. Select the code and copy it manually.");
    }
  }
  async function format() {
    const view = viewRef.current;
    if (!view || busy || disabled) return;
    const snapshot = value;
    setBusy(true);
    setMessage("");
    try {
      const result = await formatSnippet(
        snapshot.code,
        snapshot.language,
        view.state.selection.main.head,
      );
      // A formatter loading in the background must never overwrite newer edits.
      if (
        viewRef.current !== view ||
        latest.current.disabled ||
        latest.current.value.code !== snapshot.code ||
        latest.current.value.language !== snapshot.language
      ) {
        notify("Code changed; format again to apply formatting.");
        return;
      }
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: result.formatted,
        },
        selection: { anchor: Math.max(0, result.cursorOffset) },
        userEvent: "input.format",
      });
      notify("Formatted.");
    } catch {
      notify("Could not format. Check the code for syntax errors.");
    } finally {
      setBusy(false);
    }
  }
  const extensions = useMemo(
    () => [
      snippetLanguageExtension(value.language),
      indentUnit.of("  "),
      editorStyle,
      EditorView.domEventHandlers({
        focus: (_event, view) => {
          view.focus();
          return false;
        },
      }),
      EditorView.contentAttributes.of({
        id: id ?? "",
        "aria-label": ariaLabel ?? "Code",
        "aria-describedby": ariaDescribedBy ?? "",
        "aria-invalid": String(ariaInvalid ?? false),
        "aria-disabled": String(!!disabled),
      }),
    ],
    [value.language, id, ariaLabel, ariaDescribedBy, ariaInvalid, disabled],
  );

  return (
    <div className="min-w-0 space-y-2">
      <div className="flex items-center gap-1 bg-transparent [&>button]:text-muted-foreground [&>button:hover]:text-foreground">
        <Select
          value={value.language}
          disabled={disabled}
          onValueChange={(language) => onChange({ ...value, language })}
        >
          <SelectTrigger
            size="sm"
            aria-label="Language"
            onBlur={onBlur}
            className="mr-auto w-36 shrink-0"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" align="start">
            {!snippetLanguages.some(
              (entry) => entry.value === value.language,
            ) && (
              <SelectItem value={value.language}>
                {value.language} (plain text)
              </SelectItem>
            )}
            {snippetLanguages.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ActionTooltip
          label={message === "Copied!" ? "Copied!" : "Copy code"}
          disabled={disabled || !value.code}
        >
          {" "}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled || !value.code}
            aria-label="Copy code"
            className={message === "Copied!" ? "text-foreground" : undefined}
            onClick={copy}
          >
            {message === "Copied!" ? (
              <Check aria-hidden="true" />
            ) : (
              <Copy aria-hidden="true" />
            )}
          </Button>
        </ActionTooltip>

        <ActionTooltip
          label={
            !canFormatSnippet(value.language)
              ? "Formatting unavailable for this language"
              : busy
                ? "Formatting…"
                : "Format code"
          }
          disabled={
            disabled || busy || !value.code || !canFormatSnippet(value.language)
          }
        >
          {" "}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={
              disabled ||
              busy ||
              !value.code ||
              !canFormatSnippet(value.language)
            }
            aria-label="Format code"
            onClick={format}
          >
            {busy ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <WandSparkles aria-hidden="true" />
            )}
          </Button>
        </ActionTooltip>
        {!expanded && (
          <Dialog open={open} onOpenChange={setOpen}>
            <ActionTooltip label="Expand editor" disabled={disabled}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Expand editor"

                  disabled={disabled}
                >
                  <Expand aria-hidden="true" />
                </Button>
              </DialogTrigger>
            </ActionTooltip>
            <DialogContent
              showCloseButton={false}
              onEscapeKeyDown={(event) => {
                if ((event.target as HTMLElement).closest(".cm-editor"))
                  event.preventDefault();
              }}
              className="max-h-[95dvh] w-[95vw] max-w-6xl overflow-auto sm:max-w-6xl"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <DialogTitle className="text-lg font-semibold">
                  {ariaLabel ?? "Code"} — expanded editor
                </DialogTitle>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Done
                  </Button>
                </DialogClose>
              </div>
              <DialogDescription className="mb-4 text-sm text-muted-foreground">
                Changes update your form immediately. Tab indents; Escape then
                Tab moves focus. Use Done to close.
              </DialogDescription>
              <SnippetEditor
                expanded
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                placeholder={placeholder}
                aria-label={ariaLabel}
                aria-invalid={ariaInvalid}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div
        data-slot="code-snippet-input"
        data-invalid={ariaInvalid === true || ariaInvalid === "true"}
        data-disabled={disabled}
        className="min-w-0 overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[border-color,box-shadow] dark:bg-input/30 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 data-[invalid=true]:border-destructive data-[invalid=true]:focus-within:ring-destructive/20 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
      >
        <CodeMirror
          value={value.code}
          onChange={(code) => onChange({ ...value, code })}
          onBlur={onBlur}
          onCreateEditor={(view) => {
            viewRef.current = view;
            if (typeof ref === "function") ref(view.contentDOM);
            else if (ref) ref.current = view.contentDOM;
          }}
          // The wrapper dispatches a reconfigure effect when extensions change.
          // Never key by language: remounting would discard selection and undo history.
          extensions={extensions}
          theme={resolvedTheme === "dark" ? githubDark : githubLight}
          basicSetup={value.code.length === 0 ? emptyBasicSetup : basicSetup}
          indentWithTab
          editable={!disabled}
          readOnly={disabled}
          placeholder={placeholder}
          minHeight={expanded ? "55dvh" : "160px"}
          maxHeight={expanded ? "65dvh" : "400px"}
          className="min-w-0"
          data-disabled={disabled}
        />
      </div>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="min-h-4 text-xs leading-4 text-muted-foreground"
      >
        {message ||
          (!canFormatSnippet(value.language)
            ? "Formatting isn’t available for this language."
            : "")}
      </p>
    </div>
  );
});

export function CodeSnippetField<T extends FieldValues>({
  name,
  control,
  label = "Code snippet",
  description,
  placeholder = "Type or paste code…",
  defaultLanguage = "javascript",
  disabled,
}: CodeSnippetFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      defaultValue={
        { language: defaultLanguage, code: "" } as FieldPathValue<
          T,
          typeof name
        >
      }
      render={({ field, fieldState, formState }) => {
        const value: CodeSnippetValue = field.value;
        // Object schemas put errors on the children; surface both beneath the editor.
        const nestedError = fieldState.error as typeof fieldState.error & {
          code?: { message?: string };
          language?: { message?: string };
        };
        const error =
          nestedError?.message ??
          nestedError?.code?.message ??
          nestedError?.language?.message;
        const isDisabled = disabled || field.disabled || formState.isSubmitting;
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

            <SnippetEditor
              ref={field.ref}
              id={field.name}
              aria-invalid={fieldState.invalid}
              aria-describedby={
                fieldState.invalid
                  ? field.name + "-description " + field.name + "-error"
                  : field.name + "-description"
              }
              value={value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isDisabled}
              placeholder={placeholder}
              aria-label={label}
            />

            <FieldDescription id={field.name + "-description"}>
              {description && <>{description} </>}Tab indents with spaces. Press
              Escape, then Tab to leave the editor.
            </FieldDescription>
            {fieldState.invalid && (
              <FieldError
                id={field.name + "-error"}
                errors={[{ message: error }]}
              />
            )}
          </Field>
        );
      }}
    />
  );
}

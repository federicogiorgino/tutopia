"use client";

import { X } from "lucide-react";
import { type KeyboardEvent, useState } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type TagInputProps = {
  id: string;
  value: string[];
  onChange: (tags: string[]) => void;
  onBlur?: () => void;
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  maxTags?: number;
};

export function TagInput({
  id,
  value,
  onChange,
  onBlur,
  label = "Tags",
  description = "Press Enter or comma to add a tag.",
  error,
  disabled,
  maxTags = 8,
}: TagInputProps) {
  const [draft, setDraft] = useState("");
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  function addTags(text: string) {
    const next = [...value];
    for (const part of text.split(/[,\n]+/)) {
      const tag = part.trim().replace(/\s+/g, " ");
      if (
        tag &&
        !next.some(
          (existing) => existing.toLowerCase() === tag.toLowerCase(),
        ) &&
        next.length < maxTags
      )
        next.push(tag);
    }
    if (next.length !== value.length) onChange(next);
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTags(draft);
    } else if (event.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div
        className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent p-1.5 shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 data-[invalid=true]:border-destructive dark:bg-input/30"
        data-invalid={!!error}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex max-w-full items-center gap-1 rounded-md bg-muted px-2 py-1 text-base font-medium text-foreground md:text-sm"
          >
            <span className="truncate">{tag}</span>
            <button
              type="button"
              disabled={disabled}
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(value.filter((item) => item !== tag))}
              className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden="true" className="size-3" />
            </button>
          </span>
        ))}
        <Input
          id={id}
          value={draft}
          disabled={disabled || value.length >= maxTags}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onPaste={(event) => {
            const text = event.clipboardData.getData("text");
            if (text.includes(",") || text.includes("\n")) {
              event.preventDefault();
              addTags(text);
            }
          }}
          onBlur={() => {
            if (draft.trim()) addTags(draft);
            onBlur?.();
          }}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${descriptionId} ${errorId}` : descriptionId
          }
          placeholder={value.length ? "Add another…" : "e.g. react, auth"}
          className="h-6 min-w-28 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
      </div>
      <FieldDescription id={descriptionId}>
        {description} Up to {maxTags} tags.
      </FieldDescription>
      {error && <FieldError id={errorId} errors={[{ message: error }]} />}
    </Field>
  );
}

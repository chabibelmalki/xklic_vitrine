"use client";

import { forwardRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Forme souple d'un fichier uploadé (correspond au type d'entrée du schéma :
// `type` peut être absent). `url`/`file` ne servent qu'à l'aperçu client.
type UploadValue = {
  id?: string;
  name: string;
  size?: number;
  type?: string;
  url?: string;
  file?: unknown;
};

export function Field({
  label,
  hint,
  error,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="flex items-baseline gap-2 text-sm font-medium text-cream"
      >
        {label}
        {optional ? (
          <span className="text-xs font-normal text-cream-faint">
            (facultatif)
          </span>
        ) : null}
      </label>
      {children}
      <AnimatePresence mode="wait" initial={false}>
        {error ? (
          <motion.p
            key="err"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-ember-soft"
          >
            {error}
          </motion.p>
        ) : hint ? (
          <p key="hint" className="text-xs text-cream-faint">
            {hint}
          </p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border bg-ink-soft px-4 py-3 text-[0.95rem] text-cream placeholder:text-cream-faint transition-colors duration-200 focus:outline-none focus:ring-0";

export const TextInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(function TextInput({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        inputBase,
        invalid
          ? "border-ember/50 focus:border-ember"
          : "border-line focus:border-line-strong",
        className,
      )}
      {...props}
    />
  );
});

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function TextArea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        inputBase,
        "min-h-32 resize-y leading-relaxed",
        invalid
          ? "border-ember/50 focus:border-ember"
          : "border-line focus:border-line-strong",
        className,
      )}
      {...props}
    />
  );
});

export function RadioCards({
  value,
  onChange,
  options,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div role="radiogroup" className="grid gap-2 sm:grid-cols-3">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200",
              active
                ? "border-ember/50 bg-ember/10 text-cream"
                : "border-line bg-ink-soft text-cream-muted hover:border-line-strong hover:text-cream",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/**
 * Zone d'upload d'images réutilisable : drag & drop, aperçu en vignette,
 * suppression. Les objets `url`/`file` ne servent qu'à l'affichage côté client ;
 * ils sont retirés du payload avant l'envoi au webhook.
 */
export function ImageUpload({
  value,
  onChange,
  multiple = true,
  accept = "image/*",
  cta = "Glissez vos images ici, ou cliquez pour parcourir",
  sub = "JPG, PNG, WebP",
  compact = false,
}: {
  value: UploadValue[] | undefined;
  onChange: (items: UploadValue[]) => void;
  multiple?: boolean;
  accept?: string;
  cta?: string;
  sub?: string;
  compact?: boolean;
}) {
  const [drag, setDrag] = useState(false);
  const items = value ?? [];

  const add = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const picked: UploadValue[] = Array.from(list).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      type: f.type,
      url: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
      file: f,
    }));
    if (multiple) {
      onChange([...items, ...picked]);
    } else {
      // remplace : on libère l'ancien aperçu
      items.forEach((it) => it.url && URL.revokeObjectURL(it.url));
      onChange(picked.slice(-1));
    }
  };

  const remove = (id: string | undefined) => {
    const it = items.find((x) => x.id === id);
    if (it?.url) URL.revokeObjectURL(it.url);
    onChange(items.filter((x) => x.id !== id));
  };

  return (
    <div className="grid gap-3">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-ink-soft text-center transition-colors",
          compact ? "px-4 py-6" : "px-4 py-9",
          drag
            ? "border-ember/60 bg-ember/[0.06]"
            : "border-line-strong hover:border-ember/40 hover:bg-ember/[0.03]",
        )}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember/10 text-ember-soft">
          <UploadCloud size={18} />
        </span>
        <span className="text-sm font-medium text-cream">{cta}</span>
        <span className="text-xs text-cream-faint">{sub}</span>
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {items.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {items.map((it) => (
            <li
              key={it.id ?? it.name}
              className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-ink"
            >
              {it.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.url}
                  alt={it.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center text-cream-faint">
                  <FileText size={18} />
                  <span className="line-clamp-2 break-all text-[10px] leading-tight">
                    {it.name}
                  </span>
                </span>
              )}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-1.5 pb-1 pt-4 text-[10px] text-cream-muted opacity-0 transition-opacity group-hover:opacity-100">
                {it.size != null ? formatSize(it.size) : null}
              </span>
              <button
                type="button"
                onClick={() => remove(it.id)}
                aria-label={`Retirer ${it.name}`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-cream-muted backdrop-blur-sm transition-colors hover:bg-ember hover:text-ink"
              >
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200",
        checked
          ? "border-ember/50 bg-ember/10 text-cream"
          : "border-line bg-ink-soft text-cream-muted hover:border-line-strong",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          checked ? "border-ember bg-ember text-ink" : "border-line-strong",
        )}
      >
        {checked ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6.5L5 9L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      {label}
    </button>
  );
}

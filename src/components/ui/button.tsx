import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-ember text-ink shadow-[0_0_0_1px_rgba(255,106,61,0.4),0_8px_30px_-8px_rgba(255,106,61,0.5)] hover:bg-ember-soft hover:shadow-[0_0_0_1px_rgba(255,138,92,0.6),0_12px_40px_-8px_rgba(255,106,61,0.65)] hover:-translate-y-0.5",
  secondary:
    "bg-cream/[0.04] text-cream ring-1 ring-inset ring-line-strong hover:bg-cream/[0.08] hover:ring-cream/25",
  ghost: "text-cream-muted hover:text-cream",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.95rem] sm:h-14 sm:px-8 sm:text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}

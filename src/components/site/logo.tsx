import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { XMark } from "./x-mark";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center text-cream",
        className,
      )}
      aria-label="Xklic — accueil"
    >
      <XMark className="h-7 w-7 transition-transform duration-300 ease-out group-hover:-translate-y-0.5" />
      <span className="font-display -ml-0.5 text-xl font-semibold tracking-tight">
        klic
      </span>
    </Link>
  );
}

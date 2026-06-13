import { Header } from "./header";
import { Footer } from "./footer";
import { FloatingActions } from "./floating-actions";
import { Container } from "@/components/ui/container";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grain relative flex min-h-full flex-col">
      <Header />
      <main className="relative flex-1 pt-32 pb-24 sm:pt-40">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] glow-ember"
          aria-hidden
        />
        <Container className="relative max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.02em] text-cream sm:text-5xl">
            {title}
          </h1>
          {updated ? (
            <p className="mt-3 text-sm text-cream-faint">
              Dernière mise à jour : {updated}
            </p>
          ) : null}
          <div className="mt-12 flex flex-col gap-10">{children}</div>
        </Container>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-semibold text-cream sm:text-2xl">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-[0.95rem] leading-relaxed text-cream-muted [&_a]:text-ember-deep [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-medium [&_strong]:text-cream">
        {children}
      </div>
    </section>
  );
}

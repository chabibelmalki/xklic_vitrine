"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { faq } from "@/lib/content";
import { cn, EASE_OUT } from "@/lib/utils";

export function Faq({ headingAs = "h2" }: { headingAs?: "h1" | "h2" } = {}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" className="border-t border-line">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            as={headingAs}
            eyebrow="Questions"
            title="Tout ce que tu te demandes, sans détour."
            description="Une autre question ? Écris-nous, on répond vite et clairement."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="flex flex-col">
            {faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className="border-b border-line first:border-t">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={cn(
                        "text-base font-medium transition-colors duration-200 sm:text-lg",
                        isOpen ? "text-cream" : "text-cream-muted",
                      )}
                    >
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-cream-muted transition-all duration-300",
                        isOpen &&
                          "rotate-45 border-ember/40 bg-ember/10 text-ember-soft",
                      )}
                    >
                      <Plus size={16} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE_OUT }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-12 text-sm leading-relaxed text-cream-muted sm:text-base">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

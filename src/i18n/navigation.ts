import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrappers de navigation conscients de la locale. À utiliser à la place de
// `next/link` et `next/navigation` dans tout le site : ils préfixent
// automatiquement les liens selon la langue active (et ne préfixent pas `fr`).
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

import {
  icons,
  Star,
  type LucideProps,
  type LucideIcon as LucideIconType,
} from "lucide-react";

// Résout une icône lucide à partir de son nom (string), tel que stocké dans
// les données (`Metier.icon` = "Wrench", "Sparkles"…). Fallback sûr sur Star
// si le nom est inconnu, pour ne jamais casser le rendu serveur.
export function LucideIcon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Icon: LucideIconType =
    (icons as Record<string, LucideIconType>)[name] ?? Star;
  return <Icon {...props} />;
}

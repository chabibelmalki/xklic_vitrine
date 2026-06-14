// Injecte un bloc JSON-LD (données structurées schema.org) dans le rendu.
// Le contenu vient de nos propres builders (src/lib/seo.ts), pas d'entrée
// utilisateur → dangerouslySetInnerHTML est sûr ici.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

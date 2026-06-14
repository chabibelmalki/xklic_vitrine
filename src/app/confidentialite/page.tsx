import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/site/legal";
import { brand, legal } from "@/lib/content";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Politique de confidentialité et traitement des données personnelles du site ${brand.name}.`,
  alternates: { canonical: "/confidentialite" },
  robots: { index: false, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updated={legal.updated}>
      <LegalSection title="Responsable du traitement">
        <p>
          Les données personnelles collectées sur <strong>{brand.domain}</strong>{" "}
          sont traitées par <strong>{legal.company}</strong>
          {legal.address !== "—" ? `, ${legal.address}` : ""}. Pour toute
          question : <a href={`mailto:${legal.email}`}>{legal.email}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Données que nous collectons">
        <p>Via le formulaire « Créer mon site », nous recueillons :</p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            les informations sur ton activité (nom de l&apos;entreprise, métier,
            ville, zone d&apos;intervention, prestations, produits) ;
          </li>
          <li>
            tes coordonnées (téléphone, WhatsApp, email, adresse,
            disponibilités) ;
          </li>
          <li>
            tes informations légales (SIRET) et les fichiers que tu choisis
            d&apos;envoyer (logo, photos) ;
          </li>
          <li>
            tes préférences (langues, ambiance) et tout message libre transmis.
          </li>
        </ul>
        <p>
          Nous n&apos;utilisons aucun cookie de suivi publicitaire ni outil de
          traçage nécessitant ton consentement.
        </p>
      </LegalSection>

      <LegalSection title="Pourquoi nous les utilisons">
        <p>
          Ces données servent uniquement à traiter ta demande : concevoir ton
          site, te recontacter et finaliser la mise en place du service. La base
          légale est l&apos;exécution de mesures précontractuelles prises à ta
          demande, ainsi que ton consentement explicite donné lors de
          l&apos;envoi du formulaire.
        </p>
      </LegalSection>

      <LegalSection title="Qui y a accès">
        <p>
          Tes données sont destinées à l&apos;équipe de {legal.company}. Elles
          peuvent transiter par nos prestataires techniques, strictement pour
          assurer le service :
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            <strong>Vercel Inc.</strong> — hébergement du site et stockage
            sécurisé des fichiers envoyés (Vercel Blob) ;
          </li>
          <li>
            notre outil d&apos;automatisation interne, pour acheminer ta demande
            jusqu&apos;à notre équipe.
          </li>
        </ul>
        <p>Nous ne vendons ni ne louons jamais tes données à des tiers.</p>
      </LegalSection>

      <LegalSection title="Combien de temps nous les gardons">
        <p>
          Tes données sont conservées le temps nécessaire au traitement de ta
          demande, puis pendant la durée de la relation commerciale. En
          l&apos;absence de suite, elles sont supprimées au plus tard 3 ans après
          le dernier contact.
        </p>
      </LegalSection>

      <LegalSection title="Tes droits">
        <p>
          Conformément au RGPD, tu disposes d&apos;un droit d&apos;accès, de
          rectification, d&apos;effacement, d&apos;opposition, de limitation et
          de portabilité de tes données. Pour les exercer, écris-nous à{" "}
          <a href={`mailto:${legal.email}`}>{legal.email}</a>.
        </p>
        <p>
          Tu peux également introduire une réclamation auprès de la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
            www.cnil.fr
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="Sécurité">
        <p>
          Nous mettons en œuvre des mesures techniques raisonnables pour
          protéger tes données contre la perte, l&apos;accès non autorisé ou la
          divulgation. Les échanges avec le site sont chiffrés (HTTPS).
        </p>
      </LegalSection>

      <LegalSection title="Plus d'informations">
        <p>
          Voir aussi nos{" "}
          <Link href="/mentions-legales">mentions légales</Link>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

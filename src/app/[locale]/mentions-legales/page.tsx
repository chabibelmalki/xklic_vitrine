import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/site/legal";
import { brand, legal } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${brand.name}.`,
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updated={legal.updated}>
      <LegalSection title="Éditeur du site">
        <p>
          Le site <strong>{brand.domain}</strong> est édité par{" "}
          <strong>{legal.company}</strong>
          {legal.status !== "—" ? `, ${legal.status}` : ""}
          {legal.capital ? ` au capital de ${legal.capital}` : ""}.
        </p>
        <ul className="flex flex-col gap-1">
          <li>Représentant légal : {legal.manager}</li>
          <li>Siège social : {legal.address}</li>
          <li>SIREN / SIRET : {legal.siren}</li>
          <li>Immatriculation au RCS : {legal.rcs}</li>
          <li>Code APE / NAF : {legal.ape}</li>
          <li>
            Email :{" "}
            <a href={`mailto:${legal.email}`}>{legal.email}</a>
          </li>
          {legal.phone ? <li>Téléphone : {legal.phone}</li> : null}
        </ul>
      </LegalSection>

      <LegalSection title="Directeur de la publication">
        <p>{legal.manager}.</p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Le site est hébergé par <strong>{legal.host.name}</strong>,{" "}
          {legal.host.address} —{" "}
          <a href={legal.host.site} target="_blank" rel="noreferrer">
            {legal.host.site}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments du site (textes, visuels, mise en page,
          code) est protégé par le droit de la propriété intellectuelle. Toute
          reproduction ou représentation, totale ou partielle, sans
          autorisation écrite de {legal.company}{" "}est interdite.
        </p>
        <p>
          Les contenus fournis par les clients (textes, logos, photos) restent
          la propriété de leurs auteurs respectifs.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilité">
        <p>
          {legal.company}{" "}s&apos;efforce d&apos;assurer l&apos;exactitude des
          informations diffusées sur ce site, sans pouvoir en garantir
          l&apos;exhaustivité. {legal.company}{" "}ne saurait être tenue responsable
          des dommages résultant de l&apos;utilisation du site ou d&apos;une
          interruption de service.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          Le traitement des données collectées via le formulaire est détaillé
          dans notre{" "}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Conditions de vente">
        <p>
          Les ventes de services sont régies par nos{" "}
          <Link href="/cgv">conditions générales de vente</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour toute question relative au site :{" "}
          <a href={`mailto:${legal.email}`}>{legal.email}</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

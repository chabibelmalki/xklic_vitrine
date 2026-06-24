import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/site/legal";
import { brand, legal, formules } from "@/lib/content";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: `Conditions générales de vente (CGV) de ${legal.company}{" "}: offres, prix, paiement, abonnement, résiliation, livraison et garanties du service ${brand.name}.`,
  alternates: { canonical: "/cgv" },
  // Page indexable : une CGV publiquement accessible est attendue d'un site
  // marchand (confiance + obligation d'information précontractuelle).
  robots: { index: true, follow: true },
};

export default function CgvPage() {
  return (
    <LegalLayout
      title="Conditions générales de vente"
      updated={legal.updated}
    >
      <LegalSection title="1. Objet et champ d'application">
        <p>
          Les présentes conditions générales de vente (les « CGV ») régissent la
          vente des services proposés par <strong>{legal.company}</strong>
          {legal.status !== "—" ? `, ${legal.status}` : ""}, exploitant la marque{" "}
          <strong>{brand.name}</strong> via le site{" "}
          <strong>{brand.domain}</strong> (le « Service »). Toute commande
          implique l&apos;acceptation pleine et entière des présentes CGV, que le
          client reconnaît avoir lues et comprises avant de valider sa commande.
        </p>
        <p>
          Le Service s&apos;adresse à des professionnels (artisans, TPE,
          indépendants) agissant dans le cadre de leur activité.
        </p>
      </LegalSection>

      <LegalSection title="2. Identité du prestataire">
        <ul className="flex flex-col gap-1">
          <li>
            <strong>{legal.company}</strong>
            {legal.status !== "—" ? `, ${legal.status}` : ""}
            {legal.capital ? ` au capital de ${legal.capital}` : ""}
          </li>
          <li>Siège social : {legal.address}</li>
          <li>SIREN / SIRET : {legal.siren}</li>
          <li>Immatriculation au RCS : {legal.rcs}</li>
          <li>Code APE / NAF : {legal.ape}</li>
          <li>Représentant légal : {legal.manager}</li>
          <li>
            Contact : <a href={`mailto:${legal.email}`}>{legal.email}</a>
          </li>
        </ul>
        <p>
          Voir aussi nos{" "}
          <Link href="/mentions-legales">mentions légales</Link>.
        </p>
      </LegalSection>

      <LegalSection title="3. Description du Service">
        <p>
          {brand.name}{" "}conçoit, met en ligne et héberge un site internet
          professionnel pour le compte du client, et propose des prestations
          complémentaires de gestion de présence en ligne (notamment la gestion
          de la fiche Google Business Profile selon l&apos;offre souscrite). Le
          Service est fourni sous forme d&apos;un abonnement comprenant :
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>la création et la mise en ligne du site ;</li>
          <li>l&apos;hébergement, la sécurité (HTTPS) et la maintenance ;</li>
          <li>
            des modifications de contenu illimitées incluses dans
            l&apos;abonnement, traitées généralement dans la journée et au plus
            tard sous 3 jours ouvrés ;
          </li>
          <li>
            selon l&apos;offre : la gestion des avis, des publications et des
            informations de la fiche Google Business Profile.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Offres et prix">
        <p>
          Les prix sont indiqués en euros. Chaque offre comprend des{" "}
          <strong>frais d&apos;installation payés une seule fois</strong> à la
          commande, puis un <strong>abonnement mensuel</strong> :
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          {formules.map((f) => (
            <li key={f.slug}>
              <strong>{f.name}</strong> — {f.setup} à l&apos;installation, puis{" "}
              {f.monthly}/mois.
              {f.priceNote ? (
                <span className="text-cream-faint"> {f.priceNote}</span>
              ) : null}
            </li>
          ))}
        </ul>
        <p>
          Les prix de l&apos;offre « En haut de Google » s&apos;entendent hors
          budget publicitaire éventuel, lequel est défini par le client et réglé
          directement à Google. Les tarifs en vigueur sont ceux affichés sur la
          page <Link href="/tarifs">Tarifs</Link> au moment de la commande.
          {legal.company}{" "}se réserve le droit de faire évoluer ses tarifs ;
          toute modification de prix d&apos;un abonnement en cours est notifiée au
          client, qui reste libre de résilier.
        </p>
      </LegalSection>

      <LegalSection title="5. Commande">
        <p>
          La commande s&apos;effectue en ligne via le formulaire « Créer mon
          site ». Le client garantit l&apos;exactitude des informations
          fournies. La commande est ferme après validation du paiement des frais
          d&apos;installation. Un récapitulatif et une confirmation lui sont
          adressés par email.
        </p>
      </LegalSection>

      <LegalSection title="6. Paiement">
        <p>
          Le paiement s&apos;effectue en ligne par carte bancaire via notre
          prestataire <strong>Stripe</strong>, dans un environnement sécurisé.
          Les données bancaires sont traitées directement par Stripe et ne sont
          jamais conservées par {legal.company}.
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            à la commande, le client règle uniquement les{" "}
            <strong>frais d&apos;installation</strong> ;
          </li>
          <li>
            l&apos;abonnement mensuel bénéficie d&apos;une{" "}
            <strong>période d&apos;essai de 30 jours</strong> : le premier
            prélèvement mensuel intervient à l&apos;issue de cette période ;
          </li>
          <li>
            l&apos;abonnement est ensuite prélevé automatiquement chaque mois,
            par tacite reconduction, jusqu&apos;à résiliation.
          </li>
        </ul>
        <p>
          En cas d&apos;incident de paiement, {legal.company}{" "}peut suspendre le
          Service après information du client et tant que la situation n&apos;est
          pas régularisée.
        </p>
      </LegalSection>

      <LegalSection title="7. Durée, sans engagement et résiliation">
        <p>
          L&apos;abonnement est conclu <strong>sans engagement de durée</strong>.
          Le client peut résilier à tout moment, par simple message à{" "}
          <a href={`mailto:${legal.email}`}>{legal.email}</a>. La résiliation
          prend effet à la fin de la période mensuelle en cours : aucun
          prélèvement ultérieur n&apos;est effectué et aucun remboursement
          prorata temporis du mois entamé n&apos;est dû. Les frais
          d&apos;installation, correspondant à une prestation réalisée, ne sont
          pas remboursables une fois le site mis en ligne.
        </p>
        <p>
          {legal.company}{" "}peut résilier ou suspendre le Service en cas de
          manquement grave du client aux présentes CGV (notamment contenu
          illicite, défaut de paiement, usage frauduleux).
        </p>
      </LegalSection>

      <LegalSection title="8. Droit de rétractation">
        <p>
          Le Service étant fourni à des clients professionnels pour les besoins
          de leur activité, le droit de rétractation de 14 jours prévu pour les
          consommateurs ne s&apos;applique pas en principe. Par exception
          (article L221-3 du Code de la consommation), un professionnel employant
          au plus cinq salariés et souscrivant un contrat hors établissement sans
          rapport avec son activité principale peut en bénéficier.
        </p>
        <p>
          Lorsque ce droit s&apos;applique, le client demande expressément que
          l&apos;exécution du Service commence immédiatement et reconnaît que,
          le service étant pleinement exécuté avant la fin du délai de 14 jours,
          son droit de rétractation est perdu une fois le site mis en ligne. En
          pratique, l&apos;essai de 30 jours sur l&apos;abonnement et
          l&apos;absence d&apos;engagement permettent au client d&apos;arrêter à
          tout moment sans frais.
        </p>
      </LegalSection>

      <LegalSection title="9. Délai de livraison">
        <p>
          Le site est généralement mis en ligne sous 2 heures à 48 heures après
          réception des informations complètes nécessaires via le formulaire,
          sous réserve de la disponibilité et de la conformité des contenus
          fournis par le client. Ces délais sont indicatifs et n&apos;ouvrent pas
          droit à indemnité en cas de dépassement raisonnable.
        </p>
      </LegalSection>

      <LegalSection title="10. Obligations du client">
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            fournir des informations exactes et des contenus (textes, logo,
            photos) dont il détient les droits ;
          </li>
          <li>
            ne pas transmettre de contenu illicite, trompeur, ou portant
            atteinte aux droits de tiers ;
          </li>
          <li>
            disposer des autorisations nécessaires, notamment pour la gestion de
            sa fiche Google Business Profile ;
          </li>
          <li>
            tenir {legal.company}{" "}indemne de toute réclamation liée aux contenus
            qu&apos;il fournit.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="11. Propriété : contenus et nom de domaine">
        <p>
          Les contenus fournis par le client (textes, logo, photos) restent sa
          propriété. Le code, les gabarits et la technologie du moteur restent la
          propriété de {legal.company}{" "}et ne sont pas cédés.
        </p>
        <p>
          Le nom de domaine en <strong>.fr</strong> est{" "}
          <strong>offert</strong> : il est acheté, enregistré et géré par{" "}
          {legal.company}{" "}pour le compte du client pendant toute la durée de
          l&apos;abonnement actif. La gratuité couvre l&apos;achat et la gestion
          du nom de domaine tant que l&apos;abonnement est en cours.
        </p>
        <p>
          En cas de résiliation, le client peut demander le transfert du nom de
          domaine en en faisant la demande via le{" "}
          <Link href="/contact">formulaire de contact</Link> du site. Transfert
          gratuit après 12 mois d&apos;abonnement ; avant 12 mois, le transfert
          est facturé 30€ couvrant les frais de mise en place.
        </p>
      </LegalSection>

      <LegalSection title="12. Disponibilité et responsabilité">
        <p>
          {legal.company}{" "}met en œuvre les moyens raisonnables pour assurer la
          disponibilité et la sécurité du Service, sans garantie d&apos;une
          disponibilité ininterrompue (maintenance, dépendance à des prestataires
          tiers, force majeure). La responsabilité de {legal.company}{" "}est
          limitée aux dommages directs et prouvés et ne saurait excéder les
          sommes versées par le client au titre des douze derniers mois. Le
          client demeure seul responsable des contenus publiés sur son site et sa
          fiche Google.
        </p>
      </LegalSection>

      <LegalSection title="13. Données personnelles">
        <p>
          Le traitement des données personnelles est décrit dans notre{" "}
          <Link href="/confidentialite">politique de confidentialité</Link>, qui
          détaille notamment l&apos;usage de l&apos;API Google Business Profile,
          les sous-traitants et les droits du client.
        </p>
      </LegalSection>

      <LegalSection title="14. Réclamations et médiation">
        <p>
          Pour toute réclamation, le client peut écrire à{" "}
          <a href={`mailto:${legal.email}`}>{legal.email}</a>. Dans le cas où le
          client serait éligible au statut de consommateur, il peut recourir
          gratuitement à un médiateur de la consommation ; les coordonnées du
          médiateur compétent seront communiquées sur demande.
        </p>
      </LegalSection>

      <LegalSection title="15. Droit applicable et litiges">
        <p>
          Les présentes CGV sont soumises au droit français. À défaut de
          résolution amiable, tout litige sera porté devant les tribunaux
          compétents.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

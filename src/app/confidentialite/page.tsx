import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/site/legal";
import { brand, legal, subProcessors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Politique de confidentialité et traitement des données personnelles du site ${brand.name}{" "}: données collectées, finalités, base légale, sous-traitants, droits RGPD et usage de l'API Google Business Profile.`,
  alternates: { canonical: "/confidentialite" },
  // Page volontairement INDEXABLE : elle doit rester publiquement accessible
  // et référençable (exigence de vérification de la Google Business Profile API).
  robots: { index: true, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updated={legal.updated}>
      <LegalSection title="En bref">
        <p>
          Cette page explique quelles données personnelles {legal.company}{" "}
          collecte via <strong>{brand.domain}</strong>, pourquoi, combien de
          temps nous les conservons, avec quels prestataires elles transitent,
          et quels sont tes droits. Nous traitons le minimum de données
          nécessaire, nous ne les vendons jamais et tu peux nous écrire à tout
          moment à <a href={`mailto:${legal.email}`}>{legal.email}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Responsable du traitement">
        <p>
          Le responsable du traitement des données collectées sur{" "}
          <strong>{brand.domain}</strong> est{" "}
          <strong>{legal.company}</strong>
          {legal.status !== "—" ? `, ${legal.status}` : ""}
          {legal.capital ? ` au capital de ${legal.capital}` : ""}.
        </p>
        <ul className="flex flex-col gap-1">
          <li>Siège social : {legal.address}</li>
          <li>SIREN / SIRET : {legal.siren}</li>
          <li>Représentant légal : {legal.manager}</li>
          <li>
            Contact (données personnelles) :{" "}
            <a href={`mailto:${legal.email}`}>{legal.email}</a>
          </li>
        </ul>
        <p>
          Voir aussi nos{" "}
          <Link href="/mentions-legales">mentions légales</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Données que nous collectons">
        <p>
          Via le formulaire « Créer mon site », la page de contact et le tunnel
          de paiement, nous recueillons :
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            <strong>Coordonnées</strong> : nom, prénom, email, téléphone /
            WhatsApp, adresse, disponibilités ;
          </li>
          <li>
            <strong>Informations sur ton activité</strong> : nom de
            l&apos;entreprise, métier, ville, zone d&apos;intervention,
            prestations, produits, préférences (langues, ambiance) ;
          </li>
          <li>
            <strong>Informations légales</strong> : SIRET, et les fichiers que
            tu choisis d&apos;envoyer (logo, photos) ;
          </li>
          <li>
            <strong>Données de paiement</strong> : lors d&apos;un achat, les
            informations bancaires sont saisies directement chez notre
            prestataire de paiement <strong>Stripe</strong> et ne transitent
            jamais par nos serveurs. Nous ne conservons qu&apos;une référence de
            transaction et le statut du paiement ;
          </li>
          <li>
            <strong>Tout message libre</strong> que tu nous transmets.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Finalités : pourquoi nous utilisons ces données">
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            traiter ta demande, concevoir ton site et te recontacter ;
          </li>
          <li>
            encaisser et gérer ton paiement et ton abonnement ;
          </li>
          <li>
            t&apos;envoyer les emails liés au service (confirmation, suivi,
            informations importantes) ;
          </li>
          <li>
            assurer le support, le bon fonctionnement et la sécurité du service ;
          </li>
          <li>
            respecter nos obligations légales et comptables.
          </li>
        </ul>
        <p>
          Nous n&apos;utilisons jamais tes données à des fins de profilage
          publicitaire et nous ne les revendons pas.
        </p>
      </LegalSection>

      <LegalSection title="Base légale (RGPD)">
        <p>
          Conformément au Règlement général sur la protection des données
          (RGPD), chaque traitement repose sur une base légale :
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            <strong>Mesures précontractuelles et exécution du contrat</strong> :
            traitement de ta demande, création du site, paiement et abonnement ;
          </li>
          <li>
            <strong>Consentement</strong> : envoi du formulaire et fichiers que
            tu choisis de nous transmettre ;
          </li>
          <li>
            <strong>Obligation légale</strong> : conservation des pièces
            comptables et de facturation ;
          </li>
          <li>
            <strong>Intérêt légitime</strong> : sécurité du service et
            prévention de la fraude / du spam.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            Demandes sans suite : supprimées au plus tard{" "}
            <strong>3 ans</strong> après le dernier contact ;
          </li>
          <li>
            Données client : conservées pendant toute la durée de la relation
            commerciale ;
          </li>
          <li>
            Documents comptables et de facturation : conservés{" "}
            <strong>10 ans</strong> conformément à la loi.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Destinataires et sous-traitants">
        <p>
          Tes données sont destinées à l&apos;équipe de {legal.company}. Pour
          fournir le service, elles peuvent être traitées par des prestataires
          techniques sélectionnés, agissant comme sous-traitants et tenus à la
          confidentialité :
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          {subProcessors.map((sp) => (
            <li key={sp.name}>
              <strong>{sp.name}</strong>
              {" — "}
              {sp.purpose}{" "}
              <span className="text-cream-faint">
                ({sp.location} —{" "}
                <a href={sp.policy} target="_blank" rel="noreferrer">
                  politique de confidentialité
                </a>
                )
              </span>
            </li>
          ))}
        </ul>
        <p>
          Nous ne vendons ni ne louons jamais tes données à des tiers à des fins
          commerciales.
        </p>
      </LegalSection>

      <LegalSection title="Gestion des fiches Google Business Profile de nos clients">
        <p>
          Dans le cadre de nos offres de gestion de présence en ligne (packs
          « On s&apos;occupe de votre Google » et « En haut de Google »), et{" "}
          <strong>uniquement avec ton autorisation explicite</strong> donnée via
          la connexion sécurisée de Google (OAuth), {legal.company}{" "}accède à ta
          fiche d&apos;établissement Google et la gère pour ton compte au moyen
          de l&apos;<strong>API Google Business Profile</strong>.
        </p>
        <p>Selon l&apos;offre souscrite, cela peut inclure :</p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            la lecture et la mise à jour des informations de l&apos;établissement
            (nom, horaires, coordonnées, zone, description, photos) ;
          </li>
          <li>
            la lecture des avis clients et la publication de réponses en ton nom ;
          </li>
          <li>la création de publications (posts, actualités, offres).</li>
        </ul>
        <p>
          <strong>Usage limité des données Google.</strong> L&apos;accès et
          l&apos;utilisation des informations reçues des API de Google sont
          conformes à la{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , y compris à ses exigences d&apos;<em>usage limité</em> (Limited Use).
          Concrètement :
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            ces données ne sont utilisées que pour fournir et améliorer les
            services explicitement souscrits par le client concerné ;
          </li>
          <li>
            elles ne sont <strong>jamais vendues</strong> ni transférées à des
            tiers à des fins publicitaires, de marketing ou de revente ;
          </li>
          <li>
            elles ne sont pas utilisées à des fins de publicité, ni pour
            entraîner des modèles d&apos;intelligence artificielle généralistes ;
          </li>
          <li>
            aucun humain ne lit ces données, sauf accord explicite du client,
            pour la sécurité, pour respecter la loi, ou lorsque cela est
            strictement nécessaire au fonctionnement du service ;
          </li>
          <li>
            l&apos;accès est limité aux membres autorisés de notre équipe,
            strictement pour l&apos;exécution du service.
          </li>
        </ul>
        <p>
          Tu gardes le contrôle à tout moment : tu peux révoquer notre accès à ta
          fiche Google depuis les paramètres de sécurité de ton compte Google, ou
          en nous écrivant à <a href={`mailto:${legal.email}`}>{legal.email}</a>.
          La révocation met fin à notre gestion de ta fiche sans affecter les
          données déjà publiées sur celle-ci.
        </p>
      </LegalSection>

      <LegalSection title="Transferts hors Union européenne">
        <p>
          Certains de nos prestataires (notamment américains) peuvent traiter
          des données en dehors de l&apos;Union européenne. Ces transferts sont
          encadrés par des garanties appropriées au sens du RGPD (clauses
          contractuelles types de la Commission européenne et/ou adhésion au{" "}
          <em>EU-U.S. Data Privacy Framework</em>).
        </p>
      </LegalSection>

      <LegalSection title="Cookies et mesure d'audience">
        <p>
          Nous n&apos;utilisons aucun cookie de suivi publicitaire ni outil de
          traçage nécessitant ton consentement. Seuls des cookies strictement
          nécessaires au bon fonctionnement et à la sécurité du site (par
          exemple lors du paiement) peuvent être déposés. Si nous mettons en
          place une mesure d&apos;audience à l&apos;avenir, cette page sera mise
          à jour en conséquence.
        </p>
      </LegalSection>

      <LegalSection title="Tes droits">
        <p>
          Conformément au RGPD, tu disposes d&apos;un droit d&apos;accès, de
          rectification, d&apos;effacement, d&apos;opposition, de limitation et
          de portabilité de tes données, ainsi que du droit de définir des
          directives sur leur sort après ton décès. Pour les exercer, écris-nous
          à <a href={`mailto:${legal.email}`}>{legal.email}</a> ; nous te
          répondons dans un délai d&apos;un mois.
        </p>
        <p>
          Tu peux également introduire une réclamation auprès de la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
            www.cnil.fr
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="Décisions automatisées et délégué">
        <p>
          Nous ne prenons aucune décision fondée exclusivement sur un traitement
          automatisé produisant des effets juridiques à ton égard, et nous ne
          réalisons pas de profilage. {legal.company}{" "}n&apos;est pas tenue de
          désigner un délégué à la protection des données (DPO) ; pour toute
          question relative à tes données, le point de contact est{" "}
          <a href={`mailto:${legal.email}`}>{legal.email}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Sécurité">
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          raisonnables pour protéger tes données contre la perte, l&apos;accès
          non autorisé ou la divulgation : chiffrement des échanges (HTTPS),
          accès restreint aux personnes autorisées et recours à des prestataires
          reconnus.
        </p>
      </LegalSection>

      <LegalSection title="Modifications de cette politique">
        <p>
          Nous pouvons faire évoluer cette politique pour refléter des
          changements de service ou d&apos;obligations légales. La date de
          dernière mise à jour figure en haut de page. En cas de changement
          important, nous t&apos;en informerons par un moyen approprié.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour toute question relative à tes données personnelles :{" "}
          <a href={`mailto:${legal.email}`}>{legal.email}</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

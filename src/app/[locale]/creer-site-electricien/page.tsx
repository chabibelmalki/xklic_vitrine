import {
  CreerSiteTemplate,
  creerSiteMetadata,
} from "@/components/sections/creer-site-template";

export const metadata = creerSiteMetadata("creer-site-electricien");

export default function Page() {
  return <CreerSiteTemplate urlSlug="creer-site-electricien" />;
}

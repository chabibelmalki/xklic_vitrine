import {
  CreerSiteTemplate,
  creerSiteMetadata,
} from "@/components/sections/creer-site-template";

export const metadata = creerSiteMetadata("creer-site-menage");

export default function Page() {
  return <CreerSiteTemplate urlSlug="creer-site-menage" />;
}

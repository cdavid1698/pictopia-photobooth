import { bases, business } from "@/content/business";
import { tiers } from "@/content/packages";
import { site } from "@/content/site";

/** LocalBusiness schema built only from verified facts (see research/sources.md). */
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name.value,
    description: business.tagline.value,
    url: site.url,
    telephone: business.phoneE164.value,
    email: business.email.value,
    image: `${site.url}/images/pictopia-logo.png`,
    sameAs: [business.facebookUrl.value],
    priceRange: `₱${Math.min(...tiers.map((t) => t.price))}–₱${Math.max(...tiers.map((t) => t.price))}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: bases[0].detail,
      addressLocality: bases[0].town,
      addressRegion: bases[0].province,
      addressCountry: "PH",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Tarlac" },
      { "@type": "AdministrativeArea", name: "Pampanga" },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

import { campuses } from "@/content/campuses";
import { site } from "@/content/site";
import { img } from "./placeholders";

// schema.org "Church" with every campus address and service time.
export function churchJsonLd() {
  const branches = campuses.map((c) => ({
    "@type": "Church",
    name: `${site.shortName} ${c.name}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.postal.street,
      addressLocality: c.postal.locality,
      addressRegion: c.postal.region,
      postalCode: c.postal.postalCode,
      addressCountry: "ID",
    },
    openingHoursSpecification: c.services.flatMap((s) =>
      s.times.map((t) => ({
        "@type": "OpeningHoursSpecification",
        name: s.type,
        dayOfWeek: `https://schema.org/${s.day}`,
        opens: t,
      })),
    ),
  }));

  const [main] = branches;
  return {
    "@context": "https://schema.org",
    ...main,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    logo: `${site.url}/icon.png`,
    image: img.og,
    description: site.description,
    email: site.email,
    telephone: site.phone.tel,
    sameAs: site.socials.filter((s) => s.href).map((s) => s.href),
    ...(branches.length > 1 && { department: branches }),
  };
}

// Safe to drop into a <script>: escapes "<" so content can never close the tag.
export const toScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

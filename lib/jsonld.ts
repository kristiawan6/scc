import { campuses, mapEmbed } from "@/content/campuses";
import { alternateNames, site } from "@/content/site";
import { img } from "./placeholders";

const ORG = `${site.url}/#organization`;
const SITE = `${site.url}/#website`;
const abs = (path: string) => `${site.url}${path}`;

const address = (c: (typeof campuses)[number]) => ({
  "@type": "PostalAddress",
  streetAddress: c.postal.street,
  addressLocality: c.postal.locality,
  addressRegion: c.postal.region,
  postalCode: c.postal.postalCode,
  addressCountry: "ID",
});

/**
 * Site-wide schema.org graph: the congregation (Organization), its building (Church),
 * the website, and the pastors. Pages add their own nodes with pageJsonLd().
 */
export function churchJsonLd() {
  const [main] = campuses;
  const places = campuses.map((c) => ({
    "@type": "Church",
    "@id": abs(`/#church-${c.slug}`),
    name: `${site.name} (${c.name})`,
    url: abs("/jadwal-ibadah"),
    image: abs(img.og),
    telephone: site.phone.tel,
    address: address(c),
    hasMap: mapEmbed(c.mapQuery).replace("&output=embed", ""),
    isAccessibleForFree: true,
    publicAccess: true,
    // Only services held in the building; Zoom-only ones are not opening hours.
    openingHoursSpecification: c.services.filter((s) => !s.online).flatMap((s) =>
      s.times.map((t) => ({
        "@type": "OpeningHoursSpecification",
        name: s.type,
        dayOfWeek: `https://schema.org/${s.day}`,
        opens: t,
      })),
    ),
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG,
        name: site.name,
        alternateName: alternateNames,
        url: site.url,
        logo: { "@type": "ImageObject", url: abs("/icon.png"), width: 512, height: 512 },
        image: abs(img.og),
        description: site.description,
        slogan: site.tagline.join(" "),
        foundingDate: site.founded,
        email: site.email,
        telephone: site.phone.tel,
        address: address(main),
        areaServed: { "@type": "City", name: "Jakarta" },
        knowsLanguage: "id",
        parentOrganization: { "@type": "Organization", name: "GBI Rayon 1i", parentOrganization: { "@type": "Organization", name: "GBI Jl. Gatot Subroto" } },
        location: places.map((p) => ({ "@id": p["@id"] })),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "informasi gereja dan permohonan doa",
          telephone: site.phone.tel,
          email: site.email,
          availableLanguage: ["id"],
          areaServed: "ID",
        },
        member: site.pastors.map((p) => ({ "@id": abs(`/about#${slug(p.name)}`) })),
        sameAs: site.socials.filter((s) => s.href).map((s) => s.href),
      },
      ...places,
      ...site.pastors.map((p) => ({
        "@type": "Person",
        "@id": abs(`/about#${slug(p.name)}`),
        name: p.name,
        jobTitle: p.role,
        worksFor: { "@id": ORG },
      })),
      {
        "@type": "WebSite",
        "@id": SITE,
        url: site.url,
        name: site.name,
        inLanguage: "id-ID",
        publisher: { "@id": ORG },
      },
    ],
  };
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** WebPage + breadcrumb for one page; pass extra nodes (e.g. FAQPage) to include them. */
export function pageJsonLd(
  { path, name, crumb, description }: { path: string; name: string; crumb?: string; description: string },
  ...extra: object[]
) {
  const url = abs(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: "id-ID",
        isPartOf: { "@id": SITE },
        about: { "@id": ORG },
        author: { "@id": ORG },
        datePublished: site.launched,
        dateModified: site.updated,
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Beranda", item: site.url },
          ...(path === "/" ? [] : [{ "@type": "ListItem", position: 2, name: crumb ?? name, item: url }]),
        ],
      },
      ...extra,
    ],
  };
}

export const faqJsonLd = (path: string, faqs: { q: string; a: string }[]) => ({
  "@type": "FAQPage",
  "@id": `${abs(path)}#faq`,
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

// Safe to drop into a <script>: escapes "<" so content can never close the tag.
export const toScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

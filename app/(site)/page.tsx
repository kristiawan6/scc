import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import { pageJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { Campuses } from "@/components/sections/Campuses";
import { Hero } from "@/components/sections/Hero";
import { Ministries } from "@/components/sections/Ministries";
import { Moments } from "@/components/sections/Moments";
import { NextStep } from "@/components/sections/NextStep";
import { OurStory } from "@/components/sections/OurStory";
import { WhatsNew } from "@/components/sections/WhatsNew";

export const metadata: Metadata = pageMeta({
  title: `${site.name} | Gereja di Pancoran, Jakarta Selatan`,
  description: site.description,
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={pageJsonLd({ path: "/", name: site.name, description: site.description })} />
      <Hero />
      <WhatsNew />
      <OurStory />
      <Moments />
      <Campuses />
      <NextStep />
      <Ministries />
    </>
  );
}

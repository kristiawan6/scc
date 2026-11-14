import { Campuses } from "@/components/sections/Campuses";
import { Hero } from "@/components/sections/Hero";
import { Ministries } from "@/components/sections/Ministries";
import { NextStep } from "@/components/sections/NextStep";
import { OurStory } from "@/components/sections/OurStory";
import { WhatsNew } from "@/components/sections/WhatsNew";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatsNew />
      <OurStory />
      <Campuses />
      <NextStep />
      <Ministries />
    </>
  );
}

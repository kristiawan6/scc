import { preload } from "react-dom";
import { site } from "@/content/site";
import { heroPoster, heroVideo } from "@/lib/placeholders";
import { HeroScroll } from "./HeroScroll";

export function Hero() {
  preload(heroPoster, { as: "image", fetchPriority: "high" });
  return <HeroScroll lines={site.tagline} src={heroVideo} poster={heroPoster} />;
}

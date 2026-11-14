import { siFacebook, siInstagram, siThreads, siTiktok, siX, siYoutube } from "simple-icons";
import type { Social } from "@/content/site";

const icons = {
  X: siX,
  Facebook: siFacebook,
  YouTube: siYoutube,
  Instagram: siInstagram,
  Threads: siThreads,
  TikTok: siTiktok,
};

export function SocialIcon({ name, className = "size-4" }: { name: Social["name"]; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d={icons[name].path} />
    </svg>
  );
}

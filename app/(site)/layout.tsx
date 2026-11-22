import { FloatingActions } from "@/components/FloatingActions";
import { Header } from "@/components/Header";
import { MotionProvider } from "@/components/MotionProvider";
import { SideRail } from "@/components/SideRail";
import { Snow } from "@/components/Snow";
import { site } from "@/content/site";
import { Footer } from "@/components/sections/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <Header />
      <SideRail />
      <main id="main">{children}</main>
      <Footer />
      <FloatingActions />
      {site.seasonal.snow && <Snow />}
    </MotionProvider>
  );
}

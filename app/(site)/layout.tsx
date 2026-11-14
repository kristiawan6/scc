import { FloatingActions } from "@/components/FloatingActions";
import { Header } from "@/components/Header";
import { MotionProvider } from "@/components/MotionProvider";
import { SideRail } from "@/components/SideRail";
import { Footer } from "@/components/sections/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <Header />
      <SideRail />
      <main id="main">{children}</main>
      <Footer />
      <FloatingActions />
    </MotionProvider>
  );
}

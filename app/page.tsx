import Header from "@/components/Header";
import HeroDiscovery from "@/components/HeroDiscovery";
import IntroSequence from "@/components/IntroSequence";
import MotionProvider from "@/components/MotionProvider";
import ProblemSection from "@/components/ProblemSection";
import PhoneShowcase from "@/components/PhoneShowcase";
import PersonalizationSection from "@/components/PersonalizationSection";
import IntentSearch from "@/components/IntentSearch";
import CollectionsSection from "@/components/CollectionsSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import BrandBridge from "@/components/BrandBridge";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("StyBay — Personalized Fashion Discovery", "Find fashion from across the web in one visual discovery experience designed around your taste. Explore StyBay and join the pre-launch waitlist.", "/");
export default function Home() {
  return (
    <>
      <IntroSequence />
      <Header />
      <main id="main">
        <HeroDiscovery />
        <ProblemSection />
        <BrandBridge />
        <PhoneShowcase />
        <PersonalizationSection />
        <IntentSearch />
        <CollectionsSection />
        <FinalCTA />
      </main>
      <Footer />
      <MotionProvider />
    </>
  );
}

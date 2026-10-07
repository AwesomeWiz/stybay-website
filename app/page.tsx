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
export default function Home() {
  return (
    <>
      <IntroSequence />
      <Header />
      <main id="main">
        <HeroDiscovery />
        <ProblemSection />
        <PhoneShowcase />
        <PersonalizationSection />
        <IntentSearch />
        <CollectionsSection />
        <FinalCTA />
      </main>
      <MotionProvider />
    </>
  );
}

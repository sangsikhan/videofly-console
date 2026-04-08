import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import SocialProof from '@/components/landing/SocialProof';
import CoreFeatures from '@/components/landing/CoreFeatures';
import DemoPlayer from '@/components/landing/DemoPlayer';
import FeatureDetails from '@/components/landing/FeatureDetails';
import PricingSummary from '@/components/landing/PricingSummary';
import FAQ from '@/components/landing/FAQ';
import FooterCTA from '@/components/landing/FooterCTA';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <CoreFeatures />
        <DemoPlayer />
        <FeatureDetails />
        <PricingSummary />
        <FAQ />
        <FooterCTA />
      </main>
      <Footer />
    </>
  );
}

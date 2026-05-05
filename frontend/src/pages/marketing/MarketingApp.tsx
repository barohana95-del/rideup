// RideUp marketing site — full cinematic landing.
import { useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';
import WhyRideUp from './components/WhyRideUp';
import BigStatement from './components/BigStatement';
import Approach from './components/Approach';
import ThemeShowcase from './components/ThemeShowcase';
import ProvidersCarousel from './components/ProvidersCarousel';
import Pricing from './components/Pricing';
import Features from './components/Features';
import LiveProcess from './components/LiveProcess';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import { initScrollAnimations } from '../../lib/scrollAnimations';

export default function MarketingApp() {
  useEffect(() => {
    initScrollAnimations();
  }, []);

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: '#FFFFFF', color: '#3D4F6B' }}>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <WhyRideUp />
        <BigStatement />
        <Approach />
        <ThemeShowcase />
        <ProvidersCarousel />
        <Pricing />
        <Features />
        <LiveProcess />
        <Reviews />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

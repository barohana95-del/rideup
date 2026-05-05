// RideUp marketing site — based on Renovex design.
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Suppliers from './components/Suppliers';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Simulation from './components/Simulation';
import Footer from './components/Footer';

export default function MarketingApp() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Simulation />
        <Suppliers />
        <Testimonials />
        <Pricing />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

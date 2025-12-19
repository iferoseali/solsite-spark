import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { TemplateGallery } from "@/components/landing/TemplateGallery";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

const Index = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <TemplateGallery />
          <Features />
          <HowItWorks />
          <Pricing />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Index;

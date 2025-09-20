import AshaHeroesSection from "@/components/asha-heroes-section";
import Footer from "@/components/footer";
import ForDoctorsSection from "@/components/for-doctors-section";
import ForPatientsSection from "@/components/for-patients-section";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/how-it-works-section";
import ServicesSection from "@/components/services-section";
import TestimonialsSection from "@/components/testimonials-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header/>
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ServicesSection />
        <AshaHeroesSection/>
        <ForDoctorsSection />
        <ForPatientsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}

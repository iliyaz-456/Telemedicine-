"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Phone, Video } from "lucide-react"

export default function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const heroTexts = [
    {
      headline: "Healthcare at Your Doorstep",
      subheadline: "Connecting rural Punjab with expert doctors through trusted ASHA workers",
      lang: "English",
    },
    {
      headline: "ਤੁਹਾਡੇ ਘਰ ਤੱਕ ਸਿਹਤ ਸੇਵਾ",
      subheadline: "ਭਰੋਸੇਮੰਦ ਆਸ਼ਾ ਵਰਕਰਾਂ ਰਾਹੀਂ ਮਾਹਰ ਡਾਕਟਰਾਂ ਨਾਲ ਜੋੜਨਾ",
      lang: "Punjabi",
    },
    {
      headline: "आपके दरवाजे तक स्वास्थ्य सेवा",
      subheadline: "विश्वसनीय आशा कार्यकर्ताओं के माध्यम से विशेषज्ञ डॉक्टरों से जुड़ना",
      lang: "Hindi",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [heroTexts.length])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 bg-[url('/rural-healthcare-asha-worker-helping-patient-with-.jpg')] bg-cover bg-center opacity-20"></div>
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated Headlines */}
        <div className="mb-8 min-h-[200px] flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 animate-slide-in-up">
            {heroTexts[currentTextIndex].headline}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto animate-slide-in-up">
            {heroTexts[currentTextIndex].subheadline}
          </p>
        </div>

        <div className="max-w-4xl mx-auto animate-slide-in-up">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Missed Call Consultation */}
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
              <div className="text-center">
                <div className="mb-4">
                  <Phone className="h-12 w-12 mx-auto text-primary animate-ring group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold mb-2">📞 Missed Call Consultation</h3>
                <p className="text-muted-foreground mb-4">1800-XXX-XXXX</p>
                <p className="text-sm text-muted-foreground mb-6">Give a missed call. We will call you back.</p>
                <Button size="lg" className="w-full animate-glow">
                  Call Now for Help
                </Button>
              </div>
            </Card>

            {/* Video Consultation */}
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 group">
              <div className="text-center">
                <div className="mb-4">
                  <Video className="h-12 w-12 mx-auto text-accent animate-pulse group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold mb-2">🎥 Video Consultation</h3>
                <p className="text-muted-foreground mb-4">Instant Connect</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Start a video consultation instantly with a doctor.
                </p>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  Start Video Call
                </Button>
              </div>
            </Card>
          </div>

          <p className="text-center text-muted-foreground">
            Choose a missed call or start a video consultation instantly.
          </p>
        </div>

        {/* Language Indicator */}
        <div className="mt-8 flex justify-center space-x-2">
          {heroTexts.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentTextIndex ? "bg-primary w-8" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

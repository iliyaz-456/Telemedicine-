"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Phone, Video, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"

/**
 * HeroSection Component
 * 
 * Features:
 * - Multi-language rotating headlines (English, Punjabi, Hindi)
 * - Missed call consultation card
 * - Video consultation card with role-based routing
 * 
 * Video Call Button Functionality:
 * - If user is NOT logged in: redirects to /signup (patient signup)
 * - If Patient is logged in: redirects to /dashboard/patient (Patient Dashboard)
 * - If Doctor is logged in: redirects to /dashboard/doctor (Doctor Dashboard)
 * - If Asha Worker is logged in: redirects to /dashboard/worker (Asha Worker Dashboard)
 * - Shows loading indicator during navigation with role-specific messaging
 * - Handles errors gracefully with user-friendly error messages
 */

export default function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const { language, t } = useLanguage()

  const heroTexts = [
    {
      headline: t('home.hero.title'),
      subheadline: t('home.hero.subtitle'),
      lang: "English",
    },
    {
      headline: t('home.hero.title.pa'),
      subheadline: t('home.hero.subtitle.pa'),
      lang: "Punjabi",
    },
    {
      headline: t('home.hero.title.hi'),
      subheadline: t('home.hero.subtitle.hi'),
      lang: "Hindi",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [heroTexts.length])

  /**
   * Handles the "Start Video Call" button click with role-based routing
   * - If user is not logged in: redirects to patient signup page
   * - If Patient is logged in: redirects to Patient Dashboard
   * - If Doctor is logged in: redirects to Doctor Dashboard  
   * - If Asha Worker is logged in: redirects to Asha Worker Dashboard
   * - Shows loading indicator during navigation
   * - Handles errors gracefully
   */
  const handleVideoCall = async () => {
    try {
      setIsNavigating(true)
      
      // Small delay to show loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (!isAuthenticated) {
        // User not logged in - redirect to patient signup page
        router.push('/signup')
      } else {
        // User is logged in - redirect based on role
        if (user) {
          switch (user.role) {
            case 'Patient':
              router.push('/dashboard/patient')
              break
            case 'Doctor':
              router.push('/dashboard/doctor')
              break
            case 'Worker':
              router.push('/dashboard/worker')
              break
            default:
              // Fallback to patient dashboard for unknown roles
              router.push('/dashboard/patient')
          }
        } else {
          // User object not available, redirect to signup
          router.push('/signup')
        }
      }
    } catch (error) {
      console.error('Navigation error:', error)
      // Reset loading state on error
      setIsNavigating(false)
      // Show user-friendly error message
      alert('Navigation failed. Please try again.')
    }
  }


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

        <div className="max-w-6xl mx-auto animate-slide-in-up">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Missed Call Consultation */}
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
              <div className="text-center">
                <div className="mb-4">
                  <Phone className="h-12 w-12 mx-auto text-primary animate-ring group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold mb-2">📞 {t('cta.missedCall')}</h3>
                <p className="text-muted-foreground mb-4">{t('cta.missedCall.number')}</p>
                <p className="text-sm text-muted-foreground mb-6">{t('cta.missedCall.desc')}</p>
                <Button size="lg" className="w-full animate-glow">
                  {t('cta.missedCall.button')}
                </Button>
              </div>
            </Card>


            {/* Video Consultation */}
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 group">
              <div className="text-center">
                <div className="mb-4">
                  <Video className="h-12 w-12 mx-auto text-accent animate-pulse group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold mb-2">🎥 {t('cta.videoCall')}</h3>
                <p className="text-muted-foreground mb-4">Instant Connect</p>
                <p className="text-sm text-muted-foreground mb-6">
                  {t('cta.videoCall.desc')}
                </p>
                {/* Start Video Call Button - Redirects based on authentication status */}
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                  onClick={handleVideoCall}
                  disabled={isNavigating || isLoading}
                >
                  {isNavigating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isAuthenticated 
                        ? `Redirecting to ${user?.role || 'Dashboard'}...` 
                        : 'Redirecting to Signup...'
                      }
                    </>
                  ) : (
                    t('cta.videoCall.button')
                  )}
                </Button>
              </div>
            </Card>
          </div>

          <p className="text-center text-muted-foreground">
            Choose a missed call or video consultation instantly.
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

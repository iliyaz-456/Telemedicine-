"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Phone, Video, Stethoscope, Bell } from "lucide-react"

export default function HowItWorksSection() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      icons: [Phone, Video],
      title: "Call or Video Consult",
      description: "Choose between a missed call consultation or instant video consultation with our doctors.",
      step: "01",
    },
    {
      icons: [Stethoscope],
      title: "Talk to Doctor",
      description: "Get connected with qualified doctors for professional medical consultation and advice.",
      step: "02",
    },
    {
      icons: [Bell],
      title: "Medicine Updates",
      description:
        "Get real-time updates on medicine availability in your nearest shop. If not available, delivery within 24 hours (Coming Soon).",
      step: "03",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => [...prev, index])
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [steps])

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">How NabhaCare Works</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Simple steps to get healthcare support in your village
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const isVisible = visibleSteps.includes(index)

            return (
              <Card
                key={index}
                className={`p-8 text-center relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-2 ${
                  isVisible ? "animate-slide-in-up opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Step Number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">{step.step}</div>

                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      {step.icons.length > 1 ? (
                        <div className="flex space-x-1">
                          {step.icons.map((Icon, iconIndex) => (
                            <Icon key={iconIndex} className="h-4 w-4 text-primary" />
                          ))}
                        </div>
                      ) : (
                        (() => {
                          const SingleIcon = step.icons[0]
                          return <SingleIcon className="h-8 w-8 text-primary" />
                        })()
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30 transform -translate-y-1/2"></div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

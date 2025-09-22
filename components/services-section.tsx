"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Video, Bell, Brain, Megaphone } from "lucide-react"

export default function ServicesSection() {
  const services = [
    {
      icon: Video,
      title: "Assisted Tele-Consultation (Video)",
      description:
        "Connect with qualified doctors through video consultations with help from your local ASHA worker",
      size: "large",
      gradient: "from-primary/20 to-primary/5",
    },
    {
      icon: Bell,
      title: "Medicine Availability Updates",
      description:
        "Get real-time updates on medicine availability in your nearest shop. Delivery within 24 hours (Coming Soon)",
      size: "medium",
      gradient: "from-accent/20 to-accent/5",
      badge: "Coming Soon",
    },
    {
      icon: Megaphone,
      title: "Health Campaign Updates",
      description:
        "Stay informed about upcoming health campaigns in your village or nearby areas.",
      size: "medium",
      gradient: "from-secondary/20 to-secondary/5",
    },
    {
      icon: Brain,
      title: "AI-Powered Symptom Guide",
      description: "Get preliminary guidance on symptoms before consultation with our AI assistant",
      size: "medium",
      gradient: "from-primary/15 to-accent/10",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Comprehensive healthcare solutions designed for rural communities
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon
            const isLarge = service.size === "large"

            return (
              <Link key={service.title} href={service.title === "Health Campaign Updates" ? "/campaigns" : "#"}>
                <Card
                  className={`h-full min-h-[260px] md:min-h-[280px] p-6 md:p-8 lg:p-10 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-gradient-to-br ${service.gradient} border-2 hover:border-primary/30 relative ${
                    isLarge ? "md:col-span-2 lg:row-span-2" : ""
                  }`}
                >
                {service.badge && (
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                    {service.badge}
                  </div>
                )}

                <div className="flex flex-col h-full">
                  <div className="mb-5 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                  </div>

                  <h3
                    className={`font-bold mb-4 group-hover:text-primary transition-colors ${
                      isLarge ? "text-2xl" : "text-lg md:text-xl"
                    }`}
                  >
                    {service.title}
                  </h3>

                  <p className={`text-muted-foreground leading-relaxed flex-grow ${isLarge ? "text-base md:text-lg" : "text-sm md:text-base"}`}>
                    {service.description}
                  </p>

                  {isLarge && (
                    <div className="mt-6 md:mt-8 pt-6 border-t border-border">
                      <div className="flex items-center text-sm text-primary font-medium">
                        Learn more
                        <svg
                          className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

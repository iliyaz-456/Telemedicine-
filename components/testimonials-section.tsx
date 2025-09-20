"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "Rajinder Kaur",
      role: "Village Resident, Nabha",
      content:
        "Sehat Saathi ne meri maa di jaan bachayi. Doctor ji ne phone te hi sahi ilaaj dasya te ASHA didi ne dawai ghar tak pahunchayi.",
      translation:
        "Sehat Saathi saved my mother's life. The doctor gave the right treatment over the phone and ASHA didi delivered medicines to our home.",
      rating: 5,
      image: "/elderly-punjabi-woman-smiling.jpg",
    },
    {
      name: "Dr. Preet Singh",
      role: "General Physician",
      content:
        "Working with Sehat Saathi allows me to reach patients who otherwise wouldn't have access to quality healthcare. The AI summaries save time and the ASHA workers provide excellent ground support.",
      rating: 5,
      image: "/indian-male-doctor-in-white-coat.jpg",
    },
    {
      name: "Simran Devi",
      role: "ASHA Worker, Patiala",
      content:
        "This platform has made my work so much easier. I can help more families in my village and the training provided has improved my skills significantly.",
      rating: 5,
      image: "/indian-female-healthcare-worker-with-tablet.jpg",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Stories from Our Community</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Real experiences from patients, doctors, and ASHA workers
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/10">
            <div className="text-center">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-lg md:text-xl text-balance mb-6 leading-relaxed">
                &ldquo;{testimonials[currentIndex].content}&rdquo;
              </blockquote>

              {/* Translation for non-English testimonials */}
              {testimonials[currentIndex].translation && (
                <p className="text-muted-foreground italic mb-6">
                  Translation: &ldquo;{testimonials[currentIndex].translation}&rdquo;
                </p>
              )}

              {/* Author */}
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentIndex].image || "/placeholder.svg"}
                  alt={testimonials[currentIndex].name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="font-semibold">{testimonials[currentIndex].name}</div>
                  <div className="text-muted-foreground text-sm">{testimonials[currentIndex].role}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

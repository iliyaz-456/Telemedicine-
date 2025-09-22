import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, Users, Zap, Heart } from "lucide-react"

export default function ForDoctorsSection() {
  const benefits = [
    {
      icon: Clock,
      title: "Save Time with AI Summaries",
      description: "Get concise patient summaries powered by AI to make consultations more efficient",
    },
    {
      icon: Users,
      title: "Reach Rural Patients",
      description: "Extend your practice to underserved communities across Punjab",
    },
    {
      icon: Zap,
      title: "Flexible Consultations",
      description: "Choose your availability and consultation preferences",
    },
    {
      icon: Heart,
      title: "Make a Real Impact",
      description: "Be part of a mission to improve healthcare accessibility in rural areas",
    },
  ]

  return (
    <section id="for-doctors" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">For Healthcare Professionals</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Join our network of doctors making healthcare accessible to rural communities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </Card>
            )
          })}
        </div>

        {/* CTA Card */}
        <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join hundreds of doctors who are already using NabhaCare to provide quality healthcare to rural
              communities. Flexible hours, competitive compensation, and the satisfaction of serving those who need it
              most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="animate-glow" asChild>
                <a href="/signup/doctor">Join as a Doctor</a>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

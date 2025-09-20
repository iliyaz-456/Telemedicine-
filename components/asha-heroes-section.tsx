import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, DollarSign, BookOpen, Users } from "lucide-react"

export default function AshaHeroesSection() {
  const benefits = [
    {
      icon: CheckCircle,
      title: "One-Click Workflows",
      description: "Simple, intuitive tools that make your work easier",
    },
    {
      icon: DollarSign,
      title: "Fair Incentives",
      description: "Earn competitive compensation for your valuable work",
    },
    {
      icon: BookOpen,
      title: "Continuous Training",
      description: "Regular skill development and learning opportunities",
    },
    {
      icon: Users,
      title: "Trusted Community Link",
      description: "Strengthen your role as a healthcare bridge in your community",
    },
  ]

  return (
    <section id="for-asha" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative">
            <Card className="overflow-hidden">
              <img
                src="/asha-worker-with-tablet-helping-rural-patient--pro.jpg"
                alt="ASHA worker with tablet"
                className="w-full h-[500px] object-cover"
              />
            </Card>
            {/* Floating Stats */}
            <Card className="absolute -bottom-6 -right-6 p-4 bg-primary text-primary-foreground">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm opacity-90">ASHA Workers</div>
              </div>
            </Card>
          </div>

          {/* Right: Content */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Empowering Our ASHA Heroes</h2>
              <p className="text-xl text-muted-foreground text-balance mb-6">
                Tech-Enabled, Community-Driven Healthcare
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Join our mission to bring quality healthcare to every doorstep in rural Punjab. As an ASHA worker with
                Sehat Saathi, you&apos;ll be equipped with modern tools while maintaining the personal touch that makes you
                trusted in your community.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Button size="lg" className="animate-glow">
              Join as an ASHA Worker
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

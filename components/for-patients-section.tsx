import { Card } from "@/components/ui/card"
import { Phone, Video, Bell } from "lucide-react"

export default function ForPatientsSection() {
  const steps = [
    {
      icon: Phone,
      title: "Call or Video",
      description: "Choose between missed call or video consultation",
    },
    {
      icon: Video,
      title: "Consult",
      description: "Talk to qualified doctors with ASHA support",
    },
    {
      icon: Bell,
      title: "Medicine Updates",
      description: "Get real-time medicine availability updates",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">For Patients & Families</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto">
            Access expert doctors by missed call or video consultation. Get medicine availability updates instantly from
            your nearest pharmacy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </Card>
            )
          })}
        </div>

        {/* Multilingual Support */}
        <Card className="max-w-2xl mx-auto p-8 text-center bg-gradient-to-r from-accent/5 to-primary/5 border-2 border-accent/20">
          <h3 className="text-2xl font-bold mb-4">Available in Your Language</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
            <div className="p-4 bg-background rounded-lg">
              <div className="font-semibold">English</div>
              <div className="text-sm text-muted-foreground">Healthcare Support</div>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <div className="font-semibold">ਪੰਜਾਬੀ</div>
              <div className="text-sm text-muted-foreground">ਸਿਹਤ ਸਹਾਇਤਾ</div>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <div className="font-semibold">हिंदी</div>
              <div className="text-sm text-muted-foreground">स्वास्थ्य सहायता</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

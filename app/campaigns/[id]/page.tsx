'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Megaphone, MapPin, Calendar, Clock, UserCircle2, ArrowLeft } from 'lucide-react'

type CampaignStatus = 'Upcoming' | 'Ongoing' | 'Completed'

interface Campaign {
  id: string
  title: string
  village: string
  date: string
  time: string
  description: string
  status: CampaignStatus
  organizer: 'ASHA' | 'PHC' | 'NGO'
  instructions?: string[]
  mapUrl?: string
}

const campaigns: Campaign[] = [
  {
    id: 'c1',
    title: 'Polio Vaccination Drive',
    village: 'Bhadson (Nabha)',
    date: '2025-02-03',
    time: '10:00 AM - 4:00 PM',
    description: 'Free polio drops for children under 5 years. Door-to-door coverage.',
    status: 'Upcoming',
    organizer: 'PHC',
    instructions: ['Bring child immunization card', 'Ensure the child is hydrated'],
    mapUrl: 'https://maps.google.com'
  },
  {
    id: 'c2',
    title: 'General Health Checkup Camp',
    village: 'Alal (Nabha)',
    date: '2025-01-28',
    time: '9:00 AM - 1:00 PM',
    description: 'Blood pressure, sugar tests and doctor consultation available.',
    status: 'Ongoing',
    organizer: 'ASHA',
    instructions: ['Come on empty stomach for sugar test if possible'],
  },
  {
    id: 'c3',
    title: 'Eye Screening & Spectacles Distribution',
    village: 'Mandaur (Nabha)',
    date: '2025-01-20',
    time: '11:00 AM - 3:00 PM',
    description: 'Free eye screening; subsidized spectacles for eligible citizens.',
    status: 'Completed',
    organizer: 'NGO',
    instructions: ['Senior citizens get priority seating'],
  }
]

function statusBadge(status: CampaignStatus) {
  switch (status) {
    case 'Upcoming':
      return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
    case 'Ongoing':
      return <Badge className="bg-green-100 text-green-800">Ongoing</Badge>
    case 'Completed':
      return <Badge className="bg-gray-200 text-gray-700">Completed</Badge>
  }
}

export default function CampaignDetailsPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id as string
  const campaign = useMemo(() => campaigns.find(c => c.id === id), [id])

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-gray-700 mb-4">Campaign not found.</p>
            <Link href="/campaigns" className="underline text-primary">Back to Campaigns</Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              {statusBadge(campaign.status)}
            </div>
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
          <p className="text-gray-600 mt-2">Detailed information about this health campaign.</p>
          <div className="mt-2">
            <Link href="/campaigns" className="inline-flex items-center text-sm text-primary hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Campaigns
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>About this Campaign</CardTitle>
              <CardDescription>{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                <span>{campaign.village}</span>
                {campaign.mapUrl && (
                  <Link href={campaign.mapUrl} target="_blank" className="ml-3 text-sm text-primary underline">
                    View on map
                  </Link>
                )}
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                <span>{new Date(campaign.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                <span>{campaign.time}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <UserCircle2 className="w-4 h-4 mr-2 text-primary" />
                <span>Organized by: {campaign.organizer}</span>
              </div>

              {campaign.instructions && campaign.instructions.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Special Instructions</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {campaign.instructions.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Removed Remind Me button as requested */}
            </CardContent>
          </Card>

          {/* Right: Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center"><Megaphone className="w-4 h-4 mr-2 text-primary" /> {campaign.title}</div>
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-primary" /> {campaign.village}</div>
              <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary" /> {new Date(campaign.date).toLocaleDateString()}</div>
              <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-primary" /> {campaign.time}</div>
              <div className="flex items-center"><UserCircle2 className="w-4 h-4 mr-2 text-primary" /> {campaign.organizer}</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}



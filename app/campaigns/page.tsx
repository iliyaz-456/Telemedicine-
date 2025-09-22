'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Megaphone, Search } from 'lucide-react'

type CampaignStatus = 'Upcoming' | 'Ongoing' | 'Completed'

interface Campaign {
  id: string
  title: string
  village: string
  date: string // ISO
  time: string // HH:mm or display string
  description: string
  status: CampaignStatus
  organizer: 'ASHA' | 'PHC' | 'NGO'
}

const mockCampaigns: Campaign[] = [
  {
    id: 'c1',
    title: 'Polio Vaccination Drive',
    village: 'Bhadson (Nabha)',
    date: '2025-02-03',
    time: '10:00 AM - 4:00 PM',
    description: 'Free polio drops for children under 5 years. Door-to-door coverage.',
    status: 'Upcoming',
    organizer: 'PHC'
  },
  {
    id: 'c2',
    title: 'General Health Checkup Camp',
    village: 'Alal (Nabha)',
    date: '2025-01-28',
    time: '9:00 AM - 1:00 PM',
    description: 'Blood pressure, sugar tests and doctor consultation available.',
    status: 'Ongoing',
    organizer: 'ASHA'
  },
  {
    id: 'c3',
    title: 'Eye Screening & Spectacles Distribution',
    village: 'Mandaur (Nabha)',
    date: '2025-01-20',
    time: '11:00 AM - 3:00 PM',
    description: 'Free eye screening; subsidized spectacles for eligible citizens.',
    status: 'Completed',
    organizer: 'NGO'
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

export default function CampaignsPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return mockCampaigns.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.village.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold">Health Campaigns</h1>
            </div>
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
          <p className="text-gray-600 mt-2">Discover health campaigns happening in your village and nearby areas.</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campaigns... (title, village, description)"
              className="pl-10"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <Link key={c.id} href={`/campaigns/${c.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    {statusBadge(c.status)}
                  </div>
                  <CardDescription className="mt-2 line-clamp-2">{c.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-primary" /> {c.village}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-primary" /> {new Date(c.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-primary" /> {c.time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}



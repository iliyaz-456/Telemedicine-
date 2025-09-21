'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Stethoscope, Heart, Brain, Eye, Baby, Bone, Activity, Zap, Shield } from 'lucide-react';

// Doctor category data with icons and descriptions
const doctorCategories = [
  {
    id: 'general-physician',
    name: 'General Physician',
    description: 'Primary care and general health consultations',
    icon: Stethoscope,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700'
  },
  {
    id: 'cardiologist',
    name: 'Cardiologist',
    description: 'Heart and cardiovascular system specialist',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    hoverColor: 'hover:from-red-600 hover:to-red-700'
  },
  {
    id: 'neurologist',
    name: 'Neurologist',
    description: 'Brain and nervous system specialist',
    icon: Brain,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    hoverColor: 'hover:from-purple-600 hover:to-purple-700'
  },
  {
    id: 'dermatologist',
    name: 'Dermatologist',
    description: 'Skin, hair, and nail specialist',
    icon: Shield,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    hoverColor: 'hover:from-green-600 hover:to-green-700'
  },
  {
    id: 'ophthalmologist',
    name: 'Ophthalmologist',
    description: 'Eye and vision care specialist',
    icon: Eye,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    hoverColor: 'hover:from-indigo-600 hover:to-indigo-700'
  },
  {
    id: 'pediatrician',
    name: 'Pediatrician',
    description: 'Children\'s health and development specialist',
    icon: Baby,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    hoverColor: 'hover:from-pink-600 hover:to-pink-700'
  },
  {
    id: 'orthopedist',
    name: 'Orthopedist',
    description: 'Bones, joints, and musculoskeletal specialist',
    icon: Bone,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    hoverColor: 'hover:from-orange-600 hover:to-orange-700'
  },
  {
    id: 'pulmonologist',
    name: 'Pulmonologist',
    description: 'Lung and respiratory system specialist',
    icon: Activity,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    hoverColor: 'hover:from-cyan-600 hover:to-cyan-700'
  },
  {
    id: 'nephrologist',
    name: 'Nephrologist',
    description: 'Kidney and urinary system specialist',
    icon: Zap,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
    hoverColor: 'hover:from-teal-600 hover:to-teal-700'
  }
];

export default function DoctorCategoriesPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger animation on component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/patient" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Choose Doctor Category</h1>
              <p className="text-gray-600 mt-1">Select the type of specialist you need to consult with</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {doctorCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id}
                className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 overflow-hidden ${
                  category.bgColor
                } hover:shadow-2xl`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <Link href={`/book/${category.id}`}>
                  <CardContent className="p-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} ${category.hoverColor} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Category Name */}
                    <h3 className={`text-xl font-semibold mb-2 ${category.textColor} group-hover:text-gray-800 transition-colors duration-300`}>
                      {category.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {category.description}
                    </p>
                    
                    {/* Hover Indicator */}
                    <div className="mt-4 flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                      <span>View Doctors</span>
                      <svg 
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-gray-600 mb-6">
              If you're unsure about which specialist to choose, start with a General Physician. 
              They can assess your condition and refer you to the appropriate specialist if needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/book/general-physician">
                  Start with General Physician
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/patient">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Plus, Leaf, Menu, X, User, LogOut } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState("English")
  const { isAuthenticated, user, logout } = useAuth()

  const languages = [
    { code: "en", label: "English" },
    { code: "pa", label: "ਪੰਜਾਬੀ" },
    { code: "hi", label: "हिंदी" },
  ]

  const getDashboardUrl = () => {
    if (!user) return '/dashboard'
    switch (user.role) {
      case 'Patient': return '/dashboard/patient'
      case 'Doctor': return '/dashboard/doctor'
      case 'Worker': return '/dashboard/worker'
      default: return '/dashboard'
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-primary">
              <Plus className="h-6 w-6" />
              <Phone className="h-5 w-5" />
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">TelemediConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors relative group">
              How it Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="#for-doctors" className="text-foreground hover:text-primary transition-colors relative group">
              For Doctors
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="#for-asha" className="text-foreground hover:text-primary transition-colors relative group">
              For ASHA Workers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <Link href="/campaigns" className="text-foreground hover:text-primary transition-colors relative group">
              Campaigns
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right side - Auth or User info */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-2 text-sm">
              {languages.map((lang, index) => (
                <div key={lang.code} className="flex items-center">
                  <button
                    onClick={() => setCurrentLang(lang.label)}
                    className={`transition-colors hover:text-primary ${
                      currentLang === lang.label ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {lang.label}
                  </button>
                  {index < languages.length - 1 && <span className="mx-2 text-muted-foreground">|</span>}
                </div>
              ))}
            </div>

            {/* Authentication Section */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                <Link href={getDashboardUrl()}>
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="animate-glow bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#for-doctors" className="text-foreground hover:text-primary transition-colors">
                For Doctors
              </a>
              <a href="#for-asha" className="text-foreground hover:text-primary transition-colors">
                For ASHA Workers
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
              <Link href="/campaigns" className="text-foreground hover:text-primary transition-colors">
                Campaigns
              </Link>
              
              {/* Mobile Authentication Section */}
              <div className="flex flex-col space-y-4 pt-4 border-t">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{user.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <Link href={getDashboardUrl()}>
                      <Button variant="outline" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={logout} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="w-full animate-glow bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
                
                {/* Language Switcher */}
                <div className="flex items-center space-x-2 text-sm pt-2">
                  {languages.map((lang, index) => (
                    <div key={lang.code} className="flex items-center">
                      <button
                        onClick={() => setCurrentLang(lang.label)}
                        className={`transition-colors hover:text-primary ${
                          currentLang === lang.label ? "text-primary font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {lang.label}
                      </button>
                      {index < languages.length - 1 && <span className="mx-2 text-muted-foreground">|</span>}
                    </div>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

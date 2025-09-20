"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Plus, Leaf, Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState("English")

  const languages = [
    { code: "en", label: "English" },
    { code: "pa", label: "ਪੰਜਾਬੀ" },
    { code: "hi", label: "हिंदी" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-primary">
              <Plus className="h-6 w-6" />
              <Phone className="h-5 w-5" />
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">Sehat Saathi Nabha</span>
          </div>

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
          </nav>

          {/* Language Switcher & CTA */}
          <div className="hidden md:flex items-center space-x-4">
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
            <Button className="animate-glow bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              Get Help Now
            </Button>
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
              <div className="flex flex-col space-y-4 pt-4">
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
                <Button className="animate-glow bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Get Help Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

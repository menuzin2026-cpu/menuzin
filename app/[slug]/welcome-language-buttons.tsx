'use client'

import { useRouter } from 'next/navigation'
import { Language, languages } from '@/lib/i18n'
import { useState, useEffect } from 'react'

interface WelcomeLanguageButtonsProps {
  slug: string
  isLoaded: boolean
}

export function WelcomeLanguageButtons({ slug, isLoaded }: WelcomeLanguageButtonsProps) {
  const router = useRouter()
  const [selectedLang, setSelectedLang] = useState<Language>('en')

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && languages.some((l) => l.code === savedLang)) {
      setSelectedLang(savedLang)
    }
  }, [])

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLang(lang)
    localStorage.setItem('language', lang)
    router.push(`/${slug}/menu?lang=${lang}`)
  }

  return (
    <div className="w-full max-w-[113px] space-y-2 mb-6">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageSelect(lang.code)}
          className="w-full p-3 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-white/15 transition-all text-center group border border-white/20"
        >
          <div className="flex items-center justify-center">
            <h3 className="text-base font-semibold text-white group-hover:scale-105 transition-transform duration-300">
              {lang.nativeName}
            </h3>
          </div>
        </button>
      ))}
    </div>
  )
}


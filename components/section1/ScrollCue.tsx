'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ScrollCue() {
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 20) setScrolled(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-700"
      style={{
        opacity: visible && !scrolled ? 0.6 : 0,
        color: 'var(--label-muted)',
        pointerEvents: 'none',
      }}
    >
      <ChevronDown size={20} />
    </div>
  )
}

import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Atomic Watch Sync',
  description: 'NTP-synced precision time reference for mechanical watch owners.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* FOUC prevention — must run before React hydrates. Always dark unless user chose light. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var m=localStorage.getItem('atomictime_dark_mode');if(m==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');}else{document.documentElement.classList.add('dark');}})();`,
          }}
        />
        {/* DSEG7 font preload — place DSEG7ClassicBold.woff2 in /public/fonts/ */}
        <link
          rel="preload"
          href="/fonts/DSEG7ClassicBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>{children}</body>
    </html>
  )
}

import './globals.css'

import type { Metadata } from 'next'

import { Cormorant_Garamond, Outfit } from 'next/font/google'

import { Toaster } from 'sonner'

const cormorant = Cormorant_Garamond({
   subsets: ['latin'],
   weight: ['400', '500', '600', '700'],
   variable: '--font-cormorant',
   fallback: ['Georgia', 'Times New Roman', 'serif'],
})

const outfit = Outfit({
   variable: '--font-outfit',
   subsets: ['latin'],
   display: 'swap',
   preload: true,
   fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

export const metadata: Metadata = {
   title: 'World Pumps',
   description: 'World Pumps - Your One-Stop Shop for Quality Pumps and Accessories',
}

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html lang="en">
         <body className={`${outfit.variable} ${cormorant.variable} antialiased bg-white `}>
            {children}
            <Toaster
               toastOptions={{
                  duration: 5000,
               }}
            />
         </body>
      </html>
   )
}

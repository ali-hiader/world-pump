import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { brandLogos } from '@/lib/constants'
import Heading from '@/components/client/heading'

export const metadata: Metadata = {
   title: `About Us | World Pumps`,
   description:
      'World Pumps provides reliable pumping, filtration, irrigation, and pool solutions for homes and businesses across Pakistan.',
}

export default function AboutUsPage() {
   return (
      <main className="px-4 sm:px-[5%] mb-16 mt-8 max-w-[1600px] mx-auto">
         <section className="max-w-7xl mx-auto">
            <Heading
               title="About Us"
               summary="Reliable water solutions for homes, communities, and businesses"
            />

            <div className="grid md:grid-cols-2 gap-10 mt-8 items-center">
               <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                     <strong>World Pumps</strong> is a leading provider of water engineering
                     solutions, specializing in swimming pool design & construction, sauna room
                     installation, water filtration systems, and pump technologies. With years of
                     experience and a passion for innovation, we deliver end-to-end services for
                     homes, businesses, and commercial projects across the region.
                  </p>
                  <p className="text-gray-600">
                     Our team of experts handles everything from concept to completion—planning,
                     structural work, plumbing, finishing, and ongoing maintenance. We pride
                     ourselves on using the latest technology and premium materials to ensure
                     long-lasting performance and customer satisfaction.
                  </p>
                  <ul className="grid grid-cols-2 gap-4 text-sm">
                     <li className="rounded-md border border-primary/20 p-3">
                        <div className="text-2xl font-semibold">10+ years</div>
                        <div className="text-muted-foreground">Industry experience</div>
                     </li>
                     <li className="rounded-md border border-primary/20 p-3">
                        <div className="text-2xl font-semibold">25+ cities</div>
                        <div className="text-muted-foreground">Service coverage</div>
                     </li>
                     <li className="rounded-md border border-primary/20 p-3">
                        <div className="text-2xl font-semibold">1000+ projects</div>
                        <div className="text-muted-foreground">Delivered successfully</div>
                     </li>
                     <li className="rounded-md border border-primary/20 p-3">
                        <div className="text-2xl font-semibold">4.8/5</div>
                        <div className="text-muted-foreground">Average rating</div>
                     </li>
                  </ul>

                  <div className="pt-2">
                     <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-5 py-2 rounded-md bg-secondary text-white hover:bg-secondary/90"
                     >
                        Contact Us
                     </Link>
                  </div>
               </div>

               <div className="flex items-center justify-center px-2 sm:px-6">
                  <Image
                     className="rounded-md w-full h-auto max-h-[520px] shadow-lg object-cover"
                     src="/about.jpg"
                     width={1200}
                     height={800}
                     sizes="(max-width: 768px) 100vw, 50vw"
                     alt="World Pumps engineers installing a water system"
                     loading="lazy"
                  />
               </div>
            </div>
         </section>

         <section className="max-w-7xl mx-auto mt-16">
            <div className="mt-8 space-y-6">
               <h4 className="text-lg font-semibold mt-6">Our Services</h4>
               <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Swimming pool design, construction, and renovation</li>
                  <li>Sauna room installation and spa solutions</li>
                  <li>Water filtration and purification systems</li>
                  <li>Pressure pumps, submersibles, and booster systems</li>
                  <li>Fire-fighting and irrigation systems</li>
                  <li>Pool accessories, cleaning tools, and maintenance</li>
               </ul>
               <h4 className="text-lg font-semibold mt-6">Why Choose Us?</h4>
               <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Expertise in water engineering and construction</li>
                  <li>Commitment to quality, safety, and innovation</li>
                  <li>Personalized solutions for every client</li>
                  <li>Transparent communication and reliable support</li>
               </ul>
               <h4 className="text-lg font-semibold mt-6">Our Mission</h4>
               <p className="text-gray-600 leading-relaxed">
                  To bring comfort, safety, and enjoyment to every client by providing high-quality
                  water solutions that stand the test of time. Whether you’re envisioning a private
                  swimming pool, a commercial wellness space, or a large-scale water management
                  project, <strong>World Pumps</strong> is your trusted partner from concept to
                  completion.
               </p>
            </div>
         </section>

         <section className="max-w-7xl mx-auto mt-16">
            {/* Testimonials */}
            <section className="mt-16 lg:mt-24">
               <Heading
                  title="Brands we Deal"
                  summary="Partnering with trusted brands to bring you quality and reliability."
               />

               <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center mt-6">
                  {brandLogos.map((logo) => (
                     <li key={logo} className="flex items-center justify-center">
                        <Image
                           src={logo}
                           alt={`Company's logo`}
                           width={200}
                           height={100}
                           className="object-contain opacity-90"
                           sizes="(max-width: 768px) 50vw, 16vw"
                           loading="lazy"
                        />
                     </li>
                  ))}
               </ul>
            </section>
         </section>
      </main>
   )
}

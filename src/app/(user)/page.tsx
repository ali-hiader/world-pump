import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

import { brandLogos, carouselImages, services } from '@/lib/constants'
import { toBase64 } from '@/lib/utils'
import { fetchFeaturedProducts } from '@/actions/product'
import Heading from '@/components/client/heading'
import NewsletterSignUp from '@/components/client/newsletter'
import ProductCard from '@/components/client/product_card'
import ServiceCard from '@/components/client/service_card'
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from '@/components/ui/carousel'

async function HomePage() {
   const products = await fetchFeaturedProducts(8)

   return (
      <Fragment>
         {/* Carosal Images */}
         <header id="carousel" className="max-w-screen">
            <Carousel className="w-full">
               <CarouselContent>
                  {carouselImages.map((image, idx) => {
                     const filename = image.split('/').pop() || 'slide'
                     const isFirst = idx === 0
                     const blur = toBase64(shimmer(1200, 600))

                     return (
                        <CarouselItem key={image} className="overflow-hidden">
                           <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
                              <Image
                                 src={image}
                                 alt={`Hero slide: ${filename.replace(/[-_]/g, ' ')}`}
                                 fill
                                 sizes="100vw"
                                 className="object-cover"
                                 priority={isFirst}
                                 loading={isFirst ? 'eager' : 'lazy'}
                                 fetchPriority={isFirst ? 'high' : undefined}
                                 placeholder="blur"
                                 blurDataURL={`data:image/svg+xml;base64,${blur}`}
                              />
                           </div>
                        </CarouselItem>
                     )
                  })}
               </CarouselContent>
               <CarouselPrevious className="hidden sm:flex" />
               <CarouselNext className="hidden sm:flex" />
            </Carousel>
         </header>

         <main className="px-4 sm:px-[2%] max-w-[1500px] mx-auto">
            {/* Featured Products */}
            <section className="mt-16 md:mt-24">
               <Heading
                  title="Featured Products"
                  summary="Handpicked selections — top quality and great value."
               />

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 place-items-center gap-6 mt-10">
                  {products.map((product) => (
                     <ProductCard key={product.slug} product={product} />
                  ))}
               </div>

               <Link
                  href={'/pumps/all'}
                  className="py-2 max-w-60 sm:max-w-72 mx-auto mt-12 text-lg rounded-md bg-secondary text-white flex items-center justify-center transition-all hover:bg-secondary/90 cursor-pointer"
               >
                  View All Pumps
               </Link>
            </section>

            {/* About */}
            <section className="mt-16 lg:mt-24 md:px-6">
               <Heading title="About Us" summary="Reliable Pumping Solutions for Every Need" />

               <section className="grid md:grid-cols-2 gap-10 mt-8 items-center">
                  <div className="space-y-4">
                     <h3 className="text-xl font-semibold text-gray-800">Welcome to WORLD PUMPS</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Pakistan’s trusted name in custom swimming pool and luxurious sauna room
                        design and construction. We specialize in creating stunning, modern pools
                        tailored to your lifestyle—whether it’s a luxurious backyard retreat, a
                        commercial pool for hotels and gyms, or a compact design for limited spaces.
                     </p>
                     <p className="text-gray-600 leading-relaxed">
                        Beyond recreation, we care about reliable water solutions. Our team supplies
                        and installs advanced water filtration systems, durable water pumps, and
                        efficient water geysers to keep your home or business running smoothly. We
                        also offer fire-fighting systems and irrigation solutions to ensure safety
                        and sustainable water management.
                     </p>

                     <p className="text-gray-600 leading-relaxed">
                        Let us turn your dream pool into a refreshing reality.
                     </p>

                     <Link
                        href={'/about'}
                        aria-label="Learn more about World Pumps"
                        className="inline-flex items-center justify-center px-5 py-2 mt-6 text-base rounded-md bg-secondary text-white hover:bg-secondary/90"
                     >
                        Learn More
                     </Link>
                  </div>

                  <div className="flex items-center justify-center px-6">
                     <Image
                        className="rounded-md w-full h-auto max-h-[500px] shadow-lg object-cover"
                        src="/about.jpg"
                        width={1200}
                        height={800}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        alt="World Pumps team installing a water system"
                        loading="lazy"
                     />
                  </div>
               </section>
            </section>

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

            {/* Services */}
            <section className="mt-16 lg:mt-24">
               <Heading title="Services" summary="Explore World Pumps Services & Facilities" />

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {services.map((service) => (
                     <ServiceCard key={service.title} {...service} />
                  ))}
               </div>
            </section>

            <section className="w-full h-[500px] mt-24">
               <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.9266120737775!2d74.4284706!3d31.471204899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919066380f46ebd%3A0xb50d6753eb8a188e!2sWorld%20Pumps!5e0!3m2!1sen!2s!4v1757754225661!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
               />
            </section>

            {/* Newsletter Signup */}
            <NewsletterSignUp />
         </main>
      </Fragment>
   )
}

export default HomePage

// Lightweight shimmer placeholder for better perceived loading
function shimmer(w: number, h: number) {
   return `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#f3f4f6" offset="20%" />
        <stop stop-color="#e5e7eb" offset="50%" />
        <stop stop-color="#f3f4f6" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#f3f4f6" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
  </svg>`
}

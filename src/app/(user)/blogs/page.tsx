import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getAllPosts } from '@/lib/blog'
import Heading from '@/components/client/heading'
import NewsletterSignUp from '@/components/client/newsletter'

function BlogsPage() {
   const allPosts = getAllPosts()

   return (
      <main className="px-4 sm:px-[2%] max-w-[1500px] mx-auto py-8 md:space-y-30 space-y-20">
         {/* Header Section */}
         <section className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-20 xl:gap-40 sm:p-8 p-4 lg:place-items-start place-items-center">
            <div className="space-y-8">
               <h1 className="text-3xl headingFont sm:text-4xl whitespace-nowrap font-bold">
                  The World Pumps Newsletter
               </h1>
               <p className="italic">“Your weekly dose of smart insights for smarter pumping.”</p>
               <p>
                  The World Pumps Newsletter delivers practical, easy-to-use guidance for anyone who
                  works with or depends on water pumps. Each week, we share expert maintenance tips,
                  product updates, real-world problem solutions, and insights that help you get
                  better performance, longer pump life, and smarter water-management decisions.
               </p>
               <p>
                  Whether you&apos;re a technician, contractor, or homeowner, our newsletter keeps
                  you informed, prepared, and ahead of the curve.
               </p>
            </div>

            <NewsletterSignUp isOnBlogsPage />
         </section>

         {/* Blog Posts Grid */}
         <section className="max-w-5xl mx-auto">
            <Heading title="All Newsletters" summary="Read the past insight from world pumps" />{' '}
            <div className="sm:p-8 p-6 mt-12 gap-1 bg-secondary/5 grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1">
               {allPosts.map((post) => (
                  <article
                     key={post.id}
                     className="border border-secondary/10 overflow-hidden flex lg:flex-row flex-col gap-4 p-12 bg-white"
                  >
                     <div className="relative lg:w-48 w-full h-40 overflow-hidden">
                        <Image
                           src={post.imageUrl}
                           alt={post.title}
                           fill
                           className="object-cover transition-transform duration-300  hover:scale-105"
                           sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                     </div>
                     <div className="space-y-3">
                        <h3 className="font-semibold text-xl sm:text-2xl line-clamp-2">
                           <Link
                              href={`/blogs/${post.slug}`}
                              className="hover:text-primary transition-colors"
                           >
                              {post.title}
                           </Link>
                        </h3>
                        <p className=" text-secondary/70 line-clamp-3 max-w-3/4 ">{post.excerpt}</p>
                     </div>
                     <div className="flex flex-col">
                        <p className="flex flex-col">
                           <span className="font-medium text-secondary/80">Read</span>
                           <span className="text-xl font-medium text-primary">{post.readTime}</span>
                        </p>
                        <p className="flex flex-col whitespace-nowrap">
                           <span className="font-medium text-secondary/80">Published At</span>
                           <span className="text-xl font-medium text-primary">
                              {new Date(post.publishedAt).toLocaleDateString()}
                           </span>
                        </p>
                     </div>
                  </article>
               ))}
            </div>
         </section>
      </main>
   )
}

export default BlogsPage

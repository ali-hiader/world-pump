import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getAllPosts, getFeaturedPost } from '@/lib/blog'
import Heading from '@/components/client/heading'
import NewsletterSignUp from '@/components/client/newsletter'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

function BlogsPage() {
   const allPosts = getAllPosts()
   const featuredPost = getFeaturedPost()

   return (
      <main className="px-4 sm:px-[2%] max-w-[1500px] mx-auto py-8">
         {/* Header Section */}
         <section className="text-center mb-12">
            <Heading
               title="Our Blog"
               summary="Expert insights, tips, and guides about water pumps and filtration systems"
            />
         </section>

         <Separator className="mb-8" />

         {/* Featured Blog Post */}
         {featuredPost && (
            <section className="mb-12">
               <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
               <div className="grid md:grid-cols-2 gap-8 p-6 border border-secondary/10 rounded-lg shadow-sm">
                  <div className="relative h-64 md:h-80 overflow-hidden rounded-md">
                     <Image
                        src={featuredPost.imageUrl}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                     />
                  </div>
                  <div className="flex flex-col justify-center">
                     <Badge variant="outline" className="w-fit mb-3">
                        {featuredPost.category}
                     </Badge>
                     <h3 className="text-2xl md:text-3xl font-bold headingFont mb-4">
                        <Link
                           href={`/blogs/${featuredPost.slug}`}
                           className="hover:text-primary transition-colors"
                        >
                           {featuredPost.title}
                        </Link>
                     </h3>
                     <p className="text-muted-foreground mb-4 leading-relaxed">
                        {featuredPost.excerpt}
                     </p>
                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{featuredPost.readTime}</span>
                        <span>•</span>
                        <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                     </div>
                  </div>
               </div>
            </section>
         )}

         {/* Blog Posts Grid */}
         <section>
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {allPosts
                  .filter((post) => !post.featured)
                  .map((post) => (
                     <article
                        key={post.id}
                        className="border border-secondary/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                     >
                        <div className="relative h-48 overflow-hidden">
                           <Image
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-300 hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                           />
                        </div>
                        <div className="p-4">
                           <Badge variant="outline" className="mb-3">
                              {post.category}
                           </Badge>
                           <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              <Link
                                 href={`/blogs/${post.slug}`}
                                 className="hover:text-primary transition-colors"
                              >
                                 {post.title}
                              </Link>
                           </h3>
                           <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                              {post.excerpt}
                           </p>
                           <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{post.readTime}</span>
                              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                           </div>
                        </div>
                     </article>
                  ))}
            </div>
         </section>

         {/* Load More Button */}
         {allPosts.length > 6 && (
            <section className="text-center mt-12">
               <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
                  Load More Articles
               </button>
            </section>
         )}

         {/* Newsletter Signup */}
         <NewsletterSignUp />
      </main>
   )
}

export default BlogsPage

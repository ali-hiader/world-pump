import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/lib/blog'
import DisplayAlert from '@/components/client/display-alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// Generate static paths for all blog posts
export async function generateStaticParams() {
   const posts = getAllPostSlugs()
   return posts.map((post) => ({
      slug: post.params.slug,
   }))
}

interface BlogPageProps {
   params: {
      slug: string
   }
}

export default async function BlogPage({ params }: BlogPageProps) {
   const post = await getPostBySlug((await params).slug)

   if (!post) {
      return <DisplayAlert>No Post found with this ID!</DisplayAlert>
   }

   const relatedPosts = getRelatedPosts(post.slug, post.category)

   return (
      <main className="px-4 sm:px-[2%] max-w-[1200px] mx-auto py-16">
         <header className="grid grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-[3fr_2fr]  gap-16">
            <section>
               <h1 className="text-3xl md:text-4xl font-bold headingFont mb-4 leading-tight">
                  {post.title}
               </h1>
               <p className="text-muted-foreground mb-6 leading-relaxed">{post.excerpt}</p>

               <div className="flex flex-wrap items-center gap-4 text-sm  mb-6">
                  <p className="">
                     <span className="italic text-muted-foreground">sent by</span>{' '}
                     <span>{post.author}</span>
                  </p>
                  <span>|</span>
                  <span>
                     {new Date(post.publishedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                     })}
                  </span>
                  <span>|</span>

                  <p>
                     <span className="text-muted-foreground text-sm italic">read time</span>{' '}
                     <span>{post.readTime}</span>
                  </p>
               </div>
            </section>

            <section className="relative overflow-hidden rounded-lg">
               <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
               />
            </section>
         </header>

         <Separator className="my-12" />

         {/* Article Content */}
         <article className="prose prose-lg max-w-none">
            <div
               className="text-foreground leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:headingFont [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:mb-4 [&>ul]:pl-6 [&>li]:mb-2 [&>li]:leading-relaxed"
               dangerouslySetInnerHTML={{ __html: post.content }}
            />
         </article>

         <Separator className="my-12" />

         {/* Share Section */}
         <section className="mb-12 text-center">
            <h3 className="text-lg font-semibold mb-4">Share this article</h3>
            <div className="flex justify-center gap-2">
               <Button variant="outline" size="sm">
                  Facebook
               </Button>
               <Button variant="outline" size="sm">
                  Twitter
               </Button>
               <Button variant="outline" size="sm">
                  LinkedIn
               </Button>
               <Button
                  // onClick={() =>
                  //    navigator.clipboard.writeText(
                  //       `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${params.slug}`,
                  //    )
                  // }
                  variant="outline"
                  size="sm"
               >
                  Copy Link
               </Button>
            </div>
         </section>

         <Separator className="mb-12" />

         {/* Related Articles */}
         {relatedPosts.length > 0 && (
            <section className="mb-12">
               <h2 className="text-2xl font-bold headingFont mb-6">Related Articles</h2>
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                     <article
                        key={relatedPost.id}
                        className="border border-secondary/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                     >
                        <div className="relative h-48 overflow-hidden">
                           <Image
                              src={relatedPost.imageUrl}
                              alt={relatedPost.title}
                              fill
                              className="object-cover transition-transform duration-300 hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                           />
                        </div>
                        <div className="p-4">
                           <Badge variant="outline" className="mb-3">
                              {relatedPost.category}
                           </Badge>
                           <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              <Link
                                 href={`/blogs/${relatedPost.slug}`}
                                 className="hover:text-primary transition-colors"
                              >
                                 {relatedPost.title}
                              </Link>
                           </h3>
                           <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                              {relatedPost.excerpt}
                           </p>
                           <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{relatedPost.readTime}</span>
                              <span>{new Date(relatedPost.publishedAt).toLocaleDateString()}</span>
                           </div>
                        </div>
                     </article>
                  ))}
               </div>
            </section>
         )}

         {/* Call to Action */}
         <section className="bg-primary/30 p-8 text-center">
            <h2 className="text-3xl font-bold headingFont mb-4">Need Expert Pump Solutions?</h2>
            <p className="text-secondary/80 mb-6 max-w-2xl mx-auto">
               Our team of pump experts is ready to help you find the perfect water pump solution
               for your needs. Get professional advice and quality products backed by years of
               experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button
                  asChild
                  variant="default"
                  size="lg"
                  className=" bg-secondary text-white border-2 border-white rounded-none"
               >
                  <Link href="/contact">Contact Our Experts</Link>
               </Button>
            </div>
         </section>
      </main>
   )
}

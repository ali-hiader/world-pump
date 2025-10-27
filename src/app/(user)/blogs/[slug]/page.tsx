import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/lib/blog'
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
  // Get the blog post from markdown file
  const post = await getPostBySlug(params.slug)

  // Return 404 if post not found
  if (!post) {
    notFound()
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = getRelatedPosts(post.slug, post.category)

  return (
    <main className="px-4 sm:px-[2%] max-w-[1200px] mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blogs" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-foreground">{post.title}</span>
        </div>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <Badge variant="outline" className="mb-4">
          {post.category}
        </Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold headingFont mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{post.excerpt}</p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <span>By {post.author}</span>
          <span>•</span>
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative h-64 md:h-96 mb-8 overflow-hidden rounded-lg">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
          priority
        />
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none mb-12">
        <div
          className="text-foreground leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:headingFont [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:mb-4 [&>ul]:pl-6 [&>li]:mb-2 [&>li]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <Separator className="mb-12" />

      {/* Author Bio */}
      <section className="mb-12 p-6 bg-muted rounded-lg">
        <h3 className="text-xl font-semibold mb-3">About the Author</h3>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
            WP
          </div>
          <div>
            <h4 className="font-semibold mb-2">{post.author}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our expert team at World Pumps brings decades of experience in water pump technology,
              installation, and maintenance. We&apos;re committed to sharing knowledge that helps
              our customers make informed decisions and maintain their water systems effectively.
            </p>
          </div>
        </div>
      </section>

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
          <Button variant="outline" size="sm">
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
      <section className="bg-primary/5 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold headingFont mb-4">Need Expert Pump Solutions?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Our team of pump experts is ready to help you find the perfect water pump solution for
          your needs. Get professional advice and quality products backed by years of experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/contact">Contact Our Experts</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/pumps">Browse Our Products</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

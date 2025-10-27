import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content/blogs')

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  readTime: string
  publishedAt: string
  imageUrl: string
  author: string
  tags: string[]
  featured: boolean
  slug: string
}

export interface BlogPostMeta {
  id: string
  title: string
  excerpt: string
  category: string
  readTime: string
  publishedAt: string
  imageUrl: string
  author: string
  tags: string[]
  featured: boolean
  slug: string
}

// Get all blog post slugs
export function getAllPostSlugs(): { params: { slug: string } }[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames
      .filter((name) => name.endsWith('.md'))
      .map((name) => ({
        params: {
          slug: name.replace(/\.md$/, ''),
        },
      }))
  } catch (error) {
    console.error('Error reading blog post slugs:', error)
    return []
  }
}

// Get all blog posts metadata
export function getAllPosts(): BlogPostMeta[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter((name) => name.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)

        return {
          id: slug,
          slug,
          title: matterResult.data.title || '',
          excerpt: matterResult.data.excerpt || '',
          category: matterResult.data.category || 'General',
          readTime: matterResult.data.readTime || '5 min read',
          publishedAt: matterResult.data.publishedAt || new Date().toISOString(),
          imageUrl: matterResult.data.imageUrl || '/default-blog-image.jpg',
          author: matterResult.data.author || 'World Pumps Team',
          tags: matterResult.data.tags || [],
          featured: matterResult.data.featured || false,
        }
      })

    // Sort posts by date
    return allPostsData.sort((a, b) => {
      if (a.publishedAt < b.publishedAt) {
        return 1
      } else {
        return -1
      }
    })
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

// Get a single blog post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(html).process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
      id: slug,
      slug,
      content: contentHtml,
      title: matterResult.data.title || '',
      excerpt: matterResult.data.excerpt || '',
      category: matterResult.data.category || 'General',
      readTime: matterResult.data.readTime || '5 min read',
      publishedAt: matterResult.data.publishedAt || new Date().toISOString(),
      imageUrl: matterResult.data.imageUrl || '/default-blog-image.jpg',
      author: matterResult.data.author || 'World Pumps Team',
      tags: matterResult.data.tags || [],
      featured: matterResult.data.featured || false,
    }
  } catch (error) {
    console.error('Error reading blog post:', error)
    return null
  }
}

// Get featured post
export function getFeaturedPost(): BlogPostMeta | null {
  const posts = getAllPosts()
  return posts.find((post) => post.featured) || posts[0] || null
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPostMeta[] {
  const posts = getAllPosts()
  if (category === 'All') {
    return posts
  }
  return posts.filter((post) => post.category === category)
}

// Get all categories
export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = posts.map((post) => post.category)
  const uniqueCategories = Array.from(new Set(categories))
  return ['All', ...uniqueCategories.sort()]
}

// Get related posts (same category, excluding current post)
export function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPostMeta[] {
  const posts = getAllPosts()
  return posts
    .filter((post) => post.slug !== currentSlug && post.category === category)
    .slice(0, limit)
}

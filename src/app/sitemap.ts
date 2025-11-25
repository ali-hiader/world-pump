import type { MetadataRoute } from 'next'

import { getAllPosts } from '@/lib/blog'
import { fetchAllAccessories } from '@/actions/accessory'
import { fetchAllProducts } from '@/actions/product'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const baseUrl = 'https://worldpumps.com.pk'

   // Static routes
   const staticRoutes: MetadataRoute.Sitemap = [
      {
         url: baseUrl,
         lastModified: new Date(),
         changeFrequency: 'daily',
         priority: 1,
      },
      {
         url: `${baseUrl}/about-us`,
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.8,
      },
      {
         url: `${baseUrl}/contact`,
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.8,
      },
      {
         url: `${baseUrl}/services`,
         lastModified: new Date(),
         changeFrequency: 'monthly',
         priority: 0.7,
      },
      {
         url: `${baseUrl}/pumps`,
         lastModified: new Date(),
         changeFrequency: 'daily',
         priority: 0.9,
      },
      {
         url: `${baseUrl}/accessories`,
         lastModified: new Date(),
         changeFrequency: 'daily',
         priority: 0.9,
      },
      {
         url: `${baseUrl}/blogs`,
         lastModified: new Date(),
         changeFrequency: 'weekly',
         priority: 0.8,
      },
   ]

   // Dynamic product routes
   let productRoutes: MetadataRoute.Sitemap = []
   try {
      const products = await fetchAllProducts()
      productRoutes = products.map((product) => ({
         url: `${baseUrl}/pumps/${product.slug}`,
         lastModified: new Date(product.updatedAt),
         changeFrequency: 'weekly' as const,
         priority: 0.7,
      }))
   } catch (error) {
      console.error('Error fetching products for sitemap:', error)
   }

   // Dynamic accessory routes
   let accessoryRoutes: MetadataRoute.Sitemap = []
   try {
      const accessories = await fetchAllAccessories()
      accessoryRoutes = accessories.map((accessory) => ({
         url: `${baseUrl}/accessories/${accessory.slug}`,
         lastModified: new Date(accessory.updatedAt),
         changeFrequency: 'weekly' as const,
         priority: 0.6,
      }))
   } catch (error) {
      console.error('Error fetching accessories for sitemap:', error)
   }

   // Dynamic blog routes
   let blogRoutes: MetadataRoute.Sitemap = []
   try {
      const blogs = getAllPosts()
      blogRoutes = blogs.map((blog) => ({
         url: `${baseUrl}/blogs/${blog.slug}`,
         lastModified: new Date(blog.publishedAt),
         changeFrequency: 'monthly' as const,
         priority: 0.6,
      }))
   } catch (error) {
      console.error('Error fetching blogs for sitemap:', error)
   }

   return [...staticRoutes, ...productRoutes, ...accessoryRoutes, ...blogRoutes]
}

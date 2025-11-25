import type { UploadApiResponse } from 'cloudinary'

import slugify from 'slugify'

import { uploadImage } from '@/lib/cloudinary/cloudinary'

export function createSlug(text: string): string {
   return slugify(text, { lower: true, trim: true, strict: true })
}

export function optimizeCloudinaryUrl(url: string): string {
   if (!url.includes('/upload')) {
      return url
   }

   const parts = url.split('/upload')
   if (parts.length !== 2) {
      return url
   }

   return `${parts[0]}/upload/q_auto/f_auto${parts[1]}`
}

export async function uploadFormImage(image: File): Promise<string> {
   const arrayBuffer = await image.arrayBuffer()
   const buffer = Buffer.from(arrayBuffer)

   const result = await new Promise<UploadApiResponse | undefined>((resolve) => {
      uploadImage(buffer, (uploadResult) => {
         resolve(uploadResult)
      })
   })

   if (!result?.url) {
      throw new Error('Image upload failed')
   }

   return optimizeCloudinaryUrl(result.url)
}

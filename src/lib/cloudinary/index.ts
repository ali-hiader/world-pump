import { UploadApiOptions, UploadApiResponse, v2 as cloudinary } from 'cloudinary'

import { logger } from '@/lib/logger'

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
   secure: true,
})

type UploadImageCallback = (result: UploadApiResponse | undefined) => void

export const uploadImage = async (
   file: Buffer,
   cb: UploadImageCallback,
   options?: UploadApiOptions,
) => {
   cloudinary.uploader
      .upload_stream(options ?? {}, (error, uploadResult) => {
         if (error) {
            logger.error('Image upload failed', error)
            cb(undefined)
            return
         }
         cb(uploadResult)
      })
      .end(file)
}

export const deleteImage = async (publicId: string) => {
   return await cloudinary.uploader.destroy(publicId)
}

export const extractCloudinaryPublicId = (url: string) => {
   try {
      if (!url.includes('res.cloudinary.com')) {
         return null
      }

      // Handle different Cloudinary URL formats
      const match = url.match(/\/upload\/(.+)$/)
      if (match && match[1]) {
         let path = match[1]

         // Strip transformation segments (e.g., q_auto, f_auto, q_auto,f_auto)
         const segments = path.split('/')
         const isTransform = (seg: string) =>
            seg.includes(',') ||
            seg.startsWith('q_') ||
            seg.startsWith('f_') ||
            seg.startsWith('w_') ||
            seg.startsWith('h_') ||
            seg.startsWith('c_') ||
            seg.startsWith('g_') ||
            seg.startsWith('e_') ||
            seg.startsWith('t_') ||
            seg.startsWith('r_') ||
            seg.startsWith('a_') ||
            seg.startsWith('b_') ||
            seg.startsWith('dpr_') ||
            seg.startsWith('fl_')

         while (segments.length > 0 && isTransform(segments[0])) {
            segments.shift()
         }

         // Drop version segment if present (can appear after transformations)
         if (segments.length > 0 && /^v\d+$/.test(segments[0])) {
            segments.shift()
         }

         const cleaned = segments.join('/').replace(/\.[^/.]+$/, '')
         return cleaned || null
      }

      return null
   } catch (error) {
      logger.warn('Error extracting Cloudinary public ID', { error })
      return null
   }
}

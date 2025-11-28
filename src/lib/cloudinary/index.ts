import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'

import { logger } from '@/lib/logger'

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
   secure: true,
})

type UploadImageCallback = (result: UploadApiResponse | undefined) => void

export const uploadImage = async (file: Buffer, cb: UploadImageCallback) => {
   cloudinary.uploader
      .upload_stream((error, uploadResult) => {
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
      const regex = /\/upload\/(?:v\d+\/)?(?:[^\/]+\/)*([^\/]+)(?:\.[^.]+)?$/
      const match = url.match(regex)

      if (match && match[1]) {
         // Remove any remaining file extension
         return match[1].replace(/\.[^/.]+$/, '')
      }

      return null
   } catch (error) {
      logger.warn('Error extracting Cloudinary public ID', { error })
      return null
   }
}

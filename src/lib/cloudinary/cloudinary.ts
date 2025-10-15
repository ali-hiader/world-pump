import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export const uploadImage = async (
  file: Buffer,
  cb: (result: UploadApiResponse | undefined) => void,
) => {
  cloudinary.uploader
    .upload_stream((error, uploadResult) => {
      if (error) {
        console.log('Image Upload Error: ', error)
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

// Utility function to extract Cloudinary public ID
export function extractCloudinaryPublicId(url: string): string | null {
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
    console.warn('Error extracting Cloudinary public ID:', error)
    return null
  }
}

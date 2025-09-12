import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (
  file: Buffer,
  cb: (result: UploadApiResponse | undefined) => Promise<never>
) => {
  cloudinary.uploader
    .upload_stream((error, uploadResult) => {
      if (error) {
        console.log("Image Upload Error: ", error);
        cb(undefined);
      }
      cb(uploadResult);
    })
    .end(file);
};

export const deleteImage = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId);
};

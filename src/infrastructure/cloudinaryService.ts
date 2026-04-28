import { v2 as cloudinary } from 'cloudinary';

import { ENV } from '../config/env';

// Configure Cloudinary using environment variables
export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY.CLOUD_NAME,
    api_key: ENV.CLOUDINARY.API_KEY,
    api_secret: ENV.CLOUDINARY.API_SECRET,
  });
};

export class CloudinaryService {
  constructor() {
    configureCloudinary();
  }

  /**
   * Uploads an image stream/buffer to Cloudinary
   * @param fileBuffer The image buffer from multer
   * @param folder Optional folder name in Cloudinary (e.g., "kits" or "profiles")
   * @returns The secure URL of the uploaded image
   */
  async uploadImage(fileBuffer: Buffer, folder: string = 'general'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Failed to upload image'));
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Unknown upload error'));
          }
        }
      );

      // Write the buffer to the stream
      uploadStream.end(fileBuffer);
    });
  }
}

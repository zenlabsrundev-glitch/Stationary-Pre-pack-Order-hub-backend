import { Request, Response } from 'express';
import { CloudinaryService } from '../../infrastructure/cloudinaryService';

export class UploadController {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Optional: Get folder from query, e.g. /api/upload?folder=kits
      const folder = (req.query.folder as string) || 'general';

      const imageUrl = await this.cloudinaryService.uploadImage(req.file.buffer, folder);

      return res.status(200).json({ url: imageUrl });
    } catch (error) {
      console.error('Upload Controller Error:', error);
      return res.status(500).json({ message: 'Internal server error during upload' });
    }
  }
}

import multer from 'multer';

// Use memory storage so we get a Buffer in req.file 
// instead of saving it directly to the server's disk
const storage = multer.memoryStorage();

// Basic file filter to ensure only images are uploaded
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!') as any, false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

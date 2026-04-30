import dotenv from 'dotenv';
import path  from 'path';

// Load environment variables from .env file
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'stationery-hub-secure-secret-2026',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://campush-kit-hub.web.app',

  // Email Configuration
  EMAIL: {
    HOST: process.env.EMAIL_HOST,
    PORT: Number(process.env.EMAIL_PORT) || 587,
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASSWORD,
  },

  // Cloudinary Configuration
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },

  // Supabase Configuration
  SUPABASE: {
    URL: process.env.SUPABASE_URL,
    KEY: process.env.SUPABASE_KEY,
    SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  },

  IS_PROD: process.env.NODE_ENV === 'production',
};

// Helper function to check if all required env variables are present
export const validateEnv = () => {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SUPABASE_URL',
    'SUPABASE_KEY'
  ];

  console.log('[INFO] Validating environment variables...');
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`[CRITICAL] Missing environment variables: ${missing.join(', ')}`);
  } else {
    console.log('[SUCCESS] All required environment variables are present.');
  }
};

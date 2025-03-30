// cloudinaryTest.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to a test image (using a sample image from client/public folder)
const testImagePath = path.join(__dirname, '../../client/public/logo-green.svg');

// Function to test uploading to Cloudinary
const testCloudinaryUpload = async () => {
  try {
    console.log('Starting Cloudinary upload test...');
    console.log(`Using test image: ${testImagePath}`);
    
    // Check if the file exists
    if (!fs.existsSync(testImagePath)) {
      console.error('Test image file not found!');
      return;
    }
    
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(testImagePath, {
      folder: 'test',
      resource_type: 'auto'
    });
    
    console.log('✅ Cloudinary upload test successful!');
    console.log('Image URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
    
    // Optional: Delete the test image from Cloudinary
    await cloudinary.uploader.destroy(result.public_id);
    console.log('Test image deleted from Cloudinary');
    
  } catch (error) {
    console.error('❌ Cloudinary upload test failed:', error);
  }
};

// Run the test
testCloudinaryUpload();
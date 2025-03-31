// cloudinaryTest.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to a test image (using a sample image from client/public folder)
const testImagePath = path.join(__dirname, '../../client/public/logo-green.svg');

// Manually attempt to load .env file from different locations
console.log('=== ENVIRONMENT DIAGNOSTICS ===');
console.log('Current directory:', process.cwd());

const testEnvPaths = [
  '.env',
  '../.env',
  '../../.env',
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env')
];

for (const envPath of testEnvPaths) {
  try {
    if (fs.existsSync(envPath)) {
      console.log(`Found .env at: ${path.resolve(envPath)}`);
      // Load the .env file for testing
      const envConfig = dotenv.config({ path: envPath });
      if (envConfig.error) {
        console.log(`Error loading .env: ${envConfig.error.message}`);
      }
      
      // Try to read contents directly
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        
        // Look for Cloudinary variables in the file
        const cloudinaryLines = lines.filter(line => 
          line.trim().startsWith('CLOUDINARY_') && !line.trim().startsWith('#'));
        
        console.log('Found Cloudinary configuration in .env:');
        if (cloudinaryLines.length === 0) {
          console.log('- No Cloudinary variables found in this file');
        } else {
          cloudinaryLines.forEach(line => {
            const [key] = line.split('=');
            console.log(`- ${key.trim()}: Found`);
          });
        }
      } catch (readError) {
        console.log(`Error reading .env file: ${readError.message}`);
      }
    } else {
      console.log(`No .env file at: ${path.resolve(envPath)}`);
    }
  } catch (error) {
    console.log(`Error checking path ${envPath}: ${error.message}`);
  }
}

// Check if environment variables are available
console.log('\nEnvironment Variables:');
console.log(`CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME || 'Not found'}`);
console.log(`CLOUDINARY_API_KEY: ${process.env.CLOUDINARY_API_KEY ? 'Found (hidden)' : 'Not found'}`);
console.log(`CLOUDINARY_API_SECRET: ${process.env.CLOUDINARY_API_SECRET ? 'Found (hidden)' : 'Not found'}`);

// Check the Cloudinary configuration directly
console.log('\nCloudinary Configuration:');
try {
  const config = cloudinary.config();
  console.log(`cloud_name: ${config.cloud_name || 'Not configured'}`);
  console.log(`api_key: ${config.api_key ? 'Configured (hidden)' : 'Not configured'}`);
  console.log(`api_secret: ${config.api_secret ? 'Configured (hidden)' : 'Not configured'}`);
} catch (configError) {
  console.log(`Error getting Cloudinary config: ${configError.message}`);
}

// Function to test uploading to Cloudinary
const testCloudinaryUpload = async () => {
  try {
    console.log('\n=== CLOUDINARY UPLOAD TEST ===');
    console.log('Starting Cloudinary upload test...');

    // Log the state after importing cloudinary module (debug info)
    const { cloud_name, api_key, api_secret } = cloudinary.config();
    console.log('Cloudinary config state:');
    console.log(`- Cloud name: ${cloud_name || 'Not set'}`);
    console.log(`- API key: ${api_key ? 'Set' : 'Not set'}`);
    console.log(`- API secret: ${api_secret ? 'Set' : 'Not set'}`);
    
    // Manually set config as a test
    console.log('\nAttempting to manually set Cloudinary configuration...');
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
      });
      
      const newConfig = cloudinary.config();
      console.log('Configuration after manual setting:');
      console.log(`- Cloud name: ${newConfig.cloud_name || 'Not set'}`);
      console.log(`- API key: ${newConfig.api_key ? 'Set' : 'Not set'}`);
      console.log(`- API secret: ${newConfig.api_secret ? 'Set' : 'Not set'}`);
    } catch (configError) {
      console.log(`Error setting config: ${configError.message}`);
    }
    
    console.log(`\nUsing test image: ${testImagePath}`);
    
    // Check if the file exists
    if (!fs.existsSync(testImagePath)) {
      console.error('Test image file not found!');
      return;
    }
    
    // Try direct upload with explicit config
    console.log('\nAttempting upload with manually set config...');
    try {
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
      
    } catch (uploadError) {
      console.error('❌ Cloudinary upload test failed:', uploadError.message);
      console.error('Error details:', uploadError);
      
      if (uploadError.message.includes('api_key')) {
        console.log('\nTrying one more approach - direct configuration...');
        try {
          // Create a new cloudinary instance with hardcoded values for testing
          const { v2 } = await import('cloudinary');
          
          // Configure with values from process.env
          v2.config({
            cloud_name: 'dhavrhk6t',
            api_key: '444763997942368',
            api_secret: '9wOYpbMrVCDByVFlcyY3OOEbna4',
            secure: true
          });
          
          const directResult = await v2.uploader.upload(testImagePath, {
            folder: 'test',
            resource_type: 'auto'
          });
          
          console.log('✅ Direct configuration upload successful!');
          console.log('Image URL:', directResult.secure_url);
          console.log('Public ID:', directResult.public_id);
          
          await v2.uploader.destroy(directResult.public_id);
          console.log('Test image deleted from Cloudinary');
          
        } catch (directError) {
          console.error('❌ Direct configuration upload failed:', directError.message);
        }
      }
    }
  } catch (error) {
    console.error('❌ General error in test function:', error.message);
  }
};

// Run the test
testCloudinaryUpload();
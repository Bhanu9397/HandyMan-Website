import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = {
  electrical: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
  plumbing: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80',
  carpentry: 'https://images.unsplash.com/photo-1581147036320-84d4e4b3a0a7?w=800&q=80',
  painting: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
  hvac: 'https://images.unsplash.com/photo-1581093458791-9d15482442f6?w=800&q=80',
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  security: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
  default: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80'
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filename);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}`));
      }
    }).on('error', reject);
  });
};

const downloadAllImages = async () => {
  const imageDir = path.join(__dirname, '../public/images/services');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  // Download each image
  for (const [category, url] of Object.entries(images)) {
    const filename = path.join(imageDir, `${category}.jpg`);
    try {
      await downloadImage(url, filename);
      console.log(`Downloaded ${category}.jpg`);
    } catch (error) {
      console.error(`Error downloading ${category}.jpg:`, error);
    }
  }
};

downloadAllImages().catch(console.error); 
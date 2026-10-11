const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'images');

const newPhotos = [
  {
    name: 'cv-segmentation.jpg',
    url: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'neural-compression.jpg',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'ai-video-gen.jpg',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'video-denoising.jpg',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'ai-audio-separation.jpg',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(fs.statSync(dest).size);
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log('Downloading 5 new AI & Computer Vision images...');
  for (const item of newPhotos) {
    const dest = path.join(imagesDir, item.name);
    try {
      const size = await downloadFile(item.url, dest);
      console.log(`✓ Downloaded ${item.name} (${Math.round(size / 1024)} KB)`);
    } catch (e) {
      console.error(`✗ Error downloading ${item.name}: ${e.message}`);
    }
  }
}

run();

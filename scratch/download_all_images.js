const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const photoMap = [
  {
    name: 'audio-bitrates.jpg',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'ai-upscaling.jpg',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'backup-strategy.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'video-codecs.jpg',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'cdn-network.jpg',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'audio-cbr-vbr.jpg',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'private-security.jpg',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'frame-rates.jpg',
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'color-spaces.jpg',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'audio-loudness.jpg',
    url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'copyright-fair-use.jpg',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'batch-workflows.jpg',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80'
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
  console.log(`Starting download of ${photoMap.length} high-res article graphics...`);
  for (const item of photoMap) {
    const destPath = path.join(imagesDir, item.name);
    try {
      const size = await downloadFile(item.url, destPath);
      console.log(`✓ Downloaded ${item.name} (${Math.round(size / 1024)} KB)`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.name}: ${err.message}`);
    }
  }
  console.log('Finished downloading graphics!');
}

run();

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const slugs = [
  'facebook-video-quality-explained',
  'mp4-vs-webm-vs-mkv-video-formats',
  'facebook-reels-aspect-ratio-specs',
  'audio-bitrates-explained-128k-vs-320k',
  'how-video-upscaling-works-4k',
  'how-to-backup-facebook-videos-safely',
  'video-codecs-h264-vs-hevc-vs-av1',
  'why-video-downloads-fail-cors-rate-limits',
  'audio-cbr-vs-vbr-encoding-guide',
  'safely-download-private-group-videos',
  'frame-rates-social-media-24fps-vs-30fps-vs-60fps',
  'color-spaces-hdr-rec709-vs-rec2020',
  'audio-loudness-normalization-14-lufs',
  'fair-use-digital-copyright-video-archiving',
  'batch-processing-workflows-bulk-download',
  'computer-vision-ai-video-segmentation',
  'neural-video-compression-machine-learning',
  'ai-video-generation-diffusion-models-coherence',
  'machine-learning-real-time-video-denoising',
  'ai-audio-separation-demixing-neural-networks'
];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Downloader Utilities -->
  <url>
    <loc>https://fb4kdownloader.com/</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://fb4kdownloader.com/facebook-reels-downloader</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://fb4kdownloader.com/fb-to-mp3</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://fb4kdownloader.com/facebook-private-video-downloader</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://fb4kdownloader.com/bulk-fb-reel-downloader</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://fb4kdownloader.com/how-to-use</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Blog Hub & 20 In-Depth Articles -->
  <url>
    <loc>https://fb4kdownloader.com/blog</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${slugs.map(s => `  <url>
    <loc>https://fb4kdownloader.com/blog/${s}</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}

  <!-- Legal & Support Pages -->
  <url>
    <loc>https://fb4kdownloader.com/about</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://fb4kdownloader.com/contact</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://fb4kdownloader.com/privacy</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://fb4kdownloader.com/terms</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://fb4kdownloader.com/dmca</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapContent, 'utf8');
console.log('✓ sitemap.xml updated with 20 blog articles.');

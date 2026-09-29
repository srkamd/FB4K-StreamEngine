const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const archiver = require('archiver');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const https = require('https');
const dns = require('dns');

// Set DNS to prioritize IPv4 over IPv6 globally
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const app = express();
const PORT = process.env.PORT || 3000;

// High-Performance Axios HTTP Keep-Alive Agent
const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 100,
  maxFreeSockets: 20,
  timeout: 15000,
  rejectUnauthorized: false,
  family: 4 // Force IPv4 to bypass cloud/datacenter IPv6 range blocks
});

const axiosClient = axios.create({
  httpsAgent,
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  }
});

const debugLogs = [];
function addDebugLog(msg, error = null) {
  const logItem = {
    timestamp: new Date().toISOString(),
    message: msg,
    error: error ? {
      message: error.message,
      code: error.code,
      status: error.response ? error.response.status : null,
      headers: error.response ? error.response.headers : null,
      stack: error.stack
    } : null
  };
  debugLogs.push(logItem);
  if (debugLogs.length > 50) debugLogs.shift();
  console.log(`[DEBUG LOG] ${msg}`, error ? error.message : '');
}

app.get('/api/debug-logs', (req, res) => {
  res.json({
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    env: process.env.NODE_ENV,
    logs: debugLogs
  });
});

// ⚡ PERFORMANCE: Enable GZIP Compression
app.use(compression());

// 🛡️ SECURITY & CACHE-CONTROL: Force Fresh Asset Loading
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  res.setHeader('Content-Security-Policy', "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-src 'self' https:;");
  if (req.url.includes('styles.css') || req.url.includes('.js')) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  } else if (req.url.includes('.html')) {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  next();
});

// 🔀 SEO CANONICALIZATION: 301 Permanent Redirects for Clean URLs
app.use((req, res, next) => {
  if (req.path === '/index.html') {
    return res.redirect(301, '/');
  }
  if (req.path.endsWith('.html')) {
    const cleanPath = req.path.slice(0, -5);
    
    if (cleanPath === '/reels') {
      return res.redirect(301, '/facebook-reels-downloader');
    }
    if (cleanPath === '/private') {
      return res.redirect(301, '/facebook-private-video-downloader');
    }
    if (cleanPath === '/mp3') {
      return res.redirect(301, '/fb-to-mp3');
    }
    
    return res.redirect(301, cleanPath);
  }
  next();
});

// 🛡️ SECURITY: Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP. Please try again later.' }
});

app.use('/api/', apiLimiter);

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Clean route handling for extensionless URLs
app.get('/batch', (req, res) => res.redirect(301, '/bulk-fb-reel-downloader'));
app.get('/bulk-fb-reel-downloader', (req, res) => res.sendFile(path.join(__dirname, 'bulk-fb-reel-downloader.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get('/privacy', (req, res) => res.sendFile(path.join(__dirname, 'privacy.html')));
app.get('/terms', (req, res) => res.sendFile(path.join(__dirname, 'terms.html')));
app.get('/dmca', (req, res) => res.sendFile(path.join(__dirname, 'dmca.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get('/facebook-reels-downloader', (req, res) => res.sendFile(path.join(__dirname, 'reels.html')));
app.get('/facebook-private-video-downloader', (req, res) => res.sendFile(path.join(__dirname, 'private.html')));
app.get('/fb-to-mp3', (req, res) => res.sendFile(path.join(__dirname, 'mp3.html')));
app.get('/blog', (req, res) => res.sendFile(path.join(__dirname, 'blog.html')));
app.get('/guides', (req, res) => res.redirect(301, '/blog'));
app.get('/blog/:slug', (req, res) => {
  const filePath = path.join(__dirname, 'blog', `${req.params.slug}.html`);
  const fs = require('fs');
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  res.status(404).redirect('/blog');
});

// Static File Server with Clean Extensions Engine
app.use(express.static(path.join(__dirname), {
  extensions: ['html', 'htm'],
  etag: false,
  lastModified: false
}));

// Clean & Validate Facebook URL string
function cleanFbUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  let clean = rawUrl
    .replace(/\\/g, '')
    .replace(/\\u0026/g, '&')
    .replace(/\\u0025/g, '%')
    .replace(/&amp;/g, '&')
    .split('u003C')[0]
    .split('<')[0]
    .trim();

  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    return null;
  }
  return clean;
}

// Safe Filename Sanitizer
function sanitizeFilename(name, fallback = 'fb4kdownloader_video') {
  if (!name || typeof name !== 'string') return `${fallback}.mp4`;
  let safe = path.basename(name).replace(/[^a-zA-Z0-9_\-\.]/g, '_').replace(/_+/g, '_').trim();
  if (!safe || safe === '_') safe = fallback;
  if (!safe.toLowerCase().endsWith('.mp4') && !safe.toLowerCase().endsWith('.mp3')) {
    safe += '.mp4';
  }
  return safe;
}

// Single Video & Reel Extraction Helper with Double-Layer Plugin Embed Extractor
async function fetchFbVideoStreams(inputUrl) {
  const idMatch = inputUrl.match(/(?:reel\/|videos\/|v=|v\/)(\d+)/);
  const videoId = idMatch ? idMatch[1] : null;

  let hdUrl = null;
  let sdUrl = null;
  let title = 'Facebook Video Stream';
  let thumbnail = null;
  let durationFormatted = '00:20';

  // Layer 1: Try Facebook Watch URL
  try {
    let watchUrl = inputUrl;
    if (videoId) watchUrl = `https://www.facebook.com/watch/?v=${videoId}`;
    const res1 = await axiosClient.get(watchUrl);
    const html1 = res1.data;

    const hdM = html1.match(/playable_url_quality_hd\s*:\s*"([^"]+)"/) || html1.match(/browser_native_hd_url\s*:\s*"([^"]+)"/);
    if (hdM && hdM[1]) hdUrl = cleanFbUrl(hdM[1]);

    const sdM = html1.match(/playable_url\s*:\s*"([^"]+)"/) || html1.match(/browser_native_sd_url\s*:\s*"([^"]+)"/);
    if (sdM && sdM[1]) sdUrl = cleanFbUrl(sdM[1]);

    const titleMatch = html1.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) || html1.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(' | Facebook', '').replace('- Facebook', '').trim();
    }

    const thumbMatch = html1.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (thumbMatch && thumbMatch[1]) {
      thumbnail = cleanFbUrl(thumbMatch[1]);
    }
  } catch (e) {}

  // Layer 2: If HD/SD streams not found, fetch via Facebook Video Plugin Embed
  if (!hdUrl && !sdUrl && videoId) {
    try {
      const pluginUrl = `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch/?v=${videoId}`;
      const res2 = await axiosClient.get(pluginUrl);
      const html2 = res2.data;

      const mp4Matches = html2.match(/https?:\\?\/\\?\/[^\s"'<>]+\.fbcdn\.net[^\s"'<>]+\.mp4[^\s"'>]*/gi);
      if (mp4Matches && mp4Matches.length > 0) {
        const cleanedMp4s = mp4Matches.map(cleanFbUrl).filter(Boolean);
        if (cleanedMp4s.length > 0) {
          hdUrl = cleanedMp4s[0];
          sdUrl = cleanedMp4s[1] || cleanedMp4s[0];
        }
      }
    } catch (e) {}
  }

  return { hdUrl, sdUrl, title, thumbnail, durationFormatted };
}

// Ultra Fast Single Video Extraction API
app.get('/api/extract', async (req, res) => {
  const inputUrl = req.query.url;
  if (!inputUrl || typeof inputUrl !== 'string') {
    return res.status(400).json({ success: false, message: 'Valid video URL is required' });
  }

  try {
    const parsed = await fetchFbVideoStreams(inputUrl);

    if (parsed.hdUrl || parsed.sdUrl) {
      const realHd = parsed.hdUrl || parsed.sdUrl;
      const realSd = parsed.sdUrl || parsed.hdUrl;

      return res.json({
        success: true,
        title: parsed.title,
        duration: parsed.durationFormatted,
        thumbnail: parsed.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
        fourKUrl: `/api/proxy-download?url=${encodeURIComponent(realHd)}&filename=fb4kdownloader_video_4k.mp4`,
        hdUrl: `/api/proxy-download?url=${encodeURIComponent(realHd)}&filename=fb4kdownloader_video_1080p.mp4`,
        sdUrl: `/api/proxy-download?url=${encodeURIComponent(realSd)}&filename=fb4kdownloader_video_720p.mp4`,
        mp3Url: `/api/proxy-download?url=${encodeURIComponent(realSd)}&filename=fb4kdownloader_audio.mp3`
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Could not extract MP4 video stream. Please ensure the Facebook Video or Reel is public.'
    });

  } catch (error) {
    console.error('FB Extraction Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Facebook video. Please check the URL and try again.'
    });
  }
});

// Bulk URL List Queue Extraction API
app.post('/api/extract-list', async (req, res) => {
  const { urls } = req.body || {};
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ success: false, message: 'Array of URLs is required' });
  }

  const results = [];
  const limit = Math.min(urls.length, 100);

  for (let i = 0; i < limit; i++) {
    const rawUrl = typeof urls[i] === 'string' ? urls[i].trim() : '';
    if (!rawUrl) continue;

    try {
      const parsed = await fetchFbVideoStreams(rawUrl);
      const safeFilePrefix = `fb4kdownloader_queue_${i + 1}`;

      if (parsed.hdUrl || parsed.sdUrl) {
        const streamHd = parsed.hdUrl || parsed.sdUrl;
        results.push({
          id: (i + 1).toString(),
          originalUrl: rawUrl,
          title: parsed.title || `Facebook Reel #${i + 1}`,
          duration: parsed.durationFormatted,
          thumbnail: parsed.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
          fourKUrl: `/api/proxy-download?url=${encodeURIComponent(streamHd)}&filename=${safeFilePrefix}_4k.mp4`,
          hdUrl: `/api/proxy-download?url=${encodeURIComponent(streamHd)}&filename=${safeFilePrefix}_1080p.mp4`,
          sdUrl: `/api/proxy-download?url=${encodeURIComponent(streamHd)}&filename=${safeFilePrefix}_720p.mp4`,
          mp3Url: `/api/proxy-download?url=${encodeURIComponent(streamHd)}&filename=${safeFilePrefix}_audio.mp3`
        });
      } else {
        results.push({
          id: (i + 1).toString(),
          originalUrl: rawUrl,
          title: `Facebook Reel #${i + 1} (Private/Restricted)`,
          duration: '00:00',
          thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
          invalid: true
        });
      }

    } catch (err) {
      results.push({
        id: (i + 1).toString(),
        originalUrl: rawUrl,
        title: `Facebook Reel #${i + 1} (Error)`,
        duration: '00:00',
        thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
        invalid: true
      });
    }
  }

  return res.json({
    success: true,
    totalParsed: results.length,
    videos: results
  });
});

// NATIVE HTTPS STREAM FETCHER FOR BULLETPROOF OUTBOUND STREAM BYPASS
function fetchStreamWithNativeHttps(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      return reject(new Error('Too many redirects'));
    }
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://www.facebook.com/',
        'Origin': 'https://www.facebook.com',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Range': 'bytes=0-'
      },
      agent: httpsAgent, // Use high-performance Keep-Alive agent for fast transfers!
      rejectUnauthorized: false,
      family: 4
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const nextUrl = res.headers.location;
        resolve(fetchStreamWithNativeHttps(nextUrl, redirectCount + 1));
      } else if (res.statusCode >= 400) {
        reject(new Error(`Server returned status code ${res.statusCode}`));
      } else {
        resolve({
          headers: res.headers,
          data: res
        });
      }
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// DIRECT MP4 STREAM PROXY ROUTE
app.get('/api/proxy-download', async (req, res) => {
  let fileUrl = req.query.url;
  let rawFilename = req.query.filename || 'fb4kdownloader_video.mp4';
  const cleanFilename = sanitizeFilename(rawFilename);
  const isMp3 = cleanFilename.toLowerCase().endsWith('.mp3');

  const cleanUrl = cleanFbUrl(fileUrl);
  if (!cleanUrl) {
    return res.status(400).send('Invalid or untrusted file URL');
  }

  try {
    const streamRes = await fetchStreamWithNativeHttps(cleanUrl);

    const is4k = cleanFilename.toLowerCase().includes('_4k');

    if (isMp3) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);

      const ffmpegPath = require('ffmpeg-static');
      const { spawn } = require('child_process');

      try {
        const fs = require('fs');
        fs.chmodSync(ffmpegPath, '755');
      } catch (chmodErr) {
        console.warn('Failed to set FFmpeg permissions:', chmodErr.message);
      }

      const ffmpeg = spawn(ffmpegPath, [
        '-i', 'pipe:0',
        '-vn',
        '-acodec', 'libmp3lame',
        '-ab', '320k',
        '-f', 'mp3',
        'pipe:1'
      ]);

      streamRes.data.on('error', (err) => {
        console.error('streamRes data stream error:', err.message);
        ffmpeg.kill();
      });

      ffmpeg.stdin.on('error', (err) => {
        console.error('ffmpeg stdin EPIPE ignored safely:', err.message);
      });

      ffmpeg.stdout.on('error', (err) => {
        console.error('ffmpeg stdout EPIPE ignored safely:', err.message);
      });

      streamRes.data.pipe(ffmpeg.stdin);
      ffmpeg.stdout.pipe(res);

      ffmpeg.stderr.on('data', (data) => {
        // Silence or debug logs
      });

      ffmpeg.on('close', (code) => {
        if (code !== 0) {
          console.error(`ffmpeg closed with error code ${code}`);
        }
      });

      res.on('close', () => {
        ffmpeg.kill();
      });

      return;
    } else if (is4k) {
      const fs = require('fs');
      const tempDir = path.join(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) {
        try {
          fs.mkdirSync(tempDir, { recursive: true });
        } catch (e) {}
      }

      const tempInput = path.join(tempDir, `input_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`);
      const tempOutput = path.join(tempDir, `output_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`);

      // 1. Download streamRes data to tempInput
      const fileWriter = fs.createWriteStream(tempInput);
      streamRes.data.pipe(fileWriter);

      fileWriter.on('finish', () => {
        // 2. Spawn FFmpeg on the local tempInput file (fully seekable!)
        const ffmpegPath = require('ffmpeg-static');
        const { spawn } = require('child_process');

        try {
          fs.chmodSync(ffmpegPath, '755');
        } catch (chmodErr) {}

        const ffmpeg = spawn(ffmpegPath, [
          '-i', tempInput,
          '-threads', '1', // Force exactly 1 thread to bypass Hostinger CPU/NPROC account limit blocks!
          '-vf', 'scale=3840:2160:flags=bilinear', // REAL 4K upscaling!
          '-c:v', 'libx264',
          '-preset', 'ultrafast', // Minimum CPU complexity
          '-crf', '24', // Target quality for 40-50MB file size outputs
          '-bf', '0', // 0 B-frames (saves massive virtual memory!)
          '-refs', '1', // 1 reference frame (saves massive frame buffers!)
          '-rc-lookahead', '0', // No lookahead buffer (saves memory!)
          '-c:a', 'copy',
          '-y',
          tempOutput
        ]);

        let ffmpegStderr = '';
        ffmpeg.stderr.on('data', (data) => {
          ffmpegStderr += data.toString();
        });

        ffmpeg.on('close', (code) => {
          if (code !== 0) {
            console.warn(`ffmpeg upscaler closed with error code ${code}. Falling back to direct stream!`);
            addDebugLog(`ffmpeg upscaler closed with error code ${code}. Stderr: ${ffmpegStderr.substring(0, 500)}. FALLING BACK TO DIRECT STREAM.`);
            
            try { fs.unlinkSync(tempOutput); } catch (e) {}

            // Stream the original tempInput file back to the client!
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);
            
            if (fs.existsSync(tempInput)) {
              const stat = fs.statSync(tempInput);
              res.setHeader('Content-Length', stat.size);

              const fileReader = fs.createReadStream(tempInput);
              fileReader.pipe(res);

              res.on('close', () => {
                try { fs.unlinkSync(tempInput); } catch (e) {}
              });
            } else {
              return res.redirect(302, cleanUrl);
            }
            return;
          }

          // 3. Stream the processed tempOutput back to the client
          res.setHeader('Content-Type', 'video/mp4');
          res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);
          
          if (fs.existsSync(tempOutput)) {
            const stat = fs.statSync(tempOutput);
            res.setHeader('Content-Length', stat.size);

            const fileReader = fs.createReadStream(tempOutput);
            fileReader.pipe(res);

            res.on('close', () => {
              try { fs.unlinkSync(tempInput); } catch (e) {}
              try { fs.unlinkSync(tempOutput); } catch (e) {}
            });
          } else {
            addDebugLog('FFmpeg finished but output file was not created');
            try { fs.unlinkSync(tempInput); } catch (e) {}
            return res.redirect(302, cleanUrl);
          }
        });

        ffmpeg.on('error', (spawnErr) => {
          addDebugLog('FFmpeg spawn error on temp file upscaling, falling back to direct stream', spawnErr);
          try { fs.unlinkSync(tempOutput); } catch (e) {}
          
          res.setHeader('Content-Type', 'video/mp4');
          res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);
          
          if (fs.existsSync(tempInput)) {
            const stat = fs.statSync(tempInput);
            res.setHeader('Content-Length', stat.size);

            const fileReader = fs.createReadStream(tempInput);
            fileReader.pipe(res);

            res.on('close', () => {
              try { fs.unlinkSync(tempInput); } catch (e) {}
            });
          } else {
            return res.redirect(302, cleanUrl);
          }
        });
      });

      fileWriter.on('error', (err) => {
        addDebugLog('Failed to write stream to temp input file', err);
        try { fs.unlinkSync(tempInput); } catch (e) {}
        return res.redirect(302, cleanUrl);
      });

      return;
    } else {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);
      if (streamRes.headers['content-length']) {
        res.setHeader('Content-Length', streamRes.headers['content-length']);
      }
      return streamRes.data.pipe(res);
    }

  } catch (err) {
    addDebugLog(`Proxy download failed for cleanUrl: ${cleanUrl.substring(0, 150)}...`, err);
    // Bulletproof fallback: redirect browser directly to the Facebook CDN link so it downloads using user's clean home IP
    return res.redirect(302, cleanUrl);
  }
});

app.get('/api/test-cdn', async (req, res) => {
  const fileUrl = req.query.url;
  if (!fileUrl) {
    return res.status(400).send('URL query parameter is required');
  }
  try {
    const streamRes = await fetchStreamWithNativeHttps(fileUrl);
    return res.json({
      success: true,
      statusCode: streamRes.data.statusCode,
      headers: streamRes.headers
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
      stack: err.stack
    });
  }
});

app.get('/api/test-ffmpeg', (req, res) => {
  const { spawn } = require('child_process');
  
  // Test global ffmpeg first
  const ffmpegGlobal = spawn('ffmpeg', ['-version']);
  let globalOutput = '';
  
  ffmpegGlobal.stdout.on('data', (data) => {
    globalOutput += data.toString();
  });
  
  ffmpegGlobal.on('close', (code) => {
    return res.json({
      success: true,
      type: 'global_system_ffmpeg',
      code,
      output: globalOutput.substring(0, 500)
    });
  });
  
  ffmpegGlobal.on('error', (globalErr) => {
    // If global ffmpeg fails, fallback to test static ffmpeg
    const ffmpegPath = require('ffmpeg-static');
    const ffmpegStatic = spawn(ffmpegPath, ['-version']);
    let staticOutput = '';
    
    ffmpegStatic.stdout.on('data', (data) => {
      staticOutput += data.toString();
    });
    
    ffmpegStatic.on('close', (code) => {
      return res.json({
        success: true,
        type: 'static_bundled_ffmpeg',
        code,
        output: staticOutput.substring(0, 500)
      });
    });
    
    ffmpegStatic.on('error', (staticErr) => {
      return res.json({
        success: false,
        globalError: globalErr.message,
        staticError: staticErr.message
      });
    });
  });
});

app.get('/api/test-transcode', async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const { spawn } = require('child_process');
  
  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    try { fs.mkdirSync(tempDir, { recursive: true }); } catch (e) {}
  }
  
  const testInput = path.join(tempDir, 'test_input.mp4');
  const testOutput = path.join(tempDir, 'test_output.mp4');
  
  const https = require('https');
  const testVideoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
  
  const fileWriter = fs.createWriteStream(testInput);
  
  https.get(testVideoUrl, (downloadRes) => {
    downloadRes.pipe(fileWriter);
    
    fileWriter.on('finish', () => {
      const ffmpegPath = require('ffmpeg-static');
      
      try {
        fs.chmodSync(ffmpegPath, '755');
      } catch (e) {}
      
      const ffmpeg = spawn(ffmpegPath, [
        '-i', testInput,
        '-threads', '1', // Force exactly 1 thread
        '-vf', 'scale=3840:2160:flags=bilinear', // Scale to 4K!
        '-c:v', 'libx264',
        '-preset', 'ultrafast', // Minimum CPU complexity
        '-crf', '30', // Very light quality to lower frame buffer sizes
        '-bf', '0', // 0 B-frames (saves massive virtual memory!)
        '-refs', '1', // 1 reference frame (saves massive frame buffers!)
        '-rc-lookahead', '0', // No lookahead buffer (saves memory!)
        '-c:a', 'copy',
        '-y',
        testOutput
      ]);
      
      let ffmpegStderr = '';
      ffmpeg.stderr.on('data', (data) => {
        ffmpegStderr += data.toString();
      });
      
      ffmpeg.on('close', (code) => {
        const result = {
          success: code === 0,
          code,
          stderr: ffmpegStderr,
          inputFileExists: fs.existsSync(testInput),
          outputFileExists: fs.existsSync(testOutput),
          outputFileSize: fs.existsSync(testOutput) ? fs.statSync(testOutput).size : 0
        };
        
        try { fs.unlinkSync(testInput); } catch (e) {}
        try { fs.unlinkSync(testOutput); } catch (e) {}
        
        return res.json(result);
      });
      
      ffmpeg.on('error', (err) => {
        return res.json({
          success: false,
          error: err.message,
          stderr: ffmpegStderr
        });
      });
    });
  }).on('error', (err) => {
    return res.json({
      success: false,
      error: 'Failed to download test video: ' + err.message
    });
  });
});

// Download Chrome Extension ZIP Endpoint
app.get('/api/download-extension', (req, res) => {
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="fb4kdownloader-chrome-extension.zip"');

  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);
  archive.directory(path.join(__dirname, 'extension'), false);
  archive.finalize();
});

app.listen(PORT, () => {
  console.log(`⚡ FB4KDownloader.com Layer-2 Extractor active on http://localhost:${PORT}`);
});

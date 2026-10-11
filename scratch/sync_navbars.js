const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const filesToUpdate = [
  { file: 'index.html', active: 'home' },
  { file: 'reels.html', active: 'reels' },
  { file: 'facebook-reels-downloader.html', active: 'reels' },
  { file: 'mp3.html', active: 'mp3' },
  { file: 'fb-to-mp3.html', active: 'mp3' },
  { file: 'bulk-fb-reel-downloader.html', active: 'bulk' },
  { file: 'private.html', active: 'resources' },
  { file: 'facebook-private-video-downloader.html', active: 'resources' },
  { file: 'how-to-use.html', active: 'resources' },
  { file: 'about.html', active: 'resources' },
  { file: 'privacy.html', active: 'resources' },
  { file: 'terms.html', active: 'resources' },
  { file: 'dmca.html', active: 'resources' },
  { file: 'contact.html', active: 'resources' },
  { file: 'blog.html', active: 'blog' },
  { file: 'guides.html', active: 'blog' }
];

function buildNavWrapper(activeItem) {
  return `      <div class="nav-links-wrapper">
        <ul class="nav-links">
          <li class="nav-item"><a href="/" class="nav-link ${activeItem === 'home' ? 'active' : ''}"><i class="fa-solid fa-house"></i> Home</a></li>
          <li class="nav-item"><a href="/facebook-reels-downloader" class="nav-link ${activeItem === 'reels' ? 'active' : ''}"><i class="fa-solid fa-clapperboard"></i> Reels</a></li>
          <li class="nav-item"><a href="/fb-to-mp3" class="nav-link ${activeItem === 'mp3' ? 'active' : ''}"><i class="fa-solid fa-music"></i> FB to MP3</a></li>
          <li class="nav-item"><a href="/bulk-fb-reel-downloader" class="nav-link ${activeItem === 'bulk' ? 'active' : ''}"><i class="fa-solid fa-list-check"></i> Bulk</a></li>
          <li class="nav-item"><a href="/blog" class="nav-link ${activeItem === 'blog' ? 'active' : ''}"><i class="fa-solid fa-newspaper"></i> Blog</a></li>
          <li class="nav-item">
            <a href="#" class="nav-link ${activeItem === 'resources' ? 'active' : ''}"><i class="fa-solid fa-compass"></i> Resources ▾</a>
            <div class="dropdown-menu">
              <a href="/how-to-use" class="dropdown-item"><i class="fa-solid fa-circle-question"></i> How to Use</a>
              <a href="/about" class="dropdown-item"><i class="fa-solid fa-circle-info"></i> About Us</a>
              <a href="/privacy" class="dropdown-item"><i class="fa-solid fa-user-shield"></i> Privacy Policy</a>
              <a href="/terms" class="dropdown-item"><i class="fa-solid fa-file-contract"></i> Terms of Service</a>
              <a href="/dmca" class="dropdown-item"><i class="fa-solid fa-scale-balanced"></i> DMCA Policy</a>
              <a href="/contact" class="dropdown-item"><i class="fa-regular fa-envelope"></i> Contact Us</a>
            </div>
          </li>
        </ul>
      </div>`;
}

filesToUpdate.forEach(item => {
  const filePath = path.join(rootDir, item.file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <div class="nav-links-wrapper">...</div>
  const navRegex = /<div class="nav-links-wrapper">[\s\S]*?<\/div>(\s*<div class="nav-actions">)/;
  if (navRegex.test(content)) {
    content = content.replace(navRegex, (match, p1) => {
      return buildNavWrapper(item.active) + '\n\n      ' + p1.trimStart();
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Synchronized header in ${item.file}`);
  } else {
    console.log(`⚠ Regex did not match in ${item.file}`);
  }
});

const fs = require('fs');

const blogStyles = `

/* ==========================================================================
   BLOG & KNOWLEDGE BASE STYLES
   ========================================================================== */

.blog-hero {
  text-align: center;
  padding: 50px 20px 40px;
  max-width: 900px;
  margin: 0 auto;
}

.blog-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgba(0, 242, 254, 0.1);
  border: 1px solid rgba(0, 242, 254, 0.3);
  color: var(--neon-cyan);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 20px;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 28px;
  margin-top: 30px;
}

.blog-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.blog-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 242, 254, 0.4);
  box-shadow: 0 12px 35px rgba(0, 242, 254, 0.12);
}

.blog-card-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--neon-cyan);
  background: rgba(0, 242, 254, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 14px;
  align-self: flex-start;
}

.blog-card-title {
  font-size: 1.22rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.4;
  margin-bottom: 12px;
  font-family: 'Outfit', sans-serif;
}

.blog-card-title a {
  color: #fff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.blog-card-title a:hover {
  color: var(--neon-cyan);
}

.blog-card-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
}

.blog-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-glass);
  padding-top: 16px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.blog-card-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--neon-cyan);
  font-weight: 700;
  text-decoration: none;
  transition: gap 0.2s ease;
}

.blog-card-btn:hover {
  gap: 10px;
}

/* ==========================================================================
   SINGLE ARTICLE TYPOGRAPHY & LAYOUT
   ========================================================================== */

.article-wrapper {
  max-width: 920px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.breadcrumb-nav a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-nav a:hover {
  color: var(--neon-cyan);
}

.article-header {
  margin-bottom: 40px;
  border-bottom: 1px solid var(--border-glass);
  padding-bottom: 28px;
}

.article-title {
  font-size: 2.35rem;
  font-weight: 900;
  color: #fff;
  line-height: 1.25;
  margin-bottom: 18px;
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.02em;
}

.article-meta-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  color: var(--text-muted);
  font-size: 0.88rem;
  flex-wrap: wrap;
}

.article-meta-bar span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.article-content {
  color: #d1d5db;
  font-size: 1.05rem;
  line-height: 1.85;
}

.article-content p {
  margin-bottom: 24px;
}

.article-content h2 {
  font-size: 1.65rem;
  font-weight: 800;
  color: #fff;
  margin: 44px 0 20px;
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.01em;
  border-left: 4px solid var(--neon-cyan);
  padding-left: 14px;
}

.article-content h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #f3f4f6;
  margin: 32px 0 16px;
  font-family: 'Outfit', sans-serif;
}

.article-content ul, .article-content ol {
  margin-bottom: 26px;
  padding-left: 24px;
}

.article-content li {
  margin-bottom: 10px;
  line-height: 1.7;
}

.article-content strong {
  color: #fff;
}

.article-content a {
  color: var(--neon-cyan);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.article-content a:hover {
  color: #38bdf8;
}

.article-callout {
  background: rgba(0, 242, 254, 0.04);
  border: 1px solid rgba(0, 242, 254, 0.2);
  border-left: 4px solid var(--neon-cyan);
  border-radius: var(--radius-lg);
  padding: 22px 24px;
  margin: 34px 0;
  color: var(--text-secondary);
}

.article-callout strong {
  color: #fff;
  display: block;
  margin-bottom: 8px;
  font-size: 1.02rem;
}

.article-table-wrapper {
  overflow-x: auto;
  margin: 34px 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
}

.article-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.92rem;
}

.article-table th {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-weight: 800;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-color);
  font-family: 'Outfit', sans-serif;
}

.article-table td {
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
}

.article-table tr:last-child td {
  border-bottom: none;
}

.article-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.code-box {
  background: #060913;
  border: 1px solid var(--border-glass);
  border-radius: 12px;
  padding: 18px 22px;
  margin: 28px 0;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 0.88rem;
  color: #38bdf8;
  overflow-x: auto;
  line-height: 1.6;
}

.author-bio-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 28px;
  margin-top: 50px;
  display: flex;
  align-items: center;
  gap: 22px;
}

.author-bio-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(0, 242, 254, 0.3);
}

.author-bio-details h4 {
  color: #fff;
  font-size: 1.15rem;
  font-weight: 800;
  margin-bottom: 6px;
  font-family: 'Outfit', sans-serif;
}

.author-bio-details p {
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0;
}

.article-tool-cta {
  background: linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%);
  border: 1px solid var(--border-neon);
  border-radius: var(--radius-xl);
  padding: 30px;
  margin: 45px 0;
  text-align: center;
}

.article-tool-cta h3 {
  color: #fff;
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.article-tool-cta p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  max-width: 600px;
  margin: 0 auto 20px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .article-title {
    font-size: 1.85rem;
  }
  .author-bio-card {
    flex-direction: column;
    text-align: center;
  }
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
`;

fs.appendFileSync('styles.css', blogStyles, 'utf8');
console.log('✅ Successfully appended blog styles to styles.css');

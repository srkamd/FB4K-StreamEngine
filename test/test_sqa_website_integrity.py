"""
SQA Test Suite: Website DOM Integrity, Extension Links, and Static Consistency
Target: All public HTML pages, server.js routes, and README
SQA Specification: W3C HTML5 Compliance & Broken Link Prevention
"""

import unittest
import os
import re

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
LIVE_EXTENSION_URL = "https://chromewebstore.google.com/detail/fb4kdownloader-%E2%80%94-4k-faceb/ppaccglfffbbilgiogijkggcldkmfbkh"
OLD_ID_1 = "cmhlgochpmciomoodleglljgmoclhcif"
OLD_ID_2 = "ppaccglfffbbilgiogijkgqcldkmfbkh" # with typographical q instead of g

class TestWebsiteIntegrity(unittest.TestCase):

    def get_all_project_files(self, extensions=('.html', '.js', '.md')):
        target_files = []
        for root, dirs, files in os.walk(PROJECT_ROOT):
            if '.git' in dirs:
                dirs.remove('.git')
            if 'node_modules' in dirs:
                dirs.remove('node_modules')
            for f in files:
                if f.endswith(extensions):
                    target_files.append(os.path.join(root, f))
        return target_files

    # -------------------------------------------------------------
    # 1. Obsolescence & Broken Link Prevention
    # -------------------------------------------------------------
    def test_no_obsolete_extension_ids_exist_in_project(self):
        files = self.get_all_project_files()
        found_old_ids = []
        for file_path in files:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                if OLD_ID_1 in content:
                    found_old_ids.append((file_path, OLD_ID_1))
                if OLD_ID_2 in content:
                    found_old_ids.append((file_path, OLD_ID_2))

        self.assertEqual(len(found_old_ids), 0, f"Obsolete extension IDs detected in files: {found_old_ids}")

    def test_live_extension_url_present_in_critical_entrypoints(self):
        critical_files = [
            os.path.join(PROJECT_ROOT, 'index.html'),
            os.path.join(PROJECT_ROOT, 'how-to-use.html'),
            os.path.join(PROJECT_ROOT, 'server.js'),
            os.path.join(PROJECT_ROOT, 'README.md')
        ]
        for fpath in critical_files:
            self.assertTrue(os.path.exists(fpath), f"File {fpath} not found")
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            self.assertIn(LIVE_EXTENSION_URL, content, f"Live Chrome Web Store URL missing in {os.path.basename(fpath)}")

    # -------------------------------------------------------------
    # 2. Server API Extension Redirect Consistency
    # -------------------------------------------------------------
    def test_server_redirect_route_matches_live_url(self):
        server_path = os.path.join(PROJECT_ROOT, 'server.js')
        with open(server_path, 'r', encoding='utf-8') as f:
            code = f.read()
        
        pattern = r"app\.get\(['\"]\/api\/download-extension['\"].*?res\.redirect\(301,\s*['\"]([^'\"]+)['\"]\)"
        match = re.search(pattern, code, re.DOTALL)
        self.assertIsNotNone(match, "Route /api/download-extension redirect not found in server.js")
        redirect_target = match.group(1)
        self.assertEqual(redirect_target, LIVE_EXTENSION_URL, "Server redirect target does not match published extension URL")

    # -------------------------------------------------------------
    # 3. HTML Structure & DOM Element Sanity
    # -------------------------------------------------------------
    def test_index_html_has_critical_dom_elements(self):
        index_path = os.path.join(PROJECT_ROOT, 'index.html')
        with open(index_path, 'r', encoding='utf-8') as f:
            html = f.read()

        # Input field (#url-input) matching app.js
        self.assertIn('id="url-input"', html, "index.html missing main URL input #url-input")
        # Submit / Download button
        self.assertTrue('id="download-btn"' in html or 'btn-download' in html, "index.html missing download trigger button")
        # Responsive viewport meta tag
        self.assertIn('name="viewport"', html, "index.html missing viewport meta tag")
        # SEO Meta title and description
        self.assertIn('<title>', html)
        self.assertIn('name="description"', html)

    def test_google_play_button_configured(self):
        index_path = os.path.join(PROJECT_ROOT, 'index.html')
        with open(index_path, 'r', encoding='utf-8') as f:
            html = f.read()
        self.assertIn('id="googlePlayBtn"', html, "Google Play button missing on index.html")
        self.assertIn('Coming Soon', html, "Coming Soon badge missing for Google Play button")

    def test_favicon_assets_and_no_old_blue_cloud(self):
        svg_path = os.path.join(PROJECT_ROOT, 'favicon.svg')
        with open(svg_path, 'r', encoding='utf-8') as f:
            svg = f.read()
        self.assertNotIn('#3b82f6', svg, "Old blue cloud icon still present in favicon.svg")
        self.assertIn('#f59e0b', svg, "Brand amber arrow missing in favicon.svg")
        self.assertTrue(os.path.exists(os.path.join(PROJECT_ROOT, 'favicon.ico')), "favicon.ico missing")
        self.assertTrue(os.path.exists(os.path.join(PROJECT_ROOT, 'apple-touch-icon.png')), "apple-touch-icon.png missing")

    def test_google_compliance_pages_exist(self):
        required_pages = ['disclaimer.html', 'cookie-policy.html', 'faq.html', 'about.html', 'privacy.html', 'terms.html', 'dmca.html', 'contact.html']
        for p in required_pages:
            full_path = os.path.join(PROJECT_ROOT, p)
            self.assertTrue(os.path.exists(full_path), f"Compliance page {p} does not exist")

    def test_sitemap_contains_compliance_routes(self):
        sitemap_path = os.path.join(PROJECT_ROOT, 'sitemap.xml')
        with open(sitemap_path, 'r', encoding='utf-8') as f:
            xml = f.read()
        for route in ['/disclaimer', '/cookie-policy', '/faq', '/about', '/contact', '/privacy', '/terms', '/dmca']:
            self.assertIn(f'<loc>https://fb4kdownloader.com{route}</loc>', xml, f"Route {route} missing in sitemap.xml")

    def test_all_html_files_have_valid_doctype_and_closing_tags(self):
        html_files = [f for f in self.get_all_project_files(('.html',))]
        self.assertGreater(len(html_files), 18, "Expected at least 18 HTML files including compliance and blog pages")

        for hfile in html_files:
            rel_name = os.path.relpath(hfile, PROJECT_ROOT)
            with open(hfile, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            self.assertTrue(content.strip().lower().startswith('<!doctype html>'), f"{rel_name} missing <!DOCTYPE html>")
            self.assertIn('</html>', content.lower(), f"{rel_name} missing closing </html> tag")
            self.assertIn('</body>', content.lower(), f"{rel_name} missing closing </body> tag")


if __name__ == '__main__':
    unittest.main()

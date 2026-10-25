"""
Unit Test Suite: Backend Utilities & URL Security Sanitization
Target: server.js utility functions (cleanFbUrl, sanitizeFilename, Facebook URL extractors)
SQA Specification: ISO/IEC/IEEE 29119 Software Testing Standards
"""

import unittest
import re
import os

def clean_fb_url(raw_url):
    """Mirror of cleanFbUrl from server.js"""
    if not raw_url or not isinstance(raw_url, str):
        return None
    clean = raw_url.replace(r'\u0026', '&').replace(r'\u0025', '%').replace('\\', '').replace('&amp;', '&')
    clean = clean.split('u003C')[0].split('<')[0].strip()
    if not clean.startswith('http://') and not clean.startswith('https://'):
        return None
    return clean

def sanitize_filename(name, fallback='fb4kdownloader_video'):
    """Mirror of sanitizeFilename from server.js"""
    if not name or not isinstance(name, str):
        return f"{fallback}.mp4"
    safe = os.path.basename(name)
    safe = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', safe)
    safe = re.sub(r'_+', '_', safe).strip()
    if not safe or safe == '_':
        safe = fallback
    if not safe.lower().endswith('.mp4') and not safe.lower().endswith('.mp3'):
        safe += '.mp4'
    return safe

def extract_video_id(fb_url):
    """Mirror of video ID regex extractor from server.js"""
    if not fb_url or not isinstance(fb_url, str):
        return None
    m = re.search(r'(?:reel\/|videos\/|v=|v\/)(\d+)', fb_url)
    return m.group(1) if m else None


class TestServerUtils(unittest.TestCase):

    # -------------------------------------------------------------
    # 1. cleanFbUrl Unit Tests
    # -------------------------------------------------------------
    def test_clean_url_valid_https(self):
        url = "https://video.fbcdn.net/v/t42.17977-2/test.mp4?bytestart=0&byteend=1024"
        self.assertEqual(clean_fb_url(url), url)

    def test_clean_url_unescapes_backslashes(self):
        raw = r"https:\/\/video.fbcdn.net\/v\/test.mp4"
        expected = "https://video.fbcdn.net/v/test.mp4"
        self.assertEqual(clean_fb_url(raw), expected)

    def test_clean_url_unescapes_unicode_ampersand(self):
        raw = r"https://video.fbcdn.net/v/test.mp4?a=1\u0026b=2"
        expected = "https://video.fbcdn.net/v/test.mp4?a=1&b=2"
        self.assertEqual(clean_fb_url(raw), expected)

    def test_clean_url_unescapes_html_entities(self):
        raw = "https://video.fbcdn.net/v/test.mp4?a=1&amp;b=2"
        expected = "https://video.fbcdn.net/v/test.mp4?a=1&b=2"
        self.assertEqual(clean_fb_url(raw), expected)

    def test_clean_url_strips_trailing_html_tags(self):
        raw = "https://video.fbcdn.net/v/test.mp4<script>alert(1)</script>"
        expected = "https://video.fbcdn.net/v/test.mp4"
        self.assertEqual(clean_fb_url(raw), expected)

    def test_clean_url_strips_unicode_encoded_tags(self):
        raw = "https://video.fbcdn.net/v/test.mp4u003Cdiv>extra"
        expected = "https://video.fbcdn.net/v/test.mp4"
        self.assertEqual(clean_fb_url(raw), expected)

    def test_clean_url_rejects_malicious_protocols(self):
        self.assertIsNone(clean_fb_url("javascript:alert(1)"))
        self.assertIsNone(clean_fb_url("data:text/html,<script>"))
        self.assertIsNone(clean_fb_url("file:///etc/passwd"))
        self.assertIsNone(clean_fb_url("ftp://files.example.com"))

    def test_clean_url_handles_null_empty_and_types(self):
        self.assertIsNone(clean_fb_url(None))
        self.assertIsNone(clean_fb_url(""))
        self.assertIsNone(clean_fb_url("   "))
        self.assertIsNone(clean_fb_url(12345))
        self.assertIsNone(clean_fb_url({"url": "test"}))

    # -------------------------------------------------------------
    # 2. sanitizeFilename Unit Tests
    # -------------------------------------------------------------
    def test_sanitize_filename_standard(self):
        self.assertEqual(sanitize_filename("my_awesome_video.mp4"), "my_awesome_video.mp4")

    def test_sanitize_filename_preserves_mp3(self):
        self.assertEqual(sanitize_filename("audio_track.mp3"), "audio_track.mp3")

    def test_sanitize_filename_appends_mp4_extension(self):
        self.assertEqual(sanitize_filename("summer_vacation"), "summer_vacation.mp4")

    def test_sanitize_filename_prevents_directory_traversal(self):
        traversal = "../../../etc/passwd"
        sanitized = sanitize_filename(traversal)
        self.assertNotIn("..", sanitized)
        self.assertNotIn("/", sanitized)
        self.assertNotIn("\\", sanitized)
        self.assertTrue(sanitized.endswith(".mp4"))

    def test_sanitize_filename_removes_dangerous_special_chars(self):
        dangerous = 'video; rm -rf /; "><script>.mp4'
        sanitized = sanitize_filename(dangerous)
        self.assertNotIn(";", sanitized)
        self.assertNotIn("<", sanitized)
        self.assertNotIn(">", sanitized)
        self.assertNotIn('"', sanitized)
        self.assertTrue(sanitized.endswith(".mp4"))

    def test_sanitize_filename_null_or_empty_fallback(self):
        self.assertEqual(sanitize_filename(None), "fb4kdownloader_video.mp4")
        self.assertEqual(sanitize_filename(""), "fb4kdownloader_video.mp4")
        self.assertEqual(sanitize_filename("///"), "fb4kdownloader_video.mp4")
        self.assertEqual(sanitize_filename("???"), "fb4kdownloader_video.mp4")

    # -------------------------------------------------------------
    # 3. Facebook URL & Video ID Extraction Tests
    # -------------------------------------------------------------
    def test_extract_video_id_reel_desktop(self):
        url = "https://www.facebook.com/reel/123456789012345"
        self.assertEqual(extract_video_id(url), "123456789012345")

    def test_extract_video_id_reel_with_query_params(self):
        url = "https://www.facebook.com/reel/987654321098765?s=y_source&fbclid=IwAR123"
        self.assertEqual(extract_video_id(url), "987654321098765")

    def test_extract_video_id_watch_url(self):
        url = "https://www.facebook.com/watch/?v=112233445566778"
        self.assertEqual(extract_video_id(url), "112233445566778")

    def test_extract_video_id_page_videos_url(self):
        url = "https://www.facebook.com/pageName/videos/556677889900112/"
        self.assertEqual(extract_video_id(url), "556677889900112")

    def test_extract_video_id_mobile_url(self):
        url = "https://m.facebook.com/reel/334455667788990"
        self.assertEqual(extract_video_id(url), "334455667788990")

    def test_extract_video_id_invalid_url(self):
        self.assertIsNone(extract_video_id("https://www.google.com/search?q=facebook"))
        self.assertIsNone(extract_video_id("https://facebook.com/profile.php?id=1000"))
        self.assertIsNone(extract_video_id(""))
        self.assertIsNone(extract_video_id(None))


if __name__ == '__main__':
    unittest.main()

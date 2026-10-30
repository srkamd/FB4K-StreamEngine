"""
Unit & SQA Test Suite: Chrome Web Store Extension Specification & Security Audit
Target: extension/ directory and FB4KDownloader-v2.1.1.zip
SQA Specification: Google Chrome Web Store Developer Program Policies & MV3 Compliance
"""

import unittest
import json
import os
import re
import zipfile

EXTENSION_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'extension'))
ZIP_PATH = os.path.abspath(os.path.join(EXTENSION_DIR, 'FB4KDownloader-v2.1.1.zip'))

class TestChromeExtension(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        manifest_path = os.path.join(EXTENSION_DIR, 'manifest.json')
        with open(manifest_path, 'r', encoding='utf-8') as f:
            cls.manifest = json.load(f)

    # -------------------------------------------------------------
    # 1. Manifest V3 Schema & Metadata Compliance
    # -------------------------------------------------------------
    def test_manifest_version_is_3(self):
        self.assertEqual(self.manifest.get('manifest_version'), 3, "Extension must use Manifest V3")

    def test_version_format_semver(self):
        version = self.manifest.get('version', '')
        self.assertRegex(version, r'^\d+\.\d+\.\d+$', "Extension version must be a valid semver string (e.g. 2.1.1)")
        self.assertEqual(version, "2.1.1", "Expected version to match latest published 2.1.1")

    def test_description_length_within_webstore_limit(self):
        desc = self.manifest.get('description', '')
        self.assertTrue(len(desc) > 10, "Description must not be empty or too short")
        self.assertTrue(len(desc) <= 132, f"Description is {len(desc)} chars; Chrome Web Store strictly limits to 132 chars")

    def test_extension_name_present(self):
        name = self.manifest.get('name', '')
        self.assertIn("FB4KDownloader", name)

    # -------------------------------------------------------------
    # 2. Permissions & Security Audit (Least Privilege Enforced)
    # -------------------------------------------------------------
    def test_storage_permission_strictly_absent(self):
        permissions = self.manifest.get('permissions', [])
        self.assertNotIn('storage', permissions, "CRITICAL: 'storage' permission was rejected by CWS and MUST NOT be present")

    def test_only_authorized_permissions_present(self):
        permissions = self.manifest.get('permissions', [])
        expected_permissions = {'activeTab', 'downloads', 'webRequest'}
        self.assertEqual(set(permissions), expected_permissions, f"Unexpected permissions detected: {set(permissions) - expected_permissions}")

    def test_host_permissions_configured_properly(self):
        host_perms = self.manifest.get('host_permissions', [])
        self.assertIn('*://*.facebook.com/*', host_perms)
        self.assertIn('*://*.fbcdn.net/*', host_perms)

    # -------------------------------------------------------------
    # 3. Icon Assets Integrity (PNG Verification)
    # -------------------------------------------------------------
    def test_icons_declared_and_exist_on_disk(self):
        icons = self.manifest.get('icons', {})
        for size in ['16', '32', '48', '128']:
            self.assertIn(size, icons, f"Icon size {size} missing in manifest")
            icon_file = os.path.join(EXTENSION_DIR, icons[size])
            self.assertTrue(os.path.exists(icon_file), f"Icon file {icon_file} does not exist on disk")
            self.assertGreater(os.path.getsize(icon_file), 50, f"Icon file {icon_file} appears corrupted or empty")

            # Verify PNG binary magic number header (\x89PNG\r\n\x1a\n)
            with open(icon_file, 'rb') as f:
                header = f.read(8)
                self.assertEqual(header, b'\x89PNG\r\n\x1a\n', f"{icon_file} is not a valid PNG binary file")

    # -------------------------------------------------------------
    # 4. Content Scripts & Service Worker Integrity
    # -------------------------------------------------------------
    def test_background_service_worker_present(self):
        bg = self.manifest.get('background', {})
        sw = bg.get('service_worker')
        self.assertIsNotNone(sw, "Service worker must be declared in Manifest V3")
        sw_path = os.path.join(EXTENSION_DIR, sw)
        self.assertTrue(os.path.exists(sw_path), f"Service worker {sw_path} missing")

    def test_content_scripts_configured_and_exist(self):
        cs_list = self.manifest.get('content_scripts', [])
        self.assertGreater(len(cs_list), 0, "No content scripts declared")
        cs = cs_list[0]
        self.assertIn('*://*.facebook.com/*', cs.get('matches', []))

        for script in cs.get('js', []):
            script_path = os.path.join(EXTENSION_DIR, script)
            self.assertTrue(os.path.exists(script_path), f"Content script {script_path} not found")

        for style in cs.get('css', []):
            style_path = os.path.join(EXTENSION_DIR, style)
            self.assertTrue(os.path.exists(style_path), f"Content stylesheet {style_path} not found")

    def test_content_js_has_context_invalidation_guard(self):
        content_js_path = os.path.join(EXTENSION_DIR, 'content.js')
        with open(content_js_path, 'r', encoding='utf-8', errors='ignore') as f:
            code = f.read()
        self.assertIn("chrome.runtime.id", code, "content.js must check chrome.runtime.id to guard against invalidation")
        self.assertIn("isExtensionValid", code, "content.js must contain isExtensionValid guard function")

    # -------------------------------------------------------------
    # 5. Ready-to-Upload ZIP Package Verification
    # -------------------------------------------------------------
    def test_zip_package_exists_and_valid(self):
        if not os.path.exists(ZIP_PATH):
            self.skipTest("ZIP package not yet built on disk")
        
        with zipfile.ZipFile(ZIP_PATH, 'r') as zf:
            file_list = zf.namelist()
            self.assertIn("manifest.json", file_list, "ZIP package must contain root manifest.json")
            self.assertIn("background.js", file_list, "ZIP package must contain background.js")
            self.assertIn("content.js", file_list, "ZIP package must contain content.js")
            self.assertIn("icon128.png", file_list, "ZIP package must contain icon128.png")

            # Ensure no nested root directory or python scripts
            for fname in file_list:
                self.assertFalse(fname.endswith('.py'), f"ZIP should not bundle python helper scripts: {fname}")
                self.assertFalse(fname.startswith('extension/'), "ZIP files must be at root level, not nested in extension/")


if __name__ == '__main__':
    unittest.main()

import os
import unittest
import xml.etree.ElementTree as ET

class TestAndroidApp(unittest.TestCase):
    def setUp(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.android_dir = os.path.join(self.base_dir, 'android_app')
        self.app_dir = os.path.join(self.android_dir, 'app')
        self.src_dir = os.path.join(self.app_dir, 'src', 'main')

    def test_android_manifest_valid_and_has_admob(self):
        manifest_path = os.path.join(self.src_dir, 'AndroidManifest.xml')
        self.assertTrue(os.path.exists(manifest_path), "AndroidManifest.xml must exist")
        
        # Verify valid XML
        tree = ET.parse(manifest_path)
        root = tree.getroot()
        
        # Verify package and permissions
        self.assertEqual(root.attrib.get('package'), 'com.fb4kdownloader.app')
        
        permissions = [elem.attrib.get('{http://schemas.android.com/apk/res/android}name') for elem in root.findall('uses-permission')]
        self.assertIn('android.permission.INTERNET', permissions)
        self.assertIn('android.permission.ACCESS_NETWORK_STATE', permissions)
        self.assertIn('android.permission.POST_NOTIFICATIONS', permissions)
        
        # Verify AdMob metadata
        app_tag = root.find('application')
        meta_tags = app_tag.findall('meta-data')
        admob_meta = any(m.attrib.get('{http://schemas.android.com/apk/res/android}name') == 'com.google.android.gms.ads.APPLICATION_ID' for m in meta_tags)
        self.assertTrue(admob_meta, "AdMob APPLICATION_ID metadata must be defined")

    def test_java_source_files_present(self):
        java_pkg_dir = os.path.join(self.src_dir, 'java', 'com', 'fb4kdownloader', 'app')
        expected_files = ['MainActivity.java', 'AdManager.java', 'AdConfig.java', 'WebAppInterface.java']
        for fname in expected_files:
            file_path = os.path.join(java_pkg_dir, fname)
            self.assertTrue(os.path.exists(file_path), f"{fname} must exist in Java package directory")

    def test_admob_sdk_in_build_gradle(self):
        build_gradle = os.path.join(self.app_dir, 'build.gradle')
        with open(build_gradle, 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn('com.google.android.gms:play-services-ads', content)
        self.assertIn('androidx.swiperefreshlayout:swiperefreshlayout', content)

    def test_mipmap_icons_exist(self):
        res_dir = os.path.join(self.src_dir, 'res')
        densities = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi']
        for d in densities:
            icon_path = os.path.join(res_dir, d, 'ic_launcher.png')
            self.assertTrue(os.path.exists(icon_path), f"App icon missing in {d}")

if __name__ == '__main__':
    unittest.main()

"""
FB4KDownloader Production Deployment Packager for Hostinger
Executes complete automated validation, cleans artifacts, and packages website.
"""

import os
import sys
import zipfile
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
WEBSITE_DIR = SCRIPT_DIR
TEST_SCRIPT = os.path.join(PROJECT_ROOT, "test", "run_all_tests.py")
OUTPUT_ZIP = os.path.join(WEBSITE_DIR, "fb4kdownloader-hostinger-deployment.zip")

print("=" * 60)
print("1. Running SQA & Verification Suite...")
print("=" * 60)
test_res = subprocess.run([sys.executable, TEST_SCRIPT], cwd=PROJECT_ROOT)
if test_res.returncode != 0:
    print("[ERROR] Test suite failed! Halting deployment build.")
    sys.exit(1)

print("\n" + "=" * 60)
print("2. Packaging website files for Hostinger...")
print("=" * 60)

if os.path.exists(OUTPUT_ZIP):
    try:
        os.remove(OUTPUT_ZIP)
    except Exception as e:
        print(f"Notice: Could not remove old zip: {e}")

file_count = 0
EXCLUDE_NAMES = {
    'fb4kdownloader-hostinger-deployment.zip',
    'package-lock.json',
    'build_website_deploy.py',
    '.git',
    '.github',
    'node_modules',
    '__pycache__'
}

with zipfile.ZipFile(OUTPUT_ZIP, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(WEBSITE_DIR):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_NAMES and not d.startswith('.')]
        for f in files:
            if f in EXCLUDE_NAMES or f.endswith('.pyc') or f.startswith('.'):
                if f != '.htaccess':  # Always keep .htaccess!
                    continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, WEBSITE_DIR)
            zipf.write(full_path, rel_path)
            file_count += 1

zip_size_mb = os.path.getsize(OUTPUT_ZIP) / (1024 * 1024)
print(f"[SUCCESS] Packaged {file_count} files into:")
print(f"          -> {OUTPUT_ZIP} ({zip_size_mb:.2f} MB)")
print("=" * 60)
print("Ready for upload to Hostinger File Manager (public_html)!")
print("=" * 60)

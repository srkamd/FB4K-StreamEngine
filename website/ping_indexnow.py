"""
IndexNow Automated Submission for FB4KDownloader.com
Submits all live URLs in sitemap.xml to Bing, Yandex, Seznam & IndexNow API.
"""

import os
import json
import urllib.request
import xml.etree.ElementTree as ET

HOST = "fb4kdownloader.com"
KEY = "e8b4f192a7c34d8591e2b6a9c7d0e4f2"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
SITEMAP_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sitemap.xml")

def get_sitemap_urls():
    tree = ET.parse(SITEMAP_PATH)
    root = tree.getroot()
    urls = []
    for loc in root.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
        urls.append(loc.text.strip())
    return urls

def ping_indexnow(urls):
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls
    }
    
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.indexnow.org/IndexNow",
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            print(f"[IndexNow] Status: {response.status} {response.reason}")
            print(f"[IndexNow] Successfully submitted {len(urls)} URLs for instant indexing!")
            return True
    except urllib.error.HTTPError as e:
        print(f"[IndexNow HTTP Error] Code {e.code}: {e.read().decode('utf-8', errors='ignore')}")
        return False
    except Exception as e:
        print(f"[IndexNow Error] {e}")
        return False

if __name__ == "__main__":
    urls = get_sitemap_urls()
    print(f"Loaded {len(urls)} URLs from sitemap.xml")
    ping_indexnow(urls)

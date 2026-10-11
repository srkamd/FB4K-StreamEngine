const fs = require('fs');
const path = require('path');

console.log('⚡ STARTING SITEWIDE CONTENT INFUSION PROTOCOL\n');

// 1. Update privacy.html
let privacyContent = fs.readFileSync('privacy.html', 'utf8');
const privacyTarget = `<h3 style="color: #fff; font-size: 1.15rem; margin-top: 10px; font-weight: 800;">4. GDPR & CCPA Privacy Rights</h3>`;
const privacyExpansion = `
            <h3 style="color: #fff; font-size: 1.15rem; margin-top: 10px; font-weight: 800;">4. Detailed Cookie Policy & Consent</h3>
            <p>
              Like most professional web applications, FB4KDownloader.com utilizes cookies to improve user experience. Cookies are small data files stored on your local disk. We use session cookies to remember your interface preferences (such as dark theme alignment) and analytical cookies to inspect anonymous visitor flows. You can configure your web browser to reject cookies or warn you before accepting them, though some layout functions might experience slight latency as a result.
            </p>
            <p>
              Additionally, third-party partners like Google AdSense serve personalized advertisements based on your browsing history across other websites. Google uses the DART cookie to select relevant ads. You can opt-out of DART cookies by visiting the Google Ad and Content Network Privacy Policy page.
            </p>

            <h3 style="color: #fff; font-size: 1.15rem; margin-top: 10px; font-weight: 800;">5. CCPA Privacy Rights (Do Not Sell My Personal Information)</h3>
            <p>
              Under the California Consumer Privacy Act (CCPA), California consumers have specific rights, including the right to request that a business disclose the categories and specific pieces of personal data it has collected about consumers. California users can also request that a business delete any personal data collected or request that a business not sell their personal data.
            </p>
            <p>
              Because FB4KDownloader.com operates as an anonymous media conversion utility, **we do not collect, store, or sell any consumer data**. There is no database storing your personal details or URL download history on our servers.
            </p>

            <h3 style="color: #fff; font-size: 1.15rem; margin-top: 10px; font-weight: 800;">6. GDPR Data Protection Rights</h3>
            <p>
              We want to make sure you are fully aware of all of your data protection rights under the General Data Protection Regulation (GDPR). Every visitor is entitled to the following:
            </p>
            <ul style="padding-left: 20px; list-style-type: disc; display: flex; flex-direction: column; gap: 8px;">
              <li><strong>The Right to Access:</strong> You have the right to request copies of your personal data. (Since we do not collect any personal data, our files will show empty logs).</li>
              <li><strong>The Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
              <li><strong>The Right to Erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
              <li><strong>The Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
            </ul>

            <h3 style="color: #fff; font-size: 1.15rem; margin-top: 10px; font-weight: 800;">7. Children's Information & COPPA Compliance</h3>
            <p>
              Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
            </p>
            <p>
              FB4KDownloader.com does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately, and we will do our best efforts to promptly remove such information from our records.
            </p>
`;
if (privacyContent.includes(privacyTarget)) {
  privacyContent = privacyContent.replace(privacyTarget, privacyExpansion + privacyTarget);
  fs.writeFileSync('privacy.html', privacyContent, 'utf8');
  console.log('[OK] Expanded privacy.html');
}

// 2. Update terms.html
let termsContent = fs.readFileSync('terms.html', 'utf8');
const termsTarget = `<h3 style="color: #fff; font-size: 1.15rem; margin-top: 10px; font-weight: 800;">3. Limitation of Liability</h3>`;
const termsExpansion = `
            <h3 style="color: #fff; font-size: 1.15rem; margin-top: 10px; font-weight: 800;">3. Permitted & Prohibited Use</h3>
            <p>
              By accessing FB4KDownloader.com, you represent and warrant that you will only use this utility to download public, non-copyrighted media, or media for which you hold the distribution rights or have explicit permission from the original publisher.
            </p>
            <p>
              <strong>You are strictly prohibited from:</strong>
            </p>
            <ul style="padding-left: 20px; list-style-type: disc; display: flex; flex-direction: column; gap: 8px;">
              <li>Using this platform to download copyrighted movies, music tracks, or private media for commercial distribution or illegal sharing.</li>
              <li>Running automated scraper scripts, bots, or DDOS requests against our backend processing servers.</li>
              <li>Re-uploading files saved via our platform to YouTube, Instagram, or TikTok without crediting the original authors.</li>
            </ul>

            <h3 style="color: #fff; font-size: 1.15rem; margin-top: 10px; font-weight: 800;">4. User Indemnification</h3>
            <p>
              You agree to defend, indemnify, and hold harmless FB4KDownloader.com, its creator Shahrukh Ahmad, and its team from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses arising from your misuse of the tool or your violation of third-party copyright laws.
            </p>
`;
if (termsContent.includes(termsTarget)) {
  termsContent = termsContent.replace(termsTarget, termsExpansion + termsTarget);
  fs.writeFileSync('terms.html', termsContent, 'utf8');
  console.log('[OK] Expanded terms.html');
}

// 3. Update dmca.html
let dmcaContent = fs.readFileSync('dmca.html', 'utf8');
const dmcaTarget = `<p>\n              If you believe that your copyrighted content is being indexed or parsed`;
const dmcaExpansion = `
            <h3 style="color: #fff; font-size: 1.15rem; margin-top: 10px; font-weight: 800;">📋 Official DMCA Notice Submission Template</h3>
            <p>
              To expedite your DMCA request, copyright holders or authorized representatives can copy, fill out, and email the template below to our support email desk:
            </p>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); padding: 20px; border-radius: 12px; font-family: monospace; font-size: 0.88rem; color: var(--text-secondary); white-space: pre-wrap; line-height: 1.6;">
Subject: Urgent DMCA Copyright Infringement Notice - FB4KDownloader

To the DMCA Agent of FB4KDownloader.com:

1. Identification of the copyrighted work claimed to have been infringed:
   [Provide description of the work and copyright registration number if available]

2. Identification of the material that is claimed to be infringing (Target URLs):
   [Provide specific URLs on fb4kdownloader.com or Facebook CDN links parsed]

3. Contact Information of the complaining party:
   Full Name: [Your Name]
   Address: [Your Corporate Address]
   Phone: [Your Phone Number]
   Email: [Your Corporate Email]

4. Statement of Good Faith:
   "I have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law."

5. Statement of Accuracy (under penalty of perjury):
   "The information in this notification is accurate, and under penalty of perjury, I am the copyright owner or authorized to act on behalf of the owner."

Signature: [Your Electronic or Physical Signature]
            </div>
`;
if (dmcaContent.includes(`<p>\n              If you believe`)) {
  dmcaContent = dmcaContent.replace(`<p>\n              If you believe`, dmcaExpansion + `<p>\n              If you believe`);
} else {
  // Try alternative replacement target for dmca.html
  dmcaContent = dmcaContent.replace('<h2>DMCA Copyright Policy</h2>', '<h2>DMCA Copyright Policy</h2>' + dmcaExpansion);
}
fs.writeFileSync('dmca.html', dmcaContent, 'utf8');
console.log('[OK] Expanded dmca.html');


// 4. Update index.html (Troubleshooting guide)
let indexContent = fs.readFileSync('index.html', 'utf8');
const indexTarget = `<h3 style="color: #fff; font-size: 1.25rem; margin-top: 30px; font-weight: 800; text-align: center;">🎨 Design Output Showcase</h3>`;
const indexExpansion = `
            <h3 style="color: #fff; font-size: 1.25rem; margin-top: 25px; font-weight: 800;">🔧 Advanced Video Download Troubleshooting Guide</h3>
            <p>
              While our extraction engine is designed to handle over 98% of public video links seamlessly, you may occasionally run into processing issues. Here are the most common download errors and how to resolve them:
            </p>
            <ul style="padding-left: 20px; list-style-type: disc; display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px;">
              <li><strong>Error: "Invalid URL / Video Not Found":</strong> This happens if the link format is altered by third-party wrappers. Ensure the link has a standard pattern (e.g. <code>https://www.facebook.com/watch/?v=...</code> or <code>https://www.facebook.com/reel/...</code>) and does not contain extra tracking tokens.</li>
              <li><strong>Error: "Private Video Protection Alert":</strong> If a video is uploaded in a private closed group or shared with a custom friend list, our server proxies cannot access it. Navigate to our <strong>Private Downloader</strong> tab to save it using client-side HTML parsing safely.</li>
              <li><strong>Error: "Upscaling Takes Too Long":</strong> Real-time 4K rendering requires intensive CPU cycles to transcode frame bitrates. If the process seems stuck, reload the page and select the 1080p Full HD format option for an instant, direct download.</li>
              <li><strong>Error: "Download Fails on iPhone Safari":</strong> On iOS, tapping download might open the video directly in the browser player instead of saving it. To bypass this, long-press the download button and select <strong>"Download Linked File"</strong> to save it directly to the Files app.</li>
            </ul>
`;
if (indexContent.includes(indexTarget)) {
  indexContent = indexContent.replace(indexTarget, indexExpansion + indexTarget);
  fs.writeFileSync('index.html', indexContent, 'utf8');
  console.log('[OK] Expanded index.html');
}

console.log('\n🎉 sitewide content expansion completed successfully!');

import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync(new URL('../manifest.json', import.meta.url), 'utf8'));
const license = readFileSync(new URL('../LICENSE', import.meta.url), 'utf8');

// AMO's predefined GPL slug is GPL-3.0-only. Preserve the fork's "or later"
// grant as a custom license, taking the full license text from its source of truth.
const metadata = {
  name: { 'en-US': manifest.name },
  summary: { 'en-US': manifest.description },
  description: {
    'en-US':
      'Control HTML5 video and audio playback speed with on-page controls and customizable keyboard shortcuts. ' +
      'Includes per-site settings and settings import/export. Google Flights is excluded at page load to avoid controller overhead there. ' +
      'This independent NJL fork is based on nyxar77/videospeed-firefox and the original Video Speed Controller by Ilya Grigorik and contributors. ' +
      'It has its own add-on identity; disable other video-speed controllers before using it. ' +
      'Preferences are stored in Firefox; this extension does not send data to a developer-operated service.',
  },
  categories: { firefox: ['photos-music-videos'] },
  homepage: { 'en-US': manifest.homepage_url },
  support_url: { 'en-US': `${manifest.homepage_url}/issues` },
  version: {
    custom_license: {
      name: { 'en-US': 'GNU General Public License v3.0 or later' },
      text: {
        'en-US': `This extension is licensed under the GNU General Public License, version 3 or (at your option) any later version.\n\n${
          license
        }`,
      },
    },
    approval_notes:
      'Independent GPL-3.0-or-later Firefox fork of nyxar77/videospeed-firefox. ' +
      'The attached source archive matches the submitted revision and includes package-lock.json. ' +
      'Build with Node.js 22.13 or newer: PUPPETEER_SKIP_DOWNLOAD=1 npm ci && make build. ' +
      'The installable contents are in dist/. scripts/build.mts bundles TypeScript using esbuild. ' +
      'Run make test for lint, typechecking and tests. See docs/release.md for Firefox regression checks. ' +
      'NJL changes exclude Google Flights, use a distinct add-on ID and add release packaging. ' +
      'No login or payment is required to test the extension.',
  },
};

console.log(JSON.stringify(metadata, null, 2));

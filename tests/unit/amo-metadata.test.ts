import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

it('provides public listing metadata without narrowing the GPL or-later license', () => {
  const metadata = JSON.parse(
    execFileSync(process.execPath, ['scripts/amo-metadata.ts'], {
      encoding: 'utf8',
    })
  );
  const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));
  const license = readFileSync('LICENSE', 'utf8');

  expect(metadata.name['en-US']).toBe(manifest.name);
  expect(metadata.summary['en-US']).toBe(manifest.description);
  expect(metadata.categories.firefox).toEqual(['photos-music-videos']);
  expect(metadata.version).not.toHaveProperty('license');
  expect(metadata.version.custom_license.name['en-US']).toBe(
    'GNU General Public License v3.0 or later'
  );
  expect(metadata.version.custom_license.text['en-US']).toContain('any later version');
  expect(metadata.version.custom_license.text['en-US']).toContain(license);
  expect(metadata.version.approval_notes).toContain('make build');
});

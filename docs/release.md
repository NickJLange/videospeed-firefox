# Release runbook

## Validate and build

Use Node.js 22.13+ and npm. `package.json` is the version source of truth; keep the root
`manifest.json` version in sync. The build copies that version into `dist/manifest.json`.

```sh
npm ci
make test
make clean && make build
node tests/e2e/validate-extension.ts
nix develop --command web-ext lint --source-dir=dist
npx puppeteer browsers install firefox
npm run test:firefox -- release/videospeed-*.xpi
```

Without Nix, install `web-ext` and run `web-ext lint --source-dir=dist` directly.
The Firefox regression test installs the actual package in a disposable profile and serves
local fixtures at intercepted URLs: Flights must have no controller runtime, while ordinary
pages must retain their controls and speed shortcuts. It does not benchmark the live Google UI.
The inherited `test:e2e` runner targets Chrome; `test:firefox` is the Firefox regression gate.

`make build` produces `release/videospeed-<version>.xpi`. It reuses the existing esbuild
and archive scripts, includes only `dist/`, and does not package development dependencies,
credentials, source maps, or the Git checkout. `npm run release` remains available and runs
the unit/integration tests before building the XPI.

For local testing, disable other video-speed extensions, open `about:debugging`, and load
`dist/manifest.json` as a temporary add-on. Temporary installation does not survive restart.

## Publish a GitHub release

Only run these commands when a release is intended:

```sh
npm version patch --no-git-tag-version
# Update manifest.json to match package.json, then run the checks above.
git add package.json package-lock.json manifest.json
git commit -m "Bump extension version"
git tag "v$(node -p "require('./package.json').version")"
git push origin master
git push origin "v$(node -p "require('./package.json').version")"
```

The CI workflow validates the tag/version, runs the checks, and attaches the unsigned XPI
and `videospeed-source.zip` to a GitHub release. The source archive comes from the exact
tagged commit, includes the lockfile and build instructions, and accompanies the GPL binary.
Ordinary branch pushes and pull requests only upload CI artifacts; they do not publish releases.

To archive corresponding source locally, first commit all build inputs, then run:

```sh
git archive --format=zip --output=release/videospeed-source.zip HEAD
```

Do not distribute an XPI with a source archive from a different revision.

## Sign with Mozilla

This fork uses a distinct ID (`videospeed-firefox@njl.dev`), not either upstream's AMO identity.
The first submission must register a new add-on. Settings do not automatically migrate from
another add-on ID. Keep the version monotonic: Mozilla rejects previously submitted versions.

1. Submit the XPI at the [AMO Developer Hub](https://addons.mozilla.org/developers/).
2. Choose **unlisted/self-distributed** for a personal permanent fork, or **listed** for an
   intentional public AMO listing.
3. Supply `videospeed-source.zip` and the build instructions. The JavaScript is bundled and
   minified, so reviewers need the corresponding source.
4. Download the signed XPI. Install it in ordinary Firefox and recheck a video page and Flights.
5. Attach the signed XPI to the GitHub release if distributing it there; clearly distinguish
   it from the unsigned build.

After the initial registration, signing can be automated explicitly, using credentials from
a secret manager (never commit credentials):

```sh
web-ext sign --source-dir=dist --channel=unlisted \
  --upload-source-code=release/videospeed-source.zip \
  --api-key="$AMO_API_KEY" --api-secret="$AMO_API_SECRET"
```

Unlike the tab-group extension's existing workflow, this workflow deliberately does not
submit to AMO on every tag. GitHub release publishing and Mozilla submission are separate steps.

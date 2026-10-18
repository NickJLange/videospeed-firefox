<div align="center">
  <img src="src/assets/icons/videospeed-logo.png" alt="Video Speed Controller logo" width="180">
  <h1>Video Speed Controller for Firefox</h1>
  <p>Control video and audio at your own pace.</p>
</div>

Video Speed Controller adds a small controller to videos and audio in Firefox. Change the
playback speed from the page, the extension popup, or your keyboard.

## NJL permanent fork

This fork uses [nyxar77/videospeed-firefox](https://github.com/nyxar77/videospeed-firefox)
as its base rather than the unmaintained codebicycle version. It retains the Firefox-first
runtime, batched DOM observation, settings import/export, and test suite. Firefox 140+
(Android 142+) is required. The GPL-3.0-or-later license and upstream attribution are preserved.

**Google Flights documents are excluded at load time.** Firefox does not inject either content script or
the controller stylesheet at `flights.google.com`, `*.google.com/travel/flights`, or `*.google.com/flights`
(including queries and subpaths). This prevents controller DOM observation on those pages,
independent of saved preferences. Other Google pages remain enabled. This is a compatibility
exclusion, not a claim that the observer is now fast enough on every application.
The exclusion applies when a document loads; same-document navigation from an enabled Google
page and third-party frames with their own URLs are not covered by these match patterns.
The legacy `/flights` exclusion preserves the useful part of the
[earlier NJL fork's fix](https://github.com/NickJLange/videospeed/pull/1), without disabling all Travel pages.

The fork has its own add-on ID, `videospeed-firefox@njl.dev`. Disable the old controller
before testing: installing this fork does not replace it or stop its observers. Settings
are separate; compatible settings can be imported through the options page.

Build an unsigned XPI with `npm ci && make build`. See [PUBLISHING.md](PUBLISHING.md)
for tests, tag-triggered GitHub releases, Mozilla signing, and corresponding source.

## Features and perks

**Playback controls**

Speed up, slow down, rewind, skip ahead, mute, or return to your preferred speed without
digging through a player menu. The controller can be moved anywhere on the page or hidden when
you do not need it.

**Keyboard shortcuts**

Control playback without leaving the video. Every shortcut can be changed, including shortcuts
with modifier keys.

**Preferences for each site**

Choose a default speed for a website or disable the extension where you do not want it. The
extension can also remember your last playback speed across pages and browser sessions.

**Appearance**

Use the standard controller, choose a Catppuccin theme, select an accent color, or provide your
own controller style.

**Settings backup**

Export your settings to a file and import them later. An import is shown for review before it is
saved, so it does not silently replace your current setup.

**Time saved**

See how much listening or viewing time you have saved by using faster playback.

## Privacy

The extension does not collect personal data. Your preferences and playback information stay in
Firefox storage. Read the full [privacy policy](PRIVACY.md) for details.

## Help and project information

If something is broken, open an [issue](https://github.com/NickJLange/videospeed-firefox/issues).
There are separate forms for general bugs, requests, and problems that happen on a particular
website.

Instructions for working with the source are in [building from source](docs/building.md). Release
maintainers can also read the [release process](docs/release.md).

## Credits

Video Speed Controller was created by
[Ilya Grigorik](https://github.com/igrigorik) with contributions from the community. This project
is based on [nyxar77's Firefox port](https://github.com/nyxar77/videospeed-firefox) of the original
[Video Speed Controller](https://github.com/igrigorik/videospeed). NJL-specific changes are
maintained independently; upstream contribution is not required for this fork.

## License

This project is licensed under the GNU General Public License version 3 or later. See
[LICENSE](LICENSE) for the full license text.

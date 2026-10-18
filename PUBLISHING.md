# Publishing

The [release runbook](docs/release.md) is the source of truth for building the XPI,
publishing a GitHub release, and submitting it to Mozilla. Like the Group Same Site Tabs
extension, this fork uses `make clean && make build` and `v*` release tags.

GitHub artifacts are **unsigned**. A normal Firefox installation requires Mozilla signing;
uploading an XPI to GitHub does not sign it. No AMO publishing is performed automatically.

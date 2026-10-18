# Publishing

The [release runbook](docs/release.md) is the source of truth for building the XPI,
publishing a GitHub release, and submitting it to Mozilla. Like the Group Same Site Tabs
extension, this fork uses `make clean && make build` and `v*` release tags.

Local builds and the CI build artifact are **unsigned**. The public AMO submission job
requires the `AMO_API_KEY` environment; configure its required reviewer and account credentials
before publishing. A release tag requests submission, while ordinary branch pushes never do.
The workflow also supports an explicit first submission from **Run workflow** on `master`.
GitHub releases contain a signed XPI only after Mozilla approval; a timeout is not a rollback.

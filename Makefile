.PHONY: build test clean

# The existing packager includes only dist/, never the checkout or dependencies.
build:
	npm run build:release
	node scripts/package-release.ts

test:
	npm run lint
	npm run typecheck
	npm test

clean:
	npm run clean

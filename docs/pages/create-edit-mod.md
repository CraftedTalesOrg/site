# Create/Edit Mod

Form for creating and editing a `Mod` including metadata, media, and versions.

## Goals
- Simple, guided creation flow with validation
- Safe edits with draft preview
- Version upload with automatic metadata validation

## Access
- Authenticated users only
- Rate limited to prevent abuse

## Form Sections

### Basic Info
- Name: string, required, 3–80 chars
- Slug: generated from name; editable before first publish; unique
- Summary: string, required, 20–160 chars, short description
- Description: Markdown, required, supports headings, links, code blocks
- Categories: `Category[]`, required, 1–3 categories
- License: select (SPDX list + “Custom”); required
- Status: Draft | Published
- Visibility: Public | Unlisted | Private (private: only owner can see)

### Media
- Logo: image (PNG/JPG/WebP), max 2MB, 512x512 recommended
- Gallery: 0–10 images (PNG/JPG/WebP), each max 4MB, 1280x720+ recommended
- Ordering: drag to reorder; first image shown as cover in listings

### Versions
- Upload file: required for new version (ZIP)
- Detected metadata: file size, checksum, optional manifest
- Game Version: string, required (e.g., 1.0.0)
- Channel: Release | Beta | Alpha
- Changelog: Markdown, optional but recommended
- Validation: semver name; required unique per mod

### Dependencies
- Add/remove dependencies: `Dependency[]` with `versionRange`
- Resolve conflicts visually; warn on unsatisfied ranges

### Publishing
- Draft preview: shareable preview link (auth required)
- Publish: requires at least one version and one category
- Post-publish edits: name/slug locked; summary/description/media editable

## API
- Create: `POST /api/mods`
- Update: `PATCH /api/mods/{id}`
- Upload Version: `POST /api/mods/{id}/versions`
- Upload Media: `POST /api/mods/{id}/media`

## Validation
- All text inputs trimmed; disallow only-whitespace
- Markdown sanitized server-side; allow basic HTML where safe
- Images scanned (content-type, size) and optimized

## Error States
- 400: validation errors (field-level messages)
- 401/403: authentication/authorization
- 413: payload too large (files)
- 409: slug/version conflict
- 500: upload/storage failure

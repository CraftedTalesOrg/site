# Version Model

A downloadable release of a mod.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| name | String | Version number following semantic versioning (e.g., "1.2.0", "2.0.0-beta.1") |
| gameVersion | String | Compatible game version |
| channel | String | Release channel (release, beta, alpha) |
| publishedAt | Date | Release date |
| downloads | Number | Download count for this version |
| url | String | Download URL |
| size | Number | File size in bytes |
| changelog | String | Markdown changelog content describing changes in this version |

## Version Naming

Versions **must** follow [Semantic Versioning](https://semver.org/) (semver) format to enable dependency range matching:

| Format | Example | Description |
|--------|---------|-------------|
| `MAJOR.MINOR.PATCH` | `1.2.3` | Standard release version |
| `MAJOR.MINOR.PATCH-prerelease` | `2.0.0-beta.1` | Pre-release version |
| `MAJOR.MINOR.PATCH+build` | `1.0.0+20130313` | Build metadata |

### Validation Rules

- Must match semver pattern: `^(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z-]+)?(\+[0-9A-Za-z-]+)?$`
- Must be unique per mod
- Must be parseable for dependency version range matching

### Version Comparison

This enables dependency `versionRange` constraints to work properly:
- `>=1.0.0` matches `1.0.0`, `1.2.5`, `2.0.0` but not `0.9.0`
- `^2.1.0` matches `2.1.0`, `2.5.3` but not `3.0.0` or `2.0.9`
- `1.x` matches `1.0.0`, `1.9.9` but not `2.0.0`

## Usage

- Versions tab on mod detail page
- Changelog tab on mod detail page (uses `changelog` field)
- Download links
- Version compatibility information
- Dependency resolution and validation
- Filterable by channel and game version

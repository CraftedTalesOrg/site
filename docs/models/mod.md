# Mod Model

The primary entity representing a game modification.

## Core Fields

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| slug | String | URL-friendly identifier |
| name | String | Display name |
| icon | String | Icon/thumbnail URL |
| summary | String | Short text description (plain text only) |
| description | String | Full markdown description |
| status | Enum | `draft` \| `published` |
| visibility | Enum | `public` \| `unlisted` \| `private` |
| categories | Category[] | Required categories (1–3, many-to-many relation) |
| license | String | License type (MIT, GPL, etc.) |
| licenseUrl | String? | Optional link to full license text |

## External Links

Optional links to external resources:

| Field | Type | Description |
|-------|------|-------------|
| issueTrackerUrl | String? | Bug reports and issues (e.g., GitHub Issues) |
| sourceCodeUrl | String? | Source code repository (e.g., GitHub repo) |
| wikiUrl | String? | Documentation and help wiki |
| discordInviteUrl | String? | Discord server invitation link |
| donationUrls | String[]? | List of donation/support links (Patreon, Ko-fi, etc.) |

## Metadata

| Field | Type | Description |
|-------|------|-------------|
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |
| downloads | Number | Total download count |
| likes | Number | Total like count |
| versionCompatibility | String[] | Supported game versions |

## Relationships

| Field | Type | Description |
|-------|------|-------------|
| owner | User | Mod owner (creator) |
| authors | User[] | Contributors (currently only includes owner) |
| versions | Version[] | Downloadable releases (relation defined separately) |
| dependencies | Dependency[] | Required/optional mod dependencies |

### Dependencies

Dependency relationships will need to define:
- **Required dependencies**: Mods that must be installed for this mod to work
- **Optional dependencies**: Mods that enhance functionality but aren't required
- **Incompatibilities**: Mods that conflict with this one
- **Version constraints**: Specific version requirements for dependencies

> **Note**: Dependencies implementation details to be defined in [dependency.md](./dependency.md)

## Usage

Used across:
- Mods list page (as ModCard view model)
- Mod detail page (as ModDetail view model)
- API responses

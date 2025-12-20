# Mod Detail Page

## Overview

The detail page displays comprehensive information about a single mod, including its description, changelog, versions, and download options.

## URL

```
/mods/{mod-slug}
```

## Layout

### Header Section

Displays core mod information.

#### Data Structure

| Field | Source | Notes |
|-------|--------|-------|
| icon | `Mod.icon` | Large mod icon/banner |
| name | `Mod.name` | Mod title |
| owner | `Mod.owner` | Primary author/creator |
| authors | `Mod.authors` | All contributors (currently same as owner) |
| summary | `Mod.summary` | Short text description |
| categories | `Mod.categories` | Category badges |
| updatedAt | `Mod.updatedAt` | Last update date |
| likes | `Mod.likes` | Like count |
| downloads | `Mod.downloads` | Total download count |
| versionCompatibility | `Mod.versionCompatibility` | Supported game versions |
| license | `Mod.license` | License type |
| licenseUrl | `Mod.licenseUrl` | Link to full license (if available) |

### Action Buttons

| Button | Action | Notes |
|--------|--------|-------|
| ❤️ Like | Toggle like on mod | Requires authentication |
| ⚠️ Report | Open report modal | Requires authentication |
| ⬇️ Download | Download latest version | Direct download |
| 🛒 Add to Cart | Add to shopping cart | Bundled ZIP download at checkout |

```
┌─────────────────────────────────────────────────────────────┐
│  [ICON]   Mod Name                                          │
│           by Author1, Author2, Author3                      │
│           Short description of the mod                      │
│                                                             │
│           [Adventure] [Magic]                               │
│           Compatible: 1.0.0, 1.1.0, 1.2.0                   │
│           License: MIT                                      │
│                                                             │
│           ♥ 1,234    ↓ 45,678    📅 Updated 2 days ago      │
│                                                             │
│  [❤️ Like] [⚠️ Report]   [⬇️ Download] [🛒 Cart]            │
└─────────────────────────────────────────────────────────────┘
```

---

## Tabs

### Tab 1: Description

Full markdown description of the mod.

#### Data Structure

| Field | Source | Notes |
|-------|--------|-------|
| description | `Mod.description` | Full mod documentation, features, usage |

Supports:
- Markdown formatting
- Images/GIFs
- Code blocks
- Links
- Embedded videos (optional)

---

### Tab 2: Changelog

Paginated list of releases (Versions) with their changelog content. Data is sourced from the `Version` model's `changelog` field.

#### Filters

| Filter | Type | Options |
|--------|------|---------|
| Channel | Select | User-defined (e.g., Release, Beta, Alpha) |
| Game Version | Select | Filter by compatible version |

#### Changelog Item

Data from [Version model](../models/version.md):

| Field | Type | Description |
|-------|------|-------------|
| name | String | Version number (semver) |
| publishedAt | Date | Release date |
| channel | String | Release channel (release, beta, alpha) |
| gameVersion | String | Compatible game version |
| changelog | String | Markdown changes in this version |

#### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Filters: [Channel ▼] [Game Version ▼]                       │
├─────────────────────────────────────────────────────────────┤
│ v2.1.0 - Release                           December 1, 2025 │
│ ─────────────────────────────────────────────────────────── │
│ • Added new feature X                                       │
│ • Fixed bug with Y                                          │
│ • Improved performance of Z                                 │
├─────────────────────────────────────────────────────────────┤
│ v2.0.0 - Release                          November 15, 2025 │
│ ─────────────────────────────────────────────────────────── │
│ • Major rewrite                                             │
│ • Breaking changes...                                       │
├─────────────────────────────────────────────────────────────┤
│                    [1] [2] [3] ... [Next]                   │
└─────────────────────────────────────────────────────────────┘
```

#### Pagination

Changelog can be very large, so pagination is required:

| Control | Description |
|---------|-------------|
| Items per page | Configurable (10, 25, 50) |
| Navigation | Page numbers, prev/next |

---

### Tab 3: Versions

Downloadable version list with details.

### Version Entry

Data from [Version model](../models/version.md):

| Field | Type | Description |
|-------|------|-------------|
| name | String | Version number (semver format) |
| gameVersion | String | Compatible game version |
| publishedAt | Date | Release date |
| downloads | Number | Download count for this version |
| channel | String | Release channel |
| url | String | Download URL |
| size | Number | File size in bytes |

#### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Name          Game Version    Published       Downloads     │
├─────────────────────────────────────────────────────────────┤
│ v2.1.0        1.2.0           Dec 1, 2025     12,345   [⬇️] │
│ v2.0.0        1.2.0           Nov 15, 2025    34,567   [⬇️] │
│ v1.5.0        1.1.0           Oct 1, 2025     56,789   [⬇️] │
│ v1.4.0        1.0.0           Sep 1, 2025     78,901   [⬇️] │
├─────────────────────────────────────────────────────────────┤
│                    [1] [2] [3] ... [Next]                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Dependencies Section

Displayed below tabs if the mod has dependencies.

Data from [Dependency model](../models/dependency.md):

| Field | Type | Description |
|-------|------|-------------|
| modName | String | Required mod name (link to detail page) |
| modSlug | String | Used for navigation link |
| versionRange | String | Version constraint (e.g., `>=1.0.0`, `^2.1.0`) |
| type | Enum | `required` \| `optional` \| `recommended` \| `incompatible` |

```
┌─────────────────────────────────────────────────────────────┐
│ Dependencies                                                │
├─────────────────────────────────────────────────────────────┤
│ • Core Library >=1.0.0 (Required)                           │
│ • Graphics Enhancer ^2.0.0 (Optional)                       │
│ • Sound Pack ~1.5.0 (Recommended)                           │
│ • Old Mod * (Incompatible)                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Query Parameters

| Parameter | Type | Tab | Description |
|-----------|------|-----|-------------|
| `tab` | String | - | Active tab (description, changelog, versions) |
| `channel` | String | Changelog | Channel filter (when tab=changelog) |
| `gameVersion` | String | Changelog | Game version filter (when tab=changelog) |
| `page` | Number | Changelog/Versions | Page number for the active tab (if paginated) |

---

## User Stories

- As a user, I want to read the full description to understand what the mod does
- As a user, I want to see all authors who contributed
- As a user, I want to check version compatibility before downloading
- As a user, I want to like mods I enjoy
- As a user, I want to add mods to my cart and download a single bundled ZIP
- As a user, I want to report problematic content
- As a user, I want to view the changelog to see what changed
- As a user, I want to filter changelog by channel (release/beta/alpha)
- As a user, I want to download a specific version
- As a user, I want to see what dependencies are required
- As a user, I want to add paid mods to my cart

---

## API Requirements

### Get Mod Detail

```typescript
GET /api/mods/{slug}

// Response
{
  id: string,
  slug: string,
  name: string,
  icon: string,
  summary: string,
  description: string,
  authors: User[],
  categories: Category[],
  license: string,
  versionCompatibility: string[],
  likes: number,
  downloads: number,
  createdAt: string,
  updatedAt: string,
  dependencies: Dependency[],
  latestVersion: Version
}
```

### Get Versions (with changelog)

```typescript
GET /api/mods/{slug}/versions
  ?page=number
  &count=number
  &channel=string
  &gameVersion=string

// Response
{
  data: Version[],
  pagination: { ... }
}
```

### Actions

```typescript
POST /api/mods/{slug}/like      // Toggle like
POST /api/mods/{slug}/report    // Submit report
GET  /api/mods/{slug}/download/{version}  // Download version
POST /api/cart                  // Add to shopping cart
```

---

## Navigation

| Action | Destination |
|--------|-------------|
| Back to List | `/mods` (preserve previous filters) |
| Author Click | `/users/{author-slug}` |
| Dependency Click | `/mods/{dependency-slug}` |
| Category Click | `/mods?categories={category}` |

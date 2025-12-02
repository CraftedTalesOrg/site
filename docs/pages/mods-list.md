# Mods List Page

## Overview

A paginated, filterable list of mods with multiple view options. This is the primary discovery interface for users browsing the mod catalog.

## URL

```
/mods
```

## Features

### Search

| Component | Description |
|-----------|-------------|
| Search Bar | Text input for searching mods by name, description, categories, or author |

### Sorting

| Option | Key | Description |
|--------|-----|-------------|
| Relevance | `relevance` | Best match (default when searching) |
| Downloads | `downloads` | Most downloaded first |
| Likes | `likes` | Most liked first |
| Date Published | `published` | Newest first |
| Date Updated | `updated` | Recently updated first |

### Filters

#### Categories

Multi-select filter for mod categories:

| Category | Key |
|----------|-----|
| Adventure | `adventure` |
| Decoration | `decoration` |
| Magic | `magic` |
| Tech | `tech` |
| *...more to be added* | |

#### Game Version

Filter by compatible game version:

| Example Versions |
|------------------|
| `1.0.0` |
| `1.1.0` |
| `1.2.0-beta` |
| *...dynamic based on available versions* |

### Pagination

| Control | Description |
|---------|-------------|
| Count | Items per page selector (e.g., 10, 25, 50, 100) |
| Page Navigation | Previous/Next, page numbers |
| Total Count | Display total matching results |

### View Modes

| Mode | Description |
|------|-------------|
| Grid | Card-based grid layout (default) |
| List | Compact list layout with more items visible |

## Mod Card

Both view modes display the same data per mod.

### Data Structure

| Field | Source | Notes |
|-------|--------|-------|
| icon | `Mod.icon` | Mod thumbnail |
| name | `Mod.name` | Mod title (clickable → detail page) |
| author | `Mod.owner.username` | Primary author only |
| summary | `Mod.summary` | Short description (truncated if needed) |
| categories | `Mod.categories` | Category badges |
| updatedAt | `Mod.updatedAt` | Relative or formatted date |
| likes | `Mod.likes` | Like count with icon |
| downloads | `Mod.downloads` | Download count with icon |

### Grid View Card

```
┌─────────────────────────────┐
│         [ICON]              │
├─────────────────────────────┤
│ Mod Name                    │
│ by Author                   │
├─────────────────────────────┤
│ Short description text...   │
├─────────────────────────────┤
│ [Category1] [Category2] [Category3]        │
├─────────────────────────────┤
│ ♥ 1.2k    ↓ 45k    📅 2d    │
└─────────────────────────────┘
```

### List View Row

```
┌────┬──────────────────────────────────────────────────────────────┐
│ICON│ Mod Name          by Author     [Category1][Category2]  ♥1.2k ↓45k 📅2d│
│    │ Short description text that can be longer in list view...   │
└────┴──────────────────────────────────────────────────────────────┘
```

## Query Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `search` | String | `?search=magic` | Search query |
| `sort` | String | `?sort=downloads` | Sort option |
| `order` | String | `?order=desc` | Sort direction |
| `categories` | String[] | `?categories=magic,tech` | Selected categories |
| `gameVersion` | String | `?gameVersion=1.0.0` | Game version filter |
| `page` | Number | `?page=2` | Current page |
| `count` | Number | `?count=25` | Items per page |
| `view` | String | `?view=list` | View mode (grid/list) |

## User Stories

- As a user, I want to search for mods by name or keyword
- As a user, I want to filter mods by category to find specific types
- As a user, I want to filter by game version to find compatible mods
- As a user, I want to sort by downloads to find popular mods
- As a user, I want to switch between grid and list views based on preference
- As a user, I want to control how many results appear per page
- As a user, I want the URL to reflect my filters so I can share/bookmark

## State Management

Filters and view preferences should be:

1. **URL-synced** - All filter state in query params
2. **Persistent** - View mode preference saved locally
3. **Shareable** - Full filter state can be shared via URL

## API Requirements

```typescript
// Request
GET /api/mods
  ?search=string
  &sort=relevance|downloads|likes|published|updated
  &order=asc|desc
  &categories=string[]
  &gameVersion=string
  &page=number
  &count=number

// Response
{
  data: Mod[],
  pagination: {
    page: number,
    count: number,
    total: number,
    totalPages: number
  }
}
```

## Navigation

| Action | Destination |
|--------|-------------|
| Click Mod Card | `/mods/{mod-slug}` |
| Apply Filters | Updates current URL query params |
| Clear Filters | `/mods` |

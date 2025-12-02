# User Profile Page

## Overview

Public profile page displaying user information and their published mods.

## URL

```
/users/{username}
```

## Layout

### Profile Header

Displays user information.

#### Data Structure

| Field | Source | Notes |
|-------|--------|-------|
| username | `User.username` | Display name and URL identifier |
| avatar | `User.avatar` | Profile picture (default if not set) |
| bio | `User.bio` | User biography (optional) |
| joinedAt | `User.joinedAt` | Account creation date |
| modCount | Computed | Total number of published mods |
| totalDownloads | Computed | Sum of downloads across all mods |

#### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [AVATAR]   username                                        │
│             Member since December 2024                      │
│                                                             │
│             Bio text goes here...                           │
│                                                             │
│             📦 15 Mods    ↓ 125,000 Downloads              │
│                                                             │
│  [✏️ Edit Profile]  [⚠️ Report]                             │
└─────────────────────────────────────────────────────────────┘
```

### Action Buttons

| Button | Visibility | Action | Notes |
|--------|-----------|--------|-------|
| ✏️ Edit Profile | Own profile only | Navigate to edit page | Requires authentication |
| ⚠️ Report | Other users only | Open report modal | Requires authentication |

---

## User's Mods Section

Displays a list of mods created by this user.

### Data Structure

Uses the same [ModCard data structure](./mods-list.md#mod-card) as the mods list page:

| Field | Source | Notes |
|-------|--------|-------|
| icon | `Mod.icon` | Mod thumbnail |
| name | `Mod.name` | Mod title (clickable → detail page) |
| summary | `Mod.summary` | Short description |
| categories | `Mod.categories` | Category badges |
| updatedAt | `Mod.updatedAt` | Relative or formatted date |
| likes | `Mod.likes` | Like count with icon |
| downloads | `Mod.downloads` | Download count with icon |

### Pagination

- **Trigger**: Pagination appears when user has more than 10 mods
- **Items per page**: 10 mods
- **Controls**: Page numbers, prev/next buttons

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ username's Mods (15)                                        │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│ │   [MOD CARD]    │  │   [MOD CARD]    │  │  [MOD CARD]  │ │
│ └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                             │
│ ┌─────────────────┐  ┌─────────────────┐                   │
│ │   [MOD CARD]    │  │   [MOD CARD]    │                   │
│ └─────────────────┘  └─────────────────┘                   │
├─────────────────────────────────────────────────────────────┤
│                    [1] [2] ... [Next]                       │
└─────────────────────────────────────────────────────────────┘
```

### Empty State

When user has no published mods:

```
┌─────────────────────────────────────────────────────────────┐
│ username's Mods (0)                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│               No mods published yet.                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Query Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `page` | Number | `?page=2` | Current page for mods list |

---

## User Stories

- As a visitor, I want to view a user's profile to learn about them
- As a visitor, I want to see all mods created by a user
- As a user, I want to edit my own profile
- As a user, I want to report inappropriate user profiles
- As a visitor, I want to see how many mods a user has created
- As a visitor, I want to see total downloads across all user's mods

---

## API Requirements

### Get User Profile

```typescript
GET /api/users/{username}

// Response
{
  username: string,
  avatar: string | null,
  bio: string | null,
  joinedAt: string,
  modCount: number,
  totalDownloads: number
}
```

### Get User's Mods

```typescript
GET /api/users/{username}/mods
  ?page=number

// Response
{
  data: Mod[],
  pagination: {
    page: number,
    count: 10,
    total: number,
    totalPages: number
  }
}
```

### Actions

```typescript
POST /api/users/{username}/report    // Report user
```

---

## Navigation

| Action | Destination |
|--------|-------------|
| Edit Profile | `/settings/profile` |
| Mod Card Click | `/mods/{mod-slug}` |
| Report | Opens report modal |

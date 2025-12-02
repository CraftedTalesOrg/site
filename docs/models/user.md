# User Model

A user account on the CraftedTales platform.

## Public Fields

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| username | String | URL-friendly username (serves name and slug) |
| bio | String? | Optional user biography |
| avatar | String? | Optional avatar image URL |
| roles | String[] | List of roles (e.g., `admin`, `moderator`). Default: `[]` (empty) |
| joinedAt | Date | Account creation date |

## Internal Fields

These fields exist in the database but are **never displayed to end users**:

| Field | Type | Description |
|-------|------|-------------|
| email | String | User email address (unique, required) |
| password | String | Hashed password |
| twoFactorEnabled | Boolean | Whether 2FA is enabled |
| twoFactorSecret | String? | 2FA secret key (if enabled) |
| updatedAt | Date | Last update timestamp |
| enabled | Boolean | Account enabled/disabled status |
| deleted | Boolean | Soft delete flag |

## OAuth Connections

Optional external authentication providers:

| Field | Type | Description |
|-------|------|-------------|
| googleId | String? | Google OAuth ID |
| githubId | String? | GitHub OAuth ID |
| *...other providers* | String? | Additional OAuth provider IDs |

## Username Requirements

- Must be URL-friendly (alphanumeric, hyphens, underscores only)
- Must be unique across the platform
- Validation should reject special characters and spaces
- Case-insensitive matching for uniqueness

## Roles

### Available Roles

| Role | Permissions | Description |
|------|-------------|-------------|
| `admin` | Full platform access | Complete platform administration |
| `moderator` | Content moderation | Review, flag, or remove inappropriate content |
| *(default - none)* | Basic user permissions | Browse, download, upload mods, like |

Users with no roles have basic user permissions.

## Usage

- User profiles (public page)
- Mod authors/contributors
- Mod cards (primary author only)
- Mod detail page (all authors with roles)
- Site administration (admin/moderator tools)

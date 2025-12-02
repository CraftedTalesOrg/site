# Edit Profile Page

## Overview

Settings page for users to edit their profile information and manage account connections.

## URL

```
/settings/profile
```

## Access

- **Authentication**: Required
- **Visibility**: Own profile only

---

## Layout

### Profile Information Section

Basic profile information that is publicly visible.

#### Editable Fields

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| username | String | URL-friendly, unique, 3-20 chars | Cannot be changed (or with restrictions) |
| avatar | Image Upload | Max 5MB, JPG/PNG/WebP | Optional |
| bio | Textarea | Max 500 characters | Optional |

#### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Profile Information                                         │
├─────────────────────────────────────────────────────────────┤
│ Username                                                    │
│ [username_____________] (Read-only or restricted)           │
│                                                             │
│ Avatar                                                      │
│ [CURRENT AVATAR]   [Upload New] [Remove]                   │
│                                                             │
│ Bio                                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Tell us about yourself...                               │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│ 245 / 500 characters                                        │
│                                                             │
│ [Save Changes] [Cancel]                                     │
└─────────────────────────────────────────────────────────────┘
```

---

### Account Information Section

Private account information, never shown publicly.

#### Display Fields

| Field | Source | Notes |
|-------|------|-------|
| email | `User.email` | Editable |
| joinedAt | `User.joinedAt` | Read-only |

#### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Account Information                                         │
├─────────────────────────────────────────────────────────────┤
│ Email Address                                               │
│ [user@example.com_________________] [Change]                │
│                                                             │
│ Member Since                                                │
│ December 1, 2024 (Read-only)                                │
└─────────────────────────────────────────────────────────────┘
```

---

### Security Section

Account security settings.

#### Options

| Setting | Type | Notes |
|---------|------|-------|
| Password | Action | Opens change password modal |
| Two-Factor Authentication | Toggle | Enable/disable 2FA |

#### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Security                                                    │
├─────────────────────────────────────────────────────────────┤
│ Password                                                    │
│ ••••••••                          [Change Password]         │
│                                                             │
│ Two-Factor Authentication                                   │
│ [Disabled ▼]  [Enable 2FA]                                  │
│ Add an extra layer of security to your account              │
└─────────────────────────────────────────────────────────────┘
```

---

### Connected Accounts Section

OAuth provider connections.

#### Data Structure

| Field | Source | Status | Actions |
|-------|--------|--------|---------|
| Google | `User.googleId` | Connected / Not Connected | Connect / Disconnect |
| GitHub | `User.githubId` | Connected / Not Connected | Connect / Disconnect |
| *Future providers* | | | |

#### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Connected Accounts                                          │
├─────────────────────────────────────────────────────────────┤
│ Google                                                      │
│ ✓ Connected as user@gmail.com      [Disconnect]            │
│                                                             │
│ GitHub                                                      │
│ ✗ Not connected                     [Connect]              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Structure

### Editable Fields (from [User model](../models/user.md))

**Public Fields**:
- `username` - Read-only or restricted changes
- `avatar` - Image upload
- `bio` - Text area

**Private Fields**:
- `email` - Editable
- `password` - Change via modal
- `twoFactorEnabled` - Toggle
- `twoFactorSecret` - Auto-generated when enabled

**OAuth Connections**:
- `googleId` - Connect/disconnect
- `githubId` - Connect/disconnect

---

## User Stories

- As a user, I want to update my profile picture
- As a user, I want to write a bio about myself
- As a user, I want to change my email address
- As a user, I want to change my password
- As a user, I want to enable 2FA for security
- As a user, I want to connect my Google account for easier login
- As a user, I want to connect my GitHub account
- As a user, I want to disconnect OAuth accounts

---

## Validation

### Username
- If editable: Must remain URL-friendly
- Unique across platform
- 3-20 characters
- Alphanumeric, hyphens, underscores only

### Avatar
- Max file size: 5MB
- Allowed formats: JPG, PNG, WebP
- Recommended dimensions: 256x256 or larger (square)

### Bio
- Max length: 500 characters
- Plain text or basic markdown (optional)

### Email
- Valid email format
- Unique across platform
- Verification email sent on change

---

## API Requirements

### Get Current User Data

```typescript
GET /api/users/me

// Response
{
  username: string,
  avatar: string | null,
  bio: string | null,
  email: string,
  joinedAt: string,
  twoFactorEnabled: boolean,
  googleId: string | null,
  githubId: string | null
}
```

### Update Profile

```typescript
PATCH /api/users/me
{
  avatar?: string | null,
  bio?: string | null
}
```

### Update Email

```typescript
PATCH /api/users/me/email
{
  email: string
}
// Sends verification email
```

### Change Password

```typescript
POST /api/users/me/password
{
  currentPassword: string,
  newPassword: string
}
```

### Enable/Disable 2FA

```typescript
POST /api/users/me/2fa/enable
// Returns QR code and secret

POST /api/users/me/2fa/disable
{
  code: string  // 2FA code to confirm
}
```

### Connect/Disconnect OAuth

```typescript
GET  /api/auth/google             // Initiates OAuth flow
GET  /api/auth/google/callback    // Callback after authorization
POST /api/auth/google/disconnect  // Disconnect Google connection

GET  /api/auth/github             // Initiates OAuth flow
GET  /api/auth/github/callback    // Callback after authorization
POST /api/auth/github/disconnect  // Disconnect GitHub connection
```

---

## Navigation

| Action | Destination |
|--------|-------------|
| Cancel | Back to previous page or `/users/{username}` |
| Save Changes | Stays on page with success message |
| View Profile | `/users/{username}` |

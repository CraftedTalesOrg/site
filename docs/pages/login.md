# Login Page

## Overview

User authentication page for existing accounts.

## URL

```
/login
```

## Access

- **Authentication**: Must be logged out
- **Redirect**: If already authenticated, redirect to home or intended destination

---

## Layout

### Login Form

```
┌─────────────────────────────────────────────────────────────┐
│                        Sign In                              │
├─────────────────────────────────────────────────────────────┤
│ Email or Username                                           │
│ [user@example.com_____]                                     │
│                                                             │
│ Password                                                    │
│ [••••••••••••••••••••]                      [Forgot?]       │
│                                                             │
│ ☐ Remember me                                               │
│                                                             │
│ [Sign In]                                                   │
│                                                             │
│ ───────────── OR ─────────────                              │
│                                                             │
│ [🔵 Continue with Google]                                   │
│ [⚫ Continue with GitHub]                                   │
│                                                             │
│ Don't have an account? [Sign up]                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Form Fields

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| identifier | Text | Email or username | Yes |
| password | Password | Not empty | Yes |
| rememberMe | Checkbox | - | No |

---

## 2FA Flow

If user has 2FA enabled, show additional step after password verification:

```
┌─────────────────────────────────────────────────────────────┐
│                 Two-Factor Authentication                   │
├─────────────────────────────────────────────────────────────┤
│ Enter the 6-digit code from your authenticator app          │
│                                                             │
│ [___][___][___][___][___][___]                              │
│                                                             │
│ [Verify]                                                    │
│                                                             │
│ Lost access to your device? [Use recovery code]             │
└─────────────────────────────────────────────────────────────┘
```

---

## User Stories

- As a user, I want to log in with my email and password
- As a user, I want to log in with my username and password
- As a user, I want to log in with Google
- As a user, I want to log in with GitHub
- As a user, I want to stay logged in (remember me)
- As a user, I want to verify my 2FA code if enabled
- As a user, I want to reset my password if I forgot it
- As a user, I want to be redirected to my intended destination after login

---

## Login Flow

### Standard Login
1. User enters email/username and password
2. Submit to API
3. If 2FA enabled: Show 2FA verification
4. Create session/token
5. Redirect to home or intended destination

### OAuth Login
1. User clicks OAuth provider button
2. Redirect to provider authorization
3. Provider redirects back with token
4. Server authenticates user
5. Create session and redirect

---

## API Requirements

### Login with Email/Password

```typescript
POST /api/auth/login
{
  identifier: string,  // email or username
  password: string,
  rememberMe?: boolean
}

// Response (Success - No 2FA)
{
  user: {
    username: string,
    email: string,
    avatar: string | null
  },
  token: string
}

// Response (Success - 2FA Required)
{
  requires2FA: true,
  tempToken: string  // Temporary token for 2FA verification
}

// Response (Error)
{
  error: string  // "Invalid credentials"
}
```

### Verify 2FA Code

```typescript
POST /api/auth/verify-2fa
{
  tempToken: string,
  code: string  // 6-digit code
}

// Response (Success)
{
  user: { ... },
  token: string
}
```

### OAuth Login

```typescript
GET /api/auth/google         // Initiates Google OAuth
GET /api/auth/github         // Initiates GitHub OAuth

// Callback
GET /api/auth/{provider}/callback?code=string
// Authenticates and creates session
```

---

## Error Handling

| Error | Message | Display |
|-------|---------|---------|
| Invalid credentials | "Invalid email/username or password" | Top of form |
| Account disabled | "This account has been disabled" | Top of form |
| Account deleted | "This account no longer exists" | Top of form |
| Email not verified | "Please verify your email first" | Top of form with resend link |
| Invalid 2FA code | "Invalid verification code" | Below code input |
| Rate limit | "Too many attempts. Try again in 5 minutes." | Top of form |

---

## Success Behavior

1. Create session/token
2. Store session (cookie or localStorage)
3. Redirect to:
   - Intended destination (if redirected from protected page)
   - Home page (default)
4. Show welcome back notification (optional)

---

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `redirect` | String | URL to redirect after successful login |
| `message` | String | Message to display (e.g., "Session expired") |

**Example**: `/login?redirect=/settings&message=session_expired`

---

## Navigation

| Action | Destination |
|--------|-------------|
| Sign up link | `/register` |
| Forgot password | `/forgot-password` |
| After login | Query param `redirect` or `/` (home) |
| OAuth providers | Provider authorization page |

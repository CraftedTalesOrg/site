# Reset Password Page

## Overview

Password reset page accessed via email link with token.

## URL

```
/reset-password?token={reset_token}
```

## Access

- **Authentication**: Must be logged out
- **Token**: Required in query parameter
- **Validation**: Token must be valid and not expired

---

## Layout

### Reset Password Form

```
┌─────────────────────────────────────────────────────────────┐
│                    Create New Password                      │
├─────────────────────────────────────────────────────────────┤
│ New Password                                                │
│ [••••••••••••••••••••]                                      │
│ At least 8 characters                                       │
│ Password strength: [████████░░] Strong                      │
│                                                             │
│ Confirm New Password                                        │
│ [••••••••••••••••••••]                                      │
│                                                             │
│ [Reset Password]                                            │
└─────────────────────────────────────────────────────────────┘
```

### Success State

```
┌─────────────────────────────────────────────────────────────┐
│                    Password Reset Successful                │
├─────────────────────────────────────────────────────────────┤
│ ✓ Your password has been reset successfully.               │
│                                                             │
│ You can now sign in with your new password.                │
│                                                             │
│ [Sign In]                                                   │
└─────────────────────────────────────────────────────────────┘
```

### Invalid/Expired Token

```
┌─────────────────────────────────────────────────────────────┐
│                    Invalid Reset Link                       │
├─────────────────────────────────────────────────────────────┤
│ ⚠ This password reset link is invalid or has expired.      │
│                                                             │
│ Password reset links expire after 1 hour for security.     │
│                                                             │
│ [Request New Reset Link]                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Form Fields

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| newPassword | Password | Min 8 characters, strength check | Yes |
| confirmPassword | Password | Must match newPassword | Yes |

---

## Query Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `token` | String | Password reset token from email | Yes |

---

## User Stories

- As a user, I want to set a new password using the reset link
- As a user, I want to see password strength feedback
- As a user, I want to be notified if the link expired
- As a user, I want to request a new link if the current one is invalid
- As a user, I want to be redirected to login after successful reset

---

## Flow

1. User clicks reset link from email
2. Load page with token
3. Validate token via API
4. If valid: Show password form
5. If invalid/expired: Show error message
6. User enters new password
7. Submit to API with token
8. Show success message
9. Redirect to login after 3 seconds (or immediately)

---

## Validation Rules

### Password
- **Minimum**: 8 characters
- **Strength**: Encourage strong passwords
- **Same as old**: Should allow (user may want same password)
- **Common passwords**: Warn against but don't block

### Confirm Password
- Must exactly match new password
- Real-time validation on input

---

## API Requirements

### Validate Reset Token

```typescript
GET /api/auth/validate-reset-token?token=string

// Response (Valid)
{
  valid: true,
  email: string  // Associated email (masked: u***@example.com)
}

// Response (Invalid)
{
  valid: false,
  reason: "expired" | "invalid" | "used"
}
```

### Reset Password

```typescript
POST /api/auth/reset-password
{
  token: string,
  newPassword: string
}

// Response (Success)
{
  success: true,
  message: "Password reset successfully"
}

// Response (Error)
{
  success: false,
  error: "Token invalid or expired"
}
```

---

## Error Handling

| Error | Message | Display |
|-------|---------|---------|
| Token missing | "Invalid reset link" | Error page |
| Token invalid | "This reset link is invalid" | Error page |
| Token expired | "This reset link has expired" | Error page |
| Token used | "This reset link has already been used" | Error page |
| Weak password | "Password is too weak" | Below password field |
| Password mismatch | "Passwords do not match" | Below confirm field |
| Server error | "Something went wrong. Please try again." | Top of form |

---

## Token Security

### Token Properties
- **Expiration**: 1 hour from generation
- **Single-use**: Invalidated after successful reset
- **Format**: Cryptographically secure random string
- **Storage**: Hashed in database
- **Length**: At least 32 characters

### Token Invalidation
- Used successfully
- Expired (1 hour)
- User requests new reset
- User changes password via other method

---

## Success Behavior

1. Show success message
2. Invalidate reset token
3. Optional: Auto-login user
4. Redirect to login page after 3 seconds
5. Optional: Send confirmation email

---

## Navigation

| Action | Destination |
|--------|-------------|
| Request new link | `/forgot-password` |
| Sign in (after success) | `/login` |
| Invalid token | `/forgot-password` |

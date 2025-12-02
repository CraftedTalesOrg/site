# Forgot Password Page

## Overview

Password reset request page for users who forgot their password.

## URL

```
/forgot-password
```

## Access

- **Authentication**: Must be logged out
- **Redirect**: If already authenticated, redirect to home

---

## Layout

### Request Reset Form

```
┌─────────────────────────────────────────────────────────────┐
│                    Reset Password                           │
├─────────────────────────────────────────────────────────────┤
│ Enter your email address and we'll send you a link to      │
│ reset your password.                                        │
│                                                             │
│ Email Address                                               │
│ [user@example.com_____]                                     │
│                                                             │
│ [Send Reset Link]                                           │
│                                                             │
│ Remember your password? [Sign in]                           │
└─────────────────────────────────────────────────────────────┘
```

### Success State

```
┌─────────────────────────────────────────────────────────────┐
│                    Check Your Email                         │
├─────────────────────────────────────────────────────────────┤
│ ✓ If an account exists with user@example.com, you will     │
│   receive a password reset link shortly.                   │
│                                                             │
│ Didn't receive the email?                                  │
│ • Check your spam folder                                   │
│ • Make sure you entered the correct email                  │
│ • [Try again]                                               │
│                                                             │
│ [Back to Sign In]                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Form Fields

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| email | Email | Valid email format | Yes |

---

## User Stories

- As a user, I want to request a password reset link
- As a user, I want to receive the reset link via email
- As a user, I want security (no user enumeration)
- As a user, I want to resend the reset link if needed

---

## Flow

1. User enters email address
2. Submit to API
3. Show success message (always, even if email doesn't exist)
4. If email exists:
   - Generate reset token (expires in 1 hour)
   - Send email with reset link
5. User clicks link in email
6. Redirect to reset password page with token

---

## API Requirements

### Request Password Reset

```typescript
POST /api/auth/forgot-password
{
  email: string
}

// Response (Always success to prevent enumeration)
{
  message: "If an account exists, you will receive a reset link"
}
```

### Email Content

```
Subject: Reset Your Password

Hi [username],

You requested to reset your password. Click the link below to create a new password:

[Reset Password Button/Link]
https://craftedtales.com/reset-password?token=ABC123XYZ

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.
```

---

## Security Considerations

### No User Enumeration
- Always show success message, even if email doesn't exist
- Prevents attackers from discovering valid email addresses

### Token Security
- Token expires in 1 hour
- Single-use token (invalidated after use)
- Cryptographically secure random token
- Stored hashed in database

### Rate Limiting
- Limit requests per email (e.g., 3 per hour)
- Limit requests per IP (e.g., 10 per hour)

---

## Error Handling

| Error | Message | Display |
|-------|---------|---------|
| Invalid email format | "Please enter a valid email address" | Below email field |
| Rate limit exceeded | "Too many requests. Please try again later." | Top of form |
| Server error | "Something went wrong. Please try again." | Top of form |

---

## Navigation

| Action | Destination |
|--------|-------------|
| Sign in link | `/login` |
| Try again | Stays on page, clears form |
| Back to sign in | `/login` |

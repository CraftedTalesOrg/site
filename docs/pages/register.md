# Register Page

## Overview

Account creation page for new users.

## URL

```
/register
```

## Access

- **Authentication**: Must be logged out
- **Redirect**: If already authenticated, redirect to home or previous page

---

## Layout

### Registration Form

```
┌─────────────────────────────────────────────────────────────┐
│                     Create Account                          │
├─────────────────────────────────────────────────────────────┤
│ Username                                                    │
│ [username_____________]                                     │
│ 3-20 characters, alphanumeric and hyphens only              │
│                                                             │
│ Email                                                       │
│ [user@example.com_____]                                     │
│                                                             │
│ Password                                                    │
│ [••••••••••••••••••••]                                      │
│ At least 8 characters                                       │
│                                                             │
│ Confirm Password                                            │
│ [••••••••••••••••••••]                                      │
│                                                             │
│ ☐ I agree to the Terms of Service and Privacy Policy       │
│                                                             │
│ [Create Account]                                            │
│                                                             │
│ ───────────── OR ─────────────                              │
│                                                             │
│ [🔵 Continue with Google]                                   │
│ [⚫ Continue with GitHub]                                   │
│                                                             │
│ Already have an account? [Sign in]                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Form Fields

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| username | Text | 3-20 chars, URL-friendly, unique | Yes |
| email | Email | Valid email format, unique | Yes |
| password | Password | Min 8 characters | Yes |
| confirmPassword | Password | Must match password | Yes |
| termsAccepted | Checkbox | Must be checked | Yes |

---

## Validation Rules

### Username
- **Length**: 3-20 characters
- **Format**: Alphanumeric, hyphens, underscores only
- **Pattern**: `^[a-zA-Z0-9_-]{3,20}$`
- **Uniqueness**: Check via API on blur
- **Case**: Case-insensitive for uniqueness check
- **Reserved**: Cannot use reserved words (admin, api, etc.)

### Email
- **Format**: Valid email pattern
- **Uniqueness**: Check via API on blur
- **Case**: Case-insensitive

### Password
- **Minimum**: 8 characters
- **Recommended**: Include uppercase, lowercase, numbers, symbols
- **Strength indicator**: Visual feedback (weak/medium/strong)
- **Common passwords**: Reject common passwords

### Confirm Password
- **Match**: Must exactly match password field
- **Real-time validation**: Check on input

---

## User Stories

- As a visitor, I want to create an account with email and password
- As a visitor, I want to register using my Google account
- As a visitor, I want to register using my GitHub account
- As a visitor, I want to see if my username is available
- As a visitor, I want to know if my password is strong enough
- As a visitor, I want to be redirected after successful registration

---

## Registration Flow

### Standard Registration
1. User fills out form
2. Client-side validation
3. Submit to API
4. Server creates user account
5. Send verification email
6. Show email verification state (see below)

### OAuth Registration
1. User clicks OAuth provider button
2. Redirect to provider authorization
3. Provider redirects back with token
4. Server creates account with OAuth ID
5. Auto-login and redirect to home

---

## Email Verification State

After successful registration, the form transitions to verification instructions.

### Verification Instructions

```
┌─────────────────────────────────────────────────────────────┐
│                    Verify Your Email                        │
├─────────────────────────────────────────────────────────────┤
│ ✓ Account created successfully!                            │
│                                                             │
│ We've sent a verification email to:                        │
│ user@example.com                                            │
│                                                             │
│ Click the link in the email to verify your account.        │
│                                                             │
│ Didn't receive the email?                                  │
│ • Check your spam folder                                   │
│ • Make sure you entered the correct email                  │
│                                                             │
│ [Resend Verification Email]                                 │
│                                                             │
│ [Continue to Site]                                          │
└─────────────────────────────────────────────────────────────┘
```

### Email Verification Link

When user clicks the verification link from their email:

```
/verify?token={verification_token}
```

This redirects to a verification endpoint that:
1. Validates the token
2. Marks email as verified
3. Shows success toast notification
4. Redirects to home or user profile

### Verification Email Content

```
Subject: Verify Your Email Address

Hi [username],

Welcome to CraftedTales! Please verify your email address by clicking the button below:

[Verify Email Button/Link]
https://craftedtales.com/verify?token=ABC123XYZ

This link will expire in 24 hours.

If you didn't create this account, you can safely ignore this email.
```

---

## Account Restrictions

Until email is verified, users have limited access:

| Feature | Allowed |
|---------|---------|
| Browse mods | ✓ Yes |
| Download mods | ✓ Yes |
| Upload mods | ✗ No (requires verification) |
| Like | ? Configurable |

---

## API Requirements

### Register with Email/Password

```typescript
POST /api/auth/register
{
  username: string,
  email: string,
  password: string
}

// Response (Success)
{
  user: {
    username: string,
    email: string,
    joinedAt: string,
    emailVerified: false
  },
  token: string  // JWT or session token
}

// Response (Error)
{
  errors: {
    username?: string,  // "Username already taken"
    email?: string,     // "Email already in use"
    password?: string   // "Password too weak"
  }
}
```

### Resend Verification Email

```typescript
POST /api/auth/resend-verification
{
  email?: string  // Optional, uses current user if authenticated
}

// Response
{
  success: true,
  message: "Verification email sent"
}
```

### Verify Email Token

```typescript
GET /api/auth/verify?token=string

// Redirects to home with success/error message
// Or returns JSON if API call:
{
  success: true,
  message: "Email verified successfully"
}
```

### Check Username Availability

```typescript
GET /api/auth/check-username?username=string

// Response
{
  available: boolean
}
```

### OAuth Registration

```typescript
GET /api/auth/google            // Initiates Google OAuth
GET /api/auth/github            // Initiates GitHub OAuth

// Callback
GET /api/auth/{provider}/callback?code=string
// Creates account and logs in
```

---

## Error Handling

| Error | Message | Display |
|-------|---------|---------|
| Username taken | "This username is already taken" | Below username field |
| Email in use | "This email is already registered" | Below email field |
| Weak password | "Password is too weak" | Below password field |
| Password mismatch | "Passwords do not match" | Below confirm password field |
| Terms not accepted | "You must accept the terms to continue" | Below checkbox |
| Server error | "Something went wrong. Please try again." | Top of form |

---

## Success Behavior

### Email Verification Required
1. Show success message
2. Transition to verification instructions state
3. Send verification email
4. User can continue browsing with limited access
5. Clicking verification link in email verifies account

### OAuth Registration
1. Auto-verify email (trusted provider)
2. Create session/token
3. Redirect to home or intended destination
4. Show welcome toast notification

---

## Navigation

| Action | Destination |
|--------|-------------|
| Sign in link | `/login` |
| Terms of Service | `/terms` |
| Privacy Policy | `/privacy` |
| After registration | Stays on page (shows verification state) |
| Continue to Site | `/` (home) |
| Resend email | Stays on page |
| Cancel | Back to previous page |
| OAuth providers | Provider authorization page |
| Verification link | `/verify?token=xyz` → redirects to home |

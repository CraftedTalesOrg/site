# Site Documentation

This folder contains the use cases and documentation for the CraftedTales site.

## Overview

CraftedTales is a mod platform for discovering, downloading, and managing game modifications. The platform provides a comprehensive browsing experience with powerful filtering, sorting, and search capabilities.

## Pages

| Page | Description | Documentation |
|------|-------------|---------------|
| Landing | Home page / entry point | [landing.md](./pages/landing.md) |
| Mods List | Paginated, filterable mod browser | [mods-list.md](./pages/mods-list.md) |
| Mod Detail | Individual mod page with full details | [mod-detail.md](./pages/mod-detail.md) |
| Create/Edit Mod | Mod creation and editing form | [create-edit-mod.md](./pages/create-edit-mod.md) |
| User Profile | Public user profile with mod list | [user-profile.md](./pages/user-profile.md) |
| Edit Profile | User settings and profile editor | [edit-profile.md](./pages/edit-profile.md) |
| Register | Account creation and email verification | [register.md](./pages/register.md) |
| Login | User authentication page | [login.md](./pages/login.md) |
| Forgot Password | Password reset request | [forgot-password.md](./pages/forgot-password.md) |
| Reset Password | Password reset with token | [reset-password.md](./pages/reset-password.md) |
| Shopping Cart | Cart management and checkout | [shopping-cart.md](./pages/shopping-cart.md) |
| Report Flow | Content and user reporting | [report-flow.md](./pages/report-flow.md) |
| Admin Panel | Administration and moderation | [admin-panel.md](./pages/admin-panel.md) |
| Terms of Service | Platform terms and conditions | [terms-of-service.md](./pages/terms-of-service.md) |
| Privacy Policy | Privacy and data handling | [privacy-policy.md](./pages/privacy-policy.md) |

## Structure

```
docs/
├── README.md              # This file
├── error-handling.md      # Error pages and states
├── models/                # Data models
│   ├── README.md          # Models index
│   ├── mod.md             # Mod entity
│   ├── user.md            # User entity
│   ├── version.md         # Version entity (includes changelog)
│   ├── dependency.md      # Dependency entity
│   ├── category.md        # Category entity
│   └── pagination.md      # Pagination wrapper
└── pages/                 # Page documentation
    ├── landing.md         # Landing page
    ├── mods-list.md       # Mods listing page (includes ModCard data structure)
    ├── mod-detail.md      # Mod detail page (includes full data structure)
    ├── create-edit-mod.md # Create and edit mod page
    ├── user-profile.md    # User profile page (public view)
    ├── edit-profile.md    # Edit profile page (settings)
    ├── register.md        # Registration page (includes email verification)
    ├── login.md           # Login page
    ├── forgot-password.md # Forgot password page
    ├── reset-password.md  # Reset password page
    ├── shopping-cart.md   # Shopping cart and checkout
    ├── report-flow.md     # Content reporting flow
    ├── admin-panel.md     # Admin and moderation panel
    ├── terms-of-service.md # Terms of Service
    └── privacy-policy.md  # Privacy Policy
```

## Data Models

See [models/README.md](./models/README.md) for detailed data model documentation including:

- **Core Entities**: Mod, User, Version, Dependency, Category
- **Utilities**: Pagination wrapper

## Common Documentation

- [Error Handling](./error-handling.md) - Error pages and states (404, 403, 500, maintenance)

Page-specific data structures are documented within their respective page documentation files.
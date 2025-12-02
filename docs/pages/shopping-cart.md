# Shopping Cart

A shopping cart for selecting multiple mods to download together as a single bundled ZIP. Quantity is not applicable for mods.

## Goals
- Add/remove mods, clear all, proceed to checkout
- Persist across session (local storage or account-bound)
- Ensure dependency correctness at checkout

## UI
- Cart icon in header with item count badge
- Flyout/Drawer preview with last 3 items
- Full page view with: Selected Items and Dependencies sections

## Item Structure
- `mod: Mod` (id, name, owner.username, logo)
- Selected version (optional; default latest stable)
- Actions: remove, choose version

## Dependencies Section (auto-managed)
When the user adds items, the cart resolves dependencies and shows them in a section below the selected list:

- Required: auto-included and cannot be unchecked; show a message “Required by {modName}”
- Recommended: auto-included and pre-selected; can be unchecked
- Optional: listed but unselected by default; can be selected
- Incompatible: highlight conflicts between selected items and dependencies; show both conflicting mods and guidance to remove one

If the user explicitly adds a dependency as a normal item, it appears in the main list instead of the dependency section.

## Actions
- Add to Cart: from ModCard and Mod Detail
- Remove / Clear All
- Checkout: creates and downloads a single ZIP bundle containing all selected mods (and required dependencies)

## Behavior
- No quantities; duplicates merged by `modId`
- If a mod is removed/unlisted, show warning and allow removal
- If a selected version becomes unavailable, auto-fallback to latest compatible
- Dependency resolution re-runs on any change to items or versions

## API (optional)
- `POST /api/cart` (persist server-side per user)
- `DELETE /api/cart/{modId}`
- `POST /api/cart/resolve` → returns dependency graph with classifications (required/recommended/optional/incompatible)
- `POST /api/cart/checkout` → returns `{ zipUrl }` or streams a single ZIP containing all selected mods

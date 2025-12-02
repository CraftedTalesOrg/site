# Admin Panel

Administration and moderation dashboard for managing content, users, and reports.

## Access Levels
- Admin, Moderator: same permissions (for now)
- Authentication required; audit log for sensitive actions

## Sections

### Overview
- KPIs: new mods, pending reviews, open reports, recent bans
- Quick actions: review queue, reports inbox

### Content Review
- Pending Mods: approve, reject (with reason), request changes
- Version Review: scan results, flags (malware/licensing/NSFW)
- Edits Queue: review significant edits on existing mods

### Users
- Search users; view profile, activity, flags
- Actions: suspend/unsuspend, reset 2FA, revoke sessions
- Notes: internal-only moderator notes per user

### Reports
- Inbox: filter by type/status (Open, In review, Resolved)
- Bulk actions: assign to moderator, change status
- Resolution: remove content, warn user, suspend account, dismiss

### Taxonomy
- Categories: create/rename/merge, set order
- Licenses: managed list, custom license approval

### System
- Feature flags
- Maintenance mode toggle and banner message

## API
- `GET /api/admin/review-queue`
- `POST /api/admin/mods/{id}/approve|reject`
- `POST /api/admin/users/{id}/{suspend|unsuspend}`
- `GET /api/admin/reports`
- `POST /api/admin/reports/{id}/resolve`

## Audit & Security
- Every admin/mod action recorded with actor, target, timestamp, reason
- Two-person review recommended for destructive actions (optional)

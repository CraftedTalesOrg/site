# Report Flow

Allow users to report content or users; moderators review and take action.

## Entry Points
- Report button on Mod Detail, User Profile, Comments (if enabled later)
- Requires authentication

## Report Modal
- Target: auto-filled (modId or userId)
- Type: required
  - DMCA/Copyright
  - Inappropriate/NSFW
  - Spam
  - Broken mod (does not work)
  - Malware/Security concern
  - License violation
  - Other (free text)
- Details: required textarea (min 30 chars)
- Evidence: optional links/screenshots

## Submission
- `POST /api/reports` → { id, status: "open" }
- Rate-limited; duplicate detection by target+type+user (cooldown window)

## Review (Admin Panel)
- Status: Open → In review → Resolved/Dismissed
- Actions: remove content, warn/suspend user, request changes, dismiss
- Communication: optional email/notification to reporter on resolution

## Data Model
- id, targetType (mod|user), targetId, reporterId, type, details, evidence[], createdAt, status, assigneeId, resolution

## Privacy & Abuse
- Hide reporter identity from accused party
- False reporting may lead to warnings or suspension

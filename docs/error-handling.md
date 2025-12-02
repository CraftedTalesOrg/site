# Error Handling

Common error pages and application states.

## 404 Not Found
- Shown when resource or route does not exist
- Suggest search or go back to previous page
- Provide link to homepage and Mods List

## 403 Forbidden
- Requires authentication or insufficient permissions
- Provide login link and context if action-specific

## 500 Internal Server Error
- Generic error with retry option
- Provide error tracking id (if available)

## Maintenance Mode
- Global banner for scheduled maintenance
- Full-page splash for hard downtime (Admin toggle)

## Network/Offline
- Offline indicator and retry/backoff
- Cache recent views where applicable

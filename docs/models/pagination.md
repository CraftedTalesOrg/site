# Pagination Model

Standard pagination response wrapper.

| Field | Type | Description |
|-------|------|-------------|
| data | T[] | Array of items |
| pagination.page | Number | Current page (1-indexed) |
| pagination.count | Number | Items per page |
| pagination.total | Number | Total item count |
| pagination.totalPages | Number | Total page count |

## Usage

- All paginated API responses
- Mods list page
- Changelog page
- Versions page

## Example

```json
{
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "count": 25,
    "total": 127,
    "totalPages": 6
  }
}
```

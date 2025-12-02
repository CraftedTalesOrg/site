# Category Model

A tag/category that can be applied to mods.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| name | String | Display name |
| slug | String | URL-friendly identifier |

## Examples

| Slug | Name |
|------|------|
| `adventure` | Adventure |
| `decoration` | Decoration |
| `magic` | Magic |
| `tech` | Tech |
| `economy` | Economy |
| `building` | Building |
| `combat` | Combat |
| *...more as needed* | |

## Relationships

- Categories are stored in a simple list in the database
- Mods reference categories through a many-to-many relationship
- A mod can have multiple categories
- A category can be applied to multiple mods

## Usage

- Displayed as tags on mod cards
- Filter option on mods list page
- Clickable navigation to filtered list

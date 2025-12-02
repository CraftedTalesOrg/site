# Dependency Model

A relationship between mods defining requirements, optional additions, or incompatibilities.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| modId | String | Referenced mod ID |
| modSlug | String | Referenced mod slug |
| modName | String | Referenced mod name |
| versionRange | String | Version constraint (e.g., `>=1.0.0`, `^2.1.0`, `1.x`) |
| type | Enum | `required` \| `optional` \| `recommended` \| `incompatible` |

## Dependency Types

| Type | Description | Behavior |
|------|-------------|----------|
| `required` | Mod must be installed for this mod to work | Hard requirement, enforced |
| `optional` | Enhances functionality but not required | Soft dependency, suggested |
| `recommended` | Strongly suggested for best experience | Soft dependency, highlighted |
| `incompatible` | Conflicts with this mod | Warning shown, installation blocked |

## Version Range Syntax

| Pattern | Example | Meaning |
|---------|---------|---------|
| Exact | `1.2.0` | Exactly version 1.2.0 |
| Greater/Less | `>=1.0.0` | Version 1.0.0 or higher |
| Caret | `^2.1.0` | Compatible with 2.1.0 (2.x.x) |
| Tilde | `~1.2.3` | Reasonably close to 1.2.3 |
| Wildcard | `1.x` | Any 1.x version |
| Range | `>=1.0.0 <2.0.0` | Between 1.0.0 and 2.0.0 |

## Usage

- Dependencies section on mod detail page
- Displayed as linked list to other mods
- Validation during mod installation
- Conflict detection for incompatible mods
- Helps users identify what additional mods are needed

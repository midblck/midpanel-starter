# KBar Actions

This directory contains the split kbar actions for better organization and maintainability.

## Structure

```
actions/
├── index.ts                 # Main export file
├── navigation-actions.ts    # Navigation-related actions
├── profile-actions.ts       # Profile-related actions
└── README.md               # This file
```

## Files

### `index.ts`

- Main export file that combines all action types
- Exports `createAllKBarActions()` function
- Re-exports individual action creators and types

### `navigation-actions.ts`

- Contains navigation actions from `navItems` constant
- Handles both parent and child navigation items
- Supports external links and new tab opening

### `profile-actions.ts`

- Contains profile-related actions
- Currently includes the Profile action with shortcut `m + p`
- Can be extended with more account-related actions

## Usage

```typescript
import { createAllKBarActions } from './actions';

const actions = createAllKBarActions(navigateTo, openInNewTab);
```

## Adding New Action Types

1. Create a new file in the `actions/` directory
2. Follow the `KBarAction` interface
3. Export the action creator function
4. Add it to the `index.ts` file
5. Update `createAllKBarActions()` to include the new actions

## Benefits

- **Separation of Concerns**: Each action type has its own file
- **Maintainability**: Easy to find and modify specific action types
- **Extensibility**: Simple to add new action categories
- **Type Safety**: Shared `KBarAction` interface ensures consistency

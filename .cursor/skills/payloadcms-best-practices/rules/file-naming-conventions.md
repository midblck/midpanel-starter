# file-naming-conventions

Use consistent file and folder naming conventions throughout the codebase to maintain readability and predictability.

## Why It Matters

Consistent naming conventions provide:

- Predictable file locations and imports
- Better code organization and maintainability
- Easier collaboration across team members
- Consistency with modern JavaScript/TypeScript ecosystem standards

## File Naming Rules

### ✅ TSX Files (React Components)

Always use **kebab-case** for TSX filenames:

```typescript
// ✅ CORRECT
src/components/
├── rich-text-renderer.tsx
├── payload-redirects.tsx
├── user-profile-card.tsx
└── slug-component.tsx

// ❌ INCORRECT - PascalCase
src/components/
├── RichTextRenderer.tsx
├── PayloadRedirects.tsx
└── UserProfileCard.tsx
```

### ✅ TypeScript/JavaScript Files

Use **kebab-case** for multi-word filenames:

```typescript
// ✅ CORRECT
src/lib/
├── generate-preview-path.ts
├── format-date-time.ts
├── validate-user-input.ts
└── handle-api-errors.ts

// ❌ INCORRECT - camelCase for files
src/lib/
├── generatePreviewPath.ts
├── formatDateTime.ts
└── validateUserInput.ts
```

### ✅ Directory Names

Use **kebab-case** for directory names:

```typescript
// ✅ CORRECT
src/
├── collections/
│   ├── content/
│   │   ├── posts/
│   │   └── categories/
│   └── user/
│       ├── admins/
│       └── users/
├── components/
│   ├── ui/
│   ├── layout/
│   └── forms/
└── features/
    ├── user-auth/
    └── task-management/

// ❌ INCORRECT - camelCase or PascalCase
src/
├── collections/
│   ├── Content/      // PascalCase
│   └── userData/     // camelCase
```

## Export Naming Rules

### ✅ Component Exports

Use **PascalCase** for React component exports (regardless of filename):

```typescript
// ✅ CORRECT - kebab-case filename, PascalCase export
// slug-component.tsx
export const SlugComponent: React.FC<Props> = ({ ... }) => { ... }

// ✅ CORRECT - kebab-case filename, PascalCase export
// rich-text-renderer.tsx
export const RichTextRenderer: React.FC<Props> = ({ ... }) => { ... }
```

### ✅ Utility Function Exports

Use **camelCase** for utility function exports:

```typescript
// ✅ CORRECT
// generate-preview-path.ts
export const generatePreviewPath = (params: Params) => { ... }

// ✅ CORRECT
// format-date-time.ts
export const formatDateTime = (date: Date) => { ... }
```

### ✅ Type/Interface Exports

Use **PascalCase** for TypeScript types and interfaces:

```typescript
// ✅ CORRECT
export interface UserProfile { ... }
export type ApiResponse<T> = { ... }
export const USER_ROLES = { ... } as const
```

## Import Path Consistency

### ✅ Relative Imports

Use relative imports with correct case sensitivity:

```typescript
// ✅ CORRECT
import { RichTextRenderer } from '../components/rich-text-renderer'
import { generatePreviewPath } from '../../lib/generate-preview-path'

// ❌ INCORRECT - wrong case
import { RichTextRenderer } from '../components/RichTextRenderer'
```

### ✅ Absolute Imports

Use absolute imports with `@/` alias and correct case:

```typescript
// ✅ CORRECT
import { RichTextRenderer } from '@/components/rich-text-renderer'
import { generatePreviewPath } from '@/lib/generate-preview-path'

// ❌ INCORRECT - wrong case
import { RichTextRenderer } from '@/components/RichTextRenderer'
```

## Special Cases

### ✅ Index Files

Use `index.ts` or `index.tsx` for barrel exports:

```typescript
// ✅ CORRECT
src / components / ui / index.ts
src / lib / hooks / index.ts
```

### ✅ Test Files

Use `.test.ts` or `.spec.ts` suffix with same naming as source:

```typescript
// ✅ CORRECT
src/
├── components/
│   ├── user-profile-card.tsx
│   └── user-profile-card.test.tsx
└── lib/
    ├── format-date-time.ts
    └── format-date-time.test.ts
```

## Migration Guide

When renaming files to follow these conventions:

1. **Rename the file** using `git mv` to preserve history
2. **Update all imports** that reference the old filename
3. **Update any dynamic imports** or path references
4. **Test the changes** to ensure no broken imports

```bash
# Example migration
git mv RichTextRenderer.tsx rich-text-renderer.tsx
# Then update imports in all files that reference it
```

## Additional Context

- **kebab-case**: `multi-word-file-name.tsx`
- **PascalCase**: `MultiWordComponentName`
- **camelCase**: `multiWordVariableName`
- **SCREAMING_SNAKE_CASE**: `CONSTANT_VALUES_ONLY`

These conventions align with modern JavaScript/TypeScript ecosystem standards and improve code maintainability.

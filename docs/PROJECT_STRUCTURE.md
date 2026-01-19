# Project Structure Guide

## 📁 Complete Directory Structure

```
payload-starter-blank/
├── .cursorrules                 # Cursor AI rules and guidelines
├── .gitignore                  # Git ignore patterns
├── .prettierrc                 # Prettier configuration
├── .vscode/                    # VS Code settings
│   └── settings.json           # Editor configuration
├── components.json             # shadcn/ui configuration
├── DEVELOPMENT.md              # Development guidelines
├── PROJECT_STRUCTURE.md        # This file
├── README.md                   # Project overview
├── docker-compose.yml          # Docker configuration
├── Dockerfile                  # Docker image definition
├── eslint.config.mjs           # ESLint configuration
├── next.config.mjs             # Next.js configuration
├── next-env.d.ts               # Next.js type definitions
├── package.json                # Dependencies and scripts
├── pnpm-lock.yaml              # Package lock file
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.cjs         # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── turbo.json                  # Turbo build configuration
└── src/                        # Source code
    ├── app/                    # Next.js App Router
    │   ├── (frontend)/         # Public-facing pages
    │   │   ├── layout.tsx      # Frontend layout
    │   │   └── page.tsx        # Homepage
    │   ├── (payload)/          # PayloadCMS admin & API
    │   │   ├── admin/          # Admin panel
    │   │   │   ├── [[...segments]]/
    │   │   │   │   ├── not-found.tsx
    │   │   │   │   └── page.tsx
    │   │   │   └── importMap.js
    │   │   ├── api/            # API routes
    │   │   │   ├── [...slug]/
    │   │   │   │   └── route.ts
    │   │   │   ├── graphql/
    │   │   │   │   └── route.ts
    │   │   │   └── graphql-playground/
    │   │   │       └── route.ts
    │   │   ├── custom.scss     # Custom admin styles
    │   │   └── layout.tsx      # PayloadCMS layout
    │   ├── globals.css         # Global styles
    │   └── my-route/           # Custom API route
    │       └── route.ts
    ├── collections/            # PayloadCMS collections
    │   ├── Media.ts            # Media collection
    │   └── Users.ts            # Users collection
    ├── components/             # Reusable components
    │   └── ui/                 # shadcn/ui components
    │       ├── avatar.tsx      # Avatar component
    │       ├── badge.tsx       # Badge component
    │       ├── button.tsx      # Button component
    │       ├── card.tsx        # Card components
    │       ├── navigation-menu.tsx
    │       ├── separator.tsx   # Separator component
    │       └── tabs.tsx        # Tabs components
    ├── lib/                    # Utilities and configurations
    │   ├── avatar.ts           # Avatar generation utilities
    │   ├── constants.ts        # Application constants
    │   ├── utils.ts            # General utilities (cn function)
    │   └── validations.ts      # Validation utilities
    ├── types/                  # TypeScript type definitions
    │   └── index.ts            # Common types
    ├── payload-types.ts        # Generated PayloadCMS types
    └── payload.config.ts       # PayloadCMS configuration
```

## 🎯 Key Principles

### 1. **KISS (Keep It Simple, Stupid)**

- Simple, readable code over complex solutions
- Clear naming conventions
- Minimal dependencies
- Straightforward file organization

### 2. **DRY (Don't Repeat Yourself)**

- Extract common patterns into utilities
- Reusable components
- Shared constants and types
- Centralized configuration

### 3. **Single Responsibility**

- Each file has one clear purpose
- Components do one thing well
- Utilities are focused and specific
- Clear separation of concerns

## 📂 Directory Explanations

### `/src/app/` - Next.js App Router

- **`(frontend)/`** - Public-facing pages and layouts
- **`(payload)/`** - PayloadCMS admin panel and API routes
- **`globals.css`** - Global styles and CSS variables

### `/src/components/` - Reusable Components

- **`ui/`** - shadcn/ui components (don't modify directly)
- **`[feature]/`** - Feature-specific components (create as needed)

### `/src/lib/` - Utilities and Configurations

- **`utils.ts`** - General utilities (cn function, etc.)
- **`constants.ts`** - Application constants
- **`avatar.ts`** - Avatar generation utilities
- **`validations.ts`** - Form validation utilities

### `/src/types/` - TypeScript Definitions

- **`index.ts`** - Common types and interfaces
- **`payload-types.ts`** - Generated by PayloadCMS (don't edit)

### `/src/collections/` - PayloadCMS Collections

- Define your content models here
- Each collection is a separate file
- Follow PayloadCMS naming conventions

## 🛠️ File Naming Conventions

### Components

- **PascalCase**: `UserProfile.tsx`, `ProductCard.tsx`
- **Descriptive names**: `UserProfile` not `Profile`
- **Feature grouping**: `user/UserProfile.tsx`

### Pages

- **lowercase with hyphens**: `user-settings.tsx`, `product-detail.tsx`
- **Route-based naming**: Follow Next.js App Router conventions

### Utilities

- **camelCase**: `formatDate.ts`, `generateAvatar.ts`
- **Descriptive names**: `formatDate` not `dateUtils`

### Types

- **PascalCase with suffixes**: `UserProps`, `ApiResponse`, `FormData`
- **Descriptive suffixes**: `Props`, `Config`, `Response`

## 🎨 Component Organization

### Component Structure

```typescript
// 1. Imports (organized by type)
import React from 'react'
import { Button } from '@/components/ui/button'

// 2. Types and interfaces
interface ComponentProps {
  // props definition
}

// 3. Component definition
export function Component({ prop1, prop2 }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState()

  // 5. Event handlers
  const handleClick = () => {}

  // 6. Render
  return <div>{/* JSX */}</div>
}
```

### File Organization

```
components/
├── ui/                    # shadcn/ui components
├── forms/                 # Form components
│   ├── ContactForm.tsx
│   └── UserForm.tsx
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── features/              # Feature-specific components
    ├── user/
    │   ├── UserCard.tsx
    │   └── UserList.tsx
    └── product/
        ├── ProductCard.tsx
        └── ProductGrid.tsx
```

## 🔧 Configuration Files

### `.cursorrules`

- AI coding assistant rules
- Code quality guidelines
- Best practices enforcement

### `.vscode/settings.json`

- Editor configuration
- Formatting rules
- TypeScript settings
- Tailwind CSS integration

### `tsconfig.json`

- TypeScript configuration
- Path mapping (`@/*` → `./src/*`)
- Compiler options

### `tailwind.config.cjs`

- Tailwind CSS configuration
- Design system tokens
- Custom utilities

## 🚀 Development Workflow

### 1. **Adding New Components**

```bash
# Install shadcn/ui component
npx shadcn@latest add [component-name]

# Create custom component
touch src/components/[feature]/[ComponentName].tsx
```

### 2. **Adding New Pages**

```bash
# Create new page
touch src/app/(frontend)/[page-name]/page.tsx

# Create API route
touch src/app/(payload)/api/[endpoint]/route.ts
```

### 3. **Adding New Collections**

```bash
# Create new collection
touch src/collections/[CollectionName].ts
```

### 4. **Adding New Utilities**

```bash
# Create utility file
touch src/lib/[utility-name].ts

# Create type definitions
touch src/types/[type-name].ts
```

## 📋 Best Practices

### 1. **File Organization**

- Keep related files together
- Use clear, descriptive names
- Follow consistent patterns
- Group by feature when possible

### 2. **Import Organization**

```typescript
// 1. React and Next.js
import React from 'react';
import Image from 'next/image';

// 2. Third-party libraries
import { getPayload } from 'payload';

// 3. Internal utilities
import { cn } from '@/lib/utils';
import type { User } from '@/types';

// 4. Components
import { Button } from '@/components/ui/button';

// 5. Local imports
import { UserCardProps } from './types';
```

### 3. **Type Safety**

- Use TypeScript interfaces
- Leverage PayloadCMS generated types
- Create specific types for components
- Avoid `any` types

### 4. **Performance**

- Use Next.js Image component
- Implement proper loading states
- Optimize bundle size
- Use server components when possible

This structure ensures maintainability, scalability, and developer experience while following modern React and Next.js best practices.

# structure-folder-organization

Maintain consistent folder structure following the established project conventions for Next.js App Router, PayloadCMS, and shadcn/ui integration.

## Why It Matters

Consistent folder structure provides:
- Predictable file locations for all team members
- Clear separation of concerns between different parts of the application
- Easy navigation and maintenance
- Scalable architecture as the project grows

## Incorrect Example

```typescript
// ❌ Bad: Inconsistent folder structure
src/
├── components/        # All components mixed together
├── pages/            # Using pages router instead of app router
├── utils.ts          # All utilities in one file
├── types/            # Types mixed with other files
├── payload.ts        # Payload config in wrong location
```

## Correct Example

```typescript
// ✅ CORRECT: Modern folder structure with feature-based architecture
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # Public-facing pages
│   │   ├── layout.tsx     # Frontend layout
│   │   └── page.tsx       # Landing page
│   ├── (payload)/         # PayloadCMS admin & API routes
│   │   ├── admin/         # Admin panel
│   │   └── api/           # API routes
│   ├── api/               # Custom API routes (separate from PayloadCMS)
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components (shadcn/ui)
│   ├── layout/           # Layout-specific components
│   ├── forms/            # Form-related components
│   └── icons/            # Icon components and SVGs
├── collections/          # PayloadCMS collections (PascalCase)
├── features/             # Feature-based architecture (modern pattern)
│   └── auth/             # Authentication feature
│       ├── components/   # Feature-specific components
│       ├── services/     # Feature business logic
│       ├── context/      # React context providers
│       ├── hooks/        # Feature-specific hooks
│       └── utils/        # Feature utilities
├── lib/                  # Utilities and configurations
│   ├── hooks/            # Custom React hooks
│   ├── access/           # PayloadCMS access control logic
│   ├── constants/        # Application constants (organized by domain)
│   ├── avatar.ts         # Avatar generation utilities
│   ├── utils.ts          # General utilities
│   └── validations.ts    # Form validation utilities
├── types/                # TypeScript type definitions
├── payload.config.ts     # PayloadCMS configuration
└── payload-types.ts      # Generated PayloadCMS types
```

## Alternative Modern Structure

For larger applications, consider this enhanced structure:

```typescript
src/
├── app/                    # Next.js App Router (route groups)
├── components/            # Shared/reusable components
│   ├── ui/               # shadcn/ui design system
│   └── common/           # Application-specific shared components
├── features/             # Feature-based modules (recommended for scaling)
│   ├── auth/             # Authentication feature
│   ├── dashboard/        # Dashboard feature
│   └── admin/            # Admin feature
├── lib/                  # Core utilities and configurations
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── validations/      # Validation schemas
│   └── constants/        # Application constants
├── collections/          # PayloadCMS collections
├── types/                # TypeScript definitions
├── hooks/                # Global custom hooks (alternative to lib/hooks)
└── config/               # Configuration files
```

## Additional Context

- Use Next.js App Router (`src/app/`) instead of Pages Router
- Separate frontend pages (`(frontend)`) from PayloadCMS routes (`(payload)`)
- Keep shadcn/ui components in dedicated `ui/` folder under `components/`
- Organize PayloadCMS collections in `collections/` directory with PascalCase naming
- Place utilities in `lib/` with descriptive filenames and subdirectories for organization
- Keep generated types in root-level files and organize custom types in `types/` directory
- Use consistent naming conventions: PascalCase for components/classes, camelCase for utilities, kebab-case for multi-word files
- Consider feature-based architecture (`features/`) for larger applications to improve scalability
- Separate custom API routes from PayloadCMS API routes for better organization
- Use `lib/hooks/` for shared custom hooks and feature-specific hooks within feature directories
- Organize access control logic in `lib/access/` for better maintainability
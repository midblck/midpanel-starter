# structure-feature-architecture

Use feature-based architecture to organize code by business domains and improve scalability for larger applications.

## Why It Matters

Feature-based architecture provides:
- Clear separation of business concerns
- Easier maintenance and refactoring
- Better code organization as the application grows
- Improved developer experience with focused feature development
- Simplified testing of individual features
- Reduced coupling between different parts of the application

## Incorrect Example

```typescript
// ❌ Bad: Mixed concerns across the application
src/
├── components/
│   ├── UserProfile.tsx
│   ├── UserSettings.tsx
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx
│   ├── AuthLogin.tsx
│   ├── AuthRegister.tsx
│   └── DashboardStats.tsx
├── hooks/
│   ├── useUser.ts
│   ├── useProduct.ts
│   ├── useAuth.ts
│   └── useDashboard.ts
├── services/
│   ├── userApi.ts
│   ├── productApi.ts
│   ├── authApi.ts
│   └── dashboardApi.ts
└── types/
    ├── user.ts
    ├── product.ts
    ├── auth.ts
    └── dashboard.ts
```

## Correct Example

```typescript
// ✅ CORRECT: Feature-based architecture
src/
├── features/             # Feature modules
│   ├── auth/             # Authentication feature
│   │   ├── components/   # Feature-specific components
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── protected-route.tsx
│   │   │   └── index.ts
│   │   ├── services/     # Feature business logic
│   │   │   ├── auth-api.ts
│   │   │   ├── identity.ts
│   │   │   └── index.ts
│   │   ├── hooks/        # Feature-specific hooks
│   │   │   ├── use-auth.ts
│   │   │   ├── use-login.ts
│   │   │   └── index.ts
│   │   ├── context/      # React context providers
│   │   │   └── auth-context.tsx
│   │   ├── utils/        # Feature utilities
│   │   │   └── password-validation.ts
│   │   ├── types/        # Feature-specific types
│   │   │   └── auth.types.ts
│   │   ├── constants.ts  # Feature constants
│   │   ├── index.ts      # Feature barrel exports
│   │   └── README.md     # Feature documentation
│   ├── dashboard/        # Dashboard feature
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   └── products/         # Products feature
│       ├── components/
│       ├── services/
│       ├── hooks/
│       └── types/
├── components/          # Shared components
│   ├── ui/             # Design system (shadcn/ui)
│   └── common/         # Application-wide shared components
└── lib/                # Core utilities
    ├── hooks/          # Shared custom hooks
    ├── utils/          # Shared utilities
    └── constants/      # Global constants
```

## Feature Structure Guidelines

### Feature Directory Structure

```
feature-name/
├── components/         # UI components specific to this feature
├── services/           # Business logic, API calls, data transformations
├── hooks/              # Custom hooks specific to this feature
├── context/            # React context providers (if needed)
├── utils/              # Feature-specific utility functions
├── types/              # TypeScript types specific to this feature
├── constants.ts        # Feature-specific constants
├── index.ts            # Barrel exports for clean imports
└── README.md           # Feature documentation
```

### When to Use Feature-Based Architecture

**Use features when:**
- Application has multiple distinct business domains
- Team size > 3 developers
- Features can be developed independently
- Need to scale the codebase for future growth
- Want to enable feature flags or micro-frontend patterns

**Consider simpler structure when:**
- Small application with < 5 main screens
- Single developer or very small team
- Simple CRUD operations without complex business logic
- Proof of concept or MVP development

### Feature Organization Principles

**1. Single Responsibility**
Each feature should handle one business domain (auth, products, dashboard, etc.)

**2. Self-Contained**
Features should minimize dependencies on other features. Use shared components and utilities for common functionality.

**3. Clear Boundaries**
Use index.ts files for clean public APIs. Keep internal implementation details private.

**4. Consistent Naming**
Use consistent naming patterns across all features (components/, services/, hooks/, etc.)

**5. Documentation**
Include README.md files explaining the feature's purpose and usage.

### Import Patterns

```typescript
// ✅ GOOD: Clean feature imports
import { LoginForm, useAuth, authApi } from '@/features/auth'

// ❌ AVOID: Deep imports (breaks encapsulation)
import LoginForm from '@/features/auth/components/login-form'
import { useAuth } from '@/features/auth/hooks/use-auth'
```

### Shared vs Feature-Specific Code

**Feature-specific (keep in feature):**
- Business logic unique to the feature
- UI components specific to the feature
- Custom hooks for feature state
- Feature-specific types and constants

**Shared (move to common areas):**
- Generic UI components (buttons, forms, modals)
- Utility functions used across features
- Global types and constants
- Core business logic used by multiple features

## Additional Context

- Start with a simple structure and refactor to features when scaling becomes necessary
- Use feature flags for gradual rollout of new features
- Consider creating a `features/index.ts` for easy feature imports
- Document feature boundaries and responsibilities
- Use consistent folder structure across all features
- Consider feature-specific testing directories if using comprehensive testing strategies
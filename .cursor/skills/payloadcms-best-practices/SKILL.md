---
name: payloadcms-best-practices
description: PayloadCMS + Next.js + shadcn/ui Best Practices - comprehensive development guidelines and rules for building maintainable, performant, and scalable PayloadCMS applications. Combines project .cursorrules with extensive best practices covering collections, admin panels, API routes, TypeScript, and shadcn/ui integration.
license: MIT
metadata:
  author: cursor
  version: '2.0.0'
---

# PayloadCMS Best Practices

Comprehensive development guide for PayloadCMS applications with Next.js 15, TypeScript, and shadcn/ui components. This skill combines the project's .cursorrules foundation with extensive best practices and patterns for building maintainable, performant, and scalable admin panels and frontend applications.

## When to Apply

Reference these guidelines when:

- Setting up new PayloadCMS collections or fields
- Implementing admin panel customizations
- Building Next.js pages with PayloadCMS data
- Reviewing code for PayloadCMS best practices
- Optimizing build performance and bundle size
- Ensuring proper TypeScript usage and error handling
- Integrating shadcn/ui components correctly
- Following project conventions and patterns

## Rule Categories by Priority

| Priority | Category                  | Impact      | Prefix               |
| -------- | ------------------------- | ----------- | -------------------- |
| 1        | Build & Performance       | CRITICAL    | `build-`             |
| 2        | Folder Structure          | HIGH        | `structure-`         |
| 3        | Development Rules         | HIGH        | `dev-`               |
| 4        | Code Quality              | HIGH        | `quality-`           |
| 5        | PayloadCMS Integration    | CRITICAL    | `payload-`           |
| 6        | TypeScript & Type Safety  | HIGH        | `typescript-`        |
| 7        | Component Architecture    | MEDIUM      | `component-`         |
| 8        | Error Handling            | MEDIUM      | `error-`             |
| 9        | Performance Optimization  | MEDIUM-HIGH | `performance-`       |
| 10       | Accessibility & UX        | LOW-MEDIUM  | `accessibility-`     |
| 11       | Styling Guidelines        | MEDIUM      | `styling-`           |
| 12       | Import Organization       | MEDIUM      | `import-`            |
| 13       | Code Splitting            | MEDIUM      | `splitting-`         |
| 14       | Linter & Typecheck        | CRITICAL    | `lint-`              |
| 15       | Structured Logging        | HIGH        | `logging-`           |
| 16       | KISS Principle            | HIGH        | `kiss-`              |
| 16       | Reusability               | MEDIUM      | `reuse-`             |
| 17       | Development Workflow      | LOW         | `workflow-`          |
| 19       | Feature Architecture      | MEDIUM      | `structure-feature-` |
| 20       | PayloadCMS Fields         | HIGH        | `payload-field-`     |
| 21       | PayloadCMS Access Control | CRITICAL    | `payload-access-`    |
| 22       | PayloadCMS Hooks          | HIGH        | `payload-hook-`      |
| 23       | PayloadCMS Upload         | MEDIUM      | `payload-upload-`    |
| 24       | PayloadCMS Admin          | MEDIUM      | `payload-admin-`     |

## Quick Reference

### 1. Build & Performance (CRITICAL)

- `build-commands` - Use proper build commands for different scenarios
- `build-performance-standards` - Follow performance targets and standards

### 2. Folder Structure (HIGH)

- `structure-folder-organization` - Maintain consistent folder structure
- `structure-naming-conventions` - Follow naming conventions for files and components

### 3. Development Rules (HIGH)

- `dev-component-organization` - Structure components with clear separation of concerns
- `dev-typescript-best-practices` - Use proper TypeScript patterns and avoid any types
- `dev-shadcn-integration` - Properly integrate shadcn/ui components
- `logging-structured` - Use structured logging instead of console statements

### 4. Code Quality (HIGH)

- `quality-error-handling` - Implement proper error handling patterns
- `quality-performance-optimization` - Apply performance optimizations appropriately
- `quality-accessibility` - Ensure components are accessible
- `quality-constants-file` - Use constants file for static data
- `quality-import-organization` - Organize imports in proper order

### 5. PayloadCMS Integration (CRITICAL)

- `payload-builtin-functions-priority` - Always use PayloadCMS built-in functions first
- `payload-auth-hooks` - Use PayloadCMS auth hooks for client-side authentication
- `payload-collection-structure` - Follow proper collection configuration patterns
- `payload-relationship-fields` - Use proper relationship field configurations
- `payload-api-routes` - Structure API routes using PayloadCMS patterns

### 18. PayloadCMS Fields (HIGH)

- `payload-field-types` - Use appropriate PayloadCMS field types and configurations

### 19. PayloadCMS Access Control (CRITICAL)

- `payload-access-control` - Implement proper access control patterns

### 20. PayloadCMS Hooks (HIGH)

- `payload-collection-hooks` - Use PayloadCMS collection hooks for business logic

### 21. PayloadCMS Upload (MEDIUM)

- `payload-upload-configuration` - Configure upload fields and media collections properly

### 22. PayloadCMS Admin (MEDIUM)

- `payload-admin-customization` - Customize PayloadCMS admin panels for optimal UX

### 6. TypeScript & Type Safety (HIGH)

- `typescript-generated-types` - Use PayloadCMS generated types
- `typescript-explicit-types` - Avoid any types, use explicit interfaces
- `typescript-collection-configs` - Type collection configurations properly
- `typescript-api-responses` - Type API route responses and requests

### 7. Component Architecture (MEDIUM)

- `component-shadcn-integration` - Properly integrate shadcn/ui with PayloadCMS data
- `component-organization` - Structure components with clear separation of concerns
- `component-reusable-patterns` - Extract reusable components when used 3+ times
- `component-props-interfaces` - Define clear prop interfaces for components

### 8. Error Handling (MEDIUM)

- `error-payload-operations` - Handle PayloadCMS operation errors gracefully
- `error-api-routes` - Implement proper error handling in API routes
- `error-user-feedback` - Provide meaningful error messages to users
- `error-boundary-components` - Use error boundaries for component failures

### 9. Performance Optimization (MEDIUM-HIGH)

- `performance-query-optimization` - Optimize PayloadCMS queries with proper limits and where clauses
- `performance-code-splitting` - Use dynamic imports for heavy components
- `performance-static-data` - Pre-compute static data in constants
- `performance-image-optimization` - Use Next.js Image component for media fields
- `performance-avatar-caching` - Cache avatar generation utilities

### 10. Accessibility & UX (LOW-MEDIUM)

- `accessibility-form-labels` - Ensure all form fields have proper labels
- `accessibility-keyboard-navigation` - Support keyboard navigation in admin panels
- `accessibility-loading-states` - Provide loading states and feedback
- `accessibility-semantic-html` - Use semantic HTML elements

### 11. Styling Guidelines (MEDIUM)

- `styling-tailwind-usage` - Use design tokens and semantic classes
- `styling-responsive-design` - Implement mobile-first responsive design

### 12. Import Organization (MEDIUM)

- `import-order-conventions` - Organize imports in proper order

### 13. Code Splitting (MEDIUM)

- `splitting-component-splitting` - Split large components appropriately
- `splitting-route-splitting` - Use dynamic imports for routes
- `splitting-library-splitting` - Import only what you need

### 14. Linter & Typecheck (CRITICAL)

- `lint-always-run` - Always run linter and typecheck before changes
- `lint-follow-rules` - Follow linter rules and fix errors
- `lint-workflow` - Integrate linting into development workflow

### 15. KISS Principle (HIGH)

- `kiss-avoid-over-engineering` - Keep solutions simple, avoid unnecessary complexity
- `kiss-start-simple` - Start with simple solutions, add complexity only when needed

### 16. Reusability (MEDIUM)

- `reuse-when-to-extract` - Extract reusable code only when it adds value
- `reuse-patterns` - Follow proper reusability patterns
- `reuse-checklist` - Use checklist to determine when to extract

### 17. Development Workflow (LOW)

- `workflow-build-commands` - Use proper build commands for different scenarios
- `workflow-folder-structure` - Maintain consistent folder structure
- `workflow-naming-conventions` - Follow naming conventions for files and components

### 18. Feature Architecture (MEDIUM)

- `structure-feature-architecture` - Use feature-based architecture for scalable applications

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/payload-builtin-functions-priority.md
rules/lint-always-run.md
rules/kiss-avoid-over-engineering.md
```

Each rule file contains:

- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`

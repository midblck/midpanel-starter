# shadcn/ui + Tailwind CSS Setup

This project has been configured with shadcn/ui and Tailwind CSS for modern, accessible UI components.

## What's Been Added

### Dependencies

- `tailwindcss` - Utility-first CSS framework
- `@tailwindcss/postcss` - PostCSS plugin for Tailwind
- `autoprefixer` - CSS vendor prefixing
- `clsx` - Utility for constructing className strings
- `tailwind-merge` - Merge Tailwind classes intelligently
- `@radix-ui/*` - Headless UI primitives (installed by shadcn/ui)
- `lucide-react` - Icon library
- `class-variance-authority` - Component variant management

### Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration with shadcn/ui theme
- `postcss.config.js` - PostCSS configuration
- `components.json` - shadcn/ui configuration
- `src/lib/utils.ts` - Utility functions for className merging

### Styles

- `src/app/globals.css` - Global styles with Tailwind directives and CSS variables for theming

### Components

- `src/components/ui/button.tsx` - Button component
- `src/components/ui/card.tsx` - Card component family
- `src/components/test-component.tsx` - Test component to verify setup

## Usage

### Adding New shadcn/ui Components

```bash
pnpm dlx shadcn@latest add [component-name]
```

### Using Components

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### Styling with Tailwind CSS

```tsx
<div className="flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900">
  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Hello World</h1>
</div>
```

## Features

- ✅ Dark mode support with CSS variables
- ✅ Responsive design utilities
- ✅ Accessible components built on Radix UI
- ✅ TypeScript support
- ✅ Customizable theme system
- ✅ Modern gradient backgrounds
- ✅ Smooth transitions and animations

## Development

Start the development server:

```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000` with the new shadcn/ui styling applied.

## Customization

### Theme Colors

Edit the CSS variables in `src/app/globals.css` to customize the color scheme.

### Component Variants

Modify component files in `src/components/ui/` to customize component behavior and styling.

### Tailwind Configuration

Update `tailwind.config.js` to add custom utilities, colors, or breakpoints.

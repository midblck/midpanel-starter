# Icon System

This project uses a hybrid icon system that supports both hardcoded SVG components and external SVG files.

## Usage

### Basic Usage

```tsx
import { Icon } from '@/components/icons';

// Use any registered SVG icon
<Icon name="arrow-left" size="md" />
<Icon name="user" size="lg" className="text-blue-500" />
<Icon name="settings" size="sm" color="red" strokeWidth={2} />
```

### Available Icons

The following SVG icons are available:

- `arrow-left`, `arrow-right`
- `check`, `close`
- `edit`, `plus`, `trash`
- `user`, `settings`
- `search`, `filter`
- `download`, `upload`
- `eye`, `eye-off`
- `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`
- `menu`, `x`
- `home`, `calendar`, `clock`
- `star`, `heart`, `share`
- `copy`, `external-link`

### Sizes

- `xs` - 12px (w-3 h-3)
- `sm` - 16px (w-4 h-4)
- `md` - 20px (w-5 h-5) - default
- `lg` - 24px (w-6 h-6)
- `xl` - 32px (w-8 h-8)

### Props

```tsx
interface IconProps {
  name: string | IconName; // Icon name (type-safe for SVG icons)
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string; // Additional CSS classes
  color?: string; // Icon color (default: 'currentColor')
  strokeWidth?: number; // Stroke width for SVG icons (default: 1.5)
}
```

## Adding New Icons

### Method 1: Add SVG File (Recommended)

1. Add your SVG file to `src/components/icons/svg/`
2. Import it in `src/components/icons/svg/index.ts`
3. Add it to the `iconRegistry` object
4. The icon will be automatically available

Example:

```typescript
// In svg/index.ts
import MyIcon from './my-icon.svg';

export const iconRegistry = {
  // ... existing icons
  'my-icon': MyIcon,
} as const;
```

### Method 2: Hardcoded Component

For complex icons or special cases, you can add them directly to the main `Icon` component:

```tsx
// In index.tsx
switch (name) {
  case 'google':
    return <GoogleIcon className={cn(sizeClass, className)} />;
  case 'my-special-icon':
    return <MySpecialIcon className={cn(sizeClass, className)} />;
  // ...
}
```

## Features

- **Type Safety**: Icon names are type-checked for SVG icons
- **Loading States**: Automatic loading indicators for SVG icons
- **Error Handling**: Fallback display for missing icons
- **Performance**: Lazy loading of SVG components
- **Accessibility**: Proper ARIA labels and semantic markup
- **Styling**: Full Tailwind CSS support with size variants

## Examples

```tsx
// Basic usage
<Icon name="user" />

// With custom styling
<Icon
  name="settings"
  size="lg"
  className="text-blue-500 hover:text-blue-700"
/>

// With custom color and stroke
<Icon
  name="edit"
  color="red"
  strokeWidth={2}
  size="sm"
/>

// In a button
<Button>
  <Icon name="plus" size="sm" className="mr-2" />
  Add Item
</Button>
```

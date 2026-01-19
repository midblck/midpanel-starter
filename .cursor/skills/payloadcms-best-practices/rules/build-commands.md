# build-commands

Use proper build commands for different development and production scenarios to ensure optimal performance and development experience.

## Why It Matters

Different build commands serve different purposes:
- Development builds need fast iteration and debugging
- Production builds require optimization and performance
- Utility commands help with maintenance and analysis

## Incorrect Example

```bash
# ❌ Bad: Using wrong commands for scenarios
npm run build          # Slow production build for development
npm start             # Production server for development
# No cleaning before builds
# No bundle analysis
```

## Correct Example

```bash
# ✅ CORRECT: Development builds
pnpm dev              # Start dev server
pnpm devsafe          # Clean dev build and start

# ✅ CORRECT: Production builds
pnpm build            # Full production build (8GB memory)
pnpm build:fast       # Fast build (4GB memory)
pnpm start            # Start production server

# ✅ CORRECT: Utility commands
pnpm clean            # Clean all build directories
pnpm analyze          # Bundle analysis
```

## Additional Context

- Use `pnpm dev` for standard development with hot reloading
- Use `pnpm devsafe` when you need a clean development build
- Use `pnpm build` for production with full optimization (8GB memory)
- Use `pnpm build:fast` for faster builds during development (4GB memory)
- Use `pnpm clean` to clear build artifacts when switching between build types
- Use `pnpm analyze` to inspect bundle size and optimization opportunities
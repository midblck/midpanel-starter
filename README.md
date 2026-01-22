# Midblck Admin Starter

A modern, production-ready PayloadCMS admin starter template built with Next.js 15, TypeScript, and shadcn/ui components. This template provides a complete foundation for building sophisticated admin panels with beautiful UI components and powerful content management capabilities.

## ✨ Features

### 🚀 Core Technologies

- **PayloadCMS 3.72.0** - Modern headless CMS with TypeScript
- **Next.js 16.1.3** - Latest React framework with App Router
- **React 19.2.3** - Modern React with concurrent features
- **TypeScript 5.7.3** - Full type safety and developer experience
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **MongoDB** - Flexible document database

### 🎨 UI & Design

- **Modern Dashboard** - Clean, responsive admin interface
- **Dark/Light Theme** - Built-in theme switching
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant components
- **Beautiful Components** - shadcn/ui component library

### 📊 Admin Features

- **Task Management** - Kanban boards and task lists
- **User Management** - Role-based access control
- **Media Management** - File uploads and optimization
- **OAuth Integration** - Google OAuth authentication
- **Real-time Updates** - Live data synchronization
- **Advanced Filtering** - Search and filter capabilities

### 🛠️ Developer Experience

- **Hot Reload** - Fast development with Next.js
- **Type Safety** - Full TypeScript support
- **Code Splitting** - Optimized bundle sizes
- **Performance** - Build time ~2.5min (30% improvement)
- **Turborepo** - Enhanced build performance
- **Automated Code Quality** - ESLint, Prettier, and lint-staged
- **Pre-commit Hooks** - Automatic formatting and linting
- **CI/CD Integration** - GitHub Actions with quality checks
- **Cross-Editor Consistency** - EditorConfig and VS Code settings

## 🚀 Quick Start

### Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- pnpm 9+ or 10+
- MongoDB database

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mahdyarief/midblck-admin-starter.git
   cd midblck-admin-starter
   ```

2. **Set up development environment**

   ```bash
   pnpm setup:dev
   ```

   This command will:
   - Install all dependencies
   - Set up git hooks for automated code quality
   - Run initial code formatting
   - Configure your development environment

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   DATABASE_URI=mongodb://localhost:27017/midblck-admin
   PAYLOAD_SECRET=your-secret-key
   NEXT_PUBLIC_GOOGLE_REDIRECT_URI=your-public-google-redirect-uri
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   UPLOADTHING_TOKEN=your-uploadthing-token
   SMTP_HOST=your-smtp-host
   SMTP_USER=your-smtp-user
   SMTP_PASS=yout-smtp-pass
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - Dashboard: http://localhost:3000/app

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # Public-facing pages
│   │   ├── layout.tsx     # Frontend layout
│   │   └── page.tsx       # Landing page
│   ├── (payload)/         # PayloadCMS admin & API routes
│   │   ├── admin/         # Admin panel
│   │   └── api/           # API routes
│   ├── app/               # Dashboard application pages
│   │   ├── kanban/        # Kanban board pages
│   │   ├── task-list/     # Task management pages
│   │   └── profile/       # User profile pages
│   ├── api/               # Custom API routes
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── collections/           # PayloadCMS collections (organized by domain)
│   ├── configuration/     # App configuration collections
│   │   └── Theme.ts       # Theme settings
│   ├── content/           # Content management collections
│   │   └── Media.ts       # Media uploads and management
│   ├── misc/              # Miscellaneous collections
│   │   ├── Task.ts        # Task management
│   │   ├── TaskStatus.ts  # Task status definitions
│   │   └── TaskType.ts    # Task type categories
│   └── user/              # User management collections
│       ├── Admins.ts      # Admin users
│       ├── Users.ts       # Regular users
│       └── OAuth.ts       # OAuth providers
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui component library
│   ├── layout/           # Layout and navigation components
│   ├── forms/            # Form components and utilities
│   ├── tables/           # Data table components
│   ├── features/         # Feature-specific components
│   ├── icons/            # Icon components and SVG assets
│   ├── kbar/             # Command palette components
│   └── modal/            # Modal and dialog components
├── features/             # Feature-based modules
│   ├── auth/             # Authentication logic and components
│   ├── kanban/           # Kanban board functionality
│   ├── task-list/        # Task management features
│   └── profile/          # User profile management
├── lib/                  # Utilities and shared code
│   ├── access/           # PayloadCMS access control
│   ├── constants/        # Application constants
│   ├── fields/           # Custom PayloadCMS fields
│   ├── hooks/            # Custom React hooks
│   ├── translations/     # Internationalization
│   ├── utils.ts          # General utility functions
│   ├── validations.ts    # Form validation schemas
│   └── groups.ts         # Component groups configuration
├── i18n/                 # Internationalization configuration
├── types/                # TypeScript type definitions
├── utilities/            # Utility functions
└── payload.config.ts     # PayloadCMS configuration
```

## 🎯 Key Collections

### Users

- Email authentication
- Role-based access (Customer/Premium)
- OAuth integration
- Last login tracking

### Tasks

- Title, description, priority
- Status relationships
- Assignee management
- Due dates and ordering
- Task type categorization

### Media

- File uploads with optimization
- Multiple image sizes
- Focal point selection
- Manual resizing capabilities

## 🛠️ Development

### Available Scripts

```bash
# Setup & Development
pnpm setup:dev        # Set up development environment with hooks
pnpm dev              # Start development server
pnpm dev:clean        # Clean dev build and start

# Production
pnpm build            # Full production build (8GB memory)
pnpm start            # Start production server

# Code Quality & Formatting
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
pnpm format:fix       # Format and fix linting issues
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix linting issues
pnpm typecheck        # TypeScript type checking
pnpm ci:check         # Run full CI checks (typecheck, lint, format)

# Utilities
pnpm clean            # Clean all build directories
pnpm clean:dev        # Clean development build
pnpm clean:build      # Clean production build
pnpm analyze          # Bundle analysis

# Turborepo (Enhanced Performance)
pnpm turbo:dev        # Start dev server with Turborepo
pnpm turbo:build      # Build with Turborepo caching
pnpm turbo:lint       # Run linting with Turborepo
```

### Code Quality & Automation

This project implements enterprise-grade automated code quality that runs across all environments:

#### 🛠️ **Code Quality Tools**

- **Prettier** - Automated code formatting with consistent style rules
- **ESLint** - TypeScript-aware linting with auto-fix capabilities
- **lint-staged** - Runs quality tools only on staged files for efficiency
- **Husky** - Git hooks for automated pre-commit quality checks
- **EditorConfig** - Cross-editor consistency (spaces, line endings, etc.)
- **GitHub Actions** - CI/CD pipeline with automated quality validation
- **Structured Logging** - Pino-based logging with correlation IDs and error tracking

#### 🔄 **Automatic Code Quality**

Code formatting and linting happen automatically in multiple contexts:

- **💾 On Save**: Prettier formats files automatically in supported editors
- **🔗 Pre-commit**: lint-staged runs formatting + linting on staged files
- **🚀 CI/CD**: GitHub Actions validates formatting on every PR/push
- **👥 Team Consistency**: Same rules apply regardless of editor or environment
- **⚡ Manual Control**: Run `pnpm format`, `pnpm lint:fix`, or `pnpm ci:check` anytime

#### 📋 **Quality Gates**

The project enforces these quality standards:

- ✅ **Consistent Code Style** - Prettier formatting rules
- ✅ **TypeScript Best Practices** - ESLint with strict type checking
- ✅ **No Unformatted Code** - Pre-commit hooks prevent bad commits
- ✅ **CI Validation** - Automated checks on all pull requests
- ✅ **Cross-Platform Consistency** - Works on Windows, macOS, Linux

### 📊 **Structured Logging**

This project implements enterprise-grade structured logging for better observability and debugging:

#### **🚀 Logging Features**

- **Pino-based Logger** - High-performance JSON logging
- **Correlation IDs** - Trace requests across distributed systems
- **Error Codes** - Unique identifiers for issue tracking
- **Request Scoping** - Context-aware logging per request
- **Environment Aware** - Different behaviors for dev/prod
- **Rich Metadata** - Component, action, and user context

#### **📝 Usage Examples**

```typescript
// Basic logging
logInfo('User created', { userId: '123', component: 'UserService' })
logError('Database error', error, { component: 'Database', operation: 'find' })

// API route logging
const requestLogger = createRequestLogger()
requestLogger.apiError('/api/users', 'POST', error)

// Performance monitoring
logPerformance('user-creation', 150, { component: 'UserService' })

// Security events
logSecurity('login-attempt', { userId: '123', ip: '192.168.1.1' })
```

#### **🔍 Log Levels**

- **DEBUG** - Development-only detailed information
- **INFO** - General information about operations
- **WARN** - Warning conditions that don't stop execution
- **ERROR** - Error conditions with error codes and context

**Never use `console.log/error/warn` - always use the structured logger!**

---

### 🚀 **Development Workflow**

#### **For New Developers**

```bash
git clone <repository>
cd midblck-admin-starter
pnpm setup:dev  # Sets up everything automatically
```

#### **Daily Development**

```bash
pnpm dev                    # Start development
# Code is automatically formatted on save
# Pre-commit hooks ensure quality
```

#### **Before Pushing**

```bash
pnpm ci:check              # Run all quality checks locally
```

#### **CI/CD Pipeline**

- ✅ Automatic formatting checks
- ✅ TypeScript type checking
- ✅ ESLint validation
- ✅ Build verification

### Build Performance & Quality

#### ⚡ **Performance Optimizations**

- **Development Build**: ~2.5min (30% improvement with Turborepo)
- **Memory Optimization**: 4GB (fast) / 8GB (production builds)
- **Code Splitting**: Automatic route-based splitting
- **Bundle Analysis**: Built-in webpack analyzer (`pnpm analyze`)

#### 🔧 **Quality Integration**

- **Pre-build Formatting**: Code is automatically formatted before builds
- **Type Checking**: Full TypeScript validation in CI/CD
- **Linting**: ESLint checks run as part of build process
- **Consistency**: Same quality standards across all environments

## 🎨 UI Components

This starter includes a comprehensive set of shadcn/ui components:

- **Layout**: Sidebar, Header, Breadcrumbs
- **Forms**: Input, Select, Textarea, Checkbox
- **Data Display**: Table, Card, Badge, Avatar
- **Navigation**: Tabs, Navigation Menu
- **Feedback**: Alert, Dialog, Tooltip
- **Interactive**: Button, Dropdown, Popover

## 🔐 Authentication

### Built-in Features

- Email/password authentication
- Google OAuth integration
- JWT token management
- Role-based access control
- Session management

### OAuth Setup

1. Configure Google OAuth credentials
2. Set up OAuth collection in PayloadCMS
3. Enable OAuth login in user settings

## 📊 Dashboard Features

### Task Management

- **Kanban Board**: Drag-and-drop task organization
- **Task List**: Table view with advanced filtering
- **Priority Management**: Low, Medium, High, Critical
- **Status Tracking**: Custom status workflows
- **Assignee Management**: User assignment and tracking

### Analytics

- User activity tracking
- Task completion metrics
- Performance insights
- Real-time updates

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Docker

```bash
# Build Docker image
docker build -t midblck-admin-starter .

# Run with docker-compose
docker-compose up -d
```

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🔧 Configuration

### PayloadCMS Configuration

- Collections defined in `/src/collections/`
- Admin panel customization
- API routes configuration
- Database connection settings

### Next.js Configuration

- App Router setup
- Middleware configuration
- Environment variables
- Build optimization

## 📚 Documentation

- [PayloadCMS Docs](https://payloadcms.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PayloadCMS](https://payloadcms.com) - Amazing headless CMS
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS

## 📞 Support

- [GitHub Issues](https://github.com/mahdyarief/midblck-admin-starter/issues)
- [Discord Community](https://discord.gg/payload)
- [Documentation](https://payloadcms.com/docs)

---

**Built with ❤️ using PayloadCMS, Next.js, and shadcn/ui**

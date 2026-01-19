# Midblck Admin Starter

A modern, production-ready PayloadCMS admin starter template built with Next.js 15, TypeScript, and shadcn/ui components. This template provides a complete foundation for building sophisticated admin panels with beautiful UI components and powerful content management capabilities.

## ✨ Features

### 🚀 Core Technologies

- **PayloadCMS 3.59.1** - Modern headless CMS with TypeScript
- **Next.js 15** - Latest React framework with App Router
- **TypeScript** - Full type safety and developer experience
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
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
- **ESLint & Prettier** - Code quality tools

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

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   DATABASE_URI=mongodb://localhost:27017/midblck-admin
   PAYLOAD_SECRET=your-secret-key
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - Dashboard: http://localhost:3000/dashboard

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
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── collections/           # PayloadCMS collections
│   ├── Admins.ts          # Admin users
│   ├── Users.ts           # Regular users
│   ├── Tasks.ts           # Task management
│   ├── Media.ts           # Media uploads
│   └── OAuth.ts            # OAuth providers
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   └── tables/           # Data table components
├── features/             # Feature-based modules
│   ├── auth/             # Authentication
│   ├── kanban/           # Kanban board
│   ├── task-list/        # Task management
│   └── profile/           # User profiles
├── lib/                  # Utilities and configurations
│   ├── constants/        # Application constants
│   ├── utils.ts          # General utilities
│   └── validations.ts    # Form validation
└── types/                # TypeScript definitions
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
# Development
pnpm dev              # Start development server
pnpm devsafe          # Clean dev build and start

# Production
pnpm build            # Full production build (8GB memory)
pnpm build:fast       # Fast build (4GB memory)
pnpm start            # Start production server

# Utilities
pnpm clean            # Clean all build directories
pnpm analyze          # Bundle analysis
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript type checking

# Turborepo (Enhanced Performance)
pnpm turbo:dev        # Start dev server with Turborepo
pnpm turbo:build      # Build with Turborepo caching
pnpm turbo:lint       # Run linting with Turborepo
```

### Build Performance

- **Development Build**: ~2.5min (30% improvement)
- **Memory Optimization**: 4GB (fast) / 8GB (production)
- **Code Splitting**: Automatic route-based splitting
- **Bundle Analysis**: Built-in webpack analyzer

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

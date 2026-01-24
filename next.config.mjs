import { withPayload } from '@payloadcms/next/withPayload'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Separate build directories for dev and production
  // Vercel uses .next for production builds automatically
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',

  // React Strict Mode for better development experience and error detection
  reactStrictMode: true,

  // Output configuration
  // - For Vercel: Leave undefined (default) - Vercel handles this automatically
  // - For Docker: Use 'standalone' to enable standalone output for optimized container builds
  output: process.env.DOCKER_BUILD ? 'standalone' : undefined,

  // Image optimization
  // Vercel automatically optimizes images via their CDN
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io', // UploadThing CDN
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Optimize public folder images
    // On Vercel, images are automatically optimized via their CDN
    unoptimized: false,
  },

  // Public folder and static assets configuration
  // Next.js automatically serves files from the public folder
  // Vercel automatically handles public folder assets with optimal caching
  // This configuration ensures proper handling during build and deployment
  async headers() {
    return [
      {
        // Apply caching headers to public folder assets
        // Vercel CDN will respect these headers
        source: '/branding/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache static assets from public folder
        // Works on both Vercel and other platforms
        source: '/:path*.(ico|svg|png|jpg|jpeg|gif|webp|avif|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', '@tabler/icons-react'],
    // Build optimizations
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
    optimizeCss: true, // Optimize CSS in production
  },

  // Server external packages (moved from experimental)
  serverExternalPackages: ['payload'],

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Webpack configuration
  webpack: (webpackConfig, { dev, isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Ensure public folder is included in build output
    // Next.js automatically copies public folder, but we ensure it's not excluded
    if (!isServer) {
      // Public folder assets are automatically handled by Next.js
      // This ensures they're available in the build output
    }

    // Build optimizations
    if (!dev) {
      // Enable caching for faster rebuilds
      webpackConfig.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      }

      // Optimize module resolution
      webpackConfig.resolve.symlinks = false

      // Simple code splitting configuration
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
      }
    }

    return webpackConfig
  },

  // Ensure public folder is included in build
  // Next.js automatically copies public/ to the build output root
  // This is handled automatically, but we document it here for clarity
  // On Vercel, the public folder is automatically included in the deployment
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

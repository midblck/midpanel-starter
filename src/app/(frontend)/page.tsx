import {
  ArrowRight,
  CheckCircle,
  Code,
  Database,
  Image,
  Kanban,
  KeyRound,
  LayoutDashboard,
  ListTodo,
  Moon,
  Palette,
  RefreshCw,
  Shield,
  Users,
  Zap,
} from 'lucide-react';
import { headers as getHeaders } from 'next/headers.js';
import { getPayload } from 'payload';

import { Branding } from '@/components/branding';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { generateAvatarUrl } from '@/lib/avatar';
import { FEATURES, TESTIMONIALS } from '@/lib/constants';
import config from '@/payload.config';

// Static generation settings
export const revalidate = 3600; // 1 hour cache

export default async function HomePage() {
  const headers = await getHeaders();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers });

  // Allow authenticated users to view the landing page
  // They can still access /app via navigation if needed

  // Icon components
  const icons = {
    Database,
    Code,
    Shield,
    Zap,
    Kanban,
    ListTodo,
    KeyRound,
    Palette,
    Users,
    Image,
    Moon,
    RefreshCw,
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Navigation */}
      <nav className='border-b'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <Branding variant='icon' size='md' />
            <div className='flex items-center space-x-4'>
              {user ? (
                <div className='flex items-center space-x-3'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage
                      src={generateAvatarUrl(user.email || 'User')}
                      alt={user.email || 'User'}
                    />
                    <AvatarFallback className='text-xs'>
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className='text-sm text-muted-foreground'>
                    Welcome back
                  </span>
                </div>
              ) : (
                <Button variant='outline' size='sm' asChild>
                  <a href='/auth/sign-in'>Sign In</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='py-24'>
        <div className='container mx-auto px-6'>
          <div className='text-center space-y-8 max-w-4xl mx-auto'>
            <Badge variant='secondary' className='mb-6'>
              <Code className='h-3 w-3 mr-1' />
              Production-Ready Starter
            </Badge>
            <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
              The modern{' '}
              <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                admin starter
              </span>
            </h1>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
              Next.js 15, TypeScript, PayloadCMS, and shadcn/ui components.
              Build production-ready admin panels with Midblck Admin Starter.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
              <Button size='lg' asChild>
                <a href='/auth/sign-up'>
                  Get Started
                  <ArrowRight className='ml-2 h-4 w-4' />
                </a>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <a
                  href='https://payloadcms.com/docs'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  Documentation
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-muted/30'>
        <div className='container mx-auto px-6'>
          <div className='text-center space-y-4 mb-16'>
            <h2 className='text-3xl font-bold'>What's Included?</h2>
            <p className='text-lg text-muted-foreground max-w-xl mx-auto'>
              Everything you need to build modern admin panels and dashboards
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {FEATURES.map((feature, index) => {
              const IconComponent = icons[feature.icon as keyof typeof icons];
              return (
                <Card key={index} className='text-center border-0 shadow-sm'>
                  <CardHeader className='pb-4'>
                    <div className='mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                      <IconComponent className='h-5 w-5' />
                    </div>
                    <CardTitle className='text-lg'>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className='pt-0'>
                    <CardDescription className='text-sm leading-relaxed'>
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-16'>
        <div className='container mx-auto px-6'>
          <div className='text-center space-y-4 mb-12'>
            <h2 className='text-3xl font-bold'>Loved by developers</h2>
            <p className='text-lg text-muted-foreground max-w-xl mx-auto'>
              See what developers are saying about this starter template
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className='border-0 shadow-sm'>
                <CardContent className='pt-6'>
                  <div className='flex items-center space-x-3 mb-4'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage
                        src={generateAvatarUrl(testimonial.name)}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className='text-sm'>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-semibold text-sm'>
                        {testimonial.name}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className='py-16'>
        <div className='container mx-auto px-6'>
          <div className='text-center space-y-4 mb-12'>
            <h2 className='text-3xl font-bold'>Ready to explore?</h2>
            <p className='text-lg text-muted-foreground max-w-xl mx-auto'>
              Try the admin panel and dashboard to see PayloadCMS in action
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
            {/* Admin Panel Card */}
            <Card className='text-center border-0 shadow-sm'>
              <CardHeader className='pb-4'>
                <div className='h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <Shield className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl'>Admin Panel</CardTitle>
                <CardDescription>
                  Manage collections, media, and users with PayloadCMS
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-0'>
                <Button size='lg' asChild>
                  <a
                    href={payloadConfig.routes.admin}
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    Open Admin Panel
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Dashboard Card */}
            <Card className='text-center border-0 shadow-sm'>
              <CardHeader className='pb-4'>
                <div className='h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center'>
                  <LayoutDashboard className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl'>Dashboard</CardTitle>
                <CardDescription>
                  Task management with Kanban boards, tables, and analytics
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-0'>
                <Button size='lg' variant='outline' asChild>
                  <a href='/app'>
                    Open Dashboard
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-muted/30'>
        <div className='container mx-auto px-6'>
          <div className='max-w-2xl mx-auto text-center space-y-8'>
            <div>
              <h2 className='text-3xl font-bold mb-4'>Ready to get started?</h2>
              <p className='text-lg text-muted-foreground'>
                Start building your admin panel with this production-ready
                starter template
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button size='lg' asChild>
                <a href='/auth/sign-up'>
                  Start Building
                  <ArrowRight className='ml-2 h-4 w-4' />
                </a>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <a
                  href='https://github.com/your-username/midblck-admin-starter'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  View on GitHub
                </a>
              </Button>
            </div>
            <Separator className='my-8' />
            <div className='flex items-center justify-center space-x-8 text-sm text-muted-foreground'>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                <span>Production Ready</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                <span>TypeScript</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                <span>MIT License</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t'>
        <div className='container mx-auto px-6 py-8'>
          <div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'>
            <Branding variant='icon' size='sm' />
            <div className='flex items-center space-x-6 text-sm text-muted-foreground'>
              <a
                href='https://payloadcms.com/docs'
                className='hover:text-foreground transition-colors'
              >
                PayloadCMS Docs
              </a>
              <a
                href='https://ui.shadcn.com'
                className='hover:text-foreground transition-colors'
              >
                shadcn/ui
              </a>
              <a
                href='https://nextjs.org/docs'
                className='hover:text-foreground transition-colors'
              >
                Next.js Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

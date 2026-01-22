import { ArrowRight, Shield, LayoutDashboard } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DemoProps {
  adminRoute: string
}

export function Demo({ adminRoute }: DemoProps) {
  return (
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
                <a href={adminRoute} rel='noopener noreferrer' target='_blank'>
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
  )
}

import {
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
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FEATURES } from '@/lib/constants/constants-frontend'

export function Features() {
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
  }

  return (
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
            const IconComponent = icons[feature.icon as keyof typeof icons]
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
            )
          })}
        </div>
      </div>
    </section>
  )
}

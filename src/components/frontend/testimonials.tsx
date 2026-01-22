import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { generateAvatarUrl } from '@/lib/avatar'
import { TESTIMONIALS } from '@/lib/constants/constants-frontend'

export function Testimonials() {
  return (
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
                    <AvatarImage src={generateAvatarUrl(testimonial.name)} alt={testimonial.name} />
                    <AvatarFallback className='text-sm'>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-semibold text-sm'>{testimonial.name}</p>
                    <p className='text-xs text-muted-foreground'>{testimonial.role}</p>
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
  )
}

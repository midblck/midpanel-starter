import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import { Navigation, Hero, Features, Testimonials, Demo, CTA, Footer } from '@/components/frontend'
import config from '@/payload.config'

// Static generation settings
export const revalidate = 3600 // 1 hour cache

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Allow authenticated users to view the landing page
  // They can still access /app via navigation if needed

  return (
    <div className='min-h-screen bg-background'>
      <Navigation user={user} />
      <Hero />
      <Features />
      <Testimonials />
      <Demo adminRoute={payloadConfig.routes.admin} />
      <CTA />
      <Footer />
    </div>
  )
}

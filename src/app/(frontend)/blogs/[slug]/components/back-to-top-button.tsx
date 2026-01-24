'use client'

import { useEffect, useState } from 'react'

import { ArrowUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'

type Heading = {
  id: string
  text: string
  level: number
  slug: string
}

type BackToTopButtonProps = {
  headings?: Heading[] // Array of headings to detect last nav item
  className?: string
}

export function BackToTopButton({ headings, className }: BackToTopButtonProps) {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (!headings || headings.length === 0) {
      // Fallback to bottom detection if no headings provided
      const handleScroll = () => {
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const scrollBottom = scrollTop + windowHeight
        const distanceFromBottom = documentHeight - scrollBottom
        const isNearBottom = distanceFromBottom <= 200 || scrollBottom >= documentHeight - 10
        setShowButton(isNearBottom)
      }

      handleScroll()
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }

    // Detect when last nav item is active
    const lastHeading = headings[headings.length - 1]
    let observer: IntersectionObserver | null = null
    let cleanup: (() => void) | null = null

    // Wait for DOM to be ready
    const timeoutId = setTimeout(() => {
      const lastHeadingElement = document.getElementById(lastHeading.id)

      if (!lastHeadingElement) {
        return
      }

      // Check scroll position to determine if last heading is visible or passed
      const handleScroll = () => {
        const rect = lastHeadingElement.getBoundingClientRect()
        const viewportHeight = window.innerHeight

        // Show button when:
        // 1. Last heading is visible in viewport
        // 2. Last heading has been scrolled past
        const isLastHeadingVisible = rect.top < viewportHeight && rect.bottom > 0
        const isPastLastHeading = rect.top < viewportHeight

        if (isLastHeadingVisible || isPastLastHeading) {
          setShowButton(true)
        } else {
          // Hide button when we're clearly above the last heading
          setShowButton(false)
        }
      }

      // Use IntersectionObserver as primary detection method
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            // Show button when last heading enters viewport or is past
            if (entry.isIntersecting) {
              setShowButton(true)
            } else {
              // Check if we've scrolled past it
              const rect = entry.boundingClientRect
              if (rect.top < window.innerHeight) {
                setShowButton(true)
              } else {
                setShowButton(false)
              }
            }
          })
        },
        {
          root: null,
          rootMargin: '0px 0px -50% 0px', // Trigger when heading is in bottom half of viewport
          threshold: [0, 0.1, 0.5, 1],
        },
      )

      observer.observe(lastHeadingElement)

      // Also use scroll listener as backup
      handleScroll() // Initial check
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })

      cleanup = () => {
        if (observer) {
          observer.disconnect()
        }
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (cleanup) {
        cleanup()
      }
    }
  }, [headings])

  if (!showButton) {
    return null
  }

  return (
    <div className={cn('flex justify-center', className)}>
      <Button
        variant='outline'
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }}
      >
        <ArrowUp className='w-4 h-4 mr-2' />
        Back to Top
      </Button>
    </div>
  )
}

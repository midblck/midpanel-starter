'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/cn'

type Heading = {
  id: string
  text: string
  level: number
  slug: string
}

type TableOfContentProps = {
  headings: Heading[]
  label?: string
  labelOffset?: number
  scrollOffset?: number
}

export function TableOfContent({
  headings,
  label = 'Table of Contents',
  labelOffset = 112,
  scrollOffset = 96,
}: TableOfContentProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})

  useEffect(() => {
    if (headings.length === 0) return

    let observer: IntersectionObserver | null = null

    const timeoutId = setTimeout(() => {
      headings.forEach(heading => {
        const element = document.getElementById(heading.id)
        if (element) {
          sectionRefs.current[heading.id] = element
        }
      })

      const sections = Object.keys(sectionRefs.current)

      // Scroll-based detection for sidebar
      const findActiveHeading = () => {
        let closestId: string | null = null
        let closestDistance = Infinity

        sections.forEach(sectionId => {
          const element = sectionRefs.current[sectionId]
          if (element) {
            const rect = element.getBoundingClientRect()
            const distance = Math.abs(rect.top - labelOffset)
            if (rect.top <= labelOffset + 100 && distance < closestDistance) {
              closestDistance = distance
              closestId = sectionId
            }
          }
        })

        if (closestId) {
          setActiveSection(closestId)
        }
      }

      const handleScroll = () => {
        findActiveHeading()
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Initial check

      observer = new IntersectionObserver(
        () => {
          findActiveHeading()
        },
        {
          root: null,
          rootMargin: `-${labelOffset}px 0px -50% 0px`,
          threshold: [0, 0.1, 0.5, 1],
        },
      )

      sections.forEach(sectionId => {
        const element = sectionRefs.current[sectionId]
        if (element) {
          observer?.observe(element)
        }
      })

      return () => {
        window.removeEventListener('scroll', handleScroll)
        if (observer) {
          observer.disconnect()
        }
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [headings, labelOffset])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setActiveSection(id)

    const element = document.getElementById(id)
    if (element) {
      const rect = element.getBoundingClientRect()
      const scrollTop = window.scrollY + rect.top - scrollOffset
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <div>
      <span className='font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-0'>
        {label}
      </span>
      <nav className='mt-4 text-sm'>
        <ul className='space-y-1'>
          {headings.map(heading => {
            const isActive = activeSection === heading.id
            const indentClass =
              heading.level === 2
                ? ''
                : heading.level === 3
                  ? 'ml-4'
                  : heading.level === 4
                    ? 'ml-8'
                    : heading.level === 5
                      ? 'ml-12'
                      : 'ml-16'

            return (
              <li key={heading.id} className={indentClass}>
                <a
                  href={`#${heading.id}`}
                  onClick={e => handleClick(e, heading.id)}
                  className={cn(
                    'block py-1 transition-colors duration-200 text-sm',
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-primary',
                  )}
                >
                  {heading.text}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'

import RichText from '@/components/admin/rich-text'

type Heading = {
  id: string
  text: string
  level: number
  slug: string
}

type RichTextWithIdsProps = {
  data: unknown
  headings: Heading[]
  className?: string
  enableGutter?: boolean
  enableProse?: boolean
}

export function RichTextWithIds({
  data,
  headings,
  className,
  enableGutter = false,
  enableProse = true,
}: RichTextWithIdsProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current || headings.length === 0) return

    // Add IDs to headings based on the headings array
    // Match by level and text content, in order
    const headingElements = Array.from(contentRef.current.querySelectorAll('h1, h2, h3, h4'))
    const usedIds = new Set<string>()

    headingElements.forEach(element => {
      const level = parseInt(element.tagName.toLowerCase().substring(1))
      const text = element.textContent?.trim() || ''

      // Find matching heading from our extracted headings
      const matchingHeading = headings.find(
        h => h.level === level && h.text === text && !usedIds.has(h.id),
      )

      if (matchingHeading && !element.id) {
        element.id = matchingHeading.id
        usedIds.add(matchingHeading.id)
      } else if (!element.id && text) {
        // Fallback: generate ID from text if no match found
        const fallbackId = text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
        element.id = fallbackId
      }
    })
  }, [headings])

  return (
    <div ref={contentRef}>
      <RichText
        data={data}
        className={className}
        enableGutter={enableGutter}
        enableProse={enableProse}
      />
    </div>
  )
}

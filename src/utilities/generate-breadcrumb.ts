import type { BreadcrumbItem } from '@/types/breadcrumb'

/**
 * Generate breadcrumb items for blog pages
 */
export function generateBreadcrumb(options: {
  slug: string
  title: string
  locale?: string
  middleItems?: BreadcrumbItem[]
}): BreadcrumbItem[] {
  const { title, middleItems = [] } = options

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Home',
      url: '/',
      isHome: true,
      isCurrent: false,
    },
    ...middleItems,
    {
      label: 'Blog',
      url: '/blogs',
      isHome: false,
      isCurrent: false,
    },
    {
      label: title,
      url: null, // Current page has no URL
      isHome: false,
      isCurrent: true,
    },
  ]

  return breadcrumbs
}

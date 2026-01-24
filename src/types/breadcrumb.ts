export interface BreadcrumbItem {
  label: string
  url: string | null
  isHome?: boolean
  isCurrent?: boolean
}

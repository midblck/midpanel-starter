import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  category?: string
  search?: string
  onPageChange?: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  category,
  search,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    if (category) params.set('category', category)
    if (search) params.set('search', encodeURIComponent(search))
    return `${baseUrl}?${params.toString()}`
  }

  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i)
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  return (
    <div className='flex justify-center'>
      <div className='flex gap-2'>
        {/* Previous Button */}
        {currentPage > 1 && (
          <Button
            variant='outline'
            onClick={() => onPageChange?.(currentPage - 1)}
            asChild={!onPageChange}
          >
            {onPageChange ? 'Previous' : <Link href={buildUrl(currentPage - 1)}>Previous</Link>}
          </Button>
        )}

        {/* Page Numbers */}
        {getPageNumbers().map(pageNumber => (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? 'default' : 'outline'}
            onClick={() => pageNumber !== currentPage && onPageChange?.(pageNumber)}
            asChild={!onPageChange && pageNumber !== currentPage}
          >
            {pageNumber === currentPage ? (
              pageNumber.toString()
            ) : onPageChange ? (
              pageNumber.toString()
            ) : (
              <Link href={buildUrl(pageNumber)}>{pageNumber}</Link>
            )}
          </Button>
        ))}

        {/* Next Button */}
        {currentPage < totalPages && (
          <Button
            variant='outline'
            onClick={() => onPageChange?.(currentPage + 1)}
            asChild={!onPageChange}
          >
            {onPageChange ? 'Next' : <Link href={buildUrl(currentPage + 1)}>Next</Link>}
          </Button>
        )}
      </div>
    </div>
  )
}

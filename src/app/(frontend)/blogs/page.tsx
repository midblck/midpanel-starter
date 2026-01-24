/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import '@/app/globals.css'
import { useEffect, useState } from 'react'

import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Client-side data fetching functions
const fetchPosts = async ({
  page = 1,
  limit = 12,
  category,
  search,
}: {
  page?: number
  limit?: number
  category?: string
  search?: string
}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (category && category !== 'all') {
    params.set('category', category)
  }

  if (search) {
    params.set('search', search)
  }

  const response = await fetch(`/api/blogs/posts?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  return response.json()
}

const fetchCategories = async () => {
  const response = await fetch('/api/blogs/categories')

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  return response.json()
}

export default function BlogsPage() {
  // State management
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter state
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [postsData, categoriesData] = await Promise.all([
          fetchPosts({ page: 1, limit: 12 }),
          fetchCategories(),
        ])

        setPosts(postsData.posts)
        setTotalPages(postsData.totalPages)
        setTotalDocs(postsData.totalDocs)
        setCategories(categoriesData)
      } catch (err) {
        setError('Failed to load blog posts')
        console.error('Error loading blog data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Handle filtering
  const handleSearch = async () => {
    try {
      setLoading(true)
      setError(null)
      setPage(1) // Reset to first page when searching

      const categoryValue = category === 'all' ? undefined : category
      const postsData = await fetchPosts({
        page: 1,
        limit: 12,
        category: categoryValue,
        search: search || undefined,
      })

      setPosts(postsData.posts)
      setTotalPages(postsData.totalPages)
      setTotalDocs(postsData.totalDocs)
    } catch (err) {
      setError('Failed to search posts')
      console.error('Error searching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle page change
  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true)
      setError(null)
      setPage(newPage)

      const categoryValue = category === 'all' ? undefined : category
      const postsData = await fetchPosts({
        page: newPage,
        limit: 12,
        category: categoryValue,
        search: search || undefined,
      })

      setPosts(postsData.posts)
      setTotalPages(postsData.totalPages)
      setTotalDocs(postsData.totalDocs)

      // Scroll to top of posts
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError('Failed to load page')
      console.error('Error loading page:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header Section */}
      <div className='mb-12'>
        <h1 className='text-4xl font-bold mb-4'>Blog</h1>
        <p className='text-gray-600 text-lg'>
          Discover insights, tutorials, and stories from our team.
        </p>
      </div>

      {/* Search and Filters */}
      <div className='mb-8'>
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Search Input */}
          <div className='flex-1'>
            <Input
              type='text'
              placeholder='Search posts...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Category Filter */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className='w-full md:w-48'>
              <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Filter'}
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800'>
          {error}
        </div>
      )}

      {/* Results Count */}
      {!error && (
        <div className='mb-6 text-gray-600'>
          {loading ? 'Loading posts...' : `Showing ${posts.length} of ${totalDocs} posts`}
        </div>
      )}

      {/* Posts Grid */}
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
        {loading
          ? // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className='animate-pulse'>
                <div className='aspect-[3/2] bg-gray-200 rounded-lg mb-4'></div>
                <div className='space-y-3'>
                  <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/4'></div>
                </div>
              </div>
            ))
          : posts.map((post: any) => <PostCard key={post.id} post={post} />)}
      </div>

      {/* Pagination */}
      {!loading && posts.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl='/blogs'
          category={category}
          search={search}
          onPageChange={handlePageChange}
        />
      )}

      {/* No Posts Found */}
      {!loading && posts.length === 0 && !error && (
        <div className='text-center py-12'>
          <h2 className='text-2xl font-semibold mb-4'>No posts found</h2>
          <p className='text-gray-600'>
            {search || (category && category !== 'all')
              ? 'Try adjusting your search or filter criteria.'
              : 'Check back later for new content.'}
          </p>
        </div>
      )}
    </div>
  )
}

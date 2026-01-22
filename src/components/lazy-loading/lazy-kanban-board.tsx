'use client'

import { KanbanSkeleton } from '@/components/loading/kanban-skeleton'
import { lazy, Suspense } from 'react'

// Only lazy load the heavy KanbanBoard component
const KanbanBoard = lazy(() =>
  import('@/features/kanban/components/kanban-board').then(module => ({
    default: module.KanbanBoard,
  }))
)

export function LazyKanbanBoard() {
  return (
    <Suspense fallback={<KanbanSkeleton />}>
      <KanbanBoard />
    </Suspense>
  )
}

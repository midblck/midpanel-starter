import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function KanbanSkeleton() {
  return (
    <div className='space-y-4'>
      {/* Kanban board skeleton */}
      <div className='flex gap-4 overflow-x-auto pb-4'>
        {Array.from({ length: 4 }).map((_, columnIndex) => (
          <Card key={columnIndex} className='w-80 flex-shrink-0'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-3 w-3 rounded-full' />
                  <div>
                    <Skeleton className='h-4 w-20 mb-1' />
                    <Skeleton className='h-3 w-32' />
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-5 w-6 rounded-full' />
                  <Skeleton className='h-6 w-6' />
                </div>
              </div>
            </CardHeader>
            <CardContent className='pt-0 space-y-2 min-h-[200px]'>
              {Array.from({ length: 3 }).map((_, taskIndex) => (
                <Card key={taskIndex} className='p-4'>
                  <div className='space-y-3'>
                    {/* Task title and menu */}
                    <div className='flex items-start justify-between'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-4 w-4' />
                    </div>

                    {/* Drag indicator */}
                    <div className='flex items-center gap-1'>
                      <Skeleton className='h-3 w-3' />
                      <Skeleton className='h-3 w-16' />
                    </div>

                    {/* Priority badge */}
                    <Skeleton className='h-5 w-16 rounded-full' />

                    {/* Task types */}
                    <div className='flex items-center gap-1 flex-wrap'>
                      <Skeleton className='h-3 w-3' />
                      <Skeleton className='h-5 w-12 rounded-full' />
                      <Skeleton className='h-5 w-16 rounded-full' />
                    </div>

                    {/* Assignee and due date */}
                    <div className='flex items-center justify-between text-xs'>
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-1'>
                          <Skeleton className='h-3 w-3' />
                          <Skeleton className='h-3 w-12' />
                        </div>
                        <div className='flex items-center gap-1'>
                          <Skeleton className='h-3 w-3' />
                          <Skeleton className='h-3 w-16' />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Add task button */}
              <Skeleton className='w-full h-8 rounded-md' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

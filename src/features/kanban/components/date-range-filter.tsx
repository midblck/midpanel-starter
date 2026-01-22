'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTaskStore } from '@/features/kanban'
import { Filter } from 'lucide-react'
import { useState } from 'react'

export function DateRangeFilter() {
  const { dateFilter, setDateFilter } = useTaskStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleToggleFilter = (enabled: boolean) => {
    setDateFilter(enabled, dateFilter.startDate, dateFilter.endDate)
  }

  const handleStartDateChange = (startDate: string) => {
    setDateFilter(dateFilter.enabled, startDate, dateFilter.endDate)
  }

  const handleEndDateChange = (endDate: string) => {
    setDateFilter(dateFilter.enabled, dateFilter.startDate, endDate)
  }

  const handlePreset = (preset: 'today' | 'week' | 'month' | 'clear') => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    switch (preset) {
      case 'today':
        setDateFilter(true, todayStr, todayStr)
        break
      case 'week':
        const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        setDateFilter(true, todayStr, weekEnd.toISOString().split('T')[0])
        break
      case 'month':
        const monthEnd = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
        setDateFilter(true, todayStr, monthEnd.toISOString().split('T')[0])
        break
      case 'clear':
        setDateFilter(false, null, null)
        break
    }
    setIsOpen(false)
  }

  const getFilterSummary = () => {
    if (!dateFilter.enabled) {
      return 'All tasks'
    }

    if (dateFilter.startDate && dateFilter.endDate) {
      if (dateFilter.startDate === dateFilter.endDate) {
        return `Due on ${new Date(dateFilter.startDate).toLocaleDateString()}`
      }
      return `Due ${new Date(dateFilter.startDate).toLocaleDateString()} - ${new Date(dateFilter.endDate).toLocaleDateString()}`
    }

    if (dateFilter.startDate) {
      return `Due after ${new Date(dateFilter.startDate).toLocaleDateString()}`
    }

    if (dateFilter.endDate) {
      return `Due before ${new Date(dateFilter.endDate).toLocaleDateString()}`
    }

    return 'All tasks'
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='h-8 sm:h-10 w-full sm:w-auto touch-manipulation text-xs sm:text-sm px-3 sm:px-4 rounded-md compact-mobile'
        >
          <Filter className='mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0' />
          <span className='truncate'>{getFilterSummary()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[calc(100vw-2rem)] sm:w-80' align='start'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='enable-filter'
                checked={dateFilter.enabled}
                onCheckedChange={handleToggleFilter}
              />
              <Label htmlFor='enable-filter' className='text-sm font-medium'>
                Filter by due date
              </Label>
            </div>
          </div>

          {dateFilter.enabled && (
            <div className='space-y-3'>
              <div className='space-y-2'>
                <Label htmlFor='start-date' className='text-sm'>
                  Start Date
                </Label>
                <Input
                  id='start-date'
                  type='date'
                  value={dateFilter.startDate || ''}
                  onChange={e => handleStartDateChange(e.target.value)}
                  className='h-9'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='end-date' className='text-sm'>
                  End Date
                </Label>
                <Input
                  id='end-date'
                  type='date'
                  value={dateFilter.endDate || ''}
                  onChange={e => handleEndDateChange(e.target.value)}
                  className='h-9'
                />
              </div>

              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Quick Presets</Label>
                <div className='grid grid-cols-2 gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePreset('today')}
                    className='h-10 sm:h-8 text-xs touch-manipulation'
                  >
                    Today
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePreset('week')}
                    className='h-10 sm:h-8 text-xs touch-manipulation'
                  >
                    This Week
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePreset('month')}
                    className='h-10 sm:h-8 text-xs touch-manipulation'
                  >
                    This Month
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePreset('clear')}
                    className='h-10 sm:h-8 text-xs touch-manipulation'
                  >
                    Clear Filter
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

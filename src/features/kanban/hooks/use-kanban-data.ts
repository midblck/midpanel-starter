'use client'

import { fetchKanbanTasks, fetchTaskStatuses, fetchTaskTypes } from '../services'
import type { Task, Status, TaskType } from '../store'
import { useCallback } from 'react'
import useSWR from 'swr'

export function useKanbanTasks() {
  const {
    data: tasks,
    error,
    isLoading,
    mutate,
  } = useSWR<Task[]>('kanban-tasks', fetchKanbanTasks, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
    errorRetryCount: 3,
  })

  const refreshTasks = useCallback(() => {
    mutate()
  }, [mutate])

  const updateTaskOptimistically = useCallback(
    (updatedTask: Task) => {
      mutate(currentTasks => {
        if (!currentTasks) return currentTasks
        return currentTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
      }, false)
    },
    [mutate]
  )

  const addTaskOptimistically = useCallback(
    (newTask: Task) => {
      mutate(currentTasks => {
        if (!currentTasks) return [newTask]
        return [...currentTasks, newTask]
      }, false)
    },
    [mutate]
  )

  const removeTaskOptimistically = useCallback(
    (taskId: string) => {
      mutate(currentTasks => {
        if (!currentTasks) return currentTasks
        return currentTasks.filter(task => task.id !== taskId)
      }, false)
    },
    [mutate]
  )

  return {
    tasks: tasks || [],
    isLoading,
    error,
    refreshTasks,
    updateTaskOptimistically,
    addTaskOptimistically,
    removeTaskOptimistically,
  }
}

export function useKanbanStatuses() {
  const {
    data: statuses,
    error,
    isLoading,
    mutate,
  } = useSWR<Status[]>('kanban-statuses', fetchTaskStatuses, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // Statuses change less frequently
    errorRetryCount: 3,
  })

  const refreshStatuses = useCallback(() => {
    mutate()
  }, [mutate])

  return {
    statuses: statuses || [],
    isLoading,
    error,
    refreshStatuses,
  }
}

export function useKanbanTypes() {
  const {
    data: types,
    error,
    isLoading,
    mutate,
  } = useSWR<TaskType[]>('kanban-types', fetchTaskTypes, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // Types change less frequently
    errorRetryCount: 3,
  })

  const refreshTypes = useCallback(() => {
    mutate()
  }, [mutate])

  return {
    types: types || [],
    isLoading,
    error,
    refreshTypes,
  }
}

// Combined hook for all kanban data
export function useKanbanData() {
  const tasks = useKanbanTasks()
  const statuses = useKanbanStatuses()
  const types = useKanbanTypes()

  const refreshAll = useCallback(() => {
    tasks.refreshTasks()
    statuses.refreshStatuses()
    types.refreshTypes()
  }, [tasks.refreshTasks, statuses.refreshStatuses, types.refreshTypes])

  return {
    tasks: tasks.tasks,
    statuses: statuses.statuses,
    types: types.types,
    isLoading: tasks.isLoading || statuses.isLoading || types.isLoading,
    error: tasks.error || statuses.error || types.error,
    refreshAll,
    // Individual refresh functions
    refreshTasks: tasks.refreshTasks,
    refreshStatuses: statuses.refreshStatuses,
    refreshTypes: types.refreshTypes,
    // Optimistic update functions
    updateTaskOptimistically: tasks.updateTaskOptimistically,
    addTaskOptimistically: tasks.addTaskOptimistically,
    removeTaskOptimistically: tasks.removeTaskOptimistically,
  }
}

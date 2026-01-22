import { UniqueIdentifier } from '@dnd-kit/core'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createKanbanTask,
  createTaskStatus,
  createTaskType,
  deleteKanbanTask,
  deleteTaskStatus,
  deleteTaskType,
  fetchKanbanTasks,
  fetchTaskStatuses,
  fetchTaskTypes,
  updateKanbanTask,
  updateTaskStatus,
  updateTaskType,
} from './services'
import type { CreateTaskData } from './services/types'
import { logDbError } from '@/utilities/logger'

export type Status = {
  id: string
  name: string
  description?: string
  color: string
  order: number
}

// Default columns will be loaded from TaskStatus collection
const defaultCols: Column[] = []

export type ColumnId = string

export type TaskType = {
  id: string
  name: string
  description?: string
  color: string
  order: number
}

export type Task = {
  id: string
  title: string
  description?: string
  status: Status
  priority?: 'low' | 'medium' | 'high' | 'critical'
  assignee?: string
  dueDate?: string
  taskTypes?: TaskType[]
  order?: number
  createdAt?: string
  updatedAt?: string
}

export type Column = {
  id: string
  title: string
}

export type State = {
  tasks: Task[]
  columns: Column[]
  statuses: Status[]
  taskTypes: TaskType[]
  draggedTask: string | null
  isLoading: boolean
  isTasksLoading: boolean
  isStatusesLoading: boolean
  isTaskTypesLoading: boolean
  dateFilter: {
    enabled: boolean
    startDate: string | null
    endDate: string | null
  }
}

// Initial tasks will be loaded from PayloadCMS
const initialTasks: Task[] = []

export type Actions = {
  addTask: (
    title: string,
    description?: string,
    statusId?: string,
    taskTypes?: string[],
    priority?: 'low' | 'medium' | 'high' | 'critical',
    assignee?: string,
    dueDate?: string
  ) => Promise<void>
  addCol: (title: string) => void
  dragTask: (id: string | null) => void
  removeTask: (id: string) => Promise<void>
  removeCol: (id: UniqueIdentifier) => void
  setTasks: (updatedTask: Task[]) => void
  setCols: (updatedCols: Column[]) => void
  updateTask: (
    id: string,
    updates: Partial<Omit<Task, 'status'>> & { status?: Status | string }
  ) => Promise<void>
  deleteTask: (id: string) => Promise<boolean>
  moveTask: (taskId: string, newStatusId: string, newOrder?: number) => Promise<void>
  loadTasks: () => Promise<void>
  // Status management
  loadStatuses: () => Promise<void>
  addStatus: (statusData: {
    name: string
    description?: string
    color?: string
    order?: number
  }) => Promise<void>
  updateStatus: (id: string, updates: Partial<Status>) => Promise<boolean>
  deleteStatus: (id: string) => Promise<boolean>
  setStatuses: (statuses: Status[]) => void
  // TaskType management
  loadTaskTypes: () => Promise<void>
  addTaskType: (taskTypeData: {
    name: string
    description?: string
    color?: string
    order?: number
  }) => Promise<void>
  updateTaskType: (id: string, updates: Partial<TaskType>) => Promise<boolean>
  deleteTaskType: (id: string) => Promise<boolean>
  setTaskTypes: (taskTypes: TaskType[]) => void
  // Order management
  recalculateColumnOrders: (statusId: string, startIndex?: number) => Promise<void>
  updateStatusOrders: () => Promise<void>
  // Date filter management
  setDateFilter: (enabled: boolean, startDate: string | null, endDate: string | null) => void
  getFilteredTasks: () => Task[]
}

export const useTaskStore = create<State & Actions>()(
  persist(
    set => ({
      tasks: initialTasks,
      columns: defaultCols,
      statuses: [],
      taskTypes: [],
      draggedTask: null,
      isLoading: false,
      isTasksLoading: false,
      isStatusesLoading: false,
      isTaskTypesLoading: false,
      dateFilter: {
        enabled: false,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },

      addTask: async (
        title,
        description,
        statusId = 'todo',
        taskTypes = [],
        priority = 'medium',
        assignee,
        dueDate
      ) => {
        try {
          // Get the highest order in the target status to place new task at top
          let maxOrder = 0
          set(state => {
            const statusTasks = state.tasks.filter((task: Task) => task.status.id === statusId)
            maxOrder =
              statusTasks.length > 0
                ? Math.max(...statusTasks.map((task: Task) => task.order || 0))
                : 0
            return state // Don't update state, just read it
          })

          const newTask = await createKanbanTask({
            title,
            description,
            status: statusId,
            priority,
            assignee,
            dueDate,
            taskTypes,
            order: maxOrder + 1, // Place new task at the top
          })

          if (newTask) {
            set(state => ({
              tasks: [...state.tasks, newTask],
            }))
            toast.success('Task created successfully')
          } else {
            toast.error('Failed to create task')
          }
        } catch (error) {
          logDbError('create-task-store', error)
          toast.error('Failed to create task')
        }
      },

      addCol: title =>
        set(state => ({
          columns: [
            ...state.columns,
            {
              id: uuid(),
              title,
            },
          ],
        })),

      dragTask: id =>
        set(() => ({
          draggedTask: id,
        })),

      removeTask: async id => {
        const success = await deleteKanbanTask(id)
        if (success) {
          set(state => ({
            tasks: state.tasks.filter(task => task.id !== id),
          }))
        }
      },

      removeCol: id =>
        set(state => ({
          columns: state.columns.filter(col => col.id !== id),
        })),

      setTasks: updatedTasks =>
        set(() => ({
          tasks: updatedTasks,
        })),

      setCols: updatedCols =>
        set(() => ({
          columns: updatedCols,
        })),

      updateTask: async (id, updates) => {
        try {
          // Convert Task updates to CreateTaskData format
          const updateData: Partial<CreateTaskData> = {
            ...updates,
            status: typeof updates.status === 'string' ? updates.status : updates.status?.id,
            taskTypes: Array.isArray(updates.taskTypes)
              ? updates.taskTypes.map(tt => (typeof tt === 'string' ? tt : tt.id))
              : undefined,
          }

          const updatedTask = await updateKanbanTask(id, updateData)
          if (updatedTask) {
            set(state => ({
              tasks: state.tasks.map(task => (task.id === id ? updatedTask : task)),
            }))
            toast.success('Task updated successfully')
          } else {
            logDbError('update-task-store-no-response', new Error('No response from API'), {
              taskId: id,
            })
            toast.error('Failed to update task')
          }
        } catch (error) {
          logDbError('update-task-store', error, { taskId: id })
          toast.error('Failed to update task')
        }
      },

      deleteTask: async id => {
        try {
          const success = await deleteKanbanTask(id)
          if (success) {
            set(state => ({
              tasks: state.tasks.filter(task => task.id !== id),
            }))
            return true
          }
          return false
        } catch (error) {
          logDbError('delete-task-store', error, { taskId: id })
          return false
        }
      },

      moveTask: async (taskId, newStatusId, newOrder) => {
        // This function is now handled by updateTask
        // Keeping for backward compatibility but redirecting to updateTask
        const { updateTask } = useTaskStore.getState()
        await updateTask(taskId, {
          status: newStatusId, // Convert string to Status type
          order: newOrder,
        })
      },

      loadTasks: async () => {
        set(state => ({ ...state, isTasksLoading: true }))
        try {
          const tasks = await fetchKanbanTasks()
          set(() => ({ tasks, isTasksLoading: false }))
        } catch (error) {
          logDbError('load-tasks-store', error)
          set(state => ({ ...state, isTasksLoading: false }))
        }
      },

      // Status management actions
      loadStatuses: async () => {
        set(state => ({ ...state, isStatusesLoading: true }))
        try {
          const statuses = await fetchTaskStatuses()

          // If no statuses exist, create some default ones
          if (statuses.length === 0) {
            const defaultStatuses = [
              {
                name: 'Todo',
                color: '#6B7280',
                order: 0,
                description: 'Tasks that need to be started',
              },
              {
                name: 'In Progress',
                color: '#3B82F6',
                order: 1,
                description: 'Tasks currently being worked on',
              },
              {
                name: 'Done',
                color: '#22C55E',
                order: 2,
                description: 'Tasks that are completed',
              },
              {
                name: 'Archive',
                color: '#9CA3AF',
                order: 3,
                description: 'Tasks that are no longer active but kept for reference',
              },
            ]

            const createdStatuses: Status[] = []
            for (const statusData of defaultStatuses) {
              const created = await createTaskStatus(statusData)
              if (created) {
                createdStatuses.push(created)
              }
            }

            set(() => ({
              statuses: createdStatuses,
              columns: createdStatuses.map(status => ({
                id: status.id,
                title: status.name,
              })),
              isStatusesLoading: false,
            }))
          } else {
            // Ensure unique statuses and columns
            const uniqueStatuses = statuses.filter(
              (status, index, self) => index === self.findIndex(s => s.id === status.id)
            )

            set(() => ({
              statuses: uniqueStatuses,
              columns: uniqueStatuses.map(status => ({
                id: status.id,
                title: status.name,
              })),
              isStatusesLoading: false,
            }))
          }
        } catch (error) {
          logDbError('load-statuses-store', error)
          set(state => ({ ...state, isStatusesLoading: false }))
        }
      },

      addStatus: async statusData => {
        try {
          const newStatus = await createTaskStatus(statusData)
          if (newStatus) {
            set(state => {
              // Check if status already exists to prevent duplicates
              const existingStatus = state.statuses.find(s => s.id === newStatus.id)
              if (existingStatus) {
                return state
              }

              return {
                statuses: [...state.statuses, newStatus],
                columns: [
                  ...state.columns,
                  {
                    id: newStatus.id,
                    title: newStatus.name,
                  },
                ],
              }
            })
            toast.success('Status created successfully')
          } else {
            toast.error('Failed to create status')
          }
        } catch (error) {
          logDbError('create-status-store', error, { statusData })
          toast.error('Failed to create status')
        }
      },

      updateStatus: async (id, updates) => {
        try {
          const updatedStatus = await updateTaskStatus(id, updates)
          if (updatedStatus) {
            set(state => ({
              statuses: state.statuses.map(status => (status.id === id ? updatedStatus : status)),
              columns: state.columns.map(col =>
                col.id === id ? { id: updatedStatus.id, title: updatedStatus.name } : col
              ),
            }))
            toast.success('Status updated successfully')
            return true
          } else {
            toast.error('Failed to update status')
            return false
          }
        } catch (error) {
          logDbError('update-status-store', error, { statusId: id, updates })
          toast.error('Failed to update status')
          return false
        }
      },

      deleteStatus: async id => {
        try {
          const success = await deleteTaskStatus(id)
          if (success) {
            // Get current state for fallback logic
            const currentState = useTaskStore.getState()
            const fallbackStatus =
              currentState.statuses.length > 1
                ? currentState.statuses.find((s: Status) => s.id !== id)
                : null

            set(state => {
              const remainingStatuses = state.statuses.filter(status => status.id !== id)

              return {
                statuses: remainingStatuses,
                columns: state.columns.filter(col => col.id !== id),
                // Move tasks with this status to the first available status
                tasks: state.tasks.map((task: Task) =>
                  task.status.id === id && fallbackStatus
                    ? {
                        ...task,
                        status: fallbackStatus,
                      }
                    : task
                ),
              }
            })

            // Update tasks in the database that were using this status
            if (fallbackStatus) {
              const tasksToUpdate = currentState.tasks.filter(task => task.status.id === id)
              for (const task of tasksToUpdate) {
                try {
                  await updateKanbanTask(task.id, {
                    status: fallbackStatus.id,
                  })
                } catch (error) {
                  logDbError('update-task-status-change', error, {
                    taskId: task.id,
                  })
                }
              }
            }

            return true
          }
          return false
        } catch (error) {
          logDbError('delete-status-store', error, { statusId: id })
          return false
        }
      },

      setStatuses: statuses => {
        set(() => ({
          statuses,
          columns: statuses.map(status => ({
            id: status.id,
            title: status.name,
          })),
        }))
      },

      // TaskType management actions
      loadTaskTypes: async () => {
        // Prevent multiple simultaneous loads
        const currentState = useTaskStore.getState()
        if (currentState.isTaskTypesLoading) {
          return
        }

        set(state => ({ ...state, isTaskTypesLoading: true }))
        try {
          const taskTypes = await fetchTaskTypes()

          // Check which preset task types are missing and create them
          const presetTaskTypes = [
            {
              name: 'Bug',
              description: 'Fixing errors, defects, or unexpected behavior',
              color: '#EF4444',
              order: 0,
            },
            {
              name: 'Design',
              description: 'UI, UX, or visual design related tasks',
              color: '#EC4899',
              order: 1,
            },
            {
              name: 'Documentation',
              description: 'Writing or updating documentation and guides',
              color: '#F59E0B',
              order: 2,
            },
            {
              name: 'Feature',
              description: 'New functionality or feature development',
              color: '#3B82F6',
              order: 3,
            },
            {
              name: 'General',
              description: 'General activities and tasks',
              color: '#6B7280',
              order: 4,
            },
            {
              name: 'Improvement',
              description: 'Enhancements or optimizations to existing features',
              color: '#10B981',
              order: 5,
            },
            {
              name: 'Maintenance',
              description: 'System upkeep, refactoring, and routine maintenance',
              color: '#64748B',
              order: 6,
            },
            {
              name: 'Research',
              description: 'Investigation, exploration, or learning tasks',
              color: '#8B5CF6',
              order: 7,
            },
            {
              name: 'Testing',
              description: 'Quality assurance, testing, and validation tasks',
              color: '#14B8A6',
              order: 8,
            },
          ]

          // Check which preset task types don't exist yet
          const existingNames = new Set(taskTypes.map(tt => tt.name))
          const missingTaskTypes = presetTaskTypes.filter(preset => !existingNames.has(preset.name))

          // Create only the missing task types
          if (missingTaskTypes.length > 0) {
            const createdTaskTypes: TaskType[] = []
            for (const taskTypeData of missingTaskTypes) {
              const created = await createTaskType(taskTypeData)
              if (created) {
                createdTaskTypes.push(created)
              }
            }

            // Combine existing and newly created task types
            const allTaskTypes = [...taskTypes, ...createdTaskTypes]
            set(() => ({
              taskTypes: allTaskTypes,
              isTaskTypesLoading: false,
            }))
          } else {
            set(() => ({ taskTypes, isTaskTypesLoading: false }))
          }
        } catch (error) {
          logDbError('load-task-types-store', error)
          set(state => ({ ...state, isTaskTypesLoading: false }))
        }
      },

      addTaskType: async taskTypeData => {
        try {
          const newTaskType = await createTaskType(taskTypeData)
          if (newTaskType) {
            set(state => ({
              taskTypes: [...state.taskTypes, newTaskType],
            }))
            toast.success('Task type created successfully')
          } else {
            toast.error('Failed to create task type')
          }
        } catch (error) {
          logDbError('create-task-type-store', error, { taskTypeData })
          toast.error('Failed to create task type')
        }
      },

      updateTaskType: async (id, updates) => {
        try {
          const updatedTaskType = await updateTaskType(id, updates)
          if (updatedTaskType) {
            set(state => ({
              taskTypes: state.taskTypes.map(taskType =>
                taskType.id === id ? updatedTaskType : taskType
              ),
            }))
            toast.success('Task type updated successfully')
            return true
          } else {
            toast.error('Failed to update task type')
            return false
          }
        } catch (error) {
          logDbError('update-task-type-store', error, {
            taskTypeId: id,
            updates,
          })
          toast.error('Failed to update task type')
          return false
        }
      },

      deleteTaskType: async id => {
        try {
          const success = await deleteTaskType(id)
          if (success) {
            set(state => ({
              taskTypes: state.taskTypes.filter(taskType => taskType.id !== id),
            }))
            return true
          }
          return false
        } catch (error) {
          logDbError('delete-task-type-store', error, { taskTypeId: id })
          return false
        }
      },

      setTaskTypes: taskTypes => {
        set(() => ({ taskTypes }))
      },

      // Helper function to recalculate orders for a column
      recalculateColumnOrders: async (statusId: string, startIndex: number = 0) => {
        const { tasks, updateTask } = useTaskStore.getState()
        const columnTasks = tasks
          .filter((task: Task) => task.status.id === statusId)
          .sort((a: Task, b: Task) => (a.order || 0) - (b.order || 0))

        // Update orders starting from startIndex
        for (let i = startIndex; i < columnTasks.length; i++) {
          const task = columnTasks[i]
          if (task && (task.order ?? 0) !== i) {
            await updateTask(task.id, { order: i })
          }
        }
      },

      // Helper function to update status orders after column reordering
      updateStatusOrders: async () => {
        const { statuses, updateStatus } = useTaskStore.getState()

        try {
          // Update each status with its new order
          for (let i = 0; i < statuses.length; i++) {
            const status = statuses[i]
            if (status && (status.order ?? 0) !== i) {
              await updateStatus(status.id, { order: i })
            }
          }
        } catch (error) {
          logDbError('update-status-orders', error)
        }
      },

      // Date filter management
      setDateFilter: (enabled: boolean, startDate: string | null, endDate: string | null) => {
        set(_state => ({
          dateFilter: {
            enabled,
            startDate,
            endDate,
          },
        }))
      },

      getFilteredTasks: (): Task[] => {
        const { tasks, dateFilter } = useTaskStore.getState()

        if (!dateFilter.enabled) {
          return tasks
        }

        return tasks.filter((task: Task) => {
          // Show tasks with no due date
          if (!task.dueDate) {
            return true
          }

          // Show tasks within the date range
          const taskDate = new Date(task.dueDate).toISOString().split('T')[0]
          const startDate = dateFilter.startDate
          const endDate = dateFilter.endDate

          if (startDate && endDate) {
            return taskDate >= startDate && taskDate <= endDate
          } else if (startDate) {
            return taskDate >= startDate
          } else if (endDate) {
            return taskDate <= endDate
          }

          return true
        })
      },
    }),
    {
      name: 'kanban-store',
      partialize: state => ({
        tasks: state.tasks,
        columns: state.columns,
        statuses: state.statuses,
        taskTypes: state.taskTypes,
        dateFilter: state.dateFilter,
      }),
    }
  )
)

// Kanban feature exports
export { default as AddStatusDialog } from './components/add-status-dialog';
export { BoardColumn, BoardContainer } from './components/board-column';
export { DateRangeFilter } from './components/date-range-filter';
export { default as EditColumnDialog } from './components/edit-column-dialog';
export {
  DropZone,
  DropZoneAfterColumn,
  DropZoneAfterTask,
  InsertionIndicator,
} from './components/insertion-indicator';
export { KanbanBoard } from './components/kanban-board';
export { default as NewTaskDialog } from './components/new-task-dialog';
export { TaskCard } from './components/task-card';

// Store exports
export { useTaskStore } from './store';
export type { Column, ColumnId, Status, Task, TaskType } from './store';

// Hooks exports
export {
  useKanbanData,
  useKanbanTasks,
  useKanbanStatuses,
  useKanbanTypes,
} from './hooks/use-kanban-data';

// Services exports (client-side REST API)
export {
  bulkUpdateKanbanTasks,
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
} from './services';

// Utils exports
export {
  formatDate,
  getPriorityLabel,
  hasDraggableData,
  isColumn,
  isOverdue,
  isTask,
} from './utils';

// Constants exports
export {
  DEFAULT_STATUS_COLORS,
  PRIORITY_CARD_COLORS,
  PRIORITY_COLORS,
  getPriorityCardColors,
  getPriorityColor,
} from './constants';

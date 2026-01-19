// Priority color mappings for consistent styling
export const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
} as const;

// Enhanced priority colors for card borders and badges only
export const PRIORITY_CARD_COLORS = {
  low: {
    border: 'border-l-4 border-l-gray-600 dark:border-l-gray-400',
    // Inline styles for guaranteed application
    borderColor: '#4B5563', // gray-600
    badgeColor: '#4B5563', // gray-600
    badgeBackground: '#F3F4F6', // gray-100
  },
  medium: {
    border: 'border-l-4 border-l-blue-600 dark:border-l-blue-400',
    // Inline styles for guaranteed application
    borderColor: '#2563EB', // blue-600
    badgeColor: '#1E40AF', // blue-800
    badgeBackground: '#DBEAFE', // blue-100
  },
  high: {
    border: 'border-l-4 border-l-orange-600 dark:border-l-orange-400',
    // Inline styles for guaranteed application
    borderColor: '#EA580C', // orange-600
    badgeColor: '#9A3412', // orange-900
    badgeBackground: '#FED7AA', // orange-100
  },
  critical: {
    border: 'border-l-4 border-l-red-600 dark:border-l-red-400',
    // Inline styles for guaranteed application
    borderColor: '#DC2626', // red-600
    badgeColor: '#991B1B', // red-900
    badgeBackground: '#FEE2E2', // red-100
  },
} as const;

// Default status colors for new statuses
export const DEFAULT_STATUS_COLORS = [
  '#6B7280', // Gray
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
] as const;

// Helper function to get priority color class
export const getPriorityColor = (priority: string): string => {
  return (
    PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] ||
    PRIORITY_COLORS.medium
  );
};

// Helper function to get priority card colors
export const getPriorityCardColors = (priority: string) => {
  return (
    PRIORITY_CARD_COLORS[priority as keyof typeof PRIORITY_CARD_COLORS] ||
    PRIORITY_CARD_COLORS.medium
  );
};

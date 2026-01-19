import {
  BarChart3,
  Bell,
  Calendar,
  ChevronRight,
  ChevronsDown,
  CreditCard,
  FileText,
  Home,
  Kanban,
  LayoutDashboard,
  List,
  LogOut,
  Settings,
  Shield,
  ShoppingBag,
  User,
  UserCircle,
} from 'lucide-react';

// Dashboard constants
export const Icons = {
  dashboard: LayoutDashboard,
  home: Home,
  kanban: Kanban,
  list: List,
  user: User,
  settings: Settings,
  product: ShoppingBag,
  billing: CreditCard,
  notifications: Bell,
  logout: LogOut,
  userCircle: UserCircle,
  chevronRight: ChevronRight,
  chevronsDown: ChevronsDown,
  shield: Shield,
  barChart: BarChart3,
  calendar: Calendar,
  fileText: FileText,
};

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  openInNewTab?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/app',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['m', 'd'],
    items: [],
  },
  {
    title: 'Tasks',
    url: '#',
    icon: 'kanban',
    isActive: true,
    items: [
      {
        title: 'Kanban',
        url: '/app/kanban',
        icon: 'kanban',
        shortcut: ['m', 'k'],
      },
      {
        title: 'List',
        url: '/app/task-list',
        icon: 'list',
        shortcut: ['m', 'l'],
      },
    ],
  },
  // {
  //   title: 'Account',
  //   url: '#',
  //   icon: 'user',
  //   isActive: false,
  //   items: [
  //     {
  //       title: 'Profile',
  //       url: '/app/profile',
  //       icon: 'userCircle',
  //       shortcut: ['m', 'p'],
  //     },
  //   ],
  // },
  {
    title: 'Payload Admin',
    url: '/admin',
    icon: 'settings',
    shortcut: ['m', 'p'],
    isActive: false,
    external: false,
    openInNewTab: true,
    items: [],
  },
];

export const company = {
  name: 'MidblckPanel',
  logo: Shield,
  plan: 'Enterprise',
};

export const tenants = [
  { id: '1', name: 'Dashboard' },
  { id: '2', name: 'Admin Panel' },
  // { id: '3', name: 'Dashboard' },
];

// Dashboard stats and activities
export const DASHBOARD_STATS = [
  {
    title: 'Total Tasks',
    value: '0',
    change: '+0',
    trend: 'up' as const,
    description: 'tasks created',
    icon: 'trending-up',
  },
  {
    title: 'Active Accounts',
    value: '0',
    change: '+0',
    trend: 'up' as const,
    description: 'registered users',
    icon: 'users',
  },
  {
    title: 'Completed Tasks',
    value: '0',
    change: '+0',
    trend: 'up' as const,
    description: 'this month',
    icon: 'trending-up',
  },
  {
    title: 'Growth Rate',
    value: '0%',
    change: '+0%',
    trend: 'up' as const,
    description: 'from last month',
    icon: 'activity',
  },
];

export const RECENT_ACTIVITIES = [
  {
    id: '1',
    type: 'project',
    message: 'Olivia Martin created a new project: Payroll App',
    timestamp: '2 minutes ago',
    status: 'info' as const,
  },
  {
    id: '2',
    type: 'update',
    message: 'Jackson Lee updated Dashboard Design',
    timestamp: '5 minutes ago',
    status: 'success' as const,
  },
  {
    id: '3',
    type: 'comment',
    message: 'Isabella Nguyen commented on User Research',
    timestamp: '10 minutes ago',
    status: 'info' as const,
  },
  {
    id: '4',
    type: 'assignment',
    message: 'William Kim assigned a task to Sarah Wilson',
    timestamp: '15 minutes ago',
    status: 'warning' as const,
  },
  {
    id: '5',
    type: 'completion',
    message: 'Sofia Davis completed API Integration',
    timestamp: '20 minutes ago',
    status: 'success' as const,
  },
];

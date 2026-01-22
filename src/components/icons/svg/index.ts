/**
 * SVG Icons Registry
 *
 * This file exports all available SVG icons for type-safe usage.
 * Add new icons by importing them here and adding to the registry.
 */

import React from 'react'

// Import SVG icons
import ArrowLeft from './arrow-left.svg'
import ArrowRight from './arrow-right.svg'
import Check from './check.svg'
import Close from './close.svg'
import Download from './download.svg'
import Edit from './edit.svg'
import Eye from './eye.svg'
import Filter from './filter.svg'
import Logo from './logo.svg'
import Plus from './plus.svg'
import Search from './search.svg'
import Settings from './settings.svg'
import Trash from './trash.svg'
import Upload from './upload.svg'
import User from './user.svg'

// Icon registry for type-safe access
export const iconRegistry = {
  'arrow-left': ArrowLeft as React.FC<React.SVGProps<SVGSVGElement>>,
  'arrow-right': ArrowRight as React.FC<React.SVGProps<SVGSVGElement>>,
  check: Check as React.FC<React.SVGProps<SVGSVGElement>>,
  close: Close as React.FC<React.SVGProps<SVGSVGElement>>,
  download: Download as React.FC<React.SVGProps<SVGSVGElement>>,
  edit: Edit as React.FC<React.SVGProps<SVGSVGElement>>,
  eye: Eye as React.FC<React.SVGProps<SVGSVGElement>>,
  filter: Filter as React.FC<React.SVGProps<SVGSVGElement>>,
  logo: Logo as React.FC<React.SVGProps<SVGSVGElement>>,
  plus: Plus as React.FC<React.SVGProps<SVGSVGElement>>,
  search: Search as React.FC<React.SVGProps<SVGSVGElement>>,
  settings: Settings as React.FC<React.SVGProps<SVGSVGElement>>,
  trash: Trash as React.FC<React.SVGProps<SVGSVGElement>>,
  upload: Upload as React.FC<React.SVGProps<SVGSVGElement>>,
  user: User as React.FC<React.SVGProps<SVGSVGElement>>,
} as const

// Type for icon names
export type IconName = keyof typeof iconRegistry

// Export individual icons for direct import
export {
  ArrowLeft,
  ArrowRight,
  Check,
  Close,
  Download,
  Edit,
  Eye,
  Filter,
  Logo,
  Plus,
  Search,
  Settings,
  Trash,
  Upload,
  User,
}

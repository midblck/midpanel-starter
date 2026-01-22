import type { KBarAction } from './navigation-actions'
import { createNavigationActions } from './navigation-actions'
import { createProfileActions } from './profile-actions'

export const createAllKBarActions = (
  navigateTo: (url: string) => void,
  openInNewTab: (url: string) => void
): KBarAction[] => {
  const navigationActions = createNavigationActions(navigateTo, openInNewTab)
  const profileActions = createProfileActions(navigateTo)

  return [...navigationActions, ...profileActions]
}

export { createNavigationActions, createProfileActions }
export type { KBarAction }

import { navItems } from '@/lib/constants/constants-dashboard'

export interface KBarAction {
  id: string
  name: string
  keywords: string
  section: string
  subtitle: string
  shortcut?: [string, string]
  perform: () => void
}

export const createNavigationActions = (
  navigateTo: (url: string) => void,
  openInNewTab: (url: string) => void,
): KBarAction[] => {
  {
    /* Hide Payload Admin from sidebar navigation */
  }
  return navItems
    .filter(navItem => navItem.title !== 'Payload Admin')
    .flatMap(navItem => {
      const baseAction =
        navItem.url !== '#'
          ? {
              id: `${navItem.title.toLowerCase()}Action`,
              name: navItem.title,
              keywords: navItem.title.toLowerCase(),
              section: 'Navigation',
              subtitle: navItem.openInNewTab
                ? `Open ${navItem.title} in new tab`
                : `Go to ${navItem.title}`,
              shortcut: navItem.shortcut,
              perform: () =>
                navItem.openInNewTab ? openInNewTab(navItem.url) : navigateTo(navItem.url),
            }
          : null

      const childActions =
        navItem.items?.map(childItem => ({
          id: `${childItem.title.toLowerCase()}Action`,
          name: childItem.title,
          keywords: childItem.title.toLowerCase(),
          section: navItem.title,
          subtitle: `Go to ${childItem.title}`,
          shortcut: childItem.shortcut,
          perform: () => navigateTo(childItem.url),
        })) ?? []

      return baseAction ? [baseAction, ...childActions] : childActions
    })
}

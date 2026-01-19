import type { KBarAction } from './navigation-actions';

export const createProfileActions = (
  navigateTo: (url: string) => void
): KBarAction[] => {
  return [
    {
      id: 'profileAction',
      name: 'Profile',
      keywords: 'profile user account settings',
      section: 'Account',
      subtitle: 'Go to Profile',
      shortcut: ['m', 'p'],
      perform: () => navigateTo('/app/profile'),
    },
  ];
};

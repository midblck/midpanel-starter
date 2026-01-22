'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuth } from '@/features/auth';
import { generateAvatarUrl } from '@/lib/avatar';
import { Icons, company, navItems, tenants } from '@/lib/constants';
import { BrandingIcon } from '@/components/branding';
import {
  Bell,
  ChevronRight,
  ChevronsDown,
  CreditCard,
  LogOut,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, collection, hasOAuth } = useAuth();
  const [activeTenant, setActiveTenant] = React.useState(tenants[0]);

  const handleSwitchTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setActiveTenant(tenant);
    }
  };

  const handleSignOut = () => {
    void signOut().then(() => {
      router.push('/auth/sign-in');
    });
  };

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <div className='bg-muted text-muted-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                    <BrandingIcon size='sm' className='h-4 w-4' />
                  </div>
                  <div className='flex flex-col gap-0.5 leading-none'>
                    <span className='font-semibold'>{company.name}</span>
                    <span className='text-xs text-muted-foreground'>
                      {activeTenant.name}
                    </span>
                  </div>
                  <ChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width]'
                align='start'
              >
                {tenants.map(tenant => (
                  <DropdownMenuItem
                    key={tenant.id}
                    onSelect={() => handleSwitchTenant(tenant.id)}
                  >
                    {tenant.name}
                    {tenant.id === activeTenant.id && (
                      <ChevronRight className='ml-auto size-4' />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {/* Hide Payload Admin from sidebar navigation */}
            {navItems
              .filter(item => item.title !== 'Payload Admin')
              .map(item => {
                const Icon = item.icon ? Icons[item.icon] : Icons.dashboard;
                return item?.items && item?.items?.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={
                      item.isActive ||
                      item.items?.some(subItem => pathname === subItem.url)
                    }
                    className='group/collapsible'
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={
                            item.items?.some(
                              subItem => pathname === subItem.url
                            ) || pathname === item.url
                          }
                        >
                          {item.icon && <Icon className='size-4' />}
                          <span>{item.title}</span>
                          <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map(subItem => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link
                        href={item.url}
                        target={item.external ? '_blank' : undefined}
                      >
                        <Icon className='size-4' />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <div className='bg-muted text-muted-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                    {user?.name ? (
                      <img
                        src={generateAvatarUrl(user.name, 32)}
                        alt={user.name}
                        className='size-8 rounded-lg object-cover'
                      />
                    ) : (
                      <User className='size-4' />
                    )}
                  </div>
                  <div className='flex flex-col gap-0.5 leading-none'>
                    <span className='font-semibold'>
                      {user?.name || 'User'}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {user?.email || 'No email'}
                    </span>
                  </div>
                  <ChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex flex-row gap-2 px-1 py-1.5'>
                    <div className='bg-muted text-muted-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                      {user?.name ? (
                        <img
                          src={generateAvatarUrl(user.name, 32)}
                          alt={user.name}
                          className='size-8 rounded-lg object-cover'
                        />
                      ) : (
                        <User className='size-4' />
                      )}
                    </div>
                    <div className='flex flex-col gap-0.5 leading-none'>
                      <span className='font-semibold'>
                        {user?.name || 'User'}
                      </span>
                      {/* <span className='text-xs text-muted-foreground'>
                        {user?.email || 'No email'}
                      </span> */}
                      <span className='text-xs text-muted-foreground'>
                        {collection === 'admins' ? 'Administrator' : 'User'}
                        {hasOAuth && ' • OAuth'}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/app/profile')}>
                    <User className='mr-2 h-4 w-4' />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className='mr-2 h-4 w-4' />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className='mr-2 h-4 w-4' />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className='mr-2 h-4 w-4' />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

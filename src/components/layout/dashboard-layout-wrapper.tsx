'use client';

import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ProtectedRoute from '@/features/auth/components/protected-route';
import { useIsMobile } from '@/lib/hooks/use-mobile';

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function DashboardLayoutWrapper({
  children,
  defaultOpen = false,
}: DashboardLayoutWrapperProps) {
  const isMobile = useIsMobile();

  return (
    <ProtectedRoute>
      <KBar>
        <SidebarProvider
          defaultOpen={defaultOpen}
          className='h-screen overflow-hidden'
        >
          {!isMobile && <AppSidebar />}
          <SidebarInset className='min-w-0 flex flex-col h-full overflow-hidden'>
            <Header />
            <div className='flex-1 overflow-y-auto overflow-x-hidden'>
              <div className='flex flex-col gap-4 p-4 pb-20 md:pb-4'>
                {children}
              </div>
            </div>
          </SidebarInset>
          <MobileBottomNav />
        </SidebarProvider>
      </KBar>
    </ProtectedRoute>
  );
}

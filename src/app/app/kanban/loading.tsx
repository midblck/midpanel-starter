import { PageContainer, PageHeader } from '@/components/layout';
import { KanbanSkeleton } from '@/components/loading/kanban-skeleton';

export default function Loading() {
  return (
    <PageContainer>
      <PageHeader
        title='Kanban Board'
        description='Manage your tasks with drag and drop'
      />
      <KanbanSkeleton />
    </PageContainer>
  );
}

import { getDashboardStats } from '@/actions/tripActions';
import DashboardClient from './DashboardClient';
import { ChartErrorBoundary } from '@/components/ChartErrorBoundary';

export default async function DashboardPage() {
  const { stats } = await getDashboardStats();

  return (
    <ChartErrorBoundary>
      <DashboardClient stats={stats} />
    </ChartErrorBoundary>
  );
}

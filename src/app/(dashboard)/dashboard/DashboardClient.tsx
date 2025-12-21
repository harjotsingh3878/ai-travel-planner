'use client';

import { DashboardStats } from '@/types';
import Card from '@/components/ui/Card';
import { FiMap, FiDollarSign, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = ['#0ea5e9', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'];

export default function DashboardClient({ stats }: { stats?: DashboardStats }) {

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available. Create your first trip!</p>
      </div>
    );
  }

  const { total_trips, total_budget, total_estimated_cost, trips_by_destination, trips_by_style, trips_timeline } = stats;

  // Chart.js data configurations
  const budgetChartData = {
    labels: ['Planned Budget', 'Estimated Cost'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [total_budget, total_estimated_cost],
        backgroundColor: ['rgba(14, 165, 233, 0.8)', 'rgba(139, 92, 246, 0.8)'],
        borderColor: ['rgb(14, 165, 233)', 'rgb(139, 92, 246)'],
        borderWidth: 2,
      },
    ],
  };

  const styleChartData = {
    labels: trips_by_style.map(s => s.style.charAt(0).toUpperCase() + s.style.slice(1)),
    datasets: [
      {
        data: trips_by_style.map(s => s.count),
        backgroundColor: COLORS,
        borderColor: COLORS.map(c => c),
        borderWidth: 2,
      },
    ],
  };

  const timelineChartData = {
    labels: trips_timeline.map(t => t.month),
    datasets: [
      {
        label: 'Number of Trips',
        data: trips_timeline.map(t => t.count),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Budget ($)',
        data: trips_timeline.map(t => t.budget),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const timelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Number of Trips',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Budget ($)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your travel plans and spending</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FiMap className="text-3xl" />}
          label="Total Trips"
          value={total_trips.toString()}
          bgColor="bg-blue-500"
        />
        <StatCard
          icon={<FiDollarSign className="text-3xl" />}
          label="Total Budget"
          value={`$${total_budget.toLocaleString()}`}
          bgColor="bg-green-500"
        />
        <StatCard
          icon={<FiTrendingUp className="text-3xl" />}
          label="Estimated Cost"
          value={`$${total_estimated_cost.toLocaleString()}`}
          bgColor="bg-purple-500"
        />
        <StatCard
          icon={<FiCalendar className="text-3xl" />}
          label="Savings"
          value={`$${(total_budget - total_estimated_cost).toLocaleString()}`}
          bgColor="bg-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Cost - Bar Chart */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Budget vs Estimated Cost</h2>
          <div className="h-[300px]">
            <Bar data={budgetChartData} options={chartOptions} />
          </div>
        </Card>

        {/* Travel Style Distribution - Doughnut Chart */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Travel Style Distribution</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut data={styleChartData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Timeline - Line Chart */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Travel Timeline</h2>
        <div className="h-[300px]">
          <Line data={timelineChartData} options={timelineOptions} />
        </div>
      </Card>

      {/* Top Destinations */}
      {trips_by_destination.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Destinations</h2>
          <div className="space-y-3">
            {trips_by_destination.slice(0, 5).map((dest, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{dest.destination}</span>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {dest.count} {dest.count === 1 ? 'trip' : 'trips'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}) {
  return (
    <Card>
      <div className="flex items-center space-x-4">
        <div className={`${bgColor} text-white p-3 rounded-lg`}>{icon}</div>
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}

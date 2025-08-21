import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function MonthlyConsumptionChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Consumption (GWh)',
        data: [385000, 420000, 398000, 445000, 425000, 462000],
        backgroundColor: 'hsl(210, 83%, 53%)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return (value / 1000) + 'k';
          },
        },
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}

export function CostBreakdownChart() {
  const data = {
    labels: ['Electricity', 'Gas', 'Water'],
    datasets: [
      {
        data: [55, 20, 15, 10],
        backgroundColor: [
          'hsl(210, 83%, 53%)',
          'hsl(122, 39%, 49%)',
          'hsl(291, 64%, 42%)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Pie data={data} options={options} />
    </div>
  );
}

export function PeakUsageChart() {
  const data = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Peak Usage',
        data: [120, 80, 180, 220, 200, 160],
        borderColor: 'hsl(34, 100%, 50%)',
        backgroundColor: 'hsla(34, 100%, 50%, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Off-Peak Usage',
        data: [80, 60, 100, 90, 110, 85],
        borderColor: 'hsl(122, 39%, 49%)',
        backgroundColor: 'hsla(122, 39%, 49%, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Line data={data} options={options} />
    </div>
  );
}

export function SiteComparisonChart() {
  const data = {
    labels: ['Main Office', 'Warehouse', 'Retail Store', 'Factory', 'Branch Office'],
    datasets: [
      {
        label: 'Efficiency Score',
        data: [92, 87, 78, 95, 89],
        backgroundColor: 'hsl(210, 83%, 53%)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return '£' + value + 'k';
          },
        },
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}

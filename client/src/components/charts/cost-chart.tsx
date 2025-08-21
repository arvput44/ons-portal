import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CostChart() {
  const data = {
    labels: ['Electricity', 'Gas', 'Water'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          'hsl(210, 83%, 53%)', // energy-blue
          'hsl(34, 100%, 50%)', // energy-orange
          'hsl(122, 39%, 49%)', // energy-green
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
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            return context.label + ': ' + context.parsed + '%';
          },
        },
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Doughnut data={data} options={options} />
    </div>
  );
}

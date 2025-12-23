import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartOptions } from "chart.js";
import { Card } from "../ui/Card";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface RSVPStats {
  attending: number;
  not_attending: number;
  maybe: number;
  pending: number;
  total: number;
}

interface RSVPTrackerProps {
  stats: RSVPStats;
}

export const RSVPTracker = ({ stats }: RSVPTrackerProps) => {
  const data = {
    labels: ["Attending", "Not Attending", "Maybe", "Pending"],
    datasets: [
      {
        data: [
          stats.attending,
          stats.not_attending,
          stats.maybe,
          stats.pending,
        ],
        backgroundColor: [
          "#10b981", // green for attending
          "#ef4444", // red for not attending
          "#f59e0b", // amber for maybe
          "#94a3b8", // slate for pending
        ],
        borderColor: ["#059669", "#dc2626", "#d97706", "#64748b"],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: "'Outfit', sans-serif",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage =
              stats.total > 0 ? ((value / stats.total) * 100).toFixed(1) : "0";
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const responseRate =
    stats.total > 0
      ? Math.round(((stats.total - stats.pending) / stats.total) * 100)
      : 0;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-brand-mirage mb-6">
        RSVP Overview
      </h3>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-brand-sand rounded-lg">
          <div className="text-3xl font-bold text-brand-mirage">
            {stats.total}
          </div>
          <div className="text-sm text-brand-mirage/60 mt-1">Total Guests</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-3xl font-bold text-green-700">
            {responseRate}%
          </div>
          <div className="text-sm text-green-600 mt-1">Response Rate</div>
        </div>
      </div>

      {/* Chart */}
      <div className="max-w-sm mx-auto">
        <Doughnut data={data} options={options} />
      </div>

      {/* Detailed Stats */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-green-700">Attending</span>
          <span className="text-sm font-bold text-green-700">
            {stats.attending}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
          <span className="text-sm font-medium text-amber-700">Maybe</span>
          <span className="text-sm font-bold text-amber-700">
            {stats.maybe}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <span className="text-sm font-medium text-red-700">
            Not Attending
          </span>
          <span className="text-sm font-bold text-red-700">
            {stats.not_attending}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-sm font-medium text-slate-700">Pending</span>
          <span className="text-sm font-bold text-slate-700">
            {stats.pending}
          </span>
        </div>
      </div>
    </Card>
  );
};

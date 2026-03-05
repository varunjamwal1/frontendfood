import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const DashboardCharts = ({ orders = [] }) => {

  // 🔹 PAYMENT BREAKDOWN
  const paymentBreakdown = orders.reduce((acc, order) => {
    const method = order.paymentMethod || "Unknown";
    acc[method] = (acc[method] || 0) + order.totalAmount;
    return acc;
  }, {});

  // 🔹 ORDER STATUS BREAKDOWN
  const orderStatusBreakdown = orders.reduce((acc, order) => {
    const status = order.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const revenueLabels = Object.keys(paymentBreakdown);
  const revenueValues = Object.values(paymentBreakdown);

  const statusLabels = Object.keys(orderStatusBreakdown);
  const statusValues = Object.values(orderStatusBreakdown);

  // 🔹 Beautiful Modern Colors
  const modernColors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
  ];

  const revenueData = {
    labels: revenueLabels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: revenueValues,
        backgroundColor: modernColors.slice(0, revenueLabels.length),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const statusData = {
    labels: statusLabels,
    datasets: [
      {
        label: "Orders",
        data: statusValues,
        backgroundColor: modernColors.slice(0, statusLabels.length),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // 🔹 Professional Chart Options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          boxWidth: 14,
          font: {
            size: 13,
          },
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
      },
    },
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148,163,184,0.2)",
        },
        ticks: {
          callback: (value) => "₹" + value.toLocaleString("en-IN"),
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    ...commonOptions,
    cutout: "65%",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Revenue by Payment Method
        </h3>
        <div className="h-72">
          {revenueValues.length > 0 ? (
            <Bar data={revenueData} options={barOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Revenue Data Available
            </div>
          )}
        </div>
      </div>

      {/* Order Status Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Order Status Overview
        </h3>
        <div className="h-72">
          {statusValues.length > 0 ? (
            <Doughnut data={statusData} options={doughnutOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Orders Found
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default DashboardCharts;
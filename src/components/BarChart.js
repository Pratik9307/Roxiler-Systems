import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BarChart = () => {
  const barData = {
    labels: ["7/12", "8/12", "9/12", "10/12", "11/12", "12/12", "13/12"],
    datasets: [
      {
        label: "Statistics",
        data: [100, 150, 200, 250, 300, 350, 400],
        backgroundColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Value: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <h3>Latest Statistics</h3>
      <Bar data={barData} options={options} />
    </div>
  );
};

export default BarChart;

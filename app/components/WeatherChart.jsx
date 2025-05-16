"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler, // Optional for smoother curves
} from "chart.js";

ChartJS.register(
  LineElement,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  CategoryScale,
  Filler
);

export default function WeatherChart({ data }) {
  const chartData = data
    ? {
        labels: data.time,
        datasets: [
          {
            label: "Max Temp (°C)",
            data: data.temperature_2m_max,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Min Temp (°C)",
            data: data.temperature_2m_min,
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Mean Temp (°C)",
            data: data.temperature_2m_mean,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Max Apparent Temp (°C)",
            data: data.apparent_temperature_max,
            borderColor: "rgb(255, 206, 86)",
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Min Apparent Temp (°C)",
            data: data.apparent_temperature_min,
            borderColor: "rgb(153, 102, 255)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Mean Apparent Temp (°C)",
            data: data.apparent_temperature_mean,
            borderColor: "rgb(255, 159, 64)",
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      }
    : null;

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ⬅️ Allows full container control
    plugins: {
      legend: {
        display: true,
        position: "bottom", // ⬅️ Better for mobile
        labels: {
          boxWidth: 12,
          font: {
            size: 10,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 5,
          autoSkip: true,
          font: {
            size: 10,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px]">
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
}

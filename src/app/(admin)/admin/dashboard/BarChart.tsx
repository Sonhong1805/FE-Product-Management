import React from "react";
import Chart, { CategoryScale } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { dataBarChart } from "@/constants/dataChart";
Chart.register(CategoryScale);

const BarChart = () => {
  const chartData = {
    labels: dataBarChart.map((data) => data.month),
    datasets: [
      {
        label: "Doanh thu (triệu VND)",
        data: dataBarChart.map((data) => data.revenue),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
          "#70CAD1",
          "#FFA07A",
          "#8A2BE2",
          "#6495ED",
          "#DC143C",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  return (
    <Bar
      data={chartData}
      options={{
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                return `Doanh thu: ${value} triệu VND`;
              },
            },
          },
          title: {
            display: true,
            text: "Biểu đồ thống kê doanh thu sản phẩm năm 2024",
          },
        },
      }}
    />
  );
};

export default BarChart;

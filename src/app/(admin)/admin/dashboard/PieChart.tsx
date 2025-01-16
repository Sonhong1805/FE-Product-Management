import React from "react";
import Chart, { CategoryScale } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { dataPieChart } from "@/constants/dataChart";
Chart.register(CategoryScale);

const PieChart = () => {
  const chartData = {
    labels: dataPieChart.map((data) => data.category),
    datasets: [
      {
        label: "Tỷ lệ (%)",
        data: dataPieChart.map((data) => data.proportion),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8DD1E1",
          "#FFBB28",
          "#FF8042",
          "#AF19FF",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };
  return (
    <Pie
      data={chartData}
      options={{
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                return `Tỷ lệ: ${value}%`;
              },
            },
          },
          title: {
            display: true,
            text: "Biểu đồ thống kê tỷ lệ sản phẩm bán ra theo danh mục năm 2024",
          },
        },
      }}
    />
  );
};

export default PieChart;

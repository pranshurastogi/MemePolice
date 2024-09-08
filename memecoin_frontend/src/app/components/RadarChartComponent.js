import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RiskRadarChart = ({ detailedScores }) => {
  const labels = detailedScores.map((scoreDetail) => scoreDetail.label);
  const data = detailedScores.map((scoreDetail) => parseFloat(scoreDetail.score));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Risk Score',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const options = {
    scale: {
      ticks: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return <Radar data={chartData} options={options} />;
};

export default RiskRadarChart;

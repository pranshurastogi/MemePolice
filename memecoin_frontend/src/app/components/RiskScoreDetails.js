import React from 'react';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';  // Import chart.js 

const RiskScoreDetails = ({ detailedScores }) => {
  // Prepare data for radar chart
  const labels = detailedScores.map((score) => score.label);
  const scores = detailedScores.map((score) => parseFloat(score.score));

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Risk Score',
        data: scores,
        fill: true,
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
      ticks: { beginAtZero: true, max: 50 },
      pointLabels: { fontSize: 14 },
    },
  };

  return (
    <div style={{
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      margin: '20px 0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{
        color: '#333',
        fontSize: '24px',
        borderBottom: '2px solid #4CAF50',
        paddingBottom: '10px',
        marginBottom: '20px'
      }}>
        Risk Score Analysis
      </h3>
      
      <Radar data={data} options={options} />

      <ul style={{ listStyleType: 'none', padding: '20px 0' }}>
        {detailedScores.map((scoreDetail, index) => (
          <li key={index} style={{
            marginBottom: '15px',
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <span style={{ color: '#4CAF50', fontSize: '18px' }}>
              {scoreDetail.label}
            </span>
            <span style={{
              fontSize: '16px',
              color: '#555'
            }}>
              {scoreDetail.score}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RiskScoreDetails;

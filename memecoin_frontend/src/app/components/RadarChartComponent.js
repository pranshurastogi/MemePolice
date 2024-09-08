import React from 'react';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';

const RiskScoreDetails = ({ detailedScores }) => {
  const data = {
    labels: detailedScores.map(score => score.label),
    datasets: [
      {
        label: 'Risk Score',
        data: detailedScores.map(score => parseFloat(score.score)),
        backgroundColor: 'rgba(0, 206, 209, 0.2)', // Adjust colors for better visual
        borderColor: 'rgba(0, 206, 209, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(0, 206, 209, 1)',
      }
    ]
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: '#555', // Make the angle lines subtle
        },
        grid: {
          color: '#ccc', // Set the grid color
        },
        pointLabels: {
          color: '#ccc', // Set the label color
          font: {
            size: 14, // Adjust font size
          },
        },
        ticks: {
          display: false // Hides the tick labels
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ccc', // Set the legend label color
          font: {
            size: 14, // Adjust legend font size
          },
        },
      },
    }
  };

  return (
    <div style={{
      backgroundColor: '#1e1e1e',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      color: '#ccc', // Set the text color
      margin: '20px 0',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h3 style={{
        fontSize: '24px',
        marginBottom: '20px',
        color: '#fff',
      }}>Risk Score Analysis</h3>

      <Radar data={data} options={options} />

      <div style={{ marginTop: '20px' }}>
        <ul style={{
          listStyleType: 'none',
          padding: 0,
          color: '#fff',
          fontSize: '16px',
        }}>
          {detailedScores.map((scoreDetail, index) => (
            <li key={index} style={{
              marginBottom: '10px',
              backgroundColor: '#2c2c2c',
              padding: '10px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <strong style={{ color: '#0ececf' }}>
                {scoreDetail.label}:
              </strong>
              <span style={{ marginLeft: '10px' }}>
                {scoreDetail.score}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RiskScoreDetails;

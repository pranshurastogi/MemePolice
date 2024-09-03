"use client";
import React, { useState } from 'react';
import { getSchemaDetails } from '../services/attestationService';

export default function AttestationForm() {
  const [schemaDetails, setSchemaDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewSchema = async () => {
    if (!isExpanded) {
      setLoading(true);
      try {
        const details = await getSchemaDetails();
        setSchemaDetails(details);
        setIsExpanded(true);
      } catch (error) {
        console.error("Error fetching schema:", error);
        alert("Error fetching schema: " + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setIsExpanded(false); // Collapse the details if already expanded
    }
  };

  return (
    <div style={{
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <button
        onClick={handleViewSchema}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
        }}
      >
        {isExpanded ? 'Hide Schema' : 'View Schema'}
      </button>
      {loading && <p>Loading...</p>}
      {isExpanded && schemaDetails && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{
            color: '#333',
            backgroundColor: '#e8f5e9',
            padding: '10px',
            borderRadius: '50px',
            borderLeft: '10px solid #4CAF50',
            boxShadow: '0 20px 5px rgba(0,0,0,0.1)',
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            Schema Details
          </h3>
          <div style={{ paddingLeft: '20px' }}>
            {Object.entries(schemaDetails).map(([key, value], index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '-15px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: index % 2 === 0 ? '#4CAF50' : '#FFA500',
                  borderRadius: '50%'
                }}></span>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingLeft: '20px'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>{key}:</span>
                  <span style={{ color: '#555' }}>{JSON.stringify(value, null, 2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

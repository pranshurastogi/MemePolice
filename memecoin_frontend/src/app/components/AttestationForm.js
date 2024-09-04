"use client";
import React, { useState } from 'react';
import { getSchemaDetails, createAttestation } from '../services/attestationService';

export default function AttestationForm() {
  const [schemaDetails, setSchemaDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [counter, setCounter] = useState('');
  const [decrease, setDecrease] = useState('');
  const [attestationMessage, setAttestationMessage] = useState('');

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
      setIsExpanded(false);
    }
  };

  const handleRegisterAttestation = async () => {
    setLoading(true);
    setAttestationMessage('');
    try {
      const attestationData = {
        counter,
        decrease,
      };

      console.log("Registering attestation with data:", attestationData);
      const result = await createAttestation(attestationData);
      console.log("Attestation registered successfully:", result);
      setAttestationMessage("Attestation registered successfully!");
    } catch (error) {
      console.error("Error registering attestation:", error);
      setAttestationMessage("Failed to register attestation: " + error.message);
    } finally {
      setLoading(false);
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

      {/* Attestation Section */}
      <div style={{ marginTop: '20px' }}>
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
          Register Attestation
        </h3>
        <input
          type="number"
          placeholder="Counter"
          value={counter}
          onChange={(e) => setCounter(e.target.value)}
          style={{
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
        <input
          type="number"
          placeholder="Decrease"
          value={decrease}
          onChange={(e) => setDecrease(e.target.value)}
          style={{
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={handleRegisterAttestation}
          style={{
            backgroundColor: '#FF5733',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            marginTop: '10px'
          }}
        >
          Register
        </button>
        {attestationMessage && (
          <p style={{ marginTop: '10px', color: attestationMessage.includes('successfully') ? 'green' : 'red' }}>
            {attestationMessage}
          </p>
        )}
      </div>
    </div>
  );
}

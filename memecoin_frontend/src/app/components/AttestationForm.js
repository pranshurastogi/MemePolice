"use client";
import React, { useState, useEffect } from 'react';
import { getSchemaDetails, createAttestation } from '../services/attestationService';
import { useWallet } from '../context/WalletContext';

export default function AttestationForm() {
  const [schemaDetails, setSchemaDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [xProfile, setXProfile] = useState('');
  const [positiveScore, setPositiveScore] = useState('');
  const [negativeScore, setNegativeScore] = useState('');
  const [sentimentScore, setSentimentScore] = useState('');
  const [review, setReview] = useState('');
  const [tokenOwner, setTokenOwner] = useState(false);
  const [attestationMessage, setAttestationMessage] = useState('');
  const { currentAccount } = useWallet();

  useEffect(() => {
    if (currentAccount) {
      console.log("Connected wallet address:", currentAccount);
    }
  }, [currentAccount]);

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
        AddressAttestator: currentAccount,
        XProfile: xProfile,
        PositveScore: parseInt(positiveScore, 10),
        "Negative score": parseInt(negativeScore, 10),
        SentimentScore: parseInt(sentimentScore, 10),
        Review: review,
        TokenOwner: tokenOwner,
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

        {/* Non-editable field for AddressAttestator */}
        <input
          type="text"
          value={currentAccount || ''}
          disabled
          placeholder="Address Attestator"
          style={{
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: '#e0e0e0',
            color: '#333'
          }}
        />
        <input
          type="text"
          placeholder="XProfile"
          value={xProfile}
          onChange={(e) => setXProfile(e.target.value)}
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
          placeholder="Positive Score"
          value={positiveScore}
          onChange={(e) => setPositiveScore(e.target.value)}
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
          placeholder="Negative Score"
          value={negativeScore}
          onChange={(e) => setNegativeScore(e.target.value)}
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
          placeholder="Sentiment Score"
          value={sentimentScore}
          onChange={(e) => setSentimentScore(e.target.value)}
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
          type="text"
          placeholder="Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          style={{
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
        <label>
          <input
            type="checkbox"
            checked={tokenOwner}
            onChange={(e) => setTokenOwner(e.target.checked)}
          /> Token Owner
        </label>
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
          Register Attestation
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

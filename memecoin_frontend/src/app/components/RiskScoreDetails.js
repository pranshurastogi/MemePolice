import React, { useState } from 'react';
import RadarChartComponent from './RadarChartComponent';

const sampleScores = [
  { description: 'Price Risk', score: 40 },
  { description: 'Market Cap Risk', score: 20 },
  { description: 'Volume Risk', score: 35 },
  { description: 'Holder Concentration Risk', score: 50 },
  { description: 'Transaction Risk', score: 30 },
  { description: 'Contract Age Risk', score: 25 },
];

const App = () => {
  const [detailedScores, setDetailedScores] = useState(sampleScores);

  return (
    <div>
      <RadarChartComponent detailedScores={detailedScores} />
    </div>
  );
};

export default App;

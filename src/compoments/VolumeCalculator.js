import React, { useState } from 'react';

const VolumeCalculator = () => {
  const [tankVolume, setTankVolume] = useState('');
  const [result, setResult] = useState(null);
  
  const calculateVolume = () => {
    if (tankVolume) {
      const tankVolumeValue = parseFloat(tankVolume);
      
      const density = 1.21; // kg/l
      const concentration = 0.5; // 50%
      
      const totalTankWeight = tankVolumeValue;
      const chemicalWeight = totalTankWeight * concentration;
      const chemicalVolume = chemicalWeight / density;
      const waterVolume = tankVolumeValue - chemicalVolume;
      
      setResult({
        chemicalVolume: chemicalVolume,
        waterVolume: waterVolume,
        ratio: `1:${(waterVolume / chemicalVolume).toFixed(2)}`
      });
    }
  };
  
  return (
    <div className="tile">
      <div className="tile-header">
        <h2 className="tile-title">Kalkulator objętości eska®strip H 365A</h2>
      </div>
      
      <div className="input-group">
        <div className="input-wrapper">
          <label className="input-label">Pojemność wanny (litry)</label>
          <input
            type="number"
            className="input-field"
            value={tankVolume}
            onChange={(e) => setTankVolume(e.target.value)}
            placeholder="Podaj pojemność wanny w litrach"
          />
        </div>
        
        <div className="input-wrapper">
          <button
            className="btn btn-primary"
            onClick={calculateVolume}
          >
            Oblicz
          </button>
        </div>
      </div>
      
      {result && (
        <div className="results-grid mt-6">
          <div className="result-tile">
            <p className="result-label">eska®strip H 365A</p>
            <p className="result-value">{result.chemicalVolume.toFixed(2)} L</p>
          </div>
          <div className="result-tile">
            <p className="result-label">Woda</p>
            <p className="result-value">{result.waterVolume.toFixed(2)} L</p>
          </div>
          <div className="result-tile">
            <p className="result-label">Stosunek (chemia:woda)</p>
            <p className="result-value">{result.ratio}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolumeCalculator;
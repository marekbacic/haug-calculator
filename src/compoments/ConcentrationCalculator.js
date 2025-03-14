import React, { useState } from 'react';

const ConcentrationCalculator = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [currentConcentration, setCurrentConcentration] = useState('');
  const [targetConcentration, setTargetConcentration] = useState('');
  const [bathVolume, setBathVolume] = useState('');
  const [result, setResult] = useState(null);
  
  const calculateAddition = () => {
    if (selectedProduct && currentConcentration && targetConcentration && bathVolume) {
      const currentConcentrationValue = parseFloat(currentConcentration);
      const targetConcentrationValue = parseFloat(targetConcentration);
      const bathVolumeValue = parseFloat(bathVolume);
      
      if (targetConcentrationValue <= currentConcentrationValue) {
        setResult({
          error: "Stężenie docelowe musi być większe od aktualnego!"
        });
        return;
      }
      
      const chemicalToAdd = bathVolumeValue * (targetConcentrationValue - currentConcentrationValue) / (100 - targetConcentrationValue);
      
      setResult({
        chemicalToAdd: chemicalToAdd,
        newVolume: bathVolumeValue + chemicalToAdd
      });
    }
  };
  
  return (
    <div className="tile">
      <div className="tile-header">
        <h2 className="tile-title">Uzupełnianie stężenia chemii</h2>
      </div>
      
      <div className="input-group">
        <div className="input-wrapper">
          <label className="input-label">Wybierz produkt</label>
          <select
            className="input-field"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Wybierz produkt</option>
            {products.map(product => (
              <option key={product.id} value={product.name}>{product.name}</option>
            ))}
          </select>
        </div>
        
        <div className="input-wrapper">
          <label className="input-label">Aktualne stężenie (%)</label>
          <input
            type="number"
            className="input-field"
            value={currentConcentration}
            onChange={(e) => setCurrentConcentration(e.target.value)}
            placeholder="Podaj aktualne stężenie"
            min="0"
            max="100"
          />
        </div>
        
        <div className="input-wrapper">
          <label className="input-label">Wymagane stężenie (%)</label>
          <input
            type="number"
            className="input-field"
            value={targetConcentration}
            onChange={(e) => setTargetConcentration(e.target.value)}
            placeholder="Podaj wymagane stężenie"
            min="0"
            max="100"
          />
        </div>
        
        <div className="input-wrapper">
          <label className="input-label">Pojemność wanny (litry)</label>
          <input
            type="number"
            className="input-field"
            value={bathVolume}
            onChange={(e) => setBathVolume(e.target.value)}
            placeholder="Podaj pojemność wanny"
            min="0"
          />
        </div>
        
        <div className="input-wrapper">
          <button
            className="btn btn-primary"
            onClick={calculateAddition}
          >
            Oblicz
          </button>
        </div>
      </div>
      
      {result && !result.error && (
        <div className="results-grid mt-6">
          <div className="result-tile">
            <p className="result-label">Ilość produktu do dodania</p>
            <p className="result-value">{result.chemicalToAdd.toFixed(2)} L</p>
          </div>
          <div className="result-tile">
            <p className="result-label">Nowa objętość kąpieli</p>
            <p className="result-value">{result.newVolume.toFixed(2)} L</p>
          </div>
        </div>
      )}
      
      {result && result.error && (
        <div className="result-tile error">
          <p className="result-label">{result.error}</p>
        </div>
      )}
    </div>
  );
};

export default ConcentrationCalculator;
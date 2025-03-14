import React, { useState } from 'react';

const ChemicalConsumptionCalculator = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState(null);
  
  const calculateConsumption = () => {
    const product = products.find(p => p.name === selectedProduct);
    if (product && area && price) {
      const areaValue = parseFloat(area);
      const priceValue = parseFloat(price);
      
      const consumptionPerArea = product.consumption / 1000; // g/m² to kg/m²
      const totalConsumption = consumptionPerArea * areaValue; // kg
      const totalCost = totalConsumption * priceValue; // EUR
      
      setResult({
        consumptionPerArea: consumptionPerArea,
        totalConsumption: totalConsumption,
        totalCost: totalCost
      });
    }
  };
  
  return (
    <div className="tile">
      <div className="tile-header">
        <h2 className="tile-title">Kalkulator zużycia chemii</h2>
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
          <label className="input-label">Powierzchnia (m²)</label>
          <input
            type="number"
            className="input-field"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Podaj ilość m²"
          />
        </div>
        
        <div className="input-wrapper">
          <label className="input-label">Cena (EUR/kg)</label>
          <input
            type="number"
            className="input-field"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Podaj cenę w euro za 1 kg"
          />
        </div>
        
        <div className="input-wrapper">
          <button
            className="btn btn-primary"
            onClick={calculateConsumption}
          >
            Oblicz
          </button>
        </div>
      </div>
      
      {result && (
        <div className="results-grid mt-6">
          <div className="result-tile">
            <p className="result-label">Zużycie na 1m²</p>
            <p className="result-value">{result.consumptionPerArea.toFixed(3)} kg/m²</p>
          </div>
          <div className="result-tile">
            <p className="result-label">Całkowite zużycie</p>
            <p className="result-value">{result.totalConsumption.toFixed(2)} kg</p>
          </div>
          <div className="result-tile">
            <p className="result-label">Całkowity koszt</p>
            <p className="result-value">{result.totalCost.toFixed(2)} EUR</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChemicalConsumptionCalculator;
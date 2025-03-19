import React, { useState } from 'react';

// Pełna baza danych chłodziw na podstawie tabeli
const coolantDatabase = [
  {
    name: "eska®cool 2300",
    hardnessRange: "-",
    hardnessTotal: 10,
    oilPercent: 0,
    refractionMultiplier: 2.1,
    components: {
      bor: false,
      amin: true,
      dcha: false,
      fad: false
    },
    lubricationEfficiency: {
      low: "good",
      medium: "not-suitable", 
      high: "not-suitable"
    },
    operationTypes: {
      grinding: "good",
      turning: "not-suitable", 
      millingDrilling: "not-suitable"
    },
    materials: {
      steel: "best",
      stainlessSteel: "best", 
      castIron: "good",
      aluminum: "not-suitable",
      nonFerrousMetals: "not-suitable", 
      carbide: "not-suitable"
    }
  },
  {
    name: "eska®cool 5200",
    hardnessRange: "-",
    hardnessTotal: 10,
    oilPercent: 0,
    refractionMultiplier: 1.5,
    components: {
      bor: false,
      amin: true,
      dcha: false,
      fad: false
    },
    lubricationEfficiency: {
      low: "good",
      medium: "good", 
      high: "conditionally-suitable"
    },
    operationTypes: {
      grinding: "conditionally-suitable",
      turning: "not-suitable", 
      millingDrilling: "suitable"
    },
    materials: {
      steel: "not-suitable",
      stainlessSteel: "not-suitable", 
      castIron: "not-suitable",
      aluminum: "suitable",
      nonFerrousMetals: "best", 
      carbide: "best"
    }
  },
  {
    name: "eska®lub 1220",
    hardnessRange: "2-30",
    hardnessTotal: 8,
    oilPercent: 30,
    refractionMultiplier: 1.3,
    components: {
      bor: false,
      amin: true,
      dcha: false,
      fad: false
    },
    lubricationEfficiency: {
      low: "good",
      medium: "suitable", 
      high: "not-suitable"
    },
    operationTypes: {
      grinding: "good",
      turning: "good", 
      millingDrilling: "good"
    },
    materials: {
      steel: "good",
      stainlessSteel: "suitable", 
      castIron: "good",
      aluminum: "good",
      nonFerrousMetals: "suitable", 
      carbide: "suitable"
    }
  },
  {
    name: "eska®lub 2320",
    hardnessRange: "5-30",
    hardnessTotal: 6,
    oilPercent: 30,
    refractionMultiplier: 1.3,
    components: {
      bor: false,
      amin: true,
      dcha: true,
      fad: false
    },
    lubricationEfficiency: {
      low: "good",
      medium: "good", 
      high: "good"
    },
    operationTypes: {
      grinding: "good",
      turning: "good", 
      millingDrilling: "good"
    },
    materials: {
      steel: "best",
      stainlessSteel: "good", 
      castIron: "best",
      aluminum: "conditionally-suitable",
      nonFerrousMetals: "conditionally-suitable", 
      carbide: "not-suitable"
    }
  },
  {
    name: "eska®lub 3350",
    hardnessRange: "5-30",
    hardnessTotal: 15,
    oilPercent: 30,
    refractionMultiplier: 1.2,
    components: {
      bor: false,
      amin: true,
      dcha: true,
      fad: false
    },
    lubricationEfficiency: {
      low: "good",
      medium: "good", 
      high: "suitable"
    },
    operationTypes: {
      grinding: "good",
      turning: "good", 
      millingDrilling: "good"
    },
    materials: {
      steel: "best",
      stainlessSteel: "good", 
      castIron: "good",
      aluminum: "best",
      nonFerrousMetals: "suitable", 
      carbide: "conditionally-suitable"
    }
  },
  {
    name: "eska®lub 4131",
    hardnessRange: "15-25",
    hardnessTotal: 6,
    oilPercent: 45,
    refractionMultiplier: 1.0,
    components: {
      bor: false,
      amin: false,
      dcha: false,
      fad: false
    },
    lubricationEfficiency: {
      low: "suitable",
      medium: "good", 
      high: "good"
    },
    operationTypes: {
      grinding: "not-suitable",
      turning: "good", 
      millingDrilling: "good"
    },
    materials: {
      steel: "good",
      stainlessSteel: "best", 
      castIron: "not-suitable",
      aluminum: "best",
      nonFerrousMetals: "suitable", 
      carbide: "suitable"
    }
  },
  {
    name: "eska®lub 4300",
    hardnessRange: "10-30",
    hardnessTotal: 6,
    oilPercent: 45,
    refractionMultiplier: 1.0,
    components: {
      bor: false,
      amin: true,
      dcha: true,
      fad: false
    },
    lubricationEfficiency: {
      low: "suitable",
      medium: "good", 
      high: "good"
    },
    operationTypes: {
      grinding: "good",
      turning: "good", 
      millingDrilling: "best"
    },
    materials: {
      steel: "best",
      stainlessSteel: "best", 
      castIron: "suitable",
      aluminum: "suitable",
      nonFerrousMetals: "conditionally-suitable", 
      carbide: "not-suitable"
    }
  },
  {
    name: "eska®lub 4335",
    hardnessRange: "10-30",
    hardnessTotal: 6,
    oilPercent: 40,
    refractionMultiplier: 1.0,
    components: {
      bor: false,
      amin: true,
      dcha: true,
      fad: false
    },
    lubricationEfficiency: {
      low: "suitable",
      medium: "good", 
      high: "good"
    },
    operationTypes: {
      grinding: "suitable",
      turning: "good", 
      millingDrilling: "good"
    },
    materials: {
      steel: "best",
      stainlessSteel: "best", 
      castIron: "suitable",
      aluminum: "good",
      nonFerrousMetals: "conditionally-suitable", 
      carbide: "not-suitable"
    }
  },
  {
    name: "eska®lub 6530",
    hardnessRange: "10-30",
    hardnessTotal: 6,
    oilPercent: 65,
    refractionMultiplier: 0.9,
    components: {
      bor: false,
      amin: false,
      dcha: false,
      fad: true
    },
    lubricationEfficiency: {
      low: "suitable",
      medium: "good", 
      high: "suitable"
    },
    operationTypes: {
      grinding: "not-suitable",
      turning: "good", 
      millingDrilling: "good"
    },
    materials: {
      steel: "conditionally-suitable",
      stainlessSteel: "suitable", 
      castIron: "not-suitable",
      aluminum: "good",
      nonFerrousMetals: "best", 
      carbide: "good"
    }
  }
];

const CoolantSelector = () => {
  const [waterHardness, setWaterHardness] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedOperations, setSelectedOperations] = useState([]);
  const [selectedLubrication, setSelectedLubrication] = useState([]);
  const [results, setResults] = useState([]);
  const [showComponents, setShowComponents] = useState(false);
  
  const allMaterials = [
    { id: 'steel', name: 'Stal' },
    { id: 'stainlessSteel', name: 'Stal nierdzewna' },
    { id: 'castIron', name: 'Żeliwo' },
    { id: 'aluminum', name: 'Aluminium' },
    { id: 'nonFerrousMetals', name: 'Metale kolorowe' },
    { id: 'carbide', name: 'Węglik' }
  ];
  
  const allOperations = [
    { id: 'grinding', name: 'Szlifowanie' },
    { id: 'turning', name: 'Toczenie' },
    { id: 'millingDrilling', name: 'Frezowanie/Wiercenie' }
  ];
  
  const allLubrication = [
    { id: 'low', name: 'Niska' },
    { id: 'medium', name: 'Średnia' },
    { id: 'high', name: 'Duża' }
  ];
  
  const handleSelectMaterial = (materialId) => {
    if (selectedMaterials.includes(materialId)) {
      setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
    } else {
      setSelectedMaterials([...selectedMaterials, materialId]);
    }
  };
  
  const handleSelectOperation = (operationId) => {
    if (selectedOperations.includes(operationId)) {
      setSelectedOperations(selectedOperations.filter(id => id !== operationId));
    } else {
      setSelectedOperations([...selectedOperations, operationId]);
    }
  };
  
  const handleSelectLubrication = (lubricationId) => {
    if (selectedLubrication.includes(lubricationId)) {
      setSelectedLubrication(selectedLubrication.filter(id => id !== lubricationId));
    } else {
      setSelectedLubrication([...selectedLubrication, lubricationId]);
    }
  };
  
  const getSuitabilityScore = (suitability) => {
    const scoreMap = {
      'best': 4,
      'good': 3,
      'suitable': 2,
      'conditionally-suitable': 1,
      'not-suitable': 0
    };
    return scoreMap[suitability] || 0;
  };
  
  const findBestCoolants = () => {
    if (selectedMaterials.length === 0 || selectedOperations.length === 0) {
      return;
    }
    
    const hardnessValue = parseFloat(waterHardness);
    
    const scoredCoolants = coolantDatabase.map(coolant => {
      let isHardnessInRange = true;
      if (coolant.hardnessRange !== "-") {
        const [min, max] = coolant.hardnessRange.split('-').map(Number);
        isHardnessInRange = !hardnessValue || (hardnessValue >= min && hardnessValue <= max);
      }
      
      let materialScore = 0;
      selectedMaterials.forEach(materialId => {
        materialScore += getSuitabilityScore(coolant.materials[materialId]);
      });
      
      let operationScore = 0;
      selectedOperations.forEach(operationId => {
        operationScore += getSuitabilityScore(coolant.operationTypes[operationId]);
      });
      
      let lubricationScore = 0;
      if (selectedLubrication.length > 0) {
        selectedLubrication.forEach(lubricationId => {
          lubricationScore += getSuitabilityScore(coolant.lubricationEfficiency[lubricationId]);
        });
      } else {
        // Jeśli nie wybrano żadnego poziomu smarowania, daj max punkty
        lubricationScore = 4 * 3; // 4 punkty * 3 poziomy smarowania
      }
      
      const totalScore = isHardnessInRange ? (materialScore + operationScore + lubricationScore) : 0;
      
      return {
        ...coolant,
        isHardnessInRange,
        materialScore,
        operationScore,
        lubricationScore,
        totalScore
      };
    });
    
    const sortedCoolants = [...scoredCoolants].sort((a, b) => b.totalScore - a.totalScore);
    const bestCoolants = sortedCoolants.filter(coolant => coolant.totalScore > 0);
    
    setResults(bestCoolants);
  };
  
  const renderRating = (rating) => {
    const ratings = {
      'best': '●●●',
      'good': '●●',
      'suitable': '●',
      'conditionally-suitable': '○',
      'not-suitable': '-'
    };
    return ratings[rating] || '-';
  };
  
  const getBadgeColor = (rating) => {
    const colors = {
      'best': 'bg-green-600 text-white',
      'good': 'bg-green-400 text-white',
      'suitable': 'bg-blue-400 text-white',
      'conditionally-suitable': 'bg-yellow-400 text-black',
      'not-suitable': 'bg-gray-200 text-gray-600'
    };
    return colors[rating] || 'bg-gray-200';
  };
  
  const renderBadge = (rating) => {
    const labels = {
      'best': 'Najlepszy',
      'good': 'Dobrze dopasowany',
      'suitable': 'Odpowiedni',
      'conditionally-suitable': 'Warunkowo odpowiedni',
      'not-suitable': 'Nie odpowiedni'
    };
    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getBadgeColor(rating)}`}>
        {labels[rating]} {renderRating(rating)}
      </span>
    );
  };

  return (
    <div className="tile">
      <div className="tile-header">
        <h2 className="tile-title">Dopasuj chłodziwo</h2>
      </div>
      
      <div className="input-group">
        <div className="input-wrapper">
          <label className="input-label">Twardość wody (°dH)</label>
          <input
            type="number"
            className="input-field"
            value={waterHardness}
            onChange={(e) => setWaterHardness(e.target.value)}
            placeholder="Podaj twardość wody (opcjonalnie)"
          />
          <small className="text-gray-500">Pozostaw puste, jeśli twardość wody nie jest istotna</small>
        </div>
        
        <div className="input-wrapper">
          <label className="input-label">Materiały obrabiane <span className="text-red-500">*</span></label>
          <div className="checkbox-container grid grid-cols-2 md:grid-cols-3 gap-2">
            {allMaterials.map(material => (
              <div key={material.id} className="checkbox-item flex items-center">
                <input
                  type="checkbox"
                  id={`material-${material.id}`}
                  checked={selectedMaterials.includes(material.id)}
                  onChange={() => handleSelectMaterial(material.id)}
                  className="mr-2"
                />
                <label htmlFor={`material-${material.id}`}>{material.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="input-wrapper">
          <label className="input-label">Rodzaj obróbki <span className="text-red-500">*</span></label>
          <div className="checkbox-container">
            {allOperations.map(operation => (
              <div key={operation.id} className="checkbox-item flex items-center">
                <input
                  type="checkbox"
                  id={`operation-${operation.id}`}
                  checked={selectedOperations.includes(operation.id)}
                  onChange={() => handleSelectOperation(operation.id)}
                  className="mr-2"
                />
                <label htmlFor={`operation-${operation.id}`}>{operation.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="input-wrapper">
          <label className="input-label">Wydajność smarowania (opcjonalnie)</label>
          <div className="checkbox-container">
            {allLubrication.map(lubrication => (
              <div key={lubrication.id} className="checkbox-item flex items-center">
                <input
                  type="checkbox"
                  id={`lubrication-${lubrication.id}`}
                  checked={selectedLubrication.includes(lubrication.id)}
                  onChange={() => handleSelectLubrication(lubrication.id)}
                  className="mr-2"
                />
                <label htmlFor={`lubrication-${lubrication.id}`}>{lubrication.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="input-wrapper mt-4">
          <button
            className="btn btn-primary"
            onClick={findBestCoolants}
            disabled={selectedMaterials.length === 0 || selectedOperations.length === 0}
          >
            Znajdź najlepsze chłodziwa
          </button>
        </div>
      </div>
      
      {results.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Wyniki wyszukiwania</h3>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="show-components" 
                checked={showComponents} 
                onChange={() => setShowComponents(!showComponents)}
                className="mr-2"
              />
              <label htmlFor="show-components">Pokaż składniki produktu</label>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {Object.keys({best: 1, good: 1, suitable: 1, 'conditionally-suitable': 1, 'not-suitable': 1}).map(rating => (
                <div key={rating} className="flex items-center">
                  {renderBadge(rating)}
                </div>
              ))}
            </div>
          </div>
          
          <div className="table-container overflow-x-auto">
            <table className="data-table w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">Nazwa chłodziwa</th>
                  <th className="p-2 border text-center">Zakres twardości</th>
                  <th className="p-2 border text-center">Twardość całkowita</th>
                  <th className="p-2 border text-center">Zawartość oleju (%)</th>
                  <th className="p-2 border text-center">Mnożnik refrakcyjny</th>
                  {showComponents && (
                    <th className="p-2 border text-center">Składniki</th>
                  )}
                  <th className="p-2 border text-center">Dopasowanie do materiałów</th>
                  <th className="p-2 border text-center">Dopasowanie do obróbki</th>
                  {selectedLubrication.length > 0 && (
                    <th className="p-2 border text-center">Wydajność smarowania</th>
                  )}
                  <th className="p-2 border text-center">Wynik ogólny</th>
                </tr>
              </thead>
              <tbody>
                {results.map((coolant, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border font-bold">{coolant.name}</td>
                    <td className="p-2 border text-center">{coolant.hardnessRange}</td>
                    <td className="p-2 border text-center">{coolant.hardnessTotal}</td>
                    <td className="p-2 border text-center">{coolant.oilPercent}%</td>
                    <td className="p-2 border text-center">{coolant.refractionMultiplier}</td>
                    
                    {showComponents && (
                      <td className="p-2 border">
                        <div className="flex gap-1 flex-wrap">
                          {coolant.components.bor && <span className="px-1 bg-blue-100 rounded">Bor</span>}
                          {coolant.components.amin && <span className="px-1 bg-green-100 rounded">Amin</span>}
                          {coolant.components.dcha && <span className="px-1 bg-yellow-100 rounded">DCHA</span>}
                          {coolant.components.fad && <span className="px-1 bg-red-100 rounded">FAD</span>}
                        </div>
                      </td>
                    )}
                    
                    <td className="p-2 border">
                      {selectedMaterials.map(materialId => (
                        <div key={materialId} className="flex justify-between items-center mb-1">
                          <span className="mr-1">{allMaterials.find(m => m.id === materialId).name}:</span>
                          <span>{renderRating(coolant.materials[materialId])}</span>
                        </div>
                      ))}
                    </td>
                    
                    <td className="p-2 border">
                      {selectedOperations.map(operationId => (
                        <div key={operationId} className="flex justify-between items-center mb-1">
                          <span className="mr-1">{allOperations.find(o => o.id === operationId).name}:</span>
                          <span>{renderRating(coolant.operationTypes[operationId])}</span>
                        </div>
                      ))}
                    </td>
                    
                    {selectedLubrication.length > 0 && (
                      <td className="p-2 border">
                        {selectedLubrication.map(lubricationId => (
                          <div key={lubricationId} className="flex justify-between items-center mb-1">
                            <span className="mr-1">{allLubrication.find(l => l.id === lubricationId).name}:</span>
                            <span>{renderRating(coolant.lubricationEfficiency[lubricationId])}</span>
                          </div>
                        ))}
                      </td>
                    )}
                    
                    <td className="p-2 border text-center font-bold">
                      {coolant.totalScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {selectedMaterials.length > 0 && selectedOperations.length > 0 && results.length === 0 && (
        <div className="result-tile error mt-4 p-4 bg-red-100 text-red-700 rounded">
          Nie znaleziono pasujących chłodziw. Spróbuj zmienić kryteria wyszukiwania.
        </div>
      )}
    </div>
  );
};

export default CoolantSelector;
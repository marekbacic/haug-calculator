import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import './index.css';

// Baza danych chłodziw
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
  }
  // Tutaj można dodać więcej chłodziw
];

// Ekran logowania
function LoginScreen({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    
    if (!credentials.email || !credentials.password) {
      setError('Wprowadź email i hasło');
      setLoading(false);
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      // Obsługa logowania przekazana jest do funkcji zwrotnej onAuthStateChanged w komponencie App
      setLoading(false);
    } catch (error) {
      console.error('Błąd logowania:', error);
      setError('Nieprawidłowy email lub hasło');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Haug Chemie®Polska HelpDesk</h1>
          <img src="https://i.ibb.co/fYhLC13J/Projekt-bez-nazwy-16.png00" alt="Logo" className="login-logo" />
        </div>
        
        <div className="login-form">
          <h2>Logowanie</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="input-field"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              placeholder="Podaj adres email"
            />
          </div>
          
          <div className="form-group">
            <label>Hasło</label>
            <input
              type="password"
              className="input-field"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="Podaj hasło"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          
          <button
            className="btn btn-primary btn-login"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
          

        </div>
      </div>
    </div>
  );
}

// Kalkulator zużycia chemii
function ChemicalConsumptionCalculator({ products }) {
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
}

// Kalkulator objętości dla eska®strip H 365A
function VolumeCalculator() {
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
}

// Kalkulator uzupełniania stężenia chemii
function ConcentrationCalculator({ products }) {
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
}

// Selektor chłodziw
function CoolantSelector() {
  const [waterHardness, setWaterHardness] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedOperations, setSelectedOperations] = useState([]);
  const [results, setResults] = useState([]);
  
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
    if (!waterHardness || selectedMaterials.length === 0 || selectedOperations.length === 0) {
      return;
    }
    
    const hardnessValue = parseFloat(waterHardness);
    
    const scoredCoolants = coolantDatabase.map(coolant => {
      let isHardnessInRange = true;
      if (coolant.hardnessRange !== "-") {
        const [min, max] = coolant.hardnessRange.split('-').map(Number);
        isHardnessInRange = hardnessValue >= min && hardnessValue <= max;
      }
      
      let materialScore = 0;
      selectedMaterials.forEach(materialId => {
        materialScore += getSuitabilityScore(coolant.materials[materialId]);
      });
      
      let operationScore = 0;
      selectedOperations.forEach(operationId => {
        operationScore += getSuitabilityScore(coolant.operationTypes[operationId]);
      });
      
      const totalScore = isHardnessInRange ? (materialScore + operationScore) : 0;
      
      return {
        ...coolant,
        isHardnessInRange,
        materialScore,
        operationScore,
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
            placeholder="Podaj twardość wody"
          />
        </div>
        
        <div className="input-wrapper">
          <label className="input-label">Materiały obrabiane</label>
          <div className="checkbox-container">
            {allMaterials.map(material => (
              <div key={material.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`material-${material.id}`}
                  checked={selectedMaterials.includes(material.id)}
                  onChange={() => handleSelectMaterial(material.id)}
                />
                <label htmlFor={`material-${material.id}`}>{material.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="input-wrapper">
          <label className="input-label">Rodzaj obróbki</label>
          <div className="checkbox-container">
            {allOperations.map(operation => (
              <div key={operation.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`operation-${operation.id}`}
                  checked={selectedOperations.includes(operation.id)}
                  onChange={() => handleSelectOperation(operation.id)}
                />
                <label htmlFor={`operation-${operation.id}`}>{operation.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="input-wrapper">
          <button
            className="btn btn-primary"
            onClick={findBestCoolants}
            disabled={!waterHardness || selectedMaterials.length === 0 || selectedOperations.length === 0}
          >
            Znajdź najlepsze chłodziwa
          </button>
        </div>
      </div>
      
      {results.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nazwa chłodziwa</th>
                <th>Zakres twardości</th>
                <th>Zawartość oleju</th>
                <th>Dopasowanie do materiałów</th>
                <th>Dopasowanie do obróbki</th>
                <th>Wynik ogólny</th>
              </tr>
            </thead>
            <tbody>
              {results.map((coolant, index) => (
                <tr key={index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td className="font-bold">{coolant.name}</td>
                  <td className="text-center">{coolant.hardnessRange}</td>
                  <td className="text-center">{coolant.oilPercent}%</td>
                  <td>
                    {selectedMaterials.map(materialId => (
                      <div key={materialId} className="rating-item">
                        <span>{allMaterials.find(m => m.id === materialId).name}:</span>
                        <span>{renderRating(coolant.materials[materialId])}</span>
                      </div>
                    ))}
                  </td>
                  <td>
                    {selectedOperations.map(operationId => (
                      <div key={operationId} className="rating-item">
                        <span>{allOperations.find(o => o.id === operationId).name}:</span>
                        <span>{renderRating(coolant.operationTypes[operationId])}</span>
                      </div>
                    ))}
                  </td>
                  <td className="text-center font-bold">
                    {coolant.totalScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {waterHardness && selectedMaterials.length > 0 && selectedOperations.length > 0 && results.length === 0 && (
        <div className="result-tile error">
          Nie znaleziono pasujących chłodziw. Spróbuj zmienić kryteria wyszukiwania.
        </div>
      )}
    </div>
  );
}

// Panel handlowca
function SalesRepPanel({ currentUser, products }) {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    date: new Date().toISOString().split('T')[0],
    zones: Array(7).fill().map(() => ({
      product: '',
      concentration: '',
      conductivity: '',
      temperature: '',
      ph: ''
    }))
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  
  // Pobierz klientów z Firebase
  const fetchClients = async () => {
    try {
      const q = query(collection(db, "clients"), where("salesRepId", "==", currentUser.id));
      const querySnapshot = await getDocs(q);
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(clientsData);
      setFilteredClients(clientsData);
    } catch (error) {
      console.error("Błąd podczas pobierania klientów:", error);
    }
  };
          
  // Pobierz raporty dla wybranego klienta
  const fetchReports = async (clientId) => {
    try {
      const q = query(collection(db, "reports"), where("clientId", "==", clientId));
      const querySnapshot = await getDocs(q);
      const reportsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sortuj raporty od najnowszego
      reportsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setReports(reportsData);
    } catch (error) {
      console.error("Błąd podczas pobierania raportów:", error);
    }
  };
  
  // Efekt przy pierwszym ładowaniu
  useEffect(() => {
    if (currentUser) {
      fetchClients();
    }
  }, [currentUser]);
  
  // Efekt przy zmianie wybranego klienta
  useEffect(() => {
    if (selectedClient) {
      fetchReports(selectedClient.id);
    }
  }, [selectedClient]);
  
  // Efekt przy zmianie wyszukiwania
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = clients.filter(client => 
        client.name.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  // Dodaj nowego klienta
  const addClient = async () => {
    if (newClientName.trim() === '') return;
    
    try {
      await addDoc(collection(db, "clients"), {
        name: newClientName,
        salesRepId: currentUser.id,
        createdAt: new Date().toISOString()
      });
      
      fetchClients();
      setNewClientName('');
      setShowAddClientModal(false);
    } catch (error) {
      console.error("Błąd podczas dodawania klienta:", error);
    }
  };
  
  // Dodaj nowy raport
  const addReport = async () => {
    if (!selectedClient) return;
    
    const filledZones = newReport.zones.filter(zone => 
      zone.product || zone.concentration || zone.conductivity || zone.temperature || zone.ph
    );
    
    if (filledZones.length === 0) {
      alert("Wypełnij dane dla co najmniej jednej strefy");
      return;
    }
    
    try {
      await addDoc(collection(db, "reports"), {
        clientId: selectedClient.id,
        salesRepId: currentUser.id,
        date: newReport.date,
        zones: filledZones,
        createdAt: new Date().toISOString()
      });
      
      fetchReports(selectedClient.id);
      
      // Resetuj formularz
      setNewReport({
        date: new Date().toISOString().split('T')[0],
        zones: Array(7).fill().map(() => ({
          product: '',
          concentration: '',
          conductivity: '',
          temperature: '',
          ph: ''
        }))
      });
    } catch (error) {
      console.error("Błąd podczas dodawania raportu:", error);
    }
  };
  
  // Aktualizuj dane strefy w nowym raporcie
  const updateZoneData = (index, field, value) => {
    const updatedZones = [...newReport.zones];
    updatedZones[index] = {
      ...updatedZones[index],
      [field]: value
    };
    setNewReport({
      ...newReport,
      zones: updatedZones
    });
  };
  
  return (
    <div className="tile">
      <div className="tile-header">
        <h2 className="tile-title">Panel Handlowca</h2>
      </div>
      
      <div className="flex-container">
        <div className="clients-section">
          <div className="clients-header">
            <h3>Klienci</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddClientModal(true)}
            >
              Dodaj klienta
            </button>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Wyszukaj klienta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="clients-grid">
            {filteredClients.length === 0 ? (
              <p className="no-clients">Brak klientów</p>
            ) : (
              filteredClients.map(client => (
                <div 
                  key={client.id}
                  className={`client-card ${selectedClient && selectedClient.id === client.id ? 'selected' : ''}`}
                  onClick={() => setSelectedClient(client)}
                >
                  <h4 className="client-name">{client.name}</h4>
                  <p className="client-date">
                    Dodano: {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'brak daty'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="reports-section">
          {selectedClient ? (
            <>
              <h3 className="reports-header">Raporty - {selectedClient.name}</h3>
              
              <div className="report-form">
                <h4>Nowy Raport</h4>
                <div className="form-row">
                  <label>Data wizyty</label>
                  <input
                    type="date"
                    className="input-field"
                    value={newReport.date}
                    onChange={(e) => setNewReport({...newReport, date: e.target.value})}
                  />
                </div>
                
                <div className="zones-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Strefa</th>
                        <th>Produkt</th>
                        <th>Stężenie (%)</th>
                        <th>Przewodność (μS/cm)</th>
                        <th>Temperatura (°C)</th>
                        <th>pH</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newReport.zones.map((zone, index) => (
                        <tr key={index}>
                          <td>Strefa {index + 1}</td>
                          <td>
                            <select
                              className="input-field"
                              value={zone.product}
                              onChange={(e) => updateZoneData(index, 'product', e.target.value)}
                            >
                              <option value="">Wybierz produkt</option>
                              <option value="woda_sieciowa">Woda sieciowa</option>
                              <option value="woda_demi">Woda DEMI</option>
                              {products.map(product => (
                                <option key={product.id} value={product.name}>{product.name}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input-field"
                              value={zone.concentration}
                              onChange={(e) => updateZoneData(index, 'concentration', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input-field"
                              value={zone.conductivity}
                              onChange={(e) => updateZoneData(index, 'conductivity', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input-field"
                              value={zone.temperature}
                              onChange={(e) => updateZoneData(index, 'temperature', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.1"
                              className="input-field"
                              value={zone.ph}
                              onChange={(e) => updateZoneData(index, 'ph', e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="form-actions">
                  <button
                    className="btn btn-primary"
                    onClick={addReport}
                  >
                    Zapisz raport
                  </button>
                </div>
              </div>
              
              <div className="reports-history">
                <h4>Historia raportów</h4>
                {reports.length === 0 ? (
                  <p className="no-reports">Brak historii raportów</p>
                ) : (
                  <div className="reports-list">
                    {reports.map(report => (
                      <div key={report.id} className="report-item">
                        <div className="report-header">
                          <h5>Raport z dnia {new Date(report.date).toLocaleDateString()}</h5>
                        </div>
                        <div className="table-container">
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>Strefa</th>
                                <th>Produkt</th>
                                <th>Stężenie (%)</th>
                                <th>Przewodność</th>
                                <th>Temp. (°C)</th>
                                <th>pH</th>
                              </tr>
                            </thead>
                            <tbody>
                              {report.zones.map((zone, idx) => (
                                <tr key={idx}>
                                  <td>Strefa {idx + 1}</td>
                                  <td>{zone.product}</td>
                                  <td className="text-center">{zone.concentration}</td>
                                  <td className="text-center">{zone.conductivity}</td>
                                  <td className="text-center">{zone.temperature}</td>
                                  <td className="text-center">{zone.ph}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-client-selected">
              <p>Wybierz klienta, aby zobaczyć jego raporty</p>
            </div>
          )}
        </div>
      </div>
      
      {showAddClientModal && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="modal-title">Dodaj nowego klienta</h3>
            <div className="modal-form">
              <label>Nazwa klienta</label>
              <input
                type="text"
                className="input-field"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Podaj nazwę klienta"
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddClientModal(false)}
              >
                Anuluj
              </button>
              <button
                className="btn btn-primary"
                onClick={addClient}
              >
                Dodaj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Zarządzanie użytkownikami (Admin Panel)
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'salesRep'
  });
  const [editingUser, setEditingUser] = useState(null);
  
  // Pobierz użytkowników z Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(usersData);
    } catch (error) {
      console.error("Błąd podczas pobierania użytkowników:", error);
      setUsers([]);
    }
  };
  
  // Dodaj nowego użytkownika
  const addUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert("Wypełnij wszystkie pola");
      return;
    }
    
    try {
      // Utwórz konto użytkownika w Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const uid = userCredential.user.uid;
      
      // Dodaj dane użytkownika do Firestore
      await setDoc(doc(db, "users", uid), {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date().toISOString()
      });
      
      // Odśwież listę użytkowników
      fetchUsers();
      
      // Zamknij modal i wyczyść formularz
      setShowAddUserModal(false);
      setNewUser({
        username: '',
        email: '',
        password: '',
        role: 'salesRep'
      });
      
    } catch (error) {
      console.error("Błąd podczas dodawania użytkownika:", error);
      alert(`Błąd: ${error.message}`);
    }
  };
  
  // Aktualizuj użytkownika
  const updateUser = async () => {
    if (!editingUser || !editingUser.username || !editingUser.email) {
      alert("Wypełnij wszystkie pola");
      return;
    }
    
    try {
      // Aktualizuj dane użytkownika w Firestore
      const userRef = doc(db, "users", editingUser.id);
      await updateDoc(userRef, {
        username: editingUser.username,
        role: editingUser.role,
        updatedAt: new Date().toISOString()
      });
      
      // Odśwież listę użytkowników
      fetchUsers();
      
      // Zamknij modal i wyczyść stan
      setShowEditUserModal(false);
      setEditingUser(null);
      
    } catch (error) {
      console.error("Błąd podczas aktualizacji użytkownika:", error);
      alert(`Błąd: ${error.message}`);
    }
  };
  
  // Usuń użytkownika
  const deleteUser = async (userId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
      return;
    }
    
    try {
      // Usuń dane użytkownika z Firestore
      await deleteDoc(doc(db, "users", userId));
      
      // Odśwież listę użytkowników
      fetchUsers();
      
    } catch (error) {
      console.error("Błąd podczas usuwania użytkownika:", error);
      alert(`Błąd: ${error.message}`);
    }
  };
  
  // Efekt przy pierwszym ładowaniu
  useEffect(() => {
    fetchUsers();
  }, []);
  
  return (
    <div className="tile">
      <div className="tile-header">
        <h2 className="tile-title">Zarządzanie Użytkownikami</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddUserModal(true)}
        >
          Dodaj użytkownika
        </button>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nazwa użytkownika</th>
              <th>Email</th>
              <th>Rola</th>
              <th>Data utworzenia</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  {user.role === 'admin' ? 'Administrator' : 'Handlowiec'}
                </td>
                <td>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </td>
                <td>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditingUser(user);
                      setShowEditUserModal(true);
                    }}
                  >
                    Edytuj
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(user.id)}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showAddUserModal && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="modal-title">Dodaj nowego użytkownika</h3>
            <div className="modal-form">
              <div className="form-row">
                <label>Nazwa użytkownika</label>
                <input
                  type="text"
                  className="input-field"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  placeholder="Podaj nazwę użytkownika"
                />
              </div>
              <div className="form-row">
                <label>Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Podaj adres email"
                />
              </div>
              <div className="form-row">
                <label>Hasło</label>
                <input
                  type="password"
                  className="input-field"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Podaj hasło"
                />
              </div>
              <div className="form-row">
                <label>Rola</label>
                <select
                  className="input-field"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="salesRep">Handlowiec</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddUserModal(false)}
              >
                Anuluj
              </button>
              <button
                className="btn btn-primary"
                onClick={addUser}
              >
                Dodaj
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showEditUserModal && editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="modal-title">Edytuj użytkownika</h3>
            <div className="modal-form">
              <div className="form-row">
                <label>Nazwa użytkownika</label>
                <input
                  type="text"
                  className="input-field"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                  placeholder="Podaj nazwę użytkownika"
                />
              </div>
              <div className="form-row">
                <label>Email (nie można zmienić)</label>
                <input
                  type="email"
                  className="input-field"
                  value={editingUser.email}
                  disabled
                />
              </div>
              <div className="form-row">
                <label>Rola</label>
                <select
                  className="input-field"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="salesRep">Handlowiec</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                }}
              >
                Anuluj
              </button>
              <button
                className="btn btn-primary"
                onClick={updateUser}
              >
                Zapisz zmiany
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Zarządzanie produktami
function ProductManagement({ fetchProducts, products }) {
  const [newProduct, setNewProduct] = useState({ name: '', consumption: 0 });
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Dodaj produkt
  const addProduct = async () => {
    if (newProduct.name && newProduct.consumption > 0) {
      try {
        await addDoc(collection(db, "products"), {
          name: newProduct.name,
          consumption: parseFloat(newProduct.consumption),
          createdAt: new Date().toISOString()
        });
        
        // Odśwież produkty
        fetchProducts();
        setNewProduct({ name: '', consumption: 0 });
      } catch (error) {
        console.error("Błąd podczas dodawania produktu:", error);
        alert("Wystąpił błąd podczas dodawania produktu");
      }
    }
  };
  
  // Aktualizuj produkt
  const updateProduct = async () => {
    if (editingProduct && editingProduct.name && editingProduct.consumption > 0) {
      try {
        const productRef = doc(db, "products", editingProduct.id);
        await updateDoc(productRef, {
          name: editingProduct.name,
          consumption: parseFloat(editingProduct.consumption),
          updatedAt: new Date().toISOString()
        });
        
        // Odśwież produkty
        fetchProducts();
        setEditingProduct(null);
      } catch (error) {
        console.error("Błąd podczas aktualizacji produktu:", error);
        alert("Wystąpił błąd podczas aktualizacji produktu");
      }
    }
  };
  
  // Usuń produkt
  const deleteProduct = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten produkt?")) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, "products", id));
      
      // Odśwież produkty
      fetchProducts();
    } catch (error) {
      console.error("Błąd podczas usuwania produktu:", error);
      alert("Wystąpił błąd podczas usuwania produktu");
    }
  };
  
  return (
    <div className="tile">
      <div className="tile-header">
        <h2 className="tile-title">Zarządzanie Produktami</h2>
      </div>
      
      <div className="product-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Nazwa produktu"
            className="input-field"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          />
        </div>
        
        <div className="form-row">
          <input
            type="number"
            placeholder="Zużycie g/m²"
            className="input-field"
            value={newProduct.consumption || ''}
            onChange={(e) => setNewProduct({...newProduct, consumption: parseFloat(e.target.value)})}
          />
        </div>
        
        <div className="form-row">
          <button 
            className="btn btn-primary"
            onClick={addProduct}
          >
            Dodaj produkt
          </button>
        </div>
      </div>
      
      {editingProduct && (
        <div className="edit-product-form">
          <h4>Edytuj produkt</h4>
          <div className="form-row">
            <input
              type="text"
              placeholder="Nazwa produktu"
              className="input-field"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
            />
          </div>
          
          <div className="form-row">
            <input
              type="number"
              placeholder="Zużycie g/m²"
              className="input-field"
              value={editingProduct.consumption || ''}
              onChange={(e) => setEditingProduct({...editingProduct, consumption: parseFloat(e.target.value)})}
            />
          </div>
          
          <div className="form-actions">
            <button 
              className="btn btn-primary"
              onClick={updateProduct}
            >
              Zapisz zmiany
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setEditingProduct(null)}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nazwa Produktu</th>
              <th>Zużycie (g/m²)</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td className="text-center">{product.consumption}</td>
                <td>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingProduct(product)}
                  >
                    Edytuj
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Zarządzanie wszystkimi klientami (Admin)
function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [reports, setReports] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pobierz wszystkich klientów
  const fetchAllClients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setClients(clientsData);
    } catch (error) {
      console.error("Błąd podczas pobierania klientów:", error);
      setClients([]);
    }
  };
  
  // Pobierz handlowców
  const fetchSalesReps = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "salesRep"));
      const querySnapshot = await getDocs(q);
      const salesRepsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setSalesReps(salesRepsData);
    } catch (error) {
      console.error("Błąd podczas pobierania handlowców:", error);
      setSalesReps([]);
    }
  };
  
  // Pobierz raporty dla wybranego klienta
  const fetchClientReports = async (clientId) => {
    try {
      const q = query(collection(db, "reports"), where("clientId", "==", clientId));
      const querySnapshot = await getDocs(q);
      const reportsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sortuj raporty od najnowszego
      reportsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setReports(reportsData);
    } catch (error) {
      console.error("Błąd podczas pobierania raportów:", error);
      setReports([]);
    }
  };
  
  // Przypisz klienta do handlowca
  const assignClientToSalesRep = async (clientId, salesRepId) => {
    try {
      const clientRef = doc(db, "clients", clientId);
      await updateDoc(clientRef, {
        salesRepId: salesRepId,
        updatedAt: new Date().toISOString()
      });
      
      // Odśwież listę klientów
      fetchAllClients();
    } catch (error) {
      console.error("Błąd podczas przypisywania klienta:", error);
      alert("Wystąpił błąd podczas przypisywania klienta");
    }
  };
  
  // Efekt przy pierwszym ładowaniu
  useEffect(() => {
    fetchAllClients();
    fetchSalesReps();
  }, []);
  
  // Efekt przy zmianie wybranego klienta
  useEffect(() => {
    if (selectedClient) {
      fetchClientReports(selectedClient.id);
    }
  }, [selectedClient]);
  
  // Filtrowanie klientów na podstawie wyszukiwania
  const filteredClients = searchTerm.trim() === ''
    ? clients
    : clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // Pobierz nazwę handlowca na podstawie ID
  const getSalesRepName = (salesRepId) => {
    const salesRep = salesReps.find(rep => rep.id === salesRepId);
    return salesRep ? salesRep.username : 'Nieprzypisany';
  };
  
  return (
    <div className="tile">
      <div className="tile-header">
        <h2 className="tile-title">Zarządzanie Klientami</h2>
      </div>
      
      <div className="flex-container">
        <div className="clients-section">
          <h3>Wszyscy Klienci</h3>
          
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Wyszukaj klienta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="clients-grid">
            {filteredClients.length === 0 ? (
              <p className="no-clients">Brak klientów</p>
            ) : (
              filteredClients.map(client => (
                <div 
                  key={client.id}
                  className={`client-card ${selectedClient && selectedClient.id === client.id ? 'selected' : ''}`}
                  onClick={() => setSelectedClient(client)}
                >
                  <h4 className="client-name">{client.name}</h4>
                  <p className="client-rep">
                    Handlowiec: {getSalesRepName(client.salesRepId)}
                  </p>
                  <p className="client-date">
                    Dodano: {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'brak daty'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="client-details">
          {selectedClient ? (
            <>
              <div className="client-header">
                <h4>{selectedClient.name}</h4>
                <div className="client-assign">
                  <span>Przypisz do:</span>
                  <select
                    className="input-field"
                    value={selectedClient.salesRepId || ''}
                    onChange={(e) => assignClientToSalesRep(selectedClient.id, e.target.value)}
                  >
                    <option value="">Wybierz handlowca</option>
                    {salesReps.map(rep => (
                      <option key={rep.id} value={rep.id}>{rep.username}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <h4>Historia raportów</h4>
              {reports.length === 0 ? (
                <p className="no-reports">Brak historii raportów</p>
              ) : (
                <div className="reports-list">
                  {reports.map(report => (
                    <div key={report.id} className="report-item">
                      <div className="report-header">
                        <h5>Raport z dnia {new Date(report.date).toLocaleDateString()}</h5>
                      </div>
                      <div className="table-container">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Strefa</th>
                              <th>Produkt</th>
                              <th>Stężenie (%)</th>
                              <th>Przewodność</th>
                              <th>Temp. (°C)</th>
                              <th>pH</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.zones.map((zone, idx) => (
                              <tr key={idx}>
                                <td>Strefa {idx + 1}</td>
                                <td>{zone.product}</td>
                                <td className="text-center">{zone.concentration}</td>
                                <td className="text-center">{zone.conductivity}</td>
                                <td className="text-center">{zone.temperature}</td>
                                <td className="text-center">{zone.ph}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="no-client-selected">
              <p>Wybierz klienta, aby zobaczyć szczegóły</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Panel administratora
function AdminPanel({ fetchProducts, products }) {
  const [activeSection, setActiveSection] = useState('users');
  
  return (
    <div className="tile">
      <div className="tile-header">
        <h2 className="tile-title">Panel Administratora</h2>
      </div>
      
      <div className="admin-tabs">
        <div 
          className={`admin-tab ${activeSection === 'users' ? 'active' : ''}`}
          onClick={() => setActiveSection('users')}
        >
          Zarządzanie Użytkownikami
        </div>
        <div 
          className={`admin-tab ${activeSection === 'products' ? 'active' : ''}`}
          onClick={() => setActiveSection('products')}
        >
          Zarządzanie Produktami
        </div>
        <div 
          className={`admin-tab ${activeSection === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveSection('clients')}
        >
          Wszyscy Klienci
        </div>
      </div>
      
      <div className="admin-content">
        {activeSection === 'users' && <UserManagement />}
        {activeSection === 'products' && <ProductManagement fetchProducts={fetchProducts} products={products} />}
        {activeSection === 'clients' && <ClientManagement />}
      </div>
    </div>
  );
}

// Główny komponent aplikacji
function App() {
  const [activeTab, setActiveTab] = useState('chemicalConsumption');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [products, setProducts] = useState([
    { id: "1", name: "eska®clean 1001", consumption: 180 },
    { id: "2", name: "eska®clean 2250", consumption: 150 },
    { id: "3", name: "eska®strip H 365A", consumption: 220, density: 1.21 },
    { id: "4", name: "eska®phos 2023", consumption: 160 },
    { id: "5", name: "eska®phos 3045", consumption: 190 }
  ]);

  // Funkcja inicjalizująca dane w Firebase
  const initializeFirebaseData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      
      if (usersSnapshot.empty) {
        console.log("Inicjalizacja bazy danych z użytkownikami...");
        
        const predefinedUsers = [
          { username: "Admin", email: "admin@haug.com", password: "admin123", role: "admin" },
          { username: "Pawel", email: "pawel@haug.com", password: "pawel123", role: "salesRep" },
          { username: "Mateusz", email: "mateusz@haug.com", password: "mateusz123", role: "salesRep" },
          { username: "Mariusz", email: "mariusz@haug.com", password: "mariusz123", role: "salesRep" },
          { username: "Tomek", email: "tomek@haug.com", password: "tomek123", role: "salesRep" }
        ];
        
        for (const user of predefinedUsers) {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
            const uid = userCredential.user.uid;
            
            await setDoc(doc(db, "users", uid), {
              username: user.username,
              email: user.email,
              role: user.role,
              createdAt: new Date().toISOString()
            });
            
            console.log(`Użytkownik ${user.username} dodany pomyślnie`);
          } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
              console.log(`Użytkownik ${user.email} już istnieje`);
            } else {
              console.error(`Błąd dodawania użytkownika ${user.username}:`, error);
            }
          }
        }
      } else {
        console.log("Użytkownicy już istnieją w bazie danych");
      }
      
      const productsSnapshot = await getDocs(collection(db, "products"));
      
      if (productsSnapshot.empty) {
        console.log("Inicjalizacja bazy danych z produktami...");
        
        const initialProducts = [
          { name: "eska®clean 1001", consumption: 180 },
          { name: "eska®clean 2250", consumption: 150 },
          { name: "eska®strip H 365A", consumption: 220, density: 1.21 },
          { name: "eska®phos 2023", consumption: 160 },
          { name: "eska®phos 3045", consumption: 190 }
        ];
        
        for (const product of initialProducts) {
          await addDoc(collection(db, "products"), {
            ...product,
            createdAt: new Date().toISOString()
          });
        }
        
        console.log("Produkty dodane pomyślnie");
      } else {
        console.log("Produkty już istnieją w bazie danych");
      }
    } catch (error) {
      console.error("Błąd inicjalizacji bazy danych:", error);
    }
  };
  
  // Funkcja wylogowania
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      setActiveTab('chemicalConsumption');
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    }
  };
  
  // Pobierz produkty z Firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (productsData.length > 0) {
        setProducts(productsData);
      }
    } catch (error) {
      console.error("Błąd podczas pobierania produktów:", error);
    }
  };

  // Effect do inicjalizacji danych i obsługi autoryzacji
  useEffect(() => {
    setIsAuthLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", authUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            setCurrentUser({
              id: authUser.uid,
              email: authUser.email,
              username: userData.username,
              role: userData.role
            });
            
            localStorage.setItem('currentUser', JSON.stringify({
              id: authUser.uid,
              email: authUser.email,
              username: userData.username,
              role: userData.role
            }));
            
            if (userData.role === 'admin') {
              setActiveTab('adminPanel');
            } else if (userData.role === 'salesRep') {
              setActiveTab('salesRepPanel');
            }
          }
        } catch (error) {
          console.error('Błąd pobierania danych użytkownika:', error);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
      }
      
      setIsAuthLoading(false);
    });
    
    initializeFirebaseData();
    fetchProducts();
    
    return () => unsubscribe();
  }, []);

  // Renderowanie podczas ładowania
  if (isAuthLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Ładowanie aplikacji...</p>
      </div>
    );
  }

  // Jeśli użytkownik nie jest zalogowany, pokaż ekran logowania
  if (!currentUser) {
    return <LoginScreen />;
  }

  // Renderowanie głównego interfejsu dla zalogowanego użytkownika
  return (
    <div className="app-container">
      <div className="header">
        <div className="header-title">
          <img src="https://i.ibb.co/fYxC8dh8/Projekt-bez-nazwy-17.png" alt="Logo" className="logo" />
          <h1>Haug Chemie®Polska HelpDesk</h1>
        </div>
        
        <div className="user-section">
          <div className="user-info">
            <span>Zalogowany jako: <strong>{currentUser.username}</strong> ({currentUser.role === 'admin' ? 'Administrator' : 'Handlowiec'})</span>
            <button
              className="btn btn-secondary"
              onClick={handleLogout}
            >
              Wyloguj
            </button>
          </div>
        </div>
      </div>
      
      <div className="nav-tabs">
        <div 
          className={`nav-tab ${activeTab === 'chemicalConsumption' ? 'active' : ''}`}
          onClick={() => setActiveTab('chemicalConsumption')}
        >
          Zużycie chemii
        </div>
        <div 
          className={`nav-tab ${activeTab === 'volumeCalculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('volumeCalculator')}
        >
          Kalkulator objętości
        </div>
        <div 
          className={`nav-tab ${activeTab === 'concentrationCalculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('concentrationCalculator')}
        >
          Uzupełnianie stężenia
        </div>
        <div 
          className={`nav-tab ${activeTab === 'coolantSelector' ? 'active' : ''}`}
          onClick={() => setActiveTab('coolantSelector')}
        >
          Dobór chłodziw
        </div>
        {currentUser.role === 'salesRep' && (
          <div 
            className={`nav-tab ${activeTab === 'salesRepPanel' ? 'active' : ''}`}
            onClick={() => setActiveTab('salesRepPanel')}
          >
            Panel handlowca
          </div>
        )}
        {currentUser.role === 'admin' && (
          <div 
            className={`nav-tab ${activeTab === 'adminPanel' ? 'active' : ''}`}
            onClick={() => setActiveTab('adminPanel')}
          >
            Panel administratora
          </div>
        )}
      </div>
      
      <div className="content">
        {activeTab === 'chemicalConsumption' && <ChemicalConsumptionCalculator products={products} />}
        {activeTab === 'volumeCalculator' && <VolumeCalculator />}
        {activeTab === 'concentrationCalculator' && <ConcentrationCalculator products={products} />}
        {activeTab === 'coolantSelector' && <CoolantSelector />}
        {activeTab === 'salesRepPanel' && currentUser.role === 'salesRep' && 
          <SalesRepPanel currentUser={currentUser} products={products} />
        }
        {activeTab === 'adminPanel' && currentUser.role === 'admin' && 
          <AdminPanel fetchProducts={fetchProducts} products={products} />
        }
      </div>
      
      <footer className="footer">
        <p>© 2025 Haug Chemie®Polska Prawa zastrzeżone.</p>
      </footer>
    </div>
  );
}

export default App;
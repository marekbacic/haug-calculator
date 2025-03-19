import React, { useState, useEffect, useCallback } from 'react';
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
  getDoc,
  orderBy
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import './index.css';
// Corrected jsPDF imports
import { jsPDF } from 'jspdf';
// Explicitly import autoTable plugin
import autoTable from 'jspdf-autotable';

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

// Pomocnicza funkcja do formatowania daty
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Generowanie raportu PDF dla całego klienta
function generateClientReport(client, reports, notes) {
  // Tworzenie instancji jsPDF
  const doc = new jsPDF();
  
  // Tytuł
  doc.setFontSize(18);
  doc.text(`Raport dla klienta: ${client.name}`, 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Data wygenerowania: ${new Date().toLocaleString('pl-PL')}`, 14, 30);
  
  // Historia raportów
  doc.setFontSize(14);
  doc.text('Historia raportów', 14, 45);
  
  let yPos = 55;
  
  if (!reports || reports.length === 0) {
    doc.setFontSize(12);
    doc.text('Brak historii raportów', 14, yPos);
    yPos += 10;
  } else {
    reports.forEach((report, index) => {
      // Sprawdź, czy potrzebna nowa strona
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`Raport z dnia ${formatDate(report.date)}`, 14, yPos);
      yPos += 10;
      
      // Tabela danych dla stref
      if (report.zones && report.zones.length > 0) {
        // Przygotuj dane do tabeli
        const tableData = report.zones.map((zone, idx) => [
          `Strefa ${idx + 1}`,
          zone.product || '-',
          zone.concentration || '-',
          zone.conductivity || '-',
          zone.temperature || '-',
          zone.ph || '-'
        ]);
        
        // Use autoTable directly
        autoTable(doc, {
          startY: yPos,
          head: [['Strefa', 'Produkt', 'Stężenie (%)', 'Przewodność', 'Temp. (°C)', 'pH']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [66, 133, 244] },
          margin: { top: 10 }
        });
        
        // Zapisz nową pozycję Y po tabeli
        yPos = doc.lastAutoTable.finalY + 15;
      }
    });
  }
  
  // Notatki
  doc.addPage();
  yPos = 20;
  
  doc.setFontSize(14);
  doc.text('Notatki', 14, yPos);
  yPos += 10;
  
  if (!notes || notes.length === 0) {
    doc.setFontSize(12);
    doc.text('Brak notatek', 14, yPos);
  } else {
    notes.forEach((note, index) => {
      // Sprawdź, czy potrzebna nowa strona
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(11);
      doc.text(`Data: ${formatDate(note.createdAt)}`, 14, yPos);
      yPos += 6;
      
      if (note.updatedAt) {
        doc.text(`Edytowano: ${formatDate(note.updatedAt)}`, 14, yPos);
        yPos += 6;
      }
      
      doc.setFontSize(10);
      
      // Dzielimy tekst notatki na linie pasujące do szerokości strony
      const splitText = doc.splitTextToSize(note.content, 180);
      doc.text(splitText, 14, yPos);
      
      yPos += (splitText.length * 5) + 15;
      
      // Dodaj linię oddzielającą notatki
      if (index < notes.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(14, yPos - 7, 196, yPos - 7);
      }
    });
  }
  
  // Stopka
  doc.setFontSize(8);
  const totalPages = doc.internal.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.text(`Haug Chemie®Polska HelpDesk - Strona ${i} z ${totalPages}`, 14, 290);
  }
  
  return doc;
}

// Generowanie pojedynczego raportu PDF
function generateSingleReportPDF(client, report) {
  const doc = new jsPDF();
  
  // Tytuł
  doc.setFontSize(18);
  doc.text(`Raport dla: ${client.name}`, 14, 20);
  
  doc.setFontSize(14);
  doc.text(`Data raportu: ${new Date(report.date).toLocaleDateString('pl-PL')}`, 14, 30);
  doc.text(`Data wygenerowania: ${new Date().toLocaleDateString('pl-PL')}`, 14, 40);
  
  // Tabela danych dla stref
  if (report.zones && report.zones.length > 0) {
    // Przygotuj dane do tabeli
    const tableData = report.zones.map((zone, idx) => [
      `Strefa ${idx + 1}`,
      zone.product || '-',
      zone.concentration || '-',
      zone.conductivity || '-',
      zone.temperature || '-',
      zone.ph || '-'
    ]);
    
    // Use autoTable directly
    autoTable(doc, {
      startY: 50,
      head: [['Strefa', 'Produkt', 'Stężenie (%)', 'Przewodność', 'Temp. (°C)', 'pH']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [66, 133, 244] },
      margin: { top: 10 }
    });
  }
  
  // Stopka
  doc.setFontSize(8);
  doc.text(`Haug Chemie®Polska HelpDesk - Raport z dnia ${new Date(report.date).toLocaleDateString('pl-PL')}`, 14, 290);
  
  return doc;
}

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

// Komponent notatek klienta
function ClientNotes({ clientId, salesRepId }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Pobierz notatki klienta
  const fetchNotes = useCallback(async () => {
    if (!clientId) return;
    
    setIsLoading(true);
    try {
      // Użyj poprawnej kolekcji i zapytania
      const q = query(
        collection(db, "notes"), 
        where("clientId", "==", clientId),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const notesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt ? new Date(doc.data().createdAt) : new Date(),
        updatedAt: doc.data().updatedAt ? new Date(doc.data().updatedAt) : null
      }));
      
      setNotes(notesData);
    } catch (error) {
      console.error("Błąd podczas pobierania notatek:", error);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  // Efekt przy zmianie klienta
  useEffect(() => {
    fetchNotes();
  }, [clientId, fetchNotes]);

  // Dodaj nową notatkę
  const addNote = async () => {
    if (!newNote.trim() || !clientId) return;
    
    try {
      // Dodaj notatkę do kolekcji notes w Firestore
      await addDoc(collection(db, "notes"), {
        clientId,
        salesRepId,
        content: newNote,
        createdAt: new Date().toISOString(),
        updatedAt: null
      });
      
      setNewNote('');
      fetchNotes(); // Odśwież listę notatek
    } catch (error) {
      console.error("Błąd podczas dodawania notatki:", error);
      alert("Wystąpił błąd podczas dodawania notatki. Spróbuj ponownie.");
    }
  };

  // Aktualizuj notatkę
  const updateNote = async () => {
    if (!editingNote || !editingNote.content.trim()) return;
    
    try {
      const noteRef = doc(db, "notes", editingNote.id);
      await updateDoc(noteRef, {
        content: editingNote.content,
        updatedAt: new Date().toISOString()
      });
      
      setEditingNote(null);
      fetchNotes(); // Odśwież listę notatek
    } catch (error) {
      console.error("Błąd podczas aktualizacji notatki:", error);
      alert("Wystąpił błąd podczas aktualizacji notatki. Spróbuj ponownie.");
    }
  };

  // Usuń notatkę
  const deleteNote = async (noteId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę notatkę?")) return;
    
    try {
      await deleteDoc(doc(db, "notes", noteId));
      fetchNotes(); // Odśwież listę notatek
    } catch (error) {
      console.error("Błąd podczas usuwania notatki:", error);
      alert("Wystąpił błąd podczas usuwania notatki. Spróbuj ponownie.");
    }
  };

  // Przełącz rozwinięcie notatki
  const toggleNoteExpand = (noteId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  // Formatuj datę
  const formatNoteDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="notes-container mt-6">
      <h4 className="notes-header text-xl font-bold mb-4">Notatki</h4>
      
      <div className="add-note-form mb-6">
        <textarea
          className="note-textarea w-full p-3 border border-gray-300 rounded mb-2"
          placeholder="Dodaj nową notatkę..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
        ></textarea>
        <button
          className="btn btn-primary"
          onClick={addNote}
          disabled={!newNote.trim()}
        >
          Dodaj notatkę
        </button>
      </div>
      
      {isLoading ? (
        <div className="notes-loading p-4 text-center text-gray-500">Ładowanie notatek...</div>
      ) : notes.length === 0 ? (
        <div className="no-notes p-4 text-center text-gray-500">Brak notatek dla tego klienta</div>
      ) : (
        <div className="notes-list">
          {notes.map(note => (
            <div key={note.id} className="note-item bg-white p-4 rounded shadow mb-4 break-words">
              {editingNote && editingNote.id === note.id ? (
                <div className="edit-note-form">
                  <textarea
                    className="note-textarea w-full p-3 border border-gray-300 rounded mb-2"
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                    rows={4}
                  ></textarea>
                  <div className="note-actions flex justify-between">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingNote(null)}
                    >
                      Anuluj
                    </button>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={updateNote}
                      disabled={!editingNote.content.trim()}
                    >
                      Zapisz zmiany
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="note-header flex justify-between mb-2">
                    <span className="note-date text-gray-600 text-sm">
                      {formatNoteDate(note.createdAt)}
                      {note.updatedAt && 
                        <span className="note-updated"> (edytowano: {formatNoteDate(note.updatedAt)})</span>
                      }
                    </span>
                    <div className="note-actions">
                      <button 
                        className="btn btn-secondary btn-sm mr-2"
                        onClick={() => setEditingNote(note)}
                      >
                        Edytuj
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteNote(note.id)}
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                  <div className="note-content">
                    {note.content.length > 200 && !expandedNotes[note.id] ? (
                      <>
                        <p>{note.content.substring(0, 200)}...</p>
                        <button 
                          className="text-blue-500 text-sm mt-2"
                          onClick={() => toggleNoteExpand(note.id)}
                        >
                          Pokaż więcej
                        </button>
                      </>
                    ) : note.content.length > 200 ? (
                      <>
                        <p style={{whiteSpace: 'pre-wrap'}}>{note.content}</p>
                        <button 
                          className="text-blue-500 text-sm mt-2"
                          onClick={() => toggleNoteExpand(note.id)}
                        >
                          Pokaż mniej
                        </button>
                      </>
                    ) : (
                      <p style={{whiteSpace: 'pre-wrap'}}>{note.content}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
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
  const [selectedLubrication, setSelectedLubrication] = useState([]);
  const [showComponents, setShowComponents] = useState(false);
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
      if (coolant.hardnessRange !== "-" && waterHardness) {
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
      
      let lubricationScore = 0;
      if (selectedLubrication.length > 0) {
        selectedLubrication.forEach(lubricationId => {
          lubricationScore += getSuitabilityScore(coolant.lubricationEfficiency[lubricationId]);
        });
      } else {
        // Domyślny wynik dla smarowania jeśli nie wybrano
        lubricationScore = 2 * 3; // średni wynik × 3 poziomy
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
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getBadgeColor(rating)}`}>
                    {rating === 'best' ? 'Najlepszy' : 
                     rating === 'good' ? 'Dobrze dopasowany' : 
                     rating === 'suitable' ? 'Odpowiedni' : 
                     rating === 'conditionally-suitable' ? 'Warunkowo odpowiedni' : 
                     'Nie odpowiedni'} {renderRating(rating)}
                  </span>
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
}

// Panel handlowca
function SalesRepPanel({ currentUser, products }) {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [reports, setReports] = useState([]);
  const [notes, setNotes] = useState([]);
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
  const [activeTab, setActiveTab] = useState('reports');
  
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

  // Pobierz notatki dla wybranego klienta
  const fetchNotes = async (clientId) => {
    try {
      const q = query(
        collection(db, "notes"), 
        where("clientId", "==", clientId),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const notesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setNotes(notesData);
    } catch (error) {
      console.error("Błąd podczas pobierania notatek:", error);
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
      fetchNotes(selectedClient.id);
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

  // Generuj raport PDF
  const generatePDF = () => {
    if (!selectedClient) return;
    
    const doc = generateClientReport(selectedClient, reports, notes);
    doc.save(`raport_${selectedClient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="reports-header text-xl font-bold">
                  {selectedClient.name}
                </h3>
                <button 
                  className="btn btn-primary" 
                  onClick={generatePDF}
                >
                  Generuj PDF
                </button>
              </div>
              
              <div className="client-tabs mb-4 border-b">
                <div className="flex">
                  <div 
                    className={`tab-item px-4 py-2 cursor-pointer ${activeTab === 'reports' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
                    onClick={() => setActiveTab('reports')}
                  >
                    Raporty
                  </div>
                  <div 
                    className={`tab-item px-4 py-2 cursor-pointer ${activeTab === 'notes' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
                    onClick={() => setActiveTab('notes')}
                  >
                    Notatki
                  </div>
                </div>
              </div>
              
              {activeTab === 'reports' && (
                <>
                  <div className="report-form">
                    <h4 className="text-lg font-semibold mb-3">Nowy Raport</h4>
                    <div className="form-row mb-4">
                      <label className="block mb-1">Data wizyty</label>
                      <input
                        type="date"
                        className="input-field"
                        value={newReport.date}
                        onChange={(e) => setNewReport({...newReport, date: e.target.value})}
                      />
                    </div>
                    
                    <div className="zones-table overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-2 border">Strefa</th>
                            <th className="p-2 border">Produkt</th>
                            <th className="p-2 border">Stężenie (%)</th>
                            <th className="p-2 border">Przewodność (μS/cm)</th>
                            <th className="p-2 border">Temperatura (°C)</th>
                            <th className="p-2 border">pH</th>
                          </tr>
                        </thead>
                        <tbody>
                          {newReport.zones.map((zone, index) => (
                            <tr key={index}>
                              <td className="p-2 border">Strefa {index + 1}</td>
                              <td className="p-2 border">
                                <select
                                  className="input-field w-full"
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
                              <td className="p-2 border">
                                <input
                                  type="number"
                                  className="input-field w-full"
                                  value={zone.concentration}
                                  onChange={(e) => updateZoneData(index, 'concentration', e.target.value)}
                                />
                              </td>
                              <td className="p-2 border">
                                <input
                                  type="number"
                                  className="input-field w-full"
                                  value={zone.conductivity}
                                  onChange={(e) => updateZoneData(index, 'conductivity', e.target.value)}
                                />
                              </td>
                              <td className="p-2 border">
                                <input
                                  type="number"
                                  className="input-field w-full"
                                  value={zone.temperature}
                                  onChange={(e) => updateZoneData(index, 'temperature', e.target.value)}
                                />
                              </td>
                              <td className="p-2 border">
                                <input
                                  type="number"
                                  step="0.1"
                                  className="input-field w-full"
                                  value={zone.ph}
                                  onChange={(e) => updateZoneData(index, 'ph', e.target.value)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="form-actions mt-4">
                      <button
                        className="btn btn-primary"
                        onClick={addReport}
                      >
                        Zapisz raport
                      </button>
                    </div>
                  </div>
                  
                  <div className="reports-history mt-6">
                    <h4 className="text-lg font-semibold mb-3">Historia raportów</h4>
                    {reports.length === 0 ? (
                      <p className="no-reports p-4 text-center text-gray-500">Brak historii raportów</p>
                    ) : (
                      <div className="reports-list space-y-4">
                        {reports.map(report => (
                          <div key={report.id} className="report-item bg-white p-4 rounded shadow">
                            <div className="report-header mb-3 flex justify-between items-center">
                              <h5 className="font-semibold">Raport z dnia {new Date(report.date).toLocaleDateString()}</h5>
                              
                              {/* Przycisk do generowania PDF dla pojedynczego raportu */}
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                  const doc = generateSingleReportPDF(selectedClient, report);
                                  doc.save(`raport_${selectedClient.name.replace(/\s+/g, '_')}_${new Date(report.date).toISOString().split('T')[0]}.pdf`);
                                }}
                              >
                                Generuj PDF
                              </button>
                            </div>
                            <div className="table-container overflow-x-auto">
                              <table className="data-table w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="p-2 border">Strefa</th>
                                    <th className="p-2 border">Produkt</th>
                                    <th className="p-2 border">Stężenie (%)</th>
                                    <th className="p-2 border">Przewodność</th>
                                    <th className="p-2 border">Temp. (°C)</th>
                                    <th className="p-2 border">pH</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {report.zones.map((zone, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      <td className="p-2 border">Strefa {idx + 1}</td>
                                      <td className="p-2 border">{zone.product}</td>
                                      <td className="p-2 border text-center">{zone.concentration}</td>
                                      <td className="p-2 border text-center">{zone.conductivity}</td>
                                      <td className="p-2 border text-center">{zone.temperature}</td>
                                      <td className="p-2 border text-center">{zone.ph}</td>
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
              )}
              
              {activeTab === 'notes' && (
                <ClientNotes 
                  clientId={selectedClient.id} 
                  salesRepId={currentUser.id}
                />
              )}
            </>
          ) : (
            <div className="no-client-selected p-8 text-center text-gray-500">
              <p>Wybierz klienta, aby zobaczyć jego raporty i notatki</p>
            </div>
          )}
        </div>
      </div>
      
      {showAddClientModal && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="modal-title text-xl font-bold mb-4">Dodaj nowego klienta</h3>
            <div className="modal-form mb-4">
              <label className="block mb-2">Nazwa klienta</label>
              <input
                type="text"
                className="input-field w-full"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Podaj nazwę klienta"
              />
            </div>
            <div className="modal-actions flex justify-end space-x-2">
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
  const [notes, setNotes] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('reports');
  
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

  // Pobierz notatki dla wybranego klienta
  const fetchClientNotes = async (clientId) => {
    try {
      const q = query(
        collection(db, "notes"), 
        where("clientId", "==", clientId),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const notesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setNotes(notesData);
    } catch (error) {
      console.error("Błąd podczas pobierania notatek:", error);
      setNotes([]);
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

  // Generuj raport PDF
  const generatePDF = () => {
    if (!selectedClient) return;
    
    const doc = generateClientReport(selectedClient, reports, notes);
    doc.save(`raport_${selectedClient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
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
      fetchClientNotes(selectedClient.id);
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
              <div className="client-header flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold">{selectedClient.name}</h4>
                <div className="flex space-x-2">
                  <button 
                    className="btn btn-primary" 
                    onClick={generatePDF}
                  >
                    Generuj PDF
                  </button>
                  <div className="client-assign ml-4">
                    <span className="mr-2">Przypisz do:</span>
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
              </div>
              
              <div className="client-tabs mb-4 border-b">
                <div className="flex">
                  <div 
                    className={`tab-item px-4 py-2 cursor-pointer ${activeTab === 'reports' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
                    onClick={() => setActiveTab('reports')}
                  >
                    Raporty
                  </div>
                  <div 
                    className={`tab-item px-4 py-2 cursor-pointer ${activeTab === 'notes' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
                    onClick={() => setActiveTab('notes')}
                  >
                    Notatki
                  </div>
                </div>
              </div>
              
              {activeTab === 'reports' && (
                <>
                  <h4 className="text-lg font-semibold mb-3">Historia raportów</h4>
                  {reports.length === 0 ? (
                    <p className="no-reports p-4 text-center text-gray-500">Brak historii raportów</p>
                  ) : (
                    <div className="reports-list space-y-4">
                      {reports.map(report => (
                        <div key={report.id} className="report-item bg-white p-4 rounded shadow">
                          <div className="report-header mb-3 flex justify-between items-center">
                            <h5 className="font-semibold">Raport z dnia {new Date(report.date).toLocaleDateString()}</h5>
                            
                            {/* Przycisk do generowania PDF dla pojedynczego raportu */}
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                const doc = generateSingleReportPDF(selectedClient, report);
                                doc.save(`raport_${selectedClient.name.replace(/\s+/g, '_')}_${new Date(report.date).toISOString().split('T')[0]}.pdf`);
                              }}
                            >
                              Generuj PDF
                            </button>
                          </div>
                          <div className="table-container overflow-x-auto">
                            <table className="data-table w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="p-2 border">Strefa</th>
                                  <th className="p-2 border">Produkt</th>
                                  <th className="p-2 border">Stężenie (%)</th>
                                  <th className="p-2 border">Przewodność</th>
                                  <th className="p-2 border">Temp. (°C)</th>
                                  <th className="p-2 border">pH</th>
                                </tr>
                              </thead>
                              <tbody>
                                {report.zones.map((zone, idx) => (
                                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="p-2 border">Strefa {idx + 1}</td>
                                    <td className="p-2 border">{zone.product}</td>
                                    <td className="p-2 border text-center">{zone.concentration}</td>
                                    <td className="p-2 border text-center">{zone.conductivity}</td>
                                    <td className="p-2 border text-center">{zone.temperature}</td>
                                    <td className="p-2 border text-center">{zone.ph}</td>
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
              )}
              
              {activeTab === 'notes' && (
                <ClientNotes 
                  clientId={selectedClient.id} 
                  salesRepId={selectedClient.salesRepId}
                />
              )}
            </>
          ) : (
            <div className="no-client-selected p-8 text-center text-gray-500">
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
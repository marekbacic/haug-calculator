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

// Funkcja do obliczania numeru raportu na podstawie istniejących raportów klienta w danym roku
async function calculateReportNumber(clientId) {
  const currentYear = new Date().getFullYear();
  
  // Pobierz wszystkie raporty klienta z bieżącego roku
  const startOfYear = new Date(`${currentYear}-01-01T00:00:00`);
  const endOfYear = new Date(`${currentYear}-12-31T23:59:59`);
  
  try {
    const q = query(
      collection(db, "reports"), 
      where("clientId", "==", clientId),
      where("date", ">=", startOfYear.toISOString()),
      where("date", "<=", endOfYear.toISOString())
    );
    
    const querySnapshot = await getDocs(q);
    // Liczba raportów + 1 będzie nowym numerem
    const reportCount = querySnapshot.docs.length;
    return reportCount + 1;
  } catch (error) {
    console.error("Błąd podczas pobierania raportów:", error);
    // W przypadku błędu, użyj timestamp jako unikalne ID
    return Math.floor(Date.now() / 1000) % 1000;
  }
}

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

// Zmodyfikowana funkcja generowania raportu PDF na papierze firmowym
async function generateCompanyReportPDF(client, report, companyData = {}) {
  // Oblicz numer raportu
  const reportNumber = await calculateReportNumber(client.id);
  // Format: XX/ANL/YYYY (zgodnie z przykładem 23/ANL/2025)
  const formattedReportNumber = `${reportNumber}/ANL/${new Date().getFullYear()}`;
  
  // Tworzenie instancji jsPDF
  const doc = new jsPDF();
  
  // Dodaj obraz tła (papier firmowy) - musi być dostępny jako zasób
  try {
    let img = new Image();
    img.src = 'letterhead_background.jpg'; // ścieżka do papiera firmowego
    doc.addImage(img, 'JPEG', 0, 0, 210, 297);
  } catch (error) {
    console.error("Błąd wczytywania papiera firmowego:", error);
    // Jeśli nie można wczytać obrazu, kontynuuj bez tła
  }
  
  // Formatuj aktualną datę w formacie polskim
  const currentDate = new Date();
  const formattedCurrentDate = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
  
  // Data w prawym górnym rogu (jak w przykładzie)
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Pułtusk, ${formattedCurrentDate}`, 170, 40, { align: 'right' });
  
  // Dane klienta w lewym górnym rogu
  doc.text(`${client.name}`, 20, 40);
  if (client.address) {
    doc.text(`${client.address}`, 20, 45);
  }
  if (client.postalCode && client.city) {
    doc.text(`${client.postalCode} ${client.city}`, 20, 50);
  }
  
  // Tytuł raportu z obramowaniem (jak w przykładzie)
  doc.setFontSize(12);
  // Rysuj prostokąt z obramowaniem wokół tytułu
  doc.setDrawColor(0, 0, 0);
  doc.rect(20, 80, 170, 10);
  doc.text(`Protokół z analizy kąpieli na linii technologicznej nr ${formattedReportNumber}`, 105, 87, {
    align: 'center'
  });
  
  // Data raportu
  const reportDate = new Date(report.date);
  const formattedReportDate = `${reportDate.getDate()} ${new Intl.DateTimeFormat('pl-PL', { month: 'long' }).format(reportDate)} ${reportDate.getFullYear()}`;
  doc.text(`${formattedReportDate} roku`, 105, 100, {
    align: 'center'
  });
  
  // Sekcje raportu
  doc.setFontSize(11);
  let yPos = 120;
  
  // 1. Wykonawcy
  doc.text(`1. Wykonawcy: ${companyData.username || ""}`, 20, yPos);
  yPos += 10;
  
  // 2. Cel badań
  doc.text(`2. Cel badań: Kontrola parametrów procesów.`, 20, yPos);
  yPos += 10;
  
  // 3. Parametry pracy kąpieli
  doc.text(`3. Parametry pracy kąpieli w poszczególnych strefach:`, 20, yPos);
  yPos += 10;
  
  // Nazwa procesu (jeśli podano)
  if (report.processName) {
    doc.text(`${report.processName}:`, 20, yPos);
  } else {
    doc.text(`Proces przygotowania powierzchni:`, 20, yPos);
  }
  yPos += 15;
  
  // Tabela parametrów - używamy dokładnie tych samych nagłówków co w przykładzie
  if (report.zones && report.zones.length > 0) {
    const tableHead = [['Strefa', 'Stęż. preparatu', 'Odczyn pH', 'Przewodność', 'Temperatura']];
    
    const tableData = report.zones.map((zone, idx) => [
      `${idx + 1}. ${zone.product || '-'}`,
      zone.concentration ? `${zone.concentration}%` : 'x',
      zone.ph || 'x',
      zone.conductivity ? `${zone.conductivity} µS/cm` : 'x', 
      zone.temperature ? `${zone.temperature}°C` : 'x'
    ]);
    
    // Użyj autoTable z czerwonym kolorem nagłówków (dokładnie jak w przykładzie)
    autoTable(doc, {
      startY: yPos,
      head: tableHead,
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [231, 76, 60], // Czerwony kolor jak w przykładzie
        textColor: [255, 255, 255],
        fontStyle: 'normal'
      },
      styles: {
        font: 'helvetica',
        fontSize: 10
      },
      margin: { left: 20, right: 20 }
    });
    
    // Zapisz nową pozycję Y po tabeli
    yPos = doc.lastAutoTable.finalY + 15;
  }
  
  // 4. Rezultaty
  doc.text(`4. Rezultaty:`, 20, yPos);
  yPos += 10;
  
  // Dodaj podsumowanie/rezultaty z punktorem
  if (report.summary) {
    const summaryLines = report.summary.split('\n');
    summaryLines.forEach(line => {
      if (line.trim()) {
        doc.text(`• ${line.trim()}`, 25, yPos);
        yPos += 6;
      }
    });
  } else {
    doc.text(`• Brak uwag co do utrzymywania parametrów roztworów kąpieli.`, 25, yPos);
  }
  
  // Podpis
  yPos = 260;
  doc.text(`Z poważaniem,`, 20, yPos);
  yPos += 7;
  doc.text(`${companyData.username || ""}`, 20, yPos);
  yPos += 7;
  doc.text(`Doradca Techniczno-Handlowy`, 20, yPos);
  
  return doc;
}

// Komponent ulepszonej tabeli stref - lepsze wyświetlanie i stylowanie
function EnhancedZonesTable({ zones, onChange, products = [] }) {
  // Dodaj dodatkowe style CSS dla poprawy wyświetlania tabeli
  const tableStyles = {
    container: {
      overflowX: 'auto',
      maxWidth: '100%',
      border: '1px solid #ddd',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      tableLayout: 'fixed'
    },
    headerCell: {
      padding: '10px',
      backgroundColor: '#e74c3c', // Jasny czerwony kolor nagłówka
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      borderBottom: '2px solid #c0392b'
    },
    cell: {
      padding: '8px',
      border: '1px solid #ddd',
      backgroundColor: 'white'
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white'
    }
  };

  // Funkcja do aktualizacji danych strefy
  const updateZoneData = (index, field, value) => {
    const updatedZones = [...zones];
    updatedZones[index] = {
      ...updatedZones[index],
      [field]: value
    };
    onChange(updatedZones);
  };

  return (
    <div style={tableStyles.container}>
      <table style={tableStyles.table}>
        <thead>
          <tr>
            <th style={{ ...tableStyles.headerCell, width: '80px' }}>Strefa</th>
            <th style={{ ...tableStyles.headerCell, width: '200px' }}>Produkt</th>
            <th style={{ ...tableStyles.headerCell, width: '100px' }}>Stężenie (%)</th>
            <th style={{ ...tableStyles.headerCell, width: '120px' }}>Przewodność (μS/cm)</th>
            <th style={{ ...tableStyles.headerCell, width: '120px' }}>Temperatura (°C)</th>
            <th style={{ ...tableStyles.headerCell, width: '80px' }}>pH</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((zone, index) => (
            <tr key={index}>
              <td style={tableStyles.cell}>Strefa {index + 1}</td>
              <td style={tableStyles.cell}>
                <select
                  style={tableStyles.select}
                  value={zone.product || ''}
                  onChange={(e) => updateZoneData(index, 'product', e.target.value)}
                >
                  <option value="">Wybierz produkt</option>
                  <option value="woda_sieciowa">Woda sieciowa</option>
                  <option value="woda_demi">Woda DEMI</option>
                  <option value="płukanie wodą sieciową">Płukanie wodą sieciową</option>
                  <option value="płukanie wodą demineralizowaną">Płukanie wodą demineralizowaną</option>
                  {products.map(product => (
                    <option key={product.id} value={product.name}>{product.name}</option>
                  ))}
                </select>
              </td>
              <td style={tableStyles.cell}>
                <input
                  type="number"
                  style={tableStyles.input}
                  value={zone.concentration || ''}
                  onChange={(e) => updateZoneData(index, 'concentration', e.target.value)}
                  placeholder="0.0"
                  step="0.1"
                />
              </td>
              <td style={tableStyles.cell}>
                <input
                  type="number"
                  style={tableStyles.input}
                  value={zone.conductivity || ''}
                  onChange={(e) => updateZoneData(index, 'conductivity', e.target.value)}
                  placeholder="0"
                />
              </td>
              <td style={tableStyles.cell}>
                <input
                  type="number"
                  style={tableStyles.input}
                  value={zone.temperature || ''}
                  onChange={(e) => updateZoneData(index, 'temperature', e.target.value)}
                  placeholder="0"
                  step="0.1"
                />
              </td>
              <td style={tableStyles.cell}>
                <input
                  type="number"
                  style={tableStyles.input}
                  value={zone.ph || ''}
                  onChange={(e) => updateZoneData(index, 'ph', e.target.value)}
                  placeholder="0.0"
                  step="0.01"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

// Ekran logowania
function LoginScreen() {
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

// Panel handlowca z rozszerzonymi funkcjami
function SalesRepPanel({ currentUser, products }) {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [reports, setReports] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newReport, setNewReport] = useState({
    date: new Date().toISOString().split('T')[0],
    processName: '',
    summary: '',
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
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    address: '',
    postalCode: '',
    city: '',
    email: '',
    website: '',
    phone: ''
  });
  const [editClientData, setEditClientData] = useState(null);
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

  // Dodaj nowego klienta z pełnymi danymi
  const addClient = async () => {
    if (newClientData.name.trim() === '') return;
    
    try {
      await addDoc(collection(db, "clients"), {
        ...newClientData,
        salesRepId: currentUser.id,
        createdAt: new Date().toISOString()
      });
      
      fetchClients();
      setNewClientData({
        name: '',
        address: '',
        postalCode: '',
        city: '',
        email: '',
        website: '',
        phone: ''
      });
      setShowAddClientModal(false);
    } catch (error) {
      console.error("Błąd podczas dodawania klienta:", error);
    }
  };
  
  // Edytuj dane klienta
  const editClient = async () => {
    if (!editClientData || editClientData.name.trim() === '') return;
    
    try {
      const clientRef = doc(db, "clients", editClientData.id);
      await updateDoc(clientRef, {
        name: editClientData.name,
        address: editClientData.address,
        postalCode: editClientData.postalCode,
        city: editClientData.city,
        email: editClientData.email,
        website: editClientData.website,
        phone: editClientData.phone,
        updatedAt: new Date().toISOString()
      });
      
      // Odśwież dane klienta
      fetchClients();
      if (selectedClient && selectedClient.id === editClientData.id) {
        setSelectedClient({
          ...selectedClient,
          ...editClientData
        });
      }
      
      setShowEditClientModal(false);
      setEditClientData(null);
    } catch (error) {
      console.error("Błąd podczas edycji klienta:", error);
    }
  };
  
  // Usuń klienta
  const deleteClient = async (clientId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego klienta? Ta operacja jest nieodwracalna.")) {
      return;
    }
    
    try {
      // Usuń klienta
      await deleteDoc(doc(db, "clients", clientId));
      
      // Odśwież listę klientów
      fetchClients();
      
      // Jeśli usunięty klient był wybrany, zresetuj wybór
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(null);
        setReports([]);
        setNotes([]);
      }
    } catch (error) {
      console.error("Błąd podczas usuwania klienta:", error);
      alert("Wystąpił błąd podczas usuwania klienta");
    }
  };
  
  // Dodaj nowy raport z podsumowaniem
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
        processName: newReport.processName,
        summary: newReport.summary,
        zones: filledZones,
        createdAt: new Date().toISOString()
      });
      
      fetchReports(selectedClient.id);
      
      // Resetuj formularz
      setNewReport({
        date: new Date().toISOString().split('T')[0],
        processName: '',
        summary: '',
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
  
  // Aktualizacja danych stref
  const updateZones = (updatedZones) => {
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
                  {client.city && <p className="client-city">{client.city}</p>}
                  <p className="client-date">
                    Dodano: {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'brak daty'}
                  </p>
                  <div className="client-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditClientData(client);
                        setShowEditClientModal(true);
                      }}
                    >
                      Edytuj
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteClient(client.id);
                      }}
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="reports-section">
          {selectedClient ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="reports-header text-xl font-bold">
                    {selectedClient.name}
                  </h3>
                  {selectedClient.address && (
                    <p className="text-gray-600">{selectedClient.address}</p>
                  )}
                  {selectedClient.postalCode && selectedClient.city && (
                    <p className="text-gray-600">{selectedClient.postalCode} {selectedClient.city}</p>
                  )}
                  {selectedClient.email && (
                    <p className="text-gray-600">Email: {selectedClient.email}</p>
                  )}
                  {selectedClient.phone && (
                    <p className="text-gray-600">Tel: {selectedClient.phone}</p>
                  )}
                </div>
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
                    
                    <div className="form-row mb-4">
                      <label className="block mb-1">Nazwa procesu (opcjonalnie)</label>
                      <input
                        type="text"
                        className="input-field"
                        value={newReport.processName}
                        onChange={(e) => setNewReport({...newReport, processName: e.target.value})}
                        placeholder="np. Proces przygotowania stali czarnej"
                      />
                    </div>
                    
                    <div className="form-row mb-4">
                      <label className="block mb-1">Parametry pracy kąpieli w poszczególnych strefach:</label>
                      <EnhancedZonesTable 
                        zones={newReport.zones}
                        onChange={updateZones}
                        products={products}
                      />
                    </div>
                    
                    <div className="form-row mb-4">
                      <label className="block mb-1">Podsumowanie raportu (opcjonalnie)</label>
                      <textarea
                        className="input-field w-full"
                        rows="4"
                        value={newReport.summary}
                        onChange={(e) => setNewReport({...newReport, summary: e.target.value})}
                        placeholder="Wprowadź podsumowanie, np. uwagi dotyczące stanu kąpieli, zalecenia..."
                      ></textarea>
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
                              
                              {/* Przyciski do generowania PDF */}
                              <div className="flex space-x-2">
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={async () => {
                                    // Generowanie raportu na papierze firmowym z sekwencyjną numeracją 
                                    const doc = await generateCompanyReportPDF(selectedClient, report, {
                                      username: currentUser.username
                                    });
                                    doc.save(`raport_${selectedClient.name.replace(/\s+/g, '_')}_${new Date(report.date).toISOString().split('T')[0]}.pdf`);
                                  }}
                                >
                                  Generuj raport firmowy
                                </button>
                              </div>
                            </div>
                            
                            {report.processName && (
                              <p className="mb-2"><strong>Proces:</strong> {report.processName}</p>
                            )}
                            
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
                            
                            {report.summary && (
                              <div className="mt-3">
                                <strong>Podsumowanie:</strong>
                                <p className="mt-1">{report.summary}</p>
                              </div>
                            )}
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
      
      {/* Modal dodawania klienta z rozszerzonymi polami */}
      {showAddClientModal && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="modal-title text-xl font-bold mb-4">Dodaj nowego klienta</h3>
            <div className="modal-form mb-4">
              <div className="mb-3">
                <label className="block mb-1">Nazwa klienta</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={newClientData.name}
                  onChange={(e) => setNewClientData({...newClientData, name: e.target.value})}
                  placeholder="Podaj nazwę klienta"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1">Adres</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={newClientData.address}
                  onChange={(e) => setNewClientData({...newClientData, address: e.target.value})}
                  placeholder="Podaj adres"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block mb-1">Kod pocztowy</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={newClientData.postalCode}
                    onChange={(e) => setNewClientData({...newClientData, postalCode: e.target.value})}
                    placeholder="Kod pocztowy"
                  />
                </div>
                <div>
                  <label className="block mb-1">Miejscowość</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={newClientData.city}
                    onChange={(e) => setNewClientData({...newClientData, city: e.target.value})}
                    placeholder="Miejscowość"
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  className="input-field w-full"
                  value={newClientData.email}
                  onChange={(e) => setNewClientData({...newClientData, email: e.target.value})}
                  placeholder="Adres email"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1">Strona WWW</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={newClientData.website}
                  onChange={(e) => setNewClientData({...newClientData, website: e.target.value})}
                  placeholder="Strona www"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1">Telefon</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={newClientData.phone}
                  onChange={(e) => setNewClientData({...newClientData, phone: e.target.value})}
                  placeholder="Numer telefonu"
                />
              </div>
            </div>
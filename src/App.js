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
// Importuj bibliotekę html2pdf.js
import html2pdf from 'html2pdf.js';

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

// Funkcja do formatowania polskiej daty
const formatDateInPolish = (date) => {
  if (!date) return '';
  
  const months = [
    'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'
  ];
  
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

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

// Funkcja do obliczania numeru raportu - zmodyfikowana, aby była globalna
async function calculateReportNumber() {
  const currentYear = new Date().getFullYear();
  
  // Pobierz wszystkie raporty z bieżącego roku, niezależnie od klienta
  const startOfYear = new Date(`${currentYear}-01-01T00:00:00`);
  const endOfYear = new Date(`${currentYear}-12-31T23:59:59`);
  
  try {
    const q = query(
      collection(db, "reports"), 
      where("date", ">=", startOfYear.toISOString()),
      where("date", "<=", endOfYear.toISOString()),
      orderBy("date", "desc")
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

// Generowanie raportu PDF dla całego klienta z użyciem html2pdf
async function generateClientReport(client, reports, notes) {
  if (!client) return null;
  
  // Przygotuj dane dla raportu
  const currentDate = new Date().toLocaleDateString('pl-PL');
  
  // Tworzenie HTML
  let html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1, h2, h3 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background-color: #4682B4; color: white; padding: 8px; }
          td { border: 1px solid #ddd; padding: 8px; }
          .note { margin: 15px 0; padding: 10px; background-color: #f9f9f9; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Raport dla klienta: ${client.name}</h1>
        <p>Data wygenerowania: ${currentDate}</p>
        
        <h2>Historia raportów</h2>
  `;
  
  if (!reports || reports.length === 0) {
    html += '<p>Brak historii raportów</p>';
  } else {
    reports.forEach(report => {
      html += `
        <div class="report">
          <h3>Raport z dnia ${formatDate(report.date)}</h3>
      `;
      
      if (report.zones && report.zones.length > 0) {
        html += `
          <table>
            <thead>
              <tr>
                <th>Strefa</th>
                <th>Produkt</th>
                <th>Stężenie (%)</th>
                <th>Przewodność</th>
                <th>Temperatura (°C)</th>
                <th>pH</th>
              </tr>
            </thead>
            <tbody>
        `;
        
        report.zones.forEach((zone, idx) => {
          html += `
            <tr>
              <td>Strefa ${idx + 1}</td>
              <td>${zone.product || '-'}</td>
              <td>${zone.concentration || '-'}</td>
              <td>${zone.conductivity || '-'}</td>
              <td>${zone.temperature || '-'}</td>
              <td>${zone.ph || '-'}</td>
            </tr>
          `;
        });
        
        html += `
            </tbody>
          </table>
        `;
      }
      
      if (report.summary) {
        html += `
          <div class="summary">
            <h4>Podsumowanie:</h4>
            <p>${report.summary.replace(/\n/g, '<br>')}</p>
          </div>
        `;
      }
      
      html += '</div>';
    });
  }
  
  html += '<h2>Notatki</h2>';
  
  if (!notes || notes.length === 0) {
    html += '<p>Brak notatek</p>';
  } else {
    notes.forEach(note => {
      const createdDate = note.createdAt ? new Date(note.createdAt).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : '';
      
      const updatedDate = note.updatedAt ? new Date(note.updatedAt).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : '';
      
      html += `
        <div class="note">
          <p><strong>Data:</strong> ${createdDate}</p>
          ${note.updatedAt ? `<p><strong>Edytowano:</strong> ${updatedDate}</p>` : ''}
          <p>${note.content.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    });
  }
  
  html += `
        <div class="footer">
          Haug Chemie®Polska HelpDesk
        </div>
      </body>
    </html>
  `;
  
  // Konwersja HTML do PDF z użyciem html2pdf
  const element = document.createElement('div');
  element.innerHTML = html;
  document.body.appendChild(element);
  
  try {
    const opt = {
      margin: 10,
      filename: `raport_${client.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    await html2pdf().from(element).set(opt).save();
    document.body.removeChild(element);
    return true;
  } catch (error) {
    console.error("Błąd podczas generowania PDF:", error);
    document.body.removeChild(element);
    return null;
  }
}

// Generowanie pojedynczego raportu PDF
async function generateSingleReportPDF(client, report) {
  if (!client || !report) return null;
  
  // Tworzenie HTML
  let html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1, h2, h3 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background-color: #4682B4; color: white; padding: 8px; }
          td { border: 1px solid #ddd; padding: 8px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Raport dla: ${client.name}</h1>
        <p><strong>Data raportu:</strong> ${new Date(report.date).toLocaleDateString('pl-PL')}</p>
        <p><strong>Data wygenerowania:</strong> ${new Date().toLocaleDateString('pl-PL')}</p>
  `;
  
  if (report.zones && report.zones.length > 0) {
    html += `
      <table>
        <thead>
          <tr>
            <th>Strefa</th>
            <th>Produkt</th>
            <th>Stężenie (%)</th>
            <th>Przewodność</th>
            <th>Temperatura (°C)</th>
            <th>pH</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    report.zones.forEach((zone, idx) => {
      html += `
        <tr>
          <td>Strefa ${idx + 1}</td>
          <td>${zone.product || '-'}</td>
          <td>${zone.concentration || '-'}</td>
          <td>${zone.conductivity || '-'}</td>
          <td>${zone.temperature || '-'}</td>
          <td>${zone.ph || '-'}</td>
        </tr>
      `;
    });
    
    html += `
        </tbody>
      </table>
    `;
  }
  
  if (report.summary) {
    html += `
      <div class="summary">
        <h3>Podsumowanie:</h3>
        <p>${report.summary.replace(/\n/g, '<br>')}</p>
      </div>
    `;
  }
  
  html += `
        <div class="footer">
          Haug Chemie®Polska HelpDesk - Raport z dnia ${new Date(report.date).toLocaleDateString('pl-PL')}
        </div>
      </body>
    </html>
  `;
  
  // Konwersja HTML do PDF
  const element = document.createElement('div');
  element.innerHTML = html;
  document.body.appendChild(element);
  
  try {
    const opt = {
      margin: 10,
      filename: `raport_${client.name.replace(/\s+/g, '_')}_${new Date(report.date).toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    await html2pdf().from(element).set(opt).save();
    document.body.removeChild(element);
    return true;
  } catch (error) {
    console.error("Błąd podczas generowania PDF:", error);
    document.body.removeChild(element);
    return null;
  }
}

// Zmodyfikowana funkcja generowania raportu PDF na papierze firmowym
async function generateCompanyReportPDF(client, report, companyData = {}) {
  if (!client || !report) return null;
  
  try {
    // Oblicz numer raportu (zmodyfikowane - globalny numer)
    const reportNumber = await calculateReportNumber();
    // Format: XX/ANL/YYYY (zgodnie z przykładem 23/ANL/2025)
    const formattedReportNumber = `${reportNumber}/ANL/${new Date().getFullYear()}`;
    
    // Format daty raportu
    const reportDate = new Date(report.date);
    const formattedReportDate = formatDateInPolish(reportDate);
    
    // Format aktualnej daty
    const currentDate = new Date();
    const formattedCurrentDate = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
    
    // Użyj niestandardowego celu badań jeśli jest dostępny
    const researchGoal = report.researchGoal || "Kontrola parametrów procesów.";
    
    return new Promise((resolve, reject) => {
      const letterheadImg = new Image();
      letterheadImg.src = "/papier-firmowy-1.png";
      
      letterheadImg.onload = async () => {
        // Przygotuj HTML dokumentu
        const reportHtml = `
          <html>
            <head>
              <meta charset="UTF-8">
              <style>
                @font-face {
                  font-family: 'Roboto';
                  font-style: normal;
                  font-weight: 400;
                  src: url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
                }
                body {
                  font-family: 'Roboto', Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  position: relative;
                  font-size: 10pt; /* Zmniejszono rozmiar czcionki z 11pt */
                }
                .page-container {
                  position: relative;
                  page-break-after: always;
                }
                .page-container:last-child {
                  page-break-after: auto;
                }
                .letterhead {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 297mm; /* Pełna wysokość strony A4 */
                  z-index: -1;
                }
                .content {
                  padding-top: 35mm; /* Zmniejszono margines z góry */
                  padding-left: 20mm;
                  padding-right: 20mm;
                  padding-bottom: 40mm; /* Zwiększono margines z dołu, aby zmieścić stopkę */
                  z-index: 1;
                }
                .header {
                  margin-bottom: 8mm; /* Zmniejszono odstęp */
                }
                .client-data {
                  margin-bottom: 4mm; /* Zmniejszono odstęp */
                }
                .date {
                  text-align: right;
                  margin-bottom: 8mm; /* Zmniejszono odstęp */
                }
                .report-title-box {
                  border: 1px solid black;
                  padding: 2mm; /* Zmniejszono padding */
                  text-align: center;
                  margin-bottom: 4mm; /* Zmniejszono odstęp */
                }
                .report-date {
                  text-align: center;
                  margin-bottom: 8mm; /* Zmniejszono odstęp */
                }
                .section {
                  margin-bottom: 3mm; /* Zmniejszono odstęp */
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 6mm; /* Zmniejszono odstęp */
                  font-size: 9pt; /* Mniejsza czcionka w tabeli */
                }
                th {
                  background-color: #e74c3c;
                  color: white;
                  font-weight: normal;
                  text-align: center;
                  padding: 1.5mm; /* Zmniejszono padding */
                  border: 1px solid #ccc;
                }
                td {
                  padding: 1.5mm; /* Zmniejszono padding */
                  border: 1px solid #ccc;
                  text-align: center;
                }
                .result-item {
                  margin-left: 5mm;
                  margin-bottom: 1mm; /* Zmniejszono odstęp */
                }
                .signature {
                  margin-top: 10mm; /* Jeszcze bardziej zmniejszono margines */
                }
                .page-number {
                  position: absolute;
                  bottom: 10mm;
                  right: 20mm;
                  font-size: 8pt;
                }
                .page-footer {
                  position: absolute;
                  bottom: 25mm; /* Zwiększono odległość od dołu strony */
                  left: 0;
                  width: 100%;
                  text-align: center;
                  font-size: 8pt;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="page-container">
                <div class="letterhead">
                  <!-- Tło papieru firmowego jako obraz -->
                  <img src="/papier-firmowy-1.png" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: -1;">
                </div>
                
                <div class="content">
                  <!-- Data w prawym górnym rogu -->
                  <div class="date">Pułtusk, ${formattedCurrentDate}</div>
                  
                  <!-- Dane klienta -->
                  <div class="client-data">
                    ${client.name}<br>
                    ${client.address || ''}<br>
                    ${client.postalCode || ''} ${client.city || ''}
                  </div>
                  
                  <!-- Tytuł raportu w ramce -->
                  <div class="report-title-box">
                    Protokół z analizy kąpieli na linii technologicznej nr ${formattedReportNumber}
                  </div>
                  
                  <!-- Data raportu -->
                  <div class="report-date">
                    ${formattedReportDate} roku
                  </div>
                  
                  <!-- Sekcje raportu -->
                  <div class="section">
                    1. Wykonawcy: ${companyData.username || ""}
                  </div>
                  
                  <div class="section">
                    2. Cel badań: ${researchGoal}
                  </div>
                  
                  <div class="section">
                    3. Parametry pracy kąpieli w poszczególnych strefach:
                  </div>
                  
                  <!-- Nazwa procesu -->
                  <div class="section">
                    ${report.processName || 'Proces przygotowania powierzchni'}:
                  </div>
                  
                  <!-- Tabela parametrów -->
                  <table>
                    <thead>
                      <tr>
                        <th>Strefa</th>
                        <th>Stęż. preparatu</th>
                        <th>Odczyn pH</th>
                        <th>Przewodność</th>
                        <th>Temperatura</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${report.zones.map((zone, idx) => `
                        <tr>
                          <td>${idx + 1}. ${zone.product || '-'}</td>
                          <td>${zone.concentration ? `${zone.concentration}%` : 'x'}</td>
                          <td>${zone.ph || 'x'}</td>
                          <td>${zone.conductivity ? `${zone.conductivity} µS/cm` : 'x'}</td>
                          <td>${zone.temperature ? `${zone.temperature}°C` : 'x'}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                  
                  <!-- Rezultaty -->
                  <div class="section">
                    4. Rezultaty:
                  </div>
                  
                  <div class="results-container">
                    ${report.summary ? 
                      report.summary.split('\n').map(line => 
                        line.trim() ? `<div class="result-item">• ${line.trim()}</div>` : ''
                      ).join('') : 
                      '<div class="result-item">• Brak uwag co do utrzymywania parametrów roztworów kąpieli.</div>'
                    }
                  </div>
                  
                  <!-- Podpis -->
                  <div class="signature">
                    Z poważaniem,<br>
                    ${companyData.username || ""}<br>
                    Doradca Techniczno-Handlowy
                  </div>
                  
                  <!-- Stopka na każdej stronie -->
                  <div class="page-footer">
                    Haug Chemie®Polska HelpDesk
                  </div>
                  
                  <div class="page-number">Strona 1</div>
                </div>
              </div>
            </body>
          </html>
        `;
        
        // Konwersja HTML do PDF
        const element = document.createElement('div');
        element.innerHTML = reportHtml;
        document.body.appendChild(element);
        
        try {
          const opt = {
            margin: 0,
            filename: `raport_${client.name.replace(/\s+/g, '_')}_${reportDate.toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
              scale: 2, 
              useCORS: true,
              windowWidth: 1024,
              height: 1123, // Zdefiniowana wysokość dokumentu (297mm w pikselach przy 96 dpi * scale 2)
              logging: true, // Włączone logowanie dla łatwiejszego debugowania
              letterRendering: true // Lepsza jakość renderowania tekstu
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait',
              compress: true,
              precision: 16 // Zwiększona precyzja
            }
          };
          
          await html2pdf().from(element).set(opt).save();
          document.body.removeChild(element);
          resolve(true);
        } catch (error) {
          console.error("Błąd podczas generowania PDF:", error);
          document.body.removeChild(element);
          reject(error);
        }
      };
      
      letterheadImg.onerror = (error) => {
        console.error("Błąd ładowania obrazu:", error);
        reject(error);
      };
    });
  } catch (error) {
    console.error("Błąd podczas przygotowywania raportu:", error);
    return null;
  }
}

// Dodatkowa funkcja do obsługi wielostronicowych raportów
async function generateMultiPageReportPDF(client, report, companyData = {}) {
  if (!client || !report) return null;
  
  try {
    // Oblicz numer raportu (zmodyfikowane - globalny numer)
    const reportNumber = await calculateReportNumber();
    const formattedReportNumber = `${reportNumber}/ANL/${new Date().getFullYear()}`;
    
    // Dane formatowania
    const reportDate = new Date(report.date);
    const formattedReportDate = formatDateInPolish(reportDate);
    const currentDate = new Date();
    const formattedCurrentDate = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
    
    // Użyj niestandardowego celu badań jeśli jest dostępny
    const researchGoal = report.researchGoal || "Kontrola parametrów procesów.";
    
    // Przygotuj styl i nagłówek dokumentu
    const headerHtml = `
      <div style="padding: 10mm 20mm 0 20mm;">
        <div style="text-align: right; margin-bottom: 5mm;">Pułtusk, ${formattedCurrentDate}</div>
        <div style="margin-bottom: 5mm;">
          ${client.name}<br>
          ${client.address || ''}<br>
          ${client.postalCode || ''} ${client.city || ''}
        </div>
        <div style="border: 1px solid black; padding: 2mm; text-align: center; margin-bottom: 5mm;">
          Protokół z analizy kąpieli na linii technologicznej nr ${formattedReportNumber}
        </div>
        <div style="text-align: center; margin-bottom: 8mm;">${formattedReportDate} roku</div>
      </div>
    `;
    
    // Przygotuj sekcje raportu
    const contentHtml = `
      <div style="padding: 0 20mm;">
        <div style="margin-bottom: 3mm;">1. Wykonawcy: ${companyData.username || ""}</div>
        <div style="margin-bottom: 3mm;">2. Cel badań: ${researchGoal}</div>
        <div style="margin-bottom: 3mm;">3. Parametry pracy kąpieli w poszczególnych strefach:</div>
        <div style="margin-bottom: 3mm;">${report.processName || 'Proces przygotowania powierzchni'}:</div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 6mm; font-size: 9pt;">
          <thead>
            <tr>
              <th style="background-color: #e74c3c; color: white; text-align: center; padding: 1.5mm; border: 1px solid #ccc;">Strefa</th>
              <th style="background-color: #e74c3c; color: white; text-align: center; padding: 1.5mm; border: 1px solid #ccc;">Stęż. preparatu</th>
              <th style="background-color: #e74c3c; color: white; text-align: center; padding: 1.5mm; border: 1px solid #ccc;">Odczyn pH</th>
              <th style="background-color: #e74c3c; color: white; text-align: center; padding: 1.5mm; border: 1px solid #ccc;">Przewodność</th>
              <th style="background-color: #e74c3c; color: white; text-align: center; padding: 1.5mm; border: 1px solid #ccc;">Temperatura</th>
            </tr>
          </thead>
          <tbody>
            ${report.zones.map((zone, idx) => `
              <tr>
                <td style="padding: 1.5mm; border: 1px solid #ccc; text-align: center;">${idx + 1}. ${zone.product || '-'}</td>
                <td style="padding: 1.5mm; border: 1px solid #ccc; text-align: center;">${zone.concentration ? `${zone.concentration}%` : 'x'}</td>
                <td style="padding: 1.5mm; border: 1px solid #ccc; text-align: center;">${zone.ph || 'x'}</td>
                <td style="padding: 1.5mm; border: 1px solid #ccc; text-align: center;">${zone.conductivity ? `${zone.conductivity} µS/cm` : 'x'}</td>
                <td style="padding: 1.5mm; border: 1px solid #ccc; text-align: center;">${zone.temperature ? `${zone.temperature}°C` : 'x'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-bottom: 3mm;">4. Rezultaty:</div>
        
        ${report.summary ? 
          report.summary.split('\n').map(line => 
            line.trim() ? `<div style="margin-left: 5mm; margin-bottom: 1mm;">• ${line.trim()}</div>` : ''
          ).join('') : 
          '<div style="margin-left: 5mm; margin-bottom: 1mm;">• Brak uwag co do utrzymywania parametrów roztworów kąpieli.</div>'
        }
        
        <div style="margin-top: 15mm;">
          Z poważaniem,<br>
          ${companyData.username || ""}<br>
          Doradca Techniczno-Handlowy
        </div>
      </div>
    `;
    
    // Przygotuj pełny HTML raportu z obsługą wielu stron
    const reportHtml = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @font-face {
              font-family: 'Roboto';
              font-style: normal;
              font-weight: 400;
              src: url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
            }
            body {
              font-family: 'Roboto', Arial, sans-serif;
              margin: 0;
              padding: 0;
              font-size: 9.5pt;
              position: relative;
            }
            .page {
              position: relative;
              width: 210mm;
              height: 297mm;
              page-break-after: always;
              overflow: hidden;
            }
            .page:last-of-type {
              page-break-after: auto;
            }
            .letterhead {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: -1;
            }
            .footer {
              position: absolute;
              bottom: 10mm;
              left: 0;
              width: 100%;
              text-align: center;
              font-size: 8pt;
              color: #666;
            }
            .page-number {
              position: absolute;
              bottom: 10mm;
              right: 20mm;
              font-size: 8pt;
            }
            @page {
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="letterhead">
              <img src="/papier-firmowy-1.png" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: -1;">
            </div>
            ${headerHtml}
            ${contentHtml}
            <div class="footer">Haug Chemie®Polska HelpDesk</div>
            <div class="page-number">Strona 1</div>
          </div>
        </body>
      </html>
    `;
    
    // Konwersja HTML do PDF z obsługą wielu stron
    const element = document.createElement('div');
    element.innerHTML = reportHtml;
    document.body.appendChild(element);
    
    try {
      const opt = {
        margin: 0,
        filename: `raport_${client.name.replace(/\s+/g, '_')}_${reportDate.toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          windowWidth: 1024
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break',
          after: '.page'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        // Ustawia funkcję wywołania zwrotnego HTML2PDF dla dodawania nagłówka i stopki do każdej strony
        html2canvas: {
          onclone: function(doc) {
            // Tutaj można zmodyfikować klonowany dokument przed renderowaniem
            const pages = doc.querySelectorAll('.page');
            pages.forEach((page, index) => {
              // Aktualizacja numeru strony
              const pageNumber = page.querySelector('.page-number');
              if (pageNumber) {
                pageNumber.textContent = `Strona ${index + 1}`;
              }
              
              // Dodaj nowy papier firmowy do stron po pierwszej stronie
              if (index > 0) {
                const letterhead = doc.createElement('div');
                letterhead.className = 'letterhead';
                letterhead.innerHTML = `<img src="/papier-firmowy-1.png" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: -1;">`;
                page.insertBefore(letterhead, page.firstChild);
              }
            });
          }
        }
      };
      
      await html2pdf().from(element).set(opt).save();
      document.body.removeChild(element);
      return true;
    } catch (error) {
      console.error("Błąd podczas generowania PDF:", error);
      document.body.removeChild(element);
      return null;
    }
  } catch (error) {
    console.error("Błąd podczas przygotowywania raportu:", error);
    return null;
  }
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
          <img src="https://i.ibb.co/fYhLC13/Projekt-bez-nazwy-16.png" alt="Logo" className="login-logo" />
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
    researchGoal: 'Kontrola parametrów procesów.',  // Dodany domyślny cel badań
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
  
  // Pobierz klientów z Firebase - używając useCallback
  const fetchClients = useCallback(async () => {
    try {
      const q = query(collection(db, "clients"), where("salesRepId", "==", currentUser?.id));
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
  }, [currentUser?.id]);
          
  // Pobierz raporty dla wybranego klienta
  const fetchReports = useCallback(async (clientId) => {
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
  }, []);

  // Pobierz notatki dla wybranego klienta
  const fetchNotes = useCallback(async (clientId) => {
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
  }, []);
  
  // Efekt przy pierwszym ładowaniu
  useEffect(() => {
    if (currentUser) {
      fetchClients();
    }
  }, [currentUser, fetchClients]);
  
  // Efekt przy zmianie wybranego klienta
  useEffect(() => {
    if (selectedClient) {
      fetchReports(selectedClient.id);
      fetchNotes(selectedClient.id);
    }
  }, [selectedClient, fetchReports, fetchNotes]);
  
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
        researchGoal: newReport.researchGoal,
        summary: newReport.summary,
        zones: filledZones,
        createdAt: new Date().toISOString()
      });
      
      fetchReports(selectedClient.id);
      
      // Resetuj formularz
      setNewReport({
        date: new Date().toISOString().split('T')[0],
        processName: '',
        researchGoal: 'Kontrola parametrów procesów.',
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
  
  // Usuń raport
  const deleteReport = async (reportId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten raport? Ta operacja jest nieodwracalna.")) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, "reports", reportId));
      
      // Odśwież listę raportów
      if (selectedClient) {
        fetchReports(selectedClient.id);
      }
    } catch (error) {
      console.error("Błąd podczas usuwania raportu:", error);
      alert("Wystąpił błąd podczas usuwania raportu");
    }
  };
  
  // Aktualizacja danych stref
  const updateZones = (updatedZones) => {
    setNewReport({
      ...newReport,
      zones: updatedZones
    });
  };

  // Generowanie raportów PDF
  const generatePDF = async () => {
    if (!selectedClient) return;
    await generateClientReport(selectedClient, reports, notes);
  };
  
  // Generuj raport PDF na firmowym papierze
  const generateCompanyPDF = async (report) => {
    if (!selectedClient || !report) return;
    await generateCompanyReportPDF(selectedClient, report, {
      username: currentUser.username
    });
  };
  
  // Generuj standardowy raport PDF
  const generateSinglePDF = async (report) => {
    if (!selectedClient || !report) return;
    await generateSingleReportPDF(selectedClient, report);
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
                      <label className="block mb-1">Cel badań</label>
                      <input
                        type="text"
                        className="input-field"
                        value={newReport.researchGoal}
                        onChange={(e) => setNewReport({...newReport, researchGoal: e.target.value})}
                        placeholder="Cel badań"
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
                              
                              {/* Przyciski do generowania PDF i usuwania raportu */}
                              <div className="flex space-x-2">
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => generateSinglePDF(report)}
                                >
                                  Generuj PDF
                                </button>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => generateCompanyPDF(report)}
                                >
                                  Generuj raport firmowy
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => deleteReport(report.id)}
                                >
                                  Usuń
                                </button>
                              </div>
                            </div>
                            
                            {report.processName && (
                              <p className="mb-2"><strong>Proces:</strong> {report.processName}</p>
                            )}
                            
                            {report.researchGoal && (
                              <p className="mb-2"><strong>Cel badań:</strong> {report.researchGoal}</p>
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
      
      {/* Modal edycji klienta */}
      {showEditClientModal && editClientData && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="modal-title text-xl font-bold mb-4">Edytuj klienta</h3>
            <div className="modal-form mb-4">
              <div className="mb-3">
                <label className="block mb-1">Nazwa klienta</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={editClientData.name}
                  onChange={(e) => setEditClientData({...editClientData, name: e.target.value})}
                  placeholder="Podaj nazwę klienta"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1">Adres</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={editClientData.address || ''}
                  onChange={(e) => setEditClientData({...editClientData, address: e.target.value})}
                  placeholder="Podaj adres"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block mb-1">Kod pocztowy</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={editClientData.postalCode || ''}
                    onChange={(e) => setEditClientData({...editClientData, postalCode: e.target.value})}
                    placeholder="Kod pocztowy"
                  />
                </div>
                <div>
                  <label className="block mb-1">Miejscowość</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={editClientData.city || ''}
                    onChange={(e) => setEditClientData({...editClientData, city: e.target.value})}
                    placeholder="Miejscowość"
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  className="input-field w-full"
                  value={editClientData.email || ''}
                  onChange={(e) => setEditClientData({...editClientData, email: e.target.value})}
                  placeholder="Adres email"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1">Strona WWW</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={editClientData.website || ''}
                  onChange={(e) => setEditClientData({...editClientData, website: e.target.value})}
                  placeholder="Strona www"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1">Telefon</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={editClientData.phone || ''}
                  onChange={(e) => setEditClientData({...editClientData, phone: e.target.value})}
                  placeholder="Numer telefonu"
                />
              </div>
            </div>
            <div className="modal-actions flex justify-end space-x-2">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditClientModal(false);
                  setEditClientData(null);
                }}
              >
                Anuluj
              </button>
              <button
                className="btn btn-primary"
                onClick={editClient}
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

// Komponent zarządzania raportami dla administratora
function ReportsManagement() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientsMap, setClientsMap] = useState({});
  const [salesRepsMap, setSalesRepsMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  
  // Pobierz wszystkie raporty z systemu
  const fetchAllReports = useCallback(async () => {
    setIsLoading(true);
    try {
      // Pobierz wszystkich klientów, aby uzyskać mapę id->nazwa
      const clientsSnapshot = await getDocs(collection(db, "clients"));
      const clientsData = {};
      clientsSnapshot.docs.forEach(doc => {
        clientsData[doc.id] = doc.data().name;
      });
      setClientsMap(clientsData);
      
      // Pobierz wszystkich handlowców, aby uzyskać mapę id->nazwa
      const salesRepsSnapshot = await getDocs(collection(db, "users"));
      const salesRepsData = {};
      salesRepsSnapshot.docs.forEach(doc => {
        salesRepsData[doc.id] = doc.data().username;
      });
      setSalesRepsMap(salesRepsData);
      
      // Pobierz wszystkie raporty, posortowane od najnowszego
      const q = query(
        collection(db, "reports"),
        orderBy("date", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const reportsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clientName: clientsData[doc.data().clientId] || "Nieznany klient",
        salesRepName: salesRepsData[doc.data().salesRepId] || "Nieznany handlowiec"
      }));
      
      setReports(reportsData);
    } catch (error) {
      console.error("Błąd podczas pobierania raportów:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Efekt przy ładowaniu komponentu
  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);
  
  // Funkcja do filtrowania raportów
  const getFilteredReports = useCallback(() => {
    return reports.filter(report => {
      // Filtrowanie po wyszukiwanym tekście
      const matchesSearch = searchTerm.trim() === '' || 
        report.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.salesRepName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrowanie po zakresie dat
      let matchesDate = true;
      if (dateFilter.startDate) {
        matchesDate = matchesDate && new Date(report.date) >= new Date(dateFilter.startDate);
      }
      if (dateFilter.endDate) {
        matchesDate = matchesDate && new Date(report.date) <= new Date(dateFilter.endDate);
      }
      
      return matchesSearch && matchesDate;
    });
  }, [reports, searchTerm, dateFilter]);
  
  // Pobranie odfiltrowanych i posortowanych raportów
  const filteredReports = getFilteredReports();
  
  // Wyliczenie aktualnej strony raportów (paginacja)
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  
  // Zmiana strony
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Usuń raport
  const deleteReport = async (reportId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten raport? Ta operacja jest nieodwracalna.")) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, "reports", reportId));
      fetchAllReports(); // Odśwież listę raportów
    } catch (error) {
      console.error("Błąd podczas usuwania raportu:", error);
      alert("Wystąpił błąd podczas usuwania raportu");
    }
  };
  
  return (
    <div className="tile">
      <div className="tile-header">
        <h2 className="tile-title">Zarządzanie Raportami</h2>
      </div>
      
      {/* Filtry */}
      <div className="filters-container mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">Wyszukaj</label>
          <input
            type="text"
            className="input-field w-full"
            placeholder="Wyszukaj po nazwie klienta lub handlowca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block mb-1">Data od</label>
          <input
            type="date"
            className="input-field w-full"
            value={dateFilter.startDate}
            onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block mb-1">Data do</label>
          <input
            type="date"
            className="input-field w-full"
            value={dateFilter.endDate}
            onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading-container p-8 text-center">
          <p>Ładowanie raportów...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="no-reports p-8 text-center">
          <p>Brak raportów spełniających kryteria wyszukiwania</p>
        </div>
      ) : (
        <>
          <div className="reports-list overflow-x-auto">
            <table className="data-table w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">Nr raportu</th>
                  <th className="p-3 border">Data</th>
                  <th className="p-3 border">Klient</th>
                  <th className="p-3 border">Handlowiec</th>
                  <th className="p-3 border">Proces</th>
                  <th className="p-3 border">Cel badań</th>
                  <th className="p-3 border">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map((report, index) => {
                  const reportDate = new Date(report.date);
                  const reportYear = reportDate.getFullYear();
                  // Wyliczamy numer raportu (index + 1 w aktualnym roku)
                  const reportNumber = `${index + 1 + (currentPage - 1) * reportsPerPage}/ANL/${reportYear}`;
                  
                  return (
                    <tr key={report.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border text-center font-semibold">{reportNumber}</td>
                      <td className="p-3 border">{new Date(report.date).toLocaleDateString('pl-PL')}</td>
                      <td className="p-3 border">{report.clientName}</td>
                      <td className="p-3 border">{report.salesRepName}</td>
                      <td className="p-3 border">{report.processName || '-'}</td>
                      <td className="p-3 border">{report.researchGoal || 'Kontrola parametrów procesów.'}</td>
                      <td className="p-3 border">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteReport(report.id)}
                          >
                            Usuń
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Paginacja */}
          {totalPages > 1 && (
            <div className="pagination mt-6 flex justify-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button
                  key={pageNumber}
                  className={`pagination-item mx-1 px-3 py-1 border ${
                    currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                  onClick={() => paginate(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          )}
        </>
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
  const fetchUsers = useCallback(async () => {
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
  }, []);
  
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
  }, [fetchUsers]);
  
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
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="modal-title text-xl font-bold mb-4">Dodaj nowego użytkownika</h3>
            <div className="modal-form mb-4">
              <div className="mb-3">
                <label className="block mb-1">Nazwa użytkownika</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  placeholder="Podaj nazwę użytkownika"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  className="input-field w-full"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Podaj adres email"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Hasło</label>
                <input
                  type="password"
                  className="input-field w-full"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Podaj hasło"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Rola</label>
                <select
                  className="input-field w-full"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="salesRep">Handlowiec</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className="modal-actions flex justify-end space-x-2">
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
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="modal-title text-xl font-bold mb-4">Edytuj użytkownika</h3>
            <div className="modal-form mb-4">
              <div className="mb-3">
                <label className="block mb-1">Nazwa użytkownika</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                  placeholder="Podaj nazwę użytkownika"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Email (nie można zmienić)</label>
                <input
                  type="email"
                  className="input-field w-full"
                  value={editingUser.email}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Rola</label>
                <select
                  className="input-field w-full"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="salesRep">Handlowiec</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className="modal-actions flex justify-end space-x-2">
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
      
      <div className="product-form mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Nazwa produktu</label>
            <input
              type="text"
              placeholder="Nazwa produktu"
              className="input-field w-full"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block mb-1">Zużycie g/m²</label>
            <input
              type="number"
              placeholder="Zużycie g/m²"
              className="input-field w-full"
              value={newProduct.consumption || ''}
              onChange={(e) => setNewProduct({...newProduct, consumption: parseFloat(e.target.value)})}
            />
          </div>
          
          <div className="flex items-end">
            <button 
              className="btn btn-primary w-full"
              onClick={addProduct}
              disabled={!newProduct.name || !newProduct.consumption}
            >
              Dodaj produkt
            </button>
          </div>
        </div>
      </div>
      
      {editingProduct && (
        <div className="edit-product-form mb-6 p-4 bg-gray-100 rounded">
          <h4 className="font-bold mb-3">Edytuj produkt</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Nazwa produktu</label>
              <input
                type="text"
                placeholder="Nazwa produktu"
                className="input-field w-full"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block mb-1">Zużycie g/m²</label>
              <input
                type="number"
                placeholder="Zużycie g/m²"
                className="input-field w-full"
                value={editingProduct.consumption || ''}
                onChange={(e) => setEditingProduct({...editingProduct, consumption: parseFloat(e.target.value)})}
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <button 
                className="btn btn-primary flex-1"
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
        </div>
      )}
      
      <div className="table-container overflow-x-auto">
        <table className="data-table w-full">
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
                    className="btn btn-secondary btn-sm mr-2"
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
  const [activeTab, setActiveTab] = useState('reports');
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [editClientData, setEditClientData] = useState(null);
  
  // Pobierz wszystkich klientów
  const fetchAllClients = useCallback(async () => {
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
  }, []);
  
  // Pobierz handlowców
  const fetchSalesReps = useCallback(async () => {
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
  }, []);
  
  // Pobierz raporty dla wybranego klienta
  const fetchClientReports = useCallback(async (clientId) => {
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
  }, []);

  // Pobierz notatki dla wybranego klienta
  const fetchClientNotes = useCallback(async (clientId) => {
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
      
    } catch (error) {
      console.error("Błąd podczas pobierania notatek:", error);
    }
  }, []);
  
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
      fetchAllClients();
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
      fetchAllClients();
      
      // Jeśli usunięty klient był wybrany, zresetuj wybór
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(null);
        setReports([]);
      }
    } catch (error) {
      console.error("Błąd podczas usuwania klienta:", error);
      alert("Wystąpił błąd podczas usuwania klienta");
    }
  };

  // Generuj raport PDF na firmowym papierze dla wybranego raportu
  const generateCompanyPDF = async (report) => {
    if (!selectedClient) return;
    
    const salesRep = salesReps.find(rep => rep.id === report.salesRepId);
    const salesRepName = salesRep ? salesRep.username : "Nieznany";
    
    await generateCompanyReportPDF(selectedClient, report, {
      username: salesRepName
    });
  };
  
  // Generuj standardowy raport PDF dla wybranego raportu
  const generateSinglePDF = async (report) => {
    if (!selectedClient) return;
    await generateSingleReportPDF(selectedClient, report);
  };
  
  // Efekt przy pierwszym ładowaniu
  useEffect(() => {
    fetchAllClients();
    fetchSalesReps();
  }, [fetchAllClients, fetchSalesReps]);
  
  // Efekt przy zmianie wybranego klienta
  useEffect(() => {
    if (selectedClient) {
      fetchClientReports(selectedClient.id);
      fetchClientNotes(selectedClient.id);
    }
  }, [selectedClient, fetchClientReports, fetchClientNotes]);
  
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
  
  // Usuń raport
  const deleteReport = async (reportId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten raport? Ta operacja jest nieodwracalna.")) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, "reports", reportId));
      
      // Odśwież listę raportów
      if (selectedClient) {
        fetchClientReports(selectedClient.id);
      }
    } catch (error) {
      console.error("Błąd podczas usuwania raportu:", error);
      alert("Wystąpił błąd podczas usuwania raportu");
    }
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
        
        <div className="client-details">
          {selectedClient ? (
            <>
              <div className="client-header flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-xl font-bold">{selectedClient.name}</h4>
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
                <div className="client-assign">
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
                            
                            {/* Przyciski do generowania PDF i usuwania raportu */}
                            <div className="flex space-x-2">
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => generateSinglePDF(report)}
                              >
                                Generuj PDF
                              </button>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => generateCompanyPDF(report)}
                              >
                                Generuj raport firmowy
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteReport(report.id)}
                              >
                                Usuń
                              </button>
                            </div>
                          </div>
                          
                          {report.processName && (
                            <p className="mb-2"><strong>Proces:</strong> {report.processName}</p>
                          )}
                          
                          {report.researchGoal && (
                            <p className="mb-2"><strong>Cel badań:</strong> {report.researchGoal}</p>
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
      
      {/* Modal edycji klienta */}
      {showEditClientModal && editClientData && (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="modal-title text-xl font-bold mb-4">Edytuj klienta</h3>
            <div className="modal-form mb-4">
              <div className="mb-3">
                <label className="block mb-1">Nazwa klienta</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={editClientData.name}
                  onChange={(e) => setEditClientData({...editClientData, name: e.target.value})}
                  placeholder="Podaj nazwę klienta"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1">Adres</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={editClientData.address || ''}
                  onChange={(e) => setEditClientData({...editClientData, address: e.target.value})}
                  placeholder="Podaj adres"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block mb-1">Kod pocztowy</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={editClientData.postalCode || ''}
                    onChange={(e) => setEditClientData({...editClientData, postalCode: e.target.value})}
                    placeholder="Kod pocztowy"
                  />
                </div>
                <div>
                  <label className="block mb-1">Miejscowość</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={editClientData.city || ''}
                    onChange={(e) => setEditClientData({...editClientData, city: e.target.value})}
                    placeholder="Miejscowość"
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  className="input-field w-full"
                  value={editClientData.email || ''}
                  onChange={(e) => setEditClientData({...editClientData, email: e.target.value})}
                  placeholder="Adres email"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1">Strona WWW</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={editClientData.website || ''}
                  onChange={(e) => setEditClientData({...editClientData, website: e.target.value})}
                  placeholder="Strona www"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1">Telefon</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={editClientData.phone || ''}
                  onChange={(e) => setEditClientData({...editClientData, phone: e.target.value})}
                  placeholder="Numer telefonu"
                />
              </div>
            </div>
            <div className="modal-actions flex justify-end space-x-2">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditClientModal(false);
                  setEditClientData(null);
                }}
              >
                Anuluj
              </button>
              <button
                className="btn btn-primary"
                onClick={editClient}
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
        <div 
          className={`admin-tab ${activeSection === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveSection('reports')}
        >
          Raporty
        </div>
      </div>
      
      <div className="admin-content">
        {activeSection === 'users' && <UserManagement />}
        {activeSection === 'products' && <ProductManagement fetchProducts={fetchProducts} products={products} />}
        {activeSection === 'clients' && <ClientManagement />}
        {activeSection === 'reports' && <ReportsManagement />}
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
  const fetchProducts = useCallback(async () => {
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
  }, []);

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
  }, [fetchProducts]);

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
          <img src="http://wenecjapultusk.pl/logo.png" alt="Logo" className="logo" />
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

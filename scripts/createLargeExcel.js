import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate large dataset for testing
function generateLargeDataset(count = 20000) {
  const sites = [];
  const utilityTypes = ['electricity', 'gas', 'water'];
  const statuses = ['registered', 'pending', 'objected'];
  const suppliers = ['British Gas', 'EON Energy', 'SSE Energy', 'Centrica', 'Shell Energy', 'Thames Water', 'Octopus Energy', 'E.ON Next', 'Severn Trent', 'EDF Energy'];
  const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Newcastle', 'Glasgow', 'Cardiff', 'Edinburgh', 'Bristol', 'Liverpool'];
  
  for (let i = 1; i <= count; i++) {
    const utilityType = utilityTypes[i % utilityTypes.length];
    const status = statuses[i % statuses.length];
    const supplier = suppliers[i % suppliers.length];
    const city = cities[i % cities.length];
    
    const site = {
      id: `site-${i}`,
      userId: 'user-1',
      siteName: `Site ${i} - ${city} Facility`,
      siteAddress: `${i * 123} Business Street, ${city}, ${getPostcode(city)}`,
      utilityType,
      mpanMprnSpid: generateMpanMprn(utilityType),
      accountId: `ACC${String(i).padStart(6, '0')}`,
      contractStartDate: '2024-01-01',
      contractEndDate: '2025-12-31',
      dayUnitRate: (Math.random() * 10 + 5).toFixed(2),
      nightUnitRate: utilityType === 'electricity' ? (Math.random() * 5 + 3).toFixed(2) : '',
      eveningUnitRate: utilityType === 'electricity' ? (Math.random() * 8 + 6).toFixed(2) : '',
      standingCharges: (Math.random() * 20 + 10).toFixed(2),
      mopCharges: utilityType !== 'water' ? (Math.random() * 30 + 20).toFixed(2) : '',
      dcDaCharges: utilityType !== 'water' ? (Math.random() * 15 + 10).toFixed(2) : '',
      kvaCharges: utilityType === 'electricity' ? (Math.random() * 10 + 5).toFixed(2) : '',
      eac: Math.floor(Math.random() * 500000 + 10000),
      status,
      supplier,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
    
    sites.push(site);
  }
  
  return sites;
}

function generateMpanMprn(utilityType) {
  const prefix = utilityType === 'electricity' ? '2000' : utilityType === 'gas' ? '10' : '30';
  return prefix + Math.floor(Math.random() * 1000000000000000).toString().padStart(16 - prefix.length, '0');
}

function getPostcode(city) {
  const postcodes = {
    'London': 'SW1A 1AA',
    'Manchester': 'M1 2AB',
    'Birmingham': 'B1 3CD',
    'Leeds': 'LS1 4EF',
    'Newcastle': 'NE1 5GH',
    'Glasgow': 'G1 6IJ',
    'Cardiff': 'CF1 7KL',
    'Edinburgh': 'EH1 8MN',
    'Bristol': 'BS1 9OP',
    'Liverpool': 'L1 0QR'
  };
  return postcodes[city] || 'XX1 1XX';
}

// Create workbook and worksheet
const workbook = XLSX.utils.book_new();
const sitesData = generateLargeDataset(20000);
const worksheet = XLSX.utils.json_to_sheet(sitesData);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sites');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write Excel file
const excelPath = path.join(dataDir, 'sites-large.xlsx');
XLSX.writeFile(workbook, excelPath);

console.log(`Large Excel file created successfully at: ${excelPath}`);
console.log(`File contains ${sitesData.length} sites`);
console.log(`File size: ${(fs.statSync(excelPath).size / 1024 / 1024).toFixed(2)} MB`);

import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample sites data
const sitesData = [
  {
    id: 'site-1',
    userId: 'user-1',
    siteName: 'Main Office Building',
    siteAddress: '123 Business Park, London, SW1A 1AA',
    utilityType: 'electricity',
    mpanMprnSpid: '2000012345678901',
    accountId: 'ACC001',
    contractStartDate: '2024-01-01',
    contractEndDate: '2025-12-31',
    dayUnitRate: '15.25',
    nightUnitRate: '8.45',
    eveningUnitRate: '12.80',
    standingCharges: '28.50',
    mopCharges: '45.00',
    dcDaCharges: '25.00',
    kvaCharges: '15.00',
    eac: 125000,
    status: 'registered',
    supplier: 'British Gas',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'site-2',
    userId: 'user-1',
    siteName: 'Warehouse Facility',
    siteAddress: '456 Industrial Estate, Manchester, M1 2AB',
    utilityType: 'electricity',
    mpanMprnSpid: '2000098765432109',
    accountId: 'ACC002',
    contractStartDate: '2024-02-15',
    contractEndDate: '2026-02-14',
    dayUnitRate: '14.80',
    nightUnitRate: '7.95',
    eveningUnitRate: '12.30',
    standingCharges: '26.75',
    mopCharges: '42.50',
    dcDaCharges: '23.75',
    kvaCharges: '18.50',
    eac: 285000,
    status: 'registered',
    supplier: 'EON Energy',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 'site-3',
    userId: 'user-1',
    siteName: 'Retail Store Central',
    siteAddress: '789 High Street, Birmingham, B1 3CD',
    utilityType: 'electricity',
    mpanMprnSpid: '2000156789012345',
    accountId: 'ACC003',
    contractStartDate: '2024-03-01',
    contractEndDate: '2025-02-28',
    dayUnitRate: '16.45',
    nightUnitRate: '9.20',
    eveningUnitRate: '13.60',
    standingCharges: '31.20',
    mopCharges: '48.00',
    dcDaCharges: '28.50',
    kvaCharges: '12.00',
    eac: 95000,
    status: 'pending',
    supplier: 'SSE Energy',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'site-4',
    userId: 'user-1',
    siteName: 'Manufacturing Plant',
    siteAddress: '321 Factory Lane, Leeds, LS1 4EF',
    utilityType: 'gas',
    mpanMprnSpid: '1023456789012345',
    accountId: 'ACC004',
    contractStartDate: '2024-01-15',
    contractEndDate: '2025-01-14',
    dayUnitRate: '4.85',
    standingCharges: '15.60',
    mopCharges: '25.00',
    dcDaCharges: '18.75',
    eac: 450000,
    status: 'registered',
    supplier: 'Centrica',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'site-5',
    userId: 'user-1',
    siteName: 'Branch Office North',
    siteAddress: '654 Business Centre, Newcastle, NE1 5GH',
    utilityType: 'gas',
    mpanMprnSpid: '1098765432109876',
    accountId: 'ACC005',
    contractStartDate: '2024-04-01',
    contractEndDate: '2025-03-31',
    dayUnitRate: '5.25',
    standingCharges: '17.85',
    mopCharges: '28.50',
    dcDaCharges: '21.25',
    eac: 125000,
    status: 'objected',
    supplier: 'Shell Energy',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z'
  },
  {
    id: 'site-6',
    userId: 'user-1',
    siteName: 'Head Office Water',
    siteAddress: '987 Corporate Plaza, Glasgow, G1 6IJ',
    utilityType: 'water',
    mpanMprnSpid: '3012345678901234',
    accountId: 'ACC006',
    contractStartDate: '2024-02-01',
    contractEndDate: '2025-01-31',
    dayUnitRate: '2.45',
    standingCharges: '8.95',
    eac: 25000,
    status: 'registered',
    supplier: 'Thames Water',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'site-7',
    userId: 'user-1',
    siteName: 'Distribution Center',
    siteAddress: '147 Logistics Hub, Cardiff, CF1 7KL',
    utilityType: 'electricity',
    mpanMprnSpid: '2000147258369014',
    accountId: 'ACC007',
    contractStartDate: '2024-05-01',
    contractEndDate: '2025-04-30',
    dayUnitRate: '15.75',
    nightUnitRate: '8.65',
    eveningUnitRate: '13.15',
    standingCharges: '29.80',
    mopCharges: '46.25',
    dcDaCharges: '26.75',
    kvaCharges: '22.00',
    eac: 385000,
    status: 'registered',
    supplier: 'Octopus Energy',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z'
  },
  {
    id: 'site-8',
    userId: 'user-1',
    siteName: 'Research Facility',
    siteAddress: '258 Innovation Park, Edinburgh, EH1 8MN',
    utilityType: 'gas',
    mpanMprnSpid: '1036925814703692',
    accountId: 'ACC008',
    contractStartDate: '2024-03-15',
    contractEndDate: '2025-03-14',
    dayUnitRate: '4.95',
    standingCharges: '16.45',
    mopCharges: '26.75',
    dcDaCharges: '19.50',
    eac: 275000,
    status: 'pending',
    supplier: 'E.ON Next',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z'
  },
  {
    id: 'site-9',
    userId: 'user-1',
    siteName: 'Training Center',
    siteAddress: '369 Education Boulevard, Bristol, BS1 9OP',
    utilityType: 'water',
    mpanMprnSpid: '3025814703692581',
    accountId: 'ACC009',
    contractStartDate: '2024-01-01',
    contractEndDate: '2024-12-31',
    dayUnitRate: '2.65',
    standingCharges: '9.45',
    eac: 18500,
    status: 'registered',
    supplier: 'Severn Trent',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'site-10',
    userId: 'user-1',
    siteName: 'Service Depot',
    siteAddress: '741 Maintenance Way, Liverpool, L1 0QR',
    utilityType: 'electricity',
    mpanMprnSpid: '2000741852963074',
    accountId: 'ACC010',
    contractStartDate: '2024-06-01',
    contractEndDate: '2025-05-31',
    dayUnitRate: '14.95',
    nightUnitRate: '8.15',
    eveningUnitRate: '12.55',
    standingCharges: '27.95',
    mopCharges: '44.00',
    dcDaCharges: '24.50',
    kvaCharges: '16.75',
    eac: 165000,
    status: 'objected',
    supplier: 'EDF Energy',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z'
  }
];

// Create workbook and worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(sitesData);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sites');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write Excel file
const excelPath = path.join(dataDir, 'sites.xlsx');
XLSX.writeFile(workbook, excelPath);

console.log(`Excel file created successfully at: ${excelPath}`);
console.log(`File contains ${sitesData.length} sites`);

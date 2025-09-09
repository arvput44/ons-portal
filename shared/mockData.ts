// Mock data for ONS Energy Client Management Portal
// This file contains all the hardcoded data to simulate a realistic energy management system

export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}

export interface MockSite {
  id: string;
  userId: string;
  siteName: string;
  siteAddress: string;
  utilityType: string;
  mpanMprnSpid: string;
  accountId?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  dayUnitRate?: string;
  nightUnitRate?: string;
  eveningUnitRate?: string;
  standingCharges?: string;
  mopCharges?: string;
  dcDaCharges?: string;
  kvaCharges?: string;
  eac?: number;
  status: string;
  supplier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockBill {
  id: string;
  siteId: string;
  mpanMprnSpid: string;
  generationDate: string;
  billRefNo: string;
  type: string;
  fromDate: string;
  toDate: string;
  dueDate: string;
  amount: string;
  vatPercentage?: string;
  status: string;
  validationStatus: string;
  query?: string;
  billFilePath?: string;
  createdAt: string;
  updatedAt: string;
  site: MockSite;
}

export interface MockSolarInstallation {
  id: string;
  siteId: string;
  siteAddress: string;
  installationDate?: string;
  status: string;
  upcomingInstallation?: string;
  createdAt: string;
  updatedAt: string;
  site: MockSite;
}

export interface MockSmartMeterInstallation {
  id: string;
  siteId: string;
  mpanMprn: string;
  fuel: string;
  mop: string;
  jobId?: string;
  status: string;
  installationDate?: string;
  createdAt: string;
  updatedAt: string;
  site: MockSite;
}

export interface MockDocument {
  id: string;
  userId: string;
  documentType: string;
  documentName: string;
  filePath: string;
  postcode?: string;
  month?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockHhData {
  id: string;
  siteId: string;
  mpan: string;
  date: string;
  dataFilePath?: string;
  createdAt: string;
  updatedAt: string;
  site: MockSite;
}

export interface MockQuery {
  id: string;
  userId: string;
  siteId?: string;
  billId?: string;
  queryType: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  raisedDate: string;
  lastUpdated: string;
  assignedTo?: string;
  resolution?: string;
  site?: MockSite;
  bill?: MockBill;
}

export interface MockMeterReading {
  id: string;
  siteId: string;
  mpanMprnSpid: string;
  utilityType: string;
  readingDate: string;
  readingType: string;
  previousReading: number;
  currentReading: number;
  consumption: number;
  readingSource: string;
  meterSerial: string;
  filePath?: string;
  site: MockSite;
}

export interface MockSolarProject {
  id: string;
  siteId: string;
  projectName: string;
  systemSize: number;
  panelCount: number;
  inverterType: string;
  installationDate: string;
  commissioningDate?: string;
  status: string;
  estimatedAnnualGeneration: number;
  actualAnnualGeneration?: number;
  exportTariff: number;
  fitRate?: number;
  o2mProvider: string;
  warrantyExpiry: string;
  site: MockSite;
}

export interface MockCarbonData {
  id: string;
  userId: string;
  reportingPeriod: string;
  scope1Emissions: number;
  scope2Emissions: number;
  scope3Emissions: number;
  totalEmissions: number;
  emissionReduction: number;
  renewablePercentage: number;
  carbonOffset: number;
  reportFilePath: string;
  verificationStatus: string;
}

export interface MockAccountStatement {
  id: string;
  siteId: string;
  accountNumber: string;
  statementDate: string;
  statementPeriod: string;
  openingBalance: number;
  closingBalance: number;
  totalCharges: number;
  totalPayments: number;
  utilityType: string;
  filePath: string;
  site: MockSite;
}

export interface MockSmartMeterRollout {
  id: string;
  siteId: string;
  utilityType: string;
  currentMeterType: string;
  targetMeterType: string;
  eligibilityStatus: string;
  rolloutStatus: string;
  scheduledDate?: string;
  completedDate?: string;
  technicianAssigned?: string;
  visitNotes?: string;
  installationCost?: number;
  communicationTested: boolean;
  dataCollectionStarted: boolean;
  site: MockSite;
}

// Mock user data
export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'clientmanagement@ons.energy',
    firstName: 'Client',
    lastName: 'Manager',
    profileImageUrl: 'https://avatar.example.com/user1.jpg'
  }
];

// Import Excel reader for dynamic data
import { getSitesData } from './excelReader.js';

// Mock sites data (fallback)
const hardcodedSites: MockSite[] = [
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

// Export dynamic sites data
export const mockSites = hardcodedSites; // Fallback to hardcoded data

// Function to get dynamic sites data from CSV
export async function getDynamicSites(): Promise<MockSite[]> {
  return await getSitesData();
}

// Mock bills data with site information embedded
export const mockBills: MockBill[] = [
  // Validated Bills
  {
    id: 'bill-1',
    siteId: 'site-1',
    mpanMprnSpid: '2000012345678901',
    generationDate: '2024-07-02',
    billRefNo: '2507000836',
    type: 'bill',
    fromDate: '2024-06-01',
    toDate: '2024-06-30',
    dueDate: '2024-07-08',
    amount: '86.07',
    vatPercentage: '5.00',
    status: 'paid',
    validationStatus: 'validated',
    billFilePath: '/bills/2507000836.pdf',
    createdAt: '2024-07-02T00:00:00Z',
    updatedAt: '2024-07-02T00:00:00Z',
    site: mockSites[0]
  },
  {
    id: 'bill-2',
    siteId: 'site-2',
    mpanMprnSpid: '2000098765432109',
    generationDate: '2024-05-21',
    billRefNo: '2505001074',
    type: 'bill',
    fromDate: '2024-04-20',
    toDate: '2024-05-19',
    dueDate: '2024-06-04',
    amount: '593.70',
    vatPercentage: '20.00',
    status: 'paid',
    validationStatus: 'validated',
    billFilePath: '/bills/2505001074.pdf',
    createdAt: '2024-05-21T00:00:00Z',
    updatedAt: '2024-05-21T00:00:00Z',
    site: mockSites[1]
  },
  {
    id: 'bill-3',
    siteId: 'site-7',
    mpanMprnSpid: '2000147258369014',
    generationDate: '2024-07-02',
    billRefNo: '2507000279',
    type: 'bill',
    fromDate: '2024-06-01',
    toDate: '2024-06-30',
    dueDate: '2024-07-08',
    amount: '2262.83',
    vatPercentage: '20.00',
    status: 'paid',
    validationStatus: 'validated',
    billFilePath: '/bills/2507000279.pdf',
    createdAt: '2024-07-02T00:00:00Z',
    updatedAt: '2024-07-02T00:00:00Z',
    site: mockSites[6]
  },
  {
    id: 'bill-4',
    siteId: 'site-7',
    mpanMprnSpid: '2000147258369014',
    generationDate: '2024-05-02',
    billRefNo: '2505000685',
    type: 'bill',
    fromDate: '2024-04-08',
    toDate: '2024-04-30',
    dueDate: '2024-05-09',
    amount: '212.56',
    vatPercentage: '20.00',
    status: 'paid',
    validationStatus: 'validated',
    billFilePath: '/bills/2505000685.pdf',
    createdAt: '2024-05-02T00:00:00Z',
    updatedAt: '2024-05-02T00:00:00Z',
    site: mockSites[6]
  },
  {
    id: 'bill-5',
    siteId: 'site-2',
    mpanMprnSpid: '2000098765432109',
    generationDate: '2024-06-21',
    billRefNo: '2506001158',
    type: 'bill',
    fromDate: '2024-05-20',
    toDate: '2024-06-19',
    dueDate: '2024-07-05',
    amount: '1239.67',
    vatPercentage: '20.00',
    status: 'unpaid',
    validationStatus: 'validated',
    billFilePath: '/bills/2506001158.pdf',
    createdAt: '2024-06-21T00:00:00Z',
    updatedAt: '2024-06-21T00:00:00Z',
    site: mockSites[1]
  },
  {
    id: 'bill-6',
    siteId: 'site-1',
    mpanMprnSpid: '2000012345678901',
    generationDate: '2024-06-02',
    billRefNo: '2506000834',
    type: 'bill',
    fromDate: '2024-05-03',
    toDate: '2024-05-31',
    dueDate: '2024-06-06',
    amount: '80.89',
    vatPercentage: '20.00',
    status: 'paid',
    validationStatus: 'validated',
    billFilePath: '/bills/2506000834.pdf',
    createdAt: '2024-06-02T00:00:00Z',
    updatedAt: '2024-06-02T00:00:00Z',
    site: mockSites[0]
  },
  {
    id: 'bill-7',
    siteId: 'site-7',
    mpanMprnSpid: '2000147258369014',
    generationDate: '2024-08-02',
    billRefNo: '2508000723',
    type: 'bill',
    fromDate: '2024-07-01',
    toDate: '2024-07-31',
    dueDate: '2024-08-08',
    amount: '286.49',
    vatPercentage: '20.00',
    status: 'paid',
    validationStatus: 'validated',
    billFilePath: '/bills/2508000723.pdf',
    createdAt: '2024-08-02T00:00:00Z',
    updatedAt: '2024-08-02T00:00:00Z',
    site: mockSites[6]
  },
  {
    id: 'bill-8',
    siteId: 'site-7',
    mpanMprnSpid: '2000147258369014',
    generationDate: '2024-08-02',
    billRefNo: '2508000723CN',
    type: 'credit_note',
    fromDate: '2024-07-01',
    toDate: '2024-07-31',
    dueDate: '2024-08-08',
    amount: '0.00',
    vatPercentage: '20.00',
    status: 'paid',
    validationStatus: 'validated',
    billFilePath: '/bills/2508000723CN.pdf',
    createdAt: '2024-08-02T00:00:00Z',
    updatedAt: '2024-08-02T00:00:00Z',
    site: mockSites[6]
  },
  // Incorrect Bills
  {
    id: 'bill-9',
    siteId: 'site-1',
    mpanMprnSpid: '2000012345678901',
    generationDate: '2024-07-02',
    billRefNo: '2507000837',
    type: 'bill',
    fromDate: '2024-06-01',
    toDate: '2024-06-30',
    dueDate: '2024-07-08',
    amount: '186.07',
    vatPercentage: '5.00',
    status: 'unpaid',
    validationStatus: 'incorrect',
    query: 'Incorrect Initial reads - consumption values appear inflated',
    billFilePath: '/bills/2507000837.pdf',
    createdAt: '2024-07-02T00:00:00Z',
    updatedAt: '2024-07-02T00:00:00Z',
    site: mockSites[0]
  },
  {
    id: 'bill-10',
    siteId: 'site-2',
    mpanMprnSpid: '2000098765432109',
    generationDate: '2024-05-21',
    billRefNo: '2505001075',
    type: 'bill',
    fromDate: '2024-04-20',
    toDate: '2024-05-19',
    dueDate: '2024-06-04',
    amount: '893.70',
    vatPercentage: '20.00',
    status: 'unpaid',
    validationStatus: 'incorrect',
    query: 'Estimated reads used instead of actual meter readings',
    billFilePath: '/bills/2505001075.pdf',
    createdAt: '2024-05-21T00:00:00Z',
    updatedAt: '2024-05-21T00:00:00Z',
    site: mockSites[1]
  },
  {
    id: 'bill-11',
    siteId: 'site-4',
    mpanMprnSpid: '1023456789012345',
    generationDate: '2024-07-02',
    billRefNo: '2507000280',
    type: 'bill',
    fromDate: '2024-06-01',
    toDate: '2024-06-30',
    dueDate: '2024-07-08',
    amount: '1862.83',
    vatPercentage: '20.00',
    status: 'unpaid',
    validationStatus: 'incorrect',
    query: 'Standing charges calculation error - rate applied incorrectly',
    billFilePath: '/bills/2507000280.pdf',
    createdAt: '2024-07-02T00:00:00Z',
    updatedAt: '2024-07-02T00:00:00Z',
    site: mockSites[3]
  },
  {
    id: 'bill-12',
    siteId: 'site-5',
    mpanMprnSpid: '1098765432109876',
    generationDate: '2024-05-02',
    billRefNo: '2505000686',
    type: 'bill',
    fromDate: '2024-04-08',
    toDate: '2024-04-30',
    dueDate: '2024-05-09',
    amount: '412.56',
    vatPercentage: '20.00',
    status: 'unpaid',
    validationStatus: 'incorrect',
    query: 'Duplicate billing period - overlapping with previous bill',
    billFilePath: '/bills/2505000686.pdf',
    createdAt: '2024-05-02T00:00:00Z',
    updatedAt: '2024-05-02T00:00:00Z',
    site: mockSites[4]
  },
  {
    id: 'bill-13',
    siteId: 'site-6',
    mpanMprnSpid: '3012345678901234',
    generationDate: '2024-06-21',
    billRefNo: '2506001159',
    type: 'bill',
    fromDate: '2024-05-20',
    toDate: '2024-06-19',
    dueDate: '2024-07-05',
    amount: '89.67',
    vatPercentage: '20.00',
    status: 'unpaid',
    validationStatus: 'incorrect',
    query: 'Incorrect tariff applied - should be standard business rate',
    billFilePath: '/bills/2506001159.pdf',
    createdAt: '2024-06-21T00:00:00Z',
    updatedAt: '2024-06-21T00:00:00Z',
    site: mockSites[5]
  }
];

// Mock solar installations
export const mockSolarInstallations: MockSolarInstallation[] = [
  {
    id: 'solar-1',
    siteId: 'site-1',
    siteAddress: '123 Business Park, London, SW1A 1AA',
    installationDate: '2024-03-15',
    status: 'installed',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
    site: mockSites[0]
  },
  {
    id: 'solar-2',
    siteId: 'site-2',
    siteAddress: '456 Industrial Estate, Manchester, M1 2AB',
    status: 'upcoming',
    upcomingInstallation: '2024-12-15',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    site: mockSites[1]
  },
  {
    id: 'solar-3',
    siteId: 'site-7',
    siteAddress: '147 Logistics Hub, Cardiff, CF1 7KL',
    installationDate: '2024-05-20',
    status: 'installed',
    createdAt: '2024-05-20T00:00:00Z',
    updatedAt: '2024-05-20T00:00:00Z',
    site: mockSites[6]
  }
];

// Mock smart meter installations
export const mockSmartMeterInstallations: MockSmartMeterInstallation[] = [
  {
    id: 'smart-1',
    siteId: 'site-1',
    mpanMprn: '2000012345678901',
    fuel: 'electricity',
    mop: 'SSE Metering',
    jobId: 'JOB001',
    status: 'installed',
    installationDate: '2024-02-10',
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    site: mockSites[0]
  },
  {
    id: 'smart-2',
    siteId: 'site-2',
    mpanMprn: '2000098765432109',
    fuel: 'electricity',
    mop: 'Landis+Gyr',
    jobId: 'JOB002',
    status: 'installed',
    installationDate: '2024-03-05',
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
    site: mockSites[1]
  },
  {
    id: 'smart-3',
    siteId: 'site-4',
    mpanMprn: '1023456789012345',
    fuel: 'gas',
    mop: 'Siemens',
    jobId: 'JOB003',
    status: 'upcoming_installation',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
    site: mockSites[3]
  },
  {
    id: 'smart-4',
    siteId: 'site-5',
    mpanMprn: '1098765432109876',
    fuel: 'gas',
    mop: 'Honeywell',
    jobId: 'JOB004',
    status: 'job_status_failed',
    createdAt: '2024-04-15T00:00:00Z',
    updatedAt: '2024-04-15T00:00:00Z',
    site: mockSites[4]
  },
  {
    id: 'smart-5',
    siteId: 'site-7',
    mpanMprn: '2000147258369014',
    fuel: 'electricity',
    mop: 'Itron',
    jobId: 'JOB005',
    status: 'not_eligible',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
    site: mockSites[6]
  }
];

// Mock documents
export const mockDocuments: MockDocument[] = [
  {
    id: 'doc-1',
    userId: 'user-1',
    documentType: 'vat_form',
    documentName: 'VAT Registration Certificate 2024',
    filePath: '/documents/vat_cert_2024.pdf',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'doc-2',
    userId: 'user-1',
    documentType: 'monthly_edi_report',
    documentName: 'EDI Report January 2024',
    filePath: '/documents/edi_report_jan_2024.pdf',
    month: 'January 2024',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'doc-3',
    userId: 'user-1',
    documentType: 'monthly_edi_report',
    documentName: 'EDI Report February 2024',
    filePath: '/documents/edi_report_feb_2024.pdf',
    month: 'February 2024',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'doc-4',
    userId: 'user-1',
    documentType: 'carbon_report',
    documentName: 'Carbon Footprint Report Q1 2024',
    filePath: '/documents/carbon_q1_2024.pdf',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z'
  },
  {
    id: 'doc-5',
    userId: 'user-1',
    documentType: 'site_mapping',
    documentName: 'Site Location Mapping London',
    filePath: '/documents/site_mapping_london.pdf',
    postcode: 'SW1A',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'doc-6',
    userId: 'user-1',
    documentType: 'complaint_procedure',
    documentName: 'Energy Complaint Procedure 2024',
    filePath: '/documents/complaint_procedure_2024.pdf',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock queries
export const mockQueries: MockQuery[] = [
  {
    id: 'query-1',
    userId: 'user-1',
    siteId: 'site-1',
    billId: 'bill-9',
    queryType: 'billing_dispute',
    title: 'Incorrect consumption reading on June bill',
    description: 'The June 2024 bill shows consumption that is 3x higher than normal usage patterns. Meter readings appear to be estimated rather than actual readings.',
    status: 'open',
    priority: 'high',
    raisedDate: '2024-07-05T09:30:00Z',
    lastUpdated: '2024-07-15T14:20:00Z',
    assignedTo: 'Sarah Williams',
    site: mockSites[0]
  },
  {
    id: 'query-2',
    userId: 'user-1',
    siteId: 'site-2',
    billId: 'bill-10',
    queryType: 'billing_dispute',
    title: 'Standing charges calculation error',
    description: 'The standing charges applied on the May bill are incorrect. The rate being charged is for domestic tariff instead of business rates.',
    status: 'in_progress',
    priority: 'medium',
    raisedDate: '2024-06-22T11:15:00Z',
    lastUpdated: '2024-07-10T16:45:00Z',
    assignedTo: 'James Mitchell',
    site: mockSites[1]
  },
  {
    id: 'query-3',
    userId: 'user-1',
    siteId: 'site-4',
    queryType: 'service_issue',
    title: 'Smart meter installation delay',
    description: 'Smart meter installation scheduled for March 2024 has been postponed multiple times. Need confirmation of new installation date.',
    status: 'escalated',
    priority: 'high',
    raisedDate: '2024-04-10T08:00:00Z',
    lastUpdated: '2024-07-20T10:30:00Z',
    assignedTo: 'Emma Thompson',
    site: mockSites[3]
  },
  {
    id: 'query-4',
    userId: 'user-1',
    siteId: 'site-6',
    billId: 'bill-13',
    queryType: 'billing_dispute',
    title: 'Water tariff classification error',
    description: 'Water utility bill is using industrial tariff rates instead of commercial rates for our office building.',
    status: 'resolved',
    priority: 'medium',
    raisedDate: '2024-06-28T13:45:00Z',
    lastUpdated: '2024-07-25T09:15:00Z',
    assignedTo: 'David Roberts',
    resolution: 'Tariff corrected and credit note issued for £45.67 overcharge.',
    site: mockSites[5]
  },
  {
    id: 'query-5',
    userId: 'user-1',
    siteId: 'site-7',
    queryType: 'account_issue',
    title: 'Duplicate account creation',
    description: 'Multiple utility accounts have been created for the same site address. Need consolidation into single account.',
    status: 'open',
    priority: 'low',
    raisedDate: '2024-07-12T15:20:00Z',
    lastUpdated: '2024-07-18T11:00:00Z',
    site: mockSites[6]
  },
  {
    id: 'query-6',
    userId: 'user-1',
    siteId: 'site-5',
    queryType: 'service_issue',
    title: 'Gas supply registration objection',
    description: 'Existing supplier has objected to our change of tenancy application. Need resolution to proceed with new contract.',
    status: 'in_progress',
    priority: 'high',
    raisedDate: '2024-07-01T10:00:00Z',
    lastUpdated: '2024-07-22T14:30:00Z',
    assignedTo: 'Michael Brown',
    site: mockSites[4]
  }
];

// Mock meter readings
export const mockMeterReadings: MockMeterReading[] = [
  {
    id: 'reading-1',
    siteId: 'site-1',
    mpanMprnSpid: '2000012345678901',
    utilityType: 'electricity',
    readingDate: '2024-07-31',
    readingType: 'actual',
    previousReading: 45267,
    currentReading: 47892,
    consumption: 2625,
    readingSource: 'smart_meter',
    meterSerial: 'SM001-2345',
    filePath: '/meter-readings/2000012345678901_202407.pdf',
    site: mockSites[0]
  },
  {
    id: 'reading-2',
    siteId: 'site-2',
    mpanMprnSpid: '2000098765432109',
    utilityType: 'electricity',
    readingDate: '2024-07-31',
    readingType: 'actual',
    previousReading: 128456,
    currentReading: 135670,
    consumption: 7214,
    readingSource: 'manual',
    meterSerial: 'EM002-6789',
    filePath: '/meter-readings/2000098765432109_202407.pdf',
    site: mockSites[1]
  },
  {
    id: 'reading-3',
    siteId: 'site-4',
    mpanMprnSpid: '1023456789012345',
    utilityType: 'gas',
    readingDate: '2024-07-31',
    readingType: 'estimated',
    previousReading: 89234,
    currentReading: 94567,
    consumption: 5333,
    readingSource: 'estimated',
    meterSerial: 'GM003-4567',
    site: mockSites[3]
  },
  {
    id: 'reading-4',
    siteId: 'site-6',
    mpanMprnSpid: '3012345678901234',
    utilityType: 'water',
    readingDate: '2024-07-31',
    readingType: 'actual',
    previousReading: 12456,
    currentReading: 13789,
    consumption: 1333,
    readingSource: 'manual',
    meterSerial: 'WM004-8901',
    filePath: '/meter-readings/3012345678901234_202407.pdf',
    site: mockSites[5]
  },
  {
    id: 'reading-5',
    siteId: 'site-7',
    mpanMprnSpid: '2000147258369014',
    utilityType: 'electricity',
    readingDate: '2024-07-31',
    readingType: 'actual',
    previousReading: 256789,
    currentReading: 267234,
    consumption: 10445,
    readingSource: 'smart_meter',
    meterSerial: 'SM005-2345',
    filePath: '/meter-readings/2000147258369014_202407.pdf',
    site: mockSites[6]
  }
];

// Mock solar projects
export const mockSolarProjects: MockSolarProject[] = [
  {
    id: 'solar-proj-1',
    siteId: 'site-1',
    projectName: 'Main Office Solar Installation',
    systemSize: 50.4,
    panelCount: 120,
    inverterType: 'SolarEdge SE27.6K',
    installationDate: '2024-03-15',
    commissioningDate: '2024-03-20',
    status: 'operational',
    estimatedAnnualGeneration: 45000,
    actualAnnualGeneration: 47250,
    exportTariff: 5.5,
    fitRate: 3.2,
    o2mProvider: 'SolarPower O&M Ltd',
    warrantyExpiry: '2044-03-20',
    site: mockSites[0]
  },
  {
    id: 'solar-proj-2',
    siteId: 'site-2',
    projectName: 'Warehouse Rooftop Solar Array',
    systemSize: 125.8,
    panelCount: 299,
    inverterType: 'Fronius Symo 24.0-3',
    installationDate: '2024-05-20',
    commissioningDate: '2024-05-25',
    status: 'operational',
    estimatedAnnualGeneration: 112000,
    actualAnnualGeneration: 89600,
    exportTariff: 5.5,
    fitRate: 3.2,
    o2mProvider: 'Green Energy Services',
    warrantyExpiry: '2044-05-25',
    site: mockSites[1]
  },
  {
    id: 'solar-proj-3',
    siteId: 'site-7',
    projectName: 'Distribution Center Solar Canopy',
    systemSize: 200.6,
    panelCount: 478,
    inverterType: 'Huawei SUN2000-60KTL',
    installationDate: '2024-01-10',
    commissioningDate: '2024-01-18',
    status: 'operational',
    estimatedAnnualGeneration: 180000,
    actualAnnualGeneration: 195400,
    exportTariff: 5.5,
    fitRate: 3.2,
    o2mProvider: 'Solar Maintenance Pro',
    warrantyExpiry: '2044-01-18',
    site: mockSites[6]
  },
  {
    id: 'solar-proj-4',
    siteId: 'site-3',
    projectName: 'Retail Store Solar Project',
    systemSize: 25.2,
    panelCount: 60,
    inverterType: 'SMA Sunny Tripower 25000TL',
    installationDate: '2024-08-01',
    status: 'under_construction',
    estimatedAnnualGeneration: 22500,
    exportTariff: 5.5,
    o2mProvider: 'Renewable Energy Solutions',
    warrantyExpiry: '2044-08-01',
    site: mockSites[2]
  }
];

// Mock carbon data
export const mockCarbonData: MockCarbonData[] = [
  {
    id: 'carbon-1',
    userId: 'user-1',
    reportingPeriod: '2023-Q4',
    scope1Emissions: 125.4,
    scope2Emissions: 876.2,
    scope3Emissions: 234.8,
    totalEmissions: 1236.4,
    emissionReduction: 8.5,
    renewablePercentage: 35.2,
    carbonOffset: 150.0,
    reportFilePath: '/carbon-reports/Q4-2023-carbon-report.pdf',
    verificationStatus: 'verified'
  },
  {
    id: 'carbon-2',
    userId: 'user-1',
    reportingPeriod: '2024-Q1',
    scope1Emissions: 118.7,
    scope2Emissions: 798.5,
    scope3Emissions: 245.3,
    totalEmissions: 1162.5,
    emissionReduction: 14.2,
    renewablePercentage: 42.1,
    carbonOffset: 175.0,
    reportFilePath: '/carbon-reports/Q1-2024-carbon-report.pdf',
    verificationStatus: 'verified'
  },
  {
    id: 'carbon-3',
    userId: 'user-1',
    reportingPeriod: '2024-Q2',
    scope1Emissions: 102.3,
    scope2Emissions: 723.1,
    scope3Emissions: 189.6,
    totalEmissions: 1015.0,
    emissionReduction: 22.8,
    renewablePercentage: 48.7,
    carbonOffset: 200.0,
    reportFilePath: '/carbon-reports/Q2-2024-carbon-report.pdf',
    verificationStatus: 'pending'
  }
];

// Mock smart meter rollout
export const mockSmartMeterRollout: MockSmartMeterRollout[] = [
  {
    id: 'rollout-1',
    siteId: 'site-1',
    utilityType: 'electricity',
    currentMeterType: 'traditional',
    targetMeterType: 'SMETS2',
    eligibilityStatus: 'eligible',
    rolloutStatus: 'installed',
    scheduledDate: '2024-06-15',
    completedDate: '2024-06-15',
    technicianAssigned: 'Smart Energy Solutions',
    visitNotes: 'Installation completed successfully, communication tested',
    installationCost: 0,
    communicationTested: true,
    dataCollectionStarted: true,
    site: mockSites[0]
  },
  {
    id: 'rollout-2',
    siteId: 'site-2',
    utilityType: 'electricity',
    currentMeterType: 'traditional',
    targetMeterType: 'SMETS2',
    eligibilityStatus: 'eligible',
    rolloutStatus: 'site_visit_arranged',
    scheduledDate: '2024-08-25',
    technicianAssigned: 'Meter Installation Co',
    visitNotes: 'Initial survey completed, installation scheduled',
    installationCost: 0,
    communicationTested: false,
    dataCollectionStarted: false,
    site: mockSites[1]
  },
  {
    id: 'rollout-3',
    siteId: 'site-3',
    utilityType: 'gas',
    currentMeterType: 'traditional',
    targetMeterType: 'SMETS2',
    eligibilityStatus: 'eligible',
    rolloutStatus: 'working',
    scheduledDate: '2024-07-20',
    completedDate: '2024-07-20',
    technicianAssigned: 'Gas Meter Services',
    visitNotes: 'Installation complete, awaiting commission',
    installationCost: 0,
    communicationTested: true,
    dataCollectionStarted: false,
    site: mockSites[2]
  },
  {
    id: 'rollout-4',
    siteId: 'site-4',
    utilityType: 'gas',
    currentMeterType: 'traditional',
    targetMeterType: 'SMETS2',
    eligibilityStatus: 'eligible',
    rolloutStatus: 'on_job_failed',
    scheduledDate: '2024-07-10',
    technicianAssigned: 'Utility Meter Installs',
    visitNotes: 'Access issues - customer not available, rebook required',
    installationCost: 0,
    communicationTested: false,
    dataCollectionStarted: false,
    site: mockSites[3]
  },
  {
    id: 'rollout-5',
    siteId: 'site-5',
    utilityType: 'electricity',
    currentMeterType: 'SMETS1',
    targetMeterType: 'SMETS2',
    eligibilityStatus: 'eligible',
    rolloutStatus: 'rebook',
    scheduledDate: '2024-08-05',
    technicianAssigned: 'Smart Meter Solutions',
    visitNotes: 'Previous attempt failed due to meter location access',
    installationCost: 0,
    communicationTested: false,
    dataCollectionStarted: false,
    site: mockSites[4]
  },
  {
    id: 'rollout-6',
    siteId: 'site-6',
    utilityType: 'water',
    currentMeterType: 'traditional',
    targetMeterType: 'AMR',
    eligibilityStatus: 'eligible',
    rolloutStatus: 'already_raised',
    scheduledDate: '2024-09-01',
    technicianAssigned: 'Water Meter Installations',
    visitNotes: 'Work order raised with water company',
    installationCost: 0,
    communicationTested: false,
    dataCollectionStarted: false,
    site: mockSites[5]
  },
  {
    id: 'rollout-7',
    siteId: 'site-7',
    utilityType: 'electricity',
    currentMeterType: 'traditional',
    targetMeterType: 'SMETS2',
    eligibilityStatus: 'eligible',
    rolloutStatus: 'commission',
    scheduledDate: '2024-07-25',
    completedDate: '2024-07-25',
    technicianAssigned: 'Energy Meter Services',
    visitNotes: 'Installation complete, commissioning in progress',
    installationCost: 0,
    communicationTested: true,
    dataCollectionStarted: false,
    site: mockSites[6]
  },
  {
    id: 'rollout-8',
    siteId: 'site-8',
    utilityType: 'gas',
    currentMeterType: 'traditional',
    targetMeterType: 'SMETS2',
    eligibilityStatus: 'not_eligible',
    rolloutStatus: 'on_going',
    visitNotes: 'Site assessment ongoing for eligibility review',
    installationCost: 0,
    communicationTested: false,
    dataCollectionStarted: false,
    site: mockSites[7]
  }
];

// Mock account statements
export const mockAccountStatements: MockAccountStatement[] = [
  {
    id: 'stmt-1',
    siteId: 'site-1',
    accountNumber: 'ACC001-ELEC',
    statementDate: '2024-07-31',
    statementPeriod: 'July 2024',
    openingBalance: -45.67,
    closingBalance: 120.34,
    totalCharges: 186.07,
    totalPayments: 20.06,
    utilityType: 'electricity',
    filePath: '/statements/ACC001-ELEC-202407.pdf',
    site: mockSites[0]
  },
  {
    id: 'stmt-2',
    siteId: 'site-2',
    accountNumber: 'ACC002-ELEC',
    statementDate: '2024-07-31',
    statementPeriod: 'July 2024',
    openingBalance: 234.56,
    closingBalance: -1205.11,
    totalCharges: 1239.67,
    totalPayments: 200.00,
    utilityType: 'electricity',
    filePath: '/statements/ACC002-ELEC-202407.pdf',
    site: mockSites[1]
  },
  {
    id: 'stmt-3',
    siteId: 'site-4',
    accountNumber: 'ACC004-GAS',
    statementDate: '2024-07-31',
    statementPeriod: 'July 2024',
    openingBalance: 156.78,
    closingBalance: -1706.05,
    totalCharges: 1862.83,
    totalPayments: 0.00,
    utilityType: 'gas',
    filePath: '/statements/ACC004-GAS-202407.pdf',
    site: mockSites[3]
  },
  {
    id: 'stmt-4',
    siteId: 'site-6',
    accountNumber: 'ACC006-WATER',
    statementDate: '2024-07-31',
    statementPeriod: 'July 2024',
    openingBalance: 12.34,
    closingBalance: -77.33,
    totalCharges: 89.67,
    totalPayments: 0.00,
    utilityType: 'water',
    filePath: '/statements/ACC006-WATER-202407.pdf',
    site: mockSites[5]
  },
  {
    id: 'stmt-5',
    siteId: 'site-7',
    accountNumber: 'ACC007-ELEC',
    statementDate: '2024-07-31',
    statementPeriod: 'July 2024',
    openingBalance: 567.89,
    closingBalance: 281.40,
    totalCharges: 286.49,
    totalPayments: 572.98,
    utilityType: 'electricity',
    filePath: '/statements/ACC007-ELEC-202407.pdf',
    site: mockSites[6]
  }
];

// Mock HH data
export const mockHhData: MockHhData[] = [
  {
    id: 'hh-1',
    siteId: 'site-1',
    mpan: '2000012345678901',
    date: '2024-07-01',
    dataFilePath: '/hh_data/2000012345678901_20240701.csv',
    createdAt: '2024-07-02T00:00:00Z',
    updatedAt: '2024-07-02T00:00:00Z',
    site: mockSites[0]
  },
  {
    id: 'hh-2',
    siteId: 'site-1',
    mpan: '2000012345678901',
    date: '2024-06-01',
    dataFilePath: '/hh_data/2000012345678901_20240601.csv',
    createdAt: '2024-06-02T00:00:00Z',
    updatedAt: '2024-06-02T00:00:00Z',
    site: mockSites[0]
  },
  {
    id: 'hh-3',
    siteId: 'site-2',
    mpan: '2000098765432109',
    date: '2024-07-01',
    dataFilePath: '/hh_data/2000098765432109_20240701.csv',
    createdAt: '2024-07-02T00:00:00Z',
    updatedAt: '2024-07-02T00:00:00Z',
    site: mockSites[1]
  },
  {
    id: 'hh-4',
    siteId: 'site-7',
    mpan: '2000147258369014',
    date: '2024-07-01',
    dataFilePath: '/hh_data/2000147258369014_20240701.csv',
    createdAt: '2024-07-02T00:00:00Z',
    updatedAt: '2024-07-02T00:00:00Z',
    site: mockSites[6]
  },
  {
    id: 'hh-5',
    siteId: 'site-7',
    mpan: '2000147258369014',
    date: '2024-06-01',
    dataFilePath: '/hh_data/2000147258369014_20240601.csv',
    createdAt: '2024-06-02T00:00:00Z',
    updatedAt: '2024-06-02T00:00:00Z',
    site: mockSites[6]
  }
];

// Analytics stats calculation helper
export function calculateStats() {
  const totalSites = mockSites.length;
  const activeMpans = mockSites.filter(s => s.status === 'registered').length;
  
  // Calculate monthly spend from paid bills
  const monthlySpend = mockBills
    .filter(b => b.status === 'paid' && b.validationStatus === 'validated')
    .reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
  
  const pendingBills = mockBills.filter(b => b.status === 'unpaid').length;
  
  // Utility-specific stats
  const electricitySites = mockSites.filter(s => s.utilityType === 'electricity' && s.status === 'registered').length;
  const gasSites = mockSites.filter(s => s.utilityType === 'gas' && s.status === 'registered').length;
  const waterSites = mockSites.filter(s => s.utilityType === 'water' && s.status === 'registered').length;
  
  const electricityPending = mockSites.filter(s => s.utilityType === 'electricity' && s.status === 'pending').length;
  const gasPending = mockSites.filter(s => s.utilityType === 'gas' && s.status === 'pending').length;
  const waterPending = mockSites.filter(s => s.utilityType === 'water' && s.status === 'pending').length;
  
  const electricityObjections = mockSites.filter(s => s.utilityType === 'electricity' && s.status === 'objected').length;
  const gasObjections = mockSites.filter(s => s.utilityType === 'gas' && s.status === 'objected').length;
  const waterObjections = mockSites.filter(s => s.utilityType === 'water' && s.status === 'objected').length;
  
  return {
    totalSites,
    activeMpans,
    monthlySpend: Math.round(monthlySpend),
    pendingBills,
    electricitySites,
    gasSites,
    waterSites,
    electricityPending,
    gasPending,
    waterPending,
    electricityObjections,
    gasObjections,
    waterObjections
  };
}
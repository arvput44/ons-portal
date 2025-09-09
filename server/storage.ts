import {
  mockUsers,
  mockSites,
  mockBills,
  mockSolarInstallations,
  mockSmartMeterInstallations,
  mockDocuments,
  mockHhData,
  mockQueries,
  mockMeterReadings,
  mockSolarProjects,
  mockCarbonData,
  mockAccountStatements,
  calculateStats,
  getDynamicSites,
  type MockUser as User,
  type MockSite as Site,
  type MockBill as Bill,
  type MockSolarInstallation as SolarInstallation,
  type MockSmartMeterInstallation as SmartMeterInstallation,
  type MockDocument as Document,
  type MockHhData as HhData,
  type MockQuery as Query,
  type MockMeterReading as MeterReading,
  type MockSolarProject as SolarProject,
  type MockCarbonData as CarbonData,
  type MockAccountStatement as AccountStatement,
  mockSmartMeterRollout,
  type MockSmartMeterRollout as SmartMeterRollout,
} from "@shared/mockData";
import { getSitesData } from "@shared/excelReader";

type UpsertUser = Partial<User>;
type InsertSite = Omit<Site, 'id' | 'createdAt' | 'updatedAt'>;
type InsertBill = Omit<Bill, 'id' | 'createdAt' | 'updatedAt' | 'site'>;
type InsertSolarInstallation = Omit<SolarInstallation, 'id' | 'createdAt' | 'updatedAt' | 'site'>;
type InsertSmartMeterInstallation = Omit<SmartMeterInstallation, 'id' | 'createdAt' | 'updatedAt' | 'site'>;
type InsertDocument = Omit<Document, 'id' | 'createdAt' | 'updatedAt'>;
type InsertHhData = Omit<HhData, 'id' | 'createdAt' | 'updatedAt' | 'site'>;
type InsertQuery = Omit<Query, 'id' | 'raisedDate' | 'lastUpdated' | 'site' | 'bill'>;
type InsertMeterReading = Omit<MeterReading, 'id' | 'site'>;
type InsertSolarProject = Omit<SolarProject, 'id' | 'site'>;
type InsertCarbonData = Omit<CarbonData, 'id'>;
type InsertAccountStatement = Omit<AccountStatement, 'id' | 'site'>;
type InsertSmartMeterRollout = Omit<SmartMeterRollout, 'id' | 'site'>;

// Dynamic sites data - will be loaded from Excel on every request
// Cache for in-memory operations (create, update, delete)
let inMemorySites: Site[] = [];
let isInitialized = false;

// Initialize dynamic sites data
async function initializeSites() {
  try {
    inMemorySites = await getSitesData();
    isInitialized = true;
    console.log(`Initialized with ${inMemorySites.length} sites from Excel`);
  } catch (error) {
    console.error('Error loading dynamic sites, using fallback:', error);
    inMemorySites = mockSites;
    isInitialized = true;
  }
}

// Get fresh data from Excel on every request
async function getFreshSitesData(): Promise<Site[]> {
  try {
    const freshData = await getSitesData();
    // Merge with in-memory changes (newly created/updated sites)
    const mergedData = [...freshData];
    
    // Add any sites that were created in memory but not in Excel
    for (const inMemorySite of inMemorySites) {
      if (!freshData.find(site => site.id === inMemorySite.id)) {
        mergedData.push(inMemorySite);
      }
    }
    
    return mergedData;
  } catch (error) {
    console.error('Error getting fresh sites data, using in-memory data:', error);
    return inMemorySites;
  }
}

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Sites operations
  getUserSites(userId: string, utilityType?: string): Promise<Site[]>;
  getSite(id: string): Promise<Site | undefined>;
  createSite(site: InsertSite): Promise<Site>;
  updateSite(id: string, site: Partial<InsertSite>): Promise<Site>;
  searchSites(userId: string, searchTerm: string, utilityType?: string, status?: string): Promise<Site[]>;

  // Bills operations
  getUserBills(userId: string, validationStatus?: string, month?: string, status?: string, utilityType?: string): Promise<(Bill & { site: Site })[]>;
  getBill(id: string): Promise<Bill | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBill(id: string, bill: Partial<InsertBill>): Promise<Bill>;

  // Solar installations operations
  getUserSolarInstallations(userId: string): Promise<(SolarInstallation & { site: Site })[]>;
  createSolarInstallation(installation: InsertSolarInstallation): Promise<SolarInstallation>;

  // Smart meter installations operations
  getUserSmartMeterInstallations(userId: string): Promise<(SmartMeterInstallation & { site: Site })[]>;
  createSmartMeterInstallation(installation: InsertSmartMeterInstallation): Promise<SmartMeterInstallation>;

  // Documents operations
  getUserDocuments(userId: string, documentType?: string, postcode?: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;

  // HH Data operations
  getUserHhData(userId: string): Promise<(HhData & { site: Site })[]>;
  createHhData(hhData: InsertHhData): Promise<HhData>;

  // Query operations
  getUserQueries(userId: string, status?: string, priority?: string, queryType?: string): Promise<Query[]>;
  createQuery(query: InsertQuery): Promise<Query>;
  updateQuery(id: string, query: Partial<InsertQuery>): Promise<Query>;

  // Meter reading operations
  getMeterReadings(userId: string): Promise<MeterReading[]>;
  
  // Solar project operations
  getSolarProjects(userId: string): Promise<SolarProject[]>;
  
  // Carbon data operations
  getCarbonData(userId: string): Promise<CarbonData[]>;
  
  // Account statement operations
  getAccountStatements(userId: string): Promise<AccountStatement[]>;
  
  // Smart meter rollout operations
  getSmartMeterRollout(userId: string): Promise<SmartMeterRollout[]>;

  // Analytics operations
  getUserSiteStats(userId: string): Promise<{
    totalSites: number;
    activeMpans: number;
    monthlySpend: number;
    pendingBills: number;
    electricitySites: number;
    gasSites: number;
    waterSites: number;
    electricityPending: number;
    gasPending: number;
    waterPending: number;
    electricityObjections: number;
    gasObjections: number;
    waterObjections: number;
  }>;
}

export class MockStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return mockUsers.find(user => user.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = mockUsers.find(user => user.id === userData.id);
    if (existingUser) {
      Object.assign(existingUser, userData);
      return existingUser;
    }
    const newUser = { ...userData } as User;
    mockUsers.push(newUser);
    return newUser;
  }

  // Sites operations
  async getUserSites(userId: string, utilityType?: string): Promise<Site[]> {
    const freshSites = await getFreshSitesData();
    let sites = freshSites.filter(site => site.userId === userId);
    
    if (utilityType && utilityType !== 'All Types') {
      sites = sites.filter(site => site.utilityType === utilityType.toLowerCase());
    }
    console.log("From site api....", sites);
    
    return sites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getSite(id: string): Promise<Site | undefined> {
    const freshSites = await getFreshSitesData();
    return freshSites.find(site => site.id === id);
  }

  async createSite(site: InsertSite): Promise<Site> {
    const newSite: Site = {
      ...site,
      id: `site-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemorySites.push(newSite);
    return newSite;
  }

  async updateSite(id: string, siteData: Partial<InsertSite>): Promise<Site> {
    const siteIndex = inMemorySites.findIndex(site => site.id === id);
    if (siteIndex === -1) throw new Error('Site not found');
    
    inMemorySites[siteIndex] = {
      ...inMemorySites[siteIndex],
      ...siteData,
      updatedAt: new Date().toISOString(),
    };
    
    return inMemorySites[siteIndex];
  }

  async searchSites(userId: string, searchTerm: string, utilityType?: string, status?: string): Promise<Site[]> {
    const freshSites = await getFreshSitesData();
    let sites = freshSites.filter(site => site.userId === userId);
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      sites = sites.filter(site => 
        site.mpanMprnSpid.toLowerCase().includes(term) ||
        site.siteName.toLowerCase().includes(term) ||
        site.siteAddress.toLowerCase().includes(term)
      );
    }
    
    if (utilityType && utilityType !== 'All Types') {
      sites = sites.filter(site => site.utilityType === utilityType.toLowerCase());
    }
    
    if (status && status !== 'All Statuses') {
      sites = sites.filter(site => site.status === status.toLowerCase());
    }

    return sites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Bills operations
  async getUserBills(userId: string, validationStatus?: string, month?: string, status?: string, utilityType?: string): Promise<Bill[]> {
    let bills = mockBills.filter(bill => bill.site.userId === userId);
    
    if (validationStatus && validationStatus !== 'All Status') {
      bills = bills.filter(bill => bill.validationStatus === validationStatus);
    }
    
    if (month && month !== 'All Months') {
      const [monthName, year] = month.split(' ');
      const monthNumber = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
      bills = bills.filter(bill => {
        const billDate = new Date(bill.generationDate);
        return billDate.getMonth() + 1 === monthNumber && billDate.getFullYear() === parseInt(year);
      });
    }
    
    if (status && status !== 'All Status') {
      bills = bills.filter(bill => bill.status === status.toLowerCase());
    }
    
    if (utilityType && utilityType !== 'All Utilities') {
      bills = bills.filter(bill => bill.site.utilityType === utilityType.toLowerCase());
    }

    return bills.sort((a, b) => new Date(b.generationDate).getTime() - new Date(a.generationDate).getTime());
  }

  async getBill(id: string): Promise<Bill | undefined> {
    return mockBills.find(bill => bill.id === id);
  }

  async createBill(billData: InsertBill): Promise<Bill> {
    const site = mockSites.find(s => s.id === billData.siteId);
    if (!site) throw new Error('Site not found');
    
    const newBill: Bill = {
      ...billData,
      id: `bill-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      site,
    };
    mockBills.push(newBill);
    return newBill;
  }

  async updateBill(id: string, billData: Partial<InsertBill>): Promise<Bill> {
    const billIndex = mockBills.findIndex(bill => bill.id === id);
    if (billIndex === -1) throw new Error('Bill not found');
    
    mockBills[billIndex] = {
      ...mockBills[billIndex],
      ...billData,
      updatedAt: new Date().toISOString(),
    };
    
    return mockBills[billIndex];
  }

  // Solar installations operations
  async getUserSolarInstallations(userId: string): Promise<SolarInstallation[]> {
    return mockSolarInstallations
      .filter(installation => installation.site.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createSolarInstallation(installationData: InsertSolarInstallation): Promise<SolarInstallation> {
    const site = mockSites.find(s => s.id === installationData.siteId);
    if (!site) throw new Error('Site not found');
    
    const newInstallation: SolarInstallation = {
      ...installationData,
      id: `solar-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      site,
    };
    mockSolarInstallations.push(newInstallation);
    return newInstallation;
  }

  // Smart meter installations operations
  async getUserSmartMeterInstallations(userId: string): Promise<SmartMeterInstallation[]> {
    return mockSmartMeterInstallations
      .filter(installation => installation.site.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createSmartMeterInstallation(installationData: InsertSmartMeterInstallation): Promise<SmartMeterInstallation> {
    const site = mockSites.find(s => s.id === installationData.siteId);
    if (!site) throw new Error('Site not found');
    
    const newInstallation: SmartMeterInstallation = {
      ...installationData,
      id: `smart-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      site,
    };
    mockSmartMeterInstallations.push(newInstallation);
    return newInstallation;
  }

  // Documents operations
  async getUserDocuments(userId: string, documentType?: string, postcode?: string): Promise<Document[]> {
    let documents = mockDocuments.filter(doc => doc.userId === userId);
    
    if (documentType && documentType !== 'All Types') {
      documents = documents.filter(doc => doc.documentType === documentType);
    }
    
    if (postcode) {
      documents = documents.filter(doc => doc.postcode && doc.postcode.toLowerCase().includes(postcode.toLowerCase()));
    }

    return documents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createDocument(documentData: InsertDocument): Promise<Document> {
    const newDocument: Document = {
      ...documentData,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDocuments.push(newDocument);
    return newDocument;
  }

  // HH Data operations
  async getUserHhData(userId: string): Promise<HhData[]> {
    return mockHhData
      .filter(data => data.site.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createHhData(hhDataInput: InsertHhData): Promise<HhData> {
    const site = mockSites.find(s => s.id === hhDataInput.siteId);
    if (!site) throw new Error('Site not found');
    
    const newHhData: HhData = {
      ...hhDataInput,
      id: `hh-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      site,
    };
    mockHhData.push(newHhData);
    return newHhData;
  }

  // Query operations
  async getUserQueries(userId: string, status?: string, priority?: string, queryType?: string): Promise<Query[]> {
    let queries = mockQueries.filter(query => query.userId === userId);
    
    if (status && status !== 'All Status') {
      queries = queries.filter(query => query.status === status.toLowerCase());
    }
    
    if (priority && priority !== 'All Priority') {
      queries = queries.filter(query => query.priority === priority.toLowerCase());
    }
    
    if (queryType && queryType !== 'All Types') {
      queries = queries.filter(query => query.queryType === queryType.toLowerCase().replace(' ', '_'));
    }
    
    return queries.sort((a, b) => new Date(b.raisedDate).getTime() - new Date(a.raisedDate).getTime());
  }

  async createQuery(queryData: InsertQuery): Promise<Query> {
    const site = mockSites.find(s => s.id === queryData.siteId);
    if (!site) throw new Error('Site not found');
    
    const now = new Date().toISOString();
    const newQuery: Query = {
      ...queryData,
      id: `query-${Date.now()}`,
      raisedDate: now,
      lastUpdated: now,
      status: 'open',
      site,
    };
    
    mockQueries.push(newQuery);
    return newQuery;
  }

  async updateQuery(id: string, queryData: Partial<InsertQuery>): Promise<Query> {
    const queryIndex = mockQueries.findIndex(query => query.id === id);
    if (queryIndex === -1) throw new Error('Query not found');
    
    mockQueries[queryIndex] = {
      ...mockQueries[queryIndex],
      ...queryData,
      lastUpdated: new Date().toISOString(),
    };
    
    return mockQueries[queryIndex];
  }

  // Meter reading operations
  async getMeterReadings(userId: string): Promise<MeterReading[]> {
    return mockMeterReadings
      .filter(reading => reading.site.userId === userId)
      .sort((a, b) => new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime());
  }

  // Solar project operations
  async getSolarProjects(userId: string): Promise<SolarProject[]> {
    return mockSolarProjects
      .filter(project => project.site.userId === userId)
      .sort((a, b) => new Date(b.installationDate).getTime() - new Date(a.installationDate).getTime());
  }

  // Carbon data operations
  async getCarbonData(userId: string): Promise<CarbonData[]> {
    return mockCarbonData
      .filter(data => data.userId === userId)
      .sort((a, b) => new Date(b.reportingPeriod).getTime() - new Date(a.reportingPeriod).getTime());
  }

  // Account statement operations
  async getAccountStatements(userId: string): Promise<AccountStatement[]> {
    return mockAccountStatements
      .filter(statement => statement.site.userId === userId)
      .sort((a, b) => new Date(b.statementDate).getTime() - new Date(a.statementDate).getTime());
  }

  // Smart meter rollout operations
  async getSmartMeterRollout(userId: string): Promise<SmartMeterRollout[]> {
    return mockSmartMeterRollout
      .filter(rollout => rollout.site.userId === userId)
      .sort((a, b) => {
        if (a.scheduledDate && b.scheduledDate) {
          return new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime();
        }
        return 0;
      });
  }

  // Analytics operations
  async getUserSiteStats(userId: string): Promise<{
    totalSites: number;
    activeMpans: number;
    monthlySpend: number;
    pendingBills: number;
    electricitySites: number;
    gasSites: number;
    waterSites: number;
    electricityPending: number;
    gasPending: number;
    waterPending: number;
    electricityObjections: number;
    gasObjections: number;
    waterObjections: number;
  }> {
    return calculateStats();
  }
}

export const storage = new MockStorage();

// Initialize dynamic sites data
initializeSites().catch(console.error);

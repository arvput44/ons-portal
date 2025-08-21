import {
  users,
  sites,
  bills,
  solarInstallations,
  smartMeterInstallations,
  documents,
  hhData,
  type User,
  type UpsertUser,
  type Site,
  type InsertSite,
  type Bill,
  type InsertBill,
  type SolarInstallation,
  type InsertSolarInstallation,
  type SmartMeterInstallation,
  type InsertSmartMeterInstallation,
  type Document,
  type InsertDocument,
  type HhData,
  type InsertHhData,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, ilike, or } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Sites operations
  async getUserSites(userId: string, utilityType?: string): Promise<Site[]> {
    let whereConditions = [eq(sites.userId, userId)];
    
    if (utilityType) {
      whereConditions.push(eq(sites.utilityType, utilityType));
    }
    
    return db.select().from(sites).where(and(...whereConditions)).orderBy(desc(sites.createdAt));
  }

  async getSite(id: string): Promise<Site | undefined> {
    const [site] = await db.select().from(sites).where(eq(sites.id, id));
    return site;
  }

  async createSite(site: InsertSite): Promise<Site> {
    const [newSite] = await db.insert(sites).values(site).returning();
    return newSite;
  }

  async updateSite(id: string, site: Partial<InsertSite>): Promise<Site> {
    const [updatedSite] = await db
      .update(sites)
      .set({ ...site, updatedAt: new Date() })
      .where(eq(sites.id, id))
      .returning();
    return updatedSite;
  }

  async searchSites(userId: string, searchTerm: string, utilityType?: string, status?: string): Promise<Site[]> {
    let whereConditions = [eq(sites.userId, userId)];
    
    if (searchTerm) {
      whereConditions.push(
        or(
          ilike(sites.mpanMprnSpid, `%${searchTerm}%`),
          ilike(sites.siteName, `%${searchTerm}%`),
          ilike(sites.siteAddress, `%${searchTerm}%`)
        )!
      );
    }
    
    if (utilityType && utilityType !== 'All Types') {
      whereConditions.push(eq(sites.utilityType, utilityType.toLowerCase()));
    }
    
    if (status && status !== 'All Statuses') {
      whereConditions.push(eq(sites.status, status.toLowerCase()));
    }

    return db.select().from(sites).where(and(...whereConditions)).orderBy(desc(sites.createdAt));
  }

  // Bills operations
  async getUserBills(userId: string, validationStatus?: string, month?: string, status?: string, utilityType?: string): Promise<(Bill & { site: Site })[]> {
    let whereConditions = [eq(sites.userId, userId)];
    
    if (validationStatus) {
      whereConditions.push(eq(bills.validationStatus, validationStatus));
    }
    
    if (month && month !== 'All Months') {
      // Extract month/year from the month parameter (e.g., "January 2024")
      const [monthName, year] = month.split(' ');
      const monthNumber = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
      whereConditions.push(
        sql`EXTRACT(MONTH FROM ${bills.generationDate}) = ${monthNumber} AND EXTRACT(YEAR FROM ${bills.generationDate}) = ${parseInt(year)}`
      );
    }
    
    if (status && status !== 'All Status') {
      whereConditions.push(eq(bills.status, status.toLowerCase()));
    }
    
    if (utilityType && utilityType !== 'All Utilities') {
      whereConditions.push(eq(sites.utilityType, utilityType.toLowerCase()));
    }

    const result = await db
      .select({
        id: bills.id,
        siteId: bills.siteId,
        mpanMprnSpid: bills.mpanMprnSpid,
        generationDate: bills.generationDate,
        billRefNo: bills.billRefNo,
        type: bills.type,
        fromDate: bills.fromDate,
        toDate: bills.toDate,
        dueDate: bills.dueDate,
        amount: bills.amount,
        vatPercentage: bills.vatPercentage,
        status: bills.status,
        validationStatus: bills.validationStatus,
        query: bills.query,
        billFilePath: bills.billFilePath,
        createdAt: bills.createdAt,
        updatedAt: bills.updatedAt,
        site: sites,
      })
      .from(bills)
      .innerJoin(sites, eq(bills.siteId, sites.id))
      .where(and(...whereConditions))
      .orderBy(desc(bills.generationDate));

    return result;
  }

  async getBill(id: string): Promise<Bill | undefined> {
    const [bill] = await db.select().from(bills).where(eq(bills.id, id));
    return bill;
  }

  async createBill(bill: InsertBill): Promise<Bill> {
    const [newBill] = await db.insert(bills).values(bill).returning();
    return newBill;
  }

  async updateBill(id: string, bill: Partial<InsertBill>): Promise<Bill> {
    const [updatedBill] = await db
      .update(bills)
      .set({ ...bill, updatedAt: new Date() })
      .where(eq(bills.id, id))
      .returning();
    return updatedBill;
  }

  // Solar installations operations
  async getUserSolarInstallations(userId: string): Promise<(SolarInstallation & { site: Site })[]> {
    const result = await db
      .select({
        id: solarInstallations.id,
        siteId: solarInstallations.siteId,
        siteAddress: solarInstallations.siteAddress,
        installationDate: solarInstallations.installationDate,
        status: solarInstallations.status,
        upcomingInstallation: solarInstallations.upcomingInstallation,
        createdAt: solarInstallations.createdAt,
        updatedAt: solarInstallations.updatedAt,
        site: sites,
      })
      .from(solarInstallations)
      .innerJoin(sites, eq(solarInstallations.siteId, sites.id))
      .where(eq(sites.userId, userId))
      .orderBy(desc(solarInstallations.createdAt));

    return result;
  }

  async createSolarInstallation(installation: InsertSolarInstallation): Promise<SolarInstallation> {
    const [newInstallation] = await db.insert(solarInstallations).values(installation).returning();
    return newInstallation;
  }

  // Smart meter installations operations
  async getUserSmartMeterInstallations(userId: string): Promise<(SmartMeterInstallation & { site: Site })[]> {
    const result = await db
      .select({
        id: smartMeterInstallations.id,
        siteId: smartMeterInstallations.siteId,
        mpanMprn: smartMeterInstallations.mpanMprn,
        fuel: smartMeterInstallations.fuel,
        mop: smartMeterInstallations.mop,
        jobId: smartMeterInstallations.jobId,
        status: smartMeterInstallations.status,
        installationDate: smartMeterInstallations.installationDate,
        createdAt: smartMeterInstallations.createdAt,
        updatedAt: smartMeterInstallations.updatedAt,
        site: sites,
      })
      .from(smartMeterInstallations)
      .innerJoin(sites, eq(smartMeterInstallations.siteId, sites.id))
      .where(eq(sites.userId, userId))
      .orderBy(desc(smartMeterInstallations.createdAt));

    return result;
  }

  async createSmartMeterInstallation(installation: InsertSmartMeterInstallation): Promise<SmartMeterInstallation> {
    const [newInstallation] = await db.insert(smartMeterInstallations).values(installation).returning();
    return newInstallation;
  }

  // Documents operations
  async getUserDocuments(userId: string, documentType?: string, postcode?: string): Promise<Document[]> {
    let whereConditions = [eq(documents.userId, userId)];
    
    if (documentType && documentType !== 'All Types') {
      whereConditions.push(eq(documents.documentType, documentType));
    }
    
    if (postcode) {
      whereConditions.push(ilike(documents.postcode, `%${postcode}%`));
    }

    return db.select().from(documents).where(and(...whereConditions)).orderBy(desc(documents.createdAt));
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db.insert(documents).values(document).returning();
    return newDocument;
  }

  // HH Data operations
  async getUserHhData(userId: string): Promise<(HhData & { site: Site })[]> {
    const result = await db
      .select({
        id: hhData.id,
        siteId: hhData.siteId,
        mpan: hhData.mpan,
        date: hhData.date,
        dataFilePath: hhData.dataFilePath,
        createdAt: hhData.createdAt,
        updatedAt: hhData.updatedAt,
        site: sites,
      })
      .from(hhData)
      .innerJoin(sites, eq(hhData.siteId, sites.id))
      .where(eq(sites.userId, userId))
      .orderBy(desc(hhData.date));

    return result;
  }

  async createHhData(hhDataInput: InsertHhData): Promise<HhData> {
    const [newHhData] = await db.insert(hhData).values(hhDataInput).returning();
    return newHhData;
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
    // Get total sites
    const totalSitesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sites)
      .where(eq(sites.userId, userId));
    const totalSites = totalSitesResult[0]?.count || 0;

    // Get active MPANs (registered sites)
    const activeMpansResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sites)
      .where(and(eq(sites.userId, userId), eq(sites.status, 'registered')));
    const activeMpans = activeMpansResult[0]?.count || 0;

    // Get monthly spend from bills
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const monthlySpendResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${bills.amount}), 0)` })
      .from(bills)
      .innerJoin(sites, eq(bills.siteId, sites.id))
      .where(
        and(
          eq(sites.userId, userId),
          sql`EXTRACT(MONTH FROM ${bills.generationDate}) = ${currentMonth}`,
          sql`EXTRACT(YEAR FROM ${bills.generationDate}) = ${currentYear}`,
          eq(bills.status, 'paid')
        )
      );
    const monthlySpend = Number(monthlySpendResult[0]?.total || 0);

    // Get pending bills
    const pendingBillsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bills)
      .innerJoin(sites, eq(bills.siteId, sites.id))
      .where(and(eq(sites.userId, userId), eq(bills.status, 'unpaid')));
    const pendingBills = pendingBillsResult[0]?.count || 0;

    // Get utility-specific stats
    const electricitySitesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sites)
      .where(and(eq(sites.userId, userId), eq(sites.utilityType, 'electricity'), eq(sites.status, 'registered')));
    const electricitySites = electricitySitesResult[0]?.count || 0;

    const gasSitesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sites)
      .where(and(eq(sites.userId, userId), eq(sites.utilityType, 'gas'), eq(sites.status, 'registered')));
    const gasSites = gasSitesResult[0]?.count || 0;

    const waterSitesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sites)
      .where(and(eq(sites.userId, userId), eq(sites.utilityType, 'water'), eq(sites.status, 'registered')));
    const waterSites = waterSitesResult[0]?.count || 0;

    // Get pending registrations
    const electricityPendingResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sites)
      .where(and(eq(sites.userId, userId), eq(sites.utilityType, 'electricity'), eq(sites.status, 'pending')));
    const electricityPending = electricityPendingResult[0]?.count || 0;

    const gasPendingResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sites)
      .where(and(eq(sites.userId, userId), eq(sites.utilityType, 'gas'), eq(sites.status, 'pending')));
    const gasPending = gasPendingResult[0]?.count || 0;

    const waterPendingResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sites)
      .where(and(eq(sites.userId, userId), eq(sites.utilityType, 'water'), eq(sites.status, 'pending')));
    const waterPending = waterPendingResult[0]?.count || 0;

    // Get objections
    const electricityObjectionsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sites)
      .where(and(eq(sites.userId, userId), eq(sites.utilityType, 'electricity'), eq(sites.status, 'objected')));
    const electricityObjections = electricityObjectionsResult[0]?.count || 0;

    const gasObjectionsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sites)
      .where(and(eq(sites.userId, userId), eq(sites.utilityType, 'gas'), eq(sites.status, 'objected')));
    const gasObjections = gasObjectionsResult[0]?.count || 0;

    const waterObjectionsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sites)
      .where(and(eq(sites.userId, userId), eq(sites.utilityType, 'water'), eq(sites.status, 'objected')));
    const waterObjections = waterObjectionsResult[0]?.count || 0;

    return {
      totalSites,
      activeMpans,
      monthlySpend,
      pendingBills,
      electricitySites,
      gasSites,
      waterSites,
      electricityPending,
      gasPending,
      waterPending,
      electricityObjections,
      gasObjections,
      waterObjections,
    };
  }
}

export const storage = new DatabaseStorage();

import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { MockSite } from './mockData.js';

// Cache for Excel data to avoid reading file on every request
interface CacheEntry {
  data: MockSite[];
  lastModified: number;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 30000; // 30 seconds cache TTL
const MAX_CACHE_SIZE = 5; // Maximum number of files to cache

/**
 * Reads sites data from Excel file and converts to MockSite format
 * @param excelFilePath - Path to the Excel file
 * @returns Promise<MockSite[]> - Array of sites
 */
export async function readSitesFromExcel(excelFilePath: string): Promise<MockSite[]> {
  try {
    // Check if file exists
    if (!fs.existsSync(excelFilePath)) {
      throw new Error(`Excel file not found: ${excelFilePath}`);
    }

    // Get file stats for cache invalidation
    const stats = fs.statSync(excelFilePath);
    const lastModified = stats.mtime.getTime();

    // Check cache first
    const cacheKey = excelFilePath;
    const cached = cache.get(cacheKey);
    
    if (cached && 
        cached.lastModified === lastModified && 
        (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log(`Using cached data for ${excelFilePath} (${cached.data.length} sites)`);
      return cached.data;
    }

    console.log(`Reading Excel file: ${excelFilePath}`);
    const startTime = Date.now();

    // Read Excel file
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1, // Use first row as header
      defval: '' // Default value for empty cells
    });

    if (rawData.length < 2) {
      throw new Error('Excel file must have at least a header row and one data row');
    }

    // Get headers from first row
    const headers = rawData[0] as string[];
    const dataRows = rawData.slice(1) as any[][];

    // Convert to MockSite format
    const sites: MockSite[] = dataRows.map((row, index) => {
      const site: MockSite = {
        id: getValue(row, headers, 'id') || `site-${index + 1}`,
        userId: getValue(row, headers, 'userId') || 'user-1',
        siteName: getValue(row, headers, 'siteName') || '',
        siteAddress: getValue(row, headers, 'siteAddress') || '',
        utilityType: getValue(row, headers, 'utilityType') || 'electricity',
        mpanMprnSpid: getValue(row, headers, 'mpanMprnSpid') || '',
        accountId: getValue(row, headers, 'accountId') || undefined,
        contractStartDate: getValue(row, headers, 'contractStartDate') || undefined,
        contractEndDate: getValue(row, headers, 'contractEndDate') || undefined,
        dayUnitRate: getValue(row, headers, 'dayUnitRate') || undefined,
        nightUnitRate: getValue(row, headers, 'nightUnitRate') || undefined,
        eveningUnitRate: getValue(row, headers, 'eveningUnitRate') || undefined,
        standingCharges: getValue(row, headers, 'standingCharges') || undefined,
        mopCharges: getValue(row, headers, 'mopCharges') || undefined,
        dcDaCharges: getValue(row, headers, 'dcDaCharges') || undefined,
        kvaCharges: getValue(row, headers, 'kvaCharges') || undefined,
        eac: getValue(row, headers, 'eac') ? parseInt(getValue(row, headers, 'eac')) : undefined,
        status: getValue(row, headers, 'status') || 'registered',
        supplier: getValue(row, headers, 'supplier') || undefined,
        createdAt: getValue(row, headers, 'createdAt') || new Date().toISOString(),
        updatedAt: getValue(row, headers, 'updatedAt') || new Date().toISOString()
      };
      return site;
    });

    const readTime = Date.now() - startTime;
    console.log(`Loaded ${sites.length} sites from Excel in ${readTime}ms`);

    // Cache the result
    cache.set(cacheKey, {
      data: sites,
      lastModified,
      timestamp: Date.now()
    });

    // Clean up cache if it gets too large
    if (cache.size > MAX_CACHE_SIZE) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    return sites;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw error;
  }
}

/**
 * Helper function to get value from row based on header
 */
function getValue(row: any[], headers: string[], headerName: string): string | undefined {
  const index = headers.findIndex(h => h.toLowerCase() === headerName.toLowerCase());
  if (index === -1 || index >= row.length) return undefined;
  const value = row[index];
  return value === '' || value === null || value === undefined ? undefined : String(value);
}

/**
 * Gets the default sites data - either from Excel or fallback to hardcoded
 * @param useLargeDataset - Whether to use the large dataset for testing
 * @returns Promise<MockSite[]> - Array of sites
 */
export async function getSitesData(useLargeDataset: boolean = false): Promise<MockSite[]> {
  try {
    const fileName = useLargeDataset ? 'sites-large.xlsx' : 'sites.xlsx';
    const excelPath = path.join(process.cwd(), 'data', fileName);
    
    // Check if Excel file exists
    if (fs.existsSync(excelPath)) {
      console.log(`Loading sites from Excel file: ${excelPath}`);
      return await readSitesFromExcel(excelPath);
    } else {
      console.log('Excel file not found, using fallback data');
      // Import the hardcoded data as fallback
      const { mockSites } = await import('./mockData.js');
      return mockSites;
    }
  } catch (error) {
    console.error('Error loading sites data:', error);
    // Fallback to hardcoded data
    const { mockSites } = await import('./mockData.js');
    return mockSites;
  }
}

/**
 * Clears the cache (useful for testing or manual cache invalidation)
 */
export function clearCache(): void {
  cache.clear();
  console.log('Excel data cache cleared');
}

/**
 * Gets cache statistics
 */
export function getCacheStats(): { size: number; entries: string[] } {
  return {
    size: cache.size,
    entries: Array.from(cache.keys())
  };
}

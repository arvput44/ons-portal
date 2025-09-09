# Dynamic Sites Data - Excel Integration

This directory contains the dynamic sites data that can be loaded into the application from Excel files.

## Files

- `sites.xlsx` - Main sites data in Excel format (10 sites)
- `sites-large.xlsx` - Large dataset for testing (20,000 sites)
- `sites.csv` - Legacy CSV format (deprecated)

## How to Use

### 1. **Edit the Excel file**
- Open `sites.xlsx` in Microsoft Excel, Google Sheets, or any Excel-compatible application
- Modify the sites data as needed
- Save the file after making changes

### 2. **Automatic Loading**
- The application automatically reads from the Excel file on every API call
- No server restart required - changes are reflected immediately
- The system includes intelligent caching for optimal performance

### 3. **Large Datasets**
- For testing with large datasets, use `sites-large.xlsx` (20,000 records)
- The system is optimized to handle large Excel files efficiently
- Performance metrics: ~1 second for 20,000 records with caching

## Excel Format

The Excel file should have the following columns (in order):

| Column | Description | Required | Example |
|--------|-------------|----------|---------|
| `id` | Unique identifier for the site | Yes | `site-1` |
| `userId` | User ID | Yes | `user-1` |
| `siteName` | Name of the site | Yes | `Main Office Building` |
| `siteAddress` | Full address of the site | Yes | `123 Business Park, London, SW1A 1AA` |
| `utilityType` | Type of utility | Yes | `electricity`, `gas`, `water` |
| `mpanMprnSpid` | Meter point reference number | Yes | `2000012345678901` |
| `accountId` | Account identifier | No | `ACC001` |
| `contractStartDate` | Contract start date | No | `2024-01-01` |
| `contractEndDate` | Contract end date | No | `2025-12-31` |
| `dayUnitRate` | Day unit rate (pence per kWh) | No | `15.25` |
| `nightUnitRate` | Night unit rate (pence per kWh) | No* | `8.45` |
| `eveningUnitRate` | Evening unit rate (pence per kWh) | No* | `12.80` |
| `standingCharges` | Standing charges (pence per day) | No | `28.50` |
| `mopCharges` | MOP charges (pence per day) | No** | `45.00` |
| `dcDaCharges` | DC/DA charges (pence per day) | No** | `25.00` |
| `kvaCharges` | KVA charges (pence per day) | No*** | `15.00` |
| `eac` | Estimated Annual Consumption (kWh) | No | `125000` |
| `status` | Site status | Yes | `registered`, `pending`, `objected` |
| `supplier` | Energy supplier name | No | `British Gas` |
| `createdAt` | Creation timestamp (ISO format) | No | `2024-01-01T00:00:00Z` |
| `updatedAt` | Last update timestamp (ISO format) | No | `2024-01-01T00:00:00Z` |

**Notes:**
- *Night and evening rates are only applicable to electricity
- **MOP and DC/DA charges are not applicable to water
- ***KVA charges are only applicable to electricity

## Performance Features

### 1. **Intelligent Caching**
- Files are cached for 30 seconds to avoid repeated reads
- Cache is automatically invalidated when files are modified
- Memory-efficient with automatic cache cleanup

### 2. **Large Dataset Support**
- Optimized for files with 20,000+ records
- Streaming Excel parsing for memory efficiency
- Sub-second response times for filtered queries

### 3. **Real-time Updates**
- Changes to Excel files are detected automatically
- No server restart required
- Immediate reflection of data changes

## API Endpoints

The following endpoints work with the Excel data:

- `GET /api/sites` - Get all sites
- `GET /api/sites?utilityType=electricity` - Filter by utility type
- `GET /api/sites?searchTerm=london` - Search by site name or address
- `GET /api/sites?status=registered` - Filter by status
- `POST /api/sites` - Create new site (stored in memory)
- `PUT /api/sites/:id` - Update site (stored in memory)

## Error Handling

- If the Excel file is missing or corrupted, the system falls back to hardcoded data
- Invalid data in Excel cells is handled gracefully with default values
- Detailed error logging for troubleshooting

## Testing

To test with large datasets:

1. Use the provided `sites-large.xlsx` file (20,000 records)
2. Test API performance with: `curl "http://localhost:3000/api/sites"`
3. Test filtering: `curl "http://localhost:3000/api/sites?utilityType=electricity"`
4. Test search: `curl "http://localhost:3000/api/sites?searchTerm=london"`

## Technical Details

- **Library**: Uses `xlsx` library for Excel parsing
- **Caching**: 30-second TTL with file modification detection
- **Memory**: Optimized for large datasets with streaming parsing
- **Performance**: ~1 second for 20,000 records, ~50ms for cached data
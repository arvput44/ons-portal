import { getSitesData } from '../shared/excelReader.js';

async function testPerformance() {
  console.log('Testing Excel reading performance...\n');
  
  // Test with regular dataset
  console.log('1. Testing with regular dataset (sites.xlsx):');
  const start1 = Date.now();
  const regularSites = await getSitesData(false);
  const time1 = Date.now() - start1;
  console.log(`   Loaded ${regularSites.length} sites in ${time1}ms`);
  console.log(`   Average: ${(time1 / regularSites.length * 1000).toFixed(2)}μs per site\n`);
  
  // Test with large dataset
  console.log('2. Testing with large dataset (sites-large.xlsx):');
  const start2 = Date.now();
  const largeSites = await getSitesData(true);
  const time2 = Date.now() - start2;
  console.log(`   Loaded ${largeSites.length} sites in ${time2}ms`);
  console.log(`   Average: ${(time2 / largeSites.length * 1000).toFixed(2)}μs per site\n`);
  
  // Test caching performance
  console.log('3. Testing cache performance (second read):');
  const start3 = Date.now();
  const cachedSites = await getSitesData(true);
  const time3 = Date.now() - start3;
  console.log(`   Loaded ${cachedSites.length} sites in ${time3}ms (cached)`);
  console.log(`   Cache speedup: ${(time2 / time3).toFixed(2)}x faster\n`);
  
  // Test filtering performance
  console.log('4. Testing filtering performance:');
  const start4 = Date.now();
  const electricitySites = largeSites.filter(site => site.utilityType === 'electricity');
  const time4 = Date.now() - start4;
  console.log(`   Filtered ${electricitySites.length} electricity sites in ${time4}ms`);
  
  const start5 = Date.now();
  const searchResults = largeSites.filter(site => 
    site.siteName.toLowerCase().includes('london') || 
    site.siteAddress.toLowerCase().includes('london')
  );
  const time5 = Date.now() - start5;
  console.log(`   Search found ${searchResults.length} London sites in ${time5}ms\n`);
  
  console.log('Performance test completed!');
}

testPerformance().catch(console.error);

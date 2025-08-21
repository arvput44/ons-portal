import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Zap, Search, Download, Activity, Gauge, Calendar, FileText, Clock } from "lucide-react";

interface MeterReading {
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
  site: {
    id: string;
    siteName: string;
    siteAddress: string;
    utilityType: string;
    supplier?: string;
  };
}

export default function MeterInfoTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [utilityFilter, setUtilityFilter] = useState("All Utilities");
  const [readingTypeFilter, setReadingTypeFilter] = useState("All Types");

  // Fetch meter readings
  const { data: meterReadings = [], isLoading } = useQuery<MeterReading[]>({
    queryKey: ["/api/meter-readings"],
  });

  const getReadingTypeColor = (type: string) => {
    switch (type) {
      case "actual":
        return "default";
      case "estimated":
        return "secondary";
      case "customer":
        return "outline";
      default:
        return "outline";
    }
  };

  const getUtilityIcon = (type: string) => {
    switch (type) {
      case "electricity":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case "gas":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "water":
        return <Gauge className="h-4 w-4 text-cyan-500" />;
      default:
        return <Gauge className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatReading = (reading: number, utilityType: string) => {
    switch (utilityType) {
      case "electricity":
        return `${reading.toLocaleString()} kWh`;
      case "gas":
        return `${reading.toLocaleString()} kWh`;
      case "water":
        return `${reading.toLocaleString()} m³`;
      default:
        return reading.toLocaleString();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredReadings = meterReadings.filter((reading: MeterReading) => {
    const matchesSearch = searchTerm === "" || 
      reading.site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.mpanMprnSpid.includes(searchTerm) ||
      reading.meterSerial.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUtility = utilityFilter === "All Utilities" || 
      reading.utilityType === utilityFilter.toLowerCase();
    
    const matchesType = readingTypeFilter === "All Types" || 
      reading.readingType === readingTypeFilter.toLowerCase();
    
    return matchesSearch && matchesUtility && matchesType;
  });

  // Calculate stats
  const totalMeters = meterReadings.length;
  const smartMeters = meterReadings.filter(r => r.readingSource === 'smart_meter').length;
  const estimatedReadings = meterReadings.filter(r => r.readingType === 'estimated').length;
  const totalConsumption = meterReadings.reduce((sum, r) => sum + r.consumption, 0);
  const hhMeters = meterReadings.filter(r => r.readingSource === 'smart_meter').length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900" data-testid="meter-info-header">Meter Information</h2>
        <p className="text-gray-600" data-testid="meter-info-description">
          View and manage meter readings across all utility types
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Meters</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-total-meters">{totalMeters}</p>
              </div>
              <Gauge className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Smart Meters</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-smart-meters">{smartMeters}</p>
              </div>
              <Zap className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estimated Readings</p>
                <p className="text-2xl font-bold text-orange-600" data-testid="stat-estimated">{estimatedReadings}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Consumption</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="stat-consumption">
                  {totalConsumption.toLocaleString()}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">HH Meters</p>
                <p className="text-2xl font-bold text-purple-600" data-testid="stat-hh-meters">{hhMeters}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by site, MPAN/MPRN/SPID, or meter serial..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-meter-search"
                />
              </div>
            </div>
            
            <Select value={utilityFilter} onValueChange={setUtilityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Utilities">All Utilities</SelectItem>
                <SelectItem value="Electricity">Electricity</SelectItem>
                <SelectItem value="Gas">Gas</SelectItem>
                <SelectItem value="Water">Water</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={readingTypeFilter} onValueChange={setReadingTypeFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Actual">Actual</SelectItem>
                <SelectItem value="Estimated">Estimated</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Meter Readings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Recent Meter Readings
          </CardTitle>
          <CardDescription>
            Latest meter readings from all utility types
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReadings.length === 0 ? (
            <div className="text-center py-8">
              <Gauge className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No meter readings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-600">Site</th>
                    <th className="text-left p-3 font-medium text-gray-600">Utility</th>
                    <th className="text-left p-3 font-medium text-gray-600">MPAN/MPRN/SPID</th>
                    <th className="text-left p-3 font-medium text-gray-600">Meter Serial</th>
                    <th className="text-left p-3 font-medium text-gray-600">Reading Date</th>
                    <th className="text-left p-3 font-medium text-gray-600">Type</th>
                    <th className="text-left p-3 font-medium text-gray-600">Previous</th>
                    <th className="text-left p-3 font-medium text-gray-600">Current</th>
                    <th className="text-left p-3 font-medium text-gray-600">Consumption</th>
                    <th className="text-left p-3 font-medium text-gray-600">Source</th>
                    <th className="text-left p-3 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReadings.map((reading: MeterReading) => (
                    <tr 
                      key={reading.id} 
                      className="border-b hover:bg-gray-50"
                      data-testid={`meter-reading-${reading.id}`}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getUtilityIcon(reading.utilityType)}
                          <span className="font-medium">{reading.site.siteName}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {reading.utilityType.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-3 font-medium">{reading.mpanMprnSpid}</td>
                      <td className="p-3 font-medium">{reading.meterSerial}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(reading.readingDate)}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant={getReadingTypeColor(reading.readingType)}>
                          {reading.readingType.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-3 font-medium">{formatReading(reading.previousReading, reading.utilityType)}</td>
                      <td className="p-3 font-medium">{formatReading(reading.currentReading, reading.utilityType)}</td>
                      <td className="p-3 font-medium text-blue-600">{formatReading(reading.consumption, reading.utilityType)}</td>
                      <td className="p-3">{reading.readingSource.replace('_', ' ')}</td>
                      <td className="p-3">
                        {reading.filePath && (
                          <Button variant="outline" size="sm" data-testid={`download-reading-${reading.id}`}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meter File Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Meter Reading Files
          </CardTitle>
          <CardDescription>
            Manage and download meter reading documentation and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Electricity Readings</h4>
              <p className="text-sm text-gray-600 mb-3">
                {meterReadings.filter(r => r.utilityType === 'electricity').length} files available
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Gas Readings</h4>
              <p className="text-sm text-gray-600 mb-3">
                {meterReadings.filter(r => r.utilityType === 'gas').length} files available
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Water Readings</h4>
              <p className="text-sm text-gray-600 mb-3">
                {meterReadings.filter(r => r.utilityType === 'water').length} files available
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
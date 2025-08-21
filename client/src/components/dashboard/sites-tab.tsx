import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import type { Site } from "@shared/schema";

export default function SitesTab() {
  const [filters, setFilters] = useState({
    utilityType: "All Types",
    status: "All Statuses",
    searchTerm: "",
  });

  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ["/api/sites", filters.utilityType !== "All Types" ? filters.utilityType : undefined],
  });

  const filteredSites = sites.filter((site) => {
    const matchesUtility = filters.utilityType === "All Types" || site.utilityType === filters.utilityType.toLowerCase();
    const matchesStatus = filters.status === "All Statuses" || site.status === filters.status.toLowerCase();
    const matchesSearch = !filters.searchTerm || 
      site.mpanMprnSpid.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      site.siteName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      site.siteAddress.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesUtility && matchesStatus && matchesSearch;
  });

  const handleSearch = () => {
    // Trigger search - in a real app, this might trigger a new API call
    console.log("Searching with filters:", filters);
  };

  const handleRowAction = (action: string, site: Site) => {
    if (action === 'view') {
      console.log("View site:", site);
    } else if (action === 'download') {
      console.log("Download site data:", site);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      registered: { variant: "default" as const, className: "bg-green-100 text-green-800" },
      pending: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" },
      objected: { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns = [
    {
      key: "mpanMprnSpid" as keyof Site,
      header: "MPAN/MPRN",
      cell: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "siteName" as keyof Site,
      header: "Site Name",
    },
    {
      key: "siteAddress" as keyof Site,
      header: "Address",
      cell: (value: string) => <span className="max-w-xs truncate">{value}</span>,
    },
    {
      key: "contractStartDate" as keyof Site,
      header: "Contract Dates",
      cell: (_: any, row: Site) => {
        if (!row.contractStartDate || !row.contractEndDate) return "-";
        return `${new Date(row.contractStartDate).toLocaleDateString()} - ${new Date(row.contractEndDate).toLocaleDateString()}`;
      },
    },
    {
      key: "dayUnitRate" as keyof Site,
      header: "Unit Rate",
      cell: (value: string) => value ? `${value}p/kWh` : "-",
    },
    {
      key: "status" as keyof Site,
      header: "Status",
      cell: (value: string) => getStatusBadge(value),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" data-testid="sites-title">Site Management</h2>
        <p className="text-gray-600" data-testid="sites-subtitle">Manage and monitor all your registered sites</p>
      </div>

      {/* Filters */}
      <Card className="border border-gray-100">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="utilityType" className="block text-sm font-medium text-gray-700 mb-2">
                Utility Type
              </Label>
              <Select value={filters.utilityType} onValueChange={(value) => setFilters({...filters, utilityType: value})}>
                <SelectTrigger data-testid="select-utility-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="Electricity">Electricity</SelectItem>
                  <SelectItem value="Gas">Gas</SelectItem>
                  <SelectItem value="Water">Water</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Statuses">All Statuses</SelectItem>
                  <SelectItem value="Registered">Registered</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Objected">Objected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Sites
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="Search by MPAN, site name..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                data-testid="input-search-sites"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                className="w-full bg-energy-blue text-white hover:bg-blue-700"
                data-testid="button-search-sites"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sites Table */}
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Registered Sites</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={filteredSites}
            columns={columns}
            onRowAction={handleRowAction}
            loading={isLoading}
            totalResults={filteredSites.length}
            data-testid="sites-table"
          />
        </CardContent>
      </Card>
    </div>
  );
}

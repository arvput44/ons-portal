import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Site } from "@shared/schema";

export default function SitesTab() {
  const [filters, setFilters] = useState({
    utilityType: "All Types",
    status: "All Statuses",
    searchTerm: "",
  });
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);

  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ["/api/sites", { utilityType: filters.utilityType }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.utilityType !== "All Types") {
        params.append('utilityType', filters.utilityType);
      }
      const url = `http://localhost:4000/api/sites?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch sites');
      }
      const data = await response.json();
      return data;
    },
  });

  const filteredSites = sites.filter((site) => {
    // Only filter by status and search term on the client side
    // Utility type filtering is handled by the server
    const matchesStatus = filters.status === "All Statuses" || 
      site.status.toLowerCase() === filters.status.toLowerCase();
    const matchesSearch = !filters.searchTerm || 
      site.mpanMprnSpid.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      site.siteName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      site.siteAddress.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
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
    } else if (action === 'contract') {
      setSelectedSite(site);
      setContractDialogOpen(true);
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
      header: "MPAN/MPRN/SPID",
      cell: (value: string) => <span className="font-medium text-sm">{value}</span>,
    },
    {
      key: "siteName" as keyof Site,
      header: "Site Name",
      cell: (value: string) => <span className="font-medium text-sm">{value}</span>,
    },
    {
      key: "utilityType" as keyof Site,
      header: "Utility Type",
      cell: (value: string) => (
        <Badge variant="outline" className="text-xs">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "dayUnitRate" as keyof Site,
      header: "All/Day Unit Rate (p/kWh)",
      cell: (value: string) => value ? `${value}p` : "-",
    },
    {
      key: "nightUnitRate" as keyof Site,
      header: "Night Rate (p/kWh)",
      cell: (value: string) => value ? `${value}p` : "-",
    },
    {
      key: "eveningUnitRate" as keyof Site,
      header: "Eve & Wknd (p/kWh)",
      cell: (value: string) => value ? `${value}p` : "-",
    },
    {
      key: "standingCharges" as keyof Site,
      header: "Standing Charge/Meter Charge (p/day)",
      cell: (value: string) => value ? `${value}p` : "-",
    },
    {
      key: "eac" as keyof Site,
      header: "Estimated Annual Cost",
      cell: (value: number) => value ? `£${(value * 0.15).toLocaleString()}` : "-",
    },
    {
      key: "kvaCharges" as keyof Site,
      header: "KVA Capacity Charges (p/kva/day)",
      cell: (value: string) => value ? `${value}p` : "-",
    },
    {
      key: "mopCharges" as keyof Site,
      header: "Meter Operator Charges",
      cell: (value: string) => value ? `${value}p` : "-",
    },
    {
      key: "dcDaCharges" as keyof Site,
      header: "Data Collection/Data Aggregator Charges",
      cell: (value: string) => value ? `${value}p` : "-",
    },
    {
      key: "status" as keyof Site,
      header: "Status",
      cell: (value: string) => getStatusBadge(value),
    },
    {
      key: "actions" as keyof Site,
      header: "Actions",
      cell: (_: any, row: Site) => (
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRowAction('view', row)}
            className="text-energy-blue hover:text-blue-700 p-1 h-8 w-8"
            data-testid={`button-view-${row.id}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRowAction('contract', row)}
            className="text-green-600 hover:text-green-700 p-1 h-8 w-8"
            data-testid={`button-contract-${row.id}`}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRowAction('download', row)}
            className="text-gray-400 hover:text-gray-600 p-1 h-8 w-8"
            data-testid={`button-download-${row.id}`}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
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
      <Card className="border border-gray-100 max-w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Site Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0 max-w-full overflow-hidden">
          <DataTable
            data={filteredSites}
            columns={columns}
            loading={isLoading}
            totalResults={filteredSites.length}
            data-testid="sites-table"
          />
        </CardContent>
      </Card>

      {/* Contract Management Dialog */}
      <Dialog open={contractDialogOpen} onOpenChange={setContractDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contract Management - {selectedSite?.siteName}</DialogTitle>
          </DialogHeader>
          {selectedSite && (
            <div className="space-y-6">
              {/* Site Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Site Details</h4>
                  <p className="text-sm text-gray-600"><strong>MPAN/MPRN:</strong> {selectedSite.mpanMprnSpid}</p>
                  <p className="text-sm text-gray-600"><strong>Address:</strong> {selectedSite.siteAddress}</p>
                  <p className="text-sm text-gray-600"><strong>Utility Type:</strong> {selectedSite.utilityType}</p>
                  <p className="text-sm text-gray-600"><strong>Supplier:</strong> {selectedSite.supplier || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contract Information</h4>
                  <p className="text-sm text-gray-600"><strong>Start Date:</strong> {selectedSite.contractStartDate || 'N/A'}</p>
                  <p className="text-sm text-gray-600"><strong>End Date:</strong> {selectedSite.contractEndDate || 'N/A'}</p>
                  <p className="text-sm text-gray-600"><strong>Account ID:</strong> {selectedSite.accountId || 'N/A'}</p>
                  <p className="text-sm text-gray-600"><strong>Status:</strong> {getStatusBadge(selectedSite.status)}</p>
                </div>
              </div>

              {/* Contract Documents */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Contract Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h5 className="font-medium text-gray-900">Contract Agreement</h5>
                        <p className="text-sm text-gray-500">Main contract document</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <h5 className="font-medium text-gray-900">Terms & Conditions</h5>
                        <p className="text-sm text-gray-500">Contract terms and conditions</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-purple-600" />
                      <div>
                        <h5 className="font-medium text-gray-900">DD Mandate</h5>
                        <p className="text-sm text-gray-500">Direct debit mandate form</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-orange-600" />
                      <div>
                        <h5 className="font-medium text-gray-900">VAT Form</h5>
                        <p className="text-sm text-gray-500">VAT registration form</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setContractDialogOpen(false)}>
                  Close
                </Button>
                <Button className="bg-energy-blue text-white hover:bg-blue-700">
                  Upload New Document
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

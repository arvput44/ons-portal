import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, AlertTriangle, Clock, Filter, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import type { Bill, Site } from "@shared/schema";

type BillWithSite = Bill & { site: Site };

export default function BillingTab() {
  const [activeTab, setActiveTab] = useState("validated");
  const [filters, setFilters] = useState({
    month: "All Months",
    status: "All Status",
    utilityType: "All Utilities",
    mpanSearch: "",
  });

  const { data: validatedBills = [], isLoading: loadingValidated } = useQuery<BillWithSite[]>({
    queryKey: ["/api/bills", "validated", filters.month, filters.status, filters.utilityType],
  });

  const { data: incorrectBills = [], isLoading: loadingIncorrect } = useQuery<BillWithSite[]>({
    queryKey: ["/api/bills", "incorrect", filters.month, filters.status, filters.utilityType],
  });

  // Calculate stats
  const totalValidated = validatedBills.length;
  const totalIncorrect = incorrectBills.length;
  const outstanding = [...validatedBills, ...incorrectBills]
    .filter(bill => bill.status === 'unpaid')
    .reduce((sum, bill) => sum + Number(bill.amount), 0);

  const applyFilter = () => {
    console.log("Applying filters:", filters);
  };

  const handleRowAction = (action: string, bill: BillWithSite) => {
    if (action === 'view') {
      console.log("View bill:", bill);
    } else if (action === 'download') {
      console.log("Download bill:", bill);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      paid: { className: "bg-green-100 text-green-800" },
      unpaid: { className: "bg-red-100 text-red-800" },
      overdue: { className: "bg-orange-100 text-orange-800" },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap.unpaid;
    
    return (
      <Badge className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const baseColumns = [
    {
      key: "mpanMprnSpid" as keyof BillWithSite,
      header: "MPAN",
      cell: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "generationDate" as keyof BillWithSite,
      header: "Generation Date",
      cell: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "billRefNo" as keyof BillWithSite,
      header: "Bill Ref No.",
    },
    {
      key: "type" as keyof BillWithSite,
      header: "Type",
      cell: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    {
      key: "fromDate" as keyof BillWithSite,
      header: "Period",
      cell: (_: any, row: BillWithSite) => 
        `${new Date(row.fromDate).toLocaleDateString()} to ${new Date(row.toDate).toLocaleDateString()}`,
    },
    {
      key: "dueDate" as keyof BillWithSite,
      header: "Due Date",
      cell: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "amount" as keyof BillWithSite,
      header: "Amount (£)",
      cell: (value: string) => `£${Number(value).toLocaleString()}`,
    },
    {
      key: "status" as keyof BillWithSite,
      header: "Status",
      cell: (value: string) => getStatusBadge(value),
    },
    {
      key: "vatPercentage" as keyof BillWithSite,
      header: "VAT",
      cell: (value: string) => value ? `${value}%` : "-",
    },
  ];

  const incorrectColumns = [
    ...baseColumns,
    {
      key: "query" as keyof BillWithSite,
      header: "Query",
      cell: (value: string) => (
        <span className="text-red-600 font-medium">{value || "Issue identified"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" data-testid="billing-title">Bill Validation</h2>
        <p className="text-gray-600" data-testid="billing-subtitle">Accurate bill validation and invoice management</p>
      </div>

      {/* Bill Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Validated</p>
                <p className="text-3xl font-bold text-green-600" data-testid="stat-validated">{totalValidated}</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Incorrect Bills</p>
                <p className="text-3xl font-bold text-red-600" data-testid="stat-incorrect">{totalIncorrect}</p>
                <p className="text-sm text-gray-500">Require attention</p>
              </div>
              <div className="bg-red-100 text-red-600 w-12 h-12 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-3xl font-bold text-orange-600" data-testid="stat-outstanding">£{outstanding.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total amount</p>
              </div>
              <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bill Tabs */}
      <Card className="border border-gray-100">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="validated" className="flex items-center" data-testid="tab-validated">
              <CheckCircle className="h-4 w-4 mr-2" />
              Total Validated Invoices
            </TabsTrigger>
            <TabsTrigger value="incorrect" className="flex items-center" data-testid="tab-incorrect">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Incorrect Invoices
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Month</Label>
                <Select value={filters.month} onValueChange={(value) => setFilters({...filters, month: value})}>
                  <SelectTrigger data-testid="select-month">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Months">All Months</SelectItem>
                    <SelectItem value="January 2024">January 2024</SelectItem>
                    <SelectItem value="February 2024">February 2024</SelectItem>
                    <SelectItem value="March 2024">March 2024</SelectItem>
                    <SelectItem value="April 2024">April 2024</SelectItem>
                    <SelectItem value="May 2024">May 2024</SelectItem>
                    <SelectItem value="June 2024">June 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger data-testid="select-bill-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Status">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Utility</Label>
                <Select value={filters.utilityType} onValueChange={(value) => setFilters({...filters, utilityType: value})}>
                  <SelectTrigger data-testid="select-utility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Utilities">All Utilities</SelectItem>
                    <SelectItem value="Electricity">Electricity</SelectItem>
                    <SelectItem value="Gas">Gas</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">MPAN Search</Label>
                <Input
                  type="text"
                  placeholder="Search MPAN..."
                  value={filters.mpanSearch}
                  onChange={(e) => setFilters({...filters, mpanSearch: e.target.value})}
                  data-testid="input-mpan-search"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={applyFilter}
                  className="w-full bg-energy-blue text-white hover:bg-blue-700"
                  data-testid="button-apply-filter"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filter
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="validated" className="p-0">
            <DataTable
              data={validatedBills}
              columns={baseColumns}
              onRowAction={handleRowAction}
              loading={loadingValidated}
              totalResults={validatedBills.length}
              data-testid="validated-bills-table"
            />
          </TabsContent>

          <TabsContent value="incorrect" className="p-0">
            <DataTable
              data={incorrectBills}
              columns={incorrectColumns}
              onRowAction={(action, bill) => {
                if (action === 'download') {
                  console.log("Download incorrect bill:", bill);
                } else {
                  console.log("Edit query for bill:", bill);
                }
              }}
              loading={loadingIncorrect}
              totalResults={incorrectBills.length}
              data-testid="incorrect-bills-table"
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

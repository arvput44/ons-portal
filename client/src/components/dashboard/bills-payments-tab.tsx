import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CreditCard, Search, Download, FileText, TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface AccountStatement {
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
  site: {
    id: string;
    siteName: string;
    siteAddress: string;
    utilityType: string;
    supplier?: string;
  };
}

interface Invoice {
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
  billFilePath?: string;
  site: {
    siteName: string;
    utilityType: string;
    supplier?: string;
  };
}

export default function BillsPaymentsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [utilityFilter, setUtilityFilter] = useState("All Utilities");
  const [monthFilter, setMonthFilter] = useState("All Months");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [viewType, setViewType] = useState("statements");

  // Fetch account statements
  const { data: statements = [], isLoading: statementsLoading } = useQuery<AccountStatement[]>({
    queryKey: ["/api/account-statements"],
  });

  // Fetch invoices/bills
  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/bills", "validated", monthFilter, statusFilter, utilityFilter],
  });

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-red-600"; // Debit balance (owe money)
    if (balance < 0) return "text-green-600"; // Credit balance (in credit)
    return "text-gray-600"; // Zero balance
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "unpaid":
        return "destructive";
      case "overdue":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getUtilityIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "electricity":
        return <span className={`${iconClass} text-yellow-500`}>⚡</span>;
      case "gas":
        return <span className={`${iconClass} text-blue-500`}>🔥</span>;
      case "water":
        return <span className={`${iconClass} text-cyan-500`}>💧</span>;
      default:
        return <span className={`${iconClass} text-gray-500`}>📊</span>;
    }
  };

  const filteredStatements = statements.filter((statement: AccountStatement) => {
    const matchesSearch = searchTerm === "" || 
      statement.site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statement.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUtility = utilityFilter === "All Utilities" || 
      statement.utilityType === utilityFilter.toLowerCase();
    
    const matchesMonth = monthFilter === "All Months" || 
      statement.statementPeriod.includes(monthFilter);
    
    return matchesSearch && matchesUtility && matchesMonth;
  });

  const filteredInvoices = invoices.filter((invoice: Invoice) => {
    const matchesSearch = searchTerm === "" || 
      invoice.site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.billRefNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUtility = utilityFilter === "All Utilities" || 
      invoice.site.utilityType === utilityFilter.toLowerCase();
    
    const matchesStatus = statusFilter === "All Status" || 
      invoice.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesUtility && matchesStatus;
  });

  // Calculate summary stats
  const totalOutstanding = statements.reduce((sum, stmt) => sum + Math.max(0, stmt.closingBalance), 0);
  const totalCredit = Math.abs(statements.reduce((sum, stmt) => sum + Math.min(0, stmt.closingBalance), 0));
  const monthlyCharges = statements.reduce((sum, stmt) => sum + stmt.totalCharges, 0);
  const monthlyPayments = statements.reduce((sum, stmt) => sum + stmt.totalPayments, 0);

  const isLoading = statementsLoading || invoicesLoading;

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
        <h2 className="text-2xl font-bold text-gray-900" data-testid="bills-payments-header">Bills & Payments</h2>
        <p className="text-gray-600" data-testid="bills-payments-description">
          Manage account statements, invoices, and payment tracking across all utilities
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-red-600" data-testid="stat-outstanding">
                  {formatCurrency(totalOutstanding)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Credit Balance</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-credit">
                  {formatCurrency(totalCredit)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Charges</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="stat-charges">
                  {formatCurrency(monthlyCharges)}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Payments</p>
                <p className="text-2xl font-bold text-purple-600" data-testid="stat-payments">
                  {formatCurrency(monthlyPayments)}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="statements">Account Statements</SelectItem>
                <SelectItem value="invoices">Individual Invoices</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={viewType === "statements" ? "Search accounts..." : "Search invoices..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-bills-search"
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
            
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Months">All Months</SelectItem>
                <SelectItem value="July 2024">July 2024</SelectItem>
                <SelectItem value="June 2024">June 2024</SelectItem>
                <SelectItem value="May 2024">May 2024</SelectItem>
              </SelectContent>
            </Select>
            
            {viewType === "invoices" && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Statements View */}
      {viewType === "statements" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Account Statements
            </CardTitle>
            <CardDescription>
              Monthly account statements showing charges, payments, and balances
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStatements.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No account statements found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStatements.map((statement: AccountStatement) => (
                  <div 
                    key={statement.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50"
                    data-testid={`statement-${statement.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getUtilityIcon(statement.utilityType)}
                          <h3 className="font-semibold text-gray-900">{statement.site.siteName}</h3>
                          <Badge variant="outline">
                            {statement.utilityType.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {statement.statementPeriod}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Account Number</p>
                            <p className="font-medium">{statement.accountNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Opening Balance</p>
                            <p className={`font-medium ${getBalanceColor(statement.openingBalance)}`}>
                              {statement.openingBalance >= 0 ? formatCurrency(statement.openingBalance) : `(${formatCurrency(statement.openingBalance)})`}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total Charges</p>
                            <p className="font-medium">{formatCurrency(statement.totalCharges)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Payments</p>
                            <p className="font-medium text-green-600">{formatCurrency(statement.totalPayments)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Closing Balance</p>
                            <p className={`font-bold ${getBalanceColor(statement.closingBalance)}`}>
                              {statement.closingBalance >= 0 ? formatCurrency(statement.closingBalance) : `(${formatCurrency(statement.closingBalance)})`}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="ml-4" data-testid={`download-statement-${statement.id}`}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Individual Invoices View */}
      {viewType === "invoices" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Individual Invoices
            </CardTitle>
            <CardDescription>
              Detailed view of individual utility invoices and bills
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No invoices found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInvoices.map((invoice: Invoice) => (
                  <div 
                    key={invoice.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50"
                    data-testid={`invoice-${invoice.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getUtilityIcon(invoice.site.utilityType)}
                          <h3 className="font-semibold text-gray-900">{invoice.site.siteName}</h3>
                          <Badge variant={getStatusColor(invoice.status)}>
                            {invoice.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {invoice.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="font-bold text-lg">{formatCurrency(parseFloat(invoice.amount))}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Invoice Reference</p>
                            <p className="font-medium">{invoice.billRefNo}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Billing Period</p>
                            <p className="font-medium">
                              {formatDate(invoice.fromDate)} - {formatDate(invoice.toDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Due Date</p>
                            <p className="font-medium flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(invoice.dueDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Supplier</p>
                            <p className="font-medium">{invoice.site.supplier || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="ml-4" data-testid={`download-invoice-${invoice.id}`}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Utility Type Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['electricity', 'gas', 'water'].map((utility) => {
          const utilityStatements = statements.filter(s => s.utilityType === utility);
          const totalBalance = utilityStatements.reduce((sum, s) => sum + s.closingBalance, 0);
          const totalCharges = utilityStatements.reduce((sum, s) => sum + s.totalCharges, 0);
          
          return (
            <Card key={utility}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getUtilityIcon(utility)}
                  <h3 className="font-semibold capitalize">{utility}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Accounts:</span>
                    <span className="font-medium">{utilityStatements.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Charges:</span>
                    <span className="font-medium">{formatCurrency(totalCharges)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Balance:</span>
                    <span className={`font-bold ${getBalanceColor(totalBalance)}`}>
                      {totalBalance >= 0 ? formatCurrency(totalBalance) : `(${formatCurrency(totalBalance)})`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
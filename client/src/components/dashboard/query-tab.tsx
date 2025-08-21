import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Filter, Clock, AlertCircle, CheckCircle, AlertTriangle, MessageSquare } from "lucide-react";

interface Query {
  id: string;
  userId: string;
  siteId?: string;
  billId?: string;
  queryType: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  raisedDate: string;
  lastUpdated: string;
  assignedTo?: string;
  resolution?: string;
  site?: {
    id: string;
    siteName: string;
    siteAddress: string;
    utilityType: string;
    mpanMprnSpid: string;
  };
}

interface Site {
  id: string;
  siteName: string;
  siteAddress: string;
  utilityType: string;
  mpanMprnSpid: string;
}

export default function QueryTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [isRaiseQueryOpen, setIsRaiseQueryOpen] = useState(false);
  const [newQuery, setNewQuery] = useState({
    siteId: "",
    queryType: "",
    title: "",
    description: "",
    priority: "medium"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch queries
  const { data: queries = [], isLoading: queriesLoading } = useQuery<Query[]>({
    queryKey: ["/api/queries", statusFilter, priorityFilter, typeFilter, searchTerm],
  });

  // Fetch sites for dropdown
  const { data: sites = [] } = useQuery<Site[]>({
    queryKey: ["/api/sites"],
  });

  // Create query mutation
  const createQueryMutation = useMutation({
    mutationFn: async (queryData: any) => {
      const response = await fetch("/api/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryData),
      });
      if (!response.ok) throw new Error('Failed to create query');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/queries"] });
      setIsRaiseQueryOpen(false);
      setNewQuery({ siteId: "", queryType: "", title: "", description: "", priority: "medium" });
      toast({
        title: "Success",
        description: "Query raised successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "escalated":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive";
      case "in_progress":
        return "default";
      case "escalated":
        return "secondary";
      case "resolved":
        return "outline";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredQueries = (queries as Query[]).filter((query: Query) => {
    const matchesSearch = searchTerm === "" || 
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.site?.siteName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All Status" || query.status === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === "All Priority" || query.priority === priorityFilter.toLowerCase();
    const matchesType = typeFilter === "All Types" || query.queryType === typeFilter.toLowerCase().replace(" ", "_");
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const ongoingQueries = filteredQueries.filter((q: Query) => q.status !== 'resolved');
  const resolvedQueries = filteredQueries.filter((q: Query) => q.status === 'resolved');

  const handleRaiseQuery = () => {
    if (!newQuery.siteId || !newQuery.queryType || !newQuery.title || !newQuery.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createQueryMutation.mutate(newQuery);
  };

  if (queriesLoading) {
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" data-testid="query-header">Query Management</h2>
          <p className="text-gray-600" data-testid="query-description">Manage and track ongoing queries and issues</p>
        </div>
        
        <Dialog open={isRaiseQueryOpen} onOpenChange={setIsRaiseQueryOpen}>
          <DialogTrigger asChild>
            <Button className="bg-energy-blue hover:bg-energy-blue/90" data-testid="button-raise-query">
              <Plus className="h-4 w-4 mr-2" />
              Raise Query
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Raise New Query</DialogTitle>
              <DialogDescription>
                Submit a new query or issue for investigation and resolution.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="site">Site *</Label>
                <Select value={newQuery.siteId} onValueChange={(value) => setNewQuery({...newQuery, siteId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.siteName} - {site.mpanMprnSpid}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="queryType">Query Type *</Label>
                <Select value={newQuery.queryType} onValueChange={(value) => setNewQuery({...newQuery, queryType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select query type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="billing_dispute">Billing Dispute</SelectItem>
                    <SelectItem value="service_issue">Service Issue</SelectItem>
                    <SelectItem value="account_issue">Account Issue</SelectItem>
                    <SelectItem value="technical_issue">Technical Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newQuery.priority} onValueChange={(value) => setNewQuery({...newQuery, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  value={newQuery.title}
                  onChange={(e) => setNewQuery({...newQuery, title: e.target.value})}
                  placeholder="Brief description of the issue"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  value={newQuery.description}
                  onChange={(e) => setNewQuery({...newQuery, description: e.target.value})}
                  placeholder="Detailed description of the issue and any relevant information"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsRaiseQueryOpen(false)}
                data-testid="button-cancel-query"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRaiseQuery}
                disabled={createQueryMutation.isPending}
                data-testid="button-submit-query"
              >
                {createQueryMutation.isPending ? "Submitting..." : "Submit Query"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-query-search"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Escalated">Escalated</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Priority">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Billing Dispute">Billing Dispute</SelectItem>
                <SelectItem value="Service Issue">Service Issue</SelectItem>
                <SelectItem value="Account Issue">Account Issue</SelectItem>
                <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Queries</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-total-queries">{(queries as Query[]).length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ongoing</p>
                <p className="text-2xl font-bold text-orange-600" data-testid="stat-ongoing-queries">{ongoingQueries.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600" data-testid="stat-high-priority">
                  {(queries as Query[]).filter((q: Query) => q.priority === 'high' && q.status !== 'resolved').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-resolved-queries">{resolvedQueries.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ongoing Queries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Ongoing Queries
          </CardTitle>
          <CardDescription>
            Active queries requiring attention or in progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ongoingQueries.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No ongoing queries found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ongoingQueries.map((query: Query) => (
                <div key={query.id} className="border rounded-lg p-4 hover:bg-gray-50" data-testid={`query-card-${query.id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{query.title}</h3>
                        <Badge variant={getStatusColor(query.status)} className="flex items-center gap-1">
                          {getStatusIcon(query.status)}
                          {query.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant={getPriorityColor(query.priority)}>
                          {query.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{query.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Site: {query.site?.siteName}</span>
                        <span>Type: {query.queryType.replace('_', ' ')}</span>
                        <span>Raised: {formatDate(query.raisedDate)}</span>
                        {query.assignedTo && <span>Assigned: {query.assignedTo}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolved Queries */}
      {resolvedQueries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Recently Resolved
            </CardTitle>
            <CardDescription>
              Recently resolved queries and their outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resolvedQueries.slice(0, 5).map((query: Query) => (
                <div key={query.id} className="border rounded-lg p-4 bg-green-50" data-testid={`resolved-query-${query.id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{query.title}</h3>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          RESOLVED
                        </Badge>
                        <Badge variant={getPriorityColor(query.priority)}>
                          {query.priority.toUpperCase()}
                        </Badge>
                      </div>
                      {query.resolution && (
                        <p className="text-sm text-green-800 mb-2 font-medium">
                          Resolution: {query.resolution}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Site: {query.site?.siteName}</span>
                        <span>Resolved: {formatDate(query.lastUpdated)}</span>
                        {query.assignedTo && <span>Resolved by: {query.assignedTo}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
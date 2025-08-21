import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Search, Calendar, User, CheckCircle, AlertCircle, Settings, Zap } from "lucide-react";

interface SmartMeterRollout {
  id: string;
  siteId: string;
  utilityType: string;
  currentMeterType: string;
  targetMeterType: string;
  eligibilityStatus: string;
  rolloutStatus: string;
  scheduledDate?: string;
  completedDate?: string;
  technicianAssigned?: string;
  visitNotes?: string;
  installationCost?: number;
  communicationTested: boolean;
  dataCollectionStarted: boolean;
  site: {
    id: string;
    siteName: string;
    siteAddress: string;
    utilityType: string;
    supplier?: string;
  };
}

export default function SmartMeterRolloutTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [utilityFilter, setUtilityFilter] = useState("All Utilities");

  // Fetch smart meter rollout data
  const { data: rolloutData = [], isLoading } = useQuery<SmartMeterRollout[]>({
    queryKey: ["/api/smart-meter-rollout"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "installed":
      case "working":
        return "default";
      case "commission":
        return "secondary";
      case "site_visit_arranged":
        return "outline";
      case "on_job_failed":
      case "rebook":
        return "destructive";
      case "already_raised":
      case "on_going":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getEligibilityColor = (status: string) => {
    switch (status) {
      case "eligible":
        return "default";
      case "not_eligible":
        return "destructive";
      case "under_review":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getUtilityIcon = (type: string) => {
    switch (type) {
      case "electricity":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case "gas":
        return <span className="h-4 w-4 text-blue-500">🔥</span>;
      case "water":
        return <span className="h-4 w-4 text-cyan-500">💧</span>;
      default:
        return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredRolloutData = rolloutData.filter((rollout: SmartMeterRollout) => {
    const matchesSearch = searchTerm === "" || 
      rollout.site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rollout.technicianAssigned?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rollout.currentMeterType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All Status" || 
      rollout.rolloutStatus === statusFilter.toLowerCase().replace(' ', '_');
    
    const matchesUtility = utilityFilter === "All Utilities" || 
      rollout.utilityType === utilityFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesUtility;
  });

  // Calculate stats
  const totalRollouts = rolloutData.length;
  const completedInstalls = rolloutData.filter(r => r.rolloutStatus === 'installed' || r.rolloutStatus === 'working').length;
  const upcomingVisits = rolloutData.filter(r => r.rolloutStatus === 'site_visit_arranged' || r.rolloutStatus === 'already_raised').length;
  const failedJobs = rolloutData.filter(r => r.rolloutStatus === 'on_job_failed' || r.rolloutStatus === 'rebook').length;
  const completionPercentage = totalRollouts > 0 ? (completedInstalls / totalRollouts) * 100 : 0;

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
        <h2 className="text-2xl font-bold text-gray-900" data-testid="smart-meter-rollout-header">Smart Meter Rollout</h2>
        <p className="text-gray-600" data-testid="smart-meter-rollout-description">
          Track smart meter installations, upgrades, and site visit schedules across all properties
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rollouts</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-total-rollouts">{totalRollouts}</p>
              </div>
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-completed">{completedInstalls}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Visits</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="stat-upcoming">{upcomingVisits}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Jobs</p>
                <p className="text-2xl font-bold text-red-600" data-testid="stat-failed">{failedJobs}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Rollout Progress
          </CardTitle>
          <CardDescription>
            Overall smart meter installation progress across all sites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Installation Completion Rate</span>
              <span className="text-sm font-bold">{completionPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{completedInstalls} completed</span>
              <span>{totalRollouts - completedInstalls} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by site, technician, or meter type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-rollout-search"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Already Raised">Already Raised</SelectItem>
                <SelectItem value="On Going">On Going</SelectItem>
                <SelectItem value="Installed">Installed</SelectItem>
                <SelectItem value="Working">Working</SelectItem>
                <SelectItem value="Commission">Commission</SelectItem>
                <SelectItem value="Site Visit Arranged">Site Visit Arranged</SelectItem>
                <SelectItem value="On Job Failed">On Job Failed</SelectItem>
                <SelectItem value="Rebook">Rebook</SelectItem>
              </SelectContent>
            </Select>
            
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
          </div>
        </CardContent>
      </Card>

      {/* Rollout Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Smart Meter Installations
          </CardTitle>
          <CardDescription>
            Detailed view of all smart meter rollout activities and statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRolloutData.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No rollout activities found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRolloutData.map((rollout: SmartMeterRollout) => (
                <div 
                  key={rollout.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50"
                  data-testid={`rollout-${rollout.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getUtilityIcon(rollout.utilityType)}
                        <h3 className="font-semibold text-gray-900">{rollout.site.siteName}</h3>
                        <Badge variant={getStatusColor(rollout.rolloutStatus)}>
                          {formatStatus(rollout.rolloutStatus)}
                        </Badge>
                        <Badge variant={getEligibilityColor(rollout.eligibilityStatus)}>
                          {formatStatus(rollout.eligibilityStatus)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-gray-500">Current Meter</p>
                          <p className="font-medium">{rollout.currentMeterType.toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Target Meter</p>
                          <p className="font-medium">{rollout.targetMeterType.toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Scheduled Date</p>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(rollout.scheduledDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Technician</p>
                          <p className="font-medium flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {rollout.technicianAssigned || 'Not assigned'}
                          </p>
                        </div>
                      </div>
                      
                      {rollout.completedDate && (
                        <div className="mb-3">
                          <p className="text-gray-500 text-sm">Completed Date</p>
                          <p className="font-medium text-green-600">{formatDate(rollout.completedDate)}</p>
                        </div>
                      )}
                      
                      {/* Status Indicators */}
                      <div className="flex flex-wrap gap-4 text-xs">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded ${rollout.communicationTested ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          <CheckCircle className="h-3 w-3" />
                          Communication {rollout.communicationTested ? 'Tested' : 'Pending'}
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded ${rollout.dataCollectionStarted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          <Settings className="h-3 w-3" />
                          Data Collection {rollout.dataCollectionStarted ? 'Active' : 'Pending'}
                        </div>
                      </div>
                      
                      {rollout.visitNotes && (
                        <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                          <p className="font-medium text-blue-800 mb-1">Visit Notes:</p>
                          <p className="text-blue-700">{rollout.visitNotes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button variant="outline" size="sm" data-testid={`manage-rollout-${rollout.id}`}>
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                      {(rollout.rolloutStatus === 'on_job_failed' || rollout.rolloutStatus === 'rebook') && (
                        <Button variant="default" size="sm" data-testid={`rebook-${rollout.id}`}>
                          <Calendar className="h-4 w-4 mr-1" />
                          Rebook
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Installation Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Installations
          </CardTitle>
          <CardDescription>
            Scheduled smart meter installations and site visits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rolloutData
              .filter(r => r.scheduledDate && (r.rolloutStatus === 'site_visit_arranged' || r.rolloutStatus === 'already_raised'))
              .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
              .map((rollout) => (
                <div key={rollout.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getUtilityIcon(rollout.utilityType)}
                    <div>
                      <h4 className="font-medium">{rollout.site.siteName}</h4>
                      <p className="text-sm text-gray-600">{rollout.technicianAssigned}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatDate(rollout.scheduledDate)}</p>
                    <Badge variant={getStatusColor(rollout.rolloutStatus)} className="text-xs">
                      {formatStatus(rollout.rolloutStatus)}
                    </Badge>
                  </div>
                </div>
              ))}
            {rolloutData.filter(r => r.scheduledDate && (r.rolloutStatus === 'site_visit_arranged' || r.rolloutStatus === 'already_raised')).length === 0 && (
              <div className="text-center py-4">
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No upcoming installations scheduled</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
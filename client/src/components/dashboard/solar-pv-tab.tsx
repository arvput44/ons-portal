import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sun, Search, Zap, Calendar, Settings, TrendingUp, Download, Award } from "lucide-react";

interface SolarProject {
  id: string;
  siteId: string;
  projectName: string;
  systemSize: number;
  panelCount: number;
  inverterType: string;
  installationDate: string;
  commissioningDate?: string;
  status: string;
  estimatedAnnualGeneration: number;
  actualAnnualGeneration?: number;
  exportTariff: number;
  fitRate?: number;
  o2mProvider: string;
  warrantyExpiry: string;
  site: {
    id: string;
    siteName: string;
    siteAddress: string;
    utilityType: string;
    supplier?: string;
  };
}

export default function SolarPvTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Fetch solar projects
  const { data: solarProjects = [], isLoading } = useQuery<SolarProject[]>({
    queryKey: ["/api/solar-projects"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "default";
      case "under_construction":
        return "secondary";
      case "planning":
        return "outline";
      case "maintenance":
        return "destructive";
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

  const calculatePerformanceRatio = (actual: number, estimated: number) => {
    if (!actual || !estimated) return 0;
    return Math.round((actual / estimated) * 100);
  };

  const filteredProjects = solarProjects.filter((project: SolarProject) => {
    const matchesSearch = searchTerm === "" || 
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.inverterType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All Status" || 
      project.status === statusFilter.toLowerCase().replace(' ', '_');
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalCapacity = solarProjects.reduce((sum, p) => sum + p.systemSize, 0);
  const operationalProjects = solarProjects.filter(p => p.status === 'operational').length;
  const totalGeneration = solarProjects.reduce((sum, p) => sum + (p.actualAnnualGeneration || 0), 0);
  const averagePerformance = solarProjects
    .filter(p => p.actualAnnualGeneration && p.estimatedAnnualGeneration)
    .reduce((sum, p, _, arr) => sum + calculatePerformanceRatio(p.actualAnnualGeneration!, p.estimatedAnnualGeneration) / arr.length, 0);

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
        <h2 className="text-2xl font-bold text-gray-900" data-testid="solar-pv-header">Solar PV Management</h2>
        <p className="text-gray-600" data-testid="solar-pv-description">
          Monitor solar panel installations, generation performance, and project status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-orange-600" data-testid="stat-total-capacity">
                  {totalCapacity.toFixed(1)} kWp
                </p>
              </div>
              <Sun className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Operational Sites</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-operational">{operationalProjects}</p>
              </div>
              <Zap className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annual Generation</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="stat-generation">
                  {(totalGeneration / 1000).toFixed(0)} MWh
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-purple-600" data-testid="stat-performance">
                  {averagePerformance.toFixed(0)}%
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-400" />
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
                  placeholder="Search projects, sites, or equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-solar-search"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Operational">Operational</SelectItem>
                <SelectItem value="Under Construction">Under Construction</SelectItem>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Solar Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-orange-500" />
            Solar PV Projects
          </CardTitle>
          <CardDescription>
            Detailed view of all solar installations and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <Sun className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No solar projects found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProjects.map((project: SolarProject) => (
                <div 
                  key={project.id} 
                  className="border rounded-lg p-6 hover:bg-gray-50"
                  data-testid={`solar-project-${project.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{project.projectName}</h3>
                        <Badge variant={getStatusColor(project.status)}>
                          {project.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{project.site.siteName}</p>
                      
                      {/* System Specifications */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Sun className="h-4 w-4 text-orange-500" />
                            <p className="text-sm font-medium text-orange-800">System Capacity</p>
                          </div>
                          <p className="text-lg font-bold text-orange-900">{project.systemSize} kWp</p>
                          <p className="text-xs text-orange-600">{project.panelCount} panels</p>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="h-4 w-4 text-blue-500" />
                            <p className="text-sm font-medium text-blue-800">Generation</p>
                          </div>
                          <p className="text-lg font-bold text-blue-900">
                            {project.actualAnnualGeneration ? 
                              `${(project.actualAnnualGeneration / 1000).toFixed(0)} MWh` : 
                              `${(project.estimatedAnnualGeneration / 1000).toFixed(0)} MWh (est)`
                            }
                          </p>
                          <p className="text-xs text-blue-600">
                            {project.actualAnnualGeneration ? 'Actual' : 'Estimated'} annual
                          </p>
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <p className="text-sm font-medium text-green-800">Export Rate</p>
                          </div>
                          <p className="text-lg font-bold text-green-900">{project.exportTariff}p/kWh</p>
                          {project.fitRate && (
                            <p className="text-xs text-green-600">FIT: {project.fitRate}p/kWh</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Performance Metrics */}
                      {project.actualAnnualGeneration && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-700">Performance vs Estimate</p>
                            <p className="text-sm font-bold text-gray-900">
                              {calculatePerformanceRatio(project.actualAnnualGeneration, project.estimatedAnnualGeneration)}%
                            </p>
                          </div>
                          <Progress 
                            value={calculatePerformanceRatio(project.actualAnnualGeneration, project.estimatedAnnualGeneration)} 
                            className="h-2"
                          />
                        </div>
                      )}
                      
                      {/* Technical Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm border-t pt-4">
                        <div>
                          <p className="text-gray-500">Inverter Type</p>
                          <p className="font-medium">{project.inverterType}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Installation Date</p>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(project.installationDate)}
                          </p>
                        </div>
                        {project.commissioningDate && (
                          <div>
                            <p className="text-gray-500">Commissioned</p>
                            <p className="font-medium">{formatDate(project.commissioningDate)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-500">O&M Provider</p>
                          <p className="font-medium">{project.o2mProvider}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Warranty Expiry</p>
                          <p className="font-medium">{formatDate(project.warrantyExpiry)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button variant="outline" size="sm" data-testid={`view-project-${project.id}`}>
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                      <Button variant="outline" size="sm" data-testid={`download-project-${project.id}`}>
                        <Download className="h-4 w-4 mr-1" />
                        Reports
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Solar Installation Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Installation Pipeline
          </CardTitle>
          <CardDescription>
            Upcoming and planned solar installations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {solarProjects.filter(p => p.status !== 'operational').map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{project.projectName}</h4>
                  <p className="text-sm text-gray-600">{project.site.siteName}</p>
                  <p className="text-xs text-gray-500">{project.systemSize} kWp system</p>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusColor(project.status)}>
                    {project.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(project.installationDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
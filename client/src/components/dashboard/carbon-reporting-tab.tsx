import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, TrendingDown, TrendingUp, Award, Download, FileText, Target, Zap } from "lucide-react";

interface CarbonData {
  id: string;
  userId: string;
  reportingPeriod: string;
  scope1Emissions: number;
  scope2Emissions: number;
  scope3Emissions: number;
  totalEmissions: number;
  emissionReduction: number;
  renewablePercentage: number;
  carbonOffset: number;
  reportFilePath: string;
  verificationStatus: string;
}

export default function CarbonReportingTab() {
  const [periodFilter, setPeriodFilter] = useState("All Periods");

  // Fetch carbon data
  const { data: carbonData = [], isLoading } = useQuery<CarbonData[]>({
    queryKey: ["/api/carbon-data"],
  });

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "default";
      case "pending":
        return "secondary";
      case "draft":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatEmissions = (emissions: number) => {
    if (emissions >= 1000) {
      return `${(emissions / 1000).toFixed(1)}t CO₂e`;
    }
    return `${emissions.toFixed(1)}kg CO₂e`;
  };

  const getCurrentYearData = () => {
    const currentYear = new Date().getFullYear();
    return carbonData.filter(data => data.reportingPeriod.includes(currentYear.toString()));
  };

  const getLatestData = () => {
    return carbonData.sort((a, b) => 
      new Date(b.reportingPeriod).getTime() - new Date(a.reportingPeriod).getTime()
    )[0];
  };

  const filteredData = carbonData.filter((data: CarbonData) => {
    if (periodFilter === "All Periods") return true;
    return data.reportingPeriod.includes(periodFilter);
  });

  // Calculate stats
  const latestData = getLatestData();
  const currentYearTotal = getCurrentYearData().reduce((sum, data) => sum + data.totalEmissions, 0);
  const averageReduction = carbonData.reduce((sum, data) => sum + data.emissionReduction, 0) / carbonData.length;
  const totalOffset = carbonData.reduce((sum, data) => sum + data.carbonOffset, 0);

  // Carbon targets and benchmarks
  const carbonTargets = {
    "2024": { target: 1200, description: "15% reduction from 2023 baseline" },
    "2025": { target: 1000, description: "30% reduction from 2023 baseline" },
    "2030": { target: 600, description: "Net Zero pathway target" }
  };

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
        <h2 className="text-2xl font-bold text-gray-900" data-testid="carbon-header">Carbon Reporting</h2>
        <p className="text-gray-600" data-testid="carbon-description">
          Track greenhouse gas emissions, reduction targets, and sustainability metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Emissions</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-current-emissions">
                  {latestData ? formatEmissions(latestData.totalEmissions) : '0 kg CO₂e'}
                </p>
              </div>
              <Leaf className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">YTD Reduction</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-reduction">
                  {averageReduction.toFixed(1)}%
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
                <p className="text-sm font-medium text-gray-600">Renewable %</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="stat-renewable">
                  {latestData ? latestData.renewablePercentage.toFixed(1) : '0'}%
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Offset</p>
                <p className="text-2xl font-bold text-purple-600" data-testid="stat-offset">
                  {formatEmissions(totalOffset)}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carbon Targets Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Carbon Reduction Targets
          </CardTitle>
          <CardDescription>
            Progress towards net zero and interim emission reduction goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(carbonTargets).map(([year, target]) => {
              const currentEmissions = latestData ? latestData.totalEmissions : 0;
              const progressPercentage = Math.max(0, Math.min(100, ((1400 - currentEmissions) / (1400 - target.target)) * 100));
              
              return (
                <div key={year} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{year} Target</h4>
                      <p className="text-sm text-gray-600">{target.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatEmissions(target.target)}</p>
                      <p className="text-sm text-gray-600">{progressPercentage.toFixed(0)}% progress</p>
                    </div>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Emission Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Scope Emissions Breakdown
            </CardTitle>
            <CardDescription>
              Current period emissions by scope
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">Scope 1 (Direct)</p>
                    <p className="text-sm text-red-600">Company vehicles, heating fuel</p>
                  </div>
                  <p className="text-lg font-bold text-red-900">
                    {formatEmissions(latestData.scope1Emissions)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-orange-800">Scope 2 (Indirect Energy)</p>
                    <p className="text-sm text-orange-600">Purchased electricity, heating</p>
                  </div>
                  <p className="text-lg font-bold text-orange-900">
                    {formatEmissions(latestData.scope2Emissions)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">Scope 3 (Other Indirect)</p>
                    <p className="text-sm text-blue-600">Supply chain, business travel</p>
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {formatEmissions(latestData.scope3Emissions)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border-2 border-gray-300">
                  <div>
                    <p className="font-bold text-gray-800">Total Emissions</p>
                    <p className="text-sm text-gray-600">All scopes combined</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {formatEmissions(latestData.totalEmissions)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sustainability Metrics
            </CardTitle>
            <CardDescription>
              Key environmental performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestData && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Renewable Energy Use</p>
                    <p className="text-sm font-bold">{latestData.renewablePercentage.toFixed(1)}%</p>
                  </div>
                  <Progress value={latestData.renewablePercentage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Emission Reduction</p>
                    <p className="text-sm font-bold text-green-600">-{latestData.emissionReduction.toFixed(1)}%</p>
                  </div>
                  <Progress value={latestData.emissionReduction} className="h-2" />
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-1">Carbon Offset</p>
                  <p className="text-lg font-bold text-green-900">
                    {formatEmissions(latestData.carbonOffset)}
                  </p>
                  <p className="text-xs text-green-600">Verified carbon credits purchased</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">Net Emissions</p>
                  <p className="text-lg font-bold text-blue-900">
                    {formatEmissions(latestData.totalEmissions - latestData.carbonOffset)}
                  </p>
                  <p className="text-xs text-blue-600">After offset application</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reporting Periods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Carbon Reports
              </CardTitle>
              <CardDescription>
                Historical carbon reporting data and verification status
              </CardDescription>
            </div>
            
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Periods">All Periods</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No carbon reports found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((data: CarbonData) => (
                <div 
                  key={data.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50"
                  data-testid={`carbon-report-${data.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{data.reportingPeriod}</h3>
                        <Badge variant={getVerificationColor(data.verificationStatus)}>
                          {data.verificationStatus.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {formatEmissions(data.totalEmissions)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Scope 1</p>
                          <p className="font-medium">{formatEmissions(data.scope1Emissions)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Scope 2</p>
                          <p className="font-medium">{formatEmissions(data.scope2Emissions)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Scope 3</p>
                          <p className="font-medium">{formatEmissions(data.scope3Emissions)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Reduction</p>
                          <p className="font-medium text-green-600">-{data.emissionReduction.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="ml-4" data-testid={`download-carbon-${data.id}`}>
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
    </div>
  );
}
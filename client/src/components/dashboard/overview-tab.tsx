import { useQuery } from "@tanstack/react-query";
import { Building, Bolt, PoundSterling, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ConsumptionChart from "@/components/charts/consumption-chart";
import CostChart from "@/components/charts/cost-chart";
import UtilityTabs from "@/components/dashboard/utility-tabs";

interface Stats {
  totalSites: number;
  activeMpans: number;
  monthlySpend: number;
  pendingBills: number;
  electricitySites: number;
  gasSites: number;
  waterSites: number;
  electricityPending: number;
  gasPending: number;
  waterPending: number;
  electricityObjections: number;
  gasObjections: number;
  waterObjections: number;
}

export default function OverviewTab() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/analytics/stats"],
  });

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Sites",
      value: stats.totalSites.toString(),
      change: "+12 this month",
      changeType: "positive",
      icon: Building,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active MPANs",
      value: stats.activeMpans.toString(),
      change: "98% registered",
      changeType: "positive",
      icon: Bolt,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Monthly Spend",
      value: `£${stats.monthlySpend.toLocaleString()}`,
      change: "+5.2% vs last month",
      changeType: "negative",
      icon: PoundSterling,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Pending Bills",
      value: stats.pendingBills.toString(),
      change: "Requires attention",
      changeType: "warning",
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border border-gray-100" data-testid={`stat-card-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600" data-testid={`stat-title-${index}`}>{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900" data-testid={`stat-value-${index}`}>{stat.value}</p>
                    <p 
                      className={`text-sm ${
                        stat.changeType === 'positive' ? 'text-energy-green' : 
                        stat.changeType === 'negative' ? 'text-red-500' : 
                        'text-energy-orange'
                      }`}
                      data-testid={`stat-change-${index}`}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.iconColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Consumption Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ConsumptionChart />
          </CardContent>
        </Card>

        <Card className="border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <CostChart />
          </CardContent>
        </Card>
      </div>

      {/* Utility Type Tabs */}
      <UtilityTabs
        electricityData={{
          registered: stats.electricitySites,
          pending: stats.electricityPending,
          objections: stats.electricityObjections,
        }}
        gasData={{
          registered: stats.gasSites,
          pending: stats.gasPending,
          objections: stats.gasObjections,
        }}
        waterData={{
          registered: stats.waterSites,
          pending: stats.waterPending,
          objections: stats.waterObjections,
        }}
      />
    </div>
  );
}

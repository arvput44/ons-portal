import { useQuery } from "@tanstack/react-query";
import { BarChart3, PoundSterling, Leaf, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyConsumptionChart, CostBreakdownChart, PeakUsageChart, SiteComparisonChart } from "@/components/charts/analytics-charts";

interface Stats {
  totalSites: number;
  activeMpans: number;
  monthlySpend: number;
  pendingBills: number;
}

export default function AnalyticsTab() {
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

  // Mock analytics data - in a real app this would come from the API
  const analyticsCards = [
    {
      title: "Total Consumption",
      value: "2.4M kWh",
      change: "↑ 3.2% vs last month",
      changeType: "positive",
      icon: BarChart3,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Average Unit Rate",
      value: "15.8p",
      change: "↑ 2.1% vs last month",
      changeType: "negative",
      icon: PoundSterling,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Carbon Footprint",
      value: "456 tCO₂",
      change: "↓ 1.8% vs last month",
      changeType: "positive",
      icon: Leaf,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Efficiency Score",
      value: "87%",
      change: "↑ 4.2% vs last month",
      changeType: "positive",
      icon: Star,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" data-testid="analytics-title">Analytics & Reporting</h2>
        <p className="text-gray-600" data-testid="analytics-subtitle">Comprehensive energy analytics and insights</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="border border-gray-100" data-testid={`analytics-card-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600" data-testid={`analytics-title-${index}`}>{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid={`analytics-value-${index}`}>{card.value}</p>
                    <p 
                      className={`text-sm ${
                        card.changeType === 'positive' ? 'text-green-600' : 'text-red-500'
                      }`}
                      data-testid={`analytics-change-${index}`}
                    >
                      {card.change}
                    </p>
                  </div>
                  <div className={`${card.bgColor} ${card.iconColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Monthly Consumption Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyConsumptionChart />
          </CardContent>
        </Card>

        <Card className="border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Cost Breakdown by Utility</CardTitle>
          </CardHeader>
          <CardContent>
            <CostBreakdownChart />
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Peak vs Off-Peak Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <PeakUsageChart />
          </CardContent>
        </Card>

        <Card className="border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Site Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <SiteComparisonChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

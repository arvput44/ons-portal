import { useState } from "react";
import { Bolt, User, LogOut, BarChart3, MapPin, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import OverviewTab from "@/components/dashboard/overview-tab";
import SitesTab from "@/components/dashboard/sites-tab";
import BillingTab from "@/components/dashboard/billing-tab";
import AnalyticsTab from "@/components/dashboard/analytics-tab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    window.location.href = "/";
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "sites", label: "Site Management", icon: MapPin },
    { id: "billing", label: "Bill Validation", icon: FileText },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-energy-blue text-white w-10 h-10 rounded-lg flex items-center justify-center">
                <Bolt className="h-5 w-5" data-testid="header-logo" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900" data-testid="header-title">ONS Energy Portal</h1>
                <p className="text-sm text-gray-600" data-testid="header-subtitle">Client Management Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900" data-testid="welcome-message">Welcome back</p>
                <p className="text-xs text-gray-600" data-testid="user-email">clientmanagement@ons.energy</p>
              </div>
              <div className="w-10 h-10 bg-energy-blue rounded-full flex items-center justify-center text-white font-medium">
                <User className="h-5 w-5" data-testid="user-avatar" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-6">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                        isActive
                          ? "bg-energy-blue text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      data-testid={`nav-${tab.id}`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "sites" && <SitesTab />}
          {activeTab === "billing" && <BillingTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </main>
      </div>
    </div>
  );
}

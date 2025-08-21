import { useState } from "react";
import { Bolt, Flame, Droplets } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UtilityData {
  registered: number;
  pending: number;
  objections: number;
}

interface UtilityTabsProps {
  electricityData: UtilityData;
  gasData: UtilityData;
  waterData: UtilityData;
}

export default function UtilityTabs({ electricityData, gasData, waterData }: UtilityTabsProps) {
  const [activeUtility, setActiveUtility] = useState("electricity");

  const utilities = [
    {
      id: "electricity",
      label: `Electricity (${electricityData.registered} MPANs)`,
      icon: Bolt,
      data: electricityData,
    },
    {
      id: "gas",
      label: `Gas (${gasData.registered} MPRNs)`,
      icon: Flame,
      data: gasData,
    },
    {
      id: "water",
      label: `Water (${waterData.registered} SPIDs)`,
      icon: Droplets,
      data: waterData,
    },
  ];

  return (
    <Card className="border border-gray-100">
      <Tabs value={activeUtility} onValueChange={setActiveUtility} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {utilities.map((utility) => {
            const Icon = utility.icon;
            return (
              <TabsTrigger 
                key={utility.id} 
                value={utility.id} 
                className="flex items-center"
                data-testid={`utility-tab-${utility.id}`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {utility.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {utilities.map((utility) => (
          <TabsContent key={utility.id} value={utility.id} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg" data-testid={`${utility.id}-registered`}>
                <div className="text-3xl font-bold text-energy-blue">{utility.data.registered}</div>
                <div className="text-sm text-gray-600">
                  Total Registered {utility.id === 'electricity' ? 'MPANs' : utility.id === 'gas' ? 'MPRNs' : 'SPIDs'}
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg" data-testid={`${utility.id}-pending`}>
                <div className="text-3xl font-bold text-yellow-600">{utility.data.pending}</div>
                <div className="text-sm text-gray-600">Upcoming Registrations</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg" data-testid={`${utility.id}-objections`}>
                <div className="text-3xl font-bold text-red-600">{utility.data.objections}</div>
                <div className="text-sm text-gray-600">Objections</div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}

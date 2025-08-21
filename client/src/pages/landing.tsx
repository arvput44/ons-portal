import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Bolt, Eye } from "lucide-react";
import { useState } from "react";

export default function Landing() {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-energy-blue to-blue-800 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      ></div>
      
      <Card className="relative z-10 w-full max-w-md mx-4 p-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-energy-blue text-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Bolt className="h-8 w-8" data-testid="logo-icon" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="title">ONS Energy</h1>
          <p className="text-gray-600" data-testid="subtitle">Client Management Portal</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin} data-testid="login-form">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              required
              className="w-full"
              placeholder="clientmanagement@ons.energy"
              defaultValue="clientmanagement@ons.energy"
              data-testid="input-email"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full pr-10"
                placeholder="••••••••"
                data-testid="input-password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="button-toggle-password"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" data-testid="checkbox-remember" />
              <Label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </Label>
            </div>
            <a href="#" className="text-sm text-energy-blue hover:text-blue-800 font-medium" data-testid="link-forgot-password">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full bg-energy-blue text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-[1.02]"
            data-testid="button-signin"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500" data-testid="security-message">
          Secure access to your energy management dashboard
        </div>
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Monitor from "./pages/Monitor";
import Control from "./pages/Control";
import Settings from "./pages/Settings";
import type { SystemStatus, TabType } from "./types";
import "./App.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    wifiConnected: true,
    iotConnected: true,
    systemOnline: true,
    lastUpdate: new Date(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setSystemStatus((prev) => ({
          ...prev,
          wifiConnected: !prev.wifiConnected,
          lastUpdate: new Date(),
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = (): React.ReactNode => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard systemStatus={systemStatus} />;
      case "monitor":
        return <Monitor />;
      case "control":
        return <Control />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard systemStatus={systemStatus} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header systemStatus={systemStatus} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

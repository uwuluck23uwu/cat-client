import React from "react";
import { Zap } from "lucide-react";
import type { SystemStatus } from "../types";

interface HeaderProps {
  systemStatus: SystemStatus;
}

const StatusIndicator: React.FC<{
  connected: boolean;
  label: string;
}> = ({ connected, label }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-3 h-3 rounded-full animate-pulse ${
        connected ? "bg-green-400" : "bg-red-400"
      }`}
    />
    <span
      className={`text-sm ${connected ? "text-green-600" : "text-red-600"}`}
    >
      {label}
    </span>
  </div>
);

const Header: React.FC<HeaderProps> = ({ systemStatus }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Pet Feeder System
              </h1>
              <p className="text-sm text-gray-600">
                ระบบให้อาหารยูจิและลูน่าอัตโนมัติ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <StatusIndicator
              connected={systemStatus.wifiConnected}
              label="WiFi"
            />
            <StatusIndicator
              connected={systemStatus.iotConnected}
              label="IoT"
            />
            <div className="text-xs text-gray-500">
              อัพเดทล่าสุด:{" "}
              {systemStatus.lastUpdate.toLocaleTimeString("th-TH")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

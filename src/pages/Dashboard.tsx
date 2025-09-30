import React, { useState } from "react";
import {
  Wifi,
  WifiOff,
  CheckCircle,
  AlertTriangle,
  Zap,
  Camera,
} from "lucide-react";
import CameraView from "../components/CameraView";
import type { SystemStatus } from "../types";

interface DashboardProps {
  systemStatus: SystemStatus;
}

const StatusCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  borderColor: string;
  valueColor: string;
}> = ({ title, value, icon, borderColor, valueColor }) => (
  <div
    className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${borderColor} hover:shadow-lg transition-shadow duration-300`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className={`text-2xl font-bold mt-2 ${valueColor}`}>{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ systemStatus }) => {
  const [showCamera, setShowCamera] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ระบบให้อาหารสัตว์เลี้ยงอัตโนมัติ
        </h2>
        <p className="text-gray-600">
          สำหรับยูจิ 🐹 (ผู้, ส้มตัดขาว) และลูน่า 🐹 (เมีย, ดำตัดขาว)
        </p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="WiFi Connection"
          value={
            systemStatus.wifiConnected ? "เชื่อมต่อแล้ว" : "ขาดการเชื่อมต่อ"
          }
          icon={
            systemStatus.wifiConnected ? (
              <Wifi className="text-green-500" size={32} />
            ) : (
              <WifiOff className="text-red-500 animate-pulse" size={32} />
            )
          }
          borderColor="border-blue-500"
          valueColor={
            systemStatus.wifiConnected ? "text-blue-600" : "text-red-600"
          }
        />

        <StatusCard
          title="IoT Platform"
          value={
            systemStatus.iotConnected ? "เชื่อมต่อแล้ว" : "ขาดการเชื่อมต่อ"
          }
          icon={
            systemStatus.iotConnected ? (
              <CheckCircle className="text-green-500" size={32} />
            ) : (
              <AlertTriangle className="text-red-500 animate-pulse" size={32} />
            )
          }
          borderColor="border-green-500"
          valueColor={
            systemStatus.iotConnected ? "text-green-600" : "text-red-600"
          }
        />

        <StatusCard
          title="System Status"
          value={systemStatus.systemOnline ? "ออนไลน์" : "ออฟไลน์"}
          icon={
            <Zap
              className={`${
                systemStatus.systemOnline ? "text-purple-500" : "text-gray-400"
              }`}
              size={32}
            />
          }
          borderColor="border-purple-500"
          valueColor={
            systemStatus.systemOnline ? "text-purple-600" : "text-gray-600"
          }
        />
      </div>

      {/* Quick Status Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">ภาพรวมระบบ</h3>
          <button
            onClick={() => setShowCamera(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">ดูกล้อง</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <div className="text-sm text-gray-600">ระดับอาหาร</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-cyan-600">92%</div>
            <div className="text-sm text-gray-600">ระดับน้ำ</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-cyan-500 h-2 rounded-full"
                style={{ width: "92%" }}
              ></div>
            </div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">มื้อวันนี้</div>
          </div>
          <div className="text-center bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-purple-600">18:30</div>
            <div className="text-sm text-gray-600">มื้อถัดไป</div>
          </div>
        </div>
      </div>

      {/* Connection Error Alert */}
      {!systemStatus.wifiConnected && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <WifiOff className="text-red-500" size={20} />
            <div className="flex-1">
              <h4 className="font-semibold text-red-800">
                ขาดการเชื่อมต่อ WiFi
              </h4>
              <p className="text-red-600 text-sm">
                กำลังพยายามเชื่อมต่อใหม่...
              </p>
            </div>
          </div>
          <div className="mt-3 bg-red-100 rounded-lg p-2">
            <div className="h-2 bg-red-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full animate-pulse w-1/3"></div>
            </div>
            <p className="text-xs text-red-600 mt-1">
              รอ 10 วินาที แล้วลองเชื่อมต่อใหม่
            </p>
          </div>
        </div>
      )}

      {/* Pet Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl shadow-md border border-orange-200">
          <h4 className="text-lg font-semibold text-orange-800 mb-2">
            🐹 ยูจิ
          </h4>
          <div className="space-y-1 text-sm text-orange-700">
            <p>
              <span className="font-medium">เพศ:</span> ผู้
            </p>
            <p>
              <span className="font-medium">สี:</span> ส้มตัดขาว
            </p>
            <p>
              <span className="font-medium">สายพันธุ์:</span> ไจแอน
            </p>
            <p>
              <span className="font-medium">มื้อล่าสุด:</span> 15:30 น.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">🐹 ลูน่า</h4>
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <span className="font-medium">เพศ:</span> เมีย
            </p>
            <p>
              <span className="font-medium">สี:</span> ดำตัดขาว
            </p>
            <p>
              <span className="font-medium">สายพันธุ์:</span> ไจแอน
            </p>
            <p>
              <span className="font-medium">มื้อล่าสุด:</span> 15:30 น.
            </p>
          </div>
        </div>
      </div>

      <CameraView isOpen={showCamera} onClose={() => setShowCamera(false)} />
    </div>
  );
};

export default Dashboard;

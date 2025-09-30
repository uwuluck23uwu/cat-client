import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Droplets,
  Wheat,
  Thermometer,
  Activity,
  Clock,
  Bell,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface SensorReading {
  timestamp: string;
  foodLevel: number;
  waterLevel: number;
  temperature: number;
  humidity: number;
}

interface FeedingEvent {
  id: string;
  time: string;
  amount: number;
  duration: number;
  trigger: "scheduled" | "manual" | "app";
  success: boolean;
}

interface Notification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Monitor: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [currentReadings, setCurrentReadings] = useState({
    foodLevel: 85,
    waterLevel: 92,
    temperature: 24.5,
    humidity: 65,
  });
  const [feedingHistory] = useState<FeedingEvent[]>([
    {
      id: "1",
      time: "15:30",
      amount: 5,
      duration: 3,
      trigger: "scheduled",
      success: true,
    },
    {
      id: "2",
      time: "12:00",
      amount: 5,
      duration: 3,
      trigger: "scheduled",
      success: true,
    },
    {
      id: "3",
      time: "08:30",
      amount: 5,
      duration: 3,
      trigger: "scheduled",
      success: true,
    },
    {
      id: "4",
      time: "22:15",
      amount: 3,
      duration: 2,
      trigger: "manual",
      success: true,
    },
  ]);
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "การให้อาหารสำเร็จ",
      message: "ให้อาหารยูจิและลูน่าเสร็จสิ้น 5g",
      time: "15:30",
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "ระบบออนไลน์",
      message: "ระบบเชื่อมต่อกับ IoT Platform แล้ว",
      time: "14:45",
      read: true,
    },
    {
      id: "3",
      type: "warning",
      title: "ระดับอาหารลดลง",
      message: "ระดับอาหารเหลือ 85% ควรเติมเพิ่ม",
      time: "13:20",
      read: false,
    },
  ]);

  // Generate real-time sensor data
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const data: SensorReading[] = [];

      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          timestamp: time.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          foodLevel: 85 + Math.random() * 10 - 5,
          waterLevel: 92 + Math.random() * 6 - 3,
          temperature: 24.5 + Math.random() * 2 - 1,
          humidity: 65 + Math.random() * 10 - 5,
        });
      }
      setSensorData(data);
    };

    generateData();

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setSensorData((prevData) => {
        const newData = [...prevData.slice(1)];
        const lastReading = newData[newData.length - 1];
        newData.push({
          timestamp: new Date().toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          foodLevel: Math.max(
            0,
            lastReading.foodLevel + (Math.random() - 0.5) * 2
          ),
          waterLevel: Math.max(
            0,
            lastReading.waterLevel + (Math.random() - 0.5) * 1
          ),
          temperature: lastReading.temperature + (Math.random() - 0.5) * 0.5,
          humidity: lastReading.humidity + (Math.random() - 0.5) * 2,
        });
        return newData;
      });

      // Update current readings
      setCurrentReadings((prev) => ({
        foodLevel: Math.max(0, prev.foodLevel + (Math.random() - 0.5) * 2),
        waterLevel: Math.max(0, prev.waterLevel + (Math.random() - 0.5) * 1),
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        humidity: prev.humidity + (Math.random() - 0.5) * 2,
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const SensorCard: React.FC<{
    title: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    trend?: "up" | "down" | "stable";
  }> = ({ title, value, unit, icon, color, bgColor, trend = "stable" }) => (
    <div
      className={`${bgColor} p-6 rounded-xl shadow-md border-l-4 ${color} hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        {trend !== "stable" && (
          <TrendingUp
            className={`w-4 h-4 ${
              trend === "up"
                ? "text-green-500 rotate-0"
                : "text-red-500 rotate-180"
            }`}
          />
        )}
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-2">
        {value.toFixed(1)}
        <span className="text-lg text-gray-600 ml-1">{unit}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            title.includes("อาหาร")
              ? "bg-blue-500"
              : title.includes("น้ำ")
              ? "bg-cyan-500"
              : title.includes("อุณหภูมิ")
              ? "bg-orange-500"
              : "bg-green-500"
          }`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );

  const NotificationItem: React.FC<{ notification: Notification }> = ({
    notification,
  }) => (
    <div
      className={`p-4 rounded-lg border-l-4 ${
        notification.type === "success"
          ? "border-green-500 bg-green-50"
          : notification.type === "warning"
          ? "border-yellow-500 bg-yellow-50"
          : notification.type === "error"
          ? "border-red-500 bg-red-50"
          : "border-blue-500 bg-blue-50"
      } ${!notification.read ? "shadow-md" : "opacity-75"}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {notification.type === "success" && (
            <Activity className="w-4 h-4 text-green-600" />
          )}
          {notification.type === "warning" && (
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          )}
          {notification.type === "error" && (
            <AlertTriangle className="w-4 h-4 text-red-600" />
          )}
          {notification.type === "info" && (
            <Bell className="w-4 h-4 text-blue-600" />
          )}
          <h4 className="font-semibold text-gray-800">{notification.title}</h4>
        </div>
        <span className="text-sm text-gray-500">{notification.time}</span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
      {!notification.read && (
        <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-2 right-2 animate-pulse" />
      )}
    </div>
  );

  const FeedingHistoryItem: React.FC<{ event: FeedingEvent }> = ({ event }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            event.success ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <div>
          <div className="font-medium text-gray-800">{event.time} น.</div>
          <div className="text-sm text-gray-600">
            {event.trigger === "scheduled"
              ? "🕒 ตามตารางเวลา"
              : event.trigger === "manual"
              ? "👆 กดปุ่มด้วยตนเอง"
              : "📱 ผ่านแอพ"}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-gray-800">{event.amount}g</div>
        <div className="text-sm text-gray-600">{event.duration}s</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          หน้าจอติดตามระบบ
        </h2>
        <p className="text-gray-600">ข้อมูล Sensors และการทำงานแบบ Real-time</p>
      </div>

      {/* Current Sensor Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard
          title="ระดับอาหาร"
          value={currentReadings.foodLevel}
          unit="%"
          icon={<Wheat className="w-6 h-6 text-blue-600" />}
          color="border-blue-500"
          bgColor="bg-blue-50"
          trend={currentReadings.foodLevel > 20 ? "stable" : "down"}
        />
        <SensorCard
          title="ระดับน้ำ"
          value={currentReadings.waterLevel}
          unit="%"
          icon={<Droplets className="w-6 h-6 text-cyan-600" />}
          color="border-cyan-500"
          bgColor="bg-cyan-50"
          trend={currentReadings.waterLevel > 30 ? "stable" : "down"}
        />
        <SensorCard
          title="อุณหภูมิ"
          value={currentReadings.temperature}
          unit="°C"
          icon={<Thermometer className="w-6 h-6 text-orange-600" />}
          color="border-orange-500"
          bgColor="bg-orange-50"
        />
        <SensorCard
          title="ความชื้น"
          value={currentReadings.humidity}
          unit="%"
          icon={<Activity className="w-6 h-6 text-green-600" />}
          color="border-green-500"
          bgColor="bg-green-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Food & Water Levels Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            ระดับอาหารและน้ำ (24 ชั่วโมง)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="timestamp"
                stroke="#666"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="foodLevel"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="ระดับอาหาร (%)"
              />
              <Line
                type="monotone"
                dataKey="waterLevel"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                name="ระดับน้ำ (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature & Humidity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-orange-600" />
            อุณหภูมิและความชื้น (24 ชั่วโมง)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="timestamp"
                stroke="#666"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stackId="1"
                stroke="#f97316"
                fill="#fed7aa"
                name="อุณหภูมิ (°C)"
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stackId="2"
                stroke="#22c55e"
                fill="#bbf7d0"
                name="ความชื้น (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feeding History & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feeding History */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            ประวัติการให้อาหารวันนี้
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {feedingHistory.map((event) => (
              <FeedingHistoryItem key={event.id} event={event} />
            ))}
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700">สรุปวันนี้</div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-600">
                จำนวนมื้อ: {feedingHistory.length} มื้อ
              </span>
              <span className="text-sm text-gray-600">
                รวม:{" "}
                {feedingHistory.reduce((sum, event) => sum + event.amount, 0)}g
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            การแจ้งเตือน
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className="relative">
                <NotificationItem notification={notification} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitor;

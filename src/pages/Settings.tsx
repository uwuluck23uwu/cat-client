import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Wifi,
  Bell,
  Heart,
  Shield,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Plus,
  Globe,
} from "lucide-react";

interface PetProfile {
  id: string;
  name: string;
  gender: "male" | "female";
  color: string;
  breed: string;
  weight: number;
  birthDate: string;
  notes: string;
  avatar: string;
}

interface NotificationSettings {
  lowFood: boolean;
  lowWater: boolean;
  feedingComplete: boolean;
  systemErrors: boolean;
  scheduleReminders: boolean;
  maintenanceAlerts: boolean;
  soundEnabled: boolean;
  pushNotifications: boolean;
}

interface NetworkSettings {
  wifiSSID: string;
  wifiPassword: string;
  mqttBroker: string;
  mqttPort: number;
  apiEndpoint: string;
  deviceId: string;
  autoReconnect: boolean;
}

interface SystemSettings {
  timeZone: string;
  language: string;
  units: "metric" | "imperial";
  autoUpdate: boolean;
  debugMode: boolean;
  maintenanceMode: boolean;
  dataRetention: number; // days
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "pets" | "notifications" | "network" | "system"
  >("pets");
  const [showPassword, setShowPassword] = useState(false);
  const [pets, setPets] = useState<PetProfile[]>([
    {
      id: "1",
      name: "ยูจิ",
      gender: "male",
      color: "ส้มตัดขาว",
      breed: "ไจแอน",
      weight: 120,
      birthDate: "2023-06-15",
      notes: "ชอบวิ่งในล้อ กินเยอะตอนเย็น",
      avatar: "🐹",
    },
    {
      id: "2",
      name: "ลูน่า",
      gender: "female",
      color: "ดำตัดขาว",
      breed: "ไจแอน",
      weight: 110,
      birthDate: "2023-07-20",
      notes: "ขี้อาย ชอบซ่อนตัว กินช้าๆ",
      avatar: "🐹",
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    lowFood: true,
    lowWater: true,
    feedingComplete: true,
    systemErrors: true,
    scheduleReminders: false,
    maintenanceAlerts: true,
    soundEnabled: true,
    pushNotifications: true,
  });

  const [network, setNetwork] = useState<NetworkSettings>({
    wifiSSID: "Home_WiFi_5G",
    wifiPassword: "••••••••••",
    mqttBroker: "mqtt.petfeeder.local",
    mqttPort: 1883,
    apiEndpoint: "https://api.petfeeder.com/v1",
    deviceId: "PF-YJ-LN-001",
    autoReconnect: true,
  });

  const [system, setSystem] = useState<SystemSettings>({
    timeZone: "Asia/Bangkok",
    language: "th-TH",
    units: "metric",
    autoUpdate: true,
    debugMode: false,
    maintenanceMode: false,
    dataRetention: 30,
  });

  const [editingPet, setEditingPet] = useState<string | null>(null);
  const [showAddPet, setShowAddPet] = useState(false);
  const [newPet, setNewPet] = useState<Omit<PetProfile, "id">>({
    name: "",
    gender: "male",
    color: "",
    breed: "ไจแอน",
    weight: 100,
    birthDate: "",
    notes: "",
    avatar: "🐹",
  });

  const TabButton: React.FC<{
    id: string;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
  }> = ({ label, icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? "bg-blue-500 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const Switch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }> = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-blue-500" : "bg-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  const addPet = () => {
    const newId = (pets.length + 1).toString();
    setPets([...pets, { ...newPet, id: newId }]);
    setShowAddPet(false);
    setNewPet({
      name: "",
      gender: "male",
      color: "",
      breed: "ไจแอน",
      weight: 100,
      birthDate: "",
      notes: "",
      avatar: "🐹",
    });
  };

  const deletePet = (id: string) => {
    setPets(pets.filter((p) => p.id !== id));
  };

  const updatePet = (id: string, updates: Partial<PetProfile>) => {
    setPets(pets.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    setEditingPet(null);
  };

  const exportSettings = () => {
    const settings = { pets, notifications, network, system };
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pet-feeder-settings.json";
    link.click();
  };

  const resetSettings = () => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะรีเซ็ตการตั้งค่าทั้งหมด?")) {
      // Reset to defaults
      console.log("Settings reset");
    }
  };

  const renderPetsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          ข้อมูลสัตว์เลี้ยง
        </h3>
        <button
          onClick={() => setShowAddPet(!showAddPet)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มสัตว์เลี้ยง
        </button>
      </div>

      {/* Add Pet Form */}
      {showAddPet && (
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-4">
            เพิ่มสัตว์เลี้ยงใหม่
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                ชื่อ
              </label>
              <input
                type="text"
                value={newPet.name}
                onChange={(e) =>
                  setNewPet((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full p-2 border border-blue-300 rounded-md"
                placeholder="ชื่อสัตว์เลี้ยง"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                เพศ
              </label>
              <select
                value={newPet.gender}
                onChange={(e) =>
                  setNewPet((prev) => ({
                    ...prev,
                    gender: e.target.value as "male" | "female",
                  }))
                }
                className="w-full p-2 border border-blue-300 rounded-md"
              >
                <option value="male">ผู้</option>
                <option value="female">เมีย</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                สี
              </label>
              <input
                type="text"
                value={newPet.color}
                onChange={(e) =>
                  setNewPet((prev) => ({ ...prev, color: e.target.value }))
                }
                className="w-full p-2 border border-blue-300 rounded-md"
                placeholder="เช่น ส้มตัดขาว"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                น้ำหนัก (g)
              </label>
              <input
                type="number"
                value={newPet.weight}
                onChange={(e) =>
                  setNewPet((prev) => ({
                    ...prev,
                    weight: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border border-blue-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-700 mb-1">
                หมายเหตุ
              </label>
              <textarea
                value={newPet.notes}
                onChange={(e) =>
                  setNewPet((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="w-full p-2 border border-blue-300 rounded-md"
                rows={2}
                placeholder="นิสัย อาหารที่ชอบ เวลาที่ชอบกิน..."
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addPet}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              บันทึก
            </button>
            <button
              onClick={() => setShowAddPet(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Pets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{pet.avatar}</span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {pet.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {pet.breed} • {pet.gender === "male" ? "ผู้" : "เมีย"}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    setEditingPet(editingPet === pet.id ? null : pet.id)
                  }
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletePet(pet.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {editingPet === pet.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={pet.name}
                  onChange={(e) => updatePet(pet.id, { name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  value={pet.color}
                  onChange={(e) => updatePet(pet.id, { color: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="สี"
                />
                <input
                  type="number"
                  value={pet.weight}
                  onChange={(e) =>
                    updatePet(pet.id, { weight: Number(e.target.value) })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="น้ำหนัก (g)"
                />
                <textarea
                  value={pet.notes}
                  onChange={(e) => updatePet(pet.id, { notes: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={2}
                  placeholder="หมายเหตุ"
                />
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">สี:</span> {pet.color}
                </p>
                <p>
                  <span className="font-medium">น้ำหนัก:</span> {pet.weight}g
                </p>
                <p>
                  <span className="font-medium">หมายเหตุ:</span>{" "}
                  {pet.notes || "ไม่มี"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">
        การตั้งค่าการแจ้งเตือน
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            การแจ้งเตือนระบบ
          </h4>

          {[
            { key: "lowFood", label: "อาหารเหลือน้อย (< 20%)", icon: "🍽️" },
            { key: "lowWater", label: "น้ำเหลือน้อย (< 30%)", icon: "💧" },
            { key: "systemErrors", label: "ข้อผิดพลาดระบบ", icon: "⚠️" },
            { key: "maintenanceAlerts", label: "การบำรุงรักษา", icon: "🔧" },
          ].map(({ key, label, icon }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span>{icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
              </div>
              <Switch
                checked={notifications[key as keyof NotificationSettings]}
                onChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            การแจ้งเตือนกิจกรรม
          </h4>

          {[
            {
              key: "feedingComplete",
              label: "การให้อาหารเสร็จสิ้น",
              icon: "✅",
            },
            { key: "scheduleReminders", label: "เตือนตารางเวลา", icon: "⏰" },
            { key: "soundEnabled", label: "เสียงแจ้งเตือน", icon: "🔊" },
            {
              key: "pushNotifications",
              label: "Push Notifications",
              icon: "📱",
            },
          ].map(({ key, label, icon }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span>{icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
              </div>
              <Switch
                checked={notifications[key as keyof NotificationSettings]}
                onChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNetworkTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">
        การตั้งค่าเครือข่าย
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WiFi Settings */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-blue-600" />
            การตั้งค่า WiFi
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SSID
              </label>
              <input
                type="text"
                value={network.wifiSSID}
                onChange={(e) =>
                  setNetwork((prev) => ({ ...prev, wifiSSID: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={network.wifiPassword}
                  onChange={(e) =>
                    setNetwork((prev) => ({
                      ...prev,
                      wifiPassword: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-md pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                เชื่อมต่ออัตโนมัติ
              </span>
              <Switch
                checked={network.autoReconnect}
                onChange={(checked) =>
                  setNetwork((prev) => ({ ...prev, autoReconnect: checked }))
                }
              />
            </div>
          </div>
        </div>

        {/* IoT Settings */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-600" />
            การตั้งค่า IoT Platform
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MQTT Broker
              </label>
              <input
                type="text"
                value={network.mqttBroker}
                onChange={(e) =>
                  setNetwork((prev) => ({
                    ...prev,
                    mqttBroker: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Port
              </label>
              <input
                type="number"
                value={network.mqttPort}
                onChange={(e) =>
                  setNetwork((prev) => ({
                    ...prev,
                    mqttPort: Number(e.target.value),
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device ID
              </label>
              <input
                type="text"
                value={network.deviceId}
                onChange={(e) =>
                  setNetwork((prev) => ({ ...prev, deviceId: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-md"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">การตั้งค่าระบบ</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-purple-600" />
            การตั้งค่าทั่วไป
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เขตเวลา
              </label>
              <select
                value={system.timeZone}
                onChange={(e) =>
                  setSystem((prev) => ({ ...prev, timeZone: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                <option value="America/New_York">
                  America/New_York (UTC-5)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ภาษา
              </label>
              <select
                value={system.language}
                onChange={(e) =>
                  setSystem((prev) => ({ ...prev, language: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="th-TH">ไทย</option>
                <option value="en-US">English</option>
                <option value="ja-JP">日本語</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                หน่วยการวัด
              </label>
              <select
                value={system.units}
                onChange={(e) =>
                  setSystem((prev) => ({
                    ...prev,
                    units: e.target.value as "metric" | "imperial",
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="metric">เมตริก (กรัม, เซลเซียส)</option>
                <option value="imperial">อิมพีเรียล (ออนซ์, ฟาเรนไฮท์)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-600" />
            การตั้งค่าขั้นสูง
          </h4>
          <div className="space-y-4">
            {[
              {
                key: "autoUpdate",
                label: "อัพเดทอัตโนมัติ",
                desc: "อัพเดท firmware อัตโนมัติ",
              },
              {
                key: "debugMode",
                label: "โหมด Debug",
                desc: "แสดงข้อมูลดีบัก (สำหรับนักพัฒนา)",
              },
              {
                key: "maintenanceMode",
                label: "โหมดบำรุงรักษา",
                desc: "หยุดการทำงานชั่วคราวเพื่อบำรุงรักษา",
              },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    {label}
                  </div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
                <Switch
                  checked={system[key as keyof SystemSettings] as boolean}
                  onChange={(checked) =>
                    setSystem((prev) => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เก็บข้อมูล (วัน)
              </label>
              <input
                type="number"
                value={system.dataRetention}
                onChange={(e) =>
                  setSystem((prev) => ({
                    ...prev,
                    dataRetention: Number(e.target.value),
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-md"
                min="1"
                max="365"
              />
              <p className="text-xs text-gray-500 mt-1">
                ระบบจะลบข้อมูลเก่าหลังจากระยะเวลาที่กำหนด
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={exportSettings}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          ส่งออกการตั้งค่า
        </button>
        <button
          onClick={() => document.getElementById("import-file")?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Upload className="w-4 h-4" />
          นำเข้าการตั้งค่า
        </button>
        <button
          onClick={resetSettings}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          รีเซ็ตทั้งหมด
        </button>
        <input
          id="import-file"
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const importedSettings = JSON.parse(
                    event.target?.result as string
                  );
                  if (importedSettings.pets) setPets(importedSettings.pets);
                  if (importedSettings.notifications)
                    setNotifications(importedSettings.notifications);
                  if (importedSettings.network)
                    setNetwork(importedSettings.network);
                  if (importedSettings.system)
                    setSystem(importedSettings.system);
                  alert("นำเข้าการตั้งค่าเรียบร้อยแล้ว!");
                } catch (error) {
                  alert("ไฟล์การตั้งค่าไม่ถูกต้อง!");
                }
              };
              reader.readAsText(file);
            }
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          การตั้งค่าระบบ
        </h2>
        <p className="text-gray-600">
          จัดการการตั้งค่าทั้งหมดของระบบให้อาหารอัตโนมัติ
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl">
        <TabButton
          id="pets"
          label="สัตว์เลี้ยง"
          icon={<Heart className="w-4 h-4" />}
          isActive={activeTab === "pets"}
          onClick={() => setActiveTab("pets")}
        />
        <TabButton
          id="notifications"
          label="การแจ้งเตือน"
          icon={<Bell className="w-4 h-4" />}
          isActive={activeTab === "notifications"}
          onClick={() => setActiveTab("notifications")}
        />
        <TabButton
          id="network"
          label="เครือข่าย"
          icon={<Wifi className="w-4 h-4" />}
          isActive={activeTab === "network"}
          onClick={() => setActiveTab("network")}
        />
        <TabButton
          id="system"
          label="ระบบ"
          icon={<SettingsIcon className="w-4 h-4" />}
          isActive={activeTab === "system"}
          onClick={() => setActiveTab("system")}
        />
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === "pets" && renderPetsTab()}
        {activeTab === "notifications" && renderNotificationsTab()}
        {activeTab === "network" && renderNetworkTab()}
        {activeTab === "system" && renderSystemTab()}
      </div>
    </div>
  );
};

export default Settings;

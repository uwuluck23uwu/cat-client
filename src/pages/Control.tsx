import React, { useState } from "react";
import {
  Zap,
  Play,
  Square,
  Gauge,
  Power,
  Settings2,
  Calendar,
  Plus,
  Trash2,
} from "lucide-react";
import CameraView from "../components/CameraView";

interface FeedingSchedule {
  id: string;
  time: string;
  enabled: boolean;
  portion: "small" | "medium" | "large";
  days: number[];
}

interface SystemControl {
  servoAngle: number;
  feedingDuration: number;
  motorSpeed: number;
  systemEnabled: boolean;
}

const Control: React.FC = () => {
  const [isFeeding, setIsFeeding] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [feedingProgress, setFeedingProgress] = useState(0);
  const [selectedPortion, setSelectedPortion] = useState<
    "small" | "medium" | "large"
  >("medium");
  const [customDuration, setCustomDuration] = useState(3);
  const [systemControl, setSystemControl] = useState<SystemControl>({
    servoAngle: 90,
    feedingDuration: 3,
    motorSpeed: 100,
    systemEnabled: true,
  });
  const [schedules, setSchedules] = useState<FeedingSchedule[]>([
    {
      id: "1",
      time: "08:30",
      enabled: true,
      portion: "medium",
      days: [1, 2, 3, 4, 5, 6, 0],
    },
    {
      id: "2",
      time: "12:00",
      enabled: true,
      portion: "medium",
      days: [1, 2, 3, 4, 5, 6, 0],
    },
    {
      id: "3",
      time: "18:30",
      enabled: true,
      portion: "medium",
      days: [1, 2, 3, 4, 5, 6, 0],
    },
    { id: "4", time: "22:00", enabled: false, portion: "small", days: [6, 0] },
  ]);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    time: "09:00",
    portion: "medium" as "small" | "medium" | "large",
    days: [1, 2, 3, 4, 5, 6, 0],
  });

  const portionSizes = {
    small: { amount: 3, duration: 2, label: "เล็ก (3g)" },
    medium: { amount: 5, duration: 3, label: "กลาง (5g)" },
    large: { amount: 8, duration: 5, label: "ใหญ่ (8g)" },
  };

  const dayNames = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  // Simulate feeding process
  const startFeeding = async () => {
    if (isFeeding) return;

    setIsFeeding(true);
    setFeedingProgress(0);

    const duration = customDuration * 1000; // Convert to milliseconds
    const interval = 50; // Update every 50ms
    const totalSteps = duration / interval;

    for (let step = 0; step <= totalSteps; step++) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      setFeedingProgress((step / totalSteps) * 100);
    }

    setIsFeeding(false);
    setFeedingProgress(0);
  };

  const emergencyStop = () => {
    setIsFeeding(false);
    setFeedingProgress(0);
  };

  const testServo = () => {
    // Simulate servo test
    console.log(`Testing servo at ${systemControl.servoAngle}°`);
  };

  const addSchedule = () => {
    const newId = (schedules.length + 1).toString();
    setSchedules([
      ...schedules,
      {
        id: newId,
        time: newSchedule.time,
        enabled: true,
        portion: newSchedule.portion,
        days: newSchedule.days,
      },
    ]);
    setShowAddSchedule(false);
    setNewSchedule({
      time: "09:00",
      portion: "medium",
      days: [1, 2, 3, 4, 5, 6, 0],
    });
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const toggleSchedule = (id: string) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const toggleDay = (scheduleId: string, day: number) => {
    setSchedules(
      schedules.map((s) =>
        s.id === scheduleId
          ? {
              ...s,
              days: s.days.includes(day)
                ? s.days.filter((d) => d !== day)
                : [...s.days, day].sort(),
            }
          : s
      )
    );
  };

  const ControlCard: React.FC<{
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
  }> = ({ title, children, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Button: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "danger" | "success";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
    icon?: React.ReactNode;
  }> = ({
    onClick,
    disabled = false,
    variant = "primary",
    size = "md",
    children,
    icon,
  }) => {
    const baseClasses =
      "flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      primary:
        "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
      danger:
        "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg",
      success:
        "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg",
    };

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg",
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${
          sizeClasses[size]
        } ${disabled ? "" : "hover:scale-105"}`}
      >
        {icon}
        {children}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ระบบควบคุมการให้อาหาร
        </h2>
        <p className="text-gray-600">
          ควบคุมระบบ Servo Motor และจัดการตารางเวลา
        </p>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Power
              className={`w-6 h-6 ${
                systemControl.systemEnabled ? "text-green-500" : "text-red-500"
              }`}
            />
            <span className="font-semibold text-gray-800">
              สถานะระบบ:{" "}
              {systemControl.systemEnabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
            </span>
          </div>
          <Button
            onClick={() =>
              setSystemControl((prev) => ({
                ...prev,
                systemEnabled: !prev.systemEnabled,
              }))
            }
            variant={systemControl.systemEnabled ? "danger" : "success"}
            size="sm"
          >
            {systemControl.systemEnabled ? "ปิดระบบ" : "เปิดระบบ"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Feeding Control */}
        <ControlCard
          title="ให้อาหารด้วยตนเอง"
          icon={<Zap className="w-5 h-5 text-blue-600" />}
        >
          <div className="space-y-4">
            {/* Portion Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เลือกขนาดอาหาร
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(portionSizes).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedPortion(key as "small" | "medium" | "large");
                      setCustomDuration(value.duration);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedPortion === key
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm font-medium">{value.label}</div>
                    <div className="text-xs text-gray-500">
                      {value.duration}s
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ระยะเวลา (วินาที): {customDuration}s
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={customDuration}
                onChange={(e) => setCustomDuration(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={isFeeding}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1s</span>
                <span>10s</span>
              </div>
            </div>

            {/* Feeding Progress */}
            {isFeeding && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">
                    กำลังให้อาหาร...
                  </span>
                  <span className="text-sm text-blue-600">
                    {feedingProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-100"
                    style={{ width: `${feedingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={startFeeding}
                disabled={isFeeding || !systemControl.systemEnabled}
                variant="success"
                icon={<Play className="w-4 h-4" />}
              >
                เริ่มให้อาหาร
              </Button>
              <Button
                onClick={emergencyStop}
                disabled={!isFeeding}
                variant="danger"
                icon={<Square className="w-4 h-4" />}
              >
                หยุดฉุกเฉิน
              </Button>
            </div>
          </div>
        </ControlCard>

        {/* Servo Motor Control */}
        <ControlCard
          title="ควบคุม Servo Motor"
          icon={<Settings2 className="w-5 h-5 text-orange-600" />}
        >
          <div className="space-y-4">
            {/* Servo Angle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                มุม Servo: {systemControl.servoAngle}°
              </label>
              <input
                type="range"
                min="0"
                max="180"
                value={systemControl.servoAngle}
                onChange={(e) =>
                  setSystemControl((prev) => ({
                    ...prev,
                    servoAngle: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={isFeeding}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0°</span>
                <span>90°</span>
                <span>180°</span>
              </div>
            </div>

            {/* Motor Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ความเร็วมอเตอร์: {systemControl.motorSpeed}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={systemControl.motorSpeed}
                onChange={(e) =>
                  setSystemControl((prev) => ({
                    ...prev,
                    motorSpeed: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={isFeeding}
              />
            </div>

            <Button
              onClick={testServo}
              disabled={isFeeding || !systemControl.systemEnabled}
              variant="secondary"
              icon={<Gauge className="w-4 h-4" />}
            >
              ทดสอบ Servo
            </Button>
          </div>
        </ControlCard>
      </div>

      {/* Feeding Schedule Management */}
      <ControlCard
        title="จัดการตารางเวลาให้อาหาร"
        icon={<Calendar className="w-5 h-5 text-purple-600" />}
      >
        <div className="space-y-4">
          {/* Add Schedule Button */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              ตารางเวลาปัจจุบัน ({schedules.length} รายการ)
            </span>
            <Button
              onClick={() => setShowAddSchedule(!showAddSchedule)}
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              เพิ่มตารางเวลา
            </Button>
          </div>

          {/* Add Schedule Form */}
          {showAddSchedule && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-3">
                เพิ่มตารางเวลาใหม่
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">
                    เวลา
                  </label>
                  <input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) =>
                      setNewSchedule((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-blue-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">
                    ขนาดอาหาร
                  </label>
                  <select
                    value={newSchedule.portion}
                    onChange={(e) =>
                      setNewSchedule((prev) => ({
                        ...prev,
                        portion: e.target.value as "small" | "medium" | "large",
                      }))
                    }
                    className="w-full p-2 border border-blue-300 rounded-md text-sm"
                  >
                    <option value="small">เล็ก (3g)</option>
                    <option value="medium">กลาง (5g)</option>
                    <option value="large">ใหญ่ (8g)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addSchedule} variant="success" size="sm">
                    บันทึก
                  </Button>
                  <Button
                    onClick={() => setShowAddSchedule(false)}
                    variant="secondary"
                    size="sm"
                  >
                    ยกเลิก
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Schedule List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        schedule.enabled ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <span className="font-medium text-gray-800">
                      {schedule.time} น.
                    </span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {portionSizes[schedule.portion].label}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSchedule(schedule.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        schedule.enabled
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {schedule.enabled ? "เปิด" : "ปิด"}
                    </button>
                    <button
                      onClick={() => deleteSchedule(schedule.id)}
                      className="px-2 py-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Days Selection */}
                <div className="flex gap-1">
                  {dayNames.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => toggleDay(schedule.id, index)}
                      className={`w-8 h-8 text-xs font-medium rounded-full transition-colors ${
                        schedule.days.includes(index)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ControlCard>

      <CameraView isOpen={showCamera} onClose={() => setShowCamera(false)} />
    </div>
  );
};

export default Control;

import React from "react";
import { Home, Monitor, Settings, Zap, type LucideIcon } from "lucide-react";
import type { TabType } from "../types";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface TabButtonProps {
  id: TabType;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: (id: TabType) => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  id,
  icon: Icon,
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
      isActive
        ? "bg-blue-500 text-white shadow-lg transform scale-105"
        : "bg-white text-gray-600 hover:bg-gray-50 hover:scale-102 hover:shadow-md"
    }`}
  >
    <Icon size={24} className="mb-2" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems: Array<{
    id: TabType;
    icon: LucideIcon;
    label: string;
  }> = [
    { id: "dashboard", icon: Home, label: "หน้าหลัก" },
    { id: "monitor", icon: Monitor, label: "ติดตาม" },
    { id: "control", icon: Zap, label: "ควบคุม" },
    { id: "settings", icon: Settings, label: "ตั้งค่า" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
      <h3 className="font-semibold text-gray-800 text-center mb-4">เมนูหลัก</h3>
      {menuItems.map((item) => (
        <TabButton
          key={item.id}
          id={item.id}
          icon={item.icon}
          label={item.label}
          isActive={activeTab === item.id}
          onClick={onTabChange}
        />
      ))}
    </div>
  );
};

export default Sidebar;

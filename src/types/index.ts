export type TabType = "dashboard" | "monitor" | "control" | "settings";

export interface SystemStatus {
  wifiConnected: boolean;
  iotConnected: boolean;
  systemOnline: boolean;
  lastUpdate: Date;
}

export interface SensorData {
  foodLevel: number;
  waterLevel: number;
  temperature: number;
  humidity: number;
  lastFeedTime: Date;
  nextFeedTime: Date;
  dailyFeedings: number;
}

export interface FeedingHistory {
  id: string;
  timestamp: Date;
  amount: number;
  duration: number;
  trigger: "scheduled" | "manual" | "app";
  success: boolean;
}

export interface NotificationData {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface PetInfo {
  name: string;
  gender: "male" | "female";
  color: string;
  breed: string;
}

export interface SystemSettings {
  feedingSchedule: FeedingSchedule[];
  portions: {
    small: number;
    medium: number;
    large: number;
  };
  notifications: {
    lowFood: boolean;
    lowWater: boolean;
    feedingComplete: boolean;
    systemErrors: boolean;
  };
  pets: PetInfo[];
}

export interface FeedingSchedule {
  id: string;
  time: string;
  enabled: boolean;
  portion: "small" | "medium" | "large";
  days: number[];
}

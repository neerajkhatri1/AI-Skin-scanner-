export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  skinType: string;
  allergies: string;
  history: string;
  medications: string;
  language: "en" | "ur";
}

export interface Medication {
  name: string;
  pakistaniBrand: string;
  dosage: string;
  frequency: string;
  duration: string;
  method: string;
}

export interface Prescription {
  required: boolean;
  warningText: string;
  medications: Medication[];
}

export interface OtcMedicine {
  category: "Facewash" | "Cream" | "Serum" | "Tablet" | "Soap" | "Lotion";
  genericName: string;
  pakistaniMarketName: string;
  howToUse: string;
  warnings: string[];
}

export interface ScanResult {
  conditionName: string;
  urduConditionName: string;
  confidence: number;
  severity: "Mild" | "Moderate" | "Severe";
  description: string;
  urduDescription: string;
  causes: string[];
  symptoms: string[];
  preventionTips: string[];
  morningSkincare: string[];
  nightSkincare: string[];
  nutritionAdvice: string[];
  hydrationGoal: string;
  lifestyleTips: string[];
  otcMedicines: OtcMedicine[];
  prescription: Prescription;
  isEmergency: boolean;
  emergencyWarning?: string;
  imageUrl?: string;
  timestamp?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface TrackDay {
  date: string; // YYYY-MM-DD
  score: number;
  photo?: string;
  waterIntake: number; // glasses or liters (e.g. out of 8/10)
  sleepHours: number;
  notes: string;
  checkedMorningRoutine: boolean;
  checkedNightRoutine: boolean;
}

export interface SkinArticle {
  id: string;
  title: string;
  urduTitle: string;
  category: string;
  readTime: string;
  image: string;
  summary: string;
  urduSummary: string;
  content: string[];
}

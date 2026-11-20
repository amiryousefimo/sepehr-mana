export type PriorityLevel = 'critical' | 'high' | 'medium' | 'normal';

export type IssueStatus = 'new' | 'investigating' | 'referred' | 'in_progress' | 'resolved';

export type IssueCategory = 
  | 'waterlogging'      // آبگرفتگی معابر
  | 'asphalt'           // خرابی آسفالت
  | 'lighting'          // خرابی روشنایی
  | 'obstruction'       // سد معبر
  | 'waste'             // جمع‌آوری پسماند
  | 'traffic_signs'     // خرابی علائم ترافیکی
  | 'greenery';         // فضای سبز و درختان

export interface CitizenReport {
  id: string;
  issueId?: string;
  text: string;
  timestamp: string;
  locationName: string;
  lat: number;
  lng: number;
  district: number;
  category: IssueCategory;
  sentiment?: 'urgent' | 'moderate' | 'neutral';
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  type: 'system' | 'user' | 'analysis' | 'referral';
}

export interface PriorityBreakdown {
  score: number; // 0 - 100 (e.g. 89)
  severity: 'بسیار زیاد' | 'زیاد' | 'متوسط' | 'کم';
  frequency: 'بسیار زیاد' | 'زیاد' | 'متوسط' | 'کم';
  waitTime: 'بسیار زیاد' | 'زیاد' | 'متوسط' | 'کم' | 'حل‌شده';
  areaImportance: 'بسیار زیاد' | 'زیاد' | 'متوسط' | 'کم';
  logicExplanation: string;
}

export interface UrbanIssue {
  id: string;
  title: string;
  category: IssueCategory;
  categoryTitle: string;
  priority: PriorityLevel;
  priorityTitle: string;
  status: IssueStatus;
  statusTitle: string;
  district: number;
  districtName: string;
  locationName: string;
  lat: number;
  lng: number;
  reportsCount: number;
  createdAt: string;
  updatedAt: string;
  isScenarioGenerated?: boolean;
  isCriticalHotspot?: boolean;
  isManuallyOverridden?: boolean;
  manualOverrideReason?: string;
  manualOverrideTimestamp?: string;
  aiSummary: string;
  priorityScore: PriorityBreakdown;
  suggestedUnit: {
    unitName: string;
    subUnit: string;
    description: string;
  };
  reports: CitizenReport[];
  timeline: TimelineEvent[];
}

export type ViewMode = 'admin' | 'citizen';

export type ActivePage = 'dashboard' | 'issues' | 'analytics';

export interface FilterState {
  district: number | 'all';
  category: IssueCategory | 'all';
  priority: PriorityLevel | 'all';
  status: IssueStatus | 'all';
  timeRange: 'today' | '24h' | 'week' | 'all';
  searchQuery: string;
}

export interface ScenarioStep {
  stepNumber: number;
  title: string;
  description: string;
  status: 'idle' | 'running' | 'completed';
}

export interface ScenarioStatus {
  isActive: boolean;
  step: number; // 0: inactive, 1: reports incoming, 2: semantic analysis, 3: cluster formation, 4: critical hotspot, 5: finished/ready
  isProcessing: boolean;
  progressPercent: number;
  statusText: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description?: string;
  duration?: number;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UrbanIssue, 
  ViewMode, 
  ActivePage, 
  FilterState, 
  ScenarioStatus, 
  ToastMessage,
  IssueCategory,
  PriorityLevel,
  IssueStatus
} from '../types';
import { INITIAL_ISSUES, RAIN_SCENARIO_ISSUE, PRIORITY_MAP, MUNICIPAL_UNITS } from '../data/mockData';

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  
  // Data
  issues: UrbanIssue[];
  totalReportsCount: number;
  totalIssuesCount: number;
  criticalIssuesCount: number;
  pendingIssuesCount: number;

  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredIssues: UrbanIssue[];

  // Scenario
  scenario: ScenarioStatus;
  runRainScenario: () => void;
  resetScenario: () => void;
  showScenarioSummary: boolean;
  setShowScenarioSummary: (show: boolean) => void;

  // Issue details & actions
  selectedIssue: UrbanIssue | null;
  setSelectedIssue: (issue: UrbanIssue | null) => void;
  openIssueDetails: (issueId: string) => void;
  closeIssueDetails: () => void;
  updateManualOverride: (
    issueId: string, 
    newPriority: PriorityLevel, 
    newUnit: { unitName: string; subUnit: string; description: string }, 
    reason?: string
  ) => void;
  
  // Referral Modal
  referralModalIssue: UrbanIssue | null;
  setReferralModalIssue: (issue: UrbanIssue | null) => void;
  confirmReferral: (issueId: string, unitName: string) => void;

  // Map state
  mapCenter: [number, number];
  mapZoom: number;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  flyToLocation: (lat: number, lng: number, zoom?: number) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Splash Screen
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
}

const DEFAULT_FILTERS: FilterState = {
  district: 'all',
  category: 'all',
  priority: 'all',
  status: 'all',
  timeRange: 'all',
  searchQuery: '',
};

const DEFAULT_MAP_CENTER: [number, number] = [35.7050, 51.3900];
const DEFAULT_MAP_ZOOM = 12;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('admin');
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [showSplash, setShowSplash] = useState<boolean>(true);
  
  // Stored state or defaults
  const [issues, setIssues] = useState<UrbanIssue[]>(() => {
    const saved = localStorage.getItem('shahragah_scenario_active');
    if (saved === 'true') {
      return [RAIN_SCENARIO_ISSUE, ...INITIAL_ISSUES];
    }
    return INITIAL_ISSUES;
  });

  const [scenario, setScenario] = useState<ScenarioStatus>(() => {
    const saved = localStorage.getItem('shahragah_scenario_active');
    if (saved === 'true') {
      return {
        isActive: true,
        step: 5,
        isProcessing: false,
        progressPercent: 100,
        statusText: 'سناریوی بارندگی فعال و تحلیل‌شده',
      };
    }
    return {
      isActive: false,
      step: 0,
      isProcessing: false,
      progressPercent: 0,
      statusText: 'آماده اجرای سناریوی شبیه‌سازی',
    };
  });

  const [showScenarioSummary, setShowScenarioSummary] = useState<boolean>(() => {
    return localStorage.getItem('shahragah_scenario_active') === 'true';
  });

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedIssue, setSelectedIssue] = useState<UrbanIssue | null>(null);
  const [referralModalIssue, setReferralModalIssue] = useState<UrbanIssue | null>(null);

  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_MAP_ZOOM);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const flyToLocation = (lat: number, lng: number, zoom = 14) => {
    setMapCenter([lat, lng]);
    setMapZoom(zoom);
  };

  // KPIs
  const totalReportsCount = scenario.isActive ? 280 : 248;
  const totalIssuesCount = scenario.isActive ? 77 : 76;
  const criticalIssuesCount = scenario.isActive ? 9 : 8;
  const pendingIssuesCount = scenario.isActive ? 20 : 19;

  // Filtered issues
  const filteredIssues = issues.filter((issue) => {
    if (filters.district !== 'all' && issue.district !== filters.district) {
      return false;
    }
    if (filters.category !== 'all' && issue.category !== filters.category) {
      return false;
    }
    if (filters.priority !== 'all' && issue.priority !== filters.priority) {
      return false;
    }
    if (filters.status !== 'all' && issue.status !== filters.status) {
      return false;
    }
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      const match = 
        issue.title.toLowerCase().includes(q) ||
        issue.locationName.toLowerCase().includes(q) ||
        issue.districtName.toLowerCase().includes(q) ||
        issue.categoryTitle.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const openIssueDetails = (issueId: string) => {
    const found = issues.find((i) => i.id === issueId);
    if (found) {
      setSelectedIssue(found);
    }
  };

  const closeIssueDetails = () => {
    setSelectedIssue(null);
  };

  // Step-by-step Rain Scenario
  const runRainScenario = () => {
    if (scenario.isProcessing) return;

    setScenario({
      isActive: true,
      step: 1,
      isProcessing: true,
      progressPercent: 20,
      statusText: 'مرحله ۱: دریافت ۳۲ گزارش جدید شهروندی پیرامون بارندگی شدید...',
    });

    addToast({
      type: 'info',
      title: 'ورود ۳۲ گزارش جدید',
      description: 'گزارش‌های شهروندی با موضوع بارندگی و آبگرفتگی در حال ثبت در سامانه هستند.',
      duration: 3500,
    });

    // Step 2: Semantic Analysis
    setTimeout(() => {
      setScenario({
        isActive: true,
        step: 2,
        isProcessing: true,
        progressPercent: 50,
        statusText: 'مرحله ۲: در حال تحلیل معنایی و مکانی گزارش‌ها توسط موتور هوشمند...',
      });

      addToast({
        type: 'info',
        title: 'تحلیل داده‌های شهری',
        description: 'شناسایی الگوهای همبستگی مکانی و تجمیع گزارش‌های هم‌پوشان.',
        duration: 3000,
      });
    }, 1800);

    // Step 3: Cluster Formation
    setTimeout(() => {
      // Add the scenario issue into issues list
      setIssues((prev) => {
        if (prev.some((i) => i.id === RAIN_SCENARIO_ISSUE.id)) return prev;
        return [RAIN_SCENARIO_ISSUE, ...prev];
      });

      setScenario({
        isActive: true,
        step: 3,
        isProcessing: true,
        progressPercent: 75,
        statusText: 'مرحله ۳: تشکیل خوشه بحرانی آبگرفتگی روی نقشه...',
      });
    }, 3600);

    // Step 4 & 5: Critical hotspot identified + zoom to Sadeghiyeh + show summary
    setTimeout(() => {
      // Pan & zoom map to Sadeghiyeh
      flyToLocation(RAIN_SCENARIO_ISSUE.lat, RAIN_SCENARIO_ISSUE.lng, 15);

      setScenario({
        isActive: true,
        step: 5,
        isProcessing: false,
        progressPercent: 100,
        statusText: 'نقطه بحرانی جدید در محدوده صادقیه شناسایی شد',
      });

      setShowScenarioSummary(true);
      localStorage.setItem('shahragah_scenario_active', 'true');

      addToast({
        type: 'warning',
        title: 'نقطه بحرانی جدید شناسایی شد!',
        description: 'آبگرفتگی شدید معابر در صادقیه با اولویت ۸۹ از ۱۰۰ نیاز به بررسی فوری دارد.',
        duration: 6000,
      });
    }, 5400);
  };

  const resetScenario = () => {
    localStorage.removeItem('shahragah_scenario_active');
    setIssues(INITIAL_ISSUES);
    setScenario({
      isActive: false,
      step: 0,
      isProcessing: false,
      progressPercent: 0,
      statusText: 'آماده اجرای سناریوی شبیه‌سازی',
    });
    setShowScenarioSummary(false);
    setMapCenter(DEFAULT_MAP_CENTER);
    setMapZoom(DEFAULT_MAP_ZOOM);
    setSelectedIssue(null);
    setReferralModalIssue(null);

    addToast({
      type: 'info',
      title: 'بازنشانی سناریو',
      description: 'داده‌های سناریوی بارندگی با موفقیت پاکسازی شد و سامانه به حالت اولیه بازگشت.',
      duration: 3500,
    });
  };

  const confirmReferral = (issueId: string, unitName: string) => {
    const foundUnit = MUNICIPAL_UNITS.find(u => u.unitName === unitName);
    const nowStr = 'هم‌اکنون';

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const isModified = item.suggestedUnit.unitName !== unitName;
          const unitObj = foundUnit ? foundUnit : { ...item.suggestedUnit, unitName };
          const newEvent = {
            id: 't-ref-' + Date.now(),
            timestamp: nowStr,
            title: `ارجاع به ${unitName}`,
            description: isModified 
              ? `واحد دریافت‌کننده توسط دیسپاچر به صورت دستی به «${unitName}» تغییر یافت و ابلاغ شد.` 
              : `دستور کار بررسی و رفع مسئله صادر و به کارتابل عملیاتی واحد ارسال گردید.`,
            actor: 'مدیر پایش و هماهنگی بحران شهری',
            type: 'referral' as const,
          };
          return {
            ...item,
            status: 'referred',
            statusTitle: 'ارجاع‌شده',
            suggestedUnit: unitObj,
            isManuallyOverridden: item.isManuallyOverridden || isModified,
            timeline: [newEvent, ...item.timeline],
          };
        }
        return item;
      })
    );

    // Also update selectedIssue if currently opened
    setSelectedIssue((prev) => {
      if (!prev || prev.id !== issueId) return prev;
      const isModified = prev.suggestedUnit.unitName !== unitName;
      const unitObj = foundUnit ? foundUnit : { ...prev.suggestedUnit, unitName };
      return {
        ...prev,
        status: 'referred',
        statusTitle: 'ارجاع‌شده',
        suggestedUnit: unitObj,
        isManuallyOverridden: prev.isManuallyOverridden || isModified,
        timeline: [
          {
            id: 't-ref-' + Date.now(),
            timestamp: nowStr,
            title: `ارجاع به ${unitName}`,
            description: isModified 
              ? `واحد دریافت‌کننده توسط دیسپاچر به صورت دستی به «${unitName}» تغییر یافت و ابلاغ شد.` 
              : `دستور کار بررسی و رفع مسئله صادر و به کارتابل عملیاتی واحد ارسال گردید.`,
            actor: 'مدیر پایش و هماهنگی بحران شهری',
            type: 'referral',
          },
          ...prev.timeline,
        ],
      };
    });

    setReferralModalIssue(null);

    addToast({
      type: 'success',
      title: 'ارجاع با موفقیت ثبت شد',
      description: `مسئله با موفقیت به «${unitName}» ارجاع گردید و در کارتابل پیگیری قرار گرفت.`,
      duration: 5000,
    });
  };

  const updateManualOverride = (
    issueId: string, 
    newPriority: PriorityLevel, 
    newUnit: { unitName: string; subUnit: string; description: string }, 
    reason?: string
  ) => {
    const overrideTime = 'هم‌اکنون';
    const reasonText = reason?.trim() ? reason.trim() : 'بازنگری و تنظیم مجدد کارشناسی توسط اپراتور شیفت';

    const newEvent = {
      id: 't-ovr-' + Date.now(),
      timestamp: overrideTime,
      title: 'بازنگری کارشناسی اولویت و واحد مسئول (Human-in-the-Loop)',
      description: `سطح اولویت به «${PRIORITY_MAP[newPriority].title}» و واحد دریافت‌کننده به «${newUnit.unitName}» تغییر یافت. علت بازنگری: ${reasonText}`,
      actor: 'اپراتور ارشد مرکز پایش',
      type: 'user' as const,
    };

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          return {
            ...item,
            priority: newPriority,
            priorityTitle: PRIORITY_MAP[newPriority].title,
            suggestedUnit: newUnit,
            isManuallyOverridden: true,
            manualOverrideReason: reasonText,
            manualOverrideTimestamp: overrideTime,
            timeline: [newEvent, ...item.timeline],
          };
        }
        return item;
      })
    );

    setSelectedIssue((prev) => {
      if (!prev || prev.id !== issueId) return prev;
      return {
        ...prev,
        priority: newPriority,
        priorityTitle: PRIORITY_MAP[newPriority].title,
        suggestedUnit: newUnit,
        isManuallyOverridden: true,
        manualOverrideReason: reasonText,
        manualOverrideTimestamp: overrideTime,
        timeline: [newEvent, ...prev.timeline],
      };
    });

    addToast({
      type: 'info',
      title: 'بازنگری کارشناسی ثبت شد',
      description: `سطح اولویت به «${PRIORITY_MAP[newPriority].title}» و واحد مسئول به «${newUnit.unitName}» تغییر یافت.`,
      duration: 4000,
    });
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        activePage,
        setActivePage,
        issues,
        totalReportsCount,
        totalIssuesCount,
        criticalIssuesCount,
        pendingIssuesCount,
        filters,
        setFilters,
        resetFilters,
        filteredIssues,
        scenario,
        runRainScenario,
        resetScenario,
        showScenarioSummary,
        setShowScenarioSummary,
        selectedIssue,
        setSelectedIssue,
        openIssueDetails,
        closeIssueDetails,
        updateManualOverride,
        referralModalIssue,
        setReferralModalIssue,
        confirmReferral,
        mapCenter,
        mapZoom,
        setMapCenter,
        setMapZoom,
        flyToLocation,
        toasts,
        addToast,
        removeToast,
        showSplash,
        setShowSplash,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

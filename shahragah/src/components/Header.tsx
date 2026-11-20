import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Users, 
  Clock, 
  CloudRain,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    scenario,
    setShowSplash
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Persian formatted date & time
      const timeStr = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      const dateStr = new Intl.DateTimeFormat('fa-IR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }).format(now);
      setCurrentTime(`${dateStr} - ${timeStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-forest text-white border-b border-forest-dark sticky top-0 z-50 shadow-md" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Title & Typographic Lockup */}
        <div 
          onClick={() => setShowSplash(true)}
          className="flex flex-col items-start cursor-pointer group"
          title="مشاهده معرفی و اینترو تکاپوگران سپهر مانا"
        >
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl sm:text-2xl text-white tracking-wide leading-tight group-hover:text-amber-light transition-colors">
              شــهـــرآگـــاه
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-full border border-white/20 text-white/80 transition-colors">
              <Sparkles className="w-2.5 h-2.5 text-amber" />
              <span>تکاپوگران سپهر مانا</span>
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-white/80 font-normal mt-0.5 tracking-tight">
            سامانه هوشمند پایش و تحلیل مسائل شهری
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="hidden lg:flex items-center gap-3 text-xs bg-forest-dark/80 px-3.5 py-1.5 rounded-lg border border-white/10">
          <div className="flex items-center gap-1.5 text-white/80 font-normal">
            <Clock className="w-3.5 h-3.5 text-amber" />
            <span>{currentTime || 'پنجشنبه، ۲۹ آبان ۱۴۰۵'}</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white/90 font-semibold">داده‌های شبیه‌سازی‌شده</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5 font-normal">
            <span className="text-white/60">وضعیت سناریو:</span>
            {scenario.isActive ? (
              <span className="text-amber font-semibold flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-terracotta animate-bounce" />
                بارندگی فعال
              </span>
            ) : (
              <span className="text-mutedGreen font-semibold">عادی (آماده)</span>
            )}
          </div>
        </div>

        {/* View Mode Switcher & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Toggle between Admin Monitoring Center and Citizen Portal */}
          <div className="flex items-center bg-forest-dark p-1 rounded-xl border border-white/15 shadow-inner">
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'admin'
                  ? 'bg-ivory-surface text-forest shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>مرکز پایش (سازمانی)</span>
            </button>
            <button
              onClick={() => setViewMode('citizen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'citizen'
                  ? 'bg-amber text-darkText shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>نمای شهروندی</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

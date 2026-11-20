import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  ListFilter, 
  BarChart3, 
  CloudRain, 
  RotateCcw
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    viewMode, 
    setViewMode,
    scenario, 
    runRainScenario, 
    resetScenario,
    criticalIssuesCount
  } = useApp();

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'مرکز پایش شهر',
      icon: LayoutDashboard,
      badge: scenario.isActive ? 'بحران فعال' : null,
      badgeColor: 'bg-terracotta text-white',
    },
    {
      id: 'issues' as const,
      label: 'پیگیری و مدیریت مسائل',
      icon: ListFilter,
      badge: `${criticalIssuesCount} بحرانی`,
      badgeColor: 'bg-amber/20 text-amber-dark',
    },
    {
      id: 'analytics' as const,
      label: 'تحلیل و گزارش‌ها',
      icon: BarChart3,
      badge: null,
      badgeColor: '',
    },
  ];

  return (
    <aside className="w-64 bg-forest text-white flex flex-col justify-between p-4 border-l border-forest-dark shrink-0 hidden md:flex min-h-[calc(100vh-65px)]" dir="rtl">
      {/* Navigation Links */}
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-bold text-white/50 px-3 uppercase tracking-wider block mb-2">
            منوی اصلی سامانه
          </span>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id && viewMode === 'admin';
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setViewMode('admin');
                    setActivePage(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-ivory-warm text-forest font-bold shadow-sm'
                      : 'text-white/80 hover:bg-forest-light hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-forest' : 'text-amber'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Scenario Box in Sidebar */}
        <div className="bg-forest-dark/90 p-3.5 rounded-card border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-terracotta" />
              کنترل سناریو
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${scenario.isActive ? 'bg-terracotta text-white' : 'bg-white/10 text-white/60'}`}>
              {scenario.isActive ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
          <p className="text-[11px] text-white/70 leading-relaxed font-normal">
            شبیه‌سازی بارش شدید پاییزی و آبگرفتگی صادقیه تهران.
          </p>
          <div className="space-y-2 pt-1">
            <button
              onClick={runRainScenario}
              disabled={scenario.isProcessing}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                scenario.isActive
                  ? 'bg-white/15 text-white/80 hover:bg-white/20'
                  : 'bg-terracotta hover:bg-terracotta-dark text-white shadow-md'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>{scenario.isActive ? 'اجرای مجدد سناریو' : 'اجرای سناریوی بارندگی'}</span>
            </button>
            {scenario.isActive && (
              <button
                onClick={resetScenario}
                className="w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold text-white/70 hover:text-white bg-forest-light/60 hover:bg-forest-light transition-colors flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>بازنشانی سناریو (Reset)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-white/10 space-y-2 text-[11px] text-white/60 font-normal">
        <div className="flex items-center justify-between">
          <span>وضعیت سامانه:</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            عملیاتی
          </span>
        </div>
        <div className="text-[10px] text-white/50 leading-relaxed">
          شهرآگاه | ویژه ارائه هکاتون طراحی و مدیریت هوشمند شهری
        </div>
      </div>
    </aside>
  );
};

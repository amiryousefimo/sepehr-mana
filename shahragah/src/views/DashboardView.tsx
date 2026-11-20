import React from 'react';
import { useApp } from '../context/AppContext';
import { MapComponent } from '../components/MapComponent';
import { 
  FileText, 
  Layers, 
  AlertTriangle, 
  Clock, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Filter, 
  MapPin, 
  ChevronLeft, 
  Eye, 
  CloudRain,
  TrendingUp,
  CheckCircle2,
  SlidersHorizontal,
  Send
} from 'lucide-react';
import { TEHRAN_DISTRICTS, PRIORITY_MAP, STATUS_MAP } from '../data/mockData';
import { IssueCategory, PriorityLevel, IssueStatus } from '../types';

export const DashboardView: React.FC = () => {
  const {
    totalReportsCount,
    totalIssuesCount,
    criticalIssuesCount,
    pendingIssuesCount,
    scenario,
    runRainScenario,
    resetScenario,
    showScenarioSummary,
    setShowScenarioSummary,
    filters,
    setFilters,
    resetFilters,
    filteredIssues,
    openIssueDetails,
    setReferralModalIssue,
    issues,
  } = useApp();

  // The rainy scenario issue if present
  const rainIssue = issues.find((i) => i.id === 'issue-rain-sadeghiyeh');

  return (
    <div className="space-y-6" dir="rtl">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-forest">مرکز پایش شهر</h2>
          <p className="text-xs sm:text-sm text-slateGreen mt-0.5 font-normal">
            نمای یکپارچه وضعیت مسائل، خوشه‌بندی هوشمند و درخواست‌های شهری
          </p>
        </div>

        {/* Quick Scenario Controls Header Badge */}
        <div className="flex items-center gap-2">
          {scenario.isActive ? (
            <div className="flex items-center gap-2 bg-terracotta/10 border border-terracotta/30 px-3 py-1.5 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-ping" />
              <span className="font-semibold text-terracotta">سناریوی بارندگی فعال است</span>
              <button
                onClick={resetScenario}
                className="text-xs text-forest hover:underline mr-2 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                بازنشانی
              </button>
            </div>
          ) : (
            <button
              onClick={runRainScenario}
              disabled={scenario.isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-terracotta hover:bg-terracotta-dark text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <CloudRain className="w-4 h-4" />
              <span>اجرای سناریوی بارندگی صادقیه</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-ivory-surface p-4 rounded-card border border-borderMuted shadow-sm hover:border-forest/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slateGreen mb-2">
            <span className="font-normal">کل گزارش‌های دریافتی</span>
            <FileText className="w-4 h-4 text-forest" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-forest">
              {totalReportsCount}
            </span>
            <span className="text-xs text-slateGreen font-normal">گزارش مردمی</span>
          </div>
          {scenario.isActive && (
            <div className="text-[11px] text-terracotta mt-2 font-normal flex items-center gap-1">
              <span>+۳۲ گزارش جدید در سناریوی بارندگی</span>
            </div>
          )}
        </div>

        {/* KPI 2 */}
        <div className="bg-ivory-surface p-4 rounded-card border border-borderMuted shadow-sm hover:border-forest/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slateGreen mb-2">
            <span className="font-normal">مسائل شناسایی‌شده</span>
            <Layers className="w-4 h-4 text-amber-dark" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-forest">
              {totalIssuesCount}
            </span>
            <span className="text-xs text-slateGreen font-normal">پرونده فعال</span>
          </div>
          <div className="text-[11px] text-slateGreen mt-2 font-normal">
            تجمیع خودکار بر اساس شباهت مکانی
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-ivory-surface p-4 rounded-card border border-borderMuted shadow-sm hover:border-terracotta/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slateGreen mb-2">
            <span className="font-normal">مسائل با اولویت بحرانی</span>
            <AlertTriangle className="w-4 h-4 text-terracotta" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-terracotta">
              {criticalIssuesCount}
            </span>
            <span className="text-xs text-slateGreen font-normal">مورد فوری</span>
          </div>
          <div className="text-[11px] text-terracotta mt-2 font-normal">
            نیازمند اقدام و ارجاع در کمتر از ۲ ساعت
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-ivory-surface p-4 rounded-card border border-borderMuted shadow-sm hover:border-amber/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slateGreen mb-2">
            <span className="font-normal">در انتظار بررسی و ارجاع</span>
            <Clock className="w-4 h-4 text-amber-dark" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-dark">
              {pendingIssuesCount}
            </span>
            <span className="text-xs text-slateGreen font-normal">مورد در صف</span>
          </div>
          <div className="text-[11px] text-slateGreen mt-2 font-normal">
            تأیید پیشنهاد واحد تخصصی
          </div>
        </div>
      </div>

      {/* Scenario Simulation Spotlight Banner */}
      <div className="bg-gradient-to-r from-forest via-forest to-forest-light text-white p-5 rounded-card-lg border border-forest-dark shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-amber text-darkText text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">
                سناریوی اصلی دمو هکاتون
              </span>
              <span className="text-white/70 text-xs font-normal">شبیه‌سازی رویداد محیطی</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-amber" />
              بارندگی شدید و آبگرفتگی معابر (صادقیه)
            </h3>
            <p className="text-xs text-white/80 leading-relaxed font-normal">
              شبیه‌سازی ورود گزارش‌های متعدد شهروندان در پی بارندگی شدید پاییزی، پردازش معنایی متن‌ها، تشکیل خوشه بحرانی و پیشنهاد هوشمند واحد تخصصی جهت ارجاع فوری.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={runRainScenario}
              disabled={scenario.isProcessing}
              className="px-4 py-2.5 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{scenario.isActive ? 'اجرای مجدد سناریو' : 'اجرای سناریوی بارندگی'}</span>
            </button>
            {scenario.isActive && (
              <button
                onClick={resetScenario}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-white/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>بازنشانی سناریو</span>
              </button>
            )}
          </div>
        </div>

        {/* Running Scenario Progress State */}
        {scenario.isProcessing && (
          <div className="mt-4 pt-3 border-t border-white/15 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                {scenario.statusText}
              </span>
              <span className="text-white/70 font-normal">{scenario.progressPercent}٪</span>
            </div>
            <div className="w-full bg-forest-dark h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber h-full transition-all duration-500 rounded-full"
                style={{ width: `${scenario.progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Critical Hotspot Analysis Summary Panel (Stage 5 result) */}
      {showScenarioSummary && rainIssue && (
        <div className="bg-ivory-surface p-5 rounded-card-lg border-2 border-terracotta shadow-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-borderMuted">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-terracotta/20 text-terracotta flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-forest">
                  یک نقطه بحرانی جدید شناسایی شد
                </h4>
                <span className="text-xs text-slateGreen font-normal">
                  نتیجه تحلیل هوشمند شباهت معنایی و مکانی گزارش‌ها
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-terracotta text-white font-semibold px-3 py-1 rounded-md">
                اولویت پیشنهادی: بحرانی ({rainIssue.priorityScore.score} از ۱۰۰)
              </span>
              <button
                onClick={() => setShowScenarioSummary(false)}
                className="text-xs text-slateGreen hover:text-darkText px-2 py-1 font-normal"
              >
                بستن کادر
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 py-3 text-xs">
            <div>
              <span className="text-slateGreen block text-[11px] mb-0.5 font-normal">نوع مسئله:</span>
              <span className="font-semibold text-darkText">آبگرفتگی معابر</span>
            </div>
            <div>
              <span className="text-slateGreen block text-[11px] mb-0.5 font-normal">تعداد گزارش‌های مرتبط:</span>
              <span className="font-bold text-terracotta text-sm">۳۲ گزارش</span>
            </div>
            <div>
              <span className="text-slateGreen block text-[11px] mb-0.5 font-normal">محدوده شهری:</span>
              <span className="font-semibold text-darkText">صادقیه، تهران</span>
            </div>
            <div>
              <span className="text-slateGreen block text-[11px] mb-0.5 font-normal">بازه گزارش‌ها:</span>
              <span className="font-normal text-darkText">۵ ساعت اخیر</span>
            </div>
            <div>
              <span className="text-slateGreen block text-[11px] mb-0.5 font-normal">وضعیت:</span>
              <span className="font-semibold text-amber-dark">در انتظار بررسی مسئول</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-ivory-warm p-3 rounded-lg border border-borderMuted">
            <p className="text-xs text-darkText/90 leading-relaxed max-w-2xl font-normal">
              تراکم بالای گزارش‌ها در محدوده فلکه دوم صادقیه نشان‌دهنده انسداد کانال خروجی آب و سرریز به معبر اصلی است.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openIssueDetails(rainIssue.id)}
                className="px-4 py-2 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                مشاهده پرونده تفصیلی
              </button>
              <button
                onClick={() => setReferralModalIssue(rainIssue)}
                className="px-4 py-2 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                ارجاع فوری به خدمات شهری
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-ivory-surface p-4 rounded-card border border-borderMuted shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-forest">
            <SlidersHorizontal className="w-4 h-4 text-amber" />
            <span>فیلتر و پایش هدفمند مسائل</span>
          </div>
          {(filters.district !== 'all' || filters.category !== 'all' || filters.priority !== 'all' || filters.status !== 'all' || filters.searchQuery !== '') && (
            <button
              onClick={resetFilters}
              className="text-xs text-slateGreen hover:text-darkText font-normal"
            >
              پاک کردن همه فیلترها
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* District Filter */}
          <div>
            <label className="block text-[11px] text-slateGreen mb-1 font-normal">منطقه شهرداری:</label>
            <select
              value={filters.district}
              onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value === 'all' ? 'all' : Number(e.target.value) }))}
              className="w-full p-2 rounded-lg border border-borderMuted bg-white text-darkText focus:outline-none focus:border-forest"
            >
              <option value="all">همه مناطق تهران</option>
              {TEHRAN_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] text-slateGreen mb-1 font-normal">نوع مسئله:</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as IssueCategory | 'all' }))}
              className="w-full p-2 rounded-lg border border-borderMuted bg-white text-darkText focus:outline-none focus:border-forest"
            >
              <option value="all">همه انواع مسائل</option>
              <option value="waterlogging">آبگرفتگی معابر</option>
              <option value="asphalt">خرابی آسفالت</option>
              <option value="lighting">روشنایی معابر</option>
              <option value="obstruction">سد معبر</option>
              <option value="waste">پسماند و نظافت</option>
              <option value="traffic_signs">علائم ترافیکی</option>
              <option value="greenery">فضای سبز</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[11px] text-slateGreen mb-1 font-normal">سطح اولویت:</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as PriorityLevel | 'all' }))}
              className="w-full p-2 rounded-lg border border-borderMuted bg-white text-darkText focus:outline-none focus:border-forest"
            >
              <option value="all">همه اولویت‌ها</option>
              <option value="critical">بحرانی (قرمز آجری)</option>
              <option value="high">بالا (کهربایی)</option>
              <option value="medium">متوسط (سبز ملایم)</option>
              <option value="normal">عادی (خاکستری)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] text-slateGreen mb-1 font-normal">وضعیت رسیدگی:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as IssueStatus | 'all' }))}
              className="w-full p-2 rounded-lg border border-borderMuted bg-white text-darkText focus:outline-none focus:border-forest"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="new">جدید / در انتظار بررسی</option>
              <option value="investigating">در حال بررسی</option>
              <option value="referred">ارجاع‌شده به واحد</option>
              <option value="in_progress">در حال رسیدگی عملیاتی</option>
              <option value="resolved">حل‌شده</option>
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[11px] text-slateGreen mb-1 font-normal">جستجوی عنوان / محله:</label>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="مثلاً صادقیه، چاله، تیرانداز..."
              className="w-full p-2 rounded-lg border border-borderMuted bg-white text-darkText focus:outline-none focus:border-forest font-normal"
            />
          </div>
        </div>
      </div>

      {/* Main Map Component with Live Markers */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slateGreen px-1 font-normal">
          <span className="font-semibold text-forest flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-terracotta" />
            نقشه برخط پایش مسائل شهری تهران
          </span>
          <span>نمایش {filteredIssues.length} مسئله فعال روی نقشه</span>
        </div>
        <MapComponent interactiveMode="admin" heightClass="h-[460px] sm:h-[500px]" />
      </div>

      {/* Issues List & Overview */}
      <div className="bg-ivory-surface rounded-card border border-borderMuted shadow-sm overflow-hidden">
        <div className="p-4 border-b border-borderMuted flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-forest">فهرست مسائل مهم و فعال</h3>
            <span className="text-xs text-slateGreen font-normal">برای مشاهده پرونده تحلیلی روی هر سطر کلیک کنید</span>
          </div>
          <span className="text-xs bg-forest/10 text-forest px-2.5 py-1 rounded-md font-semibold">
            {filteredIssues.length} مورد منطبق
          </span>
        </div>

        <div className="divide-y divide-borderMuted">
          {filteredIssues.length > 0 ? (
            filteredIssues.slice(0, 8).map((issue) => {
              const priority = PRIORITY_MAP[issue.priority];
              const isHotspot = Boolean(issue.isCriticalHotspot && scenario.isActive);

              return (
                <div
                  key={issue.id}
                  onClick={() => openIssueDetails(issue.id)}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-ivory-warm/70 cursor-pointer transition-colors ${
                    isHotspot ? 'bg-terracotta/5 border-r-4 border-terracotta' : ''
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span 
                        className="text-[11px] font-semibold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: priority.badgeColor }}
                      >
                        {priority.title}
                      </span>
                      <span className="text-xs font-semibold text-forest">{issue.title}</span>
                      {isHotspot && (
                        <span className="text-[10px] bg-terracotta text-white px-2 py-0.5 rounded-full font-semibold animate-pulse">
                          نقطه بحرانی جدید
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slateGreen flex-wrap font-normal">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-terracotta" />
                        {issue.districtName} - {issue.locationName}
                      </span>
                      <span>•</span>
                      <span>نوع: {issue.categoryTitle}</span>
                      <span>•</span>
                      <span>آخرین گزارش: {issue.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-bold text-forest">
                        {issue.reportsCount} گزارش
                      </div>
                      <span className="text-[11px] text-slateGreen font-normal">{issue.statusTitle}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openIssueDetails(issue.id);
                      }}
                      className="p-2 rounded-lg bg-ivory-warm hover:bg-forest hover:text-white text-forest transition-colors border border-borderMuted"
                      title="مشاهده جزئیات"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slateGreen font-normal">
              هیچ مسئله‌ای با فیلترهای انتخابی یافت نشد. فیلترها را ریست کنید.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

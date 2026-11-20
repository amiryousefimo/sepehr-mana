import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapComponent } from '../components/MapComponent';
import { 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Activity,
  FileText,
  AlertTriangle,
  Gift,
  ArrowLeft
} from 'lucide-react';
import { TEHRAN_DISTRICTS, STATUS_MAP } from '../data/mockData';
import { UrbanIssue, IssueCategory } from '../types';

export const CitizenPortalView: React.FC = () => {
  const { issues } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'in_progress' | 'resolved'>('all');
  const [districtFilter, setDistrictFilter] = useState<number | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');
  const [selectedCitizenIssue, setSelectedCitizenIssue] = useState<UrbanIssue | null>(null);

  // فیلتر مسائل برای نمای شهروندی (با حفظ حریم خصوصی)
  const filteredCitizenIssues = issues.filter((issue) => {
    if (districtFilter !== 'all' && issue.district !== districtFilter) return false;
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    if (activeTab === 'active' && (issue.status === 'resolved' || issue.status === 'in_progress')) return false;
    if (activeTab === 'in_progress' && issue.status !== 'in_progress' && issue.status !== 'referred') return false;
    if (activeTab === 'resolved' && issue.status !== 'resolved') return false;
    return true;
  });

  const activeCount = issues.filter(i => i.status !== 'resolved').length;
  const inProgressCount = issues.filter(i => i.status === 'in_progress' || i.status === 'referred').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;
  const totalReportsCount = issues.reduce((acc, i) => acc + i.reportsCount, 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" dir="rtl">
      {/* بنر خوش‌آمدگویی و معرفی پرتال */}
      <div className="bg-gradient-to-l from-forest via-[#284942] to-forest text-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-amber text-xs sm:text-sm font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>پرتال شفافیت و آگاهی عمومی شهر</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold leading-tight">
          شهرآگاه؛ پنجره شفافیت مسائل شهری برای شهروندان
        </h2>
        <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed font-normal">
          در این بخش می‌توانید از آخرین وضعیت مسائل گزارش‌شده محله خود، روند پیگیری و اقدامات انجام‌شده مطلع شوید. گزارش‌های مشابه برای تسریع در اقدام، با استفاده از هوش مصنوعی تجمیع می‌شوند.
        </p>

        {/* پیوند مستقیم به باشگاه شهروندی و ثبت مشاهدات مکمل */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="/hackaton/game/citizen_preview.html"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber hover:bg-amber-light text-forest-dark font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm"
          >
            <Gift className="w-4 h-4 text-forest-dark" />
            <span>ورود به باشگاه مشارکت شهروندی و ثبت مشاهدات مکمل صادقیه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </a>
          <span className="text-xs text-white/75 font-normal">
            رتبه‌بندی محله‌ها، تسهیلات خدمات شهری و ثبت شاهد معتبر موانع معابر
          </span>
        </div>
      </div>

      {/* آمارهای شفافیت شهروندی */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-ivory-surface p-4 rounded-2xl border border-borderMuted shadow-sm">
          <div className="flex items-center justify-between text-xs text-slateGreen mb-1">
            <span>مسائل فعال شهر</span>
            <AlertTriangle className="w-4 h-4 text-terracotta" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-terracotta">{activeCount}</span>
            <span className="text-xs text-slateGreen">پرونده فعال</span>
          </div>
        </div>

        <div className="bg-ivory-surface p-4 rounded-2xl border border-borderMuted shadow-sm">
          <div className="flex items-center justify-between text-xs text-slateGreen mb-1">
            <span>در حال رسیدگی در شهرداری</span>
            <Activity className="w-4 h-4 text-amber" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber">{inProgressCount}</span>
            <span className="text-xs text-slateGreen">اقدام اجرایی</span>
          </div>
        </div>

        <div className="bg-ivory-surface p-4 rounded-2xl border border-borderMuted shadow-sm">
          <div className="flex items-center justify-between text-xs text-slateGreen mb-1">
            <span>مسائل حل و ترمیم‌شده</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">{resolvedCount}</span>
            <span className="text-xs text-slateGreen">تکمیل‌شده</span>
          </div>
        </div>

        <div className="bg-ivory-surface p-4 rounded-2xl border border-borderMuted shadow-sm">
          <div className="flex items-center justify-between text-xs text-slateGreen mb-1">
            <span>مجموع مشارکت شهروندان</span>
            <Users className="w-4 h-4 text-forest" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-forest">{totalReportsCount}</span>
            <span className="text-xs text-slateGreen">گزارش مردمی</span>
          </div>
        </div>
      </div>

      {/* نقشه تعاملی شهروندی و فیلترها */}
      <div className="bg-ivory-surface border border-borderMuted rounded-2xl p-4 shadow-sm space-y-4">
        <div className="bg-ivory-warm p-3 rounded-xl border border-borderMuted flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          {/* تب‌های وضعیت */}
          <div className="flex items-center bg-white p-1 rounded-lg border border-borderMuted">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'all' ? 'bg-forest text-white shadow-sm' : 'text-slateGreen hover:text-darkText'
              }`}
            >
              همه موارد ({issues.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'active' ? 'bg-forest text-white shadow-sm' : 'text-slateGreen hover:text-darkText'
              }`}
            >
              مسائل فعال
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'in_progress' ? 'bg-forest text-white shadow-sm' : 'text-slateGreen hover:text-darkText'
              }`}
            >
              در حال رسیدگی
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'resolved' ? 'bg-forest text-white shadow-sm' : 'text-slateGreen hover:text-darkText'
              }`}
            >
              حل‌شده
            </button>
          </div>

          {/* فیلتر منطقه و دسته */}
          <div className="flex items-center gap-2">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="py-1.5 px-3 rounded-lg bg-white border border-borderMuted text-xs sm:text-sm text-darkText focus:border-forest outline-none font-sans"
            >
              <option value="all">انتخاب منطقه سکونت شما...</option>
              {TEHRAN_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="py-1.5 px-3 rounded-lg bg-white border border-borderMuted text-xs sm:text-sm text-darkText focus:border-forest outline-none font-sans"
            >
              <option value="all">همه دسته‌ها</option>
              <option value="waterlogging">آبگرفتگی معابر</option>
              <option value="asphalt">خرابی آسفالت</option>
              <option value="lighting">روشنایی معابر</option>
              <option value="obstruction">سد معبر</option>
              <option value="waste">پسماند و نظافت</option>
            </select>
          </div>
        </div>

        {/* نقشه */}
        <MapComponent interactiveMode="citizen" heightClass="h-[460px] sm:h-[500px]" issuesToShow={filteredCitizenIssues} />
      </div>

      {/* فهرست کارت‌های مسائل برای شهروندان */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm sm:text-base text-darkText flex items-center gap-2">
            <FileText className="w-4 h-4 text-forest" />
            <span>فهرست عمومی و شفاف مسائل شهری</span>
          </h3>
          <span className="text-xs text-slateGreen">
            {filteredCitizenIssues.length} مسئله قابل انتشار
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCitizenIssues.map((issue) => {
            const status = STATUS_MAP[issue.status];
            return (
              <div
                key={issue.id}
                onClick={() => setSelectedCitizenIssue(issue)}
                className="bg-ivory-surface p-5 rounded-2xl border border-borderMuted hover:border-forest/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-ivory-warm text-slateGreen px-2.5 py-0.5 rounded-md font-medium">
                      {issue.districtName}
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${status.badgeClass}`}>
                      {status.title}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm sm:text-base text-darkText leading-snug line-clamp-2">
                    {issue.title}
                  </h4>

                  <div className="text-xs text-slateGreen flex items-center gap-1 font-normal">
                    <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                    <span className="truncate">{issue.locationName}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-borderMuted flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slateGreen">
                    <Users className="w-3.5 h-3.5 text-forest" />
                    <span>{issue.reportsCount} شهروند گزارش داده‌اند</span>
                  </div>
                  <span className="text-forest font-semibold flex items-center gap-1 hover:underline">
                    <span>مشاهده وضعیت</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* مودال شفافیت شهروندی */}
      {selectedCitizenIssue && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-ivory-surface rounded-2xl border border-borderMuted shadow-2xl p-6 space-y-4 text-darkText" dir="rtl">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-borderMuted">
              <div>
                <span className="text-xs text-forest font-semibold bg-ivory-warm px-2.5 py-0.5 rounded">
                  {selectedCitizenIssue.categoryTitle}
                </span>
                <h3 className="font-bold text-base sm:text-lg text-darkText mt-1.5 leading-snug">
                  {selectedCitizenIssue.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCitizenIssue(null)}
                className="text-slateGreen hover:text-darkText text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-normal">
              <div className="flex items-center gap-2 text-slateGreen">
                <MapPin className="w-4 h-4 text-terracotta" />
                <span className="font-semibold text-darkText">موقعیت تقریبی:</span>
                <span>{selectedCitizenIssue.locationName} ({selectedCitizenIssue.districtName})</span>
              </div>

              <div className="flex items-center gap-2 text-slateGreen">
                <Clock className="w-4 h-4 text-amber" />
                <span className="font-semibold text-darkText">آخرین ثبت در سامانه:</span>
                <span>{selectedCitizenIssue.updatedAt}</span>
              </div>

              <div className="flex items-center gap-2 text-slateGreen">
                <Users className="w-4 h-4 text-forest" />
                <span className="font-semibold text-darkText">گزارش‌های مردمی متصل:</span>
                <span>{selectedCitizenIssue.reportsCount} گزارش شهروندی</span>
              </div>

              <div className="p-3.5 bg-ivory-warm rounded-xl border border-borderMuted space-y-1">
                <span className="text-forest font-semibold block text-xs">واحد عملیاتی مسئول رسیدگی:</span>
                <p className="text-darkText/80 text-xs sm:text-sm leading-relaxed">
                  {selectedCitizenIssue.suggestedUnit.unitName} - {selectedCitizenIssue.suggestedUnit.subUnit}
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2 text-xs text-emerald-900 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  جهت رعایت محرمانگی و حریم خصوصی شهروندان، اسامی، شماره تماس و اطلاعات هویتی گزارش‌دهندگان در نمای عمومی منتشر نمی‌گردد.
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-borderMuted flex justify-end">
              <button
                onClick={() => setSelectedCitizenIssue(null)}
                className="px-4 py-2 bg-ivory-warm hover:bg-borderMuted text-darkText text-xs sm:text-sm font-semibold rounded-lg border border-borderMuted transition-colors"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* یادداشت پایانی شفافیت */}
      <footer className="mt-10 pt-6 border-t border-borderMuted text-center text-xs text-slateGreen pb-8 space-y-1">
        <p className="font-semibold text-forest">
          «شهرآگاه با هدف افزایش شفافیت و آگاهی شهروندان از وضعیت مسائل شهری طراحی شده است.»
        </p>
        <p className="text-slateGreen/80 font-normal">
          مرکز هوشمند پایش و تصمیم‌یار مدیریت شهری تهران • نسخه هکاتون
        </p>
      </footer>
    </div>
  );
};

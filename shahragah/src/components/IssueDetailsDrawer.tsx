import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  FileText, 
  TrendingUp,
  Building2,
  SlidersHorizontal,
  Edit3,
  UserCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { PRIORITY_MAP, STATUS_MAP, MUNICIPAL_UNITS } from '../data/mockData';
import { PriorityLevel } from '../types';

export const IssueDetailsDrawer: React.FC = () => {
  const { 
    selectedIssue, 
    closeIssueDetails, 
    setReferralModalIssue,
    updateManualOverride 
  } = useApp();

  const [isOverrideOpen, setIsOverrideOpen] = useState<boolean>(false);
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>('high');
  const [selectedUnitName, setSelectedUnitName] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');

  // Sync state whenever selectedIssue changes
  useEffect(() => {
    if (selectedIssue) {
      setSelectedPriority(selectedIssue.priority);
      setSelectedUnitName(selectedIssue.suggestedUnit.unitName);
      setOverrideReason(selectedIssue.manualOverrideReason || '');
      setIsOverrideOpen(false);
    }
  }, [selectedIssue?.id]);

  if (!selectedIssue) return null;

  const priorityMeta = PRIORITY_MAP[selectedIssue.priority];
  const statusMeta = STATUS_MAP[selectedIssue.status];

  const handleSaveOverride = () => {
    const unitObj = MUNICIPAL_UNITS.find(u => u.unitName === selectedUnitName) || selectedIssue.suggestedUnit;
    updateManualOverride(
      selectedIssue.id,
      selectedPriority,
      unitObj,
      overrideReason
    );
    setIsOverrideOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[1100] flex justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="w-full max-w-2xl bg-ivory-surface h-full shadow-2xl flex flex-col border-r border-borderMuted overflow-hidden animate-in slide-in-from-left duration-300 text-darkText"
        dir="rtl"
      >
        {/* هدر کشو */}
        <div className="p-5 border-b border-borderMuted bg-forest text-white flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                className="text-xs font-semibold px-2.5 py-0.5 rounded text-white"
                style={{ backgroundColor: priorityMeta.badgeColor }}
              >
                اولویت {priorityMeta.title}
              </span>
              <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded border border-white/20 text-white/90 font-medium">
                {selectedIssue.categoryTitle}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusMeta.badgeClass}`}>
                وضعیت: {selectedIssue.statusTitle}
              </span>
              {selectedIssue.isManuallyOverridden && (
                <span className="text-xs bg-emerald-600/90 text-white px-2.5 py-0.5 rounded font-medium flex items-center gap-1 shadow-sm">
                  <UserCheck className="w-3.5 h-3.5" />
                  بازنگری کارشناسی‌شده
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold leading-snug">{selectedIssue.title}</h2>
            <div className="flex items-center gap-4 text-xs text-white/80 font-normal">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber" />
                {selectedIssue.districtName} - {selectedIssue.locationName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-white/70" />
                {selectedIssue.createdAt}
              </span>
            </div>
          </div>
          <button
            onClick={closeIssueDetails}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* بدنه کشو - اسکرول‌پذیر */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-ivory-surface">
          {/* نوار سنجه‌های کلیدی */}
          <div className="grid grid-cols-3 gap-3 bg-ivory-warm p-4 rounded-xl border border-borderMuted">
            <div className="text-center">
              <span className="text-xs text-slateGreen block mb-1">گزارش‌های متصل</span>
              <span className="text-2xl font-bold text-forest flex items-center justify-center gap-1">
                <Users className="w-5 h-5 text-forest/70" />
                {selectedIssue.reportsCount}
              </span>
            </div>
            <div className="text-center border-x border-borderMuted">
              <span className="text-xs text-slateGreen block mb-1">شاخص اولویت</span>
              <span className="text-2xl font-bold text-terracotta flex items-center justify-center gap-1">
                <TrendingUp className="w-5 h-5" />
                {selectedIssue.priorityScore.score} / ۱۰۰
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs text-slateGreen block mb-1">وضعیت کنونی</span>
              <span className="text-xs font-semibold text-darkText block mt-1.5">
                {selectedIssue.statusTitle}
              </span>
            </div>
          </div>

          {/* =========================================================================
              مکانیزم بازنگری و تغییر دستی (Human-in-the-Loop)
             ========================================================================= */}
          <div className="bg-ivory-warm rounded-xl border border-borderMuted overflow-hidden shadow-sm transition-all">
            {!isOverrideOpen ? (
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-darkText flex items-center gap-1.5">
                      <SlidersHorizontal className="w-4 h-4 text-forest" />
                      بازنگری و تنظیم دستی اپراتور (Human-in-the-Loop)
                    </span>
                    {selectedIssue.isManuallyOverridden && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        اصلاح‌شده
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slateGreen font-normal">
                    {selectedIssue.isManuallyOverridden 
                      ? `دلیل ثبت‌شده: «${selectedIssue.manualOverrideReason}»`
                      : 'چنانچه هوش مصنوعی در تشخیص سطح اولویت یا واحد ارجاع خطا داشته، می‌توانید آن را اصلاح کنید.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsOverrideOpen(true)}
                  className="px-3.5 py-1.5 bg-ivory-surface hover:bg-white text-forest text-xs font-semibold rounded-lg border border-borderMuted shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5 text-forest" />
                  <span>{selectedIssue.isManuallyOverridden ? 'ویرایش مجدد' : 'تغییر دستی'}</span>
                </button>
              </div>
            ) : (
              <div className="p-5 space-y-4 bg-white border-2 border-forest/30 rounded-xl">
                <div className="flex items-center justify-between pb-2 border-b border-borderMuted">
                  <div className="flex items-center gap-2 text-forest font-semibold text-xs sm:text-sm">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>فرم تغییر دستی اولویت و واحد تخصصی</span>
                  </div>
                  <span className="text-[11px] text-slateGreen">ثبت در سوابق سامانه</span>
                </div>

                {/* انتخاب سطح اولویت دستی */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-darkText">
                    ۱. تعیین سطح اولویت توسط اپراتور:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['critical', 'high', 'medium', 'normal'] as PriorityLevel[]).map((level) => {
                      const meta = PRIORITY_MAP[level];
                      const isSelected = selectedPriority === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setSelectedPriority(level)}
                          className={`p-2 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'border-forest bg-forest text-white shadow-sm'
                              : 'border-borderMuted bg-ivory-warm text-darkText hover:bg-ivory-surface'
                          }`}
                        >
                          <span 
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: isSelected ? '#ffffff' : meta.badgeColor }}
                          />
                          <span>اولویت {meta.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* انتخاب واحد مسئول دستی */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-darkText">
                    ۲. انتخاب واحد مسئول و سازمان دریافت‌کننده:
                  </label>
                  <select
                    value={selectedUnitName}
                    onChange={(e) => setSelectedUnitName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-ivory-warm border border-borderMuted text-xs sm:text-sm text-darkText focus:border-forest outline-none font-sans"
                  >
                    {MUNICIPAL_UNITS.map((u) => (
                      <option key={u.unitName} value={u.unitName}>
                        {u.unitName} ({u.subUnit})
                      </option>
                    ))}
                  </select>
                </div>

                {/* یادداشت علت بازنگری */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-darkText">
                    ۳. علت تغییر یا یادداشت کارشناسی:
                  </label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="مثال: ارزیابی میدانی نشان داد ابعاد حادثه محدود است / همجواری با بیمارستان"
                    className="w-full p-2.5 rounded-lg bg-ivory-warm border border-borderMuted text-xs sm:text-sm text-darkText focus:border-forest outline-none"
                  />
                </div>

                {/* دکمه‌های فرم */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOverrideOpen(false)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slateGreen hover:text-darkText transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveOverride}
                    className="px-4 py-1.5 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>ذخیره و اعمال بازنگری</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* خلاصه هوشمند شهرآگاه */}
          <div className="bg-ivory-warm p-4 rounded-xl border border-mutedGreen/40 shadow-sm relative">
            <div className="flex items-center gap-2 mb-2 text-forest font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-terracotta" />
              <span>خلاصه تحلیل هوشمند شهرآگاه</span>
              <span className="text-[11px] bg-white text-mutedGreen px-2 py-0.5 rounded border border-borderMuted mr-auto font-normal">
                پردازش زبان طبیعی و خوشه‌بندی
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-darkText/90 font-normal text-justify">
              {selectedIssue.aiSummary}
            </p>
          </div>

          {/* تحلیل تفکیکی مؤلفه‌های اولویت‌بندی */}
          <div className="bg-ivory-warm p-4 rounded-xl border border-borderMuted space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-borderMuted">
              <h3 className="font-semibold text-xs sm:text-sm text-darkText flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-terracotta" />
                <span>مؤلفه‌های تعیین اولویت (امتیاز: <span className="font-bold text-terracotta">{selectedIssue.priorityScore.score}</span> از ۱۰۰)</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-ivory-surface border border-borderMuted">
                <span className="text-[11px] text-slateGreen block mb-1">شدت مسئله</span>
                <span className="font-bold text-terracotta">{selectedIssue.priorityScore.severity}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-ivory-surface border border-borderMuted">
                <span className="text-[11px] text-slateGreen block mb-1">فراوانی گزارش‌ها</span>
                <span className="font-bold text-terracotta">{selectedIssue.priorityScore.frequency}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-ivory-surface border border-borderMuted">
                <span className="text-[11px] text-slateGreen block mb-1">زمان انتظار</span>
                <span className="font-bold text-amber">{selectedIssue.priorityScore.waitTime}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-ivory-surface border border-borderMuted">
                <span className="text-[11px] text-slateGreen block mb-1">اهمیت محدوده</span>
                <span className="font-bold text-forest">{selectedIssue.priorityScore.areaImportance}</span>
              </div>
            </div>
            <div className="bg-ivory-surface p-3 rounded-lg text-xs text-darkText/80 leading-relaxed border border-borderMuted/60">
              <span className="font-semibold text-darkText block mb-0.5">منطق ارزیابی سیستم:</span>
              {selectedIssue.priorityScore.logicExplanation}
            </div>
          </div>

          {/* واحد پیشنهادی جهت اقدام */}
          <div className="bg-ivory-warm p-4 rounded-xl border border-mutedGreen/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs sm:text-sm text-darkText flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-forest" />
                <span>واحد مسئول رسیدگی و اقدام</span>
              </h3>
              {selectedIssue.status === 'referred' && (
                <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ارجاع تایید شد
                </span>
              )}
            </div>
            <div className="p-3 bg-ivory-surface rounded-lg border border-borderMuted">
              <div className="font-semibold text-xs sm:text-sm text-forest mb-0.5 flex items-center gap-2">
                <span>{selectedIssue.suggestedUnit.unitName}</span>
                {selectedIssue.isManuallyOverridden && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                    تأییدشده توسط کارشناس
                  </span>
                )}
              </div>
              <div className="text-xs text-slateGreen mb-1.5 font-normal">
                {selectedIssue.suggestedUnit.subUnit}
              </div>
              <p className="text-xs text-darkText/80 leading-relaxed font-normal">
                {selectedIssue.suggestedUnit.description}
              </p>
            </div>
            <p className="text-[11px] text-slateGreen">
              * ارجاع نهایی نیازمند تأیید مسئول شیفت عملیات شهری است.
            </p>
            {selectedIssue.status !== 'referred' && selectedIssue.status !== 'resolved' ? (
              <button
                onClick={() => setReferralModalIssue(selectedIssue)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-terracotta hover:bg-terracotta-dark text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>تأیید و ارجاع فوری به واحد تخصصی</span>
              </button>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 text-center font-semibold">
                پرونده در سامانه عملیاتی واحد مربوطه ثبت شده است.
              </div>
            )}
          </div>

          {/* نمونه پیام‌های شهروندی */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs sm:text-sm text-darkText flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-forest" />
                <span>نمونه گزارش‌های خام شهروندی ({selectedIssue.reports.length} از {selectedIssue.reportsCount})</span>
              </h3>
              <span className="text-xs text-slateGreen">با حفظ محرمانگی شهروندان</span>
            </div>
            <div className="space-y-2.5">
              {selectedIssue.reports && selectedIssue.reports.length > 0 ? (
                selectedIssue.reports.map((rep, idx) => (
                  <div 
                    key={rep.id} 
                    className="p-3.5 bg-ivory-warm rounded-xl border border-borderMuted text-xs space-y-1.5 hover:border-forest/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-slateGreen">
                      <span className="font-semibold text-darkText flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-forest/10 text-forest text-[11px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        گزارش شهروندی
                      </span>
                      <span>{rep.timestamp}</span>
                    </div>
                    <p className="text-darkText font-normal leading-relaxed pr-5">
                      «{rep.text}»
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slateGreen pr-5">
                      <MapPin className="w-3.5 h-3.5 text-terracotta" />
                      <span>{rep.locationName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slateGreen bg-ivory-warm rounded-xl border border-borderMuted">
                  گزارش‌های تفصیلی در سامانه ۱۳۷ بایگانی شده است.
                </div>
              )}
            </div>
          </div>

          {/* تاریخچه و لاگ رویدادها */}
          <div className="space-y-3 pt-2">
            <h3 className="font-semibold text-xs sm:text-sm text-darkText flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-forest" />
              <span>لاگ اقدامات و رویدادها (Timeline)</span>
            </h3>
            <div className="space-y-3 relative pr-4 border-r-2 border-borderMuted mr-2">
              {selectedIssue.timeline && selectedIssue.timeline.map((event) => (
                <div key={event.id} className="relative pr-3">
                  <div className="absolute -right-[23px] top-1.5 w-3 h-3 rounded-full bg-forest border-2 border-ivory-surface" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-forest">{event.title}</span>
                    <span className="text-slateGreen text-[11px]">{event.timestamp}</span>
                  </div>
                  <p className="text-xs text-darkText/80 mt-1 leading-relaxed font-normal">
                    {event.description}
                  </p>
                  <span className="text-[11px] text-slateGreen block mt-0.5">
                    توسط: {event.actor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* فوتر کشو */}
        <div className="p-4 border-t border-borderMuted bg-ivory-surface flex items-center justify-between">
          <button
            onClick={closeIssueDetails}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slateGreen hover:text-darkText transition-colors"
          >
            بستن پنجره
          </button>
          {selectedIssue.status !== 'referred' && (
            <button
              onClick={() => setReferralModalIssue(selectedIssue)}
              className="px-5 py-2 bg-forest hover:bg-forest-light text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              ارجاع به واحد مربوطه
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

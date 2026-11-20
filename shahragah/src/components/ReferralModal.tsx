import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, AlertTriangle, Send, X, ShieldCheck, Edit3, Check } from 'lucide-react';
import { MUNICIPAL_UNITS } from '../data/mockData';

export const ReferralModal: React.FC = () => {
  const { referralModalIssue, setReferralModalIssue, confirmReferral } = useApp();
  const [urgencyNotice, setUrgencyNotice] = useState<boolean>(true);
  const [isEditingUnit, setIsEditingUnit] = useState<boolean>(false);
  const [selectedUnitName, setSelectedUnitName] = useState<string>(() => 
    referralModalIssue ? referralModalIssue.suggestedUnit.unitName : ''
  );
  const [operatorNotes, setOperatorNotes] = useState<string>(() => {
    if (!referralModalIssue) return '';
    if (referralModalIssue.category === 'waterlogging') {
      return 'دستور اقدام فوری جهت اعزام پمپ لجن‌کش و لایروبی کانال‌های خروجی آب.';
    }
    if (referralModalIssue.category === 'lighting') {
      return 'دستور بررسی مدار تغذیه، پایه‌ها و رفع فوری خاموشی معبر با توجه به تاریکی شبانه.';
    }
    return `دستور کارشناسی و اقدام فوری جهت رفع مسئله: ${referralModalIssue.title}`;
  });

  if (!referralModalIssue) return null;

  const currentUnitObj = MUNICIPAL_UNITS.find(u => u.unitName === selectedUnitName) || referralModalIssue.suggestedUnit;
  const isUnitChanged = selectedUnitName !== referralModalIssue.suggestedUnit.unitName;

  const handleConfirm = () => {
    confirmReferral(referralModalIssue.id, selectedUnitName || referralModalIssue.suggestedUnit.unitName);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-ivory-surface rounded-2xl border border-borderMuted shadow-2xl overflow-hidden flex flex-col text-darkText"
        dir="rtl"
      >
        {/* هدر مودال */}
        <div className="p-4 bg-forest text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber" />
            <h3 className="font-bold text-base sm:text-lg">دیسپاچینگ و ابلاغ مأموریت به واحد تخصصی</h3>
          </div>
          <button
            onClick={() => setReferralModalIssue(null)}
            className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوای مودال */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          {/* کارت خلاصه پرونده */}
          <div className="p-3.5 bg-ivory-warm rounded-xl border border-borderMuted space-y-1">
            <span className="text-xs text-slateGreen block">پرونده مورد ابلاغ:</span>
            <div className="font-semibold text-darkText leading-snug">{referralModalIssue.title}</div>
            <div className="text-xs text-slateGreen flex items-center gap-3 pt-1">
              <span>محدوده: {referralModalIssue.locationName}</span>
              <span>•</span>
              <span className="text-forest font-bold">{referralModalIssue.reportsCount} گزارش شهروندی</span>
            </div>
          </div>

          {/* کارت واحد سازمانی دریافت‌کننده با قابلیت تغییر دستی */}
          <div className="p-3.5 bg-ivory-warm rounded-xl border border-borderMuted space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-forest text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-forest" />
                <span>واحد سازمانی دریافت‌کننده مأموریت:</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingUnit(!isEditingUnit)}
                className="text-[11px] font-semibold text-terracotta hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingUnit ? 'تأیید انتخاب' : 'تغییر دستی واحد'}</span>
              </button>
            </div>

            {isEditingUnit ? (
              <div className="space-y-2 pt-1">
                <label className="text-[11px] text-slateGreen block font-normal">
                  انتخاب واحد تخصصی جایگزین از لیست سازمان‌ها:
                </label>
                <select
                  value={selectedUnitName}
                  onChange={(e) => setSelectedUnitName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white border border-borderMuted text-xs sm:text-sm text-darkText focus:border-forest outline-none font-sans"
                >
                  {MUNICIPAL_UNITS.map((u) => (
                    <option key={u.unitName} value={u.unitName}>
                      {u.unitName}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slateGreen leading-relaxed font-normal">
                  زیرواحد: {currentUnitObj.subUnit}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-darkText pr-5">
                    {currentUnitObj.unitName}
                  </div>
                  {isUnitChanged && (
                    <span className="text-[10px] bg-terracotta/15 text-terracotta px-2 py-0.5 rounded font-semibold">
                      تغییریافته توسط دیسپاچر
                    </span>
                  )}
                </div>
                <div className="text-xs text-slateGreen pr-5 font-normal mt-0.5">
                  {currentUnitObj.subUnit}
                </div>
              </div>
            )}
          </div>

          {/* فیلد یادداشت دیسپاچر */}
          <div>
            <label className="block font-semibold text-darkText mb-1.5 text-xs sm:text-sm">یادداشت دیسپاچر و دستور اقدام فوری:</label>
            <textarea
              value={operatorNotes}
              onChange={(e) => setOperatorNotes(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-borderMuted bg-white text-darkText text-xs sm:text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors resize-none font-normal"
              placeholder="دستور اقدام یا توضیحات تکمیلی..."
            />
          </div>

          {/* ارسال پیامک هشدار */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-darkText/90">
            <input
              type="checkbox"
              id="urgency"
              checked={urgencyNotice}
              onChange={(e) => setUrgencyNotice(e.target.checked)}
              className="rounded accent-forest w-4 h-4 cursor-pointer"
            />
            <label htmlFor="urgency" className="cursor-pointer font-medium">
              ارسال پیامک هشدار اولویت فوری به کشیک عملیاتی منطقه
            </label>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              با تأیید ارجاع، وضعیت پرونده در کارتابل به «ارجاع‌شده» تغییر یافته و با شناسه اولویت به واحد ابلاغ می‌شود.
            </span>
          </div>
        </div>

        {/* دکمه‌های اقدام */}
        <div className="p-4 border-t border-borderMuted bg-ivory-surface flex items-center justify-between">
          <button
            onClick={() => setReferralModalIssue(null)}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slateGreen hover:text-darkText transition-colors"
          >
            انصراف
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 text-xs sm:text-sm font-semibold bg-terracotta hover:bg-terracotta-dark text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Send className="w-4 h-4" />
            تأیید و ابلاغ مأموریت
          </button>
        </div>
      </div>
    </div>
  );
};

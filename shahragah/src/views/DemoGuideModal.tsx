import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  RotateCcw, 
  Play, 
  Activity
} from 'lucide-react';

export const DemoGuideModal: React.FC = () => {
  const { 
    setActivePage, 
    setViewMode, 
    runRainScenario, 
    resetScenario, 
    scenario,
  } = useApp();

  const steps = [
    {
      step: 1,
      title: 'ورود به مرکز پایش شهری (داشبورد مدیریتی)',
      action: 'بررسی ۴ کارت آماری (کل گزارش‌ها، مسائل فعال، بحرانی و در انتظار ارجاع)',
      note: 'توضیح دهید که شهرآگاه چطور گزارش‌های پراکنده و تکراری شهروندان را تحلیل و تجمیع می‌کند.',
    },
    {
      step: 2,
      title: 'شبیه‌سازی بارندگی شدید در منطقه ۲ (صادقیه)',
      action: 'کلیک روی بنر برجسته «اجرای سناریوی بارندگی صادقیه»',
      note: 'ورود ۳۲ گزارش جدید شهروندی به صورت برخط و نمایش اعلان هشدار.',
    },
    {
      step: 3,
      title: 'خوشه‌بندی و پردازش هوشمند در لحظه',
      action: 'مشاهده لودینگ سیستم در حال تحلیل معنایی گزارش‌ها',
      note: 'سیستم گزارش‌های هم‌پوشان را از نظر شباهت متن و نزدیکی مکانی ادغام می‌کند.',
    },
    {
      step: 4,
      title: 'تشکیل خوشه بحرانی روی نقشه و ردگیری خودکار',
      action: 'زوم خودکار نقشه روی فلکه دوم صادقیه و نمایش نشانگر قرمز تپنده',
      note: 'ارتقای اولویت به ۸۹/۱۰۰ به دلیل گره ترافیکی و سرریز کانال آب.',
    },
    {
      step: 5,
      title: 'باز کردن پرونده تحلیلی و بررسی گزارش‌های شهروندی',
      action: 'کلیک روی نشانگر نقشه یا پرونده صادقیه در کارتابل',
      note: 'مشاهده ۵ نمونه گزارش محاوره‌ای فارسی، تحلیل هوشمند و فرمول امتیازدهی.',
    },
    {
      step: 6,
      title: 'تأیید و ارجاع قطعی به واحد خدمات شهری',
      action: 'فشردن دکمه «تأیید و ارجاع فوری» و ثبت در مودال دیسپاچینگ',
      note: 'تغییر وضعیت به «ارجاع‌شده»، ثبت در لاگ زمانی و ارسال به واحد عملیات.',
    },
    {
      step: 7,
      title: 'انتقال به پرتال شفافیت شهروندی',
      action: 'سوئیچ به نمای شهروندی از طریق هدر بالای صفحه',
      note: 'نشان دهید شهروندان همان مسئله را با حفظ کامل حریم خصوصی مشاهده می‌کنند.',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
      {/* هدر بخش راهنما */}
      <div className="bg-ivory-surface border border-borderMuted rounded-2xl p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-10 bg-forest rounded-full shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-darkText leading-none">
                راهنمای سناریوی ارائه زنده (دموی هکاتون)
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded bg-forest/10 border border-forest/20 text-forest font-semibold">
                گام‌به‌گام
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slateGreen mt-1 font-normal">
              ترتیب استاندارد ارائه زنده و بی‌نقص در برابر داوران و کارشناسان
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setViewMode('admin');
            setActivePage('dashboard');
          }}
          className="px-4 py-2 bg-ivory-warm hover:bg-borderMuted text-darkText text-xs sm:text-sm font-semibold rounded-xl border border-borderMuted transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-forest" />
          <span>بازگشت به داشبورد</span>
        </button>
      </div>

      {/* کارت کنترل سریع سناریو */}
      <div className="bg-ivory-surface p-5 rounded-2xl border border-borderMuted shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-sm font-semibold text-forest flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-forest" />
            کنترل بلادرنگ سناریو:
          </span>
          <p className="text-xs sm:text-sm text-slateGreen font-normal">
            وضعیت فعلی: <span className="font-semibold text-darkText">{scenario.isActive ? 'بحران بارندگی فعال' : 'آماده اجرا (نرمال)'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setViewMode('admin');
              setActivePage('dashboard');
              if (!scenario.isActive) {
                runRainScenario();
              }
            }}
            className="px-4 py-2 bg-forest hover:bg-forest-light text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>شروع دمو از گام ۱</span>
          </button>
          {scenario.isActive && (
            <button
              onClick={resetScenario}
              className="px-4 py-2 bg-ivory-warm hover:bg-borderMuted text-slateGreen hover:text-darkText text-xs sm:text-sm font-semibold rounded-xl border border-borderMuted transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ریست سناریو</span>
            </button>
          )}
        </div>
      </div>

      {/* لیست گام‌ها */}
      <div className="space-y-3.5">
        {steps.map((s) => (
          <div 
            key={s.step} 
            className="bg-ivory-surface p-5 rounded-2xl border border-borderMuted hover:border-forest/40 transition-colors shadow-sm flex items-start gap-4"
          >
            <div className="w-8 h-8 rounded-full bg-forest/10 border border-forest/20 text-forest flex items-center justify-center font-bold text-sm shrink-0">
              {s.step}
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-semibold text-sm sm:text-base text-darkText">{s.title}</h4>
              <p className="text-xs sm:text-sm text-slateGreen font-normal">
                <span className="text-forest font-semibold">عملیات: </span>
                {s.action}
              </p>
              <p className="text-xs text-darkText/80 bg-ivory-warm p-3 rounded-xl border border-borderMuted/60 mt-2 font-normal leading-relaxed">
                💡 نکته ارائه: {s.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

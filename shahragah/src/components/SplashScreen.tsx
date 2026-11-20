import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  durationMs = 3200 
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [stepText, setStepText] = useState('در حال اتصال به زیرساخت داده‌های شهری...');

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPercent = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(rawPercent);

      // Dynamic tech status update
      if (rawPercent < 25) {
        setStepText('در حال اتصال به زیرساخت یکپارچه تکاپوگران سپهر مانا...');
      } else if (rawPercent < 55) {
        setStepText('بارگذاری موتور هوش مصنوعی و تحلیل سنسورهای شهری...');
      } else if (rawPercent < 85) {
        setStepText('آماده‌سازی لایه‌های مکان‌محور GIS و مرکز مدیریت بحران...');
      } else {
        setStepText('همگام‌سازی کامل سامانه‌ی شهرآگاه • آماده راه‌اندازی');
      }

      if (rawPercent >= 100) {
        clearInterval(interval);
        // Begin silky fade out
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 700);
        }, 300);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  // Convert numbers to Persian digits
  const toPersianDigits = (num: number) => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden transition-all duration-700 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 35%, #0b1a38 0%, #060b19 55%, #03060e 100%)',
      }}
      dir="rtl"
    >
      {/* Background Tech Grid & Ambient Glows */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#00d2ff 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar: Company Badge & Skip Button */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10">
        {/* Top Company Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0d1c3a]/80 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,210,255,0.15)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs sm:text-sm font-semibold text-cyan-300 tracking-wide">
            شرکت دانش‌بنیان تکاپوگران سپهر مانا
          </span>
          <span className="text-cyan-500/40 text-xs hidden sm:inline">|</span>
          <span className="text-white/70 text-xs hidden sm:inline flex items-center gap-1 font-normal">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            ارائه ویژه رویداد هکاتون
          </span>
        </div>

        {/* Skip button for presentation control */}
        <button
          onClick={handleSkip}
          className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-xs text-white/70 hover:text-white transition-all duration-200 backdrop-blur-sm"
        >
          <span>ورود مستقیم</span>
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-cyan-400" />
        </button>
      </div>

      {/* Centerpiece: The Animated Tech Radar & Typography inspired by tgsepma.com */}
      <div className="flex flex-col items-center justify-center my-auto z-10 max-w-2xl text-center px-4">
        
        {/* Radar Graphic with Glowing Concentric Rings and Nodes */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-8">
          {/* Outer dashed spinning ring */}
          <div 
            className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30 animate-[spin_20s_linear_infinite]"
          />
          
          {/* Middle Ring with Node Dots */}
          <div 
            className="absolute inset-4 rounded-full border border-cyan-500/20 animate-[spin_35s_linear_infinite_reverse]"
          >
            {/* Orbiting Tech Nodes matching tgsepma diagram: Data, Process, Software, Infrastructure */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#061125] px-2 py-0.5 rounded-full border border-cyan-400/50 shadow-[0_0_10px_rgba(0,210,255,0.4)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] text-cyan-200 font-medium">داده</span>
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#061125] px-2 py-0.5 rounded-full border border-cyan-400/50 shadow-[0_0_10px_rgba(0,210,255,0.4)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] text-cyan-200 font-medium">فرآیند</span>
            </div>
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 flex items-center gap-1 bg-[#061125] px-2 py-0.5 rounded-full border border-cyan-400/50 shadow-[0_0_10px_rgba(0,210,255,0.4)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] text-cyan-200 font-medium">نرم‌افزار</span>
            </div>
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 flex items-center gap-1 bg-[#061125] px-2 py-0.5 rounded-full border border-cyan-400/50 shadow-[0_0_10px_rgba(0,210,255,0.4)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] text-cyan-200 font-medium">زیرساخت</span>
            </div>
          </div>

          {/* Inner Glowing Ring */}
          <div className="absolute inset-10 rounded-full border border-cyan-400/40 bg-gradient-to-br from-cyan-500/10 to-blue-600/20 backdrop-blur-sm shadow-[0_0_25px_rgba(0,210,255,0.25)] flex items-center justify-center">
            {/* Center Core: tgsepma stylized 'ت' mark */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#0b1c3e] to-[#122858] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(0,210,255,0.5)]">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300 drop-shadow-[0_0_12px_rgba(0,210,255,0.8)] pb-1">
                ت
              </span>
            </div>
          </div>
        </div>

        {/* Small Highlight Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-medium mb-4 shadow-[0_0_15px_rgba(0,210,255,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>راهکار یکپارچه هوشمندسازی شهری</span>
        </div>

        {/* Grand Typography: شهرآگاه */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-normal mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-300 drop-shadow-[0_0_40px_rgba(0,210,255,0.55)]">
          شـــــهـــــرآگـــــاه
        </h1>

        {/* Subtitle & Official Slogan */}
        <p className="text-base sm:text-xl font-bold text-cyan-100/90 mb-2">
          سامانه هوشمند پایش، تحلیل و تصمیم‌یاری مسائل شهری
        </p>

        {/* Corporate Slogan from tgsepma */}
        <p className="text-xs sm:text-sm text-cyan-300/70 max-w-lg mx-auto font-normal leading-relaxed">
          تبدیل پیچیدگی داده‌های شهری به مزیت دیجیتال و اقدام هوشمند
        </p>
      </div>

      {/* Bottom Area: Progress Bar, Status Message & Footer Attributions */}
      <div className="w-full max-w-xl z-10 flex flex-col items-center">
        
        {/* Status text + Percentage */}
        <div className="w-full flex items-center justify-between text-xs sm:text-sm mb-2 px-1">
          <span className="text-cyan-200/90 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            {stepText}
          </span>
          <span className="text-cyan-400 font-bold font-mono tracking-wider">
            {toPersianDigits(progress)}٪
          </span>
        </div>

        {/* Futuristic glowing Progress Track */}
        <div className="w-full h-2.5 bg-[#0e1d3c] rounded-full overflow-hidden p-0.5 border border-cyan-500/30 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)]">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 transition-all duration-150 ease-out shadow-[0_0_15px_rgba(0,210,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Bottom Credits & Official Tag */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span>طرح و توسعه توسط:</span>
            <span className="text-cyan-300 font-semibold">تکاپوگران سپهر مانا</span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>نسخه ارائه رویداد هکاتون ۱۴۰۵</span>
          </div>
        </div>

      </div>
    </div>
  );
};

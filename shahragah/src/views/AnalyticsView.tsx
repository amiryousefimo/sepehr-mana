import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  ANALYTICS_TIMELINE_DATA, 
  CATEGORY_DISTRIBUTION_DATA, 
  PRIORITY_DISTRIBUTION_DATA, 
  DISTRICT_COMPARISON_DATA 
} from '../data/mockData';
import { TrendingUp, PieChart as PieIcon, BarChart2, AlertCircle } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" dir="rtl">
      {/* نوار عنوان */}
      <div className="bg-ivory-surface border border-borderMuted rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-10 bg-forest rounded-full shrink-0" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-darkText leading-none">
              تحلیل کلان و هوش داده‌های شهری
            </h2>
            <p className="text-xs sm:text-sm text-slateGreen mt-1 font-normal">
              بینش‌های تجمیعی حاصل از موتور پردازش متن شهرآگاه و ارزیابی چندمعیاره اولویت‌ها
            </p>
          </div>
        </div>
      </div>

      {/* خلاصه تحلیلی هوشمند */}
      <div className="bg-ivory-surface p-4 rounded-2xl border-r-4 border-forest border border-borderMuted shadow-sm flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-forest shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm">
          <div className="font-semibold text-darkText">خلاصه تحلیلی هوشمند سامانه شهرآگاه</div>
          <p className="text-slateGreen leading-relaxed font-normal">
            در ۲۴ ساعت گذشته، بیشترین حجم گزارش‌ها مربوط به مشکلات زیرساختی و خدمات شهری بوده است. تحلیل روند نشان می‌دهد اوج بارندگی در ساعات ۱۴:۰۰ منجر به جهش ۱۸۰ درصدی گزارش‌های آبگرفتگی در پهنه غرب تهران (مناطق ۲ و ۵) شده است.
          </p>
        </div>
      </div>

      {/* گرید نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نمودار ۱: روند دریافت گزارش‌ها در طول زمان */}
        <div className="bg-ivory-surface p-5 rounded-2xl border border-borderMuted shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-borderMuted">
            <h3 className="font-semibold text-sm sm:text-base text-darkText flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-terracotta" />
              <span>روند دریافت گزارش‌ها در طول شبانه‌روز</span>
            </h3>
            <span className="text-xs text-slateGreen">۲۴ ساعت اخیر</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_TIMELINE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97852" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#D97852" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#203B35" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#203B35" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DEDCD3" />
                <XAxis dataKey="time" tick={{ fill: '#75847B', fontSize: 11 }} />
                <YAxis tick={{ fill: '#75847B', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FAF9F5', borderColor: '#DEDCD3', borderRadius: '12px', fontSize: '12px', textAlign: 'right', color: '#252D29' }} 
                />
                <Area type="monotone" dataKey="reports" name="گزارش‌های ورودی" stroke="#D97852" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" />
                <Area type="monotone" dataKey="resolved" name="تعیین تکلیف شده" stroke="#203B35" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slateGreen pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-terracotta inline-block" />
              <span>گزارش‌های ورودی</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-forest inline-block" />
              <span>اقدام یا ارجاع‌شده</span>
            </div>
          </div>
        </div>

        {/* نمودار ۲: توزیع موضوعی مسائل */}
        <div className="bg-ivory-surface p-5 rounded-2xl border border-borderMuted shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-borderMuted">
            <h3 className="font-semibold text-sm sm:text-base text-darkText flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-forest" />
              <span>توزیع مسائل بر اساس دسته‌بندی موضوعی</span>
            </h3>
            <span className="text-xs text-slateGreen">تمام مناطق</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_DISTRIBUTION_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DEDCD3" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#75847B', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#252D29', fontSize: 11 }} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FAF9F5', borderColor: '#DEDCD3', borderRadius: '12px', fontSize: '12px', textAlign: 'right', color: '#252D29' }} 
                />
                <Bar dataKey="count" name="تعداد مسائل" fill="#D97852" radius={[0, 6, 6, 0]}>
                  {CATEGORY_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slateGreen text-center">
            * به دلیل سناریوی بارندگی اخیر، رتبه نخست متعلق به آبگرفتگی معابر است.
          </div>
        </div>

        {/* نمودار ۳: توزیع اولویت‌ها */}
        <div className="bg-ivory-surface p-5 rounded-2xl border border-borderMuted shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-borderMuted">
            <h3 className="font-semibold text-sm sm:text-base text-darkText flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber" />
              <span>توزیع پرونده‌ها بر اساس سطح اولویت</span>
            </h3>
            <span className="text-xs text-slateGreen">وضعیت جاری</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PRIORITY_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {PRIORITY_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`slice-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FAF9F5', borderColor: '#DEDCD3', borderRadius: '12px', fontSize: '12px', textAlign: 'right', color: '#252D29' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            {PRIORITY_DISTRIBUTION_DATA.map((item) => (
              <div key={item.name} className="p-2 rounded-lg bg-ivory-warm border border-borderMuted">
                <span className="block text-slateGreen">{item.name}</span>
                <span className="font-bold text-darkText text-sm sm:text-base">{item.value} مورد</span>
              </div>
            ))}
          </div>
        </div>

        {/* نمودار ۴: مقایسه مناطق */}
        <div className="bg-ivory-surface p-5 rounded-2xl border border-borderMuted shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-borderMuted">
            <h3 className="font-semibold text-sm sm:text-base text-darkText flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-forest" />
              <span>مقایسه حجم مسائل در مناطق شهرداری</span>
            </h3>
            <span className="text-xs text-slateGreen">مناطق منتخب</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISTRICT_COMPARISON_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DEDCD3" />
                <XAxis dataKey="district" tick={{ fill: '#75847B', fontSize: 11 }} />
                <YAxis tick={{ fill: '#75847B', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FAF9F5', borderColor: '#DEDCD3', borderRadius: '12px', fontSize: '12px', textAlign: 'right', color: '#252D29' }} 
                />
                <Bar dataKey="reports" name="گزارش‌های مردمی" fill="#D97852" radius={[6, 6, 0, 0]} />
                <Bar dataKey="issues" name="مسائل تجمیعی" fill="#203B35" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slateGreen pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-terracotta inline-block" />
              <span>گزارش‌ها</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-forest inline-block" />
              <span>مسائل تجمیعی</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

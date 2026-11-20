import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  MapPin, 
  Send, 
  Eye, 
  FileSpreadsheet
} from 'lucide-react';
import { PRIORITY_MAP, STATUS_MAP } from '../data/mockData';
import { PriorityLevel } from '../types';

export const IssuesManagementView: React.FC = () => {
  const { 
    issues, 
    openIssueDetails, 
    setReferralModalIssue, 
    addToast 
  } = useApp();

  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'reports'>('priority');

  const priorityWeights: Record<PriorityLevel, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    normal: 1,
  };

  const filtered = issues.filter((issue) => {
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && issue.priority !== selectedPriority) return false;
    if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const match =
        issue.title.toLowerCase().includes(q) ||
        issue.locationName.toLowerCase().includes(q) ||
        issue.districtName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'priority') {
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }
    if (sortBy === 'reports') {
      return b.reportsCount - a.reportsCount;
    }
    return 0;
  });

  const handleExportCsv = () => {
    addToast({
      type: 'success',
      title: 'خروجی اکسل و CSV آماده شد',
      description: 'فهرست مسائل جاری شهرداری جهت ارسال به کارتابل دیسپاچینگ مرکزی آماده‌سازی شد.',
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" dir="rtl">
      {/* نوار عنوان و اکشن‌ها */}
      <div className="bg-ivory-surface border border-borderMuted rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-10 bg-forest rounded-full shrink-0" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-darkText leading-none">
              کارتابل جامع مدیریت مسائل شهری
            </h2>
            <p className="text-xs sm:text-sm text-slateGreen mt-1 font-normal">
              تفکیک، جستجو و اولویت‌بندی پرونده‌های شهری جهت ارجاع به معاونت‌های اجرایی مناطق
            </p>
          </div>
        </div>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ivory-warm hover:bg-borderMuted border border-borderMuted text-darkText text-xs sm:text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-forest" />
          <span>خروجی لاگ عملیاتی (CSV)</span>
        </button>
      </div>

      {/* بخش جستجو و فیلترها */}
      <div className="bg-ivory-surface p-4 rounded-2xl border border-borderMuted shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* ورودی جستجو */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slateGreen absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی عنوان مسئله، معبر، تقاطع یا محله..."
              className="w-full pr-9 pl-4 py-2 rounded-xl bg-ivory-warm border border-borderMuted text-xs sm:text-sm text-darkText placeholder-slateGreen/70 focus:outline-none focus:border-forest font-normal"
            />
          </div>

          {/* فیلتر دسته */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 rounded-xl bg-ivory-warm border border-borderMuted text-xs sm:text-sm text-darkText focus:outline-none focus:border-forest font-sans"
          >
            <option value="all">همه دسته‌ها</option>
            <option value="waterlogging">آبگرفتگی معابر</option>
            <option value="asphalt">خرابی آسفالت</option>
            <option value="lighting">روشنایی معابر</option>
            <option value="obstruction">سد معبر</option>
            <option value="waste">پسماند و نظافت</option>
            <option value="traffic_signs">علائم ترافیکی</option>
            <option value="greenery">فضای سبز</option>
          </select>

          {/* فیلتر اولویت */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="p-2 rounded-xl bg-ivory-warm border border-borderMuted text-xs sm:text-sm text-darkText focus:outline-none focus:border-forest font-sans"
          >
            <option value="all">همه اولویت‌ها</option>
            <option value="critical">بحرانی (قرمز)</option>
            <option value="high">بالا (کهربایی)</option>
            <option value="medium">متوسط (آبی)</option>
            <option value="normal">عادی</option>
          </select>

          {/* فیلتر وضعیت */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 rounded-xl bg-ivory-warm border border-borderMuted text-xs sm:text-sm text-darkText focus:outline-none focus:border-forest font-sans"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="new">جدید</option>
            <option value="investigating">در حال بررسی</option>
            <option value="referred">ارجاع‌شده</option>
            <option value="in_progress">در حال رسیدگی</option>
            <option value="resolved">حل‌شده</option>
          </select>

          {/* مرتب‌سازی */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 rounded-xl bg-ivory-warm border border-borderMuted text-xs sm:text-sm text-darkText focus:outline-none focus:border-forest font-sans"
          >
            <option value="priority">مرتب‌سازی: بیشترین اولویت</option>
            <option value="reports">مرتب‌سازی: تعداد گزارش‌ها</option>
            <option value="time">مرتب‌سازی: زمان ثبت</option>
          </select>
        </div>
      </div>

      {/* جدول داده‌ها */}
      <div className="bg-ivory-surface rounded-2xl border border-borderMuted shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-ivory-warm text-slateGreen font-semibold border-b border-borderMuted">
              <tr>
                <th className="py-3 px-4">اولویت</th>
                <th className="py-3 px-4">عنوان مسئله شهری</th>
                <th className="py-3 px-4">محدوده / منطقه</th>
                <th className="py-3 px-4">گزارش‌ها</th>
                <th className="py-3 px-4">واحد مسئول پیشنهادی</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderMuted/60">
              {filtered.map((issue) => {
                const priority = PRIORITY_MAP[issue.priority];
                const status = STATUS_MAP[issue.status];
                const isHotspot = Boolean(issue.isCriticalHotspot);

                return (
                  <tr 
                    key={issue.id}
                    className={`hover:bg-ivory-warm/60 transition-colors ${
                      isHotspot ? 'bg-rose-50/70' : ''
                    }`}
                  >
                    {/* اولویت */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span 
                        className="text-xs font-semibold px-2.5 py-0.5 rounded text-white inline-block shadow-sm"
                        style={{ backgroundColor: priority.badgeColor }}
                      >
                        {priority.title}
                      </span>
                    </td>

                    {/* عنوان و دسته */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-darkText hover:text-forest cursor-pointer flex items-center gap-1.5 flex-wrap" onClick={() => openIssueDetails(issue.id)}>
                        <span>{issue.title}</span>
                        {issue.isManuallyOverridden && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-medium">
                            بازنگری کارشناس
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slateGreen mt-0.5 flex items-center gap-2 font-normal">
                        <span>{issue.categoryTitle}</span>
                        <span>•</span>
                        <span>{issue.createdAt}</span>
                      </div>
                    </td>

                    {/* محدوده */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-darkText flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-terracotta" />
                        <span>{issue.districtName}</span>
                      </div>
                      <div className="text-xs text-slateGreen truncate max-w-[150px]">
                        {issue.locationName}
                      </div>
                    </td>

                    {/* گزارش‌ها */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-forest text-sm sm:text-base">
                        {issue.reportsCount}
                      </div>
                      <span className="text-[11px] text-slateGreen font-normal">گزارش مردمی</span>
                    </td>

                    {/* واحد مسئول */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-darkText truncate max-w-[190px]">
                        {issue.suggestedUnit.unitName}
                      </div>
                      <div className="text-xs text-slateGreen truncate max-w-[190px]">
                        {issue.suggestedUnit.subUnit}
                      </div>
                    </td>

                    {/* وضعیت */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${status.badgeClass}`}>
                        {status.title}
                      </span>
                    </td>

                    {/* عملیات */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openIssueDetails(issue.id)}
                          className="p-1.5 rounded-lg bg-ivory-warm hover:bg-forest hover:text-white text-slateGreen transition-colors border border-borderMuted"
                          title="مشاهده پرونده و تحلیل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {issue.status !== 'referred' && issue.status !== 'resolved' && (
                          <button
                            onClick={() => setReferralModalIssue(issue)}
                            className="p-1.5 rounded-lg bg-terracotta/10 hover:bg-terracotta text-terracotta hover:text-white transition-colors border border-terracotta/20"
                            title="تأیید و ارجاع به واحد"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

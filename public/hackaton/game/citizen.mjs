/**
 * شهرآگاه | سامانه هوشمند مشارکت شهروندی و باشگاه خدمات محله
 * شاخه: feature/hackathon/arash
 * مرجع: todo.md و todo_arash.md
 *
 * بدون استفاده از ایموجی - همراه با ارقام کاملاً فارسی و آیکون‌های وکتوری رسمی
 */

// تابع تبدیل ارقام انگلیسی به ارقام فارسی
export function toFarsiDigits(val) {
  if (val === null || val === undefined) return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(val).replace(/[0-9]/g, d => farsiDigits[+d]);
}

// تزریق فایل استایل به صفحه در صورت عدم وجود
function ensureCitizenStyles() {
  const STYLE_ID = 'shahragah-citizen-styles';
  if (!document.getElementById(STYLE_ID)) {
    const link = document.createElement('link');
    link.id = STYLE_ID;
    link.rel = 'stylesheet';
    link.href = new URL('./citizen.css', import.meta.url).href;
    document.head.appendChild(link);
  }
}

// --------------------------------------------------------------------------
// مجموعه آیکون‌های وکتوری درون‌برنامه‌ای (سیستم آیکون Lucide شهرآگاه)
// --------------------------------------------------------------------------
const ICONS = {
  building: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`,
  sparkles: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/></svg>`,
  award: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  wallet: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>`,
  shieldCheck: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  checkCircle: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  alertTriangle: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  cloudRain: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`,
  gift: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`,
  ticket: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`,
  fileText: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  users: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  mapPin: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  trendingUp: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  bus: `<svg class="icon-svg icon-lg" viewBox="0 0 24 24"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M4 18h16"/><path d="M4 14h16"/><path d="M4 10h16"/><path d="M6 22v-2"/><path d="M18 22v-2"/><rect x="4" y="2" width="16" height="18" rx="2"/></svg>`,
  workshop: `<svg class="icon-svg icon-lg" viewBox="0 0 24 24"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>`,
  activity: `<svg class="icon-svg icon-lg" viewBox="0 0 24 24"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
  refresh: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
  send: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  arrowLeft: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  check: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`
};

// --------------------------------------------------------------------------
// بدل موقت از API (Mock API) منطبق بر قرارداد فنی todo.md
// --------------------------------------------------------------------------
export function createMockCitizenApi() {
  const STORAGE_KEY = 'shahragah_mock_game_v1';

  const defaultSeed = {
    role: 'citizen',
    day: 1,
    period: 1,
    profileId: 'citizen-1',
    cases: [
      {
        id: 'rain-sadeghiyeh',
        title: 'آب‌گرفتگی فلکه دوم صادقیه',
        location: 'منطقه ۲ و ۵ تهران، فلکه دوم صادقیه، ورودی ایستگاه مترو و رمپ شمال‌غربی',
        description: 'بارندگی شدید منجر به بالا آمدن آب‌های سطحی و انسداد معابر منتهی به ایستگاه مترو شده است. نیاز به شواهد تکمیلی جهت اقدام اکیپ خدمات شهری.',
        status: 'open'
      }
    ],
    entries: [
      {
        id: 'entry-seed-yesterday',
        caseId: 'rain-sadeghiyeh',
        profileId: 'citizen-1',
        choice: 'access',
        status: 'approved',
        createdAt: 'روز گذشته ۱۴:۱۰'
      }
    ],
    reviews: [
      {
        id: 'review-seed-yesterday',
        entryId: 'entry-seed-yesterday',
        decision: 'approve',
        reason: 'specific_access',
        reviewerId: 'operator-seed'
      }
    ],
    audits: [],
    ledger: [
      {
        id: 'ledger-seed-1',
        profileId: 'citizen-1',
        type: 'mission_reward',
        xpChange: 20,
        creditsChange: 10,
        description: 'تأیید مشاهده دقیق و ثبت شاهد میدانی معتبر روز گذشته',
        date: 'روز گذشته'
      }
    ],
    badges: [
      {
        id: 'accessibility-helper',
        title: 'همیار دسترسی معابر',
        description: 'ثبت اولین شاهد معتبر رفع مانع عبور معلولین و عابرین',
        unlocked: false
      }
    ],
    teams: [
      { id: 'sadeghiyeh', title: 'صادقیه', done: 8, goal: 10, rank: 2 },
      { id: 'gisha', title: 'گیشا', done: 17, goal: 20, rank: 1 },
      { id: 'poonak', title: 'پونک', done: 12, goal: 15, rank: 2 }
    ],
    catalog: [
      {
        id: 'trip-voucher',
        title: 'کوپن یک سفر حمل‌ونقل شهری',
        cost: 20,
        remaining: 12,
        quota: 12,
        personLimit: 1,
        iconType: 'bus',
        description: 'تسهیلات تردد شهری پس از ۲ مشارکت کیفی و تأییدشده در محله'
      },
      {
        id: 'workshop-invite',
        title: 'دعوت‌نامه کارگاه حل مسئله محله',
        cost: 40,
        remaining: 4,
        quota: 4,
        personLimit: 1,
        iconType: 'workshop',
        description: 'حضور در نشست تخصصی برنامه‌ریزی شهری با مدیران ناحیه و نخبگان محلی'
      },
      {
        id: 'pool-ticket',
        title: 'بلیت یک نوبت مجموعه ورزشی',
        cost: 100,
        remaining: 2,
        quota: 2,
        personLimit: 1,
        iconType: 'activity',
        description: 'تسهیلات نشاط و سلامت شهروندی ویژه فعالان نمونه محله'
      }
    ],
    vouchers: [],
    balances: {
      'citizen-1': { xp: 20, credits: 10 }
    },
    seenRequests: []
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Storage load error, fallback to seed', e);
    }
    return JSON.parse(JSON.stringify(defaultSeed));
  }

  let state = loadState();
  const listeners = new Set();

  function saveAndNotify() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Storage save error', e);
    }
    listeners.forEach(fn => {
      try { fn(state); } catch (err) { console.error(err); }
    });
  }

  return {
    getState() {
      return state;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    dispatch(action) {
      if (!action || !action.type) {
        return { ok: false, code: 'INVALID_STATE' };
      }

      const profileId = state.profileId || 'citizen-1';
      const balance = state.balances[profileId] || { xp: 0, credits: 0 };

      switch (action.type) {
        case 'submit': {
          const { caseId, choice } = action;
          if (!caseId || !choice) {
            return { ok: false, code: 'INVALID_STATE' };
          }

          const entryId = 'entry-' + Date.now();
          const newEntry = {
            id: entryId,
            caseId,
            profileId,
            choice,
            status: 'pending',
            createdAt: 'امروز ۱۴:۴۰'
          };
          state.entries = state.entries.filter(e => e.caseId !== caseId);
          state.entries.push(newEntry);

          if (choice === 'repeat') {
            newEntry.status = 'returned';
            state.reviews.push({
              id: 'rev-' + Date.now(),
              entryId,
              decision: 'return',
              reason: 'no_new_detail',
              comment: 'این گزارش صرفاً به بیان کلی آب‌گرفتگی پرداخته و فاقد اطلاعات تازه برای اولویت‌بندی اعزام اکیپ است.'
            });
          } else if (choice === 'hearsay') {
            newEntry.status = 'returned';
            state.reviews.push({
              id: 'rev-' + Date.now(),
              entryId,
              decision: 'return',
              reason: 'unverified',
              comment: 'گزارش متکی بر شنیده‌هاست؛ موقعیت دقیق معبر، زمان و شواهد عینی ثبت نشده است.'
            });
          } else if (choice === 'access') {
            newEntry.status = 'approved';
            state.reviews.push({
              id: 'rev-' + Date.now(),
              entryId,
              decision: 'approve',
              reason: 'specific_access',
              comment: 'شاهد معتبر و مکمل: ثبت دقیق زمان، ضلع شمال‌غربی فلکه و اثر مستقیم بر مسدود شدن رمپ ویلچر معلولین.'
            });

            const alreadyRewarded = state.ledger.some(l => l.caseId === caseId && l.type === 'mission_reward');
            if (!alreadyRewarded) {
              balance.xp += 20;
              balance.credits += 10;
              state.ledger.unshift({
                id: 'led-' + Date.now(),
                caseId,
                profileId,
                type: 'mission_reward',
                xpChange: 20,
                creditsChange: 10,
                description: 'تأیید شاهد میدانی موثر بر پرونده صادقیه (همیار دسترسی معابر)',
                date: 'امروز'
              });

              const badge = state.badges.find(b => b.id === 'accessibility-helper');
              if (badge) badge.unlocked = true;

              const team = state.teams.find(t => t.id === 'sadeghiyeh');
              if (team && team.done < 10) {
                team.done = Math.min(team.goal, team.done + 1);
              }
              state.teams.forEach(t => {
                const pct = t.done / t.goal;
                if (pct >= 0.9) t.rank = 1;
                else if (pct >= 0.85) t.rank = 2;
                else t.rank = 2;
              });
            }
          }

          saveAndNotify();
          return { ok: true };
        }

        case 'redeem': {
          const { itemId, requestId } = action;
          if (!itemId || !requestId) {
            return { ok: false, code: 'INVALID_STATE' };
          }

          if (state.seenRequests.includes(requestId)) {
            return { ok: false, code: 'DUPLICATE' };
          }

          const item = state.catalog.find(c => c.id === itemId);
          if (!item) {
            return { ok: false, code: 'INVALID_STATE' };
          }

          if (balance.credits < item.cost) {
            return { ok: false, code: 'INSUFFICIENT' };
          }

          if (item.remaining <= 0) {
            return { ok: false, code: 'SOLD_OUT' };
          }

          const alreadyClaimed = state.vouchers.filter(v => v.profileId === profileId && v.itemId === itemId).length;
          if (alreadyClaimed >= (item.personLimit || 1)) {
            return { ok: false, code: 'PERSON_LIMIT' };
          }

          balance.credits -= item.cost;
          item.remaining -= 1;
          state.seenRequests.push(requestId);

          const voucherId = 'vch-' + Date.now();
          const codeSuffix = Math.floor(1000 + Math.random() * 9000);
          const voucherCode = `DEMO-${itemId.toUpperCase().slice(0, 4)}-${codeSuffix}`;

          const newVoucher = {
            id: voucherId,
            itemId,
            profileId,
            title: item.title,
            cost: item.cost,
            code: voucherCode,
            status: 'active',
            issuedAt: 'امروز'
          };
          state.vouchers.unshift(newVoucher);

          state.ledger.unshift({
            id: 'led-' + Date.now(),
            profileId,
            type: 'voucher_purchase',
            xpChange: 0,
            creditsChange: -item.cost,
            description: `دریافت تسهیلات: ${item.title} (شناسه ${voucherCode})`,
            date: 'امروز'
          });

          saveAndNotify();
          return { ok: true, voucher: newVoucher };
        }

        case 'use': {
          const { voucherId } = action;
          const voucher = state.vouchers.find(v => v.id === voucherId && v.profileId === profileId);
          if (!voucher || voucher.status === 'used') {
            return { ok: false, code: 'INVALID_STATE' };
          }

          voucher.status = 'used';
          voucher.usedAt = 'امروز، ثبت در محل';

          saveAndNotify();
          return { ok: true };
        }

        case 'reset': {
          state = JSON.parse(JSON.stringify(defaultSeed));
          saveAndNotify();
          return { ok: true };
        }

        default:
          return { ok: false, code: 'FORBIDDEN' };
      }
    }
  };
}

// --------------------------------------------------------------------------
// کامپوننت اصلی شهروند: mountCitizen
// --------------------------------------------------------------------------
export function mountCitizen(root, externalApi = null) {
  ensureCitizenStyles();

  const container = typeof root === 'string' ? document.querySelector(root) : root;
  if (!container) {
    console.error('mountCitizen: المنت ریشه معتبر یافت نشد.');
    return () => {};
  }

  const api = externalApi || createMockCitizenApi();

  let activeTab = 'mission';
  let pendingRedeemItem = null;
  let activeToast = null;
  let isSubmitting = false;

  const appEl = document.createElement('div');
  appEl.className = 'shahragah-citizen-app';
  container.innerHTML = '';
  container.appendChild(appEl);

  function showToast(message, type = 'info') {
    if (activeToast) {
      activeToast.remove();
      activeToast = null;
    }
    const toast = document.createElement('div');
    toast.className = `citizen-toast-box ${type}`;
    const icon = type === 'error' ? ICONS.alertTriangle : ICONS.checkCircle;
    toast.innerHTML = `
      ${icon}
      <span>${toFarsiDigits(message)}</span>
    `;
    document.body.appendChild(toast);
    activeToast = toast;

    setTimeout(() => {
      if (activeToast === toast) {
        toast.remove();
        activeToast = null;
      }
    }, 3800);
  }

  function getErrorMessage(code) {
    switch (code) {
      case 'INSUFFICIENT':
        return 'اعتبار شما برای دریافت این تسهیلات کافی نیست.';
      case 'SOLD_OUT':
        return 'سهمیه این تسهیلات در دوره جاری تکمیل شده است.';
      case 'PERSON_LIMIT':
        return 'سقف مجاز شما برای این عنوان در دوره جاری تکمیل شده است.';
      case 'DUPLICATE':
        return 'این درخواست قبلاً در سامانه ثبت شده است.';
      case 'INVALID_STATE':
        return 'وضعیت درخواست یا کوپن نامعتبر است (پیش‌تر مصرف شده است).';
      case 'FORBIDDEN':
        return 'سطح دسترسی لازم برای این عملیات وجود ندارد.';
      default:
        return 'خطایی در پردازش اطلاعات رخ داد. لطفاً مجدداً بررسی فرمایید.';
    }
  }

  function getReturnReasonText(reason) {
    switch (reason) {
      case 'no_new_detail':
        return 'فاقد اطلاعات تکمیلی؛ صرفاً بیان کلی آب‌گرفتگی بدون ذکر زمان دقیق یا موقعیت معبر.';
      case 'unverified':
        return 'گزارش متکی بر شنیده‌ها؛ بدون مشاهده عینی و بدون امکان اقدام عملیاتی.';
      case 'specific_access':
        return 'مشاهده مستقیم و مستند با قید زمان، موقعیت مکانی و مانع فیزیکی تردد عابرین و معلولین.';
      default:
        return 'نیازمند بازبینی و درج شواهد تکمیلی.';
    }
  }

  function render() {
    const state = api.getState();
    const profileId = state.profileId || 'citizen-1';
    const balance = (state.balances && state.balances[profileId]) || { xp: 0, credits: 0 };
    const sadeghiyehTeam = (state.teams || []).find(t => t.id === 'sadeghiyeh') || { done: 8, goal: 10, rank: 2 };
    const myVouchers = (state.vouchers || []).filter(v => v.profileId === profileId);
    const activeVouchersCount = myVouchers.filter(v => v.status === 'active').length;

    const currentEntry = (state.entries || []).find(e => e.caseId === 'rain-sadeghiyeh');
    const latestReview = currentEntry ? (state.reviews || []).find(r => r.entryId === currentEntry.id) : null;
    const hasAccessibilityBadge = (state.badges || []).some(b => b.id === 'accessibility-helper' && b.unlocked);

    const sadeghiyehPct = Math.round((sadeghiyehTeam.done / sadeghiyehTeam.goal) * 100);

    appEl.innerHTML = `
      <div class="citizen-container">

        <!-- هدر رسمی هویت محصول و پنل شاخص‌های شهروند -->
        <header class="citizen-hero-card">
          <div class="citizen-hero-top">
            <div class="citizen-brand-lockup">
              <div class="citizen-brand-icon">
                ${ICONS.building}
              </div>
              <div>
                <h1 class="citizen-hero-title">باشگاه مشارکت شهروندی و خدمات محله | شهرآگاه</h1>
                <div class="citizen-hero-subtitle">
                  ناحیه ۲ منطقه ۵ تهران (فلکه دوم صادقیه) | شناسه حساب شهروندی: ${toFarsiDigits(profileId)}
                </div>
              </div>
            </div>

            <div class="citizen-period-pill">
              <span class="pulse-indicator"></span>
              <span>دوره فعال مشارکت: پاییز ۱۴۰۵ (۲۸ روزه)</span>
            </div>
          </div>

          <!-- تفکیک شاخص‌ها: امتیاز تجربه (مهارت) در برابر اعتبار خدمات شهری -->
          <div class="citizen-kpi-grid">
            
            <div class="citizen-kpi-card">
              <div class="citizen-kpi-header">
                <span>امتیاز تجربه مشارکت (XP)</span>
                <span class="citizen-kpi-tag" style="background:rgba(255,255,255,0.15); color:#FFFFFF;">
                  سوابق مهارت
                </span>
              </div>
              <div class="citizen-kpi-value-row">
                <span class="citizen-kpi-number">${toFarsiDigits(balance.xp)}</span>
                <span class="citizen-kpi-unit">XP</span>
              </div>
              <div class="citizen-kpi-footnote">غیرقابل‌خرج؛ نمایانگر مهارت و اعتبار داده‌های ارسالی</div>
            </div>

            <div class="citizen-kpi-card">
              <div class="citizen-kpi-header">
                <span>اعتبار خدمات شهری</span>
                <span class="citizen-kpi-tag" style="background:#22C55E; color:#052E16;">
                  کیف خدمات
                </span>
              </div>
              <div class="citizen-kpi-value-row">
                <span class="citizen-kpi-number">${toFarsiDigits(balance.credits)}</span>
                <span class="citizen-kpi-unit">اعتبار</span>
              </div>
              <div class="citizen-kpi-footnote">قابل تخصیص به تسهیلات و خدمات باشگاه محله</div>
            </div>

            <div class="citizen-kpi-card">
              <div class="citizen-kpi-header">
                <span>نشان خدمت شهروندی</span>
                <span class="citizen-kpi-tag" style="background:${hasAccessibilityBadge ? '#F59E0B' : 'rgba(255,255,255,0.15)'}; color:${hasAccessibilityBadge ? '#451A03' : '#FFFFFF'};">
                  ${hasAccessibilityBadge ? 'کسب شده' : 'در انتظار شاهد'}
                </span>
              </div>
              <div class="citizen-kpi-value-row" style="font-size:1.05rem; font-weight:700;">
                <span style="display:inline-flex; align-items:center; gap:0.35rem;">
                  ${hasAccessibilityBadge ? ICONS.award : ICONS.shieldCheck}
                  همیار دسترسی معابر
                </span>
              </div>
              <div class="citizen-kpi-footnote">
                ${hasAccessibilityBadge ? 'ثبت موفق مانع رمپ ویلچر در پرونده' : 'تخصیص پس از ثبت اولین شاهد معتبر موانع معلولین'}
              </div>
            </div>

            <div class="citizen-kpi-card">
              <div class="citizen-kpi-header">
                <span>پیشرفت تحقق هدف صادقیه</span>
                <span class="citizen-kpi-tag" style="background:rgba(255,255,255,0.15); color:#FFFFFF;">
                  رتبه ${toFarsiDigits(sadeghiyehTeam.rank)} جدول
                </span>
              </div>
              <div class="citizen-kpi-value-row">
                <span class="citizen-kpi-number">${toFarsiDigits(sadeghiyehPct)}٪</span>
                <span class="citizen-kpi-unit">(${toFarsiDigits(sadeghiyehTeam.done)} از ${toFarsiDigits(sadeghiyehTeam.goal)})</span>
              </div>
              <div class="citizen-kpi-footnote">شاخص تجمیعی مشارکت مستند محله در بحران بارندگی</div>
            </div>

          </div>
        </header>

        <!-- نوار وضعیت عملیاتی و ابزار سریع ارزیابی -->
        <div class="official-notice-banner">
          <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.84rem; color:var(--c-forest-dark);">
            <span style="color:var(--c-forest);">${ICONS.sparkles}</span>
            <span>
              <strong>راهنمای تسریع در ارزیابی:</strong>
              برای مشاهده عملکرد سیستم در پذیرش اطلاعات، می‌توانید مستقیم شاهد دسترسی را ثبت فرمایید یا با انتخاب گزارش ناقص، روند بازگشت پرونده را بسنجید.
            </span>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-civic btn-civic-primary" id="btn-quick-demo-access" style="padding:0.4rem 0.85rem; font-size:0.8rem;">
              ${ICONS.send}
              <span>ثبت مستقیم شاهد معتبر دسترسی</span>
            </button>
            <button class="btn-civic btn-civic-secondary" id="btn-reset-demo" style="padding:0.4rem 0.85rem; font-size:0.8rem;">
              ${ICONS.refresh}
              <span>بازنشانی داده‌ها</span>
            </button>
          </div>
        </div>

        <!-- تب‌های ناوبری اصلی -->
        <nav class="citizen-tabs-bar" role="tablist">
          <button class="citizen-tab-item ${activeTab === 'mission' ? 'active' : ''}" data-tab="mission" role="tab" aria-selected="${activeTab === 'mission'}">
            ${ICONS.cloudRain}
            <span>پرونده و مأموریت صادقیه</span>
          </button>
          <button class="citizen-tab-item ${activeTab === 'club' ? 'active' : ''}" data-tab="club" role="tab" aria-selected="${activeTab === 'club'}">
            ${ICONS.gift}
            <span>باشگاه و تسهیلات محله</span>
          </button>
          <button class="citizen-tab-item ${activeTab === 'vouchers' ? 'active' : ''}" data-tab="vouchers" role="tab" aria-selected="${activeTab === 'vouchers'}">
            ${ICONS.ticket}
            <span>تسهیلات دریافتی من</span>
            ${activeVouchersCount > 0 ? `<span class="citizen-tab-badge">${toFarsiDigits(activeVouchersCount)}</span>` : ''}
          </button>
          <button class="citizen-tab-item ${activeTab === 'history' ? 'active' : ''}" data-tab="history" role="tab" aria-selected="${activeTab === 'history'}">
            ${ICONS.fileText}
            <span>دفتر ثبت مشارکت‌ها</span>
          </button>
        </nav>

        <!-- محتوای اصلی تب فعال -->
        <main id="citizen-tab-content">
          ${renderTabContent(state, balance, currentEntry, latestReview, hasAccessibilityBadge, myVouchers)}
        </main>

        <!-- پانویس نهادی و استانداردهای مشارکت -->
        <footer class="official-notice-banner" style="background:#FAF9F5; border-color:var(--c-border); font-size:0.775rem; color:var(--c-text-muted);">
          <div style="display:flex; align-items:flex-start; gap:0.5rem;">
            <span style="color:var(--c-forest); margin-top:2px;">${ICONS.shieldCheck}</span>
            <div>
              <strong>سامانه تجمیع مکانی و رتبه‌بندی کیفی شهرآگاه:</strong>
              تخصیص امتیاز و اعتبارات صرفاً بر اساس دقت فنی و ارزش عملیاتی اطلاعات در کاهش دوباره‌کاری اکیپ‌های خدمات شهری صورت می‌پذیرد و رویه رسیدگی اضطراری به حوادث وابسته به امتیاز افراد نیست.
            </div>
          </div>
        </footer>

      </div>

      <!-- مودال دریافت تسهیلات -->
      ${pendingRedeemItem ? renderRedeemModal(pendingRedeemItem, balance) : ''}
    `;

    bindEvents(state, balance);
  }

  function renderTabContent(state, balance, currentEntry, latestReview, hasAccessibilityBadge, myVouchers) {
    if (activeTab === 'mission') {
      return renderMissionTab(state, balance, currentEntry, latestReview, hasAccessibilityBadge);
    } else if (activeTab === 'club') {
      return renderClubTab(state, balance);
    } else if (activeTab === 'vouchers') {
      return renderVouchersTab(myVouchers);
    } else if (activeTab === 'history') {
      return renderHistoryTab(state);
    }
    return '';
  }

  // تب ۱: پرونده صادقیه و مشاهدات
  function renderMissionTab(state, balance, currentEntry, latestReview, hasAccessibilityBadge) {
    const selectedChoice = currentEntry ? currentEntry.choice : null;
    const isApproved = currentEntry && currentEntry.status === 'approved';
    const isReturned = currentEntry && currentEntry.status === 'returned';

    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        
        <!-- کارت خلاصه پرونده میدانی صادقیه -->
        <section class="citizen-content-card">
          <div class="content-card-header">
            <h2 class="content-card-title">
              ${ICONS.cloudRain}
              <span>پرونده فعال رخداد: آب‌گرفتگی معابر فلکه دوم صادقیه (rain-sadeghiyeh)</span>
            </h2>
            <span class="content-card-status" style="background:#FEE2E2; color:#991B1B;">
              اولویت ارزیابی ۸۹ از ۱۰۰ | در حال پایش
            </span>
          </div>

          <div class="case-intel-box">
            <div class="case-intel-meta">
              <span class="case-intel-item">${ICONS.mapPin} محدوده میدان صادقیه، تقاطع بزرگراه جناح و ورودی مترو</span>
              <span class="case-intel-item">${ICONS.clock} شروع بارش: امروز ۱۳:۳۰</span>
              <span class="case-intel-item">${ICONS.users} ۳۲ گزارش شهروندی متصل</span>
            </div>
            <p class="case-intel-desc">
              اکیپ‌های خدمات شهری برای اعزام مستقیم نیاز به تشخیص محل دقیق مانع دارند. ارسال گزارش‌های تکراری باعث تأخیر در تخصیص منابع می‌شود؛ در حالی که ثبت موقعیت دقیق موانع تردد (به‌ویژه رمپ‌های ویلچر و ورودی ایستگاه) امکان اعزام هدفمند تجهیزات پمپاژ را فراهم می‌سازد.
            </p>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <h3 style="font-size:0.95rem; font-weight:700; margin:0; color:var(--c-forest);">
                ثبت و ارزیابی شاهد تکمیلی شما برای این پرونده:
              </h3>
              <span style="font-size:0.75rem; color:var(--c-text-muted);">
                امکان اصلاح آزادانه گزارش بدون جریمه
              </span>
            </div>

            <div class="obs-choice-group">
              
              <!-- ۱. گزارش کلی / تکراری -->
              <div class="obs-card ${selectedChoice === 'repeat' ? 'is-active-choice' : ''} ${isReturned && selectedChoice === 'repeat' ? 'is-returned' : ''}">
                <div class="obs-card-head">
                  <div class="obs-card-type">
                    <span>۱. گزارش کلی و تکراری</span>
                    <span class="obs-card-type-sub">(فاقد جزئیات عملیاتی)</span>
                  </div>
                  ${selectedChoice === 'repeat' ? `<span class="content-card-status" style="background:#FEE2E2; color:#991B1B;">ارسال شده</span>` : ''}
                </div>

                <div class="obs-quote-box">
                  «فلکه دوم صادقیه آب گرفته؛ خیابان‌ها پر از آب شده و رفت‌وآمد سخت است.»
                </div>

                ${selectedChoice === 'repeat' && latestReview ? `
                  <div class="obs-feedback-banner returned">
                    <div style="font-weight:700; display:flex; align-items:center; gap:0.35rem;">
                      ${ICONS.alertTriangle}
                      <span>بازگردانده شده توسط کارشناس کنترل کیفیت جهت اصلاح</span>
                    </div>
                    <div><strong>علت بازگشت:</strong> ${getReturnReasonText(latestReview.reason)}</div>
                    <div>${latestReview.comment || ''}</div>
                    <div style="font-size:0.75rem; margin-top:2px;">پاداش ثبت: ۰ XP و ۰ اعتبار. لطفاً جزئیات دقیق و موانع فیزیکی را قید فرمایید.</div>
                  </div>
                ` : ''}

                <div class="obs-card-footer">
                  <span style="font-size:0.775rem; color:var(--c-text-muted);">
                    تأثیر: ارسال گزارش بدون تفکیک محل، بار بررسی را بدون افزودن ارزش بالا می‌برد.
                  </span>
                  <button class="btn-civic btn-civic-secondary btn-submit-obs" data-choice="repeat" ${isSubmitting ? 'disabled' : ''}>
                    ${ICONS.send}
                    <span>${selectedChoice === 'repeat' ? 'ارسال مجدد این گزارش' : 'ارسال این مشاهده'}</span>
                  </button>
                </div>
              </div>

              <!-- ۲. شنیده‌ها -->
              <div class="obs-card ${selectedChoice === 'hearsay' ? 'is-active-choice' : ''} ${isReturned && selectedChoice === 'hearsay' ? 'is-returned' : ''}">
                <div class="obs-card-head">
                  <div class="obs-card-type">
                    <span>۲. گزارش غیرمستقیم / شنیده‌ها</span>
                    <span class="obs-card-type-sub">(فاقد استناد میدانی)</span>
                  </div>
                  ${selectedChoice === 'hearsay' ? `<span class="content-card-status" style="background:#FEE2E2; color:#991B1B;">ارسال شده</span>` : ''}
                </div>

                <div class="obs-quote-box">
                  «شنیدم مسیر بلوار جناح هم کلاً بسته شده و ماشین‌ها تو ترافیک سنگین گیر افتادند.»
                </div>

                ${selectedChoice === 'hearsay' && latestReview ? `
                  <div class="obs-feedback-banner returned">
                    <div style="font-weight:700; display:flex; align-items:center; gap:0.35rem;">
                      ${ICONS.alertTriangle}
                      <span>بازگردانده شده توسط کارشناس کنترل کیفیت جهت اصلاح</span>
                    </div>
                    <div><strong>علت بازگشت:</strong> ${getReturnReasonText(latestReview.reason)}</div>
                    <div>${latestReview.comment || ''}</div>
                    <div style="font-size:0.75rem; margin-top:2px;">پاداش ثبت: ۰ XP و ۰ اعتبار. داده‌های بدون رصد میدانی مبنای تصمیم قرار نمی‌گیرند.</div>
                  </div>
                ` : ''}

                <div class="obs-card-footer">
                  <span style="font-size:0.775rem; color:var(--c-text-muted);">
                    تأثیر: گزارش‌های غیرموثق ممکن است منجر به اعزام اشتباه نیروهای واکنش سریع شوند.
                  </span>
                  <button class="btn-civic btn-civic-secondary btn-submit-obs" data-choice="hearsay" ${isSubmitting ? 'disabled' : ''}>
                    ${ICONS.send}
                    <span>${selectedChoice === 'hearsay' ? 'ارسال مجدد این گزارش' : 'ارسال این مشاهده'}</span>
                  </button>
                </div>
              </div>

              <!-- ۳. شاهد مکمل دسترسی -->
              <div class="obs-card ${selectedChoice === 'access' ? 'is-active-choice' : ''} ${isApproved && selectedChoice === 'access' ? 'is-approved' : ''}">
                <div class="obs-card-head">
                  <div class="obs-card-type">
                    <span>۳. شاهد مستقیم و مکمل پرونده (استاندارد عملیاتی)</span>
                    <span class="obs-card-type-sub" style="color:var(--c-success); font-weight:700;">الگوی مطلوب ثبت</span>
                  </div>
                  ${selectedChoice === 'access' ? `<span class="content-card-status" style="background:#DCFCE7; color:#14532D;">تأیید و ثبت نهایی</span>` : ''}
                </div>

                <div class="obs-quote-box">
                  «ساعت ۱۴:۴۰ رمپ شمال‌غرب فلکه برای ویلچر مسدود است؛ آب به عمق ۲۰ سانتی‌متر جمع شده و تردد معلولین و کالسکه ممکن نیست.»
                </div>

                ${selectedChoice === 'access' && isApproved ? `
                  <div class="obs-feedback-banner approved">
                    <div style="font-weight:700; display:flex; align-items:center; gap:0.35rem;">
                      ${ICONS.checkCircle}
                      <span>تأیید قطعی توسط کارشناس ممیزی سامانه شهرآگاه</span>
                    </div>
                    <div><strong>شرح ارزیابی:</strong> ${latestReview ? getReturnReasonText(latestReview.reason) : 'شاهد معتبر مکمل همراه با مشخصات دقیق زمان، محل و مانع تردد.'}</div>
                    <div style="margin-top:2px; font-weight:700;">
                      تخصیص دستاورد: +۲۰ XP مهارت مشارکت | +۱۰ اعتبار خدمات شهری | اعطای نشان خدمت «همیار دسترسی معابر»
                    </div>
                  </div>
                ` : ''}

                <div class="obs-card-footer">
                  <span style="font-size:0.775rem; color:var(--c-text-muted);">
                    تأثیر: تعیین دقیق گلوگاه انسداد، زمان رسیدگی به پرونده را تا ۴۰٪ کاهش می‌دهد.
                  </span>
                  <button class="btn-civic btn-civic-success btn-submit-obs" data-choice="access" ${isSubmitting || (isApproved && selectedChoice === 'access') ? 'disabled' : ''}>
                    ${isApproved && selectedChoice === 'access' ? ICONS.check : ICONS.send}
                    <span>${isApproved && selectedChoice === 'access' ? 'این شاهد تأیید و ثبت شده است' : 'ارسال و اصلاح به این گزارش'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- جدول رقابت و توازن محله‌ها -->
        <section class="citizen-content-card">
          <div class="content-card-header">
            <h2 class="content-card-title">
              ${ICONS.trendingUp}
              <span>جدول عمومی پیشرفت و مشارکت محله‌ها</span>
            </h2>
            <span style="font-size:0.75rem; color:var(--c-text-muted);">
              فرمول: نسبت مشارکت‌های تأییدشده به سهمیه هدف محله (مساوی‌ها رتبه مشترک)
            </span>
          </div>

          <div class="district-table-wrapper">
            <table class="district-table">
              <thead>
                <tr>
                  <th style="width:70px;">رتبه</th>
                  <th>نام محله / ناحیه</th>
                  <th>گزارش‌های معتبر / هدف</th>
                  <th>درصد تحقق</th>
                  <th>نمودار پیشرفت هدف</th>
                </tr>
              </thead>
              <tbody>
                ${(state.teams || []).map(t => {
                  const pct = Math.round((t.done / t.goal) * 100);
                  const isSadeghiyeh = t.id === 'sadeghiyeh';
                  return `
                    <tr class="${isSadeghiyeh ? 'my-district' : ''}">
                      <td>
                        <span class="rank-badge rank-${t.rank}">${toFarsiDigits(t.rank)}</span>
                      </td>
                      <td>
                        <strong>${t.title}</strong>
                        ${isSadeghiyeh ? ' <span style="font-size:0.75rem; color:var(--c-forest);">(محله پرونده جاری)</span>' : ''}
                      </td>
                      <td>${toFarsiDigits(t.done)} از ${toFarsiDigits(t.goal)} مشارکت</td>
                      <td><strong>${toFarsiDigits(pct)}٪</strong></td>
                      <td>
                        <div style="display:flex; align-items:center; gap:0.5rem;">
                          <div class="progress-track">
                            <div class="progress-fill ${pct >= 100 ? 'target-reached' : ''}" style="width:${Math.min(100, pct)}%;"></div>
                          </div>
                          <span style="font-size:0.75rem; min-width:32px; font-weight:600;">${toFarsiDigits(pct)}٪</span>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    `;
  }

  // تب ۲: باشگاه و تسهیلات خدمات محله
  function renderClubTab(state, balance) {
    const catalog = state.catalog || [];

    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        
        <section class="citizen-content-card">
          <div class="content-card-header">
            <h2 class="content-card-title">
              ${ICONS.gift}
              <span>تسهیلات و خدمات باشگاه شهروندی</span>
            </h2>
            <div style="font-size:0.875rem; font-weight:700; color:var(--c-forest);">
              مانده اعتبار شما: ${toFarsiDigits(balance.credits)} اعتبار
            </div>
          </div>

          <p style="font-size:0.825rem; color:var(--c-text-muted); margin:0;">
            اعتبارات کسب‌شده صرفاً برای دریافت خدمات اجتماعی زیر قابل استفاده است. سقف مجاز دریافت هر عنوان برای هر شهروند، یک عدد در هر دوره می‌باشد.
          </p>

          <div class="rewards-grid">
            ${catalog.map(item => {
              const distance = item.cost - balance.credits;
              const isAffordable = distance <= 0;
              const isSoldOut = item.remaining <= 0;
              const alreadyClaimed = (state.vouchers || []).some(v => v.profileId === state.profileId && v.itemId === item.id);

              let buttonLabel = 'دریافت این خدمت';
              let isDisabled = false;

              if (alreadyClaimed) {
                buttonLabel = 'قبلاً دریافت شده (سقف تکمیل)';
                isDisabled = true;
              } else if (isSoldOut) {
                buttonLabel = 'اتمام سهمیه دوره';
                isDisabled = true;
              } else if (!isAffordable) {
                buttonLabel = `اعتبار ناکافی (${toFarsiDigits(distance)} اعتبار دیگر)`;
                isDisabled = true;
              }

              const icon = item.iconType === 'bus' ? ICONS.bus : item.iconType === 'workshop' ? ICONS.workshop : ICONS.activity;

              return `
                <div class="reward-card">
                  <div class="reward-card-top">
                    <div class="reward-icon-row">
                      <div class="reward-icon-holder">
                        ${icon}
                      </div>
                      <div class="reward-price-tag">
                        <span>${toFarsiDigits(item.cost)}</span>
                        <span class="reward-price-unit">اعتبار</span>
                      </div>
                    </div>

                    <h3 class="reward-title">${item.title}</h3>
                    <p style="font-size:0.8125rem; color:var(--c-text-muted); margin:0; line-height:1.5;">
                      ${item.description || ''}
                    </p>

                    <div class="reward-meta-box">
                      <div class="reward-meta-row">
                        <span>سهمیه باقی‌مانده دوره:</span>
                        <strong>${toFarsiDigits(item.remaining)} از ${toFarsiDigits(item.quota)}</strong>
                      </div>
                      <div class="reward-meta-row">
                        <span>سقف مجاز هر شهروند:</span>
                        <span>۱ عدد در دوره</span>
                      </div>
                      ${!isAffordable && !alreadyClaimed ? `
                        <div class="reward-deficit-alert">
                          ${ICONS.alertTriangle}
                          <span>فاصله تا دریافت: ${toFarsiDigits(distance)} اعتبار</span>
                        </div>
                      ` : ''}
                    </div>
                  </div>

                  <button class="btn-civic btn-civic-primary btn-redeem" data-item-id="${item.id}" ${isDisabled ? 'disabled' : ''} style="width:100%;">
                    ${buttonLabel}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </section>

      </div>
    `;
  }

  // تب ۳: کوپن‌های من
  function renderVouchersTab(myVouchers) {
    if (!myVouchers || myVouchers.length === 0) {
      return `
        <section class="citizen-content-card">
          <div style="text-align:center; padding:3rem 1rem; color:var(--c-text-muted); display:flex; flex-direction:column; align-items:center; gap:0.75rem;">
            <div style="width:54px; height:54px; border-radius:50%; background:#FAF8F2; display:flex; align-items:center; justify-content:center; color:var(--c-slate-green);">
              ${ICONS.ticket}
            </div>
            <strong style="font-size:0.95rem; color:var(--c-forest);">هنوز تسهیلاتی برای این حساب ثبت نشده است</strong>
            <span style="font-size:0.825rem; max-width:420px; line-height:1.6;">
              با ارسال شواهد موثر در پرونده‌های باز محله و کسب اعتبارات، می‌توانید تسهیلات باشگاه شهروندی را دریافت فرمایید.
            </span>
          </div>
        </section>
      `;
    }

    return `
      <section class="citizen-content-card">
        <div class="content-card-header">
          <h2 class="content-card-title">
            ${ICONS.ticket}
            <span>تسهیلات و کوپن‌های فعال من (${toFarsiDigits(myVouchers.length)} فقره)</span>
          </h2>
          <span style="font-size:0.75rem; color:var(--c-text-muted);">
            شناسه رهگیری دیجیتال جهت بهره‌برداری
          </span>
        </div>

        <div class="vouchers-grid">
          ${myVouchers.map(v => {
            const isUsed = v.status === 'used';
            return `
              <div class="voucher-item-card ${isUsed ? 'is-used' : ''}">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="font-size:0.95rem; color:var(--c-forest);">${v.title}</strong>
                  <span class="content-card-status" style="background:${isUsed ? '#E2E8F0' : '#DCFCE7'}; color:${isUsed ? '#475569' : '#14532D'};">
                    ${isUsed ? 'مصرف شده' : 'معتبر و آماده ارائه'}
                  </span>
                </div>

                <div>
                  <div style="font-size:0.75rem; color:var(--c-text-muted); margin-bottom:4px;">شناسه دیجیتال یکتا:</div>
                  <div class="voucher-code-display">${toFarsiDigits(v.code)}</div>
                </div>

                <div style="font-size:0.775rem; color:var(--c-text-muted); display:flex; justify-content:space-between;">
                  <span>ارزش خدمت: ${toFarsiDigits(v.cost)} اعتبار</span>
                  <span>${isUsed ? `${v.usedAt || 'مصرف شده'}` : `صدور: ${v.issuedAt || 'امروز'}`}</span>
                </div>

                <div>
                  <button class="btn-civic ${isUsed ? 'btn-civic-secondary' : 'btn-civic-primary'} btn-use-voucher" data-voucher-id="${v.id}" ${isUsed ? 'disabled' : ''} style="width:100%;">
                    ${isUsed ? 'تسهیلات ثبت و مصرف شده است' : 'ثبت مصرف در گیت / محل پذیرش'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  // تب ۴: دفتر ثبت مشارکت‌ها (Ledger)
  function renderHistoryTab(state) {
    const ledger = state.ledger || [];

    return `
      <section class="citizen-content-card">
        <div class="content-card-header">
          <h2 class="content-card-title">
            ${ICONS.fileText}
            <span>دفتر ثبت مشارکت‌ها و تراکنش‌های اعتباری</span>
          </h2>
          <span style="font-size:0.75rem; color:var(--c-text-muted);">
            رویدادهای قطعی و تغییرات تراز حساب شهروندی
          </span>
        </div>

        ${ledger.length === 0 ? `
          <div style="text-align:center; padding:2rem 1rem; color:var(--c-text-muted);">
            تراکنشی یافت نشد.
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            ${ledger.map(item => {
              const isCreditsPositive = item.creditsChange > 0;
              const isCreditsNegative = item.creditsChange < 0;
              return `
                <div class="ledger-row-item">
                  <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span style="color:${isCreditsPositive ? 'var(--c-success)' : isCreditsNegative ? 'var(--c-terracotta)' : 'var(--c-slate-green)'};">
                      ${isCreditsPositive ? ICONS.checkCircle : isCreditsNegative ? ICONS.ticket : ICONS.fileText}
                    </span>
                    <span>${toFarsiDigits(item.description)}</span>
                    <span style="font-size:0.72rem; color:var(--c-text-muted);">(${item.date || 'امروز'})</span>
                  </div>
                  <div style="display:flex; gap:0.85rem; align-items:center;">
                    ${item.creditsChange !== 0 ? `
                      <span class="ledger-amount-credits ${isCreditsPositive ? 'plus' : 'minus'}">
                        ${isCreditsPositive ? `+${toFarsiDigits(item.creditsChange)}` : toFarsiDigits(item.creditsChange)} اعتبار
                      </span>
                    ` : ''}
                    ${item.xpChange > 0 ? `
                      <span class="ledger-amount-xp">
                        +${toFarsiDigits(item.xpChange)} XP
                      </span>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </section>
    `;
  }

  // مودال دریافت تسهیلات
  function renderRedeemModal(item, balance) {
    const remainingCredits = balance.credits - item.cost;
    return `
      <div class="citizen-dialog-backdrop" id="redeem-modal-backdrop">
        <div class="citizen-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <h3 class="citizen-dialog-title" id="modal-title">
            ${ICONS.ticket}
            <span>تأیید تخصیص خدمت شهروندی</span>
          </h3>
          
          <div style="font-size:0.875rem; line-height:1.6; color:var(--c-dark-text);">
            <p style="margin:0 0 0.75rem 0;">
              درخواست صدور <strong>«${item.title}»</strong> با کسر <strong>${toFarsiDigits(item.cost)} اعتبار</strong> از حساب مشارکت شهروندی شما:
            </p>
            
            <div style="background:#FAF8F2; padding:0.85rem 1rem; border-radius:8px; border:1px solid var(--c-border); font-size:0.8125rem; display:flex; flex-direction:column; gap:0.4rem;">
              <div style="display:flex; justify-content:space-between;">
                <span>موجودی اعتبار فعلی:</span>
                <strong>${toFarsiDigits(balance.credits)} اعتبار</strong>
              </div>
              <div style="display:flex; justify-content:space-between; color:var(--c-terracotta);">
                <span>هزینه تخصیص خدمت:</span>
                <strong>-${toFarsiDigits(item.cost)} اعتبار</strong>
              </div>
              <div style="border-top:1px dashed var(--c-border); padding-top:0.4rem; display:flex; justify-content:space-between; font-weight:700;">
                <span>مانده اعتبار پس از دریافت:</span>
                <strong>${toFarsiDigits(remainingCredits)} اعتبار</strong>
              </div>
            </div>

            <p style="font-size:0.75rem; color:var(--c-text-muted); margin:0.75rem 0 0 0; line-height:1.5;">
              * این تخصیص صرفاً از محل اعتبار خرج‌شدنی انجام شده و هیچ‌گونه کاهشی در امتیاز تجربه (XP) و رتبه محله شما ایجاد نمی‌کند.
            </p>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
            <button class="btn-civic btn-civic-secondary" id="btn-cancel-redeem">انصراف</button>
            <button class="btn-civic btn-civic-primary" id="btn-confirm-redeem" ${isSubmitting ? 'disabled' : ''}>
              ${isSubmitting ? 'در حال ثبت نهایی...' : 'تأیید و دریافت مجوز'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function bindEvents(state, balance) {
    appEl.querySelectorAll('.citizen-tab-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab && tab !== activeTab) {
          activeTab = tab;
          render();
        }
      });
    });

    appEl.querySelectorAll('.btn-submit-obs').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-choice');
        if (!choice || isSubmitting) return;

        isSubmitting = true;
        btn.disabled = true;

        const result = api.dispatch({
          type: 'submit',
          caseId: 'rain-sadeghiyeh',
          choice
        });

        isSubmitting = false;

        if (result && result.ok) {
          if (choice === 'access') {
            showToast('شاهد معتبر با موفقیت تأیید گردید (+۲۰ XP مهارت و +۱۰ اعتبار)', 'success');
          } else {
            showToast('گزارش ارسال شد؛ به دلیل عدم احراز شواهد مکانی نیازمند اصلاح تشخیص داده شد.', 'error');
          }
        } else {
          showToast(getErrorMessage(result ? result.code : 'INVALID_STATE'), 'error');
        }
      });
    });

    appEl.querySelectorAll('.btn-redeem').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-item-id');
        const item = (state.catalog || []).find(c => c.id === itemId);
        if (item) {
          pendingRedeemItem = item;
          render();
        }
      });
    });

    const cancelBtn = appEl.querySelector('#btn-cancel-redeem');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        pendingRedeemItem = null;
        render();
      });
    }

    const confirmBtn = appEl.querySelector('#btn-confirm-redeem');
    if (confirmBtn && pendingRedeemItem) {
      confirmBtn.addEventListener('click', () => {
        if (isSubmitting) return;
        isSubmitting = true;
        confirmBtn.disabled = true;

        const requestId = `req-${pendingRedeemItem.id}-${state.profileId}-${Date.now()}`;

        const result = api.dispatch({
          type: 'redeem',
          itemId: pendingRedeemItem.id,
          requestId
        });

        isSubmitting = false;
        const boughtItem = pendingRedeemItem;
        pendingRedeemItem = null;

        if (result && result.ok) {
          showToast(`مجوز بهره‌برداری از «${boughtItem.title}» صادر گردید.`, 'success');
          activeTab = 'vouchers';
        } else {
          showToast(getErrorMessage(result ? result.code : 'INVALID_STATE'), 'error');
        }
      });
    }

    appEl.querySelectorAll('.btn-use-voucher').forEach(btn => {
      btn.addEventListener('click', () => {
        const voucherId = btn.getAttribute('data-voucher-id');
        if (!voucherId || isSubmitting) return;

        isSubmitting = true;
        btn.disabled = true;

        const result = api.dispatch({
          type: 'use',
          voucherId
        });

        isSubmitting = false;

        if (result && result.ok) {
          showToast('مصرف این خدمت در سامانه ثبت گردید.', 'success');
        } else {
          showToast(getErrorMessage(result ? result.code : 'INVALID_STATE'), 'error');
        }
      });
    });

    const btnQuickAccess = appEl.querySelector('#btn-quick-demo-access');
    if (btnQuickAccess) {
      btnQuickAccess.addEventListener('click', () => {
        api.dispatch({
          type: 'submit',
          caseId: 'rain-sadeghiyeh',
          choice: 'access'
        });
        showToast('شاهد معتبر ثبت و تأیید شد (+۲۰ XP و +۱۰ اعتبار).', 'success');
        activeTab = 'club';
      });
    }

    const btnReset = appEl.querySelector('#btn-reset-demo');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('آیا مایل به بازنشانی اطلاعات به حالت پایه اولیه هستید؟')) {
          api.dispatch({ type: 'reset' });
          showToast('اطلاعات با موفقیت به نقطه شروع بازنشانی شد.', 'info');
        }
      });
    }
  }

  const unsubscribe = api.subscribe(() => {
    render();
  });

  render();

  return () => {
    unsubscribe();
    if (activeToast) {
      activeToast.remove();
      activeToast = null;
    }
    appEl.innerHTML = '';
  };
}

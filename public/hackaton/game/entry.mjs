/**
 * شهرآگاه | نقطه اتصال و اجرای یکپارچه شبیه‌ساز بازی هکاتون
 * شاخه: feature/hackathon/vahab
 * مرجع: todo.md و todo_vahab.md
 *
 * بدون استفاده از هیچ‌گونه ایموجی - ارقام کاملاً فارسی - سیستم آیکون وکتوری رسمی
 */

import { createGameStore } from './core.mjs';
import { PERSON_IDS } from './fixtures.mjs';

// تبدیل ارقام انگلیسی به ارقام فارسی
export function toFarsiDigits(val) {
  if (val === null || val === undefined) return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(val).replace(/[0-9]/g, d => farsiDigits[+d]);
}

// توضیحات مأموریت هر نقش در شبیه‌ساز
const ROLE_DESCRIPTIONS = {
  citizen: {
    title: 'شهروند محله (صادقیه)',
    personId: PERSON_IDS.citizen,
    summary: 'ثبت و اصلاح مشاهدات میدانی مکمل برای پرونده بارندگی، پیگیری وضعیت، کسب اعتبار و بهره‌مندی از خدمات باشگاه محله.',
    badgeHint: 'نشان هدف: همیار دسترسی معابر (با ثبت اولین شاهد معتبر مانع تردد)',
  },
  operator: {
    title: 'کارشناس بررسی (اپراتور)',
    personId: PERSON_IDS.operator,
    summary: 'بررسی مستدل گزارش‌های واصله از شهروندان، انطباق با معیارهای کیفی پرونده و ثبت تصمیم تأیید پیوست یا برگشت جهت اصلاح.',
    badgeHint: 'نشان هدف: داور منصف (با ثبت ۳ تصمیم صحیح و تأییدشده در ممیزی)',
  },
  manager: {
    title: 'مدیر ممیزی (امین محله)',
    personId: PERSON_IDS.manager,
    summary: 'ممیزی نمونه‌ای از تصمیم‌های ثبت‌شده اپراتورها، راستی‌آزمایی معیارها، کشف خطاهای آموزشی و ارتقای استاندارد خدمات شهری.',
    badgeHint: 'نشان هدف: امین محله (با ۲ ممیزی منطبق بر کلید ارزیابی)',
  },
};

// نمونه‌سازی فروشگاه مرکزی بازی
export const store = createGameStore();

/**
 * مدیریت اتصال ماژول‌های رابط کاربری و تعویض بدون نشت نقش‌ها
 */
export function initGameApp(options = {}) {
  const slotSelector = options.slotSelector || '#game-mount-slot';
  const roleTabSelector = options.roleTabSelector || '[data-role-target]';
  const resetBtnSelector = options.resetBtnSelector || '#btn-global-reset';
  const descContainerSelector = options.descContainerSelector || '#role-description-banner';

  const mountContainer = document.querySelector(slotSelector);
  if (!mountContainer) {
    console.error(`initGameApp: کانتینر مقصد ${slotSelector} در سند یافت نشد.`);
    return;
  }

  let currentUnmount = null;
  let activeRole = null;

  // به‌روزرسانی نوار راهنما و شناسه نقش فعال
  function updateRoleBanner(role) {
    const descEl = document.querySelector(descContainerSelector);
    if (!descEl) return;

    const info = ROLE_DESCRIPTIONS[role] || ROLE_DESCRIPTIONS.citizen;
    const state = store.getState();
    const balance = state.balances[info.personId] || { xp: 0, credits: 0 };

    descEl.innerHTML = `
      <div class="sh-role-meta">
        <div class="sh-role-meta__header">
          <span class="sh-role-chip role-${role}">${info.title}</span>
          <span class="sh-role-id">شناسه فعال: <code>${info.personId}</code></span>
        </div>
        <p class="sh-role-summary">${info.summary}</p>
        <div class="sh-role-stats">
          <span class="sh-stat-pill">
            <svg class="icon-inline" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
            <span>امتیاز تجربه (XP): <strong>${toFarsiDigits(balance.xp)}</strong></span>
          </span>
          ${role === 'citizen' ? `
            <span class="sh-stat-pill credit-pill">
              <svg class="icon-inline" viewBox="0 0 24 24"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
              <span>اعتبار باشگاه: <strong>${toFarsiDigits(balance.credits)}</strong></span>
            </span>
          ` : `
            <span class="sh-stat-pill note-pill">
              <span>این نقش صرفاً XP مهارتی دارد و فاقد اعتبار مصرفی است.</span>
            </span>
          `}
          <span class="sh-badge-hint">${info.badgeHint}</span>
        </div>
      </div>
    `;
  }

  // به‌روزرسانی وضعیت تب‌های انتخاب نقش
  function syncRoleTabs(role) {
    const tabs = document.querySelectorAll(roleTabSelector);
    tabs.forEach(tab => {
      const targetRole = tab.getAttribute('data-role-target');
      const isSelected = targetRole === role;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });
  }

  // سوار کردن ماژول متناسب با نقش
  async function renderRoleModule(role) {
    if (activeRole === role && currentUnmount) {
      updateRoleBanner(role);
      return;
    }

    // ۱. آزادسازی تمیز ماژول قبلی جهت جلوگیری از نشت رویداد یا حافظه
    if (typeof currentUnmount === 'function') {
      try {
        currentUnmount();
      } catch (err) {
        console.warn('خطا در پاک‌سازی ماژول قبلی:', err);
      }
      currentUnmount = null;
    }

    mountContainer.innerHTML = '';
    activeRole = role;
    syncRoleTabs(role);
    updateRoleBanner(role);

    try {
      if (role === 'citizen') {
        const { mountCitizen } = await import('./citizen.mjs');
        if (typeof mountCitizen === 'function') {
          currentUnmount = mountCitizen(mountContainer, store);
        } else {
          mountContainer.innerHTML = `<div class="sh-load-error">رابط شهروند در دسترس نیست.</div>`;
        }
      } else if (role === 'operator' || role === 'manager') {
        const { mountStaff } = await import('./staff.mjs');
        if (typeof mountStaff === 'function') {
          currentUnmount = mountStaff(mountContainer, store, role);
        } else {
          mountContainer.innerHTML = `<div class="sh-load-error">رابط کارکنان در دسترس نیست.</div>`;
        }
      }
    } catch (error) {
      console.error(`خطا در فراخوانی رابط کاربری برای نقش ${role}:`, error);
      mountContainer.innerHTML = `
        <div class="sh-load-error">
          <svg class="icon-md" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <p>بارگذاری ماژول مربوط به «${ROLE_DESCRIPTIONS[role]?.title || role}» با خطا مواجه شد.</p>
        </div>
      `;
    }
  }

  // اتصال رویداد کلیک تب‌ها
  const tabs = document.querySelectorAll(roleTabSelector);
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetRole = tab.getAttribute('data-role-target');
      if (targetRole && targetRole !== activeRole) {
        store.dispatch({ type: 'switchRole', role: targetRole });
      }
    });
  });

  // دکمه بازنشانی شبیه‌ساز به حالت پایه
  const resetBtn = document.querySelector(resetBtnSelector);
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const confirmed = window.confirm(
        'آیا از بازنشانی داده‌های شبیه‌ساز به نقطه شروع اولیه اطمینان دارید؟\nتمام رویدادها، ترازها و سهمیه‌ها به وضعیت اولیه دوره بازگردانده خواهند شد.'
      );
      if (confirmed) {
        store.dispatch({ type: 'reset' });
      }
    });
  }

  // اشتراک در تغییرات وضعیت فروشگاه مرکزی
  store.subscribe(state => {
    const role = state.role || 'citizen';
    if (role !== activeRole) {
      renderRoleModule(role);
    } else {
      updateRoleBanner(role);
    }
  });

  // بارگذاری نقش اولیه
  const initialRole = store.getState().role || 'citizen';
  renderRoleModule(initialRole);
}

// مقداردهی خودکار هنگام تکمیل بارگذاری سند
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initGameApp());
  } else {
    initGameApp();
  }
}

/**
 * شهرآگاه | پنل بررسی کارشناس (اپراتور) و ممیزی مدیر (امین محله)
 * شاخه: feature/hackathon/aida
 * مرجع: todo.md و README.md آیدا
 * بازطراحی بر روی سیستم طراحی رسمی آرش (Sahel FD + Dark Forest + Warm Ivory)
 * بدون هیچ‌گونه ایموجی - تمام ارقام فارسی - آیکون‌های وکتوری رسمی
 */

export function toFarsiDigits(val) {
  if (val === null || val === undefined) return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(val).replace(/[0-9]/g, d => farsiDigits[+d]);
}

const fa = value => toFarsiDigits(value);

const reasons = {
  specific_access: 'زمان، محل و اثر مشخص؛ شاهد تازه دربارهٔ دسترسی',
  no_new_detail: 'جزئیات تازه و قابل اقدام ندارد',
  unverified: 'شنیده است؛ مشاهدهٔ مستقیم ثبت نشده',
};

const decisions = { approve: 'تأیید پیوست', return: 'برگشت برای اصلاح' };
const verdicts = { correct: 'درست', needs_review: 'نیازمند بازبینی' };

const roles = {
  operator: {
    title: 'صف بررسی اپراتور',
    displayTitle: 'صف بررسی کارشناس (اپراتور)',
    badge: 'داور منصف',
    id: 'operator-1',
    cap: 3,
    description: 'بررسی مستدل گزارش‌های شهروندان و تطبیق با استانداردهای کیفی پایش شهری',
  },
  manager: {
    title: 'میز ممیزی مدیر',
    displayTitle: 'میز ممیزی مدیر (امین محله)',
    badge: 'امین محله',
    id: 'manager-1',
    cap: 2,
    description: 'ممیزی کیفی تصمیم‌های اپراتورها، راستی‌آزمایی معیارها و کشف خطاهای آموزشی',
  },
};

const errors = {
  FORBIDDEN: 'این اقدام در نقش فعلی مجاز نیست.',
  INVALID_STATE: 'این مورد دیگر در وضعیت قابل بررسی نیست.',
  INVALID_REASON: 'این دلیل برای تصمیم قابل ثبت نیست. تصمیم و دلیل را دوباره بررسی کنید.',
  DUPLICATE: 'این اقدام قبلاً ثبت شده است؛ پاداش دوباره ثبت نمی‌شود.',
};

// مجموعه آیکون‌های وکتوری درون‌برنامه‌ای منطبق بر سیستم Lucide شهرآگاه
const ICONS = {
  scale: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
  award: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  checkCircle: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  alertTriangle: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  fileText: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  clock: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  mapPin: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  activity: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  userCheck: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`,
  sparkles: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/></svg>`,
  check: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
  send: `<svg class="icon-svg icon-sm" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  inbox: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
  history: `<svg class="icon-svg icon-md" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><polyline points="12 7 12 12 15 15"/></svg>`,
};

export function mountStaff(root, api, role) {
  if (role !== 'operator' && role !== 'manager') {
    throw new TypeError('Unsupported staff role');
  }

  const isOperator = role === 'operator';
  const info = roles[role];
  const doc = root.ownerDocument || document;

  // تزریق استایل مستقل پنل پرسنلی
  const css = new URL('./staff.css', import.meta.url).href;
  const stylesheetPresent = [...doc.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === css);
  if (!stylesheetPresent) {
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = css;
    doc.head.append(link);
  }

  function node(tag, content, className) {
    const el = doc.createElement(tag);
    if (className) el.className = className;
    if (content != null) el.textContent = content;
    return el;
  }

  function paragraph(content, className) {
    return node('p', content, className);
  }

  function pair(list, label, value) {
    list.append(node('dt', label), node('dd', value));
  }

  const view = node('section', null, 'sh-staff');
  view.dir = 'rtl';
  view.lang = 'fa';
  view.setAttribute('aria-label', info.title);

  // هدر سازگار برای آزمون‌ها
  const hiddenTitle = node('h2', info.title, 'sr-only');
  hiddenTitle.style.cssText = 'position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;';

  const heroWrap = node('div', null, 'staff-hero-slot');
  const guidanceWrap = node('div', null, 'staff-guidance-slot');

  const status = paragraph('', 'sh-staff__status');
  status.setAttribute('role', 'status');
  status.tabIndex = -1;

  const body = node('div', null, 'sh-staff__body');

  view.append(hiddenTitle, heroWrap, status, guidanceWrap, body);
  root.replaceChildren(view);

  function describeCase(parent, item, caseId) {
    const ref = item?.number ?? item?.caseNumber ?? item?.id ?? caseId;
    const intel = node('div', null, 'case-intel-box');
    
    const metaRow = node('div', null, 'case-intel-meta');
    metaRow.innerHTML = `
      <span class="case-intel-item">
        ${ICONS.mapPin}
        <strong>پرونده: ${item?.title ?? 'عنوان ثبت‌نشده'}</strong>
      </span>
      ${ref ? `<span class="case-intel-item">شناسه پرونده: <code>${typeof ref === 'number' ? fa(ref) : toFarsiDigits(ref)}</code></span>` : ''}
    `;
    intel.append(metaRow);

    if (item?.summary) {
      const desc = node('p', item.summary, 'case-intel-desc');
      intel.append(desc);
    }

    parent.append(intel);
  }

  function describeObservation(parent, entry) {
    const observation = entry?.observation ?? entry;
    const quote = node('div', null, 'obs-quote-box');
    
    const textEl = node('p', entry?.text ?? entry?.observation?.text ?? 'متن مشاهده در این نمونه ثبت نشده است.', 'obs-text');
    
    const metaRow = node('div', null, 'obs-meta-row');
    metaRow.innerHTML = `
      <span class="obs-meta-item">${ICONS.clock} زمان: <strong>${toFarsiDigits(observation?.time ?? 'ذکر نشده')}</strong></span>
      <span class="obs-meta-item">${ICONS.mapPin} مکان: <strong>${toFarsiDigits(observation?.location ?? 'ذکر نشده')}</strong></span>
      <span class="obs-meta-item">${ICONS.activity} اثر: <strong>${toFarsiDigits(observation?.impact ?? 'ذکر نشده')}</strong></span>
    `;
    
    quote.append(textEl, metaRow);
    parent.append(quote);
  }

  function formFor(id, noun, options, submitText, action, onSuccess) {
    const form = node('form', null, 'sh-staff__form');

    function select(labelText, name, choices) {
      const label = node('label', labelText);
      const input = node('select');
      input.name = name;
      input.required = true;
      input.dataset.staffFocus = `${id}:${name}`;

      const placeholder = node('option', 'انتخاب کنید...');
      placeholder.value = '';
      placeholder.disabled = true;
      input.append(placeholder);

      for (const [value, choiceLabel] of Object.entries(choices)) {
        const option = node('option', choiceLabel);
        option.value = value;
        input.append(option);
      }
      input.value = '';
      label.append(input);
      form.append(label);
    }

    select(noun, 'choice', options);
    select('دلیل', 'reason', reasons);

    const submit = node('button', null, 'btn-civic btn-civic-primary');
    submit.type = 'submit';
    submit.dataset.staffFocus = `${id}:submit`;
    submit.innerHTML = `${ICONS.send} <span>${submitText}</span>`;
    form.append(submit);

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const { value: choice } = form.elements.namedItem('choice');
      const { value: reason } = form.elements.namedItem('reason');
      submit.disabled = true;

      const result = api.dispatch(action(choice, reason));

      if (result.ok) {
        status.innerHTML = `${ICONS.checkCircle} <span>${onSuccess(choice)}</span>`;
        status.dataset.kind = 'success';
        render();
        status.focus();
      } else {
        status.innerHTML = `${ICONS.alertTriangle} <span>${errors[result.code] ?? 'ثبت انجام نشد؛ وضعیت مورد را بررسی کنید.'}</span>`;
        status.dataset.kind = 'error';
        submit.disabled = false;
        if (result.code === 'INVALID_REASON') {
          form.elements.namedItem('reason').focus();
        } else {
          status.focus();
        }
      }
    });

    return form;
  }

  function card(heading, statusTag = null, iconSvg = null) {
    const article = node('article', null, 'sh-staff__card');
    const header = node('div', null, 'content-card-header');
    
    const title = node('h4', null, 'content-card-title');
    title.innerHTML = `${iconSvg || ICONS.fileText} <span>${heading}</span>`;
    header.append(title);

    if (statusTag) {
      const tag = node('span', statusTag.text, `content-card-status ${statusTag.className || ''}`);
      header.append(tag);
    }

    article.append(header);
    return article;
  }

  function render() {
    const state = api.getState();
    const { cases = [], entries = [], reviews = [], audits = [], ledger = [], badges = [] } = state;
    const id = state.role === role ? state.profileId ?? info.id : info.id;

    const findCase = caseId => cases.find(item => item.id === caseId);
    const findEntry = entryId => entries.find(item => item.id === entryId);
    const findAudit = reviewId => audits.find(item => item.reviewId === reviewId);

    const rewardValue = event => Number(event.credits ?? event.creditsChange ?? 0) || ((event.type === 'review_reward' || event.type === 'audit_reward') ? Number(event.xp ?? event.xpChange ?? 0) : 0);
    const rewarded = (profileId, row) => ledger.some(event =>
      event.profileId === profileId && rewardValue(event) > 0 &&
      ((event.reviewId ?? event.auditId) != null
        ? event.reviewId === row.id || (findAudit(row.id) && event.auditId === findAudit(row.id).id)
        : event.caseId != null && event.caseId === (row.caseId ?? findEntry(row.entryId)?.caseId)));

    const activeKey = doc.activeElement?.dataset?.staffFocus;
    const drafts = new Map([...body.querySelectorAll('select[data-staff-focus]')].map(el => [el.dataset.staffFocus, el.value]));

    // محاسبه آمار کارنامه و نشان
    const account = state.balances?.[id] || { xp: 0, credits: 0 };
    const progress = state.staffProgress?.[id];
    const badge = badges.find(item => item.profileId === id && typeof item === 'object' && item.unlocked !== false);
    const awards = ledger.filter(item => item.profileId === id && rewardValue(item) > 0 &&
      (item.period == null || state.period == null || item.period === state.period));
    const cap = progress?.limit ?? info.cap;
    const count = Math.min(cap, progress?.count ?? new Set(awards.map(item => item.caseId ?? item.reviewId ?? item.auditId ?? item)).size);
    const unlocked = progress?.unlocked ?? (Boolean(badge) || count >= cap);

    // ۱. هدر کارت هویتی رسمی منطبق بر سبک citizen-hero-card آرش
    heroWrap.innerHTML = `
      <div class="staff-hero-card">
        <div class="staff-hero-top">
          <div class="staff-brand-lockup">
            <div class="staff-brand-icon">
              ${isOperator ? ICONS.scale : ICONS.award}
            </div>
            <div>
              <h2 class="staff-hero-title">${info.displayTitle} | شهرآگاه</h2>
              <div class="staff-hero-subtitle">
                ${info.description} | شناسه فعال: ${toFarsiDigits(id)}
              </div>
            </div>
          </div>
          <div class="staff-period-pill">
            <span class="pulse-indicator"></span>
            <span>دوره فعال ممیزی: پاییز ۱۴۰۵ (دوره ۱)</span>
          </div>
        </div>

        <div class="staff-kpi-grid">
          <div class="staff-kpi-card">
            <div class="staff-kpi-header">
              <span>موجودی کوشانه</span>
              <span class="staff-kpi-tag">پاداش مشارکت</span>
            </div>
            <div class="staff-kpi-value-row">
              <span class="staff-kpi-number">${toFarsiDigits(account.credits)}</span>
              <span class="staff-kpi-unit">کوشانه</span>
            </div>
            <div class="staff-kpi-footnote">کوشانه کسب‌شده از فعالیت این نقش</div>
          </div>

          <div class="staff-kpi-card">
            <div class="staff-kpi-header">
              <span>وضعیت نشان سازمانی</span>
              <span class="staff-kpi-tag ${unlocked ? 'is-unlocked' : ''}">
                ${unlocked ? 'کسب شده' : 'در حال پیشرفت'}
              </span>
            </div>
            <div class="staff-kpi-value-row">
              <span class="staff-kpi-title">نشان «${info.badge}»</span>
            </div>
            <div class="staff-kpi-footnote">
              پیشرفت نشان: ${toFarsiDigits(count)} از ${toFarsiDigits(cap)} پروندهٔ متمایز
            </div>
          </div>

          <div class="staff-kpi-card">
            <div class="staff-kpi-header">
              <span>سقف پاداش دوره</span>
              <span class="staff-kpi-tag">سهمیه مجاز</span>
            </div>
            <div class="staff-kpi-value-row">
              <span class="staff-kpi-number">${toFarsiDigits(count)} / ${toFarsiDigits(cap)}</span>
              <span class="staff-kpi-unit">پرونده</span>
            </div>
            <div class="staff-kpi-footnote">
              ${unlocked ? 'سقف پاداش این دوره تکمیل گردید.' : `${toFarsiDigits(cap - count)} پاداش مجاز تا سقف این دوره`}
            </div>
          </div>
        </div>
      </div>
    `;

    // ۲. بنر راهنمای قاعده این نقش
    guidanceWrap.innerHTML = `
      <div class="staff-guidance-card">
        <span style="color:var(--c-amber);">${ICONS.sparkles}</span>
        <div>
          <strong>قاعده امتیازدهی این نقش: </strong>
          <span>${isOperator
            ? 'تأیید یا برگشت مستدل پس از ممیزی درست می‌تواند کوشانه داشته باشد. ثبت تصمیم به‌تنهایی کوشانه ندارد.'
            : 'تشخیص درستِ تصمیم صحیح یا کشف خطای نمونه با دلیل منطبق بر کلید، تا سقف دوره کوشانه دارد.'}</span>
        </div>
      </div>
    `;

    // ۳. ساخت بخش اصلی صف و کارنامه
    const main = node('section', null, 'sh-staff__main');
    const record = node('section', null, 'sh-staff__record');

    const mainTitle = node('h3');
    mainTitle.innerHTML = `${isOperator ? ICONS.inbox : ICONS.scale} <span>${isOperator ? 'مشاهده‌های در انتظار بررسی' : 'تصمیم‌های آمادهٔ ممیزی'}</span>`;
    main.append(mainTitle);

    const recordTitle = node('h3');
    recordTitle.innerHTML = `${ICONS.award} <span>کارنامهٔ این نقش</span>`;
    record.append(
      recordTitle,
      paragraph(`${toFarsiDigits(account.credits)} کوشانه`, 'sh-staff__xp'),
      paragraph(`نشان «${info.badge}»: ${unlocked ? 'باز شده' : 'در حال پیشرفت'}`),
      paragraph(`پیشرفت نشان: ${toFarsiDigits(count)} از ${toFarsiDigits(cap)} پروندهٔ متمایز`),
      paragraph(`سقف این دوره: ${toFarsiDigits(cap)} پاداش. استفاده‌شده: ${toFarsiDigits(count)} از ${toFarsiDigits(cap)}.`),
      paragraph(isOperator
        ? 'تأیید یا برگشت مستدل پس از ممیزی درست می‌تواند کوشانه داشته باشد. ثبت تصمیم به‌تنهایی کوشانه ندارد.'
        : 'تشخیص درستِ تصمیم صحیح یا کشف خطای نمونه با دلیل منطبق بر کلید، تا سقف دوره کوشانه دارد.'),
    );

    // ۴. منطق پر کردن صف عملیات
    if (isOperator) {
      const pending = entries.filter(item => !reviews.some(review => review.entryId === item.id) &&
        ['pending', 'submitted'].includes(item.status));

      if (!pending.length) {
        const empty = node('div', null, 'sh-staff__card');
        empty.innerHTML = `
          <div style="text-align:center; padding:1.5rem; color:var(--c-text-muted);">
            <div style="color:var(--c-muted-green); margin-bottom:0.5rem;">${ICONS.inbox}</div>
            <p>مشاهده‌ای در انتظار بررسی نیست.</p>
            <p style="font-size:0.75rem; margin-top:0.35rem;">شما می‌توانید گزارش‌های شهروندان را پس از ثبت در این بخش بررسی و تأیید یا برگشت دهید.</p>
          </div>
        `;
        main.append(empty);
      }

      for (const entry of pending) {
        const article = card('مشاهدهٔ شهروند', { text: 'در انتظار بررسی', className: 'status-pending' }, ICONS.fileText);
        describeCase(article, findCase(entry.caseId), entry.caseId);
        describeObservation(article, entry);
        article.append(formFor(entry.id, 'تصمیم اپراتور', decisions, 'ثبت بررسی',
          (decision, reason) => ({ type: 'review', entryId: entry.id, decision, reason }),
          decision => decision === 'approve'
            ? 'پیوست به پروندهٔ بازی اضافه شد. وضعیت رفع مشکل تغییری نکرد. کوشانه اپراتور به ممیزی وابسته است.'
            : 'مشاهده برای اصلاح برگشت. کوشانه اپراتور به ممیزی وابسته است.'));
        main.append(article);
      }
    }

    // ۵. بخش تاریخچه و تصمیم‌ها
    const history = node('section', null, 'sh-staff__history');
    const historyTitle = node('h3');
    historyTitle.innerHTML = `${ICONS.history} <span>${isOperator ? 'پرونده‌ها و نتیجهٔ بررسی' : 'نتیجهٔ ممیزی'}</span>`;
    history.append(historyTitle);

    let historyCount = 0;

    for (const row of reviews) {
      const entry = findEntry(row.entryId);
      const caseId = row.caseId ?? entry?.caseId;
      const audit = findAudit(row.id);
      const operatorId = row.profileId ?? row.operatorId ?? roles.operator.id;

      if (isOperator && operatorId !== id) continue;

      const completed = isOperator || Boolean(audit);
      if (completed) historyCount++;

      const parentCase = findCase(caseId);
      const attached = entry?.status === 'approved' && row.decision === 'approve' &&
        (!Array.isArray(parentCase?.attachments) ||
          parentCase.attachments.some(item => item === entry.id || item?.entryId === entry.id || item?.id === entry.id));

      const articleHeading = isOperator && attached
        ? 'پیوست تأییدشدهٔ پرونده'
        : (!isOperator && !audit ? 'تصمیم ثبت‌شدهٔ اپراتور برای ممیزی' : 'تصمیم ثبت‌شدهٔ اپراتور');

      const statusTag = isOperator && attached
        ? { text: 'پیوست معتبر پرونده', className: 'status-approved' }
        : (!isOperator && !audit ? { text: 'آمادهٔ ممیزی', className: 'status-audit' } : null);

      const article = card(articleHeading, statusTag, isOperator ? ICONS.fileText : ICONS.scale);
      describeCase(article, parentCase, caseId);
      describeObservation(article, entry ?? row);

      // جزئیات تصمیم اپراتور
      const detail = node('dl', null, 'sh-staff__details');
      pair(detail, 'بررسی‌کننده', row.operatorName ?? 'اپراتور نمونه (operator-1)');
      pair(detail, 'تصمیم', decisions[row.decision] ?? 'ثبت نشده');
      pair(detail, 'دلیل تصمیم', reasons[row.reason] ?? 'دلیل معتبر ثبت نشده');
      article.append(detail);

      if (isOperator && attached) {
        article.append(paragraph('پیوست به پرونده اضافه شده است؛ رفع مشکل در خیابان تأیید نشده است.', 'sh-staff__quiet'));
      }

      if (!isOperator && !audit) {
        article.append(formFor(row.id, 'نتیجهٔ داوری', verdicts, 'ثبت ممیزی',
          (verdict, reason) => ({ type: 'audit', reviewId: row.id, verdict, reason }),
          () => 'ممیزی ثبت شد. نتیجه و دلیل کوشانه در کارنامه آمده است.'));
      } else if (audit) {
        const managerId = audit.profileId ?? audit.managerId ?? roles.manager.id;
        const managerReward = rewarded(managerId, row);
        const operatorReward = rewarded(operatorId, row);
        const matched = audit.matched ?? audit.correct ?? (managerReward ? true : undefined);
        const flagged = row.needsReview || audit.needsReview || audit.verdict === 'needs_review' || matched === false;

        const auditDetail = node('dl', null, 'sh-staff__details');
        pair(auditDetail, 'ممیز', audit.managerName ?? 'مدیر نمونه (manager-1)');
        pair(auditDetail, 'داوری مدیر', verdicts[audit.verdict] ?? 'ثبت نشده');
        pair(auditDetail, 'دلیل ممیزی', reasons[audit.reason] ?? 'ثبت نشده');
        article.append(auditDetail);

        if (flagged) {
          const flagEl = node('div', null, 'sh-staff__flag');
          flagEl.innerHTML = `${ICONS.alertTriangle} <span>علامت‌گذاری شد: نیازمند بازبینی</span>`;
          article.append(flagEl);
        }

        const matchTag = node('div', null, `badge-matched ${matched === true ? 'match-yes' : 'match-no'}`);
        matchTag.innerHTML = `
          ${matched === true ? ICONS.checkCircle : ICONS.alertTriangle}
          <span>${matched === true
            ? 'داوری و دلیل با کلید نمونه منطبق بود.'
            : matched === false
              ? 'تطبیق داوری و دلیل با کلید نمونه تأیید نشد.'
              : 'نتیجهٔ تطبیق با کلید نمونه در دادهٔ ممیزی ثبت نشده است.'}</span>
        `;
        article.append(matchTag);

        article.append(paragraph(operatorReward
          ? 'کوشانه اپراتور ثبت شد: تصمیم و دلیل مستدل در ممیزی تأیید شد.'
          : matched === undefined
            ? 'کوشانه اپراتور ثبت نشد؛ نتیجهٔ تطبیق در دسترس نیست.'
          : matched && audit.verdict === 'correct'
            ? 'کوشانه اپراتور ثبت نشد؛ سهمیهٔ دوره یا پاداش یکتای پرونده ممکن است مصرف شده باشد.'
            : 'کوشانه اپراتور ثبت نشد؛ تصمیم و دلیل در ممیزی تأیید نشد.', 'sh-staff__quiet'));

        if (!isOperator) {
          article.append(paragraph(managerReward
            ? 'کوشانه مدیر ثبت شد: تشخیص و دلیل مطابق کلید نمونه بود.'
            : matched === undefined
              ? 'کوشانه مدیر ثبت نشد؛ نتیجهٔ تطبیق در دسترس نیست.'
            : matched
              ? 'کوشانه مدیر ثبت نشد؛ سهمیهٔ دوره یا پاداش یکتای پرونده ممکن است مصرف شده باشد.'
              : 'کوشانه مدیر ثبت نشد؛ تشخیص یا دلیل با کلید نمونه مطابقت نداشت.', 'sh-staff__quiet'));
        }
      } else {
        article.append(paragraph('کوشانه اپراتور هنوز ثبت نشده است: در انتظار ممیزی.', 'sh-staff__quiet'));
      }

      (completed ? history : main).append(article);
    }

    if (!isOperator && !reviews.some(row => !findAudit(row.id))) {
      const empty = node('div', null, 'sh-staff__card');
      empty.innerHTML = `
        <div style="text-align:center; padding:1.5rem; color:var(--c-text-muted);">
          <div style="color:var(--c-muted-green); margin-bottom:0.5rem;">${ICONS.scale}</div>
          <p>تصمیمی در انتظار ممیزی نیست.</p>
          <p style="font-size:0.75rem; margin-top:0.35rem;">تمام تصمیم‌های ثبت‌شده اپراتورها ممیزی شده‌اند.</p>
        </div>
      `;
      main.append(empty);
    }

    if (!historyCount) {
      history.append(paragraph('نتیجه‌ای ثبت نشده است.', 'sh-staff__quiet'));
    }

    body.replaceChildren(main, record, history);

    // بازیابی فوکوس و مقادیر در حال ویرایش فرم‌ها
    for (const el of body.querySelectorAll('[data-staff-focus]')) {
      const key = el.dataset.staffFocus;
      if (drafts.has(key)) el.value = drafts.get(key);
      if (key === activeKey) el.focus({ preventScroll: true });
    }
  }

  render();
  const unsubscribe = api.subscribe(render);

  return () => {
    unsubscribe();
    view.remove();
  };
}

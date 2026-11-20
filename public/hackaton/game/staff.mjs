const number = new Intl.NumberFormat('fa-IR');
const fa = value => number.format(value);
const reasons = {
  specific_access: 'زمان، محل و اثر مشخص؛ شاهد تازه دربارهٔ دسترسی',
  no_new_detail: 'جزئیات تازه و قابل اقدام ندارد',
  unverified: 'شنیده است؛ مشاهدهٔ مستقیم ثبت نشده',
};
const decisions = { approve: 'تأیید پیوست', return: 'برگشت برای اصلاح' };
const verdicts = { correct: 'درست', needs_review: 'نیازمند بازبینی' };
const roles = {
  operator: { title: 'صف بررسی اپراتور', badge: 'داور منصف', id: 'operator-1', cap: 3 },
  manager: { title: 'میز ممیزی مدیر', badge: 'امین محله', id: 'manager-1', cap: 2 },
};
const errors = {
  FORBIDDEN: 'این اقدام در نقش فعلی مجاز نیست.',
  INVALID_STATE: 'این مورد دیگر در وضعیت قابل بررسی نیست.',
  INVALID_REASON: 'این دلیل برای تصمیم قابل ثبت نیست. تصمیم و دلیل را دوباره بررسی کنید.',
  DUPLICATE: 'این اقدام قبلاً ثبت شده است؛ پاداش دوباره ثبت نمی‌شود.',
};

export function mountStaff(root, api, role) {
  if (role !== 'operator' && role !== 'manager') throw new TypeError('Unsupported staff role');
  const isOperator = role === 'operator';
  const info = roles[role];
  const doc = root.ownerDocument;
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
  function paragraph(content, className) { return node('p', content, className); }
  function pair(list, label, value) { list.append(node('dt', label), node('dd', value)); }

  const view = node('section', null, 'sh-staff');
  view.dir = 'rtl';
  view.lang = 'fa';
  const title = node('h2', info.title);
  view.setAttribute('aria-label', info.title);
  const body = node('div', null, 'sh-staff__body');
  const status = paragraph('', 'sh-staff__status');
  status.setAttribute('role', 'status');
  status.tabIndex = -1;
  view.append(node('p', 'شهرآگاه / محیط آموزشی', 'sh-staff__kicker'), title, status, body);
  root.replaceChildren(view);

  function describeCase(parent, item, caseId) {
    const ref = item?.number ?? item?.caseNumber ?? item?.id ?? caseId;
    parent.append(node('p', `پروندهٔ بازی: ${item?.title ?? 'عنوان ثبت نشده'}`, 'sh-staff__case'));
    if (ref) parent.append(paragraph(`شناسهٔ پرونده: ${typeof ref === 'number' ? fa(ref) : ref}`, 'sh-staff__quiet'));
    if (item?.summary) parent.append(paragraph(item.summary));
  }

  function describeObservation(parent, entry) {
    parent.append(node('blockquote', entry?.text ?? entry?.observation?.text ?? 'متن مشاهده در این نمونه ثبت نشده است.'));
    const details = node('dl', null, 'sh-staff__details');
    const observation = entry?.observation ?? entry;
    pair(details, 'زمان مشاهده', observation?.time ?? 'ذکر نشده');
    pair(details, 'مکان مشاهده', observation?.location ?? 'ذکر نشده');
    pair(details, 'اثر بر عبور یا رسیدگی', observation?.impact ?? 'ذکر نشده');
    parent.append(details);
  }

  function formFor(id, noun, options, submitText, action, onSuccess) {
    const form = node('form', null, 'sh-staff__form');
    function select(labelText, name, choices) {
      const label = node('label', labelText);
      const input = node('select');
      input.name = name;
      input.required = true;
      input.dataset.staffFocus = `${id}:${name}`;
      const placeholder = node('option', 'انتخاب کنید');
      placeholder.value = '';
      placeholder.disabled = true;
      input.append(placeholder);
      for (const [value, label] of Object.entries(choices)) {
        const option = node('option', label);
        option.value = value;
        input.append(option);
      }
      input.value = '';
      label.append(input);
      form.append(label);
    }
    select(noun, 'choice', options);
    select('دلیل', 'reason', reasons);
    const submit = node('button', submitText);
    submit.type = 'submit';
    submit.dataset.staffFocus = `${id}:submit`;
    form.append(submit);
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const { value: choice } = form.elements.namedItem('choice');
      const { value: reason } = form.elements.namedItem('reason');
      submit.disabled = true;
      const result = api.dispatch(action(choice, reason));
      if (result.ok) {
        status.textContent = onSuccess(choice);
        status.dataset.kind = 'success';
        render();
        status.focus();
      } else {
        status.textContent = errors[result.code] ?? 'ثبت انجام نشد؛ وضعیت مورد را بررسی کنید.';
        status.dataset.kind = 'error';
        submit.disabled = false;
        if (result.code === 'INVALID_REASON') form.elements.namedItem('reason').focus();
        else status.focus();
      }
    });
    return form;
  }

  function card(heading) {
    const article = node('article', null, 'sh-staff__card');
    article.append(node('h4', heading));
    return article;
  }

  function render() {
    const state = api.getState();
    const { cases = [], entries = [], reviews = [], audits = [], ledger = [], badges = [] } = state;
    const id = state.role === role ? state.profileId ?? info.id : info.id;
    const findCase = caseId => cases.find(item => item.id === caseId);
    const findEntry = entryId => entries.find(item => item.id === entryId);
    const findAudit = reviewId => audits.find(item => item.reviewId === reviewId);
    const rewarded = (profileId, row) => ledger.some(event =>
      event.profileId === profileId && (event.xp ?? event.deltaXp ?? 0) > 0 &&
      ((event.reviewId ?? event.auditId) != null
        ? event.reviewId === row.id || (findAudit(row.id) && event.auditId === findAudit(row.id).id)
        : event.caseId != null && event.caseId === (row.caseId ?? findEntry(row.entryId)?.caseId)));

    const activeKey = doc.activeElement?.dataset?.staffFocus;
    const drafts = new Map([...body.querySelectorAll('select[data-staff-focus]')].map(el => [el.dataset.staffFocus, el.value]));
    const main = node('section', null, 'sh-staff__main');
    const record = node('section', null, 'sh-staff__record');
    main.append(node('h3', isOperator ? 'مشاهده‌های در انتظار بررسی' : 'تصمیم‌های آمادهٔ ممیزی'));
    record.append(node('h3', 'کارنامهٔ این نقش'));
    const account = state.balances?.[id];
    if (account) record.append(paragraph(`${fa(account.xp)} امتیاز تجربه (XP)`, 'sh-staff__xp'));

    const progress = state.staffProgress?.[id];
    const badge = badges.find(item => item.profileId === id && typeof item === 'object' && item.unlocked !== false);
    const awards = ledger.filter(item => item.profileId === id && (item.xp ?? item.deltaXp ?? 0) > 0 &&
      (item.period == null || state.period == null || item.period === state.period));
    const cap = progress?.limit ?? info.cap;
    const count = Math.min(cap, progress?.count ?? new Set(awards.map(item => item.caseId ?? item.reviewId ?? item.auditId ?? item)).size);
    const unlocked = progress?.unlocked ?? (Boolean(badge) || count >= cap);
    record.append(
      paragraph(`نشان «${info.badge}»: ${unlocked ? 'باز شده' : 'در حال پیشرفت'}`),
      paragraph(`پیشرفت نشان: ${fa(count)} از ${fa(cap)} پروندهٔ متمایز`),
      paragraph(`سقف این دوره: ${fa(cap)} پاداش. استفاده‌شده: ${fa(count)} از ${fa(cap)}.`),
      paragraph('این نقش فقط XP مهارتی دارد؛ اعتبار خرج‌شدنی ندارد.', 'sh-staff__quiet'),
      paragraph(isOperator
        ? 'تأیید یا برگشت مستدل پس از ممیزی درست می‌تواند XP داشته باشد. ثبت تصمیم به‌تنهایی XP ندارد.'
        : 'تشخیص درستِ تصمیم صحیح یا کشف خطای نمونه با دلیل منطبق بر کلید، تا سقف دوره XP دارد.'),
    );

    if (isOperator) {
      const pending = entries.filter(item => !reviews.some(review => review.entryId === item.id) &&
        ['pending', 'submitted'].includes(item.status));
      if (!pending.length) main.append(paragraph('مشاهده‌ای در انتظار بررسی نیست.', 'sh-staff__quiet'));
      for (const entry of pending) {
        const article = card('مشاهدهٔ شهروند');
        describeCase(article, findCase(entry.caseId), entry.caseId);
        describeObservation(article, entry);
        article.append(formFor(entry.id, 'تصمیم اپراتور', decisions, 'ثبت بررسی',
          (decision, reason) => ({ type: 'review', entryId: entry.id, decision, reason }),
          decision => decision === 'approve'
            ? 'پیوست به پروندهٔ بازی اضافه شد. وضعیت رفع مشکل تغییری نکرد. XP اپراتور به ممیزی وابسته است.'
            : 'مشاهده برای اصلاح برگشت. XP اپراتور به ممیزی وابسته است.'));
        main.append(article);
      }
    }

    const history = node('section', null, 'sh-staff__history');
    history.append(node('h3', isOperator ? 'پرونده‌ها و نتیجهٔ بررسی' : 'نتیجهٔ ممیزی'));
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
      const article = card(isOperator && attached
        ? 'پیوست تأییدشدهٔ پرونده' : 'تصمیم ثبت‌شدهٔ اپراتور');
      describeCase(article, parentCase, caseId);
      describeObservation(article, entry ?? row);
      const detail = node('dl', null, 'sh-staff__details');
      pair(detail, 'بررسی‌کننده', row.operatorName ?? 'اپراتور نمونه');
      pair(detail, 'تصمیم', decisions[row.decision] ?? 'ثبت نشده');
      pair(detail, 'دلیل تصمیم', reasons[row.reason] ?? 'دلیل معتبر ثبت نشده');
      article.append(detail);
      if (isOperator && attached) {
        article.append(paragraph('پیوست به پرونده اضافه شده است؛ رفع مشکل در خیابان تأیید نشده است.'));
      }
      if (!isOperator && !audit) {
        article.append(formFor(row.id, 'نتیجهٔ داوری', verdicts, 'ثبت ممیزی',
          (verdict, reason) => ({ type: 'audit', reviewId: row.id, verdict, reason }),
          () => 'ممیزی ثبت شد. نتیجه و دلیل XP در کارنامه آمده است.'));
      } else if (audit) {
        const managerId = audit.profileId ?? audit.managerId ?? roles.manager.id;
        const managerReward = rewarded(managerId, row);
        const operatorReward = rewarded(operatorId, row);
        const matched = audit.matched ?? audit.correct ?? (managerReward ? true : undefined);
        const flagged = row.needsReview || audit.needsReview || audit.verdict === 'needs_review' || matched === false;
        const auditDetail = node('dl', null, 'sh-staff__details');
        pair(auditDetail, 'ممیز', audit.managerName ?? 'مدیر نمونه');
        pair(auditDetail, 'داوری مدیر', verdicts[audit.verdict] ?? 'ثبت نشده');
        pair(auditDetail, 'دلیل ممیزی', reasons[audit.reason] ?? 'ثبت نشده');
        article.append(auditDetail);
        if (flagged) article.append(paragraph('علامت‌گذاری شد: نیازمند بازبینی', 'sh-staff__flag'));
        article.append(paragraph(matched === true
          ? 'داوری و دلیل با کلید نمونه منطبق بود.'
          : matched === false
            ? 'تطبیق داوری و دلیل با کلید نمونه تأیید نشد.'
            : 'نتیجهٔ تطبیق با کلید نمونه در دادهٔ ممیزی ثبت نشده است.'));
        article.append(paragraph(operatorReward
          ? 'XP اپراتور ثبت شد: تصمیم و دلیل مستدل در ممیزی تأیید شد.'
          : matched === undefined
            ? 'XP اپراتور ثبت نشد؛ نتیجهٔ تطبیق در دسترس نیست.'
          : matched && audit.verdict === 'correct'
            ? 'XP اپراتور ثبت نشد؛ سهمیهٔ دوره یا پاداش یکتای پرونده ممکن است مصرف شده باشد.'
            : 'XP اپراتور ثبت نشد؛ تصمیم و دلیل در ممیزی تأیید نشد.'));
        if (!isOperator) article.append(paragraph(managerReward
          ? 'XP مدیر ثبت شد: تشخیص و دلیل مطابق کلید نمونه بود.'
          : matched === undefined
            ? 'XP مدیر ثبت نشد؛ نتیجهٔ تطبیق در دسترس نیست.'
          : matched
            ? 'XP مدیر ثبت نشد؛ سهمیهٔ دوره یا پاداش یکتای پرونده ممکن است مصرف شده باشد.'
            : 'XP مدیر ثبت نشد؛ تشخیص یا دلیل با کلید نمونه مطابقت نداشت.'));
      } else {
        article.append(paragraph('XP اپراتور هنوز ثبت نشده است: در انتظار ممیزی.'));
      }
      (completed ? history : main).append(article);
    }
    if (!isOperator && !reviews.some(row => !findAudit(row.id))) main.append(paragraph('تصمیمی در انتظار ممیزی نیست.', 'sh-staff__quiet'));
    if (!historyCount) history.append(paragraph('نتیجه‌ای ثبت نشده است.', 'sh-staff__quiet'));
    body.replaceChildren(main, record, history);
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

/**
 * شهرآگاه | هسته محاسباتی، دفتر رویدادها و مدیریت داده بازی
 * شاخه: feature/hackathon/vahab
 * مرجع: todo.md و todo_vahab.md
 */

import {
  PERSON_IDS,
  CASE_IDS,
  REWARD_LIMITS,
  REWARD_RATES,
  OBSERVATION_OPTIONS,
  RUBRICS,
  createInitialSeed,
} from './fixtures.mjs';

const STORAGE_KEY = 'shahragah_game_v1';

function safeStorageGet() {
  try {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Game storage corrupted or unavailable, falling back to seed.', e);
  }
  return null;
}

function safeStorageSet(state) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (e) {
    console.warn('Could not persist game state to storage.', e);
  }
}

/**
 * ایجاد و نمونه‌سازی فروشگاه مرکزی بازی (Core Game Store)
 */
export function createGameStore(initialState = null) {
  let state = initialState || safeStorageGet() || createInitialSeed();
  const listeners = new Set();
  let serial = Date.now();

  // پاداش کارکنان در داده‌های قدیمی در فیلد xp ذخیره شده است.
  function rewardAmount(event) {
    const credits = Number(event.credits ?? event.creditsChange ?? 0);
    return credits || (event.type === 'review_reward' || event.type === 'audit_reward' ? Number(event.xp ?? event.xpChange ?? 0) : 0);
  }

  function nextId(prefix) {
    return `${prefix}-${++serial}`;
  }

  function notify() {
    safeStorageSet(state);
    listeners.forEach(fn => {
      try { fn(getState()); } catch (err) { console.error('Listener error', err); }
    });
  }

  function fail(code) {
    return { ok: false, code };
  }

  /**
   * محاسبه خالص تراز مالی و کوشانه از روی دفترکل (Ledger)
   */
  function deriveBalances() {
    const balances = {
      [PERSON_IDS.citizen]: { xp: 0, credits: 0 },
      [PERSON_IDS.operator]: { xp: 0, credits: 0 },
      [PERSON_IDS.manager]: { xp: 0, credits: 0 },
    };

    for (const event of state.ledger || []) {
      const pId = event.profileId;
      if (!balances[pId]) balances[pId] = { xp: 0, credits: 0 };
      const xpVal = Number(event.xp ?? event.xpChange ?? 0);
      const creditsVal = rewardAmount(event);
      balances[pId].xp += xpVal;
      balances[pId].credits += creditsVal;
    }

    return balances;
  }

  /**
   * محاسبه پیشرفت نشان‌ها و رتبه تیم‌ها
   */
  function deriveDerivedState() {
    const balances = deriveBalances();

    // محاسبه پیشرفت نشان اپراتور
    const operatorAwards = (state.ledger || []).filter(
      l => l.profileId === PERSON_IDS.operator && rewardAmount(l) > 0
    );
    const opDistinctCases = new Set(operatorAwards.map(a => a.caseId || a.reviewId || a.id)).size;
    const operatorCap = REWARD_LIMITS[PERSON_IDS.operator] || 3;
    const opUnlocked = opDistinctCases >= operatorCap;

    // محاسبه پیشرفت نشان مدیر
    const managerAwards = (state.ledger || []).filter(
      l => l.profileId === PERSON_IDS.manager && rewardAmount(l) > 0
    );
    const mgrDistinctCases = new Set(managerAwards.map(a => a.caseId || a.auditId || a.id)).size;
    const managerCap = REWARD_LIMITS[PERSON_IDS.manager] || 2;
    const mgrUnlocked = mgrDistinctCases >= managerCap;

    // محاسبه نشان همیار دسترسی شهروند (تأیید اولین مشاهده مانع عبور در پرونده زنده صادقیه)
    const citizenAccessApproved = (state.entries || []).some(
      e => e.profileId === PERSON_IDS.citizen && e.caseId === CASE_IDS.rain && e.choice === 'access' && e.status === 'approved'
    );

    const badges = [
      {
        id: 'accessibility-helper',
        profileId: PERSON_IDS.citizen,
        title: 'همیار دسترسی معابر',
        unlocked: citizenAccessApproved,
      },
      {
        id: 'fair-judge',
        profileId: PERSON_IDS.operator,
        title: 'داور منصف',
        unlocked: opUnlocked,
      },
      {
        id: 'neighborhood-trustee',
        profileId: PERSON_IDS.manager,
        title: 'امین محله',
        unlocked: mgrUnlocked,
      },
    ];

    const staffProgress = {
      [PERSON_IDS.operator]: { limit: operatorCap, count: Math.min(operatorCap, opDistinctCases), unlocked: opUnlocked },
      [PERSON_IDS.manager]: { limit: managerCap, count: Math.min(managerCap, mgrDistinctCases), unlocked: mgrUnlocked },
    };

    // به‌روزرسانی رتبه‌های جدول محله‌ها
    const teams = (state.teams || []).map(t => ({ ...t }));
    const sadeghiyeh = teams.find(t => t.id === 'sadeghiyeh');
    if (sadeghiyeh) {
      // اگر مشارکت شهروند در پرونده بارش تأیید شده باشد سهمیه 9 از 10 می‌شود
      sadeghiyeh.done = citizenAccessApproved ? 9 : 8;
    }

    teams.forEach(t => {
      const pct = t.done / t.goal;
      if (pct >= 0.9) t.rank = 1;
      else if (pct >= 0.85) t.rank = 2;
      else t.rank = 2; // مساوی‌ها با روش 1, 2, 2
    });

    return { balances, badges, staffProgress, teams };
  }

  function getState() {
    const derived = deriveDerivedState();
    return {
      ...state,
      balances: derived.balances,
      badges: derived.badges,
      staffProgress: derived.staffProgress,
      teams: derived.teams,
    };
  }

  function awardPerson(profileId, caseId, refId, roleKey) {
    const isOp = profileId === PERSON_IDS.operator;
    const isMgr = profileId === PERSON_IDS.manager;
    const limit = REWARD_LIMITS[profileId] || 3;
    const rate = REWARD_RATES[profileId] || 0;

    const prior = (state.ledger || []).filter(l => l.profileId === profileId && rewardAmount(l) > 0);
    if (prior.length >= limit) return false;
    if (caseId && prior.some(l => l.caseId === caseId)) return false;

    const event = {
      id: nextId('led'),
      period: state.period || 1,
      profileId,
      caseId,
      type: `${roleKey}_reward`,
      xp: 0,
      credits: rate,
      xpChange: 0,
      creditsChange: rate,
      description: isOp ? 'ممیزی موفق و ثبت کوشانه داوری اپراتور' : 'تشخیص درست در ممیزی پرونده',
      date: 'امروز',
    };
    if (isOp && refId) event.reviewId = refId;
    if (isMgr && refId) event.auditId = refId;

    state.ledger.unshift(event);
    return true;
  }

  function dispatch(action) {
    if (!action || typeof action.type !== 'string') {
      return fail('INVALID_STATE');
    }

    switch (action.type) {
      case 'switchRole': {
        const { role } = action;
        if (!['citizen', 'operator', 'manager'].includes(role)) {
          return fail('FORBIDDEN');
        }
        state.role = role;
        state.profileId = PERSON_IDS[role];
        notify();
        return { ok: true };
      }

      case 'submit': {
        const { caseId, choice } = action;
        if (!caseId || !choice || !OBSERVATION_OPTIONS[choice]) {
          return fail('INVALID_STATE');
        }

        const citizenId = PERSON_IDS.citizen;
        const entryId = nextId('entry');
        const obsData = OBSERVATION_OPTIONS[choice];

        const newEntry = {
          ...obsData,
          id: entryId,
          caseId,
          profileId: citizenId,
          choice,
          status: 'submitted',
          createdAt: 'امروز ۱۴:۴۰',
        };

        // حذف ورودی زنده قبلی برای همین پرونده جهت امکان اصلاح بدون جریمه
        state.entries = state.entries.filter(e => !(e.caseId === caseId && e.profileId === citizenId));
        state.entries.push(newEntry);

        // شبیه‌سازی تصمیم خودکار اپراتور در سناریوی تعاملی
        const [expectedDecision, expectedReason] = RUBRICS[choice];
        const isApproved = expectedDecision === 'approve';

        newEntry.status = isApproved ? 'approved' : 'returned';

        const reviewId = nextId('review');
        state.reviews = state.reviews.filter(r => r.entryId !== entryId);
        state.reviews.push({
          id: reviewId,
          entryId,
          caseId,
          profileId: PERSON_IDS.operator,
          decision: expectedDecision,
          reason: expectedReason,
          comment: isApproved
            ? 'شاهد معتبر مکمل همراه با مشخصات دقیق زمان، مکان و مانع تردد.'
            : expectedReason === 'no_new_detail'
            ? 'فاقد اطلاعات تازه؛ صرفاً بیان کلی آب‌گرفتگی بدون ذکر جزئیات.'
            : 'شنیده‌ها و غیرقابل استناد میدانی.',
        });

        const targetCase = state.cases.find(c => c.id === caseId);
        if (targetCase && isApproved) {
          if (!targetCase.attachments) targetCase.attachments = [];
          if (!targetCase.attachments.includes(entryId)) {
            targetCase.attachments.push(entryId);
          }
        }

        // بررسی یکتایی پاداش شهروندی: فقط یک بار برای هر پرونده
        if (isApproved) {
          const alreadyRewarded = (state.ledger || []).some(
            l => l.profileId === citizenId && l.caseId === caseId && l.type === 'mission_reward'
          );
          if (!alreadyRewarded) {
            state.ledger.unshift({
              id: nextId('led'),
              period: state.period || 1,
              profileId: citizenId,
              caseId,
              type: 'mission_reward',
              xp: 0,
              credits: REWARD_RATES.citizenReward.credits,
              xpChange: 0,
              creditsChange: REWARD_RATES.citizenReward.credits,
              description: 'تأیید شاهد معتبر و مکمل پرونده صادقیه (همیار دسترسی معابر)',
              date: 'امروز',
            });
          }
        }

        notify();
        return { ok: true, entryId };
      }

      case 'review': {
        if (state.role !== 'operator') {
          return fail('FORBIDDEN');
        }

        const { entryId, decision, reason } = action;
        const entry = (state.entries || []).find(e => e.id === entryId);
        if (!entry) return fail('INVALID_STATE');

        // اگر این ورودی قبلاً تصمیم‌گیری شده بود
        if ((state.reviews || []).some(r => r.entryId === entryId)) {
          return fail('DUPLICATE');
        }

        const [expectedDecision, expectedReason] = RUBRICS[entry.choice] || [];
        if (decision !== expectedDecision || reason !== expectedReason) {
          return fail('INVALID_REASON');
        }

        const reviewId = nextId('review');
        state.reviews.push({
          id: reviewId,
          entryId: entry.id,
          caseId: entry.caseId,
          profileId: PERSON_IDS.operator,
          decision,
          reason,
        });

        entry.status = decision === 'approve' ? 'approved' : 'returned';

        const parentCase = (state.cases || []).find(c => c.id === entry.caseId);
        if (parentCase && decision === 'approve') {
          if (!parentCase.attachments) parentCase.attachments = [];
          if (!parentCase.attachments.includes(entry.id)) {
            parentCase.attachments.push(entry.id);
          }
        }

        // پاداش شهروند در صورت تأیید
        if (decision === 'approve') {
          const alreadyRewarded = (state.ledger || []).some(
            l => l.profileId === entry.profileId && l.caseId === entry.caseId && l.type === 'mission_reward'
          );
          if (!alreadyRewarded) {
            state.ledger.unshift({
              id: nextId('led'),
              period: state.period || 1,
              profileId: entry.profileId,
              caseId: entry.caseId,
              type: 'mission_reward',
              xp: 0,
              credits: 10,
              xpChange: 0,
              creditsChange: 10,
              description: 'تأیید شاهد معتبر و مکمل پرونده صادقیه',
              date: 'امروز',
            });
          }
        }

        notify();
        return { ok: true, code: 'OK' };
      }

      case 'audit': {
        if (state.role !== 'manager') {
          return fail('FORBIDDEN');
        }

        const { reviewId, verdict, reason } = action;
        const review = (state.reviews || []).find(r => r.id === reviewId);
        if (!review) return fail('INVALID_STATE');

        if ((state.audits || []).some(a => a.reviewId === reviewId)) {
          return fail('DUPLICATE');
        }

        if (!['correct', 'needs_review'].includes(verdict)) {
          return fail('INVALID_REASON');
        }

        const entry = (state.entries || []).find(e => e.id === review.entryId);
        const [expectedDecision, expectedReason] = RUBRICS[entry ? entry.choice : ''] || [];
        const isReviewRight = review.decision === expectedDecision && review.reason === expectedReason;
        const isAuditMatched = verdict === (isReviewRight ? 'correct' : 'needs_review') && reason === expectedReason;

        review.needsReview = !isAuditMatched || !isReviewRight;

        const auditId = nextId('audit');
        state.audits.push({
          id: auditId,
          reviewId: review.id,
          caseId: review.caseId,
          profileId: PERSON_IDS.manager,
          verdict,
          reason,
          matched: isAuditMatched,
        });

        if (isAuditMatched) {
          awardPerson(PERSON_IDS.manager, review.caseId, auditId, 'audit');
          if (isReviewRight) {
            awardPerson(PERSON_IDS.operator, review.caseId, review.id, 'review');
          }
        }

        notify();
        return { ok: true, code: 'OK' };
      }

      case 'redeem': {
        const { itemId, requestId } = action;
        if (!itemId || !requestId) return fail('INVALID_STATE');

        if (!state.seenRequests) state.seenRequests = [];
        if (state.seenRequests.includes(requestId)) {
          return fail('DUPLICATE');
        }

        const item = (state.catalog || []).find(c => c.id === itemId);
        if (!item) return fail('INVALID_STATE');

        const balances = deriveBalances();
        const citizenCredits = balances[PERSON_IDS.citizen]?.credits || 0;

        // ۱. بررسی موجودی اعتبار
        if (citizenCredits < item.cost) {
          return fail('INSUFFICIENT');
        }

        // ۲. بررسی سهمیه باقیمانده دوره
        if (item.remaining <= 0) {
          return fail('SOLD_OUT');
        }

        // ۳. بررسی سقف فردی در دوره (حداکثر ۱ عدد)
        const alreadyClaimed = (state.vouchers || []).filter(
          v => v.profileId === PERSON_IDS.citizen && v.itemId === itemId
        ).length;
        if (alreadyClaimed >= (item.personLimit || 1)) {
          return fail('PERSON_LIMIT');
        }

        // اعمال خرید
        item.remaining -= 1;
        state.seenRequests.push(requestId);

        const voucherId = nextId('vch');
        const codeSuffix = Math.floor(1000 + Math.random() * 9000);
        const voucherCode = `DEMO-${itemId.toUpperCase().slice(0, 4)}-${codeSuffix}`;

        const voucher = {
          id: voucherId,
          itemId,
          profileId: PERSON_IDS.citizen,
          title: item.title,
          cost: item.cost,
          code: voucherCode,
          status: 'active',
          issuedAt: 'امروز',
        };
        if (!state.vouchers) state.vouchers = [];
        state.vouchers.unshift(voucher);

        if (!state.ledger) state.ledger = [];
        state.ledger.unshift({
          id: nextId('led'),
          period: state.period || 1,
          profileId: PERSON_IDS.citizen,
          type: 'voucher_purchase',
          xp: 0,
          credits: -item.cost,
          xpChange: 0,
          creditsChange: -item.cost,
          description: `دریافت تسهیلات: ${item.title} (شناسه ${voucherCode})`,
          date: 'امروز',
          requestId,
          itemId,
        });

        notify();
        return { ok: true, voucher };
      }

      case 'use': {
        const { voucherId } = action;
        const voucher = (state.vouchers || []).find(
          v => v.id === voucherId && v.profileId === PERSON_IDS.citizen
        );
        if (!voucher || voucher.status === 'used') {
          return fail('INVALID_STATE');
        }

        voucher.status = 'used';
        voucher.usedAt = 'امروز، ثبت در محل';

        notify();
        return { ok: true };
      }

      case 'reset': {
        state = createInitialSeed();
        notify();
        return { ok: true };
      }

      default:
        return fail('FORBIDDEN');
    }
  }

  return {
    getState,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    dispatch,
  };
}

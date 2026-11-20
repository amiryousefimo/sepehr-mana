/**
 * شهرآگاه | آزمون یکپارچگی چرخه کامل ارتباط نقش‌ها (شهروند → اپراتور → مدیر → باشگاه محله)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGameStore } from '../../../public/hackaton/game/core.mjs';
import { PERSON_IDS, CASE_IDS } from '../../../public/hackaton/game/fixtures.mjs';

test('چرخه کامل و متصل تعاملی شهرآگاه: شهروند → بررسی اپراتور → ممیزی مدیر → باشگاه محله', () => {
  const store = createGameStore();

  // ۱. گام شهروند: بررسی وضعیت اولیه
  let state = store.getState();
  assert.equal(state.balances[PERSON_IDS.citizen].credits, 10);
  assert.equal(state.balances[PERSON_IDS.citizen].xp, 20);

  // شهروند گزارش معتبر مانع تردد را ثبت می‌کند
  const submitRes = store.dispatch({
    type: 'submit',
    caseId: CASE_IDS.rain,
    choice: 'access',
  });
  assert.equal(submitRes.ok, true);

  state = store.getState();
  assert.equal(state.balances[PERSON_IDS.citizen].credits, 20);
  assert.equal(state.balances[PERSON_IDS.citizen].xp, 40);
  assert.equal(state.badges.find(b => b.id === 'accessibility-helper').unlocked, true);

  // ۲. گام اپراتور: سوییچ به نقش اپراتور و بررسی مشاهده موجود در صف
  store.dispatch({ type: 'switchRole', role: 'operator' });
  state = store.getState();
  assert.equal(state.role, 'operator');

  // اپراتور مشاهده معلق را در صف دارد
  const pendingEntry = state.entries.find(e => e.status === 'submitted');
  assert.ok(pendingEntry, 'باید مشاهده در انتظار بررسی در صف اپراتور موجود باشد');

  // اپراتور تصمیم تأیید با دلیل نادرست می‌گیرد -> باید خطا دهد
  const badReview = store.dispatch({
    type: 'review',
    entryId: pendingEntry.id,
    decision: 'approve',
    reason: 'no_new_detail',
  });
  assert.equal(badReview.ok, false);
  assert.equal(badReview.code, 'INVALID_REASON');

  // اپراتور با دلیل صحیح تصمیم را ثبت می‌کند
  const reviewRes = store.dispatch({
    type: 'review',
    entryId: pendingEntry.id,
    decision: 'return',
    reason: 'no_new_detail',
  });
  assert.equal(reviewRes.ok, true);

  // مشاهده از صف خارج شده و در وضعیت returned قرار می‌گیرد
  state = store.getState();
  const reviewedEntry = state.entries.find(e => e.id === pendingEntry.id);
  assert.equal(reviewedEntry.status, 'returned');

  // ۳. گام مدیر: سوییچ به نقش مدیر و ممیزی تصمیم‌های اپراتور
  store.dispatch({ type: 'switchRole', role: 'manager' });
  state = store.getState();
  assert.equal(state.role, 'manager');

  // مدیر نمونه تصمیم صحیح قبلی را ممیزی می‌کند
  const auditRes1 = store.dispatch({
    type: 'audit',
    reviewId: 'correct-review',
    verdict: 'correct',
    reason: 'specific_access',
  });
  assert.equal(auditRes1.ok, true);

  // مدیر خطای آموزشی اپراتور در نمونه تمرینی را کشف می‌کند
  const auditRes2 = store.dispatch({
    type: 'audit',
    reviewId: 'error-review',
    verdict: 'needs_review',
    reason: 'unverified',
  });
  assert.equal(auditRes2.ok, true);

  state = store.getState();
  // مدیر به ۲۴ XP رسیده و نشان امین محله باز می‌شود
  assert.equal(state.balances[PERSON_IDS.manager].xp, 24);
  assert.equal(state.badges.find(b => b.id === 'neighborhood-trustee').unlocked, true);

  // اپراتور نیز با ممیزی موفق به ۲۴ XP رسیده و نشان داور منصف باز می‌شود
  assert.equal(state.balances[PERSON_IDS.operator].xp, 24);
  assert.equal(state.badges.find(b => b.id === 'fair-judge').unlocked, true);

  // ۴. گام شهروند در باشگاه محله: بهره‌مندی از اعتبار کسب‌شده
  store.dispatch({ type: 'switchRole', role: 'citizen' });
  state = store.getState();
  assert.equal(state.role, 'citizen');

  // خرید کوپن سفر
  const redeemRes = store.dispatch({
    type: 'redeem',
    itemId: 'trip-voucher',
    requestId: 'req-connected-flow-1',
  });
  assert.equal(redeemRes.ok, true);

  state = store.getState();
  assert.equal(state.balances[PERSON_IDS.citizen].credits, 0);
  assert.equal(state.vouchers.length, 1);
  assert.equal(state.vouchers[0].status, 'active');

  // استفاده از کوپن
  const useRes = store.dispatch({
    type: 'use',
    voucherId: state.vouchers[0].id,
  });
  assert.equal(useRes.ok, true);

  state = store.getState();
  assert.equal(state.vouchers[0].status, 'used');

  // ۵. بازنشانی شبیه‌ساز به حالت آغازین
  store.dispatch({ type: 'reset' });
  state = store.getState();
  assert.equal(state.balances[PERSON_IDS.citizen].credits, 10);
  assert.equal(state.balances[PERSON_IDS.citizen].xp, 20);
  assert.equal(state.vouchers.length, 0);
});

/**
 * شهرآگاه | آزمون‌های جامع پذیرش هسته و جریان کامل بازی
 * شاخه: feature/hackathon/vahab
 * مرجع: todo.md و todo_vahab.md
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGameStore } from '../../../public/hackaton/game/core.mjs';
import { PERSON_IDS, CASE_IDS } from '../../../public/hackaton/game/fixtures.mjs';

test('1. وضعیت اولیه Seed: ۱۰ اعتبار و ۲۰ XP شهروند، صادقیه ۸/۱۰، سهمیه کوپن ۱۲', () => {
  const store = createGameStore();
  const state = store.getState();

  assert.equal(state.role, 'citizen');
  assert.equal(state.balances[PERSON_IDS.citizen].credits, 10);
  assert.equal(state.balances[PERSON_IDS.citizen].xp, 20);

  const sadeghiyeh = state.teams.find(t => t.id === 'sadeghiyeh');
  assert.equal(sadeghiyeh.done, 8);
  assert.equal(sadeghiyeh.goal, 10);
  assert.equal(sadeghiyeh.rank, 2);

  const tripVoucher = state.catalog.find(c => c.id === 'trip-voucher');
  assert.equal(tripVoucher.remaining, 12);
  assert.equal(tripVoucher.cost, 20);

  const badge = state.badges.find(b => b.id === 'accessibility-helper');
  assert.equal(badge.unlocked, false);
});

test('2. ثبت مشاهده تکراری یا شنیداری: برگشت بدون تغییر مانده یا سهمیه محله', () => {
  const store = createGameStore();
  const res = store.dispatch({
    type: 'submit',
    caseId: CASE_IDS.rain,
    choice: 'repeat',
  });

  assert.equal(res.ok, true);
  const state = store.getState();

  const entry = state.entries.find(e => e.caseId === CASE_IDS.rain);
  assert.equal(entry.status, 'returned');
  assert.equal(state.balances[PERSON_IDS.citizen].credits, 10);
  assert.equal(state.balances[PERSON_IDS.citizen].xp, 20);

  const sadeghiyeh = state.teams.find(t => t.id === 'sadeghiyeh');
  assert.equal(sadeghiyeh.done, 8);

  const rainCase = state.cases.find(c => c.id === CASE_IDS.rain);
  assert.ok(!rainCase.attachments.includes(entry.id));
});

test('3. ثبت شاهد معتبر: تأیید → ۲۰ اعتبار، ۴۰ XP، صادقیه ۹/۱۰، نشان همیار دسترسی', () => {
  const store = createGameStore();

  const res = store.dispatch({
    type: 'submit',
    caseId: CASE_IDS.rain,
    choice: 'access',
  });

  assert.equal(res.ok, true);
  const state = store.getState();

  assert.equal(state.balances[PERSON_IDS.citizen].credits, 20);
  assert.equal(state.balances[PERSON_IDS.citizen].xp, 40);

  const sadeghiyeh = state.teams.find(t => t.id === 'sadeghiyeh');
  assert.equal(sadeghiyeh.done, 9);
  assert.equal(sadeghiyeh.rank, 1);

  const badge = state.badges.find(b => b.id === 'accessibility-helper');
  assert.equal(badge.unlocked, true);

  // ثبت مجدد پاداش دوم اضافه نمی‌کند (Idempotent)
  store.dispatch({
    type: 'submit',
    caseId: CASE_IDS.rain,
    choice: 'access',
  });
  const state2 = store.getState();
  assert.equal(state2.balances[PERSON_IDS.citizen].credits, 20);
  assert.equal(state2.balances[PERSON_IDS.citizen].xp, 40);
});

test('4. فرآیند ممیزی: ۸ XP به اپراتور، ۱۲ XP به مدیر، جلوگیری از پاداش تکراری', () => {
  const store = createGameStore();

  // در حالت اولیه، اپراتور ۱۶ XP (۲ بررسی پیشین) و مدیر صفر دارد
  assert.equal(store.getState().balances[PERSON_IDS.operator].xp, 16);
  assert.equal(store.getState().balances[PERSON_IDS.manager].xp, 0);

  // مدیر نمونه صحیح را ممیزی می‌کند
  store.dispatch({ type: 'switchRole', role: 'manager' });
  const auditRes = store.dispatch({
    type: 'audit',
    reviewId: 'correct-review',
    verdict: 'correct',
    reason: 'specific_access',
  });

  assert.equal(auditRes.ok, true);
  assert.equal(store.getState().balances[PERSON_IDS.operator].xp, 24);
  assert.equal(store.getState().balances[PERSON_IDS.manager].xp, 12);

  // ممیزی تکراری با همان شناسه رد می‌شود و پاداش مجدد نمی‌دهد
  const dupAudit = store.dispatch({
    type: 'audit',
    reviewId: 'correct-review',
    verdict: 'correct',
    reason: 'specific_access',
  });
  assert.equal(dupAudit.ok, false);
  assert.equal(dupAudit.code, 'DUPLICATE');
  assert.equal(store.getState().balances[PERSON_IDS.operator].xp, 24);
  assert.equal(store.getState().balances[PERSON_IDS.manager].xp, 12);

  // کشف خطای آموزشی اپراتور توسط مدیر: فقط به مدیر پاداش می‌دهد
  const errAudit = store.dispatch({
    type: 'audit',
    reviewId: 'error-review',
    verdict: 'needs_review',
    reason: 'unverified',
  });
  assert.equal(errAudit.ok, true);
  assert.equal(store.getState().balances[PERSON_IDS.operator].xp, 24);
  assert.equal(store.getState().balances[PERSON_IDS.manager].xp, 24);
  assert.equal(store.getState().reviews.find(r => r.id === 'error-review').needsReview, true);

  // باز شدن نشان‌های امین محله و داور منصف
  assert.equal(store.getState().badges.find(b => b.id === 'neighborhood-trustee').unlocked, true);
  assert.equal(store.getState().badges.find(b => b.id === 'fair-judge').unlocked, true);
});

test('5. خرید کوپن سفر: کاهش مانده به صفر، کاهش سهمیه به ۱۱، جلوگیری از خرید تکراری با یک requestId', () => {
  const store = createGameStore();

  // شهروند ابتدا امتیاز را به ۲۰ می‌رساند
  store.dispatch({ type: 'submit', caseId: CASE_IDS.rain, choice: 'access' });
  assert.equal(store.getState().balances[PERSON_IDS.citizen].credits, 20);

  // خرید اول
  const buyRes = store.dispatch({
    type: 'redeem',
    itemId: 'trip-voucher',
    requestId: 'req-order-101',
  });
  assert.equal(buyRes.ok, true);
  assert.ok(buyRes.voucher.code.startsWith('DEMO-TRIP-'));

  const state = store.getState();
  assert.equal(state.balances[PERSON_IDS.citizen].credits, 0);
  assert.equal(state.catalog.find(c => c.id === 'trip-voucher').remaining, 11);
  assert.equal(state.vouchers.length, 1);
  assert.equal(state.vouchers[0].status, 'active');

  // تلاش برای ثبت دوباره همان requestId: رد با خطای DUPLICATE بدون تغییر موجودی یا سهمیه
  const dupBuy = store.dispatch({
    type: 'redeem',
    itemId: 'trip-voucher',
    requestId: 'req-order-101',
  });
  assert.equal(dupBuy.ok, false);
  assert.equal(dupBuy.code, 'DUPLICATE');
  assert.equal(store.getState().balances[PERSON_IDS.citizen].credits, 0);
  assert.equal(store.getState().catalog.find(c => c.id === 'trip-voucher').remaining, 11);

  // تلاش برای خرید با مانده ناکافی
  const noMoneyBuy = store.dispatch({
    type: 'redeem',
    itemId: 'trip-voucher',
    requestId: 'req-order-102',
  });
  assert.equal(noMoneyBuy.ok, false);
  assert.equal(noMoneyBuy.code, 'INSUFFICIENT');
});

test('6. مصرف کوپن: تغییر وضعیت به used و عدم امکان مصرف دوباره', () => {
  const store = createGameStore();
  store.dispatch({ type: 'submit', caseId: CASE_IDS.rain, choice: 'access' });
  const buy = store.dispatch({
    type: 'redeem',
    itemId: 'trip-voucher',
    requestId: 'req-use-test',
  });
  const voucherId = buy.voucher.id;

  // مصرف معتبر
  const useRes = store.dispatch({ type: 'use', voucherId });
  assert.equal(useRes.ok, true);
  assert.equal(store.getState().vouchers.find(v => v.id === voucherId).status, 'used');

  // مصرف دوباره
  const reuseRes = store.dispatch({ type: 'use', voucherId });
  assert.equal(reuseRes.ok, false);
  assert.equal(reuseRes.code, 'INVALID_STATE');
});

test('7. بازنشانی Reset: بازگشت دقیق تمام داده‌ها به مانده ۱۰ و سهمیه ۱۲', () => {
  const store = createGameStore();

  // اعمال چند عمل
  store.dispatch({ type: 'submit', caseId: CASE_IDS.rain, choice: 'access' });
  store.dispatch({ type: 'redeem', itemId: 'trip-voucher', requestId: 'req-reset-test' });

  assert.equal(store.getState().balances[PERSON_IDS.citizen].credits, 0);
  assert.equal(store.getState().catalog.find(c => c.id === 'trip-voucher').remaining, 11);

  // فرمان بازنشانی
  const resetRes = store.dispatch({ type: 'reset' });
  assert.equal(resetRes.ok, true);

  const resetState = store.getState();
  assert.equal(resetState.balances[PERSON_IDS.citizen].credits, 10);
  assert.equal(resetState.balances[PERSON_IDS.citizen].xp, 20);
  assert.equal(resetState.catalog.find(c => c.id === 'trip-voucher').remaining, 12);
  assert.equal(resetState.teams.find(t => t.id === 'sadeghiyeh').done, 8);
  assert.equal(resetState.vouchers.length, 0);
});

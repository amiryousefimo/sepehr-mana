import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStaffFixture } from './fixture.mjs';
import { mountStaff } from '../../../public/hackaton/game/staff.mjs';

const review = (api, decision, reason) =>
  api.dispatch({ type: 'review', entryId: 'live-entry', decision, reason });
const audit = (api, reviewId, verdict, reason) =>
  api.dispatch({ type: 'audit', reviewId, verdict, reason });
const manager = api => api.dispatch({ type: 'switchRole', role: 'manager' });
const liveReview = api => api.getState().reviews.find(row => row.entryId === 'live-entry');
const credits = api => Object.values(api.getState().balances).map(account => account.credits);
const xp = api => {
  const { balances } = api.getState();
  return [balances['operator-1'].xp, balances['manager-1'].xp];
};

test('live approval attaches once and correct audit grants 8 / 12 once', () => {
  const api = createStaffFixture();
  assert.equal(typeof mountStaff, 'function');
  assert.equal(review(api, 'approve').code, 'INVALID_REASON');
  assert.deepEqual(xp(api), [0, 0]);
  assert.equal(review(api, 'approve', 'specific_access').ok, true);
  assert.equal(review(api, 'approve', 'specific_access').code, 'DUPLICATE');
  assert.deepEqual(api.getState().cases[0].attachments, ['live-entry']);
  assert.deepEqual(xp(api), [0, 0]);
  assert.equal(audit(api, liveReview(api).id, 'correct', 'specific_access').code, 'FORBIDDEN');
  manager(api);
  assert.equal(audit(api, liveReview(api).id, 'correct', 'specific_access').ok, true);
  assert.equal(audit(api, liveReview(api).id, 'correct', 'specific_access').code, 'DUPLICATE');
  assert.deepEqual(xp(api), [8, 12]);
  assert.deepEqual(credits(api), [0, 0, 0]);
});

test('a justified return earns the same XP only after a correct audit', () => {
  for (const [choice, reason] of [['repeat', 'no_new_detail'], ['hearsay', 'unverified']]) {
    const api = createStaffFixture(choice);
    assert.equal(review(api, 'approve', 'specific_access').code, 'INVALID_REASON');
    assert.equal(review(api, 'return', reason).ok, true);
    assert.equal(api.getState().entries[0].status, 'returned');
    assert.deepEqual(api.getState().cases[0].attachments, []);
    assert.deepEqual(xp(api), [0, 0]);
    manager(api);
    assert.equal(audit(api, liveReview(api).id, 'correct', reason).ok, true);
    assert.deepEqual(xp(api), [8, 12]);
  }
});

test('spotting the educational error flags it and awards XP only to the manager', () => {
  const api = createStaffFixture();
  manager(api);
  assert.equal(audit(api, 'error-review', 'needs_review', 'unverified').ok, true);
  assert.equal(api.getState().reviews.find(row => row.id === 'error-review').needsReview, true);
  assert.deepEqual(xp(api), [0, 12]);
  assert.deepEqual(credits(api), [0, 0, 0]);
});

test('wrong audit reasoning earns zero; the manager badge and cap use distinct cases', () => {
  const wrong = createStaffFixture();
  manager(wrong);
  audit(wrong, 'error-review', 'needs_review', 'no_new_detail');
  assert.equal(wrong.getState().audits[0].matched, false);
  assert.deepEqual(xp(wrong), [0, 0]);

  const api = createStaffFixture();
  review(api, 'approve', 'specific_access');
  manager(api);
  audit(api, 'correct-review', 'correct', 'specific_access');
  audit(api, 'error-review', 'needs_review', 'unverified');
  audit(api, liveReview(api).id, 'correct', 'specific_access');
  assert.deepEqual(xp(api), [16, 24]);
  assert.equal(api.getState().badges.filter(badge => badge.profileId === 'manager-1').length, 1);
});

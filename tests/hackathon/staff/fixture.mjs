// Standalone QA double. The production staff view never imports this module.
const operator = 'operator-1';
const manager = 'manager-1';
const rain = 'rain-sadeghiyeh';
const practice = 'practice-hearsay';
const correct = 'practice-access';
const limits = { [operator]: 3, [manager]: 2 };
const rates = { [operator]: 8, [manager]: 12 };
const observations = {
  repeat: { text: 'فلکهٔ دوم صادقیه آب گرفته.', location: 'فلکهٔ دوم صادقیه' },
  access: {
    text: 'ساعت ۱۴:۴۰ رمپ شمال‌غربی فلکه زیر آب است؛ عبور با ویلچر ممکن نیست.',
    time: '۱۴:۴۰', location: 'رمپ شمال‌غربی فلکهٔ دوم صادقیه', impact: 'عبور با ویلچر ممکن نیست',
  },
  hearsay: { text: 'شنیدم گذر کنار بوستان بسته شده است.', location: 'گذر کنار بوستان' },
};
const rubric = {
  repeat: ['return', 'no_new_detail'],
  access: ['approve', 'specific_access'],
  hearsay: ['return', 'unverified'],
};
const personIds = { operator, manager, citizen: 'citizen-1' };

export function createStaffFixture(choice = 'access') {
  const sample = (id, caseId, option, status) => ({
    id, caseId, choice: option, status, profileId: personIds.citizen, ...observations[option],
  });
  const state = {
    role: 'operator', profileId: operator, day: 2, period: 1,
    cases: [
      { id: rain, number: 'issue-rain-sadeghiyeh', title: 'آبگرفتگی معابر و انسداد ترافیکی در صادقیه',
        summary: 'فلکهٔ دوم صادقیه، زیر پل و ابتدای ستارخان', attachments: [] },
      { id: correct, title: 'تمرین: مانع عبور در گذر محله', attachments: [] },
      { id: practice, title: 'تمرین: گزارش شنیده‌شده کنار بوستان', attachments: [] },
    ],
    entries: [
      sample('live-entry', rain, choice, 'submitted'),
      sample('correct-entry', correct, 'access', 'approved'),
      sample('error-entry', practice, 'hearsay', 'approved'),
    ],
    reviews: [
      { id: 'correct-review', entryId: 'correct-entry', caseId: correct, profileId: operator,
        decision: 'approve', reason: 'specific_access' },
      { id: 'error-review', entryId: 'error-entry', caseId: practice, profileId: operator,
        decision: 'approve', reason: 'specific_access' },
    ],
    audits: [], ledger: [], badges: [], teams: [], catalog: [], vouchers: [],
  };
  const listeners = new Set();
  const fail = code => ({ ok: false, code });
  let serial = 0;
  function award(id, caseId, reviewId) {
    const prior = state.ledger.filter(event => event.profileId === id);
    if (prior.length >= limits[id] || prior.some(event => event.caseId === caseId)) return;
    state.ledger.push({ period: state.period, profileId: id, caseId, reviewId, xp: rates[id], credits: 0 });
    if (prior.length + 1 === limits[id]) state.badges.push({ profileId: id, unlocked: true });
  }
  function getState() {
    const balances = Object.fromEntries(Object.values(personIds).map(profileId => [
      profileId, {
        xp: state.ledger.filter(event => event.profileId === profileId).reduce((total, event) => total + event.xp, 0),
        credits: 0,
      },
    ]));
    return structuredClone({ ...state, balances });
  }
  function dispatch(action) {
    if (action.type === 'switchRole') {
      if (!Object.hasOwn(personIds, action.role)) return fail('FORBIDDEN');
      state.role = action.role;
      state.profileId = personIds[action.role];
    } else if (action.type === 'review') {
      if (state.role !== 'operator') return fail('FORBIDDEN');
      const entry = state.entries.find(item => item.id === action.entryId);
      if (!entry) return fail('INVALID_STATE');
      if (state.reviews.some(item => item.entryId === entry.id)) return fail('DUPLICATE');
      if (entry.status !== 'submitted') return fail('INVALID_STATE');
      const [decision, reason] = rubric[entry.choice];
      if (action.decision !== decision || action.reason !== reason) return fail('INVALID_REASON');
      state.reviews.push({ id: `live-review-${++serial}`, entryId: entry.id, caseId: entry.caseId,
        profileId: operator, decision, reason });
      entry.status = decision === 'approve' ? 'approved' : 'returned';
      if (decision === 'approve') state.cases.find(item => item.id === entry.caseId).attachments.push(entry.id);
    } else if (action.type === 'audit') {
      if (state.role !== 'manager') return fail('FORBIDDEN');
      const review = state.reviews.find(item => item.id === action.reviewId);
      if (!review) return fail('INVALID_STATE');
      if (state.audits.some(item => item.reviewId === review.id)) return fail('DUPLICATE');
      if (!['correct', 'needs_review'].includes(action.verdict) ||
        !Object.values(rubric).some(([, reason]) => reason === action.reason)) return fail('INVALID_REASON');
      const entry = state.entries.find(item => item.id === review.entryId);
      const [decision, reason] = rubric[entry.choice];
      const right = review.decision === decision && review.reason === reason;
      const matched = action.verdict === (right ? 'correct' : 'needs_review') && action.reason === reason;
      review.needsReview = !matched || !right;
      state.audits.push({ id: `audit-${++serial}`, reviewId: review.id, caseId: review.caseId,
        profileId: manager, verdict: action.verdict, reason: action.reason, matched });
      if (matched) {
        award(manager, review.caseId, review.id);
        if (right) award(operator, review.caseId, review.id);
      }
    } else return fail('INVALID_STATE');
    listeners.forEach(listener => listener());
    return { ok: true, code: 'OK' };
  }
  return { getState, dispatch, subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); } };
}

/**
 * شهرآگاه | داده‌های اولیه و ساختگی هکاتون (Seed & Fixtures)
 * شاخه: feature/hackathon/vahab
 * مرجع: todo.md و todo_vahab.md
 */

export const PERSON_IDS = {
  citizen: 'citizen-1',
  operator: 'operator-1',
  manager: 'manager-1',
};

export const CASE_IDS = {
  rain: 'rain-sadeghiyeh',
  correct: 'practice-access',
  practice: 'practice-hearsay',
};

export const REWARD_LIMITS = {
  [PERSON_IDS.operator]: 3,
  [PERSON_IDS.manager]: 2,
};

export const REWARD_RATES = {
  [PERSON_IDS.operator]: 8,
  [PERSON_IDS.manager]: 12,
  citizenReward: { xp: 20, credits: 10 },
};

export const OBSERVATION_OPTIONS = {
  repeat: {
    id: 'repeat',
    text: 'فلکهٔ دوم صادقیه آب گرفته؛ خیابان‌ها پر از آب شده و رفت‌وآمد سخت است.',
    location: 'فلکهٔ دوم صادقیه',
    time: '۱۳:۳۰',
    impact: 'آب‌گرفتگی کلی معبر بدون جزئیات تازه',
  },
  access: {
    id: 'access',
    text: 'ساعت ۱۴:۴۰ رمپ شمال‌غرب فلکه برای ویلچر مسدود است؛ آب به عمق ۲۰ سانتی‌متر جمع شده و تردد معلولین و کالسکه ممکن نیست.',
    location: 'رمپ شمال‌غربی فلکهٔ دوم صادقیه',
    time: '۱۴:۴۰',
    impact: 'مسدود شدن رمپ تردد ویلچر و معلولین',
  },
  hearsay: {
    id: 'hearsay',
    text: 'شنیدم مسیر بلوار جناح هم کلاً بسته شده و ماشین‌ها تو ترافیک سنگین گیر افتادند.',
    location: 'بلوار جناح',
    time: '۱۴:۱۵',
    impact: 'شنیده‌ها و غیرقابل استناد میدانی',
  },
};

export const RUBRICS = {
  repeat: ['return', 'no_new_detail'],
  access: ['approve', 'specific_access'],
  hearsay: ['return', 'unverified'],
};

export function createInitialSeed() {
  return {
    role: 'citizen',
    day: 2,
    period: 1,
    profileId: PERSON_IDS.citizen,
    cases: [
      {
        id: CASE_IDS.rain,
        number: 'issue-rain-sadeghiyeh',
        title: 'آب‌گرفتگی معابر و انسداد ترافیکی در صادقیه',
        summary: 'فلکهٔ دوم صادقیه، زیر پل و ابتدای ستارخان؛ بارش شدید پاییزی و تجمع آب‌های سطحی.',
        location: 'منطقه ۲ و ۵، فلکه دوم صادقیه',
        status: 'open',
        attachments: [],
      },
      {
        id: CASE_IDS.correct,
        number: 'practice-case-1',
        title: 'تمرین: مانع عبور در گذر محله',
        summary: 'گزارش مسدود بودن پیاده‌رو بر اثر آب‌گرفتگی کانال فرعی.',
        status: 'open',
        attachments: ['correct-entry'],
      },
      {
        id: CASE_IDS.practice,
        number: 'practice-case-2',
        title: 'تمرین: گزارش شنیده‌شده کنار بوستان',
        summary: 'پیام ترافیک اطراف بوستان بر مبنای شنیده‌های مردمی.',
        status: 'open',
        attachments: [],
      },
    ],
    entries: [
      // دیروز یک مشاهده تأییدشده در تاریخچه ثبت شده و در ۸ سهم صادقیه لحاظ شده است
      {
        ...OBSERVATION_OPTIONS.access,
        id: 'seed-yesterday-entry',
        caseId: 'case-yesterday-traffic',
        profileId: PERSON_IDS.citizen,
        choice: 'access',
        status: 'approved',
        createdAt: 'روز گذشته ۱۴:۱۰',
      },
      // نمونه‌های تمرینی آماده برای ممیزی
      {
        ...OBSERVATION_OPTIONS.access,
        id: 'correct-entry',
        caseId: CASE_IDS.correct,
        profileId: 'citizen-seed-2',
        choice: 'access',
        status: 'approved',
        createdAt: 'امروز ۱۱:۰۰',
      },
      {
        ...OBSERVATION_OPTIONS.hearsay,
        id: 'error-entry',
        caseId: CASE_IDS.practice,
        profileId: 'citizen-seed-3',
        choice: 'hearsay',
        status: 'approved', // خطای ساختگی اپراتور برای ممیزی
        createdAt: 'امروز ۱۱:۳۰',
      },
      // مشاهده ارسالی شهروند در صف بررسی اپراتور (تمرین برای ثبت تصمیم و ارسال به ممیزی)
      {
        ...OBSERVATION_OPTIONS.repeat,
        id: 'seed-pending-repeat-entry',
        caseId: CASE_IDS.practice,
        profileId: 'citizen-seed-4',
        choice: 'repeat',
        status: 'submitted',
        createdAt: 'امروز ۱۲:۲۰',
      },
    ],
    reviews: [
      // دو بررسی صحیح قبلی در دور برای پیشرفت نشان اپراتور
      {
        id: 'correct-review',
        entryId: 'correct-entry',
        caseId: CASE_IDS.correct,
        profileId: PERSON_IDS.operator,
        decision: 'approve',
        reason: 'specific_access',
        comment: 'شاهد معتبر مکمل همراه با زمان و محل مشخص.',
      },
      // خطای آموزشی اپراتور در نمونه تمرینی برای آموزش ممیزی مدیر
      {
        id: 'error-review',
        entryId: 'error-entry',
        caseId: CASE_IDS.practice,
        profileId: PERSON_IDS.operator,
        decision: 'approve', // تصمیم نادرست (باید return / unverified می‌بود)
        reason: 'specific_access',
        comment: 'تأیید اشتباهی پیام شنیداری بدون جزئیات میدانی.',
      },
    ],
    audits: [],
    ledger: [
      // سابقه شهروند: مأموریت دیروز (+۲۰ XP و +۱۰ اعتبار)
      {
        id: 'led-seed-citizen-1',
        period: 1,
        profileId: PERSON_IDS.citizen,
        caseId: 'case-yesterday-traffic',
        type: 'mission_reward',
        xp: 20,
        credits: 10,
        xpChange: 20,
        creditsChange: 10,
        description: 'تأیید ثبت مشاهده ترافیکی روز گذشته',
        date: 'روز گذشته',
      },
      // دو پاداش قبلی اپراتور در دور برای پیشرفت نشان (بدون مصرف سهم مدیر فعال)
      {
        id: 'led-seed-op-1',
        period: 1,
        profileId: PERSON_IDS.operator,
        caseId: 'practice-archive-1',
        reviewId: 'rev-seed-archived-1',
        type: 'review_reward',
        xp: 8,
        credits: 0,
        xpChange: 8,
        creditsChange: 0,
        description: 'ممیزی موفق تصمیم در پرونده پیشین منطقه',
        date: 'دیروز',
      },
      {
        id: 'led-seed-op-2',
        period: 1,
        profileId: PERSON_IDS.operator,
        caseId: 'practice-archive-2',
        reviewId: 'rev-seed-archived-2',
        type: 'review_reward',
        xp: 8,
        credits: 0,
        xpChange: 8,
        creditsChange: 0,
        description: 'ممیزی موفق تصمیم در پرونده پیشین ناحیه',
        date: 'دیروز',
      },
    ],
    badges: [
      {
        id: 'accessibility-helper',
        profileId: PERSON_IDS.citizen,
        title: 'همیار دسترسی معابر',
        unlocked: false,
      },
      {
        id: 'fair-judge',
        profileId: PERSON_IDS.operator,
        title: 'داور منصف',
        unlocked: false,
      },
      {
        id: 'neighborhood-trustee',
        profileId: PERSON_IDS.manager,
        title: 'امین محله',
        unlocked: false,
      },
    ],
    teams: [
      { id: 'sadeghiyeh', title: 'صادقیه', done: 8, goal: 10, rank: 2 },
      { id: 'gisha', title: 'گیشا', done: 17, goal: 20, rank: 1 },
      { id: 'poonak', title: 'پونک', done: 12, goal: 15, rank: 2 },
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
        description: 'پاداش پس از ۲ مشارکت کیفی و تأییدشده در محله',
      },
      {
        id: 'workshop-invite',
        title: 'دعوت‌نامه کارگاه حل مسئله محله',
        cost: 40,
        remaining: 4,
        quota: 4,
        personLimit: 1,
        iconType: 'workshop',
        description: 'شرکت در نشست تخصصی برنامه‌ریزی شهری با حضور مدیران و نخبگان محلی',
      },
      {
        id: 'pool-ticket',
        title: 'بلیت یک نوبت مجموعه ورزشی',
        cost: 100,
        remaining: 2,
        quota: 2,
        personLimit: 1,
        iconType: 'activity',
        description: 'تسهیلات نشاط و سلامت شهروندی ویژه فعالان نمونه محله',
      },
    ],
    vouchers: [],
    seenRequests: [],
  };
}

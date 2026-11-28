const test=require('node:test');
const assert=require('node:assert/strict');
const {coverageMix,shortTermClaims,cashRows,revalue,pension}=require('../reports/rasad/profile-math');
const cutoff='2026-10-22';
test('coverage shares total 100% with repeat periods, overlap and inclusive cutoffs',()=>{
 const coverage=coverageMix([
  {HistoryTypeCode:'A',StartDate:'2026-10-18',EndDate:'2026-10-20'},
  {HistoryTypeCode:'A',StartDate:'2026-10-19',EndDate:'2026-10-20'},
  {HistoryTypeCode:'B',StartDate:'2026-10-20'},
  {HistoryTypeCode:'C',StartDate:'2026-10-23'}
 ],cutoff);
 assert.equal(coverage.days,5);
 assert.equal(coverage.overlap,1);
 assert.deepEqual(coverage.shares.map(row=>[row.HistoryCode,row.OriginalDays,row.WeightedDays,row.CoverageShare]),[['A',3,2.5,0.5],['B',3,2.5,0.5]]);
 assert.deepEqual(coverageMix([],cutoff),{days:0,overlap:0,shares:[]});
});
test('counts beneficiaries and reconciles cash independently from valuation',()=>{
 const profile={
  premium:[{Paid:'2026-10-01',SourceRef:'PRE-1',Collected:100},{Paid:'2026-10-23',Collected:999}],
  benefit:[{Paid:'2026-10-10',SourceRef:'BEN-1',Fund:30,Total:100},{Paid:null,Fund:999}],
  household:{
   dependents:[{DependentKey:'child1',LinkedFrom:'2026-10-01'},{DependentKey:'child2',LinkedFrom:'2026-10-01',LinkedTo:'2026-10-11'}],
   dependentBenefits:[{DependentBenefitKey:'child2-BEN-1',BenefitDate:'2026-10-05',FamilyPaid:20}]
  }
 };
 const cash=cashRows(profile,cutoff,()=>140507);
 assert.deepEqual([cash.active.length,cash.gross,cash.direct,cash.family,cash.net],[1,100,30,20,50]);
 const priced=revalue(cash.rows,{140507:{date:'2026-10-20',rials:10}},50);
 assert.deepEqual([priced.gross,priced.direct,priced.family,priced.missing],[500,150,100,0]);
 assert.equal(priced.priced[0].GoldGrams,10);
 assert.equal(revalue(cash.rows,{},50).missing,3);
 assert.equal(revalue(cash.rows,{140507:{rials:0}},50).priced[0].CurrentRials,null);
});
test('pension takes the last visible wage per employer and applies overrides independently',()=>{
 const calendar=[{EndDate:'2026-09-22',PeriodKey:140506},{EndDate:cutoff,PeriodKey:140507}];
 const profile={premium:[
  {PeriodKey:140507,PartyKey:1,PremiumKey:1,Wage:60e6,Recorded:'2026-10-05'},
  {PeriodKey:140507,PartyKey:1,PremiumKey:2,Wage:120e6,Recorded:'2026-10-08'},
  {PeriodKey:140507,PartyKey:2,PremiumKey:3,Wage:60e6,Recorded:'2026-10-10'},
  {PeriodKey:140507,PartyKey:2,PremiumKey:4,Wage:999e6,Recorded:'2026-10-24'}
 ],rights:[{PeriodKey:140506,CreditedMonths:300}]};
 assert.equal(pension(profile,calendar,cutoff).estimated,150e6);
 assert.equal(pension(profile,calendar,cutoff).observed,1);
 assert.equal(pension(profile,calendar,cutoff,{months:480}).estimated,210e6);
 assert.equal(pension(profile,calendar,cutoff,{wage:0}).estimated,0);
});
test('short-term benefit payments count once at their payment date in personal cash and gold',()=>{
 const legacy={ShortTermBenefitKey:'ST-001',LegacyBenefitKey:7,BenefitTypeName:'بیمه بیکاری',ClaimDate:'2026-09-28',PaymentDate:'2026-10-01',Status:'Paid',PaidAmount:30};
 const fresh={ShortTermBenefitKey:'ST-002',LegacyBenefitKey:null,BenefitTypeName:'کمک‌هزینه ازدواج',ClaimDate:'2026-09-30',PaymentDate:cutoff,Status:'Paid',PaidAmount:20};
 const profile={
  benefit:[{BenefitKey:7,SourceRef:'BEN-7',Paid:'2026-10-01',Fund:30},{BenefitKey:9,SourceRef:'BEN-9',Paid:'2026-10-02',Fund:12}],
  premium:[{SourceRef:'PRE-1',Paid:'2026-10-05',Collected:100}],
  household:{dependentBenefits:[{DependentBenefitKey:'F-001',BenefitDate:'2026-10-06',FamilyPaid:10}]},
  shortTermBenefits:[legacy,fresh,{...fresh},
   {...fresh,ShortTermBenefitKey:'ST-003',Status:'Pending',PaymentDate:null,PaidAmount:0},
   {...fresh,ShortTermBenefitKey:'ST-004',Status:'Rejected',PaymentDate:null,PaidAmount:0},
   {...fresh,ShortTermBenefitKey:'ST-005',PaymentDate:'2026-10-23'},
   {...fresh,ShortTermBenefitKey:'ST-006',ClaimDate:'2026-10-25',PaymentDate:'2026-10-26'}]
 };
 const claims=shortTermClaims(profile,cutoff);
 assert.equal(claims.length,5);
 assert.deepEqual(claims.filter(row=>row.PaidInScope).map(row=>row.ShortTermBenefitKey),['ST-001','ST-002']);
 const cash=cashRows(profile,cutoff,date=>date.startsWith('2026-10')?140507:140506);
 assert.deepEqual([cash.gross,cash.direct,cash.family,cash.shortTermPaid,cash.net],[100,62,10,50,28]);
 assert.deepEqual(cash.rows.filter(row=>row.IsShortTerm).map(row=>[row.CashReference,row.NominalRials,row.PeriodKey]),[['BEN-7',30,140507],['ST-002',20,140507]]);
 const priced=revalue(cash.rows,{140507:{rials:10}},50);
 assert.deepEqual([priced.direct,priced.shortTermPaid,priced.family,priced.missing],[310,250,50,0]);
});

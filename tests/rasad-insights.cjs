const test=require('node:test');
const assert=require('node:assert/strict');
const {coverageMix,cashRows,revalue,pension}=require('../reports/rasad/profile-math');
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

((root) => {
 'use strict';
 const epoch=value=>Date.parse(value+'T00:00:00Z')/86400000;
 const finite=value=>typeof value==='number'&&Number.isFinite(value);
 const total=(rows,key)=>rows.reduce((amount,row)=>amount+row[key],0);
 function coverageMix(rows,asOf){
  const finalDay=epoch(asOf);
  const boundaries=new Map();
  function boundary(day,key,delta){
   if(!boundaries.has(day))boundaries.set(day,[]);
   boundaries.get(day).push([key,delta]);
  }
  for(const row of rows){
   const start=epoch(row.StartDate),end=Math.min(finalDay,row.EndDate?epoch(row.EndDate):finalDay);
   if(!finite(start)||!finite(end)||start>end)continue;
   const key=String(row.HistoryTypeCode||'unknown');
   boundary(start,key,1);
   boundary(end+1,key,-1);
  }
  const counts=new Map(),weighted=new Map(),raw=new Map();
  let days=0,overlap=0,prior;
  for(const [day,changes] of [...boundaries].sort(([first],[second])=>first-second)){
   if(counts.size){
    const span=day-prior;
    days+=span;
    if(counts.size>1)overlap+=span;
    for(const key of counts.keys()){
     weighted.set(key,(weighted.get(key)||0)+span/counts.size);
     raw.set(key,(raw.get(key)||0)+span);
    }
   }
   for(const [key,delta] of changes){
    const count=(counts.get(key)||0)+delta;
    if(count)counts.set(key,count);else counts.delete(key);
   }
   prior=day;
  }
  const shares=[...weighted].map(([HistoryCode,WeightedDays])=>({HistoryCode,WeightedDays,OriginalDays:raw.get(HistoryCode),CoverageShare:WeightedDays/days})).sort((first,second)=>second.WeightedDays-first.WeightedDays);
  return {days,overlap,shares};
 }
 function shortTermClaims(profile,asOf){
  const claims=new Map();
  for(const row of profile.shortTermBenefits||[]){
   if(row.ShortTermBenefitKey==null||!row.ClaimDate||row.ClaimDate>asOf)continue;
   const PaidInScope=row.Status==='Paid'&&Boolean(row.PaymentDate)&&row.PaymentDate<=asOf&&finite(row.PaidAmount)&&row.PaidAmount>0;
   const key=String(row.ShortTermBenefitKey);
   if(!claims.has(key))claims.set(key,{...row,PaidInScope});
  }
  return [...claims.values()];
 }
 function cashRows(profile,asOf,periodOf){
  const make=(reference,group,date,amount,category,shortTerm=false)=>({CashReference:reference,CashGroup:group,CashCategory:category,CashDate:date,PeriodKey:periodOf(date),NominalRials:amount,IsShortTerm:shortTerm});
  const principal=profile.benefit.filter(row=>row.Paid&&row.Paid<=asOf&&finite(row.Fund)&&row.Fund!==0);
  const income=profile.premium.filter(row=>row.Paid&&row.Paid<=asOf&&finite(row.Collected)&&row.Collected!==0);
  const dependents=profile.household?.dependents||[];
  const benefits=(profile.household?.dependentBenefits||[]).filter(row=>row.BenefitDate<=asOf&&finite(row.FamilyPaid)&&row.FamilyPaid!==0);
  const shortTerm=shortTermClaims(profile,asOf).filter(row=>row.PaidInScope);
  const linked=new Map(shortTerm.filter(row=>row.LegacyBenefitKey!=null).map(row=>[String(row.LegacyBenefitKey),row]));
  const rows=[
   ...income.map(row=>make(row.SourceRef,'وصول حق‌بیمه',row.Paid,row.Collected,'حق‌بیمه')),
   ...principal.map(row=>{
    const classification=linked.get(String(row.BenefitKey));
    return make(row.SourceRef,'هزینهٔ فرد',row.Paid,row.Fund,classification?.BenefitTypeName??row.Service??row.Kind,Boolean(classification));
   }),
   ...shortTerm.filter(row=>row.LegacyBenefitKey==null).map(row=>make(row.ShortTermBenefitKey,'هزینهٔ فرد',row.PaymentDate,row.PaidAmount,row.BenefitTypeName,true)),
   ...benefits.map(row=>make(row.DependentBenefitKey,'هزینهٔ تبعی',row.BenefitDate,row.FamilyPaid,row.Service))
  ];
  const gross=total(rows.filter(row=>row.CashGroup==='وصول حق‌بیمه'),'NominalRials');
  const direct=total(rows.filter(row=>row.CashGroup==='هزینهٔ فرد'),'NominalRials');
  const family=total(rows.filter(row=>row.CashGroup==='هزینهٔ تبعی'),'NominalRials');
  const shortTermPaid=total(rows.filter(row=>row.IsShortTerm),'NominalRials');
  const active=dependents.filter(row=>row.LinkedFrom<=asOf&&(!row.LinkedTo||row.LinkedTo>=asOf));
  return {gross,direct,family,shortTermPaid,net:gross-direct-family,rows,dependents,active,benefits};
 }
 function revalue(rows,quotes,reference){
  const priced=rows.map(row=>{
   const quote=quotes?.[row.PeriodKey],rials=quote?.rials;
   const grams=finite(rials)&&rials>0?row.NominalRials/rials:null;
   const currentRials=grams!==null&&finite(reference)&&reference>0?Math.round(grams*reference):null;
   return {...row,RateDate:quote?.date,MonthGoldRate:rials,GoldGrams:grams,CurrentRials:currentRials};
  });
  const missing=priced.filter(row=>row.CurrentRials===null).length;
  const amount=group=>priced.filter(row=>row.CashGroup===group).reduce((sum,row)=>sum+(row.CurrentRials??0),0);
  return {priced,missing,gross:amount('وصول حق‌بیمه'),direct:amount('هزینهٔ فرد'),family:amount('هزینهٔ تبعی'),shortTermPaid:priced.filter(row=>row.IsShortTerm).reduce((sum,row)=>sum+(row.CurrentRials??0),0)};
 }
 function pension(profile,calendar,asOf,scenario={}){
  const actual=calendar.filter(period=>period.EndDate<=asOf).slice(-24);
  const keys=new Set(actual.map(period=>period.PeriodKey)),monthly=new Map();
  for(const row of profile.premium){
   if(!keys.has(row.PeriodKey)||!finite(row.Wage)||row.Wage<=0||row.Recorded>asOf)continue;
   if(!monthly.has(row.PeriodKey))monthly.set(row.PeriodKey,new Map());
   const employers=monthly.get(row.PeriodKey),scope=row.PartyKey,previous=employers.get(scope);
   if(!previous||(row.Recorded||'')>(previous.Recorded||'')||((row.Recorded||'')===(previous.Recorded||'')&&row.PremiumKey>previous.PremiumKey))employers.set(scope,row);
  }
  const rows=actual.map(({PeriodKey})=>({PeriodKey,WageInputs:[...(monthly.get(PeriodKey)?.values()||[])].reduce((sum,row)=>sum+row.Wage,0)}));
  const observed=rows.filter(row=>row.WageInputs>0);
  const wage=finite(scenario.wage)?scenario.wage:observed.length?total(observed,'WageInputs')/observed.length:null;
  const right=profile.rights.filter(row=>row.PeriodKey<=(actual.at(-1)?.PeriodKey||0)).sort((first,second)=>second.PeriodKey-first.PeriodKey)[0];
  const months=finite(scenario.months)?scenario.months:right?.CreditedMonths;
  const applied=finite(months)&&months>=0?Math.min(months,420):null;
  const estimated=finite(wage)&&wage>=0&&applied!==null?Math.round(wage*applied/360):null;
  return {wage,months,applied,estimated,observed:observed.length,window:actual.length,rows,rule:right?.RuleKey};
 }
 const api={coverageMix,shortTermClaims,cashRows,revalue,pension};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.rasadProfileMath=api;
})(typeof window==='object'?window:{});

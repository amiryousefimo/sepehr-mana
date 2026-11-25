'use strict';
let marketQuote=null, marketPending=null;
const insightPrefs=new Map();
function profilePrefs(){
 if(!insightPrefs.has(person))insightPrefs.set(person,{gold:'',wage:'',months:''});
 return insightPrefs.get(person);
}
function numericOverride(value,scale=1){
 const parsed=Number(value)*scale;
 return value!==''&&Number.isFinite(parsed)?parsed:undefined;
}
function donutPanel(title,parts,total,caption){
 const palette=['#087e75','#5377bc','#b76793','#bc7c32','#466c91','#4e7e51','#976aaf','#874d29'];
 if(!parts.length)return pane(title,emptyPanel());
 let start=0;
 const rings=parts.map((part,index)=>{
  const length=part.CoverageShare*100,offset=start;start+=length;
  return '<circle cx="73" cy="73" r="55" fill="none" stroke="'+palette[index%palette.length]+'" stroke-width="19" pathLength="100" stroke-dasharray="'+Math.max(0,length-Math.min(1.2,length/3))+' 100" stroke-dashoffset="'+(-offset)+'"><title>'+esc(part.name)+' · '+esc(fmt(part.CoverageShare,'pct'))+'</title></circle>';
 }).join('');
 const keys=parts.map((part,index)=>'<li><i class="swatch" style="--swatch:'+palette[index%palette.length]+'"></i>'+withHelp(esc(part.name),'field','HistoryCode',part.name)+'<strong>'+esc(fmt(part.CoverageShare,'pct'))+'</strong></li>').join('');
 return pane(title,'<figure class="ring-figure"><div class="ring-art"><svg viewBox="0 0 146 146" role="img" aria-label="'+esc(title)+'"><circle cx="73" cy="73" r="55" fill="none" stroke="#e6eef1" stroke-width="19"/>'+rings+'</svg><div class="ring-center"><strong>'+num(total)+'</strong><small>'+esc(caption)+'</small></div></div><ul class="ring-key" aria-label="سهم نوع سابقه">'+keys+'</ul></figure>');
}
function pairedPanel(title,items){
 const max=Math.max(1,...items.map(item=>Math.abs(item.value)));
 return pane(title,'<div class="comparison">'+items.map(item=>'<div class="comparison-row"><div>'+withHelp('<span>'+esc(item.name)+'</span>','metric',item.name)+'<b>'+esc(fmt(item.value,'money'))+'</b></div><div class="comparison-track" aria-hidden="true"><span class="'+item.className+'" style="--length:'+Math.abs(item.value)/max*100+'%"></span></div></div>').join('')+'</div>');
}
function accountInsight(){
 const basis=periods[meta.asOf].EndDate,prefs=profilePrefs(),model=window.rasadProfileMath;
 const mix=model.coverageMix(profile.membership,basis);
 const classified=mix.shares.map(part=>({...part,name:meta.dims.HistoryType?.find(item=>String(item.HistoryTypeCode)===part.HistoryCode)?.HistoryTypeName||'سابقهٔ نامشخص'}));
 const cash=model.cashRows(profile,basis,calendarKey);
 const override=numericOverride(prefs.gold);
 const reference=override??marketQuote?.reference?.rials;
 const priced=model.revalue(cash.rows,marketQuote?.months,reference);
 const adjustable='<form id="insight-form" class="form insight-form">'+formField('نرخ دلخواه هر گرم طلا (ریال)','goldOverride','<input name="gold" type="number" min="1" max="1000000000000" step="1" value="'+esc(prefs.gold)+'" placeholder="خالی = آخرین نرخ موجود">')+control('<button type="submit">اعمال نرخ</button>','insightApply','اعمال نرخ طلا')+'</form>';
 const quote=reference?'هر گرم طلای ۱۸ عیار: '+num(reference)+' ریال · '+(override?'فرض شما':dateLabel(marketQuote.reference.date)+' · '+(marketQuote.mode==='archive'?'نسخهٔ آرشیوی TGJU':'آخرین قیمت پایانی موجود در TGJU')):'قیمت مرجع هنوز در دسترس نیست.';
 const compare=[
  {name:'وصول سازمان از پرونده',value:priced.gross,className:'earn'},
  {name:'هزینه فرد با نرخ مرجع',value:priced.direct,className:'self'},
  {name:'هزینه افراد تبعی با نرخ مرجع',value:priced.family,className:'family'}
 ];
 const bridge=[
  {Name:'وصول',Amount:cash.gross},{Name:'فرد',Amount:-cash.direct},{Name:'افراد تبعی',Amount:-cash.family}
 ];
 const detail=[C('CashReference','مرجع ردیف'),C('CashGroup','مسیر پول'),C('CashDate','تاریخ وجه','date'),columns.k,C('NominalRials','ریال زمان ثبت','num'),C('RateDate','تاریخ نرخ ماه','date'),C('MonthGoldRate','ریال برای هر گرم','num'),C('GoldGrams','معادل گرم','num'),C('CurrentRials','ریال با نرخ مرجع','num')];
 const dependentRows=cash.dependents.map(row=>({...row,DependentFlag:cash.active.some(item=>item.DependentKey===row.DependentKey),FamilyPaid:sum(cash.benefits.filter(item=>item.DependentKey===row.DependentKey),'FamilyPaid')??0}));
 return bundle(
  [V('روز پوشش یکتا',mix.days,'num','تمام سابقهٔ موجود'),V('افراد تبعی فعال',cash.active.length,'num','در تاریخ مبنای داده'),V('جمع وصول به سازمان',cash.gross),V('جمع هزینه فرد و خانواده',cash.direct+cash.family),V('تراز نقدی منتسب',cash.net)],
  [donutPanel('سهم انواع سابقه بیمه',classified,mix.days,'روز یکتا'),chart('پل مالی فرد و خانواده',bridge,'Name','waterfall',[X('جریان نقدی','Amount')]),marketQuote&&reference&&!priced.missing?pairedPanel('ارزش معادل طلا در تاریخ مرجع',compare):pane('ارزش معادل طلا در تاریخ مرجع',marketPending?loadingPanel('در حال دریافت نرخ طلا…'):para(priced.missing?'برای '+num(priced.missing)+' ردیف نرخ کامل وجود ندارد؛ مجموع معادل نمایش داده نمی‌شود.':'نرخ معتبر در دسترس نیست. مبالغ اسمی در صفحه موجودند.')+(!marketQuote?'<button type="button" data-market-retry>دریافت دوبارهٔ نرخ</button>':'')),pane('نرخ‌گذاری و مبنای محاسبه',para(quote)+adjustable)],
  [tab('سهم روزهای پوشش بر اساس نوع سابقه',classified,[C('HistoryCode','کد نوع سابقه'),C('name','نوع سابقه'),C('OriginalDays','روز بدون تقسیم','num'),C('WeightedDays','روز سهم‌دار','num'),C('CoverageShare','سهم از کل','pct')]),tab('افراد تبعی پرونده و هزینه هر نفر',dependentRows,[C('DependentKey','شناسه تبعی'),C('DependentLabel','عنوان عضو'),C('RelationLabel','نسبت'),C('LinkedFrom','آغاز وابستگی','date'),C('LinkedTo','پایان وابستگی','openDate'),C('DependentFlag','فعال در مبنا','bool'),C('FamilyPaid','هزینه ریالی','num')]),tab('ریز پرداخت‌های ثبت‌شده برای افراد تبعی',cash.benefits,[C('DependentBenefitKey','مرجع خدمت تبعی'),C('DependentLabel','عنوان عضو'),C('BenefitDate','تاریخ پرداخت','date'),C('Service','خدمت'),C('FamilyPaid','هزینه ریالی','num')]),tab('دفتر ریز جریان و ارزش‌گذاری طلا',priced.priced,detail,{trace:true})],
  'بازه: از نخستین ردیف موجود تا '+dateLabel(basis)+'؛ نرخ مرجع طلا مستقل از تاریخ بستهٔ آزمایشی است. هزینهٔ اعضای تبعی، ردیف‌های ساختگی جداگانه‌اند و به گزارش‌های قبلی اضافه نشده‌اند.');
}
function pensionInsight(){
 const basis=periods[meta.asOf].EndDate,prefs=profilePrefs();
 const options={wage:numericOverride(prefs.wage,1e6),months:numericOverride(prefs.months)};
 const model=window.rasadProfileMath;
 const base=model.pension(profile,meta.dims.Period,basis);
 const result=model.pension(profile,meta.dims.Period,basis,options);
 const percent=result.applied===null?0:result.applied/420;
 const mode=options.wage!==undefined||options.months!==undefined?'با فرض شما':'با سوابق موجود';
 const form='<form id="insight-form" class="form insight-form">'+formField('سابقه مفروض (ماه)','pensionMonths','<input type="number" name="months" min="0" max="720" step="1" value="'+esc(prefs.months)+'" placeholder="خالی = سابقه پرونده">')+formField('مزد میانگین مفروض (میلیون ریال)','pensionWage','<input type="number" name="wage" min="0" max="100000" step="0.01" value="'+esc(prefs.wage)+'" placeholder="خالی = میانگین موجود">')+control('<button type="submit">محاسبه سناریو</button>','insightApply','محاسبه سناریو')+control('<button class="secondary" type="button" data-insight-clear>بازگشت به مبنا</button>','insightReset','بازگشت به مبنا')+'</form>';
 const journey=pane('چطور به مستمری فرضی رسیدیم؟','<div class="pension-steps">'+
  [['مزد برآورد','مزد برآورد',fmt(result.wage,'money')],['سابقه لحاظ‌شده','سابقه لحاظ‌شده',fmt(result.applied,'num')],['برآورد ماهانه امروز','برآورد ماهانه امروز',fmt(result.estimated,'money')]].map(([label,key,value])=>'<div>'+withHelp('<small>'+esc(label)+'</small>','metric',key)+'<b>'+esc(value)+'</b></div>').join('')+
  '</div><div class="pension-track" style="--length:'+percent*100+'%"><span></span></div><small>سابقهٔ مؤثر در فرمول '+num(result.applied??0)+' از ۴۲۰ ماه</small>');
 const bars=[{name:'مستمری با دادهٔ ثبت‌شده',value:base.estimated??0,className:'self'},{name:'مستمری پس از اعمال فرض',value:result.estimated??0,className:'earn'}];
 const changed=control('<p>مبنای داده: '+esc(dateLabel(basis))+' · '+num(base.observed)+' از '+num(base.window)+' ماه دارای مزد ثبت‌شده</p>','pensionCompleteness','کامل بودن ماه‌های مزد');
 return bundle([V('برآورد ماهانه امروز',result.estimated,'money',mode),V('مزد برآورد',result.wage,'money',options.wage!==undefined?'فرض کاربر':'میانگین ماه‌های موجود'),V('سابقه لحاظ‌شده',result.applied,'num','ماه در فرمول')],[journey,base.estimated===null||result.estimated===null?pane('مقایسه مستمری پایه و سناریو',emptyPanel()):pairedPanel('مقایسه مستمری پایه و سناریو',bars),pane('فرض‌های سناریوی بازنشستگی',changed+form)],[tab('گردش مزد ماهانه در بازه برآورد',result.rows.map(row=>({...row,WageInputs:row.WageInputs||null})),[columns.k,C('WageInputs','مزد مشمول ماه','money')])],'نمای آموزشی: این مبلغ ناخالص و فرضی است. احراز سن و شرایط بازنشستگی، افزایش سنوات، حداقل، سقف مزد و قواعد خاص در این محاسبه اعمال نمی‌شوند.');
}
async function loadMarket(){
 if(marketQuote||marketPending)return;
 marketPending=api('/api/gold');render();
 try{marketQuote=await marketPending}catch{marketQuote=null}
 finally{marketPending=null;if(active==='P-09')render()}
}

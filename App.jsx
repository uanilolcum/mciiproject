import React, { useState, useEffect, useRef } from 'react';

/* MCII Odak Koçu — araştırma sürümü. Mevcut Vite/React projesinde App.jsx yerine yükleyin.
   Gerçek araştırma için ortak başlangıç tarihini YYYY-MM-DD olarak girin.
   Ölçekleri yalnızca gerekli izin ve onamlar alındıktan sonra etkinleştirin.
   Boş tarih = ayrı yerel demo alanı (araştırma verisi değildir).
   Ölçekleri kapatmak önceki kayıtları silmez. Kamuya açık demo için ayrı dağıtım kullanın. */
const ENABLE_RESEARCH_SCALES = false;
const RESEARCH_START_DATE = ''; // Örn. '2026-12-01' — araştırmacı bütün cihazlarda aynı tarihi kullanmalı
const STUDY_ID = 'MCII-2026-v2'; // Aynı araştırma boyunca değiştirmeyin
const DAYS = 21;
const VERSION = '2.0.0';
const METRICS = { Soru: ['Çözülen soru','Questions solved'], Sayfa: ['Okunan sayfa','Pages read'], Deneme: ['Tamamlanan deneme','Practice tests'], Konu: ['Tamamlanan konu','Topics completed'], Kelime: ['Öğrenilen kelime','Words learned'] };
const CATS = { phone: ['Telefon/Bildirim','Phone/notification'], dream: ['Hayal Kurma','Daydreaming'], switch: ['Görev Değiştirme','Task switching'], other: ['Diğer','Other'] };
const REVERSE = [6,10,12,14];
const ESSA_SUBSCALES = { Calisma_Baskisi:[1,2,3,4], Ders_Yuku:[5,6,7], Basari_Kaygisi:[10,11,12,13], Beklenti_Umutsuzluk:[8,9,14,15,16] };
const TPS_ITEMS = [
  "Önemli olsalar bile, işleri bitirmeyi gereksiz yere ertelerim.",
  "Yapmaktan hoşlanmadığım şeylere başlamayı ertelerim.",
  "İşlerin teslim edilmesi gereken bir tarih olduğunda, son dakikaya kadar beklerim.",
  "Çalışma alışkanlıklarımı geliştirmeyi ertelerim.",
  "Bir şeyi yapmamak için bahane bulmayı başarırım.",
  "Ders çalışmak gibi sıkıcı işlere dahi gerekli zamanı ayırırım.",
  "Ben iflah olmaz bir zaman savurganıyım.",
  "Ben bir zaman savurganıyım ama bunu düzeltmek için hiçbir çaba gösteremiyorum.",
  "Bir şeyi yapacağıma dair önce kendime söz verir, sonra kararımı uygulamayı ağırdan alırım.",
  "Bir eylem planı yaptığımda, onu takip ederim.",
  "Bir işe başlayamadığımda kendimden nefret ederim, ama yine de bu beni harekete geçirmez.",
  "Önemli işleri her zaman vaktinden önce tamamlarım.",
  "Bir işe başlamanın ne kadar önemli olduğunu bilmeme rağmen tıkanır kalırım.",
  "Bugünün işini yarına bırakmak benim tarzım değildir."
];
const ESSA_ITEMS = [
  "Gelecekteki eğitim ve çalışma yaşantımı düşündüğümde akademik açıdan yoğun baskı hissediyorum.",
  "Ebeveynim ders notlarımla çok fazla ilgileniyor ve bu benim baskı hissetmeme yol açıyor.",
  "Günlük derslerimden ve akademik çalışmalarımdan dolayı yoğun baskı altına giriyorum.",
  "Sınıf arkadaşlarım arasında yoğun bir rekabet var ve bu akademik açıdan baskı hissetmeme yol açıyor.",
  "Okulda çok fazla yapılacak işim olduğunu hissediyorum.",
  "Çok fazla ev ödevim var.",
  "Okulda çok fazla sınav olduğunu düşünüyorum.",
  "Derslerden aldığım notlarımdan hiç memnun değilim.",
  "Derslerde dikkatimi toplamakta çok güçlük yaşıyorum.",
  "Derslerden aldığım notlar geleceğim için çok önemlidir hatta bütün yaşamımı etkileyebilir.",
  "Sınavlardan düşük not aldığımda ebeveynimi hayal kırıklığına uğrattığımı düşünürüm.",
  "Sınavlardan düşük not aldığımda öğretmenimi hayal kırıklığına uğrattığımı düşünürüm.",
  "Çoğunlukla derslerden alacağım notlar konusunda kendime güvenemem.",
  "Kendim için belirlediğim akademik standartlara ulaşamadığımda kendimi gergin hissederim.",
  "Beklentilerimi karşılayamadığım durumlarda yeteri kadar iyi olamadığımı hissederim.",
  "Amaçlarıma ulaşamayacağımı düşündüğümde yoğun biçimde endişelenirim ve çoğunlukla uyuyamam."
];
const TPS_CHOICES = ['Kesinlikle katılmıyorum','Katılmıyorum','Katılıyorum','Kesinlikle katılıyorum'];
const ESSA_CHOICES = ['Kesinlikle katılmıyorum','Katılmıyorum','Kararsızım','Katılıyorum','Kesinlikle katılıyorum'];
const FIDELITY = { yes:100, partial:50, no:0 };
const emptyCounts = () => ({phone:0,dream:0,switch:0,other:0});
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const iso = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const dayNumber = s => { if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return NaN; const [y,m,d]=s.split('-').map(Number); const n=Date.UTC(y,m-1,d)/86400000; return new Date(n*86400000).toISOString().slice(0,10)===s?n:NaN; };
const addDays = (s,n) => new Date((dayNumber(s)+n)*86400000).toISOString().slice(0,10);
const diffDays = (a,b) => dayNumber(a)-dayNumber(b);
const weekOf = (date,start) => { const n=diffDays(date,start); return n>=0 && n<DAYS?Math.floor(n/7)+1:null; };
const round = n => Number.isFinite(n)?Math.round(n*10000)/10000:null;
const sum = xs => xs.reduce((a,b)=>a+b,0);
const mean = xs => xs.length?sum(xs)/xs.length:null;
const ratio = (a,b,k=100) => b>0?round(a/b*k):null;
const countCuts = s => sum(Object.keys(CATS).map(k=>s.counts?.[k]||0));
const isInteger = (v,min=0,max=10000000) => String(v).trim()!=='' && Number.isInteger(Number(v)) && Number(v)>=min && Number(v)<=max;
const completeAnswers = (a,n,max) => Array.isArray(a)&&a.length===n&&a.every(x=>Number.isInteger(x)&&x>=1&&x<=max);
function scoreScales(tps,essa){
  const t = completeAnswers(tps,14,4)?tps.map((v,i)=>REVERSE.includes(i+1)?5-v:v):null;
  const e = completeAnswers(essa,16,5)?essa:null;
  return { tpsScored:t,tpsTotal:t?sum(t):null,essaTotal:e?sum(e):null,dimensions:Object.fromEntries(Object.entries(ESSA_SUBSCALES).map(([k,ids])=>[k,e?sum(ids.map(i=>e[i-1])):null])) };
}
const studyRows = (data) => data.sessions.filter(s=>weekOf(s.date,data.start)!==null);
const goalPct = g => g?ratio(g.current-g.baseline,g.target-g.baseline):null;
const diff = (a,b) => a==null||b==null?null:round(a-b);
// Wall-clock based stopwatch; every interval is assigned to exactly one state.
function advanceTimer(s, now){
  if(!s || s.mode==='ended') return s;
  const dt=Math.min(Math.max(0,now-s.lastAt),Math.max(0,s.plannedMs-s.totalMs));
  const next={...s,lastAt:now,totalMs:s.totalMs+dt};
  if(s.mode==='running') next.activeMs+=dt;
  if(s.mode==='break') next.breakMs+=dt;
  if(s.mode==='cut') next.cutMs+=dt;
  if(next.totalMs>=next.plannedMs){next.mode='ended';next.timeUp=true;next.endedAt=s.lastAt+dt;}
  return next;
}
function changeTimer(s,mode,now,cat){
  const n=advanceTimer(s,now); if(!n||n.mode==='ended')return n;
  if(mode==='cut' && n.mode==='running' && Object.hasOwn(CATS,cat)) return {...n,mode,category:cat,counts:{...n.counts,[cat]:n.counts[cat]+1}};
  if(mode==='break'&&n.mode==='running') return {...n,mode,category:null};
  if(mode==='running'&&['break','cut'].includes(n.mode)) return {...n,mode,category:null};
  if(mode==='ended')return {...n,mode,timeUp:false,endedAt:now};
  return n;
}
function dayCoverage(data,date){
  const rows=studyRows(data).filter(s=>s.date===date);
  const status=data.days[date]||'';
  if(status==='complete'&&rows.length) return 'complete';
  if(status==='none'&&!rows.length) return 'none';
  if(status==='partial')return 'partial';
  return 'unknown';
}
function stats(rows){
  const active=sum(rows.map(s=>s.activeMs)); const planned=sum(rows.map(s=>s.plannedMs)); const cuts=sum(rows.map(countCuts));
  const ratings=rows.map(s=>s.rating).filter(x=>Number.isInteger(x)&&x>=1&&x<=10);
  const f=rows.map(s=>FIDELITY[s.fidelity]).filter(x=>x!==undefined);
  return {active,planned,cuts,ratings:mean(ratings),rate:ratio(active,planned),perHour:ratio(cuts,active,3600000),fidelity:mean(f),encountered:f.length,breakMs:sum(rows.map(s=>s.breakMs)),cutMs:sum(rows.map(s=>s.cutMs)),categories:Object.fromEntries(Object.keys(CATS).map(k=>[k,sum(rows.map(s=>s.counts[k]))]))};
}
function summarize(data,today=iso()){
  const rows=studyRows(data); const weeks=[];
  for(let w=1;w<=3;w++){
    const wr=rows.filter(s=>weekOf(s.date,data.start)===w), st=stats(wr);
    const dates=Array.from({length:7},(_,i)=>addDays(data.start,(w-1)*7+i));
    const coverage=dates.map(d=>dayCoverage(data,d));
    const confirmed=coverage.filter(v=>['complete','none'].includes(v)).length;
    weeks.push({...st,rows:wr,confirmed,complete:confirmed===7,none:coverage.filter(v=>v==='none').length,partial:coverage.filter(v=>v==='partial').length,unknown:coverage.filter(v=>v==='unknown').length});
  }
  const st=stats(rows); const full=weeks.every(w=>w.complete); const g=data.goal;
  // Recorded totals and coverage are separate from full-period variables.
  return {rows,weeks,st,full,goal:g,goalRate:goalPct(g),daysWithLogs:new Set(rows.map(s=>s.date)).size,today};
}
function csvText(headers,rows){
  const cell=v=>{if(v===null||v===undefined)return ''; let x=String(v); if(typeof v==='number')x=x.replace('.',','); if(typeof v==='string'&&/^[=+\-@\t\r]/.test(x))x="'"+x; return /[;"\r\n]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x;};
  return '\uFEFF'+[headers,...rows].map(r=>r.map(cell).join(';')).join('\r\n');
}
function rawExport(data){
  const h=['Surum','Arastirma_ID','Demo','Rumuz','Grup','Arastirma_Baslangic','Seans_ID','Hafta_No','Tarih','Baslangic_Zamani','Bitis_Zamani','Hedef_ID','Hedef_Olusturma','Hedef_Bitis','Hedef_Birimi','Hedef_Baslangic','Hedef_Deger','Hedef_Once','Hedef_Sonra','Seans_Eklenen_Ilerleme','Hedefe_Ulasma_Yuzde','Planlanan_Dk','Aktif_Calisma_Sn','Aktif_Calisma_Dk','Toplam_Blok_Sn','Planli_Mola_Sn','Dikkat_Kesintisi_Sn','Gercek_Calisma_Orani_Yuzde','Kopma_Telefon_Bildirim','Kopma_Hayal_Kurma','Kopma_Gorev_Degistirme','Kopma_Diger','Toplam_Kopma_Sayisi','Sure_Doldu_Mu','Odaklanma_Puani_10','MCII_Plani_Uygulandi_Mi','Seans_MCII_Sadakat_Yuzde','MCII_Plan_Surum','Kurtarilan_Seans','Gun_Kayit_Durumu'];
  return csvText(h,studyRows(data).map(s=>[VERSION,data.studyId,Number(data.demo),data.code,data.group,data.start,s.id,weekOf(s.date,data.start),s.date,s.startedISO,s.endedISO,s.goalId,data.goal?.createdAt,data.goal?.deadline,s.metric,s.baseline,s.target,s.before,s.after,s.progress,ratio(s.after-s.baseline,s.target-s.baseline),s.plannedMs/60000,round(s.activeMs/1000),round(s.activeMs/60000),round(s.totalMs/1000),round(s.breakMs/1000),round(s.cutMs/1000),ratio(s.activeMs,s.plannedMs),...Object.keys(CATS).map(k=>s.counts[k]),countCuts(s),Number(s.timeUp),s.rating,data.group===1?s.fidelity:'',data.group===1?FIDELITY[s.fidelity]??null:null,data.group===1?s.planVersion:null,Number(!!s.recovered),dayCoverage(data,s.date)]));
}
function summaryExport(data){
  const {weeks,st,full,goal,goalRate,rows,daysWithLogs}=summarize(data);
  const h=['Surum','Arastirma_ID','Demo','Rumuz','Grup','Arastirma_Baslangic','Arastirmadan_Ayrildi','Hedef_Birimi','Hedef_Baslangic','Hedef_Deger','Hedef_Guncel','Kayitli_Hedef_Gerceklesme_Yuzde','Hedef_Gerceklesme_Yuzde','Kayitli_Calisma_Gunu','Toplam_Seans','Kapsam_Tam','Toplam_Onayli_Gun','Toplam_Eksik_Gun','Kayitli_Toplam_Aktif_Dk','Kayitli_Toplam_Planlanan_Dk','Kayitli_Sure_Gerceklesme_Yuzde','Kayitli_Saat_Basina_Kesinti','Toplam_Aktif_Dk','Toplam_Planlanan_Dk','Sure_Gerceklesme_Yuzde','Aktif_Sure_Degisim','Saat_Basina_Kesinti','Toplam_Kesinti','Telefon_Kesinti','Hayal_Kurma_Kesinti','Gorev_Degistirme_Kesinti','Diger_Kesinti','Odak_Degisim','MCII_Uygulama_Yuzde','MCII_Engel_Yasanan_Seans','MCII_Evet','MCII_Kismen','MCII_Hayir','MCII_Engel_Yok'];
  const val=[VERSION,data.studyId,Number(data.demo),data.code,data.group,data.start,Number(data.withdrawn),goal?.metric,goal?.baseline,goal?.target,goal?.current,goalRate,full?goalRate:null,daysWithLogs,rows.length,Number(full),sum(weeks.map(w=>w.confirmed)),DAYS-sum(weeks.map(w=>w.confirmed)),rows.length?round(st.active/60000):null,rows.length?round(st.planned/60000):null,st.rate,st.perHour,full?round(st.active/60000):null,full?round(st.planned/60000):null,full?st.rate:null,weeks[0].complete&&weeks[2].complete?round((weeks[2].active-weeks[0].active)/60000):null,full?st.perHour:null,full?st.cuts:null,...Object.keys(CATS).map(k=>full?st.categories[k]:null),weeks[0].complete&&weeks[2].complete?diff(weeks[2].ratings,weeks[0].ratings):null,data.group===1?round(st.fidelity):null,data.group===1?st.encountered:null,...['yes','partial','no','not_encountered'].map(v=>data.group===1?rows.filter(s=>s.fidelity===v).length:null)];
  weeks.forEach((w,i)=>{const k=`H${i+1}_`; h.push(...['Aktif_Dk','Planlanan_Dk','Kesinti','Saat_Basina_Kesinti','Odak_Ort','Seans_Sayisi','Onayli_Gun','Kismi_Gun','Belirsiz_Gun','Calisma_Yok_Gun','Kayitli_Aktif_Dk','Kayitli_Kesinti','Kayitli_Odak_Ort'].map(x=>k+x)); val.push(w.complete?round(w.active/60000):null,w.complete?round(w.planned/60000):null,w.complete?w.cuts:null,w.complete?w.perHour:null,w.complete?round(w.ratings):null,w.rows.length,w.confirmed,w.partial,w.unknown,w.none,w.rows.length?round(w.active/60000):null,w.rows.length?w.cuts:null,round(w.ratings));});
  // Günlük kapsam kayıtları, sıfır ile kayıt yok ayrımını denetlenebilir kılar.
  for(let i=0;i<DAYS;i++){const d=addDays(data.start,i);h.push(`Gun${i+1}_Durum`);val.push(dayCoverage(data,d));}
  return csvText(h,[val]);
}
function scalesExport(data){
  const h=['Surum','Arastirma_ID','Demo','Rumuz','Grup','Arastirma_Baslangic','Arastirmadan_Ayrildi','Olcek_Surum']; const v=[VERSION,data.studyId,Number(data.demo),data.code,data.group,data.start,Number(data.withdrawn),'TPS_TR14_2013_ESSA_TR16_2015'];
  const scores={};
  for(const [key,label] of [['pre','Pre'],['post','Post']]){
    const a=data.scales[key]||{};const s=scoreScales(a.tps,a.essa);scores[key]=s;
    h.push(`${label}_Durum`,`${label}_Tarih`);v.push(a.status||'missing',a.at||'');
    for(let i=0;i<14;i++){h.push(`TPS_${label}_M${String(i+1).padStart(2,'0')}`);v.push(a.tps?.[i]??null);}
    for(let i=0;i<14;i++){h.push(`TPS_${label}_S${String(i+1).padStart(2,'0')}`);v.push(s.tpsScored?.[i]??null);}
    h.push(`TPS_${label}_Toplam`);v.push(s.tpsTotal);
    for(let i=0;i<16;i++){h.push(`ESSA_${label}_M${String(i+1).padStart(2,'0')}`);v.push(a.essa?.[i]??null);}
    h.push(`ESSA_${label}_Toplam`);v.push(s.essaTotal);
    for(const k of Object.keys(ESSA_SUBSCALES)){h.push(`ESSA_${label}_${k}`);v.push(s.dimensions[k]);}
  }
  h.push('TPS_Degisim','ESSA_Degisim');v.push(diff(scores.post.tpsTotal,scores.pre.tpsTotal),diff(scores.post.essaTotal,scores.pre.essaTotal));
  for(const k of Object.keys(ESSA_SUBSCALES)){h.push(`ESSA_${k}_Degisim`);v.push(diff(scores.post.dimensions[k],scores.pre.dimensions[k]));}
  return csvText(h,[v]);
}
const DEMO = !RESEARCH_START_DATE;
const CONFIG_OK = DEMO || Number.isFinite(dayNumber(RESEARCH_START_DATE));
const STORAGE_KEY = `mcii_research_${STUDY_ID}_${DEMO?'demo':RESEARCH_START_DATE}`;
function fresh(){return {version:VERSION,studyId:STUDY_ID,demo:DEMO,start:DEMO?iso():RESEARCH_START_DATE,code:'',group:0,consent:false,guide:false,lang:'tr',goal:null,sessions:[],days:{},timer:null,scales:{},withdrawn:false};}
function load(){
  try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return {data:fresh(),error:''};const d=JSON.parse(raw);if(d.version!==VERSION||!Array.isArray(d.sessions)||!d.days||!d.scales||d.studyId!==STUDY_ID||(!DEMO&&d.start!==RESEARCH_START_DATE))throw Error();return {data:d,error:''};}catch(e){return {data:fresh(),error:'Yerel veri okunamadı. Kayıtların üzerine yazılmaması için işlem durduruldu. / Local data could not be read.'};}
}
function downloadCSV(name,content){const blob=new Blob([content],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
const btn='rounded-xl bg-indigo-600 text-white font-bold px-4 py-3 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed';
const secondary='rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold px-4 py-2 hover:bg-slate-100 disabled:opacity-40';
const field='w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-800';
const card='bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3';
const fmt = ms => {const s=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;};
const shown = (n,d=1) => n==null?'—':Number(n).toLocaleString('tr-TR',{maximumFractionDigits:d});

function ScaleForm({phase,onSave,onSkip,L}){
  const [tps,setTps]=useState(Array(14).fill(null));const [essa,setEssa]=useState(Array(16).fill(null));const [part,setPart]=useState(0);
  const vals=part===0?tps:essa;const setter=part===0?setTps:setEssa;const items=part===0?TPS_ITEMS:ESSA_ITEMS;const opts=part===0?TPS_CHOICES:ESSA_CHOICES;
  const done=completeAnswers(vals,items.length,opts.length);
  return <div className={card}><h2 className="text-xl font-black">{phase==='pre'?'Ön test':'Son test'} · {part+1}/2</h2><p className="text-sm text-slate-600">Bu anket bilimsel araştırma amaçlıdır. Katılım gönüllüdür. Her ifade için seni en iyi anlatan seçeneği işaretle. Doğru veya yanlış yanıt yoktur. Yanıtların notlarını etkilemez. İstersen yanıt vermeden ayrılabilirsin.</p><h3 className="font-bold">{part===0?'Tuckman Erteleme Ölçeği':'Eğitim Stres Ölçeği'}</h3><p className="text-xs text-slate-500">{vals.filter(x=>x!==null).length}/{items.length} yanıtlandı</p>{items.map((q,i)=><fieldset key={`${part}-${i}`} className="border-t border-slate-100 pt-3 space-y-2"><legend className="font-semibold text-sm">{i+1}. {q}</legend><div className="flex flex-wrap gap-2">{opts.map((o,j)=><label key={j} className={`border rounded-lg p-2 text-xs cursor-pointer ${vals[i]===j+1?'bg-indigo-50 border-indigo-500':'bg-white border-slate-200'}`}><input type="radio" name={`scale-${part}-${i}`} checked={vals[i]===j+1} onChange={()=>setter(a=>a.map((x,k)=>k===i?j+1:x))}/> {j+1} · {o}</label>)}</div></fieldset>)}<div className="flex flex-wrap gap-2">{part===1&&<button className={secondary} onClick={()=>setPart(0)}>Geri</button>}<button className={btn} disabled={!done} onClick={()=>part===0?setPart(1):onSave(tps,essa)}>{part===0?'İkinci ölçeğe geç':'Yanıtları tamamla ve kaydet'}</button><button className={secondary} onClick={()=>{if(window.confirm('Ölçekleri yanıtlamadan ayrılmak istediğine emin misin? Tamamlanmayan yanıtlar kaydedilmeyecek.'))onSkip();}}>Ölçekleri yanıtlamak istemiyorum</button></div><p className="text-xs text-slate-500">Ölçek maddeleri doğrulanmış Türkçe form sırasındadır. Puanlar ekranda gösterilmez.</p></div>;
}
function ChartBars({title,values,unit='',labels}){
  const max=Math.max(1,...values.filter(v=>v!=null));return <div className="space-y-2"><h3 className="text-sm font-bold">{title}</h3>{values.map((v,i)=><div key={i} className="flex items-center gap-2 text-xs"><span className="w-20 shrink-0">{labels?.[i]||`${i+1}. hafta`}</span><div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden"><div className="bg-indigo-500 h-3 rounded-full" style={{width:`${v==null?0:Math.max(0,v)/max*100}%`}}/></div><span className="w-16 text-right tabular-nums">{shown(v)} {v==null?'':unit}</span></div>)}</div>;
}

export default function App(){
  const [initial]=useState(load);const [data,setData]=useState(initial.data);const ref=useRef(initial.data);
  const [error,setError]=useState(initial.error);const [tab,setTab]=useState('goal');const [clock,setClock]=useState(Date.now());
  const [code,setCode]=useState('');const [group,setGroup]=useState(0);const [consent,setConsent]=useState(false);
  const [form,setForm]=useState({title:'',metric:'Soru',target:'',outcome:'',obstacle:'',ifText:'',thenText:''});
  const [editing,setEditing]=useState(false);const [subject,setSubject]=useState('');const [minutes,setMinutes]=useState('45');
  const [rating,setRating]=useState(null);const [progress,setProgress]=useState('');const [fidelity,setFidelity]=useState('');
  const [message,setMessage]=useState('');const [dayWeek,setDayWeek]=useState(1);const [showGuide,setShowGuide]=useState(false);
  const [recovery,setRecovery]=useState(()=>Boolean(initial.data.timer&&initial.data.timer.mode!=='ended'));
  const [pausedForConflict,setPausedForConflict]=useState(false);
  const en=data.lang==='en';const L=(tr,eng)=>en?eng:tr;const exp=data.group===1;const today=iso(new Date(clock));
  const day=diffDays(today,data.start);const end=CONFIG_OK?addDays(data.start,20):'';const during=CONFIG_OK&&day>=0&&day<21;
  const after=CONFIG_OK&&day>=21;const before=CONFIG_OK&&day<0;
  const preStatus=data.scales.pre?.status;const postStatus=data.scales.post?.status;
  const preNeeded=ENABLE_RESEARCH_SCALES&&!DEMO&&!preStatus&&!data.withdrawn&&data.code&&!after&&!data.sessions.length&&!data.goal;
  const preMissing=ENABLE_RESEARCH_SCALES&&!DEMO&&!preStatus&&!preNeeded;
  const postNeeded=ENABLE_RESEARCH_SCALES&&!DEMO&&after&&data.code&&!postStatus&&!data.withdrawn&&!data.timer;
  function commit(next){
    if(error||pausedForConflict)return false;
    try{const n=typeof next==='function'?next(ref.current):next;localStorage.setItem(STORAGE_KEY,JSON.stringify(n));ref.current=n;setData(n);return true;}
    catch(e){setError(L('Yerel kayıt yapılamadı. Yeni veri girmeyin; mevcut CSV dosyalarını yedekleyin.','Local save failed. Stop entering data and back up CSV files.'));return false;}
  }
  useEffect(()=>{const tick=setInterval(()=>setClock(Date.now()),500);return()=>clearInterval(tick);},[]);
  useEffect(()=>{
    const conflict=e=>{if(e.key===STORAGE_KEY){setPausedForConflict(true);setError('Bu araştırma başka bir sekmede değiştirildi. Bu sekmeyi kapatıp tek sekmede yeniden açın. / Another tab changed this study. Reopen one tab only.');}};
    window.addEventListener('storage',conflict);return()=>window.removeEventListener('storage',conflict);
  },[]);
  useEffect(()=>{
    if(!data.timer||data.timer.mode==='ended'||recovery||error||pausedForConflict)return;
    const sync=()=>{const t=ref.current.timer;if(t&&t.mode!=='ended'){const n=advanceTimer(t,Date.now());if(n.totalMs!==t.totalMs||n.mode!==t.mode)commit(d=>({...d,timer:n}));}};
    const timer=setInterval(sync,1000);document.addEventListener('visibilitychange',sync);window.addEventListener('pagehide',sync);
    return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',sync);window.removeEventListener('pagehide',sync);};
  },[data.timer?.id,data.timer?.mode,recovery,error,pausedForConflict]);
  useEffect(()=>{if(data.timer)setTab('timer');},[data.timer?.id]);
  // After a refresh ask whether the previous timing state really continued.
  function restore(continued){const t=ref.current.timer;if(!t)return;const n=continued?advanceTimer(t,Date.now()):{...t,mode:'ended',endedAt:t.lastAt,timeUp:false};if(commit(d=>({...d,timer:{...n,recovered:true}}))){setRecovery(false);setTab('timer');}}
  function register(){
    if(!/^[A-Za-z0-9_-]{2,24}$/.test(code.trim())||![1,2].includes(group)||!consent)return;
    if(commit(d=>({...d,code:code.trim().toUpperCase(),group,consent:true,consentedAt:new Date().toISOString()})))setMessage('');
  }
  function saveScale(phase,tps,essa,skip=false){
    if(!ENABLE_RESEARCH_SCALES||DEMO||data.scales[phase]?.status||data.withdrawn)return;
    if(!skip&&(!completeAnswers(tps,14,4)||!completeAnswers(essa,16,5)))return;
    if(phase==='pre'&&(after||data.sessions.length||data.goal))return;
    if(phase==='post'&&(!after||data.timer))return;
    const a=skip?{status:'declined',at:new Date().toISOString()}:{status:'complete',at:new Date().toISOString(),tps:[...tps],essa:[...essa]};
    if(commit(d=>({...d,scales:{...d.scales,[phase]:a}})))setTab(phase==='pre'?'goal':'reports');
  }
  function saveGoal(){
    if(error||data.withdrawn||!data.guide||(!during&&!before)||data.timer)return;
    const old=data.goal;
    if(old&&!editing)return;
    if(!old&&(!form.title.trim()||!Object.hasOwn(METRICS,form.metric)||!isInteger(form.target,1))){setMessage(L('Geçerli bir çıktı hedefi ve pozitif tam sayı gir.','Enter a valid output goal and positive integer.'));return;}
    if(exp&&[form.outcome,form.obstacle,form.ifText,form.thenText].some(s=>!s.trim())){setMessage(L('WOOP alanlarının tümünü doldur.','Complete all WOOP fields.'));return;}
    const plan=exp?{outcome:form.outcome.trim(),obstacle:form.obstacle.trim(),ifText:form.ifText.trim(),thenText:form.thenText.trim()}:{};
    const g=old?{...old,...plan,planVersion:old.planVersion+1,planUpdatedAt:new Date().toISOString()}:{id:uid(),title:form.title.trim(),metric:form.metric,baseline:0,target:Number(form.target),current:0,createdAt:new Date().toISOString(),deadline:end,planVersion:exp?1:0,...plan};
    if(commit(d=>({...d,goal:g}))){setEditing(false);setMessage('');}
  }
  function editPlan(){const g=data.goal;if(!g||!exp)return;setForm({title:g.title,metric:g.metric,target:String(g.target),outcome:g.outcome,obstacle:g.obstacle,ifText:g.ifText,thenText:g.thenText});setEditing(true);}
  function startSession(){
    const d=ref.current;const date=iso();if(!d.goal||d.timer||d.withdrawn||!d.guide||weekOf(date,d.start)==null||preMissing||preNeeded)return;
    if(!subject.trim()||!isInteger(minutes,1,720)){setMessage(L('Ders/konu ve 1–720 dakika arasında tam sayı gir.','Enter a subject and a whole duration between 1 and 720 minutes.'));return;}
    const now=Date.now();const midnight=new Date(now);midnight.setHours(24,0,0,0);if(now+Number(minutes)*60000>midnight.getTime()){setMessage(L('Oturum gece yarısını aşmamalı. Daha kısa bir süre seç.','Sessions must not cross midnight. Choose a shorter block.'));return;}const t={id:uid(),date,startedISO:new Date(now).toISOString(),goalId:d.goal.id,subject:subject.trim(),metric:d.goal.metric,baseline:d.goal.baseline,target:d.goal.target,before:d.goal.current,planVersion:d.goal.planVersion,plannedMs:Number(minutes)*60000,totalMs:0,activeMs:0,cutMs:0,breakMs:0,lastAt:now,mode:'running',category:null,counts:emptyCounts(),timeUp:false,recovered:false};
    if(commit(v=>({...v,timer:t,days:{...v.days,[date]:''}}))){setRating(null);setProgress('');setFidelity('');setMessage('');setTab('timer');}
  }
  function transition(mode,cat){if(recovery||!ref.current.timer)return;const n=changeTimer(ref.current.timer,mode,Date.now(),cat);commit(d=>({...d,timer:n}));}
  function saveSession(){
    const d=ref.current,t=d.timer;if(!t||t.mode!=='ended'||!d.goal)return;
    if(!Number.isInteger(rating)||rating<1||rating>10||!isInteger(progress,0)|| (exp&&!['yes','partial','no','not_encountered'].includes(fidelity))){setMessage(L('Odak puanı, çıktı miktarı (gerekirse 0) ve ilgili değerlendirmeyi tamamla.','Complete the focus rating, output (0 if none), and applicable evaluation.'));return;}
    const s={...t,endedISO:new Date(t.endedAt||t.lastAt).toISOString(),progress:Number(progress),after:t.before+Number(progress),rating,fidelity:exp?fidelity:null};
    if(commit(v=>({...v,goal:{...v.goal,current:s.after},sessions:v.sessions.some(x=>x.id===s.id)?v.sessions:[...v.sessions,s],timer:null}))){setRating(null);setProgress('');setFidelity('');setSubject('');setTab('reports');setMessage('');}
  }
  function discardSession(){if(!data.timer)return;if(window.confirm(L('Bu kaydı tamamlamadan iptal etmek istiyor musun? Kaydedilmiş diğer oturumlar korunur. Bu günün kapsamı belirsiz kalır.','Discard this unfinished record? Saved sessions are retained. Day coverage remains unknown.'))){commit(d=>({...d,timer:null,days:{...d.days,[d.timer.date]:''}}));setRecovery(false);setTab('reports');}}
  function setDayStatus(date,status){
    if(data.withdrawn||date>iso()||weekOf(date,data.start)==null||data.timer?.date===date)return;
    const rows=data.sessions.filter(s=>s.date===date);if((status==='none'&&rows.length)||(status==='complete'&&!rows.length))return;
    commit(d=>({...d,days:{...d.days,[date]:status}}));
  }
  function exportFile(kind){
    if(kind==='scales'&&(!ENABLE_RESEARCH_SCALES||DEMO))return;
    const d=ref.current;const name=`${d.demo?'DEMO_':''}${kind==='raw'?'Ham_Veri':kind==='summary'?'Ogrenci_Ozet':'Olcek_Verileri'}_${d.code}_${iso()}.csv`;
    downloadCSV(name,kind==='raw'?rawExport(d):kind==='summary'?summaryExport(d):scalesExport(d));setMessage(L('CSV indirme başlatıldı: ','CSV download started: ')+name);
  }
  function withdraw(){if(window.confirm(L('Araştırmadan ayrılmak istediğine emin misin? Yeni kayıt durur. Önceki verilerin silinmesini araştırma ekibinden isteyebilirsin.','Withdraw from the study? New entries stop. You may request deletion of earlier data from the research team.'))){commit(d=>({...d,withdrawn:true,timer:null,withdrawnAt:new Date().toISOString()}));setTab('reports');}}
  const s=data.timer;const timerView=s&&!recovery?advanceTimer(s,clock):s;
  const shell=(children)=><div className="min-h-screen bg-slate-50 text-slate-900 font-sans"><main className="max-w-xl mx-auto p-4 pb-28 space-y-4"><header className="flex items-start justify-between gap-2"><div><div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{L('Odak ve Çalışma Koçu','Focus & Study Coach')} · v{VERSION}</div><h1 className="text-2xl font-black">{data.code?`${L('Merhaba','Hello')}, ${data.code}`:L('Hoş geldin','Welcome')}</h1>{data.code&&<div className="text-xs text-slate-500">{data.group===1?'Grup A':'Grup B'} · {data.start} – {end}</div>}</div><button className={secondary} onClick={()=>commit(d=>({...d,lang:en?'tr':'en'}))}>{en?'TR':'EN'}</button></header>{DEMO&&<div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 font-semibold">{L('DEMO MODU — Gerçek araştırma verisi değildir.','DEMO MODE — Not real study data.')}</div>}{error&&<div role="alert" className="bg-red-50 border border-red-300 text-red-800 p-3 rounded-xl">{error}</div>}{message&&<div role="status" className="bg-indigo-50 text-indigo-800 p-3 rounded-xl text-sm">{message}</div>}{children}</main></div>;
  if(!CONFIG_OK)return shell(<div className={card}>RESEARCH_START_DATE geçerli bir YYYY-MM-DD tarihi olmalıdır.</div>);
  if(!data.code)return shell(<div className={card}><p className="text-sm text-slate-600">{L('Araştırmacının verdiği katılımcı kodunu ve grup kodunu kullan. Adını, okulunu veya kişisel bilgilerini yazma.','Use the participant and group codes assigned by the researcher. Do not enter your name, school or personal details.')}</p><label className="block text-sm font-bold">{L('Katılımcı kodu','Participant code')}<input className={field} value={code} onChange={e=>setCode(e.target.value)} placeholder="O001" maxLength={24}/></label><div className="grid grid-cols-2 gap-2">{[1,2].map(g=><button key={g} className={group===g?btn:secondary} onClick={()=>setGroup(g)}>{g===1?'Grup A':'Grup B'}</button>)}</div><label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>{L('Araştırma bilgilendirmesini okudum; gerekli izin ve veli onamı sağlandı. Gönüllü olarak katılmak istiyorum.','I have read the study information; required permissions and parental consent are in place. I wish to participate voluntarily.')}</label><button className={btn+' w-full'} disabled={!/^[A-Za-z0-9_-]{2,24}$/.test(code.trim())||!group||!consent||!!error} onClick={register}>{L('Devam et','Continue')}</button><p className="text-xs text-slate-500">{L('Kod ve grup ilk kayıtla sabitlenir. Veriler bu tarayıcıda saklanır; başka cihazlarla otomatik eşitlenmez.','Code and group are locked on registration. Data are stored in this browser, not synced across devices.')}</p></div>);
  if(preNeeded&&!error)return shell(<ScaleForm key="pre" phase="pre" L={L} onSave={(a,b)=>saveScale('pre',a,b)} onSkip={()=>saveScale('pre',null,null,true)}/>);
  if(postNeeded&&!error)return shell(<><ScaleForm key="post" phase="post" L={L} onSave={(a,b)=>saveScale('post',a,b)} onSkip={()=>saveScale('post',null,null,true)}/><button className={secondary} onClick={()=>exportFile('raw')}>{L('Çalışma kayıtlarını yedekle','Back up study records')}</button></>);
  if(!data.guide&&!data.withdrawn&&!after&&!error)return shell(<div className={card}><h2 className="font-black text-xl">{L('Nasıl kullanılır?','How to use')}</h2><p>{L('1. Üç haftalık, gerçekçi ve sayılabilir bir çıktı hedefi belirle.','1. Choose a realistic, countable output goal for three weeks.')}</p>{exp&&<p>{L('2. WOOP: Hedefini belirle, en iyi sonucu zihninde canlandır, içsel engelini fark et ve “Eğer… o zaman…” planı yaz.','2. WOOP: Wish, visualize the best outcome, identify your inner obstacle and make an if–then plan.')}</p>}<p>{L('Çalışmaya başlamadan süreyi planla. Dikkatin dağıldığında ilgili kategoriye bas; planlı molalarda mola düğmesini kullan.','Plan the study block before starting. Tap the relevant category when distracted; use the break button for planned breaks.')}</p><p>{L('Her oturum sonunda odak puanını ve gerçek çıktı miktarını gir. Haftanın sonunda kayıt kapsamını kontrol edip CSV dosyalarını yedekle.','After each session enter focus rating and actual output. Check coverage and back up CSV files weekly.')}</p><button className={btn+' w-full'} onClick={()=>commit(d=>({...d,guide:true}))}>{L('Uygulamaya başla','Start using the app')}</button></div>);
  const info=data.goal;const {weeks,st,full,rows}=summarize(data,today);
  const allowGoal=!data.withdrawn&&!after&&!preMissing&&!error&&!data.timer;
  const allowStudy=during&&!!info&&!data.withdrawn&&!preMissing&&!error;
  const goalForm=<div className={card}><h2 className="font-black text-lg">{editing?L('MCII planını güncelle','Update MCII plan'):L('Üç haftalık hedefini oluştur','Create your three-week goal')}</h2>{!editing&&<><label className="block text-sm font-bold">{L('Hedefin (Wish)','Your wish')}<input className={field} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder={L('Örn. 300 matematik sorusu çözmek','E.g. solve 300 math questions')}/></label><label className="block text-sm font-bold">{L('Ölçüm birimi','Output unit')}<select className={field} value={form.metric} onChange={e=>setForm({...form,metric:e.target.value})}>{Object.entries(METRICS).map(([k,v])=><option key={k} value={k}>{v[en?1:0]}</option>)}</select></label><label className="block text-sm font-bold">{L('21 gün içinde gerçekleştirmeyi hedeflediğin miktar','Target output during 21 days')}<input className={field} type="number" min="1" step="1" value={form.target} onChange={e=>setForm({...form,target:e.target.value})}/></label><p className="text-xs text-slate-500">{L('Başlangıç 0; bitiş tarihi: ','Baseline 0; deadline: ')}{end}. {L('Sayısal hedef kaydedildikten sonra değiştirilemez.','Numeric goal cannot be changed after saving.')}</p></>}{exp&&<>{[['outcome',L('Outcome — En iyi sonucu zihninde canlandır','Outcome — visualize the best outcome')],['obstacle',L('Obstacle — En önemli içsel engelin','Obstacle — your main inner obstacle')],['ifText',L('Plan — Eğer…','Plan — If…')],['thenText',L('O zaman…','Then…')]].map(([k,label])=><label key={k} className="block text-sm font-bold">{label}<textarea className={field} rows={2} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></label>)}<p className="text-xs text-slate-500">{L('Bu metinler cihazında kalır; araştırma CSV dosyalarına eklenmez.','These texts stay on your device and are not included in study CSVs.')}</p></>}<div className="flex gap-2"><button className={btn} onClick={saveGoal} disabled={!allowGoal}>{L('Kaydet','Save')}</button>{editing&&<button className={secondary} onClick={()=>setEditing(false)}>{L('Vazgeç','Cancel')}</button>}</div></div>;
  const goalView=<>{before&&<div className={card}>{L('Çalışma oturumları ortak başlangıç tarihinde açılacaktır.','Study sessions open on the common start date.')} {data.start}</div>}{!info&&allowGoal&&goalForm}{info&&<div className={card}><h2 className="font-black text-xl">{info.title}</h2><div className="flex justify-between text-sm"><span>{METRICS[info.metric]?.[en?1:0]}</span><strong>{info.current} / {info.target}</strong></div><div className="bg-slate-100 rounded-full h-3 overflow-hidden"><div className="bg-indigo-600 h-3" style={{width:`${Math.min(100,goalPct(info)||0)}%`}}/></div><p className="font-bold text-indigo-700">%{shown(goalPct(info),2)} {L('hedef gerçekleşmesi','goal attainment')}</p>{exp&&<div className="bg-emerald-50 rounded-xl p-3 text-sm space-y-2"><p><strong>Outcome: </strong>{info.outcome}</p><p><strong>Obstacle: </strong>{info.obstacle}</p><p><strong>{L('Eğer','If')}:</strong> {info.ifText}</p><p><strong>{L('O zaman','Then')}:</strong> {info.thenText}</p>{allowGoal&&<button className={secondary} onClick={editPlan}>{L('MCII planını güncelle','Update MCII plan')}</button>}</div>}<button className={btn+' w-full'} disabled={!allowStudy} onClick={()=>{setMessage('');setTab('timer');}}>{L('Çalışmaya başla','Start studying')}</button></div>}{editing&&goalForm}</>;
  const anchors=en?['Very difficult to focus','Often struggled to sustain focus','Focused intermittently','Focused for most of the session','Maintained focus almost throughout']:['Çalışmaya odaklanmakta çok zorlandım.','Dikkatimi sürdürmekte sık sık zorlandım.','Zaman zaman odaklanabildim.','Oturumun büyük bölümünde odaklandım.','Oturum boyunca dikkatimi büyük ölçüde korudum.'];
  const timerPage=!s?<div className={card}><h2 className="text-lg font-black">{L('Çalışma oturumu','Study session')}</h2><label className="block text-sm font-bold">{L('Ders veya konu','Subject or topic')}<input className={field} value={subject} onChange={e=>setSubject(e.target.value)} /></label><label className="block text-sm font-bold">{L('Planlanan toplam blok (dakika)','Planned total block (minutes)')}<input className={field} type="number" min="1" max="720" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label><p className="text-xs text-slate-500">{L('Planlanan toplam süre dolunca blok otomatik biter. Molalar ve dikkat kesintileri aktif süreye eklenmez.','The block ends at its planned duration. Breaks and interruptions do not count as active time.')}</p>{exp&&info&&<div className="bg-indigo-50 p-3 rounded-xl text-sm"><strong>{L('MCII hatırlatması','MCII reminder')}</strong><p>{L('Eğer','If')} {info.ifText}, {L('o zaman','then')} {info.thenText}</p></div>}<button className={btn+' w-full'} disabled={!allowStudy} onClick={startSession}>{L('Kronometreyi başlat','Start timer')}</button></div>:recovery?<div className={card}><h2 className="font-black">{L('Yarım kalan oturum bulundu','Unfinished session found')}</h2><p className="text-sm">{L('Son kayıt anından bu yana önceki çalışma/mola durumun gerçekten devam etti mi? Hayır ise son kayıt noktasında oturumu bitir; bilinmeyen süre eklenmez.','Did the previous study/break state really continue since the last save? If not, finish at the last saved time without adding unknown time.')}</p><button className={btn} onClick={()=>restore(true)}>{L('Evet, devam etti','Yes, it continued')}</button><button className={secondary} onClick={()=>restore(false)}>{L('Hayır, son kayıtta bitir','No, end at last save')}</button><button className={secondary} onClick={discardSession}>{L('Oturumu iptal et','Discard session')}</button></div>:s.mode==='ended'?<div className={card}><h2 className="font-black text-xl">{L('Oturum sonu değerlendirme','Post-session evaluation')}</h2><p className="text-sm">{L('Aktif süre','Active time')}: <strong>{fmt(s.activeMs)}</strong> · {L('Kesinti','Interruptions')}: {countCuts(s)}</p><fieldset><legend className="font-bold text-sm">{L('Bu çalışma oturumunda ne düzeyde odaklanabildin?','How focused were you during this study session?')}</legend><div className="grid grid-cols-5 gap-2 mt-2">{Array.from({length:10},(_,i)=>i+1).map(n=><button key={n} className={rating===n?btn:secondary} onClick={()=>setRating(n)} aria-pressed={rating===n}>{n}</button>)}</div><div className="text-xs space-y-1 mt-3">{anchors.map((a,i)=><p key={i}><strong>{i*2+1}–{i*2+2}:</strong> {a}</p>)}</div></fieldset><label className="block text-sm font-bold">{L('Bu oturumda gerçekleştirdiğin çıktı miktarı (ilerleme olmadıysa 0 yaz)','Output completed in this session (enter 0 if none)')} · {METRICS[s.metric]?.[en?1:0]}<input className={field} type="number" min="0" step="1" value={progress} onChange={e=>setProgress(e.target.value)}/></label>{exp&&<fieldset><legend className="font-bold text-sm">{L('Bu oturumda kişisel engelinle karşılaştığında MCII planını uyguladın mı?','When you faced your personal obstacle, did you apply your MCII plan?')}</legend>{[['yes',L('Evet, uyguladım','Yes')],['partial',L('Kısmen uyguladım','Partially')],['no',L('Hayır, uygulamadım','No')],['not_encountered',L('Engelimle karşılaşmadım','Did not encounter obstacle')]].map(([v,l])=><label key={v} className="block p-2 text-sm"><input type="radio" name="fidelity" checked={fidelity===v} onChange={()=>setFidelity(v)}/> {l}</label>)}</fieldset>}<button className={btn+' w-full'} onClick={saveSession} disabled={rating==null||!isInteger(progress,0)||(exp&&!fidelity)||!!error}>{L('Kaydet ve raporu gör','Save and view report')}</button><button className={secondary} onClick={discardSession}>{L('Oturumu iptal et','Discard session')}</button></div>:<div className={card}><div className="text-center"><div className="text-xs text-slate-500">{L('Aktif çalışma süresi','Active study time')}</div><div className="text-5xl font-black tabular-nums text-indigo-600">{fmt(timerView.activeMs)}</div><div className="text-sm mt-2">{L('Geçen blok','Elapsed block')} {fmt(timerView.totalMs)} / {fmt(s.plannedMs)}</div><div className="text-xs text-slate-500">{L('Planlı mola','Planned break')} {fmt(timerView.breakMs)} · {L('Dikkat kesintisi','Distraction')} {fmt(timerView.cutMs)}</div></div><div className="bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-indigo-600 h-2" style={{width:`${timerView.totalMs/s.plannedMs*100}%`}}/></div>{s.mode==='running'?<><p className="font-bold text-sm">{L('Dikkatin dağıldığında ilgili nedeni işaretle','Select the reason whenever distracted')}</p><div className="grid grid-cols-2 gap-2">{Object.entries(CATS).map(([k,v])=><button key={k} className={secondary} onClick={()=>transition('cut',k)}>{v[en?1:0]} · {s.counts[k]}</button>)}</div><button className={secondary+' w-full'} onClick={()=>transition('break')}>{L('Planlı mola ver','Take a planned break')}</button></>:<><div className="bg-amber-50 rounded-xl p-3 text-sm"><strong>{s.mode==='break'?L('Planlı mola','Planned break'):CATS[s.category]?.[en?1:0]}</strong>{s.mode==='cut'&&exp&&info&&<><p className="font-bold mt-2">{L('Kişisel MCII planın','Your personal MCII plan')}</p><p>{L('Eğer','If')} {info.ifText}, {L('o zaman','then')} {info.thenText}</p><p className="text-xs mt-1">{L('Engelin uygunsa planını kullan.','Use your plan if the obstacle applies.')}</p></>}</div><button className={btn+' w-full'} onClick={()=>transition('running')}>{L('Çalışmaya dön ve başlat','Return to study and resume')}</button></>}<button className={secondary+' w-full'} onClick={()=>transition('ended')}>{L('Oturumu bitir','End session')}</button></div>;
  const exportButtons=<div className={card}><h2 className="font-black">{L('Araştırma verilerini dışa aktar','Export research data')}</h2><p className="text-xs text-slate-500">{L('Her hafta yedekle. Dosyalar tüm kayıtları içerir; yalnızca son dosya analizde kullanılmalı. Tam dönem analiz alanları, günlerin tümü doğrulanmadan boş kalır; kayıtlı değerler ayrı sütunlardadır. Excel için noktalı virgül ve ondalık virgül sabittir.','Back up weekly. Files contain all records; use the final export for analysis. CSV uses semicolons and decimal commas.')}</p><button className={btn+' w-full'} onClick={()=>exportFile('raw')}>{L('Ham veri CSV — oturumlar','Raw CSV — sessions')}</button><button className={btn+' w-full'} onClick={()=>exportFile('summary')}>{L('Öğrenci özet CSV — SPSS','Participant summary CSV — SPSS')}</button>{ENABLE_RESEARCH_SCALES&&!DEMO&&<button className={secondary+' w-full'} onClick={()=>exportFile('scales')}>{L('Ölçek verileri CSV','Scale data CSV')}</button>}</div>;
  const dayLabels={complete:L('Tüm çalışmam kaydedildi','All study logged'),none:L('Hiç çalışmadım','No study'),partial:L('Kayıt eksik / uygulama dışında çalıştım','Incomplete / studied outside app'),unknown:L('Henüz belirtilmedi','Not confirmed')};
  const reportPage=<>{exportButtons}<div className={card}><h2 className="font-black text-lg">{L('Kayıtlı çalışma özeti','Recorded study summary')}</h2><div className="grid grid-cols-2 gap-3">{[[L('Aktif süre (dk)','Active minutes'),round(st.active/60000)],[L('Süre gerçekleşmesi (%)','Time attainment (%)'),st.rate],[L('Hedef gerçekleşmesi (%)','Goal attainment (%)'),goalPct(info)],[L('Saat başına kesinti','Interruptions/hour'),st.perHour],[L('Odak ortalaması /10','Mean focus /10'),st.ratings],[L('Oturum','Sessions'),rows.length]].map(([label,v])=><div key={label} className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-500">{label}</p><p className="text-xl font-black text-indigo-700">{shown(v,2)}</p></div>)}</div>{exp&&<p className="text-sm">{L('MCII planı uygulama düzeyi','MCII plan application')}: {st.fidelity==null?'—':`%${shown(st.fidelity,2)}`} · {st.encountered} {L('engelle karşılaşılan oturum','sessions with obstacle')}</p>}<p className="text-xs text-slate-500">{full?L('21 günlük kayıt kapsamı doğrulandı.','21-day coverage confirmed.'):L('Henüz tüm günler doğrulanmadı. Bu değerler yalnızca kayıtlı oturumlara aittir.','Not all days confirmed. Values refer only to recorded sessions.')}</p></div><div className={card}><h2 className="font-black">{L('Haftalık gelişim','Weekly progress')}</h2><ChartBars title={L('Aktif çalışma (dk)','Active study (min)')} values={weeks.map(w=>w.rows.length||w.complete?w.active/60000:null)}/><ChartBars title={L('Odaklanma puanı','Focus rating')} values={weeks.map(w=>w.ratings)}/><ChartBars title={L('Saat başına dikkat kesintisi','Interruptions/hour')} values={weeks.map(w=>w.perHour)}/><div className="overflow-x-auto"><table className="w-full text-xs text-left"><thead><tr className="border-b"><th>{L('Hafta','Week')}</th><th>{L('Oturum','Sessions')}</th><th>{L('Aktif dk','Active min')}</th><th>{L('Odak','Focus')}</th><th>{L('Onaylı gün','Confirmed')}</th></tr></thead><tbody>{weeks.map((w,i)=><tr key={i} className="border-b"><td>{i+1}</td><td>{w.rows.length}</td><td>{shown(w.rows.length||w.complete?w.active/60000:null)}</td><td>{shown(w.ratings)}</td><td>{w.confirmed}/7</td></tr>)}</tbody></table></div></div><div className={card}><h2 className="font-black">{L('Günlük kayıt ve kapsam kontrolü','Daily records and coverage check')}</h2><p className="text-xs text-slate-500">{L('Gün bittikten sonra doğru seçeneği işaretle. Oturum yoksa bunun gerçekten çalışmadığın anlamına gelip gelmediğini belirt. Eksik kayıt sıfır değildir.','After each day, confirm coverage. No session does not automatically mean no study. Missing records are not zero.')}</p><div className="grid grid-cols-3 gap-2">{[1,2,3].map(w=><button key={w} className={w===dayWeek?btn:secondary} onClick={()=>setDayWeek(w)}>{w}. {L('hafta','week')}</button>)}</div>{Array.from({length:7},(_,i)=>addDays(data.start,(dayWeek-1)*7+i)).map(date=>{const dr=rows.filter(x=>x.date===date);const z=stats(dr);return <div key={date} className="border-t pt-2 text-xs space-y-1"><div className="flex justify-between"><strong>{date}</strong><span>{dr.length} {L('oturum','sessions')} · {shown(dr.length?z.active/60000:null)} dk</span></div><select className={field} aria-label={`${date} ${L('kayıt durumu','coverage')}`} value={dayCoverage(data,date)} disabled={date>today||data.withdrawn||!!error||s?.date===date} onChange={e=>setDayStatus(date,e.target.value==='unknown'?'':e.target.value)}><option value="unknown">{dayLabels.unknown}</option>{dr.length>0&&<option value="complete">{dayLabels.complete}</option>}{!dr.length&&<option value="none">{dayLabels.none}</option>}<option value="partial">{dayLabels.partial}</option></select></div>;})}<ChartBars title={L('Seçili haftanın günlük aktif süreleri (dk)','Daily active minutes, selected week')} labels={Array.from({length:7},(_,i)=>addDays(data.start,(dayWeek-1)*7+i).slice(5))} values={Array.from({length:7},(_,i)=>{const date=addDays(data.start,(dayWeek-1)*7+i);const r=rows.filter(x=>x.date===date);return r.length?stats(r).active/60000:dayCoverage(data,date)==='none'?0:null;})}/><ChartBars title={L('Seçili haftanın günlük odak puanı','Daily focus rating, selected week')} labels={Array.from({length:7},(_,i)=>addDays(data.start,(dayWeek-1)*7+i).slice(5))} values={Array.from({length:7},(_,i)=>stats(rows.filter(x=>x.date===addDays(data.start,(dayWeek-1)*7+i))).ratings)}/><ChartBars title={L('Günlük saat başına dikkat kesintisi','Daily interruptions per active hour')} labels={Array.from({length:7},(_,i)=>addDays(data.start,(dayWeek-1)*7+i).slice(5))} values={Array.from({length:7},(_,i)=>stats(rows.filter(x=>x.date===addDays(data.start,(dayWeek-1)*7+i))).perHour)}/></div><div className={card}><h2 className="font-black">{L('Dikkat kesintilerinin dağılımı','Interruption distribution')}</h2>{Object.entries(CATS).map(([k,v])=><div key={k} className="flex justify-between text-sm"><span>{v[en?1:0]}</span><strong>{st.categories[k]} ({shown(ratio(st.categories[k],st.cuts))}%)</strong></div>)}</div><div className={card}><h2 className="font-black">{L('Derslere ve günün saatlerine göre kayıtlar','Records by subject and time of day')}</h2><p className="text-xs text-slate-500">{L('Yalnızca kayıtlı oturumların betimsel özeti; kişisel öneri sunulmaz.','Descriptive summary of recorded sessions; no personalized recommendations.')}</p>{[...new Set(rows.map(r=>r.subject))].map(k=>{const q=stats(rows.filter(r=>r.subject===k));return <div key={k} className="border-b text-xs py-2"><strong>{k}</strong><p>{shown(q.active/60000)} dk · {shown(q.perHour)} {L('kesinti/saat','interruptions/hour')} · {shown(q.ratings)} /10</p></div>;})}{[[0,6,L('Gece','Night')],[6,12,L('Sabah','Morning')],[12,18,L('Öğleden sonra','Afternoon')],[18,24,L('Akşam','Evening')]].map(([a,b,label])=>{const rs=rows.filter(r=>{const h=new Date(r.startedISO).getHours();return h>=a&&h<b;});const q=stats(rs);return <div key={a} className="flex justify-between text-xs"><span>{label} ({a}–{b})</span><span>{rs.length} {L('oturum','sessions')} · {shown(q.perHour)} {L('kesinti/saat','interruptions/hour')}</span></div>;})}</div><div className={card}><h2 className="font-black">{L('Oturum geçmişi','Session history')}</h2>{[...rows].reverse().map(r=><div key={r.id} className="border-b border-slate-100 pb-2 text-sm"><strong>{r.date} · {r.subject}</strong><p className="text-xs text-slate-500">{fmt(r.activeMs)} {L('aktif','active')} · {countCuts(r)} {L('kesinti','cuts')} · {L('odak','focus')} {r.rating}/10 · +{r.progress} {METRICS[r.metric]?.[en?1:0]}</p></div>)}{!rows.length&&<p className="text-sm text-slate-500">{L('Henüz oturum yok.','No sessions yet.')}</p>}</div></>;
  return shell(<>{after&&<div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-sm font-bold">{L('21 günlük araştırma süresi tamamlandı. Yeni oturum oluşturulamaz; kayıtlarını kontrol et ve CSV dosyalarını indir.','The 21-day study has ended. No new sessions; check records and download CSV files.')}</div>}{data.withdrawn&&<div className={card}>{L('Araştırmadan ayrıldın. Yeni kayıt alınmaz.','You withdrew. No new data are collected.')}</div>}{preMissing&&<div className={card}>{L('Ön test zamanında alınmamış. Geçmiş kayıtların korunur; araştırmacıyla iletişime geç.','Pretest was not completed in time. Existing records are retained; contact the researcher.')}</div>}{s?timerPage:tab==='reports'?reportPage:tab==='timer'?timerPage:goalView}{!s&&<><div className="flex flex-wrap gap-2 text-xs"><button className={secondary} onClick={()=>setShowGuide(!showGuide)}>{L('Kullanım bilgisi','Usage information')}</button>{!data.withdrawn&&<button className={secondary} onClick={withdraw}>{L('Araştırmadan ayrıl','Withdraw from study')}</button>}{DEMO&&<button className={secondary} onClick={()=>{if(window.confirm('Demo kayıtları silinsin mi? Gerçek araştırma kayıtları etkilenmez.')){localStorage.removeItem(STORAGE_KEY);window.location.reload();}}}>{L('Demoyu sıfırla','Reset demo')}</button>}</div>{showGuide&&<div className={card}><p className="text-sm">{L('Tek cihaz ve tek tarayıcı sekmesi kullan. Tarayıcı verilerini silme. Haftalık CSV yedeği al. Kimlik bilgilerini yazma. Kayıtların yerel saklanır; araştırma ekibi yalnızca teslim edilen dosyaları alır.','Use one device and one tab. Do not clear browser data. Back up CSV weekly. Do not enter identifiers. Records stay local; researchers receive only delivered files.')}</p></div>}<nav className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white border-t border-slate-200 p-3 grid grid-cols-3 gap-2">{[['goal',L('Hedef','Goal')],['timer',L('Çalış','Study')],['reports',L('Raporlar','Reports')]].map(([k,l])=><button key={k} className={tab===k?btn:secondary} onClick={()=>{setTab(k);setMessage('');}}>{l}</button>)}</nav></>}</>);
}

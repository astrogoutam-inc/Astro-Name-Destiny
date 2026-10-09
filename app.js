(function(){
'use strict';
const $=id=>document.getElementById(id);
const CHALDEAN={A:1,I:1,J:1,Q:1,Y:1,B:2,K:2,R:2,C:3,G:3,L:3,S:3,D:4,M:4,T:4,E:5,H:5,N:5,X:5,U:6,V:6,W:6,O:7,Z:7,F:8,P:8};
const GRID=[4,9,2,3,5,7,8,1,6];
const PLANETS={1:'Sun',2:'Moon',3:'Jupiter',4:'Rahu',5:'Mercury',6:'Venus',7:'Ketu',8:'Saturn',9:'Mars'};
const MASTER_NUMBERS=[11,22,33];

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function reduce(n){n=Math.abs(Number(n));if(!Number.isFinite(n))return null;while(n>9)n=String(n).split('').reduce((a,d)=>a+Number(d),0);return n;}
function chaldean(name){return String(name||'').toUpperCase().replace(/[^A-Z]/g,'').split('').reduce((a,c)=>a+(CHALDEAN[c]||0),0);}
function parseNums(s){return String(s||'').split(',').map(x=>Number(x.trim())).filter(n=>n>=1&&n<=9);}
function unique(a){return [...new Set(a)];}
function kingData(n){return (window.MASTER&&window.MASTER.king&&window.MASTER.king[String(n)])||{};}

function box(title,body){return `<div class="source-box"><b style="color:#ffd700;">${esc(title)}</b><br>${body}</div>`;}
function masterNumberNote(n,label){
  const value=Number(n);
  if(!MASTER_NUMBERS.includes(value))return '';
  const info=(window.MASTER_NUMBERS_DATA||{})[value]||{};
  return `<div class="highlight-line good master-number-note" style="border:1.5px solid var(--gold);"><b style="color:#ffd700; font-size:15px;">⭐ Master Number ${value}${info.title?' — '+esc(info.title):''}</b><br><span style="color:#ffd700; font-weight:700;">${esc(info.text||'Traditional numerology interpretation for this master compound number.')}</span></div>`;
}

const PURPOSE_CRYSTALS={
'Wealth & Prosperity':{crystal:'Green Aventurine + Citrine',focus:'abundance, clearing blocks and attracting money-oriented energy.'},
'Relationships':{crystal:'Rose Quartz Bracelet',focus:'love, emotional healing and relationship/heart balance.'},
'Job Success':{crystal:'Green Aventurine or Citrine Bracelet',focus:'confidence, opportunity and career growth.'},
'Business Growth':{crystal:'Iron Pyrite',focus:'business success, protection from loss and stronger money/business energy.'},
'Focus & Education':{crystal:'Lapis Lazuli Bracelet',focus:'memory, intellect, concentration and study focus.'},
'Investments':{crystal:'Amazonite Bracelet',focus:'financial clarity and intuitive decision-making.'},
'Mental Wellness':{crystal:'Amethyst Bracelet',focus:'calmness, stress reduction and emotional balance.'},
'Protection':{crystal:'Black Tourmaline Bracelet',focus:'protection from negativity and unwanted energy.'},
'Health & Energy':{crystal:'7 Chakra Lava Bracelet',focus:'chakra balancing, vitality and energy support.'},
'Confidence':{crystal:'Tiger Eye Bracelet',focus:'courage, decision-making, confidence and personal power.'}
};

const LOSHU_REMEDIES={
1:{focus:'Water + Sun + Red/Orange',items:['Place a fountain or aquarium in the North direction of the home.','Tie a red thread on the right wrist.','Worship the Surya Yantra.','Wear orange-coloured clothing on Sunday.','Practice Sun-related spiritual activities or show respect to the Sun.'],purpose:'Self-expression, confidence, planning and career-related energy.'},
2:{focus:'Moon + Water + Silver + White + Emotional Balance',items:['Keep a mountain picture without water in the South-West direction.','Use a Pearl or crystal mala.','Drink water from a silver glass.','Keep a pair of silver swans at home.','Offer water or milk to a Shivling.','Wear white clothes on Monday.','Donate rice, sugar or other white food items.','Keep an earthen pot in the South-West direction.'],purpose:'Emotional sensitivity, patience, relationship/family harmony and mental calmness.'},
3:{focus:'Jupiter/Guru + Wood + Education/Knowledge',items:['Keep green plant scenery in the East direction of the home.','Use a Tulsi Mala.','Wear or use a 5 Mukhi Rudraksha.','Use wooden objects at home, such as a wooden table, wooden glass or bamboo.','Respect elderly people and teachers.','Use a saffron tilak on the forehead.','Keep Bamboo, Money Plant or other green plants in the East direction.'],purpose:'Knowledge, confidence, creativity, learning and Guru energy.'},
4:{focus:'Wood + Greenery + Discipline + Stability',items:['Use a Tulsi Mala or 5 Mukhi Rudraksha.','Perform the source-based remedy of donating two coconuts (Do Nariyal Daan).','Keep the home and surroundings clean and organised.','Keep green plants or green scenery in the South-East direction.','Use wooden objects at home.','Show respect to and help labour/working-class people.'],purpose:'Organisation, discipline, practicality, stability and wealth-related energy balance.'},
5:{focus:'Mercury + Communication + Centre of House + Earth/Crystal',items:['Use a Quartz crystal.','Avoid keeping electric or electronic items in the centre of the house.','Keep a mountain picture without water in the centre of the house.','Practice a Mercury mantra.','Keep a green handkerchief with you.','Feed green fodder to a cow on Wednesday.'],purpose:'Communication, adaptability, business sense, financial balance and decision-making.'},
6:{focus:'Venus + Metal/Gold + Family/Luxury Energy',items:['Keep metal coins as a source-based remedy.','Show respect to women.','Gift cosmetics to a married woman.','Keep a 6-rod golden wind chime in the North-West direction.','Use a watch or bracelet with a golden chain/band.'],purpose:'Family happiness, marriage, luxury, money, relationships and Venus energy balance.'},
7:{focus:'Ketu/Spirituality + Silver + Dogs',items:['Use a watch or bracelet with a silver chain/band.','Keep a 7-rod silver wind chime in the West direction.','Help or feed dogs.','Give bread with jaggery to dogs as a source-based remedy.','Worship Lord Ganesha.'],purpose:'Spirituality, intuition, independence, mental peace and obstacle balancing.'},
8:{focus:'Saturn + Stability + Financial Discipline + North-East + Charity',items:['Keep crystals in the North-East direction.','Keep a water-filled Kalash in the North-East direction.','Distribute salty food as a source-based remedy.','Show respect to and help poor, labouring or financially weaker people.','Keep your surroundings clean and organised.'],purpose:'Decision-making, financial stability, discipline, completion of work and long-term stability.'},
9:{focus:'Mars + Fire + Red Colour + Hanuman',items:['Keep a fire picture in the South direction.','Use a red bulb or red light in the South direction.','Tie a red thread on the right wrist.','Visit a Hanuman Temple.','Recite the Hanuman Chalisa.'],purpose:'Courage, energy, willpower, recognition, fame and action-oriented energy balance.'}
};

function dobInfo(d,m,y){
  d=Number(d);m=Number(m);y=Number(y);
  if(!d||!m||!y||d<1||d>31||m<1||m>12||y<1900||y>2100)return null;
  const dt=new Date(y,m-1,d);if(dt.getFullYear()!==y||dt.getMonth()!==m-1||dt.getDate()!==d)return null;
  
  const masterMul = [11, 22].includes(d) ? d : null;
  let sumB = d + m + y;
  while(sumB > 9 && ![11, 22, 33].includes(sumB)) {
    sumB = String(sumB).split('').reduce((a,x)=>a+Number(x),0);
  }
  const masterBhag = [11, 22, 33].includes(sumB) ? sumB : null;

  return {
    day: d, month: m, year: y, 
    mulank: reduce(d), 
    bhagyank: reduce(sumB), 
    masterMulank: masterMul, 
    masterBhagyank: masterBhag
  };
}

function relation(a,b){
  const k=kingData(a), lucky=parseNums(k.lucky), enemy=parseNums(k.enemy), hard=parseNums(k.hard_core), neutral=parseNums(k.neutral);
  if(hard.includes(b))return 15;
  if(enemy.includes(b))return 25;
  if(lucky.includes(b))return 100;
  if(neutral.includes(b))return 60;
  const combo=(window.DATA&&window.DATA[`${a}-${b}`])||{};
  const comboLucky=parseNums(combo.lucky_numbers);
  if(comboLucky.includes(b))return 100;
  if(comboLucky.includes(a))return 85;
  return 55;
}

function mutual(a,b){return Math.round((relation(a,b)+relation(b,a))/2);}
function colourClass(score){if(score>=75)return'good';if(score>=50)return'mid';return'bad';}
function label(score){return score>=75?'VERY FAVOURABLE':score>=50?'MODERATE / PARTIALLY FAVOURABLE':'UNFAVOURABLE';}
function scoreBadge(score){return `<span class="badge ${colourClass(score)}">${Math.round(score)}% · ${label(score)}</span>`;}
function dateDigits(d){return String(d.day)+String(d.month)+String(d.year).replace(/^0+/,'');}
function gridCounts(digits){const c={};for(let n=1;n<=9;n++)c[n]=0;for(const ch of String(digits).replace(/\D/g,'')){const n=Number(ch);if(n>=1&&n<=9)c[n]++;}return c;}
function renderGrid(counts, mobileAdded){let html='<div class="loshu"><div class="loshu-grid">';for(const n of GRID){const count=counts[n]||0;const added=mobileAdded&&mobileAdded[n];html+=`<div class="loshu-cell ${count?'present':'empty'} ${added?'mobile-supported':''}"><strong>${count? n:''}</strong>${count?`<small>×${count}</small>`:''}${added?'<em>📱 MOBILE</em>':''}</div>`;}return html+'</div></div>';}
function gridReport(dob,mobile){const birth=gridCounts(dateDigits(dob));const mob=gridCounts(mobile);const missing=GRID.filter(n=>!birth[n]);const supported=missing.filter(n=>mob[n]>0);const still=missing.filter(n=>mob[n]===0);return{birth,mob,missing,supported,still};}
function normalizePairDigits(raw){return String(raw||'').replace(/\D/g,'').replace(/0/g,'');}
function scanPairs(raw){const d=normalizePairDigits(raw),out=[];for(let i=0;i<d.length-1;i++){const key=d.slice(i,i+2);if(window.MOBILE_MASTER&&window.MOBILE_MASTER[key]&&!out.includes(key))out.push(key);}return out;}
function pairScore(raw){const keys=scanPairs(raw);if(!keys.length)return{score:50,keys:[],positive:[],negative:[]};let sum=0,positive=[],negative=[];for(const k of keys){const p=MOBILE_MASTER[k];if(p.status==='positive'){sum+=p.text.includes('Highly Favourable')||p.text.includes('Dhan Yog')||['19','91','29','92','37','73','57','75'].includes(k)?100:82;positive.push(k);}else if(p.status==='mixed'){sum+=55;}else if(p.status==='negative'){sum+=15;negative.push(k);}else sum+=60;}return{score:Math.round(sum/keys.length),keys,positive,negative};}
function professionTokens(prof){return (window.PROFESSIONS&&PROFESSIONS[prof])||[];}
function professionAlignment(prof,mu,bh){
  const tokens=professionTokens(prof);
  const candidates=tokens.map(t=>({token:String(t),root:reduce(String(t).replace(/\D/g,'').split('').reduce((a,d)=>a+Number(d),0))})).filter(x=>x.root>=1&&x.root<=9);
  if(!candidates.length)return{score:0,mulank:0,bhagyank:0,bestToken:null};
  const muScores=candidates.map(x=>({x,s:mutual(x.root,mu)})).sort((a,b)=>b.s-a.s||a.x.token.localeCompare(b.x.token));
  const bhScores=candidates.map(x=>({x,s:mutual(x.root,bh)})).sort((a,b)=>b.s-a.s||a.x.token.localeCompare(b.x.token));
  const mulank=muScores[0].s,bhagyank=bhScores[0].s;
  const score=Math.round((mulank+bhagyank)/2);
  const best=[muScores[0].x.token,bhScores[0].x.token].filter((v,i,a)=>a.indexOf(v)===i).join(' / ');
  return{score,mulank,bhagyank,bestToken:best};
}
function renderLuckyProfession(mu,bh){
  const rows=Object.keys(window.PROFESSIONS||{}).map(prof=>({prof,...professionAlignment(prof,mu,bh)})).sort((a,b)=>b.score-a.score||a.prof.localeCompare(b.prof));
  const top=rows.slice(0,5), primary=rows.slice(0,3);
  const pill=(r,i)=>`<div class="career-card ${i===0?'career-top':''}"><div class="career-rank">${i+1}</div><div class="career-main"><b>${esc(r.prof)}</b><span>Alignment ${scoreBadge(r.score)}</span><small>Mulank ${r.mulank}% · Bhagyank ${r.bhagyank}% · Best source number: <b style="color:#ffd700;">${esc(r.bestToken||'—')}</b></small></div></div>`;
  return `<div class="highlight-line good"><b>💼 Lucky Profession / Career Guidance:</b> Based on your Mulank ${mu} and Bhagyank ${bh}, the highest alignments are ranked below.</div><div class="career-list">${top.map(pill).join('')}</div><div class="source-box"><b style="color:#ffd700;">⭐ Top 3 Overall Recommendations:</b> <b style="color:#ffd700;">${primary.map((r,i)=>`${i+1}. ${esc(r.prof)}`).join(' &nbsp; · &nbsp; ')}</b></div>`;
}
function tokenPresent(raw,token){const d=normalizePairDigits(raw);return d.includes(String(token).replace(/0/g,''));}
function professionMatch(raw,prof){const tokens=professionTokens(prof),matchTokens=tokens.filter(t=>String(t).replace(/\D/g,'').length>=2),digitTokens=tokens.filter(t=>String(t).replace(/\D/g,'').length===1),foundPairs=matchTokens.filter(t=>tokenPresent(raw,t)),foundDigits=digitTokens.filter(t=>tokenPresent(raw,t)),found=unique([...foundPairs,...foundDigits]),score=matchTokens.length?Math.min(100,Math.round(foundPairs.length/matchTokens.length*100)):Math.min(100,foundDigits.length?60:0);return{tokens,matchTokens,digitTokens,foundPairs,foundDigits,found,score};}
function mobileDobScore(totalRoot,mu,bh){return Math.round((mutual(totalRoot,mu)+mutual(totalRoot,bh))/2);}
function recommendedTotals(mu,bh){const combo=(window.DATA&&window.DATA[`${mu}-${bh}`])||{};const direct=parseNums(combo.lucky_numbers).filter(n=>n!==8);if(direct.length)return unique(direct);const a=kingData(mu),b=kingData(bh);const la=parseNums(a.lucky),lb=parseNums(b.lucky);return unique([...la,...lb]).filter(n=>n!==8);}
function nameScore(total,root,mu,bh,combo){let s1=mutual(root,mu),s2=mutual(root,bh);let comp=combo&&combo.lucky_name_numbers?String(combo.lucky_name_numbers).split(',').map(x=>x.trim()):[];let compound=comp.includes(String(total))?100:(comp.includes(String(root))?75:40);return Math.round((s1+s2+compound)/3);}
function companyNameScore(total,root,mu,bh,combo){let s1=mutual(root,mu),s2=mutual(root,bh);let comp=combo&&combo.lucky_business_name_numbers?String(combo.lucky_business_name_numbers).split(',').map(x=>x.trim()).filter(Boolean):[];let roots=comp.map(x=>reduce(x)).filter(Boolean);let compound=comp.includes(String(total))?100:(roots.includes(root)?75:40);return Math.round((s1+s2+compound)/3);}
function companyRecommendations(combo){let raw=combo&&combo.lucky_business_name_numbers?String(combo.lucky_business_name_numbers).split(',').map(x=>x.trim()).filter(Boolean):[];let nums=[...new Set(raw)].filter(x=>reduce(x)!==8&&Number(x)!==8);let roots=[...new Set(nums.map(x=>reduce(x)).filter(Boolean).filter(r=>r!==8))];return {compounds:nums.slice(0,8),roots:roots.slice(0,8)};}
function renderCompany(name,total,root,mu,bh,combo,score){let rec=companyRecommendations(combo);return `<div class="highlight-line ${colourClass(score)}"><b>Overall Company Name Compatibility:</b> ${scoreBadge(score)}</div><div class="two-col"><div><b>Company Name:</b> ${esc(name)}<br><b>Chaldean Company Compound:</b> ${total}<br><b>Company Root:</b> ${root}<br><b>Company ↔ Mulank:</b> ${scoreBadge(mutual(root,mu))}<br><b>Company ↔ Bhagyank:</b> ${scoreBadge(mutual(root,bh))}</div><div><b style="color:#ffd700;">Recommended Business Compounds:</b><div class="big-list">${rec.compounds.length?rec.compounds.join(', '):'No specific list'}</div><b style="color:#ffd700;">Recommended Roots:</b><div class="big-list">${rec.roots.length?rec.roots.join(', '):'No specific list'}</div></div></div><div class="source-box"><b>Notice:</b> Number 8 is strictly excluded from recommendations under corporate consultancy doctrine.</div>`;}
function renderPositionGuide(){const rows=[['1','Self / Personality'],['2','Decision-Making'],['3','Career & Government'],['4','Business Relations'],['5','Children / Offspring'],['6','Family Harmony'],['7','Marriage & Love'],['8','Health & Vitality'],['9','Public Relations'],['10','Wealth & Retention']];return `<div class="position-guide">${rows.map(r=>`<div><b>${r[0]}</b><span>${r[1]}</span></div>`).join('')}</div><div class="source-box"><b style="color:#ffd700;">Directive:</b> The 10th slot governs Wealth & Retention. Strongly recommended to terminate on <b style="color:#ffd700;">5, 6, 9</b> or Dhan Yog pairs <b style="color:#ffd700;">29, 37, 73, 92</b>.</div>`;}
function vehicleScore(raw,mu,bh,prof){const ps=pairScore(raw),pm=professionMatch(raw,prof),dob=scanPairs(raw).length?Math.round((ps.score+mobileDobScore(reduce(String(raw).replace(/\D/g,'').split('').reduce((a,d)=>a+Number(d),0)),mu,bh))/2):50;return Math.round((ps.score*0.45+pm.score*0.25+dob*0.30));}
function generateVehicleSuggestions(prof,mu,bh){const tokens=professionTokens(prof).filter(x=>String(x).length>=2);const pairs=tokens.filter(x=>String(x).length===2);const good=pairs.filter(k=>MOBILE_MASTER[k]&&MOBILE_MASTER[k].status==='positive');const seeds=unique([...good,...['29','92','37','73','19','91','15','51'].filter(k=>MOBILE_MASTER[k]&&MOBILE_MASTER[k].status==='positive')]);const out=[];for(const p of seeds){for(const tail of ['19','29','37','51','69','73','91','92']){const n=(p+tail).slice(-4);const keys=scanPairs(n);if(keys.some(k=>MOBILE_MASTER[k]&&MOBILE_MASTER[k].status==='negative'))continue;const ps=pairScore(n);if(ps.score>=65&&!out.includes(n))out.push(n);if(out.length>=6)return out;}}return out.slice(0,6);}

// Separate Candidate Matching for Mulank and Bhagyank to accurately populate Avoid lists
function candidateScore(candidate, targetNum){
  return mutual(candidate, targetNum);
}

function renderPartner(mu,bh){
  const mulankArr=[], bhagyankArr=[];
  for(let n=1;n<=9;n++){
    mulankArr.push({n, s: candidateScore(n, mu)});
    bhagyankArr.push({n, s: candidateScore(n, bh)});
  }
  mulankArr.sort((a,b)=>b.s-a.s || a.n-b.n);
  bhagyankArr.sort((a,b)=>b.s-a.s || a.n-b.n);
  
  const mSuitable = mulankArr.filter(x => x.s >= 75);
  const mAvoid = mulankArr.filter(x => x.s < 50);
  const bSuitable = bhagyankArr.filter(x => x.s >= 75);
  const bAvoid = bhagyankArr.filter(x => x.s < 50);

  const pills=(arr,cls)=>arr.length?arr.map(x=>`<span class="${cls}">${x.n} · ${x.s}%</span>`).join(''):'<span class="empty-pill" style="color:#fca5a5;">None in conflict</span>';

  return `<div class="partner-summary">
    <div class="partner-basis">
      <b>Your Chart:</b> Mulank ${mu} · Bhagyank ${bh}<br>
      <small>Suitable = 75%+ · Moderate = 50–74% · Avoid = below 50% (Hardcore Planetary Enemies)</small>
    </div>
  </div>
  <div class="partner-grid">
    <div><h4>❤️ Life Partner – Suitable Mulank</h4><div class="number-pills">${pills(mSuitable,'suitable-pill')}</div></div>
    <div><h4>❤️ Life Partner – Suitable Bhagyank</h4><div class="number-pills">${pills(bSuitable,'suitable-pill')}</div></div>
    <div class="avoid-panel"><h4>⚠️ Life Partner – Mulank to Avoid</h4><div class="number-pills">${pills(mAvoid,'avoid-pill')}</div></div>
    <div class="avoid-panel"><h4>⚠️ Life Partner – Bhagyank to Avoid</h4><div class="number-pills">${pills(bAvoid,'avoid-pill')}</div></div>
    <div><h4>💼 Business Partner – Suitable Mulank</h4><div class="number-pills">${pills(mSuitable,'suitable-pill')}</div></div>
    <div><h4>💼 Business Partner – Suitable Bhagyank</h4><div class="number-pills">${pills(bSuitable,'suitable-pill')}</div></div>
    <div class="avoid-panel"><h4>⚠️ Business Partner – Mulank to Avoid</h4><div class="number-pills">${pills(mAvoid,'avoid-pill')}</div></div>
    <div class="avoid-panel"><h4>⚠️ Business Partner – Bhagyank to Avoid</h4><div class="number-pills">${pills(bAvoid,'avoid-pill')}</div></div>
  </div>
  <div class="source-box">
    <b>Partner Law:</b> Planetary friendship matrix filters natural friends vs natural rivals. Numbers scoring below 50% carry sharp friction and are placed in the Avoid lists.
  </div>`;
}

function renderTop(scores){let html='';for(const s of scores){const cls=s.available===false?'mid':colourClass(s.score);const value=s.available===false?'—':`${Math.round(s.score)}%`;html+=`<div class="score-card-top ${cls}"><div>${esc(s.title)}</div><strong>${value}</strong><span>${s.available===false?'NOT PROVIDED':label(s.score)}</span></div>`;}return html;}

function renderDob(dob,combo,dobScore){
  const lucky=combo.lucky_numbers||'—';
  const rootCryst = (window.ROOT_CRYSTALS && window.ROOT_CRYSTALS[dob.mulank]) || {};
  let html=`<div class="mini-grid">
    <div><small>Mulank</small><strong>${dob.mulank}</strong><em>${PLANETS[dob.mulank]}</em></div>
    <div><small>Bhagyank</small><strong>${dob.bhagyank}</strong><em>${PLANETS[dob.bhagyank]}</em></div>
    <div><small>Mulank ↔ Bhagyank</small><strong>${scoreBadge(dobScore)}</strong></div>
  </div>`;
  
  if(dob.masterMulank || dob.masterBhagyank){
    const mVal = dob.masterBhagyank || dob.masterMulank;
    const info = (window.MASTER_NUMBERS_DATA||{})[mVal] || {};
    html += `<div class="highlight-line good" style="border: 1.5px solid var(--gold);"><b style="color:#ffd700; font-size:16px;">⭐ Master Number ${mVal} Detected:</b> ${esc(info.title||'')} <br><span style="color:#ffd700; font-weight:700;">${esc(info.text||'')}</span></div>`;
  }

  html += `<div class="source-box">
    <b>Traditional Ruler:</b> ${esc(combo.ruling||'—')}<br>
    <b>Lucky Numbers:</b> <b style="color:#ffd700; font-size:15px;">${esc(lucky)}</b><br>
    <b>Lucky Days:</b> <b style="color:#ffd700; font-size:15px;">${esc(combo.lucky_days||'—')}</b><br>
    <b>Lucky Colours:</b> <b style="color:#ffd700; font-size:15px;">${esc(combo.lucky_colors||'—')}</b><br>
    <b>Lucky Gemstone Remedy:</b> <b style="color:#ffd700; font-size:16px;">${esc(combo.lucky_gems||'—')}</b><br>
    <b>Recommended Root Crystal:</b> <b style="color:#ffd700; font-size:16px;">${esc(rootCryst.crystal||'—')}</b> <span style="color:#ffd700; font-weight:700;">(${esc(rootCryst.benefit||'')})</span>
  </div>`;
  return html;
}

function renderMobileDob(raw,total,root,mu,bh,prof){
  const rec=recommendedTotals(mu,bh),score=mobileDobScore(root,mu,bh);
  let verdict=score>=75?'Your mobile total/root is favourable with your Mulank & Bhagyank.':score>=50?'Your mobile has partial DOB compatibility.':'Your mobile number does not favourably match your Mulank/Bhagyank.';
  return `<div class="highlight-line ${colourClass(score)}"><b>${verdict}</b> ${scoreBadge(score)}</div>${masterNumberNote(total,'Mobile Total')}<div class="two-col"><div><b>Mobile Total:</b> ${total} → Root ${root}<br><b>Mobile ↔ Mulank:</b> ${scoreBadge(mutual(root,mu))}<br><b>Mobile ↔ Bhagyank:</b> ${scoreBadge(mutual(root,bh))}</div><div><b style="color:#ffd700;">Recommended Mobile Total / Root:</b><div class="big-list">${rec.join(', ')||'No common total listed'}</div></div></div>`;
}

function renderProfession(raw,prof,mu,bh){const pm=professionMatch(raw,prof), tokens=pm.tokens, matchTokens=pm.matchTokens, found=pm.found, missing=matchTokens.filter(t=>!found.includes(t));const dobOK=mobileDobScore(reduce(String(raw).split('').reduce((a,d)=>a+Number(d),0)),mu,bh)>=50;let verdict;if(found.length&&dobOK)verdict='Profession + Mobile pair match found, subject to Mulank/Bhagyank compatibility.';else if(found.length&&!dobOK)verdict='Profession pair found, but Mulank/Bhagyank compatibility is not fully favourable.';else verdict='No recommended profession pair was found in the current mobile number.';return `<div class="highlight-line ${colourClass(found.length&&dobOK?80:found.length?55:25)}"><b>${verdict}</b> ${scoreBadge(found.length?Math.max(55,pm.score):25)}</div><p><b>Your Profession:</b> ${esc(prof)}</p><p><b>Profession Recommended Numbers / Pairs:</b> <b style="color:#ffd700;">${tokens.map(esc).join(', ')}</b></p><p><b>Found in Current Mobile:</b> <b style="color:#ffd700;">${found.length?found.map(esc).join(', '):'None'}</b></p>${missing.length?`<p><b>Recommended for a Future Mobile:</b> <b style="color:#ffd700;">${missing.map(esc).join(', ')}</b></p>`:''}`; }

function renderName(name,total,root,mu,bh,combo,score){const comp=combo.lucky_name_numbers||'';return `<div class="highlight-line ${colourClass(score)}"><b>Name ↔ DOB compatibility:</b> ${scoreBadge(score)}</div>${masterNumberNote(total,'Name Compound')}<div class="two-col"><div><b>Chaldean Name Compound:</b> ${total}<br><b>Name Root:</b> ${root}</div><div><b style="color:#ffd700;">Lucky Name Numbers for this combination:</b><div class="big-list">${esc(comp||'No specific list')}</div></div></div>`;}

function renderPairs(raw){const keys=scanPairs(raw);const ps=pairScore(raw);if(!keys.length)return'<div class="no-data">No documented pair remains after applying the 0-value rule.</div>';return `<div class="highlight-line ${colourClass(ps.score)}"><b>Pair quality:</b> ${scoreBadge(ps.score)}</div><div class="pair-list">${keys.map(k=>{const p=MOBILE_MASTER[k];const cls=p.status==='positive'?'positive':p.status==='negative'?'negative':'neutral';return `<div class="pair ${cls}"><div class="pair-head"><b>${k}</b><span>${p.status.toUpperCase()}</span></div><p style="font-weight:600;">${esc(p.text)}</p></div>`}).join('')}</div>`;}

function renderVehicle(raw,prof,mu,bh){const score=vehicleScore(raw,mu,bh,prof),pm=professionMatch(raw,prof),suggest=generateVehicleSuggestions(prof,mu,bh),keys=scanPairs(raw);return `<div class="highlight-line ${colourClass(score)}"><b>Vehicle Last 4 Digits Luck:</b> ${scoreBadge(score)}</div><p><b>Vehicle Last 4 Digits:</b> ${esc(raw)} &nbsp; <b>Effective Pairs:</b> ${keys.length?keys.join(', '):'None'}</p><div class="source-box"><b style="color:#ffd700;">Recommended Vehicle Numbers for your Profession:</b><div class="big-list">${suggest.length?suggest.join(' · '):'No candidate generated'}</div></div>`;}

function renderLoShu(dob,mobile){const g=gridReport(dob,mobile);const supportMap={};g.supported.forEach(n=>supportMap[n]=true);return `<div class="grid-caption"><b>Birth Lo-Shu</b><br>${renderGrid(g.birth,{})}<div class="missing-box"><b>Missing Numbers:</b> ${g.missing.length?g.missing.join(', '):'None'}</div></div><div class="grid-caption"><b>DOB + Mobile Supported Lo-Shu</b><br>${renderGrid(Object.fromEntries(GRID.map(n=>[n,(g.birth[n]||0)+(g.mob[n]||0)])),supportMap)}<div class="missing-box"><b>Missing numbers supported by Mobile:</b> ${g.supported.length?g.supported.join(', '):'None'}<br><b>Still Missing after Mobile:</b> ${g.still.length?g.still.join(', '):'None'}</div></div>`;}

function renderPurposeRecommendations(selected){
  if(!selected.length)return '';
  const cards=selected.map(p=>{
    const r=PURPOSE_CRYSTALS[p];
    return `<div class="purpose-remedy-card">
      <div class="purpose-remedy-title" style="color:#ffd700;">${esc(p)}</div>
      <div><b>Recommended Crystal:</b> <span class="purpose-crystal" style="color:#ffd700; font-size:16px; font-weight:900;">${esc(r.crystal)}</span></div>
      <div class="source-box"><b style="color:#ffd700;">Traditional Focus:</b> <span style="color:#ffd700; font-weight:700;">${esc(r.focus)}</span></div>
    </div>`;
  }).join('');
  return `<div class="highlight-line good"><b>Selected Concerns:</b> ${selected.map(esc).join(', ')}</div>${cards}`;
}
function getSelectedPurposes(){return Array.from(document.querySelectorAll('input[name="purpose"]:checked')).map(x=>x.value);}

// Lo-Shu Remedies in Bold Gold
function renderLoShuRemedies(dob,mobile){
  const g=gridReport(dob,mobile);
  if(!g.still.length){return `<div class="highlight-line good"><b>Still Missing after Mobile:</b> None. No remedies required!</div>`;}
  let html=`<div class="missing-box"><b style="color:#ffd700;">Still Missing after Mobile:</b> ${g.still.join(', ')}</div>`;
  html+=g.still.map(n=>{
    const r=LOSHU_REMEDIES[n];
    return `<div class="remedy-card" style="border-left: 4px solid #ffd700;">
      <h4 style="color:#ffd700; font-size:19px;">Missing Number ${n} — Remedial Action (${esc(r.focus)})</h4>
      <ol style="color:#ffd700; font-weight:800; font-size:14px; margin-left:22px;">
        ${r.items.map(x=>`<li style="margin:5px 0;">${esc(x)}</li>`).join('')}
      </ol>
      <div class="source-box"><b style="color:#ffd700;">Harmonizing Purpose:</b> <span style="color:#ffd700; font-weight:700;">${esc(r.purpose)}</span></div>
    </div>`;
  }).join('');
  return html;
}

function renderCombo(combo,mu,bh){return `<div class="details-grid"><div class="detail"><span>Ruling Combination</span><strong>${esc(combo.ruling||'—')}</strong></div><div class="detail"><span>Lucky Numbers</span><strong style="color:#ffd700;">${esc(combo.lucky_numbers||'—')}</strong></div><div class="detail"><span>Lucky Name Numbers</span><strong style="color:#ffd700;">${esc(combo.lucky_name_numbers||'—')}</strong></div><div class="detail"><span>Lucky Business Numbers</span><strong style="color:#ffd700;">${esc(combo.lucky_business_name_numbers||'—')}</strong></div></div>`;}

function initProfession(){const s=$('profession');Object.keys(window.PROFESSIONS||{}).forEach(p=>{const o=document.createElement('option');o.value=p;o.textContent=p;s.appendChild(o);});}

// Mobile Last 4 Digits - Completely highlighted in Bold Gold
function renderMobileLast4(raw){
  const suffix=String(raw||'').replace(/\D/g,'').slice(-4);
  const sum=[...suffix].reduce((a,x)=>a+Number(x),0), root=reduce(sum);
  const data=(window.MOBILE_LAST4_DATA||{})[root]||{};
  return `<div class="highlight-line good" style="border:1.5px solid var(--gold);">
    <b style="color:#ffd700; font-size:17px;">Last 4 Digits: ${esc(suffix||'—')} &nbsp;|&nbsp; Sum: ${sum} → Root Vibration: ${root} (${esc(data.archetype||'—')})</b>
  </div>
  <div class="two-col">
    <div>
      <b style="color:#ffd700; font-size:15px;">Core Manifestation & Impact:</b>
      <p style="color:#ffd700; font-weight:800; font-size:14.5px; margin-top:5px; line-height:1.5;">${esc(data.text||'No description')}</p>
    </div>
    <div>
      <b style="color:#ffd700; font-size:15px;">Optimal Industry & Role Alignment:</b>
      <div style="color:#ffd700; font-weight:800; font-size:15.5px; margin-top:5px;">${esc(data.bestFor||'General use')}</div>
    </div>
  </div>`;
}

// Health with Bold Golden Harmonizers
function renderHealth(mulank){
  const h=(window.PLANETARY_HEALTH||{})[mulank]||{};
  return `<div class="two-col">
    <div>
      <p><b>Governing Planet:</b> ${esc(h.planet||'—')}</p>
      <p><b>Vulnerable Anatomical Areas:</b><br><span style="color:#fca5a5; font-weight:700;">${esc(h.organs||'—')}</span></p>
      <p><b>Caution Months:</b> <b style="color:#ffd700;">${esc(h.cautionMonths||'—')}</b></p>
      <p><b>Milestone Warning Years:</b> <b style="color:#ffd700;">${esc(h.criticalYears||'—')}</b></p>
    </div>
    <div>
      <b style="color:#ffd700; font-size:15px;">Dietary & Herbal Harmonizing Remedies:</b>
      <div class="source-box" style="margin-top:6px; border-left:4px solid #ffd700;">
        <span style="color:#ffd700; font-weight:800; font-size:14px; line-height:1.6;">${esc(h.foods||'—')}</span>
      </div>
    </div>
  </div>
  <div class="source-box"><small>Traditional wellness lore for energetic balance. Not clinical medical advice.</small></div>`;
}

// Scents with Bold Golden Notes
function renderScents(mulank){
  const scent=(window.NUMEROLOGY_SCENTS||{})[mulank]||{};
  return `<div class="highlight-line good" style="border:1.5px solid var(--gold);">
    <b style="color:#ffd700; font-size:16px;">${esc(scent.title||'Planetary Scent')}</b> (${esc(scent.profile||'')})
  </div>
  <div class="two-col">
    <div>
      <b style="color:#ffd700; font-size:15px;">Auspicious Scent Notes & Remedies:</b>
      <div style="color:#ffd700; font-weight:800; font-size:15px; margin-top:5px;">${esc(scent.scents||'—')}</div>
    </div>
    <div>
      <b style="color:#ffd700; font-size:15px;">Aromatic Resonance Benefit:</b>
      <p style="color:#ffd700; font-weight:800; font-size:14px; margin-top:5px;">${esc(scent.benefit||'—')}</p>
    </div>
  </div>`;
}






// Horary Prashna Query Analyzer

// 3-Tier Cosmic Soulmate Engine from the Book with Bilingual Output
function renderSoulmate(pD, pM, pY, uD, uM, uY){
  if(!pD||!pM||!pY) return '<div class="source-box">Partner DOB not provided. Enter partner birth details to calculate / পার্টনারের জন্মতারিখ প্রদান করা হয়নি।</div>';
  const pDay=Number(pD), pMonth=Number(pM), pYear=Number(pY);
  const uDay=Number(uD), uMonth=Number(uM), uYear=Number(uY);
  const digitSum=n=>String(n).split('').reduce((a,x)=>a+Number(x),0);

  // Person A 3 Cosmic Values
  const uV1 = uDay;
  const uV2 = uMonth + uDay;
  const uV3 = uMonth + uDay + digitSum(uYear);

  // Person B 3 Cosmic Values
  const pV1 = pDay;
  const pV2 = pMonth + pDay;
  const pV3 = pMonth + pDay + digitSum(pYear);

  const uSet = [uV1, uV2, uV3, reduce(uV1), reduce(uV2), reduce(uV3)];
  const matches = [];

  if(uSet.includes(pV1) || uSet.includes(reduce(pV1))) matches.push(`• Partner Birth Day (${pV1}) matches User cosmic values / পার্টনারের জন্ম দিন আপনার কসমিক সংখ্যার সাথে মিলেছে।`);
  if(uSet.includes(pV2) || uSet.includes(reduce(pV2))) matches.push(`• Partner Month+Day (${pV2}) matches User cosmic values / পার্টনারের মাস+দিন আপনার কসমিক সংখ্যার সাথে মিলেছে।`);
  if(uSet.includes(pV3) || uSet.includes(reduce(pV3))) matches.push(`• Partner Cosmic Total (${pV3}) matches User cosmic values / পার্টনারের কসমিক মোট সংখ্যা আপনার সাথে মিলেছে।`);

  const isSoulmate = matches.length > 0;
  const score = isSoulmate ? 88 : 60;

  return `<div class="highlight-line ${isSoulmate?'good':'mid'}" style="border:1.5px solid ${isSoulmate?'var(--good)':'var(--gold)'};">
    <b style="font-size:16px;">${isSoulmate?'⭐ Direct Cosmic Soulmate Connection (88%) · প্রত্যক্ষ আত্মিক সোলমেট সংযোগ':'Karmic Relationship Connection (60%) · কর্মিক দায়িত্ব ও সমঝোতার সম্পর্ক'}</b>
  </div>
  <div class="two-col">
    <div>
      <b>User 3 Cosmic Values (আপনার ৩টি কসমিক মান):</b><br>
      Day: <b style="color:#ffd700;">${uV1}</b> &nbsp;|&nbsp; Month+Day: <b style="color:#ffd700;">${uV2}</b> &nbsp;|&nbsp; Cosmic Total: <b style="color:#ffd700;">${uV3}</b>
    </div>
    <div>
      <b>Partner 3 Cosmic Values (সঙ্গীর ৩টি কসমিক মান):</b><br>
      Day: <b style="color:#ffd700;">${pV1}</b> &nbsp;|&nbsp; Month+Day: <b style="color:#ffd700;">${pV2}</b> &nbsp;|&nbsp; Cosmic Total: <b style="color:#ffd700;">${pV3}</b>
    </div>
  </div>
  ${isSoulmate?`<div class="source-box" style="border-left:4px solid #22c55e;"><b style="color:#ffd700; font-size:15px;">Harmonic Matches Verified (যাচাইকৃত কসমিক মিল):</b><br><span style="color:#ffd700; font-weight:800; font-size:13.5px;">${matches.join('<br>')}</span></div>`:''}
  
  <!-- Bilingual Relationship Dynamics Box -->
  <div class="source-box" style="border-left:4px solid #ffd700; margin-top:12px;">
    <b style="color:#ffd700; font-size:15px;">Relationship Dynamics & Prediction (সম্পর্কের প্রকৃতি ও ভবিষ্যৎবাণী):</b>
    
    <!-- English Section -->
    <div style="margin-top:8px; border-bottom:1px dashed rgba(212,175,55,0.3); padding-bottom:8px;">
      <p style="color:#e2e8f0; font-size:13.5px; line-height:1.6;">
        <span style="color:#ffd700; font-weight:700;">[English]</span> ${isSoulmate 
          ? 'You and your partner share a profound soul-level vibrational resonance. You will instinctively understand each others unexpressed thoughts and serve as an unwavering anchor during emotional or financial trials.' 
          : 'This union is grounded in karmic duty and mutual life lessons. While perspectives and working rhythms may differ, mutual respect, conscious communication, and emotional patience will cultivate lasting companionship.'}
      </p>
      <div style="margin-top:5px; color:#ffd700; font-size:12.5px; font-weight:700;">
        💡 Relationship Remedy: Keep a natural Rose Quartz crystal in the bedroom and practice active listening to ensure harmonic warmth.
      </div>
    </div>

    <!-- Bengali Section -->
    <div style="margin-top:8px;">
      <p style="color:#e2e8f0; font-size:13.5px; line-height:1.6;">
        <span style="color:#ffd700; font-weight:700;">[বাংলা]</span> ${isSoulmate 
          ? 'আপনার এবং আপনার সঙ্গীর মধ্যে অত্যন্ত গভীর আত্মিক ও মানসিক টান রয়েছে। আপনারা পরস্পরের চিন্তা না বলেই বুঝতে পারবেন এবং যেকোনো পারিবারিক বা মানসিক প্রতিকূলতায় একে অপরের বড় ভরসা হয়ে উঠবেন।' 
          : 'এই সম্পর্কটি পারস্পরিক দায়িত্ব ও শিক্ষার ওপর প্রতিষ্ঠিত। দুজনের চিন্তাভাবনা ও কাজের ধরনে কিছুটা পার্থক্য থাকতে পারে, তাই ছোটখাটো মতবিরোধ এড়াতে খোলামেলা আলোচনা ও ধৈর্য বজায় রাখা জরুরি।'}
      </p>
      <div style="margin-top:5px; color:#ffd700; font-size:12.5px; font-weight:700;">
        💡 সম্পর্কের শুভ পরামর্শ: শোবার ঘরে প্রাকৃতিক রোজ কোয়ার্টজ (Rose Quartz) ক্রিস্টাল রাখুন এবং একে অপরের নিজস্ব মতামতের প্রতি পূর্ণ শ্রদ্ধা বজায় রাখুন।
      </div>
    </div>
  </div>`;
}

// Master Horizontal Remedial Blueprint (Bilingual: Bengali + English)
function renderConsolidatedRemedies(d, combo, purposes){
  const rootCryst = (window.ROOT_CRYSTALS && window.ROOT_CRYSTALS[d.mulank]) || {};
  const luckyGems = combo.lucky_gems || 'Yellow Sapphire / Blue Sapphire (as per expert recommendation)';
  const scent = (window.NUMEROLOGY_SCENTS && window.NUMEROLOGY_SCENTS[d.mulank]) || {};
  const health = (window.PLANETARY_HEALTH && window.PLANETARY_HEALTH[d.mulank]) || {};

  // Bengali purpose list
  let purposeListBN = [];
  let purposeListEN = [];
  if(purposes && purposes.length){
    purposes.forEach(p => {
      const pc = PURPOSE_CRYSTALS[p];
      if(pc){
        purposeListBN.push(`• <b>${esc(p)}:</b> <span style="color:#ffd700;">${esc(pc.crystal)}</span>`);
        purposeListEN.push(`• <b>${esc(p)}:</b> <span style="color:#ffd700;">${esc(pc.crystal)}</span>`);
      }
    });
  }

  return `
    <div style="padding: 4px 0;">
      
      <!-- BENGALI HORIZONTAL BLUEPRINT -->
      <div style="margin-bottom: 22px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
          <span style="background:rgba(212,175,55,0.2); color:#ffd700; font-size:11px; font-weight:900; padding:3px 10px; border-radius:15px; border:1px solid #ffd700;">বাংলা সংস্করণ</span>
          <span style="color:#ffffff; font-size:15px; font-weight:800;">১. বাংলা ভাষায় সার্বিক প্রতিকার ও শুভ নির্দেশনা (Bengali Blueprint)</span>
        </div>
        <p style="color:#cbd5e1; font-size:13px; margin-bottom:12px;">
          আপনার জন্মতারিখ (মূলাঙ্ক ${d.mulank}, ভাগ্যাঙ্ক ${d.bhagyank}) এবং নির্বাচিত বর্তমান সমস্যার সমাধানে ৪টি মূল প্রতিকার এক নজরে:
        </p>
        <div class="remedy-horizontal-grid">
          <!-- Col 1: Crystals -->
          <div class="remedy-col-card">
            <div>
              <div class="remedy-col-title">🔮 শুভ ক্রিস্টাল ও ব্রেসলেট</div>
              <div class="remedy-col-val">${esc(rootCryst.crystal || 'Citrine / Clear Quartz')}</div>
              <div class="remedy-col-desc">${esc(rootCryst.benefit || 'মানসিক শক্তি ও আত্মবিশ্বাস বৃদ্ধি করে।')}</div>
            </div>
            ${purposeListBN.length ? `<div style="margin-top:10px; font-size:11.5px; border-top:1px dashed rgba(212,175,55,0.3); padding-top:6px;"><b style="color:#ffd700;">লক্ষ্যভিত্তিক:</b><br>${purposeListBN.join('<br>')}</div>` : ''}
          </div>

          <!-- Col 2: Gemstone -->
          <div class="remedy-col-card">
            <div>
              <div class="remedy-col-title">💍 ভাগ্যের শুভ রত্ন</div>
              <div class="remedy-col-val">${esc(luckyGems)}</div>
              <div class="remedy-col-desc">শুভ বার ও তিথিতে উপযুক্ত ধাতুতে পরিধান করলে গ্রহের শক্তি বৃদ্ধি পায়।</div>
            </div>
          </div>

          <!-- Col 3: Perfume -->
          <div class="remedy-col-card">
            <div>
              <div class="remedy-col-title">🌸 শুভ সুগন্ধি ও পারফিউম</div>
              <div class="remedy-col-val">${esc(scent.scents || 'Sandalwood, Rose, Jasmine')}</div>
              <div class="remedy-col-desc">${esc(scent.benefit || 'আভা বা অরা শক্তিশালী করে।')}</div>
            </div>
          </div>

          <!-- Col 4: Food -->
          <div class="remedy-col-card">
            <div>
              <div class="remedy-col-title">🌿 আয়ুর্বেদিক খাদ্যাভ্যাস</div>
              <div class="remedy-col-val" style="font-size:13.5px;">${esc(health.foods || 'আমলকী, আদা, তুলসী, ডাবের জল')}</div>
              <div class="remedy-col-desc">শারীরিক ভারসাম্য ও জীবনীশক্তি বজায় রাখতে সহায়ক।</div>
            </div>
          </div>
        </div>
      </div>

      <!-- HORIZONTAL DIVIDER -->
      <div style="border-top: 1.5px dashed rgba(212,175,55,0.4); margin: 25px 0;"></div>

      <!-- ENGLISH HORIZONTAL BLUEPRINT (For Non-Bengali Clients) -->
      <div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
          <span style="background:rgba(212,175,55,0.2); color:#ffd700; font-size:11px; font-weight:900; padding:3px 10px; border-radius:15px; border:1px solid #ffd700;">ENGLISH EDITION</span>
          <span style="color:#ffffff; font-size:15px; font-weight:800;">2. Complete Remedial Harmonizing Blueprint (For Non-Bengali Clients)</span>
        </div>
        <p style="color:#cbd5e1; font-size:13px; margin-bottom:12px;">
          Comprehensive remedial recommendations based on your birth date (Mulank ${d.mulank}, Bhagyank ${d.bhagyank}) and selected life concerns:
        </p>
        <div class="remedy-horizontal-grid">
          <!-- Col 1: Crystals -->
          <div class="remedy-col-card">
            <div>
              <div class="remedy-col-title">🔮 Lucky Crystals &amp; Bracelets</div>
              <div class="remedy-col-val">${esc(rootCryst.crystal || 'Citrine / Clear Quartz')}</div>
              <div class="remedy-col-desc">${esc(rootCryst.benefit || 'Amplifies personal magnetism and mental focus.')}</div>
            </div>
            ${purposeListEN.length ? `<div style="margin-top:10px; font-size:11.5px; border-top:1px dashed rgba(212,175,55,0.3); padding-top:6px;"><b style="color:#ffd700;">Focus Remedies:</b><br>${purposeListEN.join('<br>')}</div>` : ''}
          </div>

          <!-- Col 2: Gemstone -->
          <div class="remedy-col-card">
            <div>
              <div class="remedy-col-title">💍 Auspicious Gemstone</div>
              <div class="remedy-col-val">${esc(luckyGems)}</div>
              <div class="remedy-col-desc">Wear in auspicious metal on planetary ruling day for maximum vibration.</div>
            </div>
          </div>

          <!-- Col 3: Perfume -->
          <div class="remedy-col-card">
            <div>
              <div class="remedy-col-title">🌸 Lucky Scents &amp; Aroma</div>
              <div class="remedy-col-val">${esc(scent.scents || 'Sandalwood, Rose, Jasmine')}</div>
              <div class="remedy-col-desc">${esc(scent.benefit || 'Enhances positive aura and mental clarity.')}</div>
            </div>
          </div>

          <!-- Col 4: Food -->
          <div class="remedy-col-card">
            <div>
              <div class="remedy-col-title">🌿 Dietary Harmonizers</div>
              <div class="remedy-col-val" style="font-size:13.5px;">${esc(health.foods || 'Herbal tea, citrus, ginger, barley')}</div>
              <div class="remedy-col-desc">Natural herbs and foods aligned with your governing planet.</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}


window.renderHoraryQuery = function(){
  const q = ($('horaryQuestion') && $('horaryQuestion').value.trim()) || 'General Inquiry';
  const now = new Date(), hh = now.getHours(), mm = now.getMinutes();
  const hour = (hh % 12) || 12, ten = Math.floor(mm / 10), unit = mm % 10;
  const ph = window.PRASHNA_HOUSES || {};

  // Predictive synthesis logic based on House triad:
  // Positive/Growth houses: 1, 2, 3, 5, 9, 10, 11
  // Transformative/Delay houses: 6, 8, 12, 4, 7
  const auspiciousHouses = [1, 2, 3, 5, 9, 10, 11];
  const delayHouses = [6, 8, 12];
  
  let verdictEN = '', verdictBN = '', adviceEN = '', adviceBN = '';
  let statusBadge = '';

  if (auspiciousHouses.includes(unit)) {
    statusBadge = '<span class="badge good" style="font-size:13px; padding:6px 14px;">✅ Favourable Outcome / ইতিবাচক ফলাফল (Yes)</span>';
    verdictEN = `The final resolution falls into the ${ph[unit].house}, signaling positive development, timely support, and successful fulfillment of your objective.`;
    verdictBN = `প্রশ্নের চূড়ান্ত সিদ্ধান্তটি ${ph[unit].house}-এর অধীনস্থ। এর অর্থ হলো আপনার উদ্দিষ্ট কাজে ইতিবাচক সাফল্য, সহায়তা এবং অনুকূল পরিস্থিতি তৈরি হওয়ার জোরালো সম্ভাবনা রয়েছে।`;
    adviceEN = 'Take proactive initiative now; planetary timing and external circumstances are aligned with your objective.';
    adviceBN = 'দেরি না করে সঠিক পরিকল্পনা অনুযায়ী সক্রিয় উদ্যোগ নিন; সময় ও পরিস্থিতি আপনার অনুকূলে কাজ করছে।';
  } else if (delayHouses.includes(unit)) {
    statusBadge = '<span class="badge bad" style="font-size:13px; padding:6px 14px;">⚠️ Requires Caution & Patience / ধৈর্য ও সতর্কতার প্রয়োজন</span>';
    verdictEN = `The final indicator highlights the ${ph[unit].house}, pointing toward unexpected delays, bureaucratic hurdles, or hidden friction before progress can occur.`;
    verdictBN = `প্রশ্নের চূড়ান্ত নির্দেশকটি ${ph[unit].house}-এর নির্দেশ করে। এর ফলে তাৎক্ষণিক ফল পেতে কিছুটা বাধা, বাড়তি পরিশ্রম বা সাময়িক বিলম্ব ঘটতে পারে।`;
    adviceEN = 'Avoid hasty financial or emotional decisions; verify legal/documentary details and stay patient.';
    adviceBN = 'হুট করে কোনো আর্থিক বা বড় সিদ্ধান্ত নেবেন না; নথিপত্র সতর্কতার সাথে যাচাই করুন এবং সঠিক সময়ের জন্য অপেক্ষা করুন।';
  } else {
    statusBadge = '<span class="badge mid" style="font-size:13px; padding:6px 14px;">⚖️ Balanced / Effort-Dependent / সমঝোতা ও প্রচেষ্টাসাপেক্ষ</span>';
    verdictEN = `The final house (${ph[unit].house}) reflects a dynamic scenario where success depends entirely on collaborative dialogue, clear terms, and mutual trust.`;
    verdictBN = `প্রশ্নের চূড়ান্ত ভাবটি (${ph[unit].house}) নির্দেশ করে যে ফলাফল সম্পূর্ণ সমঝোতা, সঠিক আলোচনা এবং আপনার নিজস্ব প্রচেষ্টার ওপর নির্ভরশীল।`;
    adviceEN = 'Maintain transparent communication and focus on long-term relationships rather than quick gains.';
    adviceBN = 'সরাসরি ও স্পষ্ট যোগাযোগ বজায় রাখুন এবং তাড়াহুড়ো না করে পারস্পরিক আস্থার ওপর গুরুত্ব দিন।';
  }

  $('prashnaDetails').innerHTML = `
    <div class="highlight-line good" style="border:1.5px solid var(--gold); margin-bottom:12px;">
      <b>Question (প্রশ্ন):</b> "${esc(q)}" &nbsp;|&nbsp; <b>Time:</b> ${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')} &nbsp;|&nbsp; <b>Dominance:</b> ${hour} &gt; ${ten} &gt; ${unit}
    </div>

    <!-- Direct Answer Box in Bengali & English -->
    <div class="source-box" style="border-left:4px solid #ffd700; background:rgba(212,175,55,0.08); padding:16px; margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
        <b style="color:#ffd700; font-size:16px;">🎯 Direct Question Answer & Guidance (প্রশ্নের সরাসরি উত্তর ও প্রেডিকশন):</b>
        ${statusBadge}
      </div>

      <!-- English Verdict -->
      <div style="border-bottom:1px dashed rgba(212,175,55,0.3); padding-bottom:10px; margin-bottom:10px;">
        <div style="color:#ffffff; font-size:14px; line-height:1.6;">
          <b style="color:#ffd700;">[English Verdict]:</b> ${verdictEN}
        </div>
        <div style="color:#dbeafe; font-size:13px; margin-top:5px;">
          💡 <b>Key Advice:</b> ${adviceEN}
        </div>
      </div>

      <!-- Bengali Verdict -->
      <div>
        <div style="color:#ffffff; font-size:14.5px; line-height:1.6;">
          <b style="color:#ffd700;">[বাংলা সিদ্ধান্ত]:</b> ${verdictBN}
        </div>
        <div style="color:#dbeafe; font-size:13.5px; margin-top:5px;">
          💡 <b>বাস্তব পরামর্শ:</b> ${adviceBN}
        </div>
      </div>
    </div>

    <!-- House Breakdown Triad -->
    <div class="two-col">
      ${box('Primary Subject (Hour ' + hour + ')', `<b style="color:#ffd700; font-size:15px;">${esc((ph[hour]||{}).house||'—')}</b><br><span style="color:#ffd700; font-weight:700;">${esc((ph[hour]||{}).domain||'')}</span>`)}
      ${box('Supporting Factor (Min Tens ' + ten + ')', `<b style="color:#ffd700; font-size:15px;">${esc((ph[ten]||{}).house||'—')}</b><br><span style="color:#ffd700; font-weight:700;">${esc((ph[ten]||{}).domain||'')}</span>`)}
    </div>
    ${box('Final Resolution (Min Units ' + unit + ')', `<b style="color:#ffd700; font-size:15px;">${esc((ph[unit]||{}).house||'—')}</b> — <span style="color:#ffd700; font-weight:700;">${esc((ph[unit]||{}).domain||'')}</span>`)}
  `;
};

function renderExtras(d, mobile){
  if($('mobileLast4Details')) $('mobileLast4Details').innerHTML = renderMobileLast4(mobile);
  if($('healthDetails')) $('healthDetails').innerHTML = renderHealth(d.mulank);
  if($('scentDetails')) $('scentDetails').innerHTML = renderScents(d.mulank);
  if($('soulmateDetails')){
    $('soulmateDetails').innerHTML = renderSoulmate($('p_day').value, $('p_month').value, $('p_year').value, d.day, d.month, d.year);
  }
  if($('prashnaDetails') && !$('prashnaDetails').innerHTML){
    window.renderHoraryQuery();
  }
}

function run(){
  try{
    $('error').textContent='';
    const name=$('name').value.trim(),company=$('company').value.trim(),d=dobInfo($('day').value,$('month').value,$('year').value),raw=$('mobile').value.replace(/\D/g,'').slice(0,10),prof=$('profession').value,vehicle=$('vehicle').value.replace(/\D/g,'').slice(0,4);
    const purposes=getSelectedPurposes();
    if(!name||name.replace(/[^A-Za-z]/g,'').length<2)throw new Error('Please enter a valid Name.');
    if(!d)throw new Error('Please enter a valid Date of Birth.');
    if(raw.length!==10)throw new Error('Please enter a valid 10-digit Mobile Number.');
    if(!prof)throw new Error('Please select your Profession.');
    if(vehicle&&vehicle.length!==4)throw new Error('Vehicle Number must contain exactly the last 4 digits.');

    // Google Sheets & Telegram Backend Integration
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyD4_YleyLPRbvKjX4734nlhwYQy_LAVPM6KsML2QwsyPaZOT9qyiZUqNsupw1vPQDVsw/exec";
    fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        mobile: raw,
        dob: `${String(d.day).padStart(2,'0')}/${String(d.month).padStart(2,'0')}/${d.year}`,
        profession: prof,
        company: company || 'Not Provided',
        vehicle: vehicle || 'Not Provided',
        concerns: purposes.length ? purposes.join(', ') : 'None Selected'
      })
    }).catch(() => {});


    const nt=chaldean(name),nr=reduce(nt),ct=company?chaldean(company):null,cr=company?reduce(ct):null,combo=window.DATA[`${d.mulank}-${d.bhagyank}`]||{},dobScore=mutual(d.mulank,d.bhagyank),total=[...raw].reduce((a,x)=>a+Number(x),0),root=reduce(total),mobileScore=Math.round((mobileDobScore(root,d.mulank,d.bhagyank)*0.55)+(pairScore(raw).score*0.25)+(professionMatch(raw,prof).score*0.20)),namePct=nameScore(nt,nr,d.mulank,d.bhagyank,combo),companyPct=company?companyNameScore(ct,cr,d.mulank,d.bhagyank,combo):null,vehiclePct=vehicle?vehicleScore(vehicle,d.mulank,d.bhagyank,prof):null;
    const scores=[{title:'MULANK ↔ BHAGYANK',score:dobScore},{title:'MOBILE NUMBER LUCK',score:mobileScore},{title:'NAME ↔ DOB',score:namePct},{title:'VEHICLE NUMBER LUCK',score:vehiclePct,available:!!vehicle},{title:'COMPANY NAME MATCHING',score:companyPct,available:!!company}];

    $('displayName').textContent=name;
    $('displayDob').textContent=`${String(d.day).padStart(2,'0')} / ${String(d.month).padStart(2,'0')} / ${d.year}`;
    $('displayMobile').textContent=raw;
    $('displayProfession').textContent=prof;
    $('displayCompany').textContent=company||'NOT PROVIDED';
    $('topScores').innerHTML=renderTop(scores);

    $('comboHeading').textContent=`Mulank ${d.mulank} + Bhagyank ${d.bhagyank}`;
    $('dobDetails').innerHTML=renderDob(d,combo,dobScore);
    $('careerDetails').innerHTML=renderLuckyProfession(d.mulank,d.bhagyank);
    $('mobileDobDetails').innerHTML=renderMobileDob(raw,total,root,d.mulank,d.bhagyank,prof);
    $('professionHeading').textContent=`${prof} — Profession-wise Mobile Analysis`;
    $('professionDetails').innerHTML=renderProfession(raw,prof,d.mulank,d.bhagyank);
    $('nameDetails').innerHTML=renderName(name,nt,nr,d.mulank,d.bhagyank,combo,namePct);
    $('companyDetails').innerHTML=company?renderCompany(company,ct,cr,d.mulank,d.bhagyank,combo,companyPct):'<div class="no-data">Company Name not provided.</div>';
    $('positionGuide').innerHTML=renderPositionGuide();
    $('mobilePairs').innerHTML=renderPairs(raw);

    if(vehicle){$('vehicleCard').classList.remove('hidden');$('vehicleDetails').innerHTML=renderVehicle(vehicle,prof,d.mulank,d.bhagyank);}else{$('vehicleCard').classList.add('hidden');$('vehicleDetails').innerHTML='';}

    const lo=renderLoShu(d,raw);
    const first=lo.indexOf('<div class="grid-caption">'),second=lo.indexOf('<div class="grid-caption">',first+1);
    $('birthGrid').innerHTML=lo.slice(first,second);
    $('combinedGrid').innerHTML=lo.slice(second);
    $('loshuRemedies').innerHTML=renderLoShuRemedies(d,raw);

    const purposeHtml=renderPurposeRecommendations(purposes);
    $('purposeCard').classList.toggle('hidden',!purposes.length);
    $('purposeDetails').innerHTML=purposeHtml;

    $('partnerDetails').innerHTML=renderPartner(d.mulank,d.bhagyank);
    $('detailHeading').textContent=`Mulank ${d.mulank} + Bhagyank ${d.bhagyank} — Traditional Details`;
    $('comboDetails').innerHTML=renderCombo(combo,d.mulank,d.bhagyank);
    if($('consolidatedRemediesDetails')) $('consolidatedRemediesDetails').innerHTML = renderConsolidatedRemedies(d, combo, purposes);

    $('result').classList.remove('hidden');
    renderExtras(d,raw);
    $('result').scrollIntoView({behavior:'smooth',block:'start'});
  }catch(e){
    $('error').textContent=e.message||'Unable to calculate. Please check your entries.';
    $('result').classList.add('hidden');
  }
}

function bind(){
  initProfession();
  $('checkerForm').addEventListener('submit',e=>{e.preventDefault();run();});
  ['day','month','year','mobile','vehicle','p_day','p_month','p_year'].forEach(id=>{
    const el=$(id);
    if(el){
      el.addEventListener('input',()=>{
        el.value=el.value.replace(/\D/g,'').slice(0,(id==='year'||id==='p_year')?4:id==='mobile'?10:id==='vehicle'?4:2);
        if(!$('result').classList.contains('hidden')){
          const d=dobInfo($('day').value,$('month').value,$('year').value);
          if(d) renderExtras(d,$('mobile').value);
        }
      });
    }
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();

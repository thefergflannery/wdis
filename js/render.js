function sidePartyListHTML(scored,hasAny){
  if(!hasAny)return`<p class="text-2xs text-slate-400 dark:text-slate-600 py-1.5">Answer questions to see matches</p>`;
  const list=S.showMinor?scored:scored.filter(p=>p.size!=="minor");
  return list.map(p=>`<div class="flex items-center gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0" title="${p.name}">
<span class="w-2 h-2 rounded-full shrink-0" style="background:${p.col}"></span>
<span class="text-2xs font-bold text-slate-700 dark:text-slate-300 w-7 shrink-0">${p.abbr}</span>
<div class="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div class="h-full rounded-full" style="width:${p.match}%;background:${p.col}"></div>
</div>
<span class="text-2xs font-medium text-slate-500 dark:text-slate-400 w-7 text-right shrink-0 tabular-nums">${p.match}%</span>
</div>`).join("");
}

function resultTop5HTML(top5){
  return top5.map((p,i)=>`<div class="rounded-2xl border p-5 mb-3 ${i===0?"bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800":"bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"}">
<div class="flex justify-between items-start mb-3">
<div class="flex items-center gap-2 flex-wrap">
<span class="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style="background:${p.col}"></span>
<span class="text-base font-semibold text-slate-900 dark:text-slate-100">${p.url?`<a href="${p.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;hover:underline">${p.name}</a>`:p.name}</span>
${p.size==="minor"?`<span class="text-2xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">minor</span>`:""}
${i===0?`<span class="text-2xs font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full">Best match</span>`:""}
</div>
<span class="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums ml-3 shrink-0">${p.match}%</span>
</div>
<div class="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
<div class="h-full rounded-full" style="width:${p.match}%;background:${p.col};transition:width .7s ease"></div>
</div>
<p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${p.desc}</p>
</div>`).join("");
}

function resultAllPartiesHTML(list){
  return list.map((p,i)=>`<div class="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
<span class="text-2xs text-slate-400 dark:text-slate-600 w-5 text-right shrink-0 tabular-nums">${i+1}</span>
<span class="w-2 h-2 rounded-full shrink-0" style="background:${p.col}"></span>
<span class="text-sm text-slate-700 dark:text-slate-300 flex-1">${p.url?`<a href="${p.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${p.name}</a>`:p.name}${p.size==="minor"?`<span class="ml-1.5 text-2xs font-medium px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full">minor</span>`:""}</span>
<div class="w-20 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0">
<div class="h-full rounded-full" style="width:${p.match}%;background:${p.col}"></div>
</div>
<span class="text-xs font-semibold text-slate-600 dark:text-slate-400 w-8 text-right shrink-0 tabular-nums">${p.match}%</span>
</div>`).join("");
}

function sideAxisHTML(axes){
  if(!axes||!Object.keys(axes).length)return`<p class="text-2xs text-slate-400 dark:text-slate-600 py-1.5">No data yet</p>`;
  return Object.entries(axes).map(([ax,v])=>{
    const isL=v<0;
    const lbl=v<-1.5?"Str. left":v<-0.5?"Left":v>1.5?"Str. right":v>0.5?"Right":"Centre";
    const pct=Math.max(0,Math.min(100,50+Math.round((v/3)*50)));
    const fillStyle=isL?`left:${pct}%;width:${50-pct}%;background:#93c5fd;opacity:.7`:`left:50%;width:${pct-50}%;background:#fcd34d;opacity:.7`;
    return`<div class="flex items-center gap-2 mb-2 last:mb-0">
<span class="text-2xs text-slate-500 dark:text-slate-400 w-16 shrink-0 truncate">${AXLABELS[ax]||ax}</span>
<div class="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-visible">
<div class="absolute top-0 h-full rounded-full" style="${fillStyle}"></div>
<div class="absolute left-1/2 top-[-2px] bottom-[-2px] w-px bg-slate-300 dark:bg-slate-600" style="transform:translateX(-50%)"></div>
</div>
<span class="text-2xs text-slate-400 dark:text-slate-600 w-14 text-right shrink-0">${lbl}</span>
</div>`;
  }).join("");
}

function legendHTML(){
  return`<div class="text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-3">Party key - all 20 parties</div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-bottom:28px">${PARTIES.map(p=>`<div class="flex items-start gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
<div class="text-xs font-bold shrink-0 w-9 pt-px" style="color:${p.col}">${p.abbr}</div>
<div>
<div class="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">${p.url?`<a href="${p.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${p.name}</a>`:p.name}${p.size==="minor"?`<span class="ml-1 text-2xs font-medium px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full">minor</span>`:""}</div>
<div class="text-2xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">${p.desc}</div>
</div></div>`).join("")}</div>`;
}

function headerHTML(){
  return`<div class="sticky top-0 z-50 bg-slate-50 dark:bg-slate-950">
<div class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-2 flex gap-3 items-center overflow-hidden">
<span class="tick-tag tick-live shrink-0" id="tick-tag">LIVE</span>
<span class="text-xs text-slate-500 dark:text-slate-400 truncate flex-1 tick-text" id="tick-text">Loading...</span>
<span class="text-2xs text-slate-400 dark:text-slate-600 shrink-0 tabular-nums">20 Apr 2026</span>
</div>
<nav class="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800">
<button onclick="go('intro')" class="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-0 p-0">Where Do I Stand<span style="color:#6366f1">?</span></button>
<div class="flex gap-2">
<button id="theme-btn" onclick="themeToggle()" class="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full hover:border-slate-400 dark:hover:border-slate-500 transition-colors cursor-pointer">${S.dark?"☀ Light":"☾ Dark"}</button>
</div>
</nav>
</div>`;
}

function renderIntro(){
  $id("root").innerHTML=headerHTML()+`<div class="px-5 pt-10 pb-16 max-w-2xl">
<p class="text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-5">Republic of Ireland · Political Compass · April 2026</p>
<h1 class="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-none mb-5" style="letter-spacing:-.03em">Where do you<br>stand?</h1>
<p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-3">All 20 registered Irish parties mapped against real policy positions.</p>
<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 mb-8 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">This tool is not politically affiliated. Built to help you cut through the noise and map your own views against the policies parties actually stand for.</div>
<div class="flex gap-3 mb-10" style="flex-wrap:wrap">
<button onclick="startQuiz('quick')" class="flex-1 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-left hover:border-slate-400 dark:hover:border-slate-500 transition-all cursor-pointer" style="min-width:160px">
<div class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Quick</div>
<div class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">10 questions · ~3 min</div>
<div class="text-xs text-slate-400 dark:text-slate-600">One question per topic - fast overview</div>
</button>
<button onclick="startQuiz('full')" class="flex-1 rounded-2xl p-5 text-left transition-all cursor-pointer" style="min-width:160px;background:#4f46e5;border:2px solid #4f46e5">
<div class="text-xl font-bold text-white mb-1">Full</div>
<div class="text-sm font-semibold mb-1.5" style="color:#c7d2fe">56 questions · ~15 min</div>
<div class="text-xs" style="color:#a5b4fc">All topics in depth - most accurate result</div>
</button>
</div>
<hr class="border-slate-200 dark:border-slate-800 mb-8">
${legendHTML()}
<div class="mb-2">
<div class="text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-3">Topics covered</div>
<div class="flex flex-wrap gap-1.5">${CATS.map(c=>`<span class="text-2xs font-medium px-3 py-1 rounded-full border ${c==="Fuel & Cost of Living"?"bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800":"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"}">${c}</span>`).join("")}</div>
</div>
</div>`;
  applyTheme();startTicker();
}

function renderQuiz(){
  const qs=activeQS();
  const cat=CATS[S.cat];
  const catQs=qs.filter(q=>q.cat===cat);
  const axes=computeAxes(S.answers);
  const scored=matchParties(axes);
  const done=Object.keys(S.answers).length;
  const catDone=catQs.every(q=>S.answers[q.id]!==undefined);
  const hasAny=done>0;
  const modeLbl=S.mode==="quick"?`<span class="text-2xs font-bold px-2.5 py-0.5 rounded-full ml-2" style="background:#fffbeb;color:#b45309;border:1px solid #fde68a">Quick mode</span>`:``;

  const catBtns=CATS.map((c,i)=>{
    const cqs=qs.filter(q=>q.cat===c);
    if(!cqs.length)return"";
    const cd=cqs.every(q=>S.answers[q.id]!==undefined);
    let cls="px-3 py-1.5 rounded-full text-2xs font-semibold border transition-all cursor-pointer whitespace-nowrap ";
    if(i===S.cat)cls+="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100";
    else if(cd)cls+="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    else cls+="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500";
    return`<button class="${cls}" onclick="setCat(${i})">${cd?"✓ ":""}${c}</button>`;
  }).join("");

  const qCards=catQs.map(q=>{
    const v=S.answers[q.id];const ans=v!==undefined;
    const tc=n=>{if(v!==n)return"tap-btn";if(n<0)return"tap-btn neg";if(n>0)return"tap-btn pos";return"tap-btn neu";};
    return`<div class="bg-white dark:bg-slate-900 border rounded-2xl p-5 mb-4 transition-colors ${ans?"border-slate-300 dark:border-slate-600":"border-slate-200 dark:border-slate-800"}" id="card-${q.id}">
<p class="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3 leading-snug">${q.text}</p>
<div class="rounded-xl px-4 py-3 mb-4 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400" style="border-left:3px solid #cbd5e1">${q.explain}</div>
<div class="text-center text-xs font-medium mb-2 min-h-5 ${ans?"text-slate-700 dark:text-slate-300":"text-slate-400 dark:text-slate-600"}" id="ans-${q.id}">${ans?VLABELS[String(v)]:"Select your position below"}</div>
<div class="flex justify-between text-2xs text-slate-400 dark:text-slate-600 mb-1.5 px-0.5"><span>Strongly disagree</span><span>Strongly agree</span></div>
<div class="flex gap-1.5">${[-2,-1,0,1,2].map(n=>`<button id="btn-${q.id}-${n}" class="${tc(n)}" onclick="setAns(${q.id},${n})">${BLABELS[String(n)]}</button>`).join("")}</div>
</div>`;
  }).join("");

  const notice=cat==="Fuel & Cost of Living"?`<div class="rounded-xl px-4 py-3 mb-4 text-sm leading-relaxed" style="background:#fffbeb;color:#92400e;border:1px solid #fde68a"><strong class="font-semibold">Context, April 2026:</strong> Farmer and haulier blockades began April 7 after diesel +28%. Over 600 stations ran dry. Govt announced €755m tax cuts April 13-14. SF tabled a no-confidence motion; coalition survived 92-78.</div>`:"";

  const liveBox=S.hideCompass
    ?`<p class="text-2xs text-slate-400 dark:text-slate-600 text-center py-4 leading-relaxed">Results hidden<br><span style="opacity:.7">Revealed at the end</span></p>`
    :`<div class="text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-2">Compass</div>
<canvas id="compass-canvas" class="w-full rounded-xl"></canvas>
<div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
<div class="flex items-center justify-between mb-2">
<span class="text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Party matches</span>
<button id="minor-toggle-btn" onclick="toggleMinor()" class="text-2xs font-semibold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${S.showMinor?"border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400":"border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600"}">${S.showMinor?"Hide minor":"Show minor"}</button>
</div>
<div id="party-list-box">${sidePartyListHTML(scored,hasAny)}</div>
</div>`;

  $id("root").innerHTML=headerHTML()+`<div class="h-0.5 bg-slate-200 dark:bg-slate-800"><div id="pbar" class="h-full" style="width:${Math.round((done/qs.length)*100)}%;background:#6366f1;transition:width .3s ease"></div></div>
<div class="px-5 pt-5 pb-16">
<div class="flex gap-2 flex-wrap mb-5">${catBtns}</div>
<div class="flex gap-6 items-start">
<div class="w-60 shrink-0 sticky sidebar-scroll" style="top:84px;max-height:calc(100vh - 104px);overflow-y:auto;display:flex;flex-direction:column;gap:10px">
<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
<div class="flex items-center justify-between mb-3">
<span class="text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Live results</span>
<button id="compass-toggle-btn" onclick="toggleCompass()" class="text-2xs font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${S.hideCompass?"border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600":"border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400"}" style="${S.hideCompass?"":"background:#eef2ff"}">${S.hideCompass?"Show":"Hide"}</button>
</div>
<div id="live-results-box">${liveBox}</div>
</div>
<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
<div class="text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-3">By issue</div>
<div id="axis-box">${sideAxisHTML(axes)}</div>
</div>
</div>
<div class="flex-1 min-w-0">
${notice}
<div class="flex items-baseline gap-2 mb-1 flex-wrap">
<h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">${cat}</h2>${modeLbl}
</div>
<p class="text-sm text-slate-400 dark:text-slate-600 mb-5">${done}/${qs.length} answered</p>
${qCards}
<div class="flex justify-between items-center mt-6 gap-3" style="flex-wrap:wrap">
<button onclick="prevCat()" ${S.cat===0?"disabled":""} class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:border-slate-400 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">Back</button>
<div class="flex gap-3 items-center">
${done>=Math.floor(qs.length/2)?`<button onclick="go('results')" class="text-xs text-slate-400 dark:text-slate-600 underline underline-offset-2 cursor-pointer bg-transparent border-0">Skip to results</button>`:""}
<button id="next-btn" onclick="nextCat()" ${!catDone?"disabled":""} class="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border-0" style="background:#4f46e5">${S.cat===CATS.length-1?"See results →":"Next: "+CATS[S.cat+1]+" →"}</button>
</div>
</div>
${!catDone?`<p class="text-2xs text-slate-400 dark:text-slate-600 text-right mt-2">Answer all questions to continue</p>`:""}
</div>
</div>
</div>`;
  applyTheme();startTicker();
  if(!S.hideCompass)requestAnimationFrame(()=>drawCompass("compass-canvas",axes,240,240));
}

function renderResults(){
  const axes=computeAxes(S.answers);
  const pos=computePos(axes);
  const scored=matchParties(axes);
  const[lean,sub]=getLean(pos.x,pos.y);
  const list=S.showMinor?scored:scored.filter(p=>p.size!=="minor");

  const axRows=Object.entries(axes).map(([ax,v])=>{
    const isL=v<0;
    const lbl=v<-1.5?"Strong left":v<-0.5?"Left":v>1.5?"Strong right":v>0.5?"Right":"Centre";
    const pct=Math.max(0,Math.min(100,50+Math.round((v/3)*50)));
    const fillStyle=isL?`left:${pct}%;width:${50-pct}%;background:#93c5fd;opacity:.8`:`left:50%;width:${pct-50}%;background:#fcd34d;opacity:.8`;
    return`<div class="flex items-center gap-3 mb-3 last:mb-0">
<span class="text-xs text-slate-500 dark:text-slate-400 shrink-0" style="width:96px">${AXLABELS[ax]||ax}</span>
<div class="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-visible">
<div class="absolute top-0 h-full rounded-full" style="${fillStyle}"></div>
<div class="absolute top-[-3px] bottom-[-3px] w-px bg-slate-300 dark:bg-slate-600" style="left:50%;transform:translateX(-50%)"></div>
</div>
<span class="text-xs text-slate-400 dark:text-slate-600 text-right shrink-0" style="width:76px">${lbl}</span>
</div>`;
  }).join("");

  const leanDef=LEAN_DEFS[lean]||"";
  $id("root").innerHTML=headerHTML()+`<div class="px-5 pt-8 pb-16">
<p class="text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-5">Your results · April 2026</p>
<div class="rounded-2xl p-6 mb-6" style="background:#eef2ff;border:1px solid #c7d2fe">
<div class="text-2xs font-bold uppercase tracking-widest mb-2" style="color:#818cf8">Your political leaning</div>
<div class="text-3xl font-bold mb-1" style="color:#3730a3;letter-spacing:-.02em">${lean}</div>
<div class="text-sm font-medium mb-3" style="color:#4338ca">${sub}</div>
${leanDef?`<p class="text-sm leading-relaxed" style="color:#4338ca;opacity:.9">${leanDef}</p>`:""}
</div>
<div class="flex gap-5 items-start mb-8" style="flex-wrap:wrap">
<div style="flex:2;min-width:280px">
<div class="text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-3">Compass position</div>
<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3">
<canvas id="compass-canvas" class="w-full rounded-xl"></canvas>
</div>
</div>
<div style="flex:1;min-width:220px">
<div class="text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-3">Position by issue</div>
<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">${axRows}</div>
</div>
</div>
<div class="text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-4">Your closest matches</div>
<div id="results-top5" class="mb-8">${resultTop5HTML(list.slice(0,5))}</div>
<div class="flex justify-between items-center mb-3">
<div class="text-2xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">All parties ranked</div>
<button id="minor-toggle-btn" onclick="toggleMinor()" class="text-xs font-semibold px-3 py-1.5 rounded-full border bg-white dark:bg-slate-900 transition-all cursor-pointer ${S.showMinor?"border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400":"border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600"}">${S.showMinor?"Hide minor parties":"Show minor parties"}</button>
</div>
<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-1 mb-8">
<div id="results-all-parties">${resultAllPartiesHTML(list)}</div>
</div>
<hr class="border-slate-200 dark:border-slate-800 mb-8">
${legendHTML()}
<div class="flex gap-3 flex-wrap mb-5">
<button onclick="go('intro')" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:border-slate-400 transition-colors cursor-pointer">Start again</button>
<button onclick="go('quiz')" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:border-slate-400 transition-colors cursor-pointer">Edit answers</button>
</div>
<p class="text-xs text-slate-400 dark:text-slate-600 leading-relaxed">Based on GE2024 manifestos, Oireachtas voting records, and published policy positions as of April 2026. For informational purposes only.</p>
</div>`;
  applyTheme();startTicker();
  requestAnimationFrame(()=>{const cv=$id("compass-canvas");if(cv){const w=cv.parentElement.offsetWidth||500;drawCompass("compass-canvas",axes,w,Math.round(w*0.65));}});
}

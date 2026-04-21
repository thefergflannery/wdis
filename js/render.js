function sidePartyListHTML(scored,hasAny){
  if(!hasAny)return`<p style="font-size:12px;color:var(--text3)">Answer questions to see matches</p>`;
  const list=S.showMinor?scored:scored.filter(p=>p.size!=="minor");
  return list.map(p=>`<div class="side-party-row" title="${p.name}">
<span class="dot" style="background:${p.col}"></span>
<span class="side-party-name">${p.abbr}</span>
<div class="side-bar-bg"><div class="side-bar-fill" style="width:${p.match}%;background:${p.col}"></div></div>
<span class="side-party-pct">${p.match}%</span>
</div>`).join("");
}

function resultTop5HTML(top5){
  return top5.map((p,i)=>`<div class="result-card${i===0?" top":""}">
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px">
<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
<span class="dot" style="background:${p.col}"></span>
<span class="result-card-name">${p.url?`<a href="${p.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${p.name}</a>`:p.name}</span>
${p.size==="minor"?`<span class="badge-minor">minor</span>`:""}
${i===0?`<span class="badge-best">Best match</span>`:""}
</div>
<span class="result-card-pct">${p.match}%</span>
</div>
<div class="bar-bg"><div class="bar-fill" style="width:${p.match}%;background:${p.col}"></div></div>
<p class="result-card-desc">${p.desc}</p>
</div>`).join("");
}

function resultAllPartiesHTML(list){
  return list.map((p,i)=>`<div class="all-party-row">
<span class="ap-rank">${i+1}</span><span class="dot" style="background:${p.col}"></span>
<span class="ap-name">${p.name}${p.size==="minor"?`<span class="badge-minor">minor</span>`:""}</span>
<div class="ap-bar-bg"><div class="ap-bar-fill" style="width:${p.match}%;background:${p.col}"></div></div>
<span class="ap-pct">${p.match}%</span>
</div>`).join("");
}

function sideAxisHTML(axes){
  if(!axes||!Object.keys(axes).length)return`<p style="font-size:12px;color:var(--text3)">No data yet</p>`;
  return Object.entries(axes).map(([ax,v])=>{
    const isL=v<0;
    const lbl=v<-1.5?"Str. left":v<-0.5?"Left":v>1.5?"Str. right":v>0.5?"Right":"Centre";
    const pct=Math.max(0,Math.min(100,50+Math.round((v/3)*50)));
    const fillStyle=isL
      ?`left:${pct}%;width:${50-pct}%;background:var(--info-text);opacity:0.5`
      :`left:50%;width:${pct-50}%;background:var(--warn-text);opacity:0.5`;
    return`<div class="side-axis-row"><span class="side-axis-lbl">${AXLABELS[ax]||ax}</span><div class="side-axis-track"><div class="side-axis-mid"></div><div class="side-axis-fill" style="${fillStyle}"></div></div><span class="side-axis-val">${lbl}</span></div>`;
  }).join("");
}

function legendHTML(){
  return`<div class="section-hd">Party key — all 20 parties</div>
<div class="legend-grid">${PARTIES.map(p=>`<div class="legend-item">
<div class="legend-abbr" style="color:${p.col}">${p.abbr}</div>
<div><div class="legend-name">${p.url?`<a href="${p.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${p.name}</a>`:p.name}${p.size==="minor"?`<span class="badge-minor">minor</span>`:""}</div>
<div class="legend-desc">${p.desc}</div></div></div>`).join("")}</div>`;
}

function headerHTML(){
  return`<div class="sticky-header">
<div class="ticker"><span class="tick-tag tick-live" id="tick-tag">LIVE</span><span class="tick-text" id="tick-text">Loading...</span><span class="tick-date">20 Apr 2026</span></div>
<nav class="nav-bar">
<button class="nav-logo" onclick="go('intro')">Where Do I Stand<span class="nav-logo-dot">?</span></button>
<div class="nav-right"><button class="theme-btn" id="theme-btn" onclick="themeToggle()">${S.dark?"☀ Light":"☾ Dark"}</button></div>
</nav>
</div>`;
}

function renderIntro(){
  $id("root").innerHTML=headerHTML()+`<div class="wrap" style="padding-top:28px">
<p style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:0.09em;margin-bottom:16px">Republic of Ireland · Political Compass · April 2026</p>
<h1>Where do you<br>stand?</h1>
<p style="margin-bottom:10px;font-size:16px">All 20 registered Irish parties mapped against real policy positions — including the April 2026 fuel crisis.</p>
<p style="font-size:13px;color:var(--text3);margin-bottom:12px">Compass updates live as you answer. No data stored.</p>
<p style="font-size:12px;color:var(--text3);background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:24px;line-height:1.6">This tool is not politically affiliated. It's built to help you cut through the noise — map your own views against the policies parties actually stand for.</p>
<div class="mode-row">
<button class="mode-btn" onclick="startQuiz('quick')">
<div class="mode-title">Quick</div>
<div class="mode-desc">10 questions · ~3 min</div>
<div class="mode-note">One question per topic — fast overview</div>
</button>
<button class="mode-btn mode-btn-full" onclick="startQuiz('full')">
<div class="mode-title">Full</div>
<div class="mode-desc">56 questions · ~15 min</div>
<div class="mode-note">All topics in depth — most accurate result</div>
</button>
</div>
<hr>
<div class="section-hd">Topics covered</div>
<div class="intro-tags" style="margin-bottom:24px">${CATS.map(c=>`<span class="intro-tag${c==="Fuel & Cost of Living"?" hot":""}">${c}</span>`).join("")}</div>
${legendHTML()}
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
  const modeLbl=S.mode==="quick"?`<span style="font-size:11px;color:var(--warn-text);background:var(--warn-bg);border:1px solid var(--warn-border);padding:2px 8px;border-radius:10px;margin-left:8px">Quick mode</span>`:``;

  const catBtns=CATS.map((c,i)=>{
    const cqs=qs.filter(q=>q.cat===c);
    if(!cqs.length)return"";
    const cd=cqs.every(q=>S.answers[q.id]!==undefined);
    return`<button class="cat-btn${cd?" done":""}${i===S.cat?" active":""}" onclick="setCat(${i})">${cd?"✓ ":""}${c}</button>`;
  }).join("");

  const qCards=catQs.map(q=>{
    const v=S.answers[q.id];const ans=v!==undefined;
    const tc=n=>{if(v!==n)return"tap-btn";if(n<0)return"tap-btn neg";if(n>0)return"tap-btn pos";return"tap-btn neu";};
    return`<div class="q-card${ans?" answered":""}" id="card-${q.id}">
<p class="q-text">${q.text}</p>
<div class="q-explain">${q.explain}</div>
<div class="val-lbl${ans?" set":""}" id="ans-${q.id}">${ans?VLABELS[String(v)]:"Select your position below"}</div>
<div class="scale-hint"><span>← Strongly disagree</span><span>Strongly agree →</span></div>
<div class="tap-row">${[-2,-1,0,1,2].map(n=>`<button id="btn-${q.id}-${n}" class="${tc(n)}" onclick="setAns(${q.id},${n})">${BLABELS[String(n)]}</button>`).join("")}</div>
</div>`;
  }).join("");

  const notice=cat==="Fuel & Cost of Living"?`<div class="notice"><strong>Context, April 2026:</strong> Farmer and haulier blockades began April 7 after diesel +28%. Over 600 stations ran dry. Govt announced €755m tax cuts April 13–14. SF tabled a no-confidence motion; coalition survived 92–78.</div>`:"";

  $id("root").innerHTML=headerHTML()+`<div class="prog-wrap"><div class="prog-fill" id="pbar" style="width:${Math.round((done/qs.length)*100)}%"></div></div>
<div class="wrap" style="padding-top:22px">
<div class="cat-scroll">${catBtns}</div>
<div class="two-col">
<div class="quiz-side">
<div class="side-section-box">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
<span class="side-section-lbl" style="margin-bottom:0">Live results</span>
<button id="compass-toggle-btn" class="minor-toggle${S.hideCompass?"":"  on"}" onclick="toggleCompass()">${S.hideCompass?"Show live results":"Hide live results"}</button>
</div>
<div id="live-results-box">
${S.hideCompass
  ?`<p style="font-size:12px;color:var(--text3);text-align:center;padding:12px 0">Live results hidden<br><span style="font-size:11px;opacity:0.7">Revealed at the end</span></p>`
  :`<div class="compass-lbl">Live compass</div><canvas id="compass-canvas" style="width:100%;display:block;border-radius:8px"></canvas><div style="height:10px"></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span class="side-section-lbl" style="margin-bottom:0">Party matches</span><button id="minor-toggle-btn" class="minor-toggle${S.showMinor?" on":""}" onclick="toggleMinor()">${S.showMinor?"Hide minor":"Show minor"}</button></div><div id="party-list-box">${sidePartyListHTML(scored,hasAny)}</div>`
}
</div>
</div>
<div class="side-section-box"><div class="side-section-lbl">Positions by issue</div><div id="axis-box">${sideAxisHTML(axes)}</div></div>
</div>
<div class="quiz-main">
${notice}
<h2>${cat}${modeLbl}</h2>
<p style="font-size:13px;margin-bottom:18px">${done}/${qs.length} questions answered</p>
${qCards}
<div class="nav-row">
<button class="btn-back" onclick="prevCat()" ${S.cat===0?"disabled":""}>← Back</button>
<div style="display:flex;gap:10px;align-items:center">
${done>=Math.floor(qs.length/2)?`<button class="btn-skip" onclick="go('results')">Skip to results</button>`:""}
<button id="next-btn" class="btn-next" onclick="nextCat()" ${!catDone?"disabled":""}>${S.cat===CATS.length-1?"See results →":"Next: "+CATS[S.cat+1]+" →"}</button>
</div>
</div>
${!catDone?`<p style="font-size:12px;color:var(--text3);text-align:right;margin-top:8px">Answer all questions to continue</p>`:""}
</div>
</div>
</div>`;
  applyTheme();startTicker();
  if(!S.hideCompass)requestAnimationFrame(()=>drawCompass("compass-canvas",axes,236,236));
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
    const fillStyle=isL?`left:${pct}%;width:${50-pct}%;background:var(--info-bg);border:1px solid var(--info-border)`:`left:50%;width:${pct-50}%;background:var(--warn-bg);border:1px solid var(--warn-border)`;
    return`<div class="axis-row"><span class="axis-lbl">${AXLABELS[ax]||ax}</span><div class="axis-track"><div class="axis-mid"></div><div class="axis-fill" style="${fillStyle}"></div></div><span class="axis-val">${lbl}</span></div>`;
  }).join("");

  const leanDef=LEAN_DEFS[lean]||"";
  $id("root").innerHTML=headerHTML()+`<div class="wrap" style="padding-top:22px">
<p style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:0.09em;margin-bottom:18px">Your results · April 2026</p>
<div class="lean-box">
<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.09em;color:var(--info-text);opacity:0.7;margin-bottom:7px">Your political leaning</div>
<div class="lean-main">${lean}</div>
<div class="lean-sub" style="margin-bottom:${leanDef?"10px":"0"}">${sub}</div>
${leanDef?`<p style="font-size:13px;color:var(--info-text);opacity:0.9;line-height:1.6;margin-top:4px">${leanDef}</p>`:""}
</div>
<div style="display:flex;gap:22px;align-items:flex-start;margin-bottom:26px;flex-wrap:wrap">
<div style="flex:2;min-width:320px"><div class="section-hd">Compass position</div>
<div class="compass-box" style="margin-bottom:0"><canvas id="compass-canvas" style="width:100%;display:block;border-radius:8px"></canvas></div></div>
<div style="flex:1;min-width:220px"><div class="section-hd">Position by issue</div>${axRows}</div>
</div>
<div class="section-hd">Your closest matches</div>
<div id="results-top5" style="margin-bottom:26px">${resultTop5HTML(list.slice(0,5))}</div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
<div class="section-hd" style="margin-bottom:0">All parties ranked</div>
<button id="minor-toggle-btn" class="minor-toggle${S.showMinor?" on":""}" onclick="toggleMinor()">${S.showMinor?"Hide minor parties":"Show minor parties"}</button>
</div>
<div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:12px 16px;margin-bottom:10px"><div id="results-all-parties">${resultAllPartiesHTML(list)}</div></div>
<hr>${legendHTML()}
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px">
<button class="btn-back" onclick="go('intro')">Start again</button>
<button class="btn-back" onclick="go('quiz')">Edit answers</button>
</div>
<p class="footer-note">Based on GE2024 manifestos, Oireachtas voting records, and published policy positions as of April 2026. For informational purposes only.</p>
</div>`;
  applyTheme();startTicker();
  requestAnimationFrame(()=>{const cv=$id("compass-canvas");if(cv){const w=cv.parentElement.offsetWidth||500;drawCompass("compass-canvas",axes,w,Math.round(w*0.65));}});
}

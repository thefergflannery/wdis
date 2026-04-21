/* ── helpers ─────────────────────────────── */
const C={
  canvas:'#131313',surface:'#1c1c1c',surface2:'#242424',border:'#2d2d2d',
  mint:'#3cffd0',uv:'#5200ff',text1:'#ffffff',text2:'#c0c0c0',text3:'#888888',
};
const mono='font-family:\'Space Mono\',monospace';
const disp='font-family:\'Anton\',Impact,sans-serif';
const sans='font-family:\'Space Grotesk\',sans-serif';
const label=`${mono};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:${C.text3}`;
const hairline=`border:1px solid ${C.border}`;

function sidePartyListHTML(scored,hasAny){
  if(!hasAny)return`<p style="${mono};font-size:12px;color:${C.text3};letter-spacing:.08em;text-transform:uppercase;padding:8px 0">ANSWER TO SEE MATCHES</p>`;
  const list=S.showMinor?scored:scored.filter(p=>p.size!=="minor");
  return list.slice(0,12).map((p,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid ${C.border}" title="${p.name}">
<span style="font-size:11px;${mono};color:${C.text3};width:14px;text-align:right;flex-shrink:0">${i+1}</span>
<span style="width:7px;height:7px;border-radius:50%;flex-shrink:0;background:${p.col}"></span>
<span style="font-size:11px;font-weight:600;color:${C.text2};width:32px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.abbr}</span>
<div style="flex:1;height:2px;background:${C.border};border-radius:2px;overflow:hidden">
<div style="height:100%;border-radius:2px;width:${p.match}%;background:${p.col}"></div>
</div>
<span style="${mono};font-size:12px;font-weight:700;color:${C.text2};width:28px;text-align:right;flex-shrink:0">${p.match}%</span>
</div>`).join("");
}

function resultTop5HTML(top5){
  return top5.map((p,i)=>`<div style="border-radius:20px;padding:20px 24px;margin-bottom:12px;${i===0?`background:rgba(60,255,208,.07);border:1px solid ${C.mint}`:`background:${C.surface};${hairline}`}">
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
<span style="width:10px;height:10px;border-radius:50%;background:${p.col};flex-shrink:0"></span>
<span style="${disp};font-size:22px;color:${C.text1};letter-spacing:.02em">${p.url?`<a href="${p.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${p.name}</a>`:p.name}</span>
${p.size==="minor"?`<span style="${mono};font-size:11px;padding:2px 8px;border-radius:20px;border:1px solid ${C.border};color:${C.text3};letter-spacing:.08em;text-transform:uppercase">MINOR</span>`:""}
${i===0?`<span style="${mono};font-size:11px;padding:2px 10px;border-radius:20px;background:${C.mint};color:#000;font-weight:700;letter-spacing:.08em">BEST MATCH</span>`:""}
</div>
<span style="${disp};font-size:40px;color:${i===0?C.mint:C.text1};letter-spacing:.02em;line-height:1;flex-shrink:0;margin-left:16px">${p.match}%</span>
</div>
<div style="height:2px;background:${C.border};border-radius:2px;overflow:hidden;margin-bottom:12px">
<div style="height:100%;border-radius:2px;background:${p.col};width:${p.match}%;transition:width .7s ease"></div>
</div>
<p style="font-size:13px;color:${C.text2};line-height:1.6;margin:0">${p.desc}</p>
</div>`).join("");
}

function resultAllPartiesHTML(list){
  return list.map((p,i)=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid ${C.border}${i===list.length-1?';border-bottom:none':''}">
<span style="${mono};font-size:12px;color:${C.text3};width:20px;text-align:right;flex-shrink:0">${i+1}</span>
<span style="width:8px;height:8px;border-radius:50%;background:${p.col};flex-shrink:0"></span>
<span style="font-size:14px;color:${C.text2};flex:1">
${p.url?`<a href="${p.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${p.name}</a>`:p.name}
${p.size==="minor"?`<span style="${mono};font-size:11px;padding:1px 6px;background:${C.surface2};color:${C.text3};border-radius:10px;margin-left:6px;letter-spacing:.06em;text-transform:uppercase">MINOR</span>`:""}
</span>
<div style="width:80px;height:2px;background:${C.surface2};border-radius:2px;overflow:hidden;flex-shrink:0">
<div style="height:100%;background:${p.col};width:${p.match}%;border-radius:2px"></div>
</div>
<span style="${mono};font-size:11px;font-weight:700;color:${C.text2};width:32px;text-align:right;flex-shrink:0">${p.match}%</span>
</div>`).join("");
}

function sideAxisHTML(axes){
  if(!axes||!Object.keys(axes).length)return`<p style="${mono};font-size:12px;color:${C.text3};letter-spacing:.08em;text-transform:uppercase;padding:6px 0">NO DATA YET</p>`;
  return Object.entries(axes).map(([ax,v])=>{
    const isL=v<0;
    const lbl=v<-1.5?"STR. LEFT":v<-0.5?"LEFT":v>1.5?"STR. RIGHT":v>0.5?"RIGHT":"CENTRE";
    const pct=Math.max(0,Math.min(100,50+Math.round((v/3)*50)));
    const fillStyle=isL?`left:${pct}%;width:${50-pct}%;background:${C.mint};opacity:.7`:`left:50%;width:${pct-50}%;background:${C.uv};opacity:.7`;
    return`<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
<span style="font-size:12px;color:${C.text3};width:62px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${AXLABELS[ax]||ax}</span>
<div style="flex:1;height:2px;background:${C.border};border-radius:2px;position:relative;overflow:visible">
<div style="position:absolute;top:0;height:100%;border-radius:2px;${fillStyle}"></div>
<div style="position:absolute;left:50%;top:-3px;bottom:-3px;width:1px;background:#888888;transform:translateX(-50%)"></div>
</div>
<span style="${mono};font-size:11px;color:${C.text3};width:48px;text-align:right;flex-shrink:0;letter-spacing:.06em">${lbl}</span>
</div>`;
  }).join("");
}

function newsGridHTML(){
  const tagColors={
    'tick-live':'#ff3c3c','tick-pol':'#3cffd0','tick-eco':'#f0a500'
  };
  const tagText={
    'tick-live':'#ffffff','tick-pol':'#000000','tick-eco':'#000000'
  };
  return`<div style="${label};margin-bottom:20px">LATEST NEWS — APRIL 2026</div>
<div class="news-grid">
${TICKS.map(t=>`<a href="${t.url||'#'}" target="_blank" rel="noopener" style="display:flex;flex-direction:column;gap:12px;background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:20px 22px;text-decoration:none;transition:border-color .2s" onmouseover="this.style.borderColor='${C.text3}'" onmouseout="this.style.borderColor='${C.border}'">
<span style="${mono};font-size:10px;font-weight:700;padding:3px 10px;border-radius:6px;background:${tagColors[t.cls]||C.border};color:${tagText[t.cls]||C.text1};letter-spacing:.1em;align-self:flex-start">${t.tag}</span>
<p style="font-size:14px;font-weight:600;color:${C.text1};line-height:1.55;margin:0;flex:1">${t.text}</p>
<span style="${mono};font-size:11px;color:${C.text3};letter-spacing:.06em">READ MORE →</span>
</a>`).join("")}
</div>`;
}

function legendHTML(){
  return`<div style="${label};margin-bottom:16px">CURRENTLY REGISTERED PARTIES — AS OF APRIL 2026</div>
<div class="legend-grid">${PARTIES.map(p=>`<div style="display:flex;align-items:flex-start;gap:10px;background:${C.surface};border:1px solid ${C.border};border-radius:16px;padding:12px 14px">
<div style="font-size:12px;font-weight:700;flex-shrink:0;width:38px;padding-top:1px;color:${p.col}">${p.abbr}</div>
<div>
<div style="font-size:12px;font-weight:600;color:${C.text1};line-height:1.3">${p.url?`<a href="${p.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${p.name}</a>`:p.name}${p.size==="minor"?`<span style="${mono};font-size:11px;padding:1px 6px;background:${C.surface2};color:${C.text3};border-radius:10px;margin-left:5px;letter-spacing:.06em;text-transform:uppercase">MINOR</span>`:""}</div>
<div style="font-size:11px;color:${C.text3};margin-top:3px;line-height:1.45">${p.desc}</div>
</div></div>`).join("")}</div>`;
}

function headerHTML(){
  return`<div style="position:sticky;top:0;z-index:50;background:${C.canvas}">
<div class="tick-bar">
<span class="tick-tag tick-live" id="tick-tag">LIVE</span>
<span class="tick-text" id="tick-text" style="font-size:12px;color:${C.text2};flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a id="tick-link" href="#" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">Loading...</a></span>
<span style="${mono};font-size:12px;color:${C.text3};flex-shrink:0;letter-spacing:.08em;white-space:nowrap">20 APR 2026</span>
</div>
<nav class="site-nav">
<button onclick="go('intro')" style="${disp};font-size:24px;color:${C.text1};background:none;border:none;cursor:pointer;letter-spacing:.06em;padding:0;line-height:1">TILT<span style="color:${C.mint}">.</span></button>
</nav>
</div>`;
}

function footerHTML(){
  return`<footer style="border-top:1px solid ${C.border};margin-top:64px;padding:32px 0 48px">
<p style="${sans};font-size:13px;color:${C.text3};line-height:1.8;max-width:720px">
Created not for profit and for educational purposes by <a href="https://fergflannery.com" target="_blank" rel="noopener" style="color:${C.text2};text-decoration:underline;text-underline-offset:3px">Ferg Flannery</a> · fergflannery.com. All information is gathered from publicly available sources.
</p>
<p style="${sans};font-size:12px;color:${C.text3};line-height:1.8;max-width:720px;margin-top:8px">
This tool does not guarantee the accuracy, completeness, or timeliness of the data, and we are not liable for any decisions made based on this information. Users are encouraged to verify critical information directly with the original source.
</p>
</footer>`;
}

/* ── INTRO ───────────────────────────────── */
function renderIntro(){
  $id("root").innerHTML=headerHTML()+`
<div class="wrap">

  <!-- HERO SPLIT -->
  <div class="hero-grid" style="border-bottom:1px solid ${C.border}">
    <div>
      <p style="${mono};font-size:12px;color:${C.mint};letter-spacing:.16em;text-transform:uppercase;margin-bottom:20px">Republic of Ireland · Political Compass · April 2026</p>
      <h1 class="hero-wordmark" style="${disp};font-size:clamp(72px,9vw,120px);line-height:.88;letter-spacing:.02em;color:${C.text1};margin-bottom:16px">TILT<span style="color:${C.mint}">.</span></h1>
      <p style="${mono};font-size:14px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.text2};margin-bottom:10px">WHERE DO I CURRENTLY STAND?</p>
      <p style="font-size:16px;color:${C.text2};line-height:1.6;margin-bottom:12px">A guide to your political leaning in Ireland.</p>
      <div style="background:${C.surface};border:1px solid ${C.border};border-radius:12px;padding:12px 16px;margin-bottom:32px;font-size:13px;color:${C.text3};line-height:1.6">
        Not politically affiliated. Built to help you cut through the noise and map your own views against the policies parties actually stand for.
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button onclick="startQuiz('quick')" style="flex:1;min-width:150px;background:${C.surface};border:1px solid ${C.border};border-radius:24px;padding:16px 24px;text-align:left;cursor:pointer;transition:all .15s" onmouseover="this.style.borderColor='${C.mint}'" onmouseout="this.style.borderColor='${C.border}'">
          <div style="${disp};font-size:24px;color:${C.text1};letter-spacing:.04em;margin-bottom:4px">QUICK</div>
          <div style="${mono};font-size:11px;color:${C.text2};letter-spacing:.08em;margin-bottom:6px">10 QUESTIONS · ~3 MIN</div>
          <div style="font-size:12px;color:${C.text3}">One question per topic</div>
        </button>
        <button onclick="startQuiz('full')" style="flex:1;min-width:150px;background:${C.mint};border:1px solid ${C.mint};border-radius:24px;padding:16px 24px;text-align:left;cursor:pointer;transition:all .15s" onmouseover="this.style.opacity='.88'" onmouseout="this.style.opacity='1'">
          <div style="${disp};font-size:24px;color:#000;letter-spacing:.04em;margin-bottom:4px">FULL</div>
          <div style="${mono};font-size:11px;color:rgba(0,0,0,.7);letter-spacing:.08em;margin-bottom:6px">56 QUESTIONS · ~15 MIN</div>
          <div style="font-size:12px;color:rgba(0,0,0,.6)">All topics — most accurate</div>
        </button>
      </div>
    </div>
    <div class="hero-compass-col">
      <div style="${label};margin-bottom:12px">LIVE PARTY POSITIONS — COMPASS PREVIEW</div>
      <div style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:16px">
        <canvas id="intro-compass" style="width:100%;display:block;border-radius:12px"></canvas>
        <div style="${mono};font-size:12px;color:${C.text3};text-align:center;margin-top:10px;letter-spacing:.08em">START ANSWERING TO SEE YOUR POSITION</div>
      </div>
    </div>
  </div>

  <!-- LEGEND -->
  <div style="padding:56px 0 0">
    ${legendHTML()}
  </div>

  <!-- NEWS GRID -->
  <div style="padding-top:16px">
    ${newsGridHTML()}
  </div>

  <!-- TOPIC PILLS -->
  <div style="padding-bottom:64px">
    <div style="${label};margin-bottom:16px">TOPICS COVERED — ${CATS.length} CATEGORIES</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${CATS.map(c=>`<span style="${mono};font-size:12px;padding:5px 12px;border-radius:20px;border:1px solid ${c==="Fuel & Cost of Living"?"#f0a500":C.border};color:${c==="Fuel & Cost of Living"?"#f0a500":C.text3};letter-spacing:.06em;text-transform:uppercase">${c}</span>`).join("")}
    </div>
  </div>
  ${footerHTML()}
</div>`;
  applyTheme();startTicker();
  requestAnimationFrame(()=>{
    const cv=$id("intro-compass");
    if(cv){const w=cv.parentElement.offsetWidth-32;cv.width=w;cv.height=Math.round(w*.7);drawCompass("intro-compass",{},w,Math.round(w*.7));}
  });
}

/* ── QUIZ ────────────────────────────────── */
function renderQuiz(){
  const qs=activeQS();
  const cat=CATS[S.cat];
  const catQs=qs.filter(q=>q.cat===cat);
  const axes=computeAxes(S.answers);
  const scored=matchParties(axes);
  const done=Object.keys(S.answers).length;
  const catDone=catQs.every(q=>S.answers[q.id]!==undefined);
  const hasAny=done>0;
  const modeLbl=S.mode==="quick"?`<span style="${mono};font-size:11px;padding:3px 10px;border-radius:20px;background:rgba(240,165,0,.15);color:#f0a500;border:1px solid rgba(240,165,0,.3);letter-spacing:.08em;margin-left:10px">QUICK MODE</span>`:``;

  const catBtns=CATS.map((c,i)=>{
    const cqs=qs.filter(q=>q.cat===c);if(!cqs.length)return"";
    const cd=cqs.every(q=>S.answers[q.id]!==undefined);
    const isActive=i===S.cat;
    const bg=isActive?C.mint:cd?'rgba(60,255,208,.08)':'transparent';
    const col=isActive?'#000':cd?C.mint:C.text3;
    const bc=isActive?C.mint:cd?'rgba(60,255,208,.3)':C.border;
    return`<button style="${mono};font-size:12px;padding:6px 14px;border-radius:20px;border:1px solid ${bc};background:${bg};color:${col};cursor:pointer;white-space:nowrap;letter-spacing:.06em;transition:all .15s;font-weight:700" onclick="setCat(${i})">${cd&&!isActive?"✓ ":""}${c.toUpperCase()}</button>`;
  }).join("");

  const qCards=catQs.map(q=>{
    const v=S.answers[q.id];const ans=v!==undefined;
    const tc=n=>{if(v!==n)return"tap-btn";if(n<0)return"tap-btn neg";if(n>0)return"tap-btn pos";return"tap-btn neu";};
    return`<div style="background:${C.surface};border:1px solid ${ans?'rgba(60,255,208,.2)':C.border};border-radius:20px;padding:24px;margin-bottom:16px;transition:border-color .2s" id="card-${q.id}">
<p style="font-size:16px;font-weight:600;color:${C.text1};line-height:1.5;margin-bottom:14px">${q.text}</p>
<div class="q-explain-block" style="border-radius:0 10px 10px 0;padding:12px 16px;margin-bottom:16px;font-size:13px;color:${C.text2};line-height:1.65">${q.explain}</div>
<div style="${mono};text-align:center;font-size:11px;font-weight:700;min-height:20px;margin-bottom:10px;color:${ans?C.mint:C.text3};letter-spacing:.06em" id="ans-${q.id}">${ans?VLABELS[String(v)].toUpperCase():"SELECT YOUR POSITION"}</div>
<div style="display:flex;justify-content:space-between;${mono};font-size:11px;color:${C.text3};margin-bottom:8px;letter-spacing:.06em"><span>STRONGLY DISAGREE</span><span>STRONGLY AGREE</span></div>
<div style="display:flex;gap:6px">${[-2,-1,0,1,2].map(n=>`<button id="btn-${q.id}-${n}" class="${tc(n)}" onclick="setAns(${q.id},${n})">${BLABELS[String(n)]}</button>`).join("")}</div>
</div>`;
  }).join("");

  const notice=cat==="Fuel & Cost of Living"?`<div style="background:rgba(240,165,0,.08);border:1px solid rgba(240,165,0,.3);border-radius:12px;padding:14px 18px;margin-bottom:20px;font-size:13px;color:#f0a500;line-height:1.6"><strong>Context, April 2026:</strong> Farmer and haulier blockades began April 7 after diesel +28%. Over 600 stations ran dry. Govt announced €755m tax cuts April 13-14. SF tabled a no-confidence motion; coalition survived 92-78.</div>`:"";

  const liveBox=S.hideCompass
    ?`<p style="${mono};font-size:12px;color:${C.text3};text-align:center;padding:24px 0;letter-spacing:.08em;text-transform:uppercase">RESULTS HIDDEN<br><span style="opacity:.5;font-size:11px">REVEALED AT THE END</span></p>`
    :`<canvas id="compass-canvas" style="width:100%;display:block;border-radius:12px;margin-bottom:12px"></canvas>
<div style="background:${C.surface2};border-radius:12px;padding:12px">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
<span style="${label}">PARTY MATCHES</span>
<button id="minor-toggle-btn" onclick="toggleMinor()" style="${mono};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;border:1px solid ${C.border};background:transparent;color:${C.text3};cursor:pointer;letter-spacing:.06em;text-transform:uppercase">${S.showMinor?"HIDE MINOR":"SHOW MINOR"}</button>
</div>
<div id="party-list-box">${sidePartyListHTML(scored,hasAny)}</div>
</div>`;

  $id("root").innerHTML=headerHTML()+
`<div style="height:2px;background:${C.border}"><div id="pbar" style="height:100%;background:${C.mint};width:${Math.round((done/qs.length)*100)}%"></div></div>
<div class="wrap">
<div class="cat-tabs" style="border-bottom:1px solid ${C.border};margin-bottom:24px">${catBtns}</div>
<div class="quiz-layout">

  <!-- SIDEBAR -->
  <div class="quiz-sidebar sidebar-scroll">
    <div style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <span style="${label}">LIVE RESULTS</span>
        <button id="compass-toggle-btn" onclick="toggleCompass()" style="${mono};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;border:1px solid ${S.hideCompass?C.border:C.mint};background:${S.hideCompass?'transparent':'rgba(60,255,208,.1)'};color:${S.hideCompass?C.text3:C.mint};cursor:pointer;letter-spacing:.06em;text-transform:uppercase">${S.hideCompass?"SHOW":"HIDE"}</button>
      </div>
      <div id="live-results-box">${liveBox}</div>
    </div>
    <div style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:16px">
      <div style="${label};margin-bottom:12px">BY ISSUE</div>
      <div id="axis-box">${sideAxisHTML(axes)}</div>
    </div>
  </div>

  <!-- QUESTIONS -->
  <div class="quiz-main">
    ${notice}
    <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px;flex-wrap:wrap">
      <h2 style="${disp};font-size:32px;color:${C.text1};letter-spacing:.04em">${cat.toUpperCase()}</h2>${modeLbl}
    </div>
    <p style="${mono};font-size:12px;color:${C.text3};letter-spacing:.08em;margin-bottom:24px">${done}/${qs.length} ANSWERED</p>
    ${qCards}
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:24px;gap:12px;flex-wrap:wrap;padding-bottom:32px">
      <button onclick="prevCat()" ${S.cat===0?"disabled":""} style="${mono};font-size:11px;font-weight:700;padding:12px 24px;border-radius:24px;border:1px solid ${C.border};background:transparent;color:${C.text2};cursor:pointer;letter-spacing:.06em;transition:all .15s;disabled:opacity:.3">← BACK</button>
      <div style="display:flex;gap:12px;align-items:center">
        ${done>=Math.floor(qs.length/2)?`<button onclick="go('results')" style="${mono};font-size:12px;color:${C.text3};background:none;border:none;cursor:pointer;letter-spacing:.06em;text-decoration:underline;text-underline-offset:3px">SKIP TO RESULTS</button>`:""}
        <button id="next-btn" onclick="nextCat()" ${!catDone?"disabled":""} style="${mono};font-size:11px;font-weight:700;padding:12px 28px;border-radius:24px;border:none;background:${C.mint};color:#000;cursor:pointer;letter-spacing:.06em;transition:all .15s;${!catDone?"opacity:.3;cursor:not-allowed":""}">${S.cat===CATS.length-1?"SEE RESULTS →":"NEXT: "+CATS[S.cat+1].toUpperCase()+" →"}</button>
      </div>
    </div>
    ${!catDone?`<p style="${mono};font-size:12px;color:${C.text3};text-align:right;letter-spacing:.06em;margin-top:8px">ANSWER ALL QUESTIONS TO CONTINUE</p>`:""}
  </div>

</div>
</div>`;
  applyTheme();startTicker();
  if(!S.hideCompass)requestAnimationFrame(()=>drawCompass("compass-canvas",axes,300,240));
}

/* ── RESULTS ─────────────────────────────── */
function renderResults(){
  const axes=computeAxes(S.answers);
  const pos=computePos(axes);
  const scored=matchParties(axes);
  const[lean,sub]=getLean(pos.x,pos.y);
  const list=S.showMinor?scored:scored.filter(p=>p.size!=="minor");

  const axRows=Object.entries(axes).map(([ax,v])=>{
    const isL=v<0;
    const lbl=v<-1.5?"STR. LEFT":v<-0.5?"LEFT":v>1.5?"STR. RIGHT":v>0.5?"RIGHT":"CENTRE";
    const pct=Math.max(0,Math.min(100,50+Math.round((v/3)*50)));
    const fillStyle=isL?`left:${pct}%;width:${50-pct}%;background:${C.mint};opacity:.75`:`left:50%;width:${pct-50}%;background:${C.uv};opacity:.75`;
    return`<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
<span style="font-size:12px;color:${C.text2};width:100px;flex-shrink:0">${AXLABELS[ax]||ax}</span>
<div style="flex:1;height:3px;background:${C.border};border-radius:3px;position:relative;overflow:visible">
<div style="position:absolute;top:0;height:100%;border-radius:3px;${fillStyle}"></div>
<div style="position:absolute;left:50%;top:-4px;bottom:-4px;width:1px;background:#888888;transform:translateX(-50%)"></div>
</div>
<span style="${mono};font-size:11px;color:${C.text3};width:60px;text-align:right;flex-shrink:0;letter-spacing:.06em">${lbl}</span>
</div>`;
  }).join("");

  const leanDef=LEAN_DEFS[lean]||"";
  $id("root").innerHTML=headerHTML()+`
<div class="wrap" style="padding-bottom:64px">

  <!-- LEAN HERO -->
  <div style="margin:40px 0;padding:40px 48px;border-radius:20px;background:${C.surface};border:1px solid ${C.border}">
    <div style="${label};margin-bottom:16px">YOUR POLITICAL LEANING</div>
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:32px;flex-wrap:wrap">
      <div>
        <h2 style="${disp};font-size:clamp(48px,7vw,96px);line-height:.9;color:${C.mint};letter-spacing:.03em;margin-bottom:8px">${lean.toUpperCase()}</h2>
        <p style="${mono};font-size:13px;font-weight:700;color:${C.text2};letter-spacing:.10em;text-transform:uppercase;margin-bottom:${leanDef?'16px':'0'}">${sub}</p>
        ${leanDef?`<p style="font-size:14px;color:${C.text2};line-height:1.7;max-width:560px">${leanDef}</p>`:""}
      </div>
      <div style="${mono};font-size:12px;color:${C.text3};letter-spacing:.08em;text-align:right;padding-top:8px">APRIL 2026 · IRELAND</div>
    </div>
  </div>

  <!-- COMPASS + AXIS -->
  <div class="results-grid">
    <div>
      <div style="${label};margin-bottom:14px">YOUR COMPASS POSITION</div>
      <div style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:16px">
        <canvas id="compass-canvas" style="width:100%;display:block;border-radius:12px"></canvas>
      </div>
    </div>
    <div>
      <div style="${label};margin-bottom:14px">POSITION BY ISSUE</div>
      <div style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:20px">${axRows}</div>
    </div>
  </div>

  <!-- TOP MATCHES -->
  <div style="${label};margin-bottom:20px">YOUR CLOSEST MATCHES</div>
  <div id="results-top5" style="margin-bottom:40px">${resultTop5HTML(list.slice(0,5))}</div>

  <!-- ALL PARTIES -->
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
    <div style="${label}">ALL PARTIES RANKED</div>
    <button id="minor-toggle-btn" onclick="toggleMinor()" style="${mono};font-size:12px;font-weight:700;padding:6px 16px;border-radius:24px;border:1px solid ${S.showMinor?C.mint:C.border};background:${S.showMinor?'rgba(60,255,208,.08)':'transparent'};color:${S.showMinor?C.mint:C.text3};cursor:pointer;letter-spacing:.06em;text-transform:uppercase;transition:all .15s">${S.showMinor?"HIDE MINOR PARTIES":"SHOW MINOR PARTIES"}</button>
  </div>
  <div style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:8px 20px;margin-bottom:40px">
    <div id="results-all-parties">${resultAllPartiesHTML(list)}</div>
  </div>

  <hr style="border:none;border-top:1px solid ${C.border};margin:40px 0">
  ${legendHTML()}

  <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
    <button onclick="go('intro')" style="${mono};font-size:11px;font-weight:700;padding:12px 24px;border-radius:24px;border:1px solid ${C.border};background:transparent;color:${C.text2};cursor:pointer;letter-spacing:.06em;transition:all .15s">← START AGAIN</button>
    <button onclick="go('quiz')" style="${mono};font-size:11px;font-weight:700;padding:12px 24px;border-radius:24px;border:1px solid ${C.border};background:transparent;color:${C.text2};cursor:pointer;letter-spacing:.06em;transition:all .15s">EDIT ANSWERS</button>
  </div>
  <p style="font-size:12px;color:${C.text3};line-height:1.7">Based on GE2024 manifestos, Oireachtas voting records, and published policy positions as of April 2026.</p>
  ${footerHTML()}
</div>`;
  applyTheme();startTicker();
  requestAnimationFrame(()=>{const cv=$id("compass-canvas");if(cv){const w=cv.parentElement.offsetWidth-32;drawCompass("compass-canvas",axes,w,Math.round(w*.6));}});
}

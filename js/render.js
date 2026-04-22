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
  const skeleton=`<div style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:20px 22px;min-height:148px;display:flex;flex-direction:column;gap:12px">
<div style="width:64px;height:18px;background:${C.border};border-radius:6px;animation:tilt-pulse 1.4s ease-in-out infinite"></div>
<div style="flex:1;background:${C.border};border-radius:6px;opacity:.45;animation:tilt-pulse 1.4s ease-in-out infinite .15s"></div>
<div style="width:90px;height:12px;background:${C.border};border-radius:6px;opacity:.35;animation:tilt-pulse 1.4s ease-in-out infinite .3s"></div>
</div>`;
  return`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
<span style="${label}">LATEST NEWS</span>
<span id="news-updated" style="${mono};font-size:10px;color:${C.text3};letter-spacing:.06em"></span>
</div>
<div class="news-grid" id="news-grid-dynamic">${skeleton}${skeleton}${skeleton}</div>`;
}

function escHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

const SOURCE_META={
  'RTÉ News':{tag:'IRELAND',bg:'#ff3c3c',fg:'#fff'},
  'RTÉ Politics':{tag:'POLITICS',bg:'#3cffd0',fg:'#000'},
  'The Journal':{tag:'NEWS',bg:'#f0a500',fg:'#000'},
};

async function loadNewsGrid(){
  const box=document.getElementById('news-grid-dynamic');
  if(!box)return;

  let items=[];
  try{
    const r=await fetch('/api/news',{cache:'no-store'});
    if(r.ok){const d=await r.json();items=d.items||[];}
  }catch(e){/* fall through to static fallback */}

  if(items.length>0){
    const cards=items.slice(0,3).map(item=>{
      const meta=SOURCE_META[item.source]||{tag:'NEWS',bg:C.border,fg:C.text1};
      const _d=item.pubDate?new Date(item.pubDate):null;
      const date=_d&&!isNaN(_d)?_d.toLocaleDateString('en-IE',{day:'numeric',month:'short',year:'numeric'}):'—';
      // Validate link is http/https before using as href
      let safeLink='#';
      try{const u=new URL(item.link);if(u.protocol==='https:'||u.protocol==='http:')safeLink=item.link;}catch(e){}
      return`<a href="${escHtml(safeLink)}" target="_blank" rel="noopener noreferrer" style="${sans};display:flex;flex-direction:column;gap:12px;background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:20px 22px;text-decoration:none;transition:border-color .2s" onmouseover="this.style.borderColor='${C.text3}'" onmouseout="this.style.borderColor='${C.border}'">
<span style="${mono};font-size:10px;font-weight:700;padding:3px 10px;border-radius:6px;background:${meta.bg};color:${meta.fg};letter-spacing:.1em;align-self:flex-start">${escHtml(meta.tag)}</span>
<p style="font-size:14px;font-weight:600;color:${C.text1};line-height:1.55;margin:0;flex:1">${escHtml(item.title)}</p>
<div style="display:flex;justify-content:space-between;align-items:center">
<span style="${mono};font-size:11px;color:${C.text3};letter-spacing:.06em">${escHtml(date)}</span>
<span style="${mono};font-size:11px;color:${C.text3};letter-spacing:.06em">READ MORE →</span>
</div></a>`;
    });
    box.innerHTML=cards.join('');
    const upd=document.getElementById('news-updated');
    if(upd)upd.textContent='Updated '+new Date().toLocaleTimeString('en-IE',{hour:'2-digit',minute:'2-digit'});
  } else {
    // Static fallback — TICKS data (no external content, safe)
    const tagMap={'tick-live':{bg:'#ff3c3c',fg:'#fff'},'tick-pol':{bg:'#3cffd0',fg:'#000'},'tick-eco':{bg:'#f0a500',fg:'#000'}};
    box.innerHTML=TICKS.slice(0,3).map(t=>{const tc=tagMap[t.cls]||{bg:C.border,fg:C.text1};return`<a href="${escHtml(t.url||'#')}" target="_blank" rel="noopener noreferrer" style="${sans};display:flex;flex-direction:column;gap:12px;background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:20px 22px;text-decoration:none">
<span style="${mono};font-size:10px;font-weight:700;padding:3px 10px;border-radius:6px;background:${tc.bg};color:${tc.fg};letter-spacing:.1em;align-self:flex-start">${escHtml(t.tag)}</span>
<p style="font-size:14px;font-weight:600;color:${C.text1};line-height:1.55;margin:0;flex:1">${escHtml(t.text)}</p>
<div style="display:flex;justify-content:space-between;align-items:center">
<span style="${mono};font-size:11px;color:${C.text3};letter-spacing:.06em">22 Apr 2026</span>
<span style="${mono};font-size:11px;color:${C.text3};letter-spacing:.06em">READ MORE →</span>
</div></a>`;}).join('');
  }
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
<span class="tick-text" id="tick-text" style="font-size:12px;color:#000;font-weight:600;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a id="tick-link" href="#" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">Loading...</a></span>
<span style="${mono};font-size:12px;color:rgba(0,0,0,0.55);flex-shrink:0;letter-spacing:.08em;white-space:nowrap">22 APR 2026</span>
</div>
<nav class="site-nav">
<button onclick="go('intro')" style="${disp};font-size:24px;color:${C.text1};background:none;border:none;cursor:pointer;letter-spacing:.06em;padding:0;line-height:1">TILT<span style="color:${C.mint}">.</span></button>
</nav>
</div>`;
}

function mobileSheetHTML(axes,scored,hasAny,done,total){
  return`<div class="results-backdrop" id="results-backdrop" onclick="hideResultsSheet()"></div>
<div class="results-sheet" id="results-sheet">
  <div class="sheet-handle"></div>
  <div style="padding:0 20px 40px">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0 14px;border-bottom:1px solid ${C.border};margin-bottom:16px">
      <div>
        <span style="${label}">VIEW POSITION</span>
        <span style="${mono};font-size:11px;color:${C.text3};margin-left:12px;letter-spacing:.06em">${done}/${total} ANSWERED</span>
      </div>
      <button onclick="hideResultsSheet()" style="${mono};font-size:11px;font-weight:700;padding:8px 16px;border-radius:20px;border:1px solid ${C.border};background:transparent;color:${C.text2};cursor:pointer;letter-spacing:.06em;transition:all .15s" onmouseover="this.style.borderColor='${C.text2}'" onmouseout="this.style.borderColor='${C.border}'">CLOSE ✕</button>
    </div>
    <canvas id="mobile-compass-canvas" style="width:100%;display:block;border-radius:12px;margin-bottom:16px"></canvas>
    <div style="background:${C.surface2};border-radius:12px;padding:14px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span style="${label}">PARTY MATCHES</span>
        <button id="mobile-minor-toggle-btn" onclick="toggleMinor()" style="${mono};font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;border:1px solid ${C.border};background:transparent;color:${C.text3};cursor:pointer;letter-spacing:.06em;text-transform:uppercase">${S.showMinor?"HIDE MINOR":"SHOW MINOR"}</button>
      </div>
      <div id="mobile-party-list-box">${sidePartyListHTML(scored,hasAny)}</div>
    </div>
    <div style="background:${C.surface};border:1px solid ${C.border};border-radius:12px;padding:14px">
      <div style="${label};margin-bottom:12px">BY ISSUE</div>
      <div id="mobile-axis-box">${sideAxisHTML(axes)}</div>
    </div>
  </div>
</div>`;
}

function footerHTML(){
  return`<footer style="background:${C.mint};margin-top:64px;padding:32px 40px 48px;border-radius:20px 20px 0 0">
<p style="${sans};font-size:13px;color:#000;line-height:1.8;max-width:720px">
Created not for profit and for educational purposes by <a href="https://fergflannery.com" target="_blank" rel="noopener" style="color:#000;text-decoration:underline;text-underline-offset:3px">Ferg Flannery</a> · fergflannery.com. All information is gathered from publicly available sources.
</p>
<p style="${sans};font-size:12px;color:rgba(0,0,0,0.6);line-height:1.8;max-width:720px;margin-top:8px">
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
      <!-- Mobile-only compass toggle button -->
      <div class="show-mobile" style="display:none;margin-top:16px">
        <button onclick="toggleMobileCompass()" id="mobile-compass-btn" style="${mono};font-size:11px;font-weight:700;width:100%;padding:12px 20px;border-radius:24px;border:1px solid ${C.border};background:transparent;color:${C.text2};cursor:pointer;letter-spacing:.06em;text-transform:uppercase;display:flex;align-items:center;justify-content:space-between;transition:border-color .15s">
          <span>VIEW PARTY COMPASS</span>
          <span id="mobile-compass-arrow" style="transition:transform .25s;display:inline-block">▾</span>
        </button>
      </div>
    </div>
    <div class="hero-compass-col">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <span style="${label}">PARTY POSITIONS PREVIEW</span>
        <button id="avg-toggle-btn" onclick="toggleAverage()" style="${mono};font-size:10px;font-weight:700;padding:4px 12px;border-radius:20px;border:1px solid ${C.border};background:transparent;color:${C.text3};cursor:pointer;letter-spacing:.06em;text-transform:uppercase;transition:all .15s">${S.showAverage?'HIDE AVG':'OVERALL AVERAGE ✦'}</button>
      </div>
      <div style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:16px">
        <canvas id="intro-compass" style="width:100%;display:block;border-radius:12px"></canvas>
        <div style="${mono};font-size:12px;color:${C.mint};text-align:center;margin-top:10px;letter-spacing:.08em">START ANSWERING TO SEE YOUR POSITION</div>
        ${S.showAverage?`<p style="${mono};font-size:10px;color:${C.text3};text-align:center;margin-top:8px;line-height:1.6;letter-spacing:.04em">* This is the average result over time. Data only correlates to final results. NO PERSONAL DATA is stored.</p>`:''}
      </div>
    </div>
  </div>

  <!-- Mobile compass panel (hidden by default, toggled by button) -->
  <div id="mobile-compass-panel" style="display:none;padding:16px 0 24px;border-bottom:1px solid ${C.border}">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <span style="${label}">PARTY POSITIONS PREVIEW</span>
      <button id="avg-toggle-btn-mobile" onclick="toggleAverage()" style="${mono};font-size:10px;font-weight:700;padding:4px 12px;border-radius:20px;border:1px solid ${C.border};background:transparent;color:${C.text3};cursor:pointer;letter-spacing:.06em;text-transform:uppercase;transition:all .15s">${S.showAverage?'HIDE AVG':'OVERALL AVERAGE ✦'}</button>
    </div>
    <div id="mobile-compass-wrap" style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:16px">
      <canvas id="intro-compass-mobile" style="width:100%;display:block;border-radius:12px"></canvas>
      <div style="${mono};font-size:12px;color:${C.mint};text-align:center;margin-top:10px;letter-spacing:.08em">START ANSWERING TO SEE YOUR POSITION</div>
    </div>
  </div>

  <!-- LEGEND -->
  <div style="padding:56px 0 0">
    ${legendHTML()}
  </div>

  <!-- UNDERSTANDING THE RESULTS -->
  <div style="background:${C.mint};border-radius:20px;padding:28px 32px;margin:8px 0 0">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap">
      <div>
        <div style="${mono};font-size:10px;font-weight:700;letter-spacing:.12em;color:rgba(0,0,0,.5);margin-bottom:8px;text-transform:uppercase">UNDERSTANDING THE RESULTS</div>
        <p style="${sans};font-size:15px;color:#000;font-weight:500;line-height:1.65;max-width:520px;margin:0">What does the compass measure? What does Centre Left, Hard Left, or Centrist actually mean? A plain-English guide.</p>
      </div>
      <button onclick="go('guide')" style="${mono};font-size:11px;font-weight:700;padding:12px 24px;border-radius:24px;border:none;background:#000;color:#fff;cursor:pointer;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;flex-shrink:0;transition:opacity .15s" onmouseover="this.style.opacity='.75'" onmouseout="this.style.opacity='1'">READ THE GUIDE →</button>
    </div>
  </div>

  <!-- NEWS GRID -->
  <div style="padding-top:16px">
    ${newsGridHTML()}
  </div>

  <!-- TOPIC PILLS -->
  <div style="padding-bottom:64px">
    <div style="${label};margin-bottom:16px">TOPICS COVERED — ${CATS.length} CATEGORIES</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${CATS.map(c=>`<span style="${mono};font-size:12px;padding:5px 12px;border-radius:20px;border:1px solid ${C.border};color:${C.text3};letter-spacing:.06em;text-transform:uppercase">${c}</span>`).join("")}
    </div>
  </div>
  ${footerHTML()}
</div>`;
  applyTheme();startTicker();
  loadNewsGrid();
  requestAnimationFrame(()=>{
    const cv=$id("intro-compass");
    if(cv){
      const w=cv.parentElement.offsetWidth-32;
      cv.width=w;cv.height=Math.round(w*.7);
      const avgPos=S.showAverage&&S.avgData?computeAvgPos(S.avgData.p1):null;
      drawCompass("intro-compass",{},w,Math.round(w*.7),avgPos);
      if(S.showAverage){
        const btn=$id("avg-toggle-btn");
        if(btn){btn.style.borderColor=C.mint;btn.style.color=C.mint;btn.style.background='rgba(60,255,208,.08)';}
      }
    }
  });
}

/* ── QUIZ ────────────────────────────────── */
function renderQuiz(){
  const qs=activeQS();
  const cat=activeCATS()[S.cat];
  const catQs=qs.filter(q=>q.cat===cat);
  const axes=computeAxes(S.answers);
  const scored=matchParties(axes);
  const done=Object.keys(S.answers).length;
  const catDone=catQs.every(q=>S.answers[q.id]!==undefined);
  const hasAny=done>0;
  const modeLbl=S.mode==="quick"?`<span style="${mono};font-size:11px;padding:3px 10px;border-radius:20px;background:rgba(240,165,0,.15);color:#f0a500;border:1px solid rgba(240,165,0,.3);letter-spacing:.08em;margin-left:10px">QUICK MODE</span>`:``;

  const catBtns=activeCATS().map((c,i)=>{
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
        <span style="${label}">VIEW POSITION</span>
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
        <button id="next-btn" onclick="nextCat()" ${!catDone?"disabled":""} style="${mono};font-size:11px;font-weight:700;padding:12px 28px;border-radius:24px;border:none;background:${C.mint};color:#000;cursor:pointer;letter-spacing:.06em;transition:all .15s;${!catDone?"opacity:.3;cursor:not-allowed":""}">${S.cat===activeCATS().length-1?"SEE RESULTS →":"NEXT: "+activeCATS()[S.cat+1].toUpperCase()+" →"}</button>
      </div>
    </div>
    ${!catDone?`<p style="${mono};font-size:12px;color:${C.text3};text-align:right;letter-spacing:.06em;margin-top:8px">ANSWER ALL QUESTIONS TO CONTINUE</p>`:""}
  </div>

</div>

</div>
</div>
${mobileSheetHTML(axes,scored,hasAny,done,qs.length)}
<button class="mobile-fab" id="mobile-fab" onclick="showResultsSheet()">
  <span>VIEW POSITION</span>
  <span id="mobile-fab-count" style="opacity:.65;font-size:10px">${done}/${qs.length}</span>
</button>`;
  document.body.style.overflow="";
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
    <button onclick="go('guide')" style="${mono};font-size:11px;font-weight:700;padding:12px 24px;border-radius:24px;border:1px solid ${C.mint};background:rgba(60,255,208,.06);color:${C.mint};cursor:pointer;letter-spacing:.06em;transition:all .15s">WHAT DO MY RESULTS MEAN? →</button>
  </div>
  <p style="font-size:12px;color:${C.text3};line-height:1.7">Based on GE2024 manifestos, Oireachtas voting records, and published policy positions as of April 2026.</p>
  ${footerHTML()}
</div>`;
  applyTheme();startTicker();
  requestAnimationFrame(()=>{const cv=$id("compass-canvas");if(cv){const w=cv.parentElement.offsetWidth-32;drawCompass("compass-canvas",axes,w,Math.round(w*.6));}});
}

/* ── GUIDE ───────────────────────────────── */
function renderGuide(){
  const axes=computeAxes(S.answers);
  const hasResults=Object.keys(S.answers).length>0;
  const pos=hasResults?computePos(axes):null;
  const [myLean]=hasResults?getLean(pos.x,pos.y):[""];
  const isMine=(lean)=>lean.toLowerCase()===myLean.toLowerCase();
  const myBadge=`<span style="${mono};font-size:9px;font-weight:700;padding:3px 8px;border-radius:8px;background:${C.mint};color:#000;letter-spacing:.07em;flex-shrink:0">YOUR RESULT</span>`;

  // Position card helper
  const posCard=(lean,sub,col,desc)=>{
    const mine=isMine(lean);
    return`<div style="background:${mine?`rgba(60,255,208,.06)`:C.surface};border:1px solid ${mine?C.mint:C.border};border-radius:16px;padding:18px 20px">
<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px">
  <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
    <span style="width:9px;height:9px;border-radius:50%;flex-shrink:0;background:${col};display:inline-block;margin-top:2px"></span>
    <span style="${disp};font-size:clamp(16px,2vw,22px);color:${mine?C.mint:C.text1};letter-spacing:.04em;line-height:1">${lean.toUpperCase()}</span>
  </div>
  ${mine?myBadge:""}
</div>
<div style="${mono};font-size:10px;color:${C.text3};letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px">${sub}</div>
<p style="font-size:13px;color:${C.text2};line-height:1.65;margin:0">${desc}</p>
</div>`;
  };

  // Row band helper
  const band=(labelIcon,labelText,cols,cards)=>`
<div style="margin-bottom:32px">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid ${C.border}">
    <span style="${disp};font-size:28px;color:${C.text3};line-height:1">${labelIcon}</span>
    <div>
      <div style="${mono};font-size:11px;font-weight:700;color:${C.text2};letter-spacing:.1em;text-transform:uppercase">${labelText}</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:12px">${cards}</div>
</div>`;

  const isCentrist=isMine("Centrist");const isMod=isMine("Moderate");

  $id("root").innerHTML=headerHTML()+`
<div class="wrap" style="padding-bottom:80px">

  <!-- NAV -->
  <div style="padding:32px 0 24px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
    <button onclick="go(${hasResults?"'results'":"'intro'"})" style="${mono};font-size:11px;font-weight:700;padding:10px 20px;border-radius:24px;border:1px solid ${C.border};background:transparent;color:${C.text2};cursor:pointer;letter-spacing:.06em">← ${hasResults?"BACK TO RESULTS":"BACK TO HOME"}</button>
    ${hasResults?`<div style="${mono};font-size:11px;color:${C.text3};letter-spacing:.08em">YOUR RESULT: <span style="color:${C.mint}">${myLean.toUpperCase()}</span></div>`:""}
  </div>

  <!-- TITLE -->
  <h1 style="${disp};font-size:clamp(40px,6vw,80px);line-height:.9;color:${C.text1};letter-spacing:.03em;margin-bottom:12px">UNDERSTANDING<br><span style="color:${C.mint}">YOUR RESULTS.</span></h1>
  <p style="font-size:16px;color:${C.text2};line-height:1.7;max-width:600px;margin-bottom:48px">A plain-English guide to how the compass works and what each political position means in Ireland.</p>

  <!-- ① THE TWO AXES -->
  <div style="${label};margin-bottom:20px">① THE TWO AXES</div>
  <p style="font-size:14px;color:${C.text2};line-height:1.7;max-width:640px;margin-bottom:20px">Most politics talks about left vs right, but the compass measures two separate things. You can be economically left and socially conservative, or economically right and socially progressive — the two axes are independent.</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:48px">
    <div style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:24px">
      <div style="${mono};font-size:10px;font-weight:700;letter-spacing:.12em;color:${C.mint};margin-bottom:16px">HORIZONTAL — ECONOMIC</div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <span style="${disp};font-size:20px;color:${C.mint}">← LEFT</span>
        <div style="flex:1;height:3px;background:linear-gradient(to right,${C.mint}88,${C.border},${C.uv}88);border-radius:3px"></div>
        <span style="${disp};font-size:20px;color:${C.uv}">RIGHT →</span>
      </div>
      <p style="font-size:13px;color:${C.text3};line-height:1.65;margin:0 0 10px"><strong style="color:${C.mint}">Left:</strong> State ownership, public services, high taxes on wealth, redistribution.</p>
      <p style="font-size:13px;color:${C.text3};line-height:1.65;margin:0"><strong style="color:${C.uv}">Right:</strong> Free market, private enterprise, lower taxes, less state intervention.</p>
    </div>
    <div style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:24px">
      <div style="${mono};font-size:10px;font-weight:700;letter-spacing:.12em;color:${C.text2};margin-bottom:16px">VERTICAL — SOCIAL</div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <span style="${disp};font-size:20px;color:${C.text2}">↑ TRAD.</span>
        <div style="flex:1;height:3px;background:${C.border};border-radius:3px"></div>
        <span style="${disp};font-size:20px;color:${C.text2}">PROG. ↓</span>
      </div>
      <p style="font-size:13px;color:${C.text3};line-height:1.65;margin:0 0 10px"><strong style="color:${C.text2}">Traditional:</strong> National identity, cultural continuity, caution about rapid social change.</p>
      <p style="font-size:13px;color:${C.text3};line-height:1.65;margin:0"><strong style="color:${C.text2}">Progressive:</strong> Civil rights, LGBTQ+ equality, secularism, open immigration.</p>
    </div>
  </div>

  <!-- ② THE COMPASS -->
  <div style="${label};margin-bottom:12px">② THE COMPASS</div>
  <p style="font-size:14px;color:${C.text2};line-height:1.7;max-width:640px;margin-bottom:16px">Each dot is one of the 20 Irish parties, plotted by their policy positions. Your dot appears once you answer questions.</p>
  <div style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:16px;margin-bottom:8px">
    <canvas id="guide-compass" style="width:100%;display:block;border-radius:12px"></canvas>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;${mono};font-size:11px;color:${C.text3};letter-spacing:.07em;padding:0 4px;margin-bottom:48px">
    <span>← ECONOMIC LEFT</span>
    <span style="text-align:center">↑ TRAD. · · · PROG. ↓</span>
    <span>ECONOMIC RIGHT →</span>
  </div>

  <!-- ③ THE FOUR QUADRANTS -->
  <div style="${label};margin-bottom:12px">③ THE FOUR QUADRANTS</div>
  <p style="font-size:14px;color:${C.text2};line-height:1.7;max-width:640px;margin-bottom:20px">The compass is divided into four regions. Where you land describes the broad political tradition you align with.</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;border-radius:20px;overflow:hidden;border:1px solid ${C.border};margin-bottom:12px">
    ${[
      {col:"#3cb371",leans:["Left nationalist"],label:"LEFT NATIONALIST",corner:"↖ TOP LEFT",desc:"Economic left + traditional/nationalist. Combines state ownership and public investment with a strong national or republican identity."},
      {col:"#e07030",leans:["Right populist","Conservative"],label:"RIGHT POPULIST / CONSERVATIVE",corner:"↗ TOP RIGHT",desc:"Economic right + traditional/nationalist. Free market economics combined with cultural conservatism and national identity."},
      {col:C.uv,leans:["Hard left","Centre left","Progressive"],label:"HARD LEFT / CENTRE LEFT",corner:"↙ BOTTOM LEFT",desc:"Economic left + progressive. State intervention and redistribution combined with civil rights, equality, and social liberalism."},
      {col:"#9c5ab4",leans:["Liberal right","Centre right"],label:"LIBERAL / CENTRE RIGHT",corner:"↘ BOTTOM RIGHT",desc:"Economic right + progressive/moderate. Market economics combined with progressive or liberal social views."},
    ].map(q=>{const mine=q.leans.some(l=>isMine(l));return`<div style="background:${mine?`rgba(60,255,208,.05)`:C.surface};border:1px solid ${mine?C.mint:"transparent"};padding:20px 22px">
<div style="${mono};font-size:9px;color:${C.text3};letter-spacing:.06em;margin-bottom:8px">${q.corner}</div>
<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px">
  <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${q.col};display:inline-block"></span>
  <span style="${mono};font-size:11px;font-weight:700;color:${q.col};letter-spacing:.07em;text-transform:uppercase">${q.label}</span>
  ${mine?`<span style="${mono};font-size:8px;font-weight:700;padding:2px 7px;border-radius:8px;background:${C.mint};color:#000;letter-spacing:.06em">YOUR QUADRANT</span>`:""}
</div>
<p style="font-size:13px;color:${C.text2};line-height:1.6;margin:0">${q.desc}</p>
</div>`;}).join("")}
  </div>
  <div style="background:${C.surface};border:1px solid ${isCentrist||isMod?C.mint:C.border};border-radius:16px;padding:16px 20px;margin-bottom:48px">
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
      <span style="${mono};font-size:11px;font-weight:700;color:${C.text2};letter-spacing:.07em">⊙ CENTRIST / MODERATE — THE CENTRE</span>
      ${isCentrist||isMod?`<span style="${mono};font-size:8px;font-weight:700;padding:2px 8px;border-radius:8px;background:${C.mint};color:#000;letter-spacing:.06em">YOUR RESULT</span>`:""}
    </div>
    <p style="font-size:13px;color:${C.text3};line-height:1.65;margin:0">Scores close to the middle on both axes. Not the same as having no views — reflects a pragmatic, cross-spectrum set of positions without a dominant ideology.</p>
  </div>

  <!-- ④ ALL POSITIONS BY LAYER -->
  <div style="${label};margin-bottom:8px">④ ALL POSITIONS — BY LAYER</div>
  <p style="font-size:14px;color:${C.text2};line-height:1.7;max-width:640px;margin-bottom:28px">Positions are grouped by where they sit on the social axis — top to bottom, from most traditional to most progressive. Within each row, left to right reflects the economic axis.</p>

  ${band("↑","TRADITIONAL & NATIONALIST — top of the compass",3,
    posCard("Left nationalist","Socialist republican","#3cb371","Combines left-wing economics with a strong republican or national identity. Pro-unity, pro-state investment, sceptical of multinational capital. Rooted in the Irish republican tradition.")+
    posCard("Conservative","Traditional values","#c8963c","Prioritises traditional social values, community stability, and established institutions. Cautious about rapid cultural or social change. Economic positions vary.")+
    posCard("Right populist","Conservative nationalist","#e07030","Free market economics combined with cultural conservatism and national identity. Often sceptical of immigration, globalisation, and liberal institutions.")
  )}

  ${band("—","CENTRE — neither strongly traditional nor strongly progressive",3,
    posCard("Centre left","Social democrat","#4a90d9","Supports a mixed economy with strong public services and workers' rights. Accepts market economics while pushing for greater equality. The dominant tradition of Irish centre-left politics.")+
    (()=>{const mine=isCentrist||isMod;return`<div style="display:flex;flex-direction:column;gap:8px">
${posCard("Centrist","Pragmatic moderate",C.text2,"No strong ideological pattern. Pragmatic across issues — willing to take positions from both left and right depending on the topic.")}
${posCard("Moderate","Mixed views across issues",C.text3,"A balanced mix of views spanning the political spectrum. Approaches policy on a case-by-case basis rather than through a consistent ideology.")}</div>`;})()+
    posCard("Centre right","Liberal conservative","#5a8a5a","Favours market-led growth, lower taxes, and private enterprise while broadly supporting the welfare state. The political tradition of Fianna Fáil and Fine Gael.")
  )}

  ${band("↓","PROGRESSIVE & LIBERAL — bottom of the compass",3,
    posCard("Hard left","Progressive socialist",C.uv,"Believes the capitalist system must be fundamentally replaced. Favours collective ownership, nationalisation, and structural redistribution of wealth and power.")+
    posCard("Progressive","Strong social liberal",C.mint,"Strongly prioritises civil rights, LGBTQ+ equality, and secularism. Economic positions may vary — this result reflects a dominant social rather than economic orientation.")+
    posCard("Liberal right","Economically liberal, socially progressive","#9c5ab4","Free market economics with progressive social views. Low regulation, individual freedoms, open immigration, and pro-European integration.")
  )}

  <!-- METHODOLOGY -->
  <div style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;padding:24px 28px;margin-bottom:40px">
    <div style="${label};margin-bottom:10px">A NOTE ON METHODOLOGY</div>
    <p style="font-size:13px;color:${C.text2};line-height:1.75;margin:0 0 10px">Party positions are based on GE2024 manifestos, Oireachtas voting records, and published policy positions as of April 2026. No quiz can perfectly capture political alignment — this is a starting point for reflection, not a definitive classification.</p>
    <p style="font-size:13px;color:${C.text3};line-height:1.75;margin:0">The result categories are simplified summaries of complex political traditions. Real positions are nuanced and do not always fit neatly into any single label.</p>
  </div>

  <div style="display:flex;gap:12px;flex-wrap:wrap">
    <button onclick="go(${hasResults?"'results'":"'intro'"})" style="${mono};font-size:11px;font-weight:700;padding:12px 24px;border-radius:24px;border:1px solid ${C.border};background:transparent;color:${C.text2};cursor:pointer;letter-spacing:.06em">← ${hasResults?"BACK TO RESULTS":"BACK TO HOME"}</button>
    ${hasResults?`<button onclick="go('intro')" style="${mono};font-size:11px;font-weight:700;padding:12px 24px;border-radius:24px;border:1px solid ${C.border};background:transparent;color:${C.text2};cursor:pointer;letter-spacing:.06em">START AGAIN</button>`:""}
    ${!hasResults?`<button onclick="startQuiz('full')" style="${mono};font-size:11px;font-weight:700;padding:12px 24px;border-radius:24px;border:none;background:${C.mint};color:#000;cursor:pointer;letter-spacing:.06em">TAKE THE QUIZ →</button>`:""}
  </div>
  ${footerHTML()}
</div>`;
  applyTheme();startTicker();
  requestAnimationFrame(()=>{
    const cv=$id("guide-compass");
    if(cv){
      const w=cv.parentElement.offsetWidth-32;
      cv.width=w;cv.height=Math.round(w*.65);
      drawCompass("guide-compass",hasResults?axes:{},w,Math.round(w*.65));
    }
  });
}

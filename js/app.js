let S={phase:"intro",cat:0,answers:{},dark:true,showMinor:true,mode:"full",shuffledQS:null,shuffledCATS:null,hideCompass:false,showAverage:false,mobileCompassOpen:false,quizStartTime:null,pageStartTime:Date.now()};

// PostHog wrapper — safe no-op if key not yet configured
function track(event,props){
  try{if(window.posthog&&typeof posthog.capture==="function")posthog.capture(event,props||{});}catch(e){}
}

// Track time spent on current phase before leaving it
function trackPageLeave(nextPhase){
  const secs=Math.round((Date.now()-S.pageStartTime)/1000);
  track('page_exit',{phase:S.phase,duration_seconds:secs,next_phase:nextPhase});
  S.pageStartTime=Date.now();
}

function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function buildShuffledQS(mode){
  const base=mode==="quick"?QS.filter(q=>QUICK_IDS.has(q.id)):[...QS];
  const cats=shuffle([...CATS]);
  S.shuffledCATS=cats;
  const byCat={};
  base.forEach(q=>{(byCat[q.cat]=byCat[q.cat]||[]).push(q);});
  return cats.flatMap(c=>byCat[c]?shuffle(byCat[c]):[]);
}

function activeQS(){return S.shuffledQS||(S.mode==="quick"?QS.filter(q=>QUICK_IDS.has(q.id)):QS);}
function activeCATS(){return S.shuffledCATS||CATS;}

function $id(id){return document.getElementById(id)}

let tickIdx=0,tickTimer=null;

function startTicker(){
  if(tickTimer)clearInterval(tickTimer);
  function show(){
    const tt=$id("tick-tag"),tx=$id("tick-text"),tl=$id("tick-link");if(!tt||!tx)return;
    const it=TICKS[tickIdx];
    tt.textContent=it.tag;tt.className="tick-tag "+it.cls;
    tx.style.opacity=1;
    if(tl){tl.textContent=it.text;tl.href=it.url||"#";}
    else tx.textContent=it.text;
  }
  show();
  tickTimer=setInterval(()=>{
    const tx=$id("tick-text");if(!tx)return;
    tx.style.opacity=0;
    setTimeout(()=>{tickIdx=(tickIdx+1)%TICKS.length;show();},350);
  },5000);
}

function applyTheme(){
  document.documentElement.classList.toggle("dark",S.dark);
  const btn=$id("theme-btn");if(btn)btn.textContent=S.dark?"☀ Light":"☾ Dark";
}

function computeAvgPos(p1){
  if(!p1||!Object.keys(p1).length)return null;
  let sumX=0,sumY=0,total=0;
  Object.entries(p1).forEach(([abbr,count])=>{
    const party=PARTIES.find(p=>p.abbr===abbr);
    if(!party)return;
    const pos=computePos(party);
    sumX+=pos.x*count;sumY+=pos.y*count;total+=count;
  });
  return total>0?{x:sumX/total,y:sumY/total}:null;
}

window.shareResults=(lean,sub)=>{
  const axes=computeAxes(S.answers);
  const scored=matchParties(axes);
  const top=scored.slice(0,3).map(p=>p.name).join(', ');
  const text=`My TILT result: ${lean} (${sub})\nClosest matches: ${top}\nFind your political leaning in Ireland →`;
  const url=window.location.href;
  track('result_shared',{lean,method:navigator.share?'native_share':'clipboard'});
  if(navigator.share){
    navigator.share({title:'TILT — My Political Leaning',text,url}).catch(()=>{});
  } else {
    navigator.clipboard.writeText(text+'\n'+url).then(()=>{
      const btn=document.querySelector('[onclick^="shareResults"]');
      if(btn){const orig=btn.innerHTML;btn.innerHTML='✓ COPIED';setTimeout(()=>{btn.innerHTML=orig;},2000);}
    }).catch(()=>{});
  }
};

window.go=p=>{
  trackPageLeave(p);
  S.phase=p;
  if(p==="quiz"&&S.cat===undefined)S.cat=0;
  if(p==="results"){
    // POST top 3 results — only party abbreviations, no personal data
    try{
      const axes=computeAxes(S.answers);
      const scored=matchParties(axes);
      if(scored.length>=1&&Object.keys(axes).length>2){
        const lastSubmit=parseInt(localStorage.getItem('tilt_last_submit')||'0');
        if(Date.now()-lastSubmit>3600000){
          fetch('/api/results',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({result1:scored[0].abbr,result2:scored[1]?.abbr||'',result3:scored[2]?.abbr||''}),
          }).catch(()=>{});
          localStorage.setItem('tilt_last_submit',String(Date.now()));
        }
        // Track quiz completion
        const [lean,sub]=getLean(computePos(axes).x,computePos(axes).y);
        const quizDuration=S.quizStartTime?Math.round((Date.now()-S.quizStartTime)/1000):null;
        track('quiz_completed',{
          mode:S.mode,
          lean,
          sub,
          top_match:scored[0]?.abbr,
          top_match_pct:scored[0]?.match,
          answers_given:Object.keys(S.answers).length,
          quiz_duration_seconds:quizDuration,
        });
      }
    }catch(e){}
  }
  if(p==="guide")track('guide_viewed',{from:S.phase});
  if(p==="intro"&&S.phase!=="intro")track('page_view',{phase:'intro'});
  render();
};
window.startQuiz=mode=>{
  trackPageLeave("quiz");
  S.mode=mode;S.answers={};S.cat=0;S.phase="quiz";S.quizStartTime=Date.now();
  S.shuffledQS=buildShuffledQS(mode);
  track('quiz_started',{mode,total_questions:S.shuffledQS.length});
  render();
};
window.setCat=i=>{S.cat=i;render();};
window.prevCat=()=>{if(S.cat>0){S.cat--;render();}};
window.nextCat=()=>{
  const catQs=activeQS().filter(q=>q.cat===activeCATS()[S.cat]);
  if(!catQs.every(q=>S.answers[q.id]!==undefined))return;
  if(S.cat<activeCATS().length-1){S.cat++;render();}else go("results");
};
window.setAns=(id,v)=>{
  S.answers[id]=Number(v);
  const n=Number(v);
  const lbl=$id("ans-"+id);
  if(lbl){lbl.textContent=VLABELS[String(n)];lbl.className="val-lbl set";}
  [-2,-1,0,1,2].forEach(k=>{
    const b=$id(`btn-${id}-${k}`);if(!b)return;
    if(k!==n){b.className="tap-btn";return;}
    b.className=k<0?"tap-btn neg":k>0?"tap-btn pos":"tap-btn neu";
  });
  const card=$id(`card-${id}`);if(card)card.className="q-card answered";
  const axes=computeAxes(S.answers);
  const hasAny=Object.keys(axes).length>0;
  const scored=matchParties(axes);
  if(!S.hideCompass){
    const cv=$id("compass-canvas");
    if(cv){const w=cv.parentElement.offsetWidth-2;const h=Math.round(w*.75);cv.width=w;cv.height=h;drawCompass("compass-canvas",axes,w,h);}
    const pl=$id("party-list-box");if(pl)pl.innerHTML=sidePartyListHTML(scored,hasAny);
  }
  const ab=$id("axis-box");if(ab)ab.innerHTML=sideAxisHTML(axes);
  // Update mobile sheet if present
  const mpl=$id("mobile-party-list-box");if(mpl)mpl.innerHTML=sidePartyListHTML(scored,hasAny);
  const mab=$id("mobile-axis-box");if(mab)mab.innerHTML=sideAxisHTML(axes);
  const sheet=$id("results-sheet");
  if(sheet&&sheet.classList.contains("open")){
    const mcv=$id("mobile-compass-canvas");
    if(mcv){const w=mcv.parentElement.offsetWidth;requestAnimationFrame(()=>drawCompass("mobile-compass-canvas",axes,w,Math.round(w*.65)));}
  }
  // Update FAB count
  const answeredCount=Object.keys(S.answers).length;
  const totalQ=activeQS().length;
  const pct=Math.round((answeredCount/totalQ)*100);
  const fc=$id("mobile-fab-count");if(fc)fc.textContent=`${answeredCount}/${totalQ}`;
  const pb=$id("pbar");if(pb)pb.style.width=pct+"%";
  const npb=$id("nav-pbar");if(npb)npb.style.width=pct+"%";
  const navPct=npb?npb.closest("nav")?.querySelector(".nav-pct"):null;
  // Update nav pill text nodes directly
  const navPill=$id("nav-pbar");
  if(navPill){
    const pillRow=navPill.parentElement?.parentElement;
    if(pillRow){
      const spans=pillRow.querySelectorAll("span");
      if(spans[0])spans[0].innerHTML=`${answeredCount}<span style="opacity:.5"> / ${totalQ}</span>`;
      if(spans[1])spans[1].textContent=pct+"%";
    }
  }
  const catQs=activeQS().filter(q=>q.cat===activeCATS()[S.cat]);
  const catDone=catQs.every(q=>S.answers[q.id]!==undefined);
  const btn=$id("next-btn");
  if(btn){
    btn.disabled=!catDone;
    btn.style.opacity=catDone?"1":"0.3";
    btn.style.cursor=catDone?"pointer":"not-allowed";
  }
};
window.showResultsSheet=()=>{
  const sheet=$id("results-sheet"),bd=$id("results-backdrop");
  if(!sheet)return;
  sheet.classList.add("open");if(bd)bd.classList.add("open");
  document.body.style.overflow="hidden";
  const axes=computeAxes(S.answers);
  requestAnimationFrame(()=>{
    const mcv=$id("mobile-compass-canvas");
    if(mcv){const w=mcv.parentElement.offsetWidth||Math.min(window.innerWidth-40,480);drawCompass("mobile-compass-canvas",axes,w,Math.round(w*.65));}
  });
};
window.hideResultsSheet=()=>{
  const sheet=$id("results-sheet"),bd=$id("results-backdrop");
  if(sheet)sheet.classList.remove("open");if(bd)bd.classList.remove("open");
  document.body.style.overflow="";
};
window.themeToggle=()=>{S.dark=!S.dark;applyTheme();const axes=computeAxes(S.answers);if(!S.hideCompass)drawCompass("compass-canvas",axes);};
window.toggleMobileCompass=()=>{
  S.mobileCompassOpen=!S.mobileCompassOpen;
  const panel=$id("mobile-compass-panel");
  const arrow=$id("mobile-compass-arrow");
  const mbtn=$id("mobile-compass-btn");
  if(!panel)return;
  panel.style.display=S.mobileCompassOpen?"block":"none";
  if(arrow)arrow.style.transform=S.mobileCompassOpen?"rotate(180deg)":"rotate(0deg)";
  if(mbtn)mbtn.style.borderColor=S.mobileCompassOpen?C.mint:C.border;
  if(S.mobileCompassOpen){
    requestAnimationFrame(()=>{
      const cv=$id("intro-compass-mobile");
      if(cv){
        const w=cv.parentElement.offsetWidth-32;
        cv.width=w;cv.height=Math.round(w*.7);
        const avgPos=S.showAverage&&S.avgData?computeAvgPos(S.avgData.p1):null;
        drawCompass("intro-compass-mobile",{},w,Math.round(w*.7),avgPos);
      }
      if(S.showAverage){
        const b=$id("avg-toggle-btn-mobile");
        if(b){b.style.borderColor=C.mint;b.style.color=C.mint;b.style.background='rgba(60,255,208,.08)';}
      }
    });
  }
};
window.toggleAverage=async()=>{
  S.showAverage=!S.showAverage;
  const btn=$id("avg-toggle-btn");
  const btnM=$id("avg-toggle-btn-mobile");
  if(S.showAverage&&!S.avgData){
    [btn,btnM].forEach(b=>{if(b){b.textContent="LOADING…";b.style.opacity=".6";}});
    try{
      const r=await fetch("/api/results");
      if(r.ok)S.avgData=await r.json();
      else S.showAverage=false;
    }catch(e){S.showAverage=false;}
    [btn,btnM].forEach(b=>{if(b)b.style.opacity="1";});
    if(!S.showAverage){
      [btn,btnM].forEach(b=>{if(b)b.textContent="OVERALL AVERAGE ✦";});
      return;
    }
  }
  const avgBtnStyle=(b)=>{if(!b)return;b.textContent=S.showAverage?"HIDE AVG ✦":"OVERALL AVERAGE ✦";b.style.borderColor=S.showAverage?C.mint:C.border;b.style.color=S.showAverage?C.mint:C.text3;b.style.background=S.showAverage?"rgba(60,255,208,.08)":"transparent";};
  avgBtnStyle(btn);avgBtnStyle(btnM);
  const canvasWrap=$id("intro-compass")?.parentElement;
  if(canvasWrap){
    // Disclaimer
    let disc=canvasWrap.querySelector(".avg-disc");
    if(S.showAverage&&!disc){
      disc=document.createElement("p");disc.className="avg-disc";
      disc.style.cssText=`font-family:'Space Mono',monospace;font-size:10px;color:${C.text3};text-align:center;margin-top:8px;line-height:1.6;letter-spacing:.04em`;
      disc.textContent="* Average result over time. Data only correlates to final results. NO PERSONAL DATA is stored.";
      canvasWrap.appendChild(disc);
    }else if(!S.showAverage&&disc)disc.remove();
    // Stats row
    let stats=canvasWrap.querySelector(".avg-stats");
    if(S.showAverage&&S.avgData){
      const top=S.avgData.top3||[];const total=S.avgData.total||0;
      if(!stats){
        stats=document.createElement("div");stats.className="avg-stats";
        stats.style.cssText=`margin-top:10px;padding-top:10px;border-top:1px solid ${C.border}`;
        const discEl=canvasWrap.querySelector(".avg-disc");
        canvasWrap.insertBefore(stats,discEl||null);
      }
      if(total===0){
        stats.innerHTML=`<p style="font-family:'Space Mono',monospace;font-size:10px;color:${C.text3};text-align:center;letter-spacing:.06em;margin:0">NO RESULTS YET — BE THE FIRST TO COMPLETE THE QUIZ</p>`;
      } else {
        const chips=top.map((t,i)=>{
          const party=PARTIES.find(p=>p.abbr===t.abbr);
          return`<span style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.06em;font-weight:700;color:${i===0?C.mint:C.text2}">#${i+1} ${t.abbr}${party?` <span style="font-weight:400;color:${C.text3};font-size:10px">${party.name}</span>`:""}</span>`;
        }).join(`<span style="color:${C.border};margin:0 6px">·</span>`);
        stats.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${chips}</div><span style="font-family:'Space Mono',monospace;font-size:10px;color:${C.text3};letter-spacing:.06em;white-space:nowrap">${total.toLocaleString()} results</span></div>`;
      }
    }else if(!S.showAverage&&stats)stats.remove();
  }
  const avgPos=S.showAverage&&S.avgData?computeAvgPos(S.avgData.p1):null;
  const cv=$id("intro-compass");
  if(cv){const w=cv.parentElement.offsetWidth-32;drawCompass("intro-compass",{},w,Math.round(w*.7),avgPos);}
  const cvm=$id("intro-compass-mobile");
  if(cvm&&S.mobileCompassOpen){const w=cvm.parentElement.offsetWidth-32;drawCompass("intro-compass-mobile",{},w,Math.round(w*.7),avgPos);}
};
window.toggleCompass=()=>{
  S.hideCompass=!S.hideCompass;
  const btn=$id("compass-toggle-btn");
  const mono="font-family:'Space Mono',monospace";
  const C={surface:'#1c1c1c',surface2:'#242424',border:'#2d2d2d',mint:'#3cffd0',text3:'#5a5a5a'};
  if(btn){
    btn.textContent=S.hideCompass?"SHOW":"HIDE";
    btn.style.border=`1px solid ${S.hideCompass?C.border:C.mint}`;
    btn.style.background=S.hideCompass?"transparent":"rgba(60,255,208,.1)";
    btn.style.color=S.hideCompass?C.text3:C.mint;
  }
  const box=$id("live-results-box");
  if(box){
    if(S.hideCompass){
      box.innerHTML=`<p style="${mono};font-size:10px;color:${C.text3};text-align:center;padding:24px 0;letter-spacing:.08em;text-transform:uppercase">RESULTS HIDDEN<br><span style="opacity:.5;font-size:9px">REVEALED AT THE END</span></p>`;
    } else {
      const axes=computeAxes(S.answers);const hasAny=Object.keys(S.answers).length>0;
      const scored=matchParties(axes);
      box.innerHTML=`<canvas id="compass-canvas" style="width:100%;display:block;border-radius:12px;margin-bottom:12px"></canvas>
<div style="background:${C.surface2};border-radius:12px;padding:12px">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
<span style="${mono};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:${C.text3}">PARTY MATCHES</span>
<button id="minor-toggle-btn" onclick="toggleMinor()" style="${mono};font-size:9px;font-weight:700;padding:3px 10px;border-radius:20px;border:1px solid ${C.border};background:transparent;color:${C.text3};cursor:pointer;letter-spacing:.06em;text-transform:uppercase">${S.showMinor?"HIDE MINOR":"SHOW MINOR"}</button>
</div>
<div id="party-list-box">${sidePartyListHTML(scored,hasAny)}</div>
</div>`;
      requestAnimationFrame(()=>{
        const cv=$id("compass-canvas");
        if(cv){const w=cv.parentElement.offsetWidth-2;const h=Math.round(w*.75);cv.width=w;cv.height=h;drawCompass("compass-canvas",axes,w,h);}
      });
    }
  }
};
window.toggleMinor=()=>{
  S.showMinor=!S.showMinor;
  const lbl=S.showMinor?"HIDE MINOR":"SHOW MINOR";
  [$id("minor-toggle-btn"),$id("mobile-minor-toggle-btn")].forEach(b=>{if(b)b.textContent=S.phase==="results"?(S.showMinor?"HIDE MINOR PARTIES":"SHOW MINOR PARTIES"):lbl;});
  if(S.phase==="quiz"){
    const axes=computeAxes(S.answers);const hasAny=Object.keys(S.answers).length>0;
    const scored=matchParties(axes);
    const cv=$id("compass-canvas");if(cv){const w=cv.parentElement.offsetWidth-2;const h=Math.round(w*.75);cv.width=w;cv.height=h;drawCompass("compass-canvas",axes,w,h);}
    const pl=$id("party-list-box");if(pl)pl.innerHTML=sidePartyListHTML(scored,hasAny);
    const mpl=$id("mobile-party-list-box");if(mpl)mpl.innerHTML=sidePartyListHTML(scored,hasAny);
  } else if(S.phase==="results"){
    const axes=computeAxes(S.answers);const scored=matchParties(axes);
    const list=S.showMinor?scored:scored.filter(p=>p.size!=="minor");
    const t5=$id("results-top5");if(t5)t5.innerHTML=resultTop5HTML(list.slice(0,5));
    const ap=$id("results-all-parties");if(ap)ap.innerHTML=resultAllPartiesHTML(list);
    const cv=$id("compass-canvas");
    if(cv){const w=cv.parentElement.offsetWidth||500;drawCompass("compass-canvas",axes,w,Math.round(w*0.65));}
  }
};

window.toggleAnswersSection=()=>{
  const body=$id("answers-body");
  const arrow=$id("answers-arrow");
  const btn=$id("answers-toggle-btn");
  if(!body)return;
  const open=body.style.display==="none"||body.style.display==="";
  body.style.display=open?"block":"none";
  if(arrow)arrow.style.transform=open?"rotate(180deg)":"rotate(0deg)";
  if(btn)btn.setAttribute("aria-expanded",open?"true":"false");
};

function render(){
  if(S.phase==="intro")renderIntro();
  else if(S.phase==="quiz")renderQuiz();
  else if(S.phase==="guide")renderGuide();
  else renderResults();
}

render();
track('page_view',{phase:'intro'});

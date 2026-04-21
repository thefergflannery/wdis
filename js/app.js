let S={phase:"intro",cat:0,answers:{},dark:true,showMinor:true,mode:"full",shuffledQS:null,shuffledCATS:null,hideCompass:false};

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

window.go=p=>{S.phase=p;if(p==="quiz"&&S.cat===undefined)S.cat=0;render();};
window.startQuiz=mode=>{S.mode=mode;S.answers={};S.cat=0;S.phase="quiz";S.shuffledQS=buildShuffledQS(mode);render();};
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
    drawCompass("compass-canvas",axes,236,236);
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
  const fc=$id("mobile-fab-count");if(fc)fc.textContent=`${answeredCount}/${activeQS().length}`;
  const pb=$id("pbar");if(pb)pb.style.width=Math.round((answeredCount/activeQS().length)*100)+"%";
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
      requestAnimationFrame(()=>drawCompass("compass-canvas",axes,284,220));
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
    drawCompass("compass-canvas",axes,236,236);
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

function render(){
  if(S.phase==="intro")renderIntro();
  else if(S.phase==="quiz")renderQuiz();
  else renderResults();
}

render();

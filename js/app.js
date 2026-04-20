let S={phase:"intro",cat:0,answers:{},dark:false,showMinor:true,mode:"full"};

function activeQS(){return S.mode==="quick"?QS.filter(q=>QUICK_IDS.has(q.id)):QS;}

function $id(id){return document.getElementById(id)}

let tickIdx=0,tickTimer=null;

function startTicker(){
  if(tickTimer)clearInterval(tickTimer);
  function show(){
    const tt=$id("tick-tag"),tx=$id("tick-text");if(!tt||!tx)return;
    const it=TICKS[tickIdx];tt.textContent=it.tag;tt.className="tick-tag "+it.cls;tx.textContent=it.text;tx.style.opacity=1;
  }
  show();
  tickTimer=setInterval(()=>{
    const tx=$id("tick-text");if(!tx)return;
    tx.style.opacity=0;
    setTimeout(()=>{tickIdx=(tickIdx+1)%TICKS.length;show();},350);
  },5000);
}

function applyTheme(){
  document.documentElement.setAttribute("data-theme",S.dark?"dark":"");
  const btn=$id("theme-btn");if(btn)btn.textContent=S.dark?"☀ Light mode":"☾ Dark mode";
}

window.go=p=>{S.phase=p;if(p==="quiz"&&S.cat===undefined)S.cat=0;render();};
window.startQuiz=mode=>{S.mode=mode;S.answers={};S.cat=0;S.phase="quiz";render();};
window.setCat=i=>{S.cat=i;render();};
window.prevCat=()=>{if(S.cat>0){S.cat--;render();}};
window.nextCat=()=>{
  const catQs=activeQS().filter(q=>q.cat===CATS[S.cat]);
  if(!catQs.every(q=>S.answers[q.id]!==undefined))return;
  if(S.cat<CATS.length-1){S.cat++;render();}else go("results");
};
window.setAns=(id,v)=>{
  S.answers[id]=Number(v);
  const n=Number(v);
  const lbl=$id("ans-"+id);
  if(lbl){lbl.textContent=VLABELS[String(n)];lbl.className="val-lbl set";}
  // highlight selected button, reset others
  [-2,-1,0,1,2].forEach(k=>{
    const b=$id(`btn-${id}-${k}`);if(!b)return;
    if(k!==n){b.className="tap-btn";return;}
    b.className=k<0?"tap-btn neg":k>0?"tap-btn pos":"tap-btn neu";
  });
  const card=$id(`card-${id}`);if(card)card.className="q-card answered";
  const axes=computeAxes(S.answers);
  const hasAny=Object.keys(axes).length>0;
  drawCompass("compass-canvas",axes,236,236);
  const scored=matchParties(axes);
  const pl=$id("party-list-box");if(pl)pl.innerHTML=sidePartyListHTML(scored,hasAny);
  const ab=$id("axis-box");if(ab)ab.innerHTML=sideAxisHTML(axes);
  const pb=$id("pbar");if(pb)pb.style.width=Math.round((Object.keys(S.answers).length/activeQS().length)*100)+"%";
  const catQs=activeQS().filter(q=>q.cat===CATS[S.cat]);
  const catDone=catQs.every(q=>S.answers[q.id]!==undefined);
  const btn=$id("next-btn");if(btn)btn.disabled=!catDone;
};
window.themeToggle=()=>{S.dark=!S.dark;applyTheme();const axes=computeAxes(S.answers);drawCompass("compass-canvas",axes);};
window.toggleMinor=()=>{
  S.showMinor=!S.showMinor;
  const btn=$id("minor-toggle-btn");
  if(btn){btn.textContent=S.showMinor?"Hide minor":"Show minor";btn.className=S.showMinor?"minor-toggle on":"minor-toggle";}
  if(S.phase==="quiz"){
    const axes=computeAxes(S.answers);const hasAny=Object.keys(axes).length>0;
    const scored=matchParties(axes);
    drawCompass("compass-canvas",axes,236,236);
    const pl=$id("party-list-box");if(pl)pl.innerHTML=sidePartyListHTML(scored,hasAny);
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

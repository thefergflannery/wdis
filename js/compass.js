function drawCompass(canvasId,axes,w,h){
  const cv=$id(canvasId);if(!cv)return;
  cv.width=w||300;cv.height=h||220;
  const ctx=cv.getContext("2d");
  const W=cv.width,H=cv.height,cx=W/2,cy=H/2,sc=W/7.5;
  const dark=document.documentElement.classList.contains("dark");
  // background
  ctx.fillStyle=dark?"#1c1c1c":"#f8fafc";ctx.fillRect(0,0,W,H);
  // grid lines
  ctx.strokeStyle=dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)";ctx.lineWidth=0.5;
  [-2,-1,1,2].forEach(v=>{
    ctx.beginPath();ctx.moveTo(cx+v*sc,4);ctx.lineTo(cx+v*sc,H-4);ctx.stroke();
    ctx.beginPath();ctx.moveTo(4,cy+v*sc);ctx.lineTo(W-4,cy+v*sc);ctx.stroke();
  });
  // main axes
  ctx.strokeStyle=dark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.12)";ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(4,cy);ctx.lineTo(W-4,cy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,4);ctx.lineTo(cx,H-4);ctx.stroke();
  // corner labels
  const lc=dark?"rgba(255,255,255,0.25)":"rgba(0,0,0,0.3)";
  ctx.fillStyle=lc;ctx.font=`bold 8px 'Space Mono',monospace`;
  ctx.textAlign="left";ctx.fillText("LEFT",6,13);
  ctx.textAlign="right";ctx.fillText("RIGHT",W-6,13);
  ctx.textAlign="left";ctx.fillText("PROG",6,H-5);
  ctx.textAlign="right";ctx.fillText("TRAD",W-6,H-5);
  // party dots
  const pos=computePos(axes);
  const hasAny=Object.keys(axes).length>0;
  const visParties=S.showMinor?PARTIES:PARTIES.filter(p=>p.size!=="minor");
  visParties.forEach(p=>{
    const px=cx+p.econ*sc;const py=cy-((p.soc+p.nat)/2)*sc;
    // dot
    ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);
    ctx.fillStyle=p.col;ctx.globalAlpha=0.75;ctx.fill();ctx.globalAlpha=1;
    // label
    ctx.fillStyle=dark?"rgba(255,255,255,0.45)":"rgba(0,0,0,0.45)";
    ctx.font=`600 8px 'Space Grotesk',sans-serif`;ctx.textAlign="left";
    ctx.fillText(p.abbr,px+6,py+3);
  });
  // YOU dot — mint on dark, near-black on light
  if(hasAny){
    const ux=cx+pos.x*sc;const uy=cy-pos.y*sc;
    // outer ring
    ctx.beginPath();ctx.arc(ux,uy,14,0,Math.PI*2);
    ctx.strokeStyle=dark?"rgba(60,255,208,0.3)":"rgba(0,0,0,0.2)";ctx.lineWidth=1.5;ctx.stroke();
    // fill
    ctx.beginPath();ctx.arc(ux,uy,9,0,Math.PI*2);
    ctx.fillStyle=dark?"#3cffd0":"#131313";ctx.fill();
    // label
    ctx.fillStyle=dark?"rgba(60,255,208,0.9)":"rgba(0,0,0,0.75)";
    ctx.font=`bold 9px 'Space Mono',monospace`;ctx.textAlign="left";
    ctx.fillText("YOU",ux+16,uy+4);
  }
}

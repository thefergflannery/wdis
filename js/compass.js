function drawCompass(canvasId,axes,w,h){
  const cv=$id(canvasId);if(!cv)return;
  cv.width=w||220;cv.height=h||220;
  const ctx=cv.getContext("2d");
  const W=cv.width,H=cv.height,cx=W/2,cy=H/2,sc=W/7;
  const dark=S.dark;
  ctx.fillStyle=dark?"#2c2c2e":"#f0f0ee";ctx.fillRect(0,0,W,H);
  ctx.strokeStyle=dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";ctx.lineWidth=0.5;
  [-2,-1,1,2].forEach(v=>{
    ctx.beginPath();ctx.moveTo(cx+v*sc,4);ctx.lineTo(cx+v*sc,H-4);ctx.stroke();
    ctx.beginPath();ctx.moveTo(4,cy+v*sc);ctx.lineTo(W-4,cy+v*sc);ctx.stroke();
  });
  ctx.strokeStyle=dark?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.18)";ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(4,cy);ctx.lineTo(W-4,cy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,4);ctx.lineTo(cx,H-4);ctx.stroke();
  const lc=dark?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.38)";
  ctx.fillStyle=lc;ctx.font=`9px -apple-system,sans-serif`;
  ctx.textAlign="left";ctx.fillText("LEFT",4,12);
  ctx.textAlign="right";ctx.fillText("RIGHT",W-4,12);
  ctx.textAlign="left";ctx.fillText("PROG",4,H-4);
  ctx.textAlign="right";ctx.fillText("TRAD",W-4,H-4);
  const pos=computePos(axes);
  const hasAny=Object.keys(axes).length>0;
  const visParties=S.showMinor?PARTIES:PARTIES.filter(p=>p.size!=="minor");
  visParties.forEach(p=>{
    const px=cx+p.econ*sc;const py=cy-((p.soc+p.nat)/2)*sc;
    ctx.beginPath();ctx.arc(px,py,3.5,0,Math.PI*2);
    ctx.fillStyle=p.col;ctx.globalAlpha=0.6;ctx.fill();ctx.globalAlpha=1;
    ctx.fillStyle=dark?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.5)";
    ctx.font=`8px -apple-system,sans-serif`;ctx.textAlign="left";
    ctx.fillText(p.abbr,px+5,py+3);
  });
  if(hasAny){
    const ux=cx+pos.x*sc;const uy=cy-pos.y*sc;
    ctx.beginPath();ctx.arc(ux,uy,8,0,Math.PI*2);
    ctx.fillStyle=dark?"#f2f2f7":"#111111";ctx.fill();
    ctx.beginPath();ctx.arc(ux,uy,13,0,Math.PI*2);
    ctx.strokeStyle=dark?"rgba(242,242,247,0.4)":"rgba(0,0,0,0.35)";ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle=dark?"rgba(242,242,247,0.85)":"rgba(0,0,0,0.75)";
    ctx.font=`bold 9px -apple-system,sans-serif`;ctx.textAlign="left";
    ctx.fillText("YOU",ux+15,uy+4);
  }
}

function computeAxes(a){
  const s={},c={};
  QS.forEach(q=>{const v=a[q.id];if(v===undefined)return;s[q.axis]=(s[q.axis]||0)+v*q.dir;c[q.axis]=(c[q.axis]||0)+1;});
  const o={};Object.keys(s).forEach(ax=>{o[ax]=s[ax]/c[ax];});return o;
}

function computePos(axes){
  const ea=["econ","housing","health","tax","employment"],sa=["soc","nat","fuel","rural","lgbtq","gender","migration"];
  let ex=0,ec=0,sx=0,sc=0;
  ea.forEach(a=>{if(axes[a]!==undefined){ex+=axes[a];ec++;}});
  sa.forEach(a=>{if(axes[a]!==undefined){sx+=axes[a];sc++;}});
  return{x:ec>0?ex/ec:0,y:sc>0?sx/sc:0};
}

function matchParties(axes){
  const hasAny=Object.keys(axes).length>0;
  return PARTIES.map(p=>{
    if(!hasAny)return{...p,match:50};
    const axKeys=["econ","soc","nat","climate","housing","health","fuel","animals","europe","culture","transport","crime","childcare","tax","employment","rural","lgbtq","gender","migration"];
    let diff=0,n=0;
    axKeys.forEach(ax=>{if(axes[ax]!==undefined){diff+=Math.abs(axes[ax]-p[ax]);n++;}});
    const avg=n>0?diff/n:3;
    return{...p,match:Math.max(0,Math.min(100,Math.round((1-avg/5)*100)))};
  }).sort((a,b)=>b.match-a.match);
}

function getLean(x,y){
  if(x<-1.5&&y<-1)return["Hard left","Progressive socialist"];
  if(x<-0.5&&y<-0.5)return["Centre left","Social democrat"];
  if(x<-1.5&&y>0.5)return["Left nationalist","Socialist republican"];
  if(x>1.5&&y>1)return["Right populist","Conservative nationalist"];
  if(x>0.5&&y>0)return["Centre right","Liberal conservative"];
  if(x>0.5&&y<-0.5)return["Liberal right","Economically liberal, socially progressive"];
  if(Math.abs(x)<0.4&&Math.abs(y)<0.4)return["Centrist","Pragmatic moderate"];
  if(y<-1.5)return["Progressive","Strong social liberal"];
  if(y>1.5)return["Conservative","Traditional values"];
  return["Moderate","Mixed views across issues"];
}

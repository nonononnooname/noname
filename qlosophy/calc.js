/* ============================================================
   QLOSOPHY — Screen 7 · Economy (calculator, chart, roadmap, CTA)
   ============================================================ */
(function(){
  'use strict';
  const $=(s)=>document.getElementById(s);
  const iB=$('iBudget'),iV=$('iVlr'),iM=$('iMcr');
  const vB=$('vBudget'),vV=$('vVlr'),vM=$('vMcr');
  const kReach=$('kReach'),kAud=$('kAud'),kRoi=$('kRoi'),chPeak=$('chPeak');
  const cv=$('roiChart'); const ctx=cv&&cv.getContext('2d');
  const dpr=Math.min(window.devicePixelRatio||1,2);

  const LTV=180;
  function fmt(n){ if(n>=1e6) return (n/1e6).toFixed(n>=1e7?0:1)+'M'; if(n>=1e3) return (n/1e3).toFixed(n>=1e4?0:1)+'K'; return Math.round(n).toString(); }

  let roiFinal=0;
  function model(){
    const B=+iB.value, V=+iV.value, M=+iM.value;
    if(vB)vB.textContent='$'+(+B).toLocaleString();
    if(vV)vV.textContent=V.toFixed(1)+'×';
    if(vM)vM.textContent=M.toFixed(1)+'%';
    const reach=B*480*V;
    const audience=reach*0.0032;
    const custMo=audience*(M/100);
    const revenue=custMo*12*LTV;
    const cost=B*12;
    const roi=revenue/cost;
    roiFinal=roi;
    if(kReach)kReach.textContent=fmt(reach);
    if(kAud)kAud.textContent=fmt(audience);
    if(kRoi)kRoi.textContent=roi.toFixed(1)+'×';
    if(chPeak)chPeak.textContent='PEAK '+roi.toFixed(1)+'×';
    draw(V);
  }

  function sizeChart(){ if(!cv)return; const w=cv.clientWidth||520,h=200; cv.width=w*dpr; cv.height=h*dpr; }
  function draw(V){
    if(!ctx)return; const W=cv.width,H=cv.height; ctx.clearRect(0,0,W,H);
    const padL=8*dpr,padR=8*dpr,padT=10*dpr,padB=18*dpr;
    const x0=padL,x1=W-padR,y0=padT,y1=H-padB;
    // grid
    ctx.strokeStyle='rgba(36,48,66,.6)'; ctx.lineWidth=1;
    for(let g=0;g<=4;g++){ const y=y0+(y1-y0)*g/4; ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke(); }
    // curve: cumulative ROI ramp over 12 months, faster with higher virality
    const tau=3.4/Math.max(0.6,V*0.7);
    const pts=[];
    for(let m=0;m<=12;m++){
      const frac=1-Math.exp(-m/ (tau*2));
      const val=roiFinal*frac;
      const x=x0+(x1-x0)*(m/12);
      const maxR=Math.max(roiFinal,1);
      const y=y1-(y1-y0)*(val/(maxR*1.08));
      pts.push([x,y]);
    }
    // area
    const grad=ctx.createLinearGradient(0,y0,0,y1);
    grad.addColorStop(0,'rgba(16,185,129,.30)'); grad.addColorStop(1,'rgba(16,185,129,0)');
    ctx.beginPath(); ctx.moveTo(pts[0][0],y1);
    pts.forEach(p=>ctx.lineTo(p[0],p[1])); ctx.lineTo(pts[pts.length-1][0],y1); ctx.closePath();
    ctx.fillStyle=grad; ctx.fill();
    // line
    ctx.beginPath(); pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.strokeStyle='#34F5A0'; ctx.lineWidth=2*dpr; ctx.shadowColor='rgba(52,245,160,.6)'; ctx.shadowBlur=10*dpr; ctx.stroke();
    ctx.shadowBlur=0;
    // end dot
    const e=pts[pts.length-1]; ctx.fillStyle='#34F5A0'; ctx.beginPath(); ctx.arc(e[0],e[1],3.2*dpr,0,6.283); ctx.fill();
  }

  [iB,iV,iM].forEach(i=>i&&i.addEventListener('input',model));
  sizeChart(); model();
  window.addEventListener('resize',()=>{ clearTimeout(window._cz); window._cz=setTimeout(()=>{sizeChart();model();},150); });
})();

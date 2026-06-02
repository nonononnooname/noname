/* ============================================================
   QLOSOPHY core — countdown, scroll system, particles, sphere
   ============================================================ */
(function(){
  'use strict';
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

  /* ---------- smooth scroll for [data-go] ---------- */
  $$('[data-go]').forEach(elm=>{
    elm.addEventListener('click',()=>{
      const t=document.getElementById(elm.dataset.go);
      if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  /* ---------- countdown to Q-Day 29 Dec 2029 ---------- */
  const TARGET = new Date('2029-12-29T00:00:00Z').getTime();
  const cdD=$('#cdD'),cdH=$('#cdH'),cdM=$('#cdM'),cdS=$('#cdS'),mini=$('#miniCount');
  function pad(n,l=2){return String(n).padStart(l,'0');}
  function tick(){
    let d=Math.max(0,TARGET-Date.now());
    const days=Math.floor(d/864e5); d-=days*864e5;
    const h=Math.floor(d/36e5); d-=h*36e5;
    const m=Math.floor(d/6e4); d-=m*6e4;
    const s=Math.floor(d/1e3);
    if(cdD)cdD.textContent=pad(days,3);
    if(cdH)cdH.textContent=pad(h);
    if(cdM)cdM.textContent=pad(m);
    if(cdS)cdS.textContent=pad(s);
    if(mini)mini.textContent=days+'d '+pad(h)+'h';
  }
  tick(); setInterval(tick,1000);

  // glitch on hover
  const cd=$('#countdown');
  if(cd){ cd.addEventListener('mouseenter',()=>cd.classList.add('glitch'));
          cd.addEventListener('mouseleave',()=>cd.classList.remove('glitch')); }

  /* ---------- reveal on scroll ---------- */
  const ro=new IntersectionObserver((es)=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target);} });
  },{threshold:.16, rootMargin:'0px 0px -8% 0px'});
  $$('.reveal').forEach(el=>{ if(!el.classList.contains('in')) ro.observe(el); });

  /* ---------- nav active state ---------- */
  const navMap={}; $$('#qnav a').forEach(a=>navMap[a.dataset.go]=a);
  const so=new IntersectionObserver((es)=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        $$('#qnav a').forEach(a=>a.classList.remove('active'));
        const a=navMap[e.target.id]; if(a)a.classList.add('active');
      }
    });
  },{threshold:.5});
  $$('.screen').forEach(s=>so.observe(s));

  /* ---------- typewriter (screen 2) ---------- */
  const body=$('#s2body');
  if(body){
    const text=body.dataset.text||''; let started=false;
    const tw=new IntersectionObserver((es)=>{
      es.forEach(e=>{ if(e.isIntersecting && !started){ started=true; run(); } });
    },{threshold:.35});
    tw.observe(body);
    function run(){
      let i=0; body.innerHTML='<span class="tw-caret">▍</span>';
      const caret='<span class="tw-caret">▍</span>';
      const id=setInterval(()=>{
        i++; body.innerHTML=text.slice(0,i).replace(/</g,'&lt;')+caret;
        if(i>=text.length){ clearInterval(id); setTimeout(()=>{body.innerHTML=text.replace(/</g,'&lt;');},1400); }
      },16);
    }
  }

  /* ---------- sound toggle (ambient hum) ---------- */
  const sb=$('#soundBtn'); let actx=null,osc=null,gain=null,on=false;
  if(sb){
    sb.addEventListener('click',()=>{
      on=!on;
      if(on){
        try{
          actx=actx||new (window.AudioContext||window.webkitAudioContext)();
          osc=actx.createOscillator(); gain=actx.createGain();
          const o2=actx.createOscillator();
          osc.type='sine'; osc.frequency.value=58; o2.type='sine'; o2.frequency.value=87;
          gain.gain.value=0.0; osc.connect(gain); o2.connect(gain); gain.connect(actx.destination);
          osc.start(); o2.start(); gain.gain.linearRampToValueAtTime(0.045, actx.currentTime+1.2);
          osc._o2=o2;
        }catch(e){}
        sb.classList.add('on'); sb.textContent='◗\u00a0SOUND\u00a0ON';
      } else {
        if(gain&&actx){ gain.gain.linearRampToValueAtTime(0, actx.currentTime+0.4);
          setTimeout(()=>{ try{osc.stop();osc._o2.stop();}catch(e){} },500); }
        sb.classList.remove('on'); sb.textContent='◖\u00a0SOUND\u00a0OFF';
      }
    });
  }

  /* ============================================================
     CANVAS — quantum noise + cursor trail + data sphere
     ============================================================ */
  const dpr=Math.min(window.devicePixelRatio||1,2);

  // noise (fixed, faint drifting particles)
  const nc=$('#noise'), nctx=nc&&nc.getContext('2d');
  let np=[];
  function sizeNoise(){
    if(!nc)return; nc.width=innerWidth*dpr; nc.height=innerHeight*dpr;
    nc.style.width=innerWidth+'px'; nc.style.height=innerHeight+'px';
    const n=Math.min(90, Math.floor(innerWidth*innerHeight/24000));
    np=Array.from({length:n},()=>({x:Math.random()*nc.width,y:Math.random()*nc.height,
      vx:(Math.random()-.5)*0.18*dpr,vy:(Math.random()-.5)*0.18*dpr,r:(Math.random()*1.3+.4)*dpr,a:Math.random()*.5+.1}));
  }

  // cursor trail
  const tc=$('#trail'), tctx=tc&&tc.getContext('2d');
  let trail=[];
  function sizeTrail(){ if(!tc)return; tc.width=innerWidth*dpr; tc.height=innerHeight*dpr;
    tc.style.width=innerWidth+'px'; tc.style.height=innerHeight+'px'; }
  let lastMove=0;
  window.addEventListener('mousemove',(e)=>{
    const now=performance.now(); if(now-lastMove<14)return; lastMove=now;
    for(let k=0;k<2;k++) trail.push({x:e.clientX*dpr,y:e.clientY*dpr,
      vx:(Math.random()-.5)*.6*dpr,vy:(Math.random()-.5)*.6*dpr,life:1,r:(Math.random()*2+1)*dpr});
    if(trail.length>240) trail.splice(0,trail.length-240);
  });

  // sphere (screen 2)
  const sc=$('#sphere'), sctx=sc&&sc.getContext('2d');
  let pts=[], sphereVisible=false, sProg=0;
  function buildSphere(){
    const N=440; pts=[];
    for(let i=0;i<N;i++){
      const y=1-(i/(N-1))*2; const r=Math.sqrt(1-y*y);
      const th=i*2.39996323;
      pts.push({x:Math.cos(th)*r,y:y,z:Math.sin(th)*r,
        ox:(Math.random()-.5),oy:(Math.random()-.5),oz:(Math.random()-.5),seed:Math.random()});
    }
  }
  function sizeSphere(){ if(!sc)return; const w=sc.clientWidth||sc.offsetWidth||400, h=sc.clientHeight||400;
    sc.width=w*dpr; sc.height=h*dpr; }
  const sObs=new IntersectionObserver((es)=>{es.forEach(e=>sphereVisible=e.isIntersecting);},{threshold:.05});
  if(sc) sObs.observe(sc);

  // scroll progress through screen 2 pin → decoherence
  const pin=$('#s2 .s2-pin'); const readout=$('#sphereReadout');
  function updateProg(){
    if(!pin)return;
    const r=pin.getBoundingClientRect();
    const total=r.height-innerHeight;
    let p=total>0 ? (-r.top)/total : 0; p=Math.max(0,Math.min(1,p));
    sProg=p;
    if(readout){
      const coh=Math.round((1-p)*100);
      readout.innerHTML = p<0.04 ? 'DATA SPHERE · COHERENCE <b style="color:var(--neon)">100%</b>'
        : p>0.92 ? 'STATE · <b>DECOHERED</b> — encryption broken'
        : 'DECOHERING · COHERENCE <b>'+coh+'%</b>';
    }
  }
  window.addEventListener('scroll',updateProg,{passive:true});

  let rot=0;
  function drawSphere(){
    if(!sctx)return;
    const W=sc.width,H=sc.height; sctx.clearRect(0,0,W,H);
    if(!sphereVisible) return;
    const cx=W/2, cy=H/2, R=Math.min(W,H)*0.34;
    rot+=0.0026;
    const p=sProg, disp=p*p, breaking=p>0.18;
    // quantum rays when breaking
    if(breaking){
      sctx.save(); sctx.globalAlpha=Math.min(.5,(p-0.18)*1.1);
      for(let k=0;k<5;k++){
        const ang=rot*2+k*1.257; const len=Math.max(W,H);
        sctx.strokeStyle='rgba(255,107,74,.5)'; sctx.lineWidth=1*dpr;
        sctx.beginPath(); sctx.moveTo(cx+Math.cos(ang)*-len,cy+Math.sin(ang)*-len);
        sctx.lineTo(cx+Math.cos(ang)*len,cy+Math.sin(ang)*len); sctx.stroke();
      }
      sctx.restore();
    }
    for(const pt of pts){
      // rotate around Y
      const cosR=Math.cos(rot),sinR=Math.sin(rot);
      let x=pt.x*cosR - pt.z*sinR;
      let z=pt.x*sinR + pt.z*cosR;
      let y=pt.y;
      // decoherence: push outward + jitter
      const jit=(Math.sin(rot*3+pt.seed*9))*disp*0.5;
      x += pt.ox*disp*2.4 + jit*pt.ox;
      y += pt.oy*disp*2.4 + jit*pt.oy;
      z += pt.oz*disp*2.4;
      const scale=1/(2.2 - z); // perspective
      const sx=cx + x*R*scale*1.0;
      const sy=cy + y*R*scale*1.0;
      const depth=(z+1)/2;
      const baseA=(0.25+depth*0.75)*(1-p*0.55);
      // color: neon → threat as it breaks
      const g=Math.round(185 - p*120), rr=Math.round(16 + p*239), b=Math.round(129 - p*55);
      sctx.fillStyle='rgba('+rr+','+g+','+b+','+baseA+')';
      const rad=(0.8+depth*1.6)*dpr;
      sctx.beginPath(); sctx.arc(sx,sy,rad,0,6.283); sctx.fill();
    }
    // core glow
    if(p<0.6){
      const gg=sctx.createRadialGradient(cx,cy,0,cx,cy,R*0.5);
      gg.addColorStop(0,'rgba(52,245,160,'+(0.18*(1-p))+')'); gg.addColorStop(1,'rgba(52,245,160,0)');
      sctx.fillStyle=gg; sctx.fillRect(0,0,W,H);
    }
  }

  function drawNoise(){
    if(!nctx)return; nctx.clearRect(0,0,nc.width,nc.height);
    for(const p of np){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=nc.width; if(p.x>nc.width)p.x=0; if(p.y<0)p.y=nc.height; if(p.y>nc.height)p.y=0;
      nctx.fillStyle='rgba(52,245,160,'+(p.a*0.5)+')';
      nctx.beginPath(); nctx.arc(p.x,p.y,p.r,0,6.283); nctx.fill();
    }
  }
  function drawTrail(){
    if(!tctx)return; tctx.clearRect(0,0,tc.width,tc.height);
    for(let i=trail.length-1;i>=0;i--){
      const t=trail[i]; t.x+=t.vx; t.y+=t.vy; t.life-=0.045;
      if(t.life<=0){ trail.splice(i,1); continue; }
      tctx.fillStyle='rgba(52,245,160,'+(t.life*0.6)+')';
      tctx.beginPath(); tctx.arc(t.x,t.y,t.r*t.life,0,6.283); tctx.fill();
    }
  }

  function loop(){ drawNoise(); drawTrail(); drawSphere(); requestAnimationFrame(loop); }

  function sizeAll(){ sizeNoise(); sizeTrail(); sizeSphere(); }
  buildSphere(); sizeAll(); updateProg();
  window.addEventListener('resize',()=>{ clearTimeout(window._rz); window._rz=setTimeout(sizeAll,150); });
  requestAnimationFrame(loop);

  // expose a tiny helper for other modules
  window.Q = { $, $$ };
})();

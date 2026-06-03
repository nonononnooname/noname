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
        if(i>=text.length){ clearInterval(id); setTimeout(()=>{body.innerHTML=hl(text);},1400); }
      },16);
    }
    function hl(t){
      let h=t.replace(/</g,'&lt;');
      [['inevitable paradigm shift'],['classical cryptography']].forEach(([p])=>{
        h=h.replace(p,'<span class="s2-mark">'+p+'</span>');
      });
      ['aggregate the attention','We do not sell panic.'].forEach(p=>{
        h=h.replace(p,'<span class="s2-hl">'+p+'</span>');
      });
      return h;
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
      const bx=Math.cos(th)*r, by=y, bz=Math.sin(th)*r;
      // 60% outward (natural expansion) + 40% random (organic chaos)
      const rx=(Math.random()-.5)*0.8, ry=(Math.random()-.5)*0.8, rz=(Math.random()-.5)*0.8;
      pts.push({x:bx,y:by,z:bz,
        ox:bx*0.6+rx, oy:by*0.6+ry, oz:bz*0.6+rz,
        seed:Math.random()});
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
    const p=sProg;
    // subtly accelerate spin as decoherence grows
    rot += 0.0026 + p*0.007;

    // soft threat aura — replaces harsh crossing lines
    if(p>0.1){
      const aS=Math.min(1,(p-0.1)/0.6);
      const aSSmooth=aS*aS*(3-2*aS);
      const aura=sctx.createRadialGradient(cx,cy,R*0.2,cx,cy,R*2.0);
      aura.addColorStop(0,'rgba(255,90,50,0)');
      aura.addColorStop(0.45,'rgba(255,90,50,'+(0.055*aSSmooth)+')');
      aura.addColorStop(1,'rgba(255,90,50,0)');
      sctx.fillStyle=aura; sctx.fillRect(0,0,W,H);
    }

    const cosR=Math.cos(rot),sinR=Math.sin(rot);
    for(const pt of pts){
      // per-particle decoherence threshold — staggered from p≈0.07 to p≈0.72
      const thr=pt.seed*0.65+0.07;
      const rawPP=Math.max(0,(p-thr)/0.32);
      const pp=Math.min(1,rawPP);
      // smoothstep easing so each particle has a silky own curve
      const ppS=pp*pp*(3-2*pp);

      // rotate around Y
      let x=pt.x*cosR - pt.z*sinR;
      let z=pt.x*sinR + pt.z*cosR;
      let y=pt.y;

      // organic jitter: low-freq breathing + high-freq fracture
      const breath=Math.sin(rot*1.9+pt.seed*6.28)*0.05*ppS;
      const frac  =Math.sin(rot*7.3+pt.seed*21.7)*ppS*0.28;
      x += pt.ox*ppS*2.8 + frac*pt.ox + breath*pt.x;
      y += pt.oy*ppS*2.8 + frac*pt.oy + breath*pt.y;
      z += pt.oz*ppS*2.8;

      const scale=1/(2.2-z);
      const sx=cx+x*R*scale;
      const sy=cy+y*R*scale;
      const depth=(z+1)/2;

      // opacity: fully coherent particles keep brightness; breaking ones fade out
      const fadeOut=ppS>0.68 ? 1-((ppS-0.68)/0.32) : 1;
      const baseA=(0.28+depth*0.72)*fadeOut*(1-p*0.28);
      if(baseA<=0.01) continue;

      // per-particle color: neon-green → orange-red as THAT particle breaks
      const cr=Math.round(16  + (255-16 )*ppS);
      const cg=Math.round(245 + (80-245 )*ppS);
      const cb=Math.round(160 + (50-160 )*ppS);
      sctx.fillStyle='rgba('+cr+','+cg+','+cb+','+baseA+')';
      const rad=(0.8+depth*1.6)*dpr*(1+ppS*0.4);
      sctx.beginPath(); sctx.arc(sx,sy,rad,0,6.283); sctx.fill();
    }

    // core glow: green → slowly transitions to faint orange residue
    if(p<0.85){
      const t=Math.min(1,p/0.6);
      const tS=t*t*(3-2*t);
      const gr=Math.round(52  + (220-52 )*tS);
      const gg2=Math.round(245 + (70-245)*tS);
      const gb=Math.round(160 + (40-160)*tS);
      const intens=(p<0.5) ? 0.18*(1-p) : 0.09*(0.85-p)/0.35;
      const glow=sctx.createRadialGradient(cx,cy,0,cx,cy,R*0.52);
      glow.addColorStop(0,'rgba('+gr+','+gg2+','+gb+','+Math.max(0,intens)+')');
      glow.addColorStop(1,'rgba('+gr+','+gg2+','+gb+',0)');
      sctx.fillStyle=glow; sctx.fillRect(0,0,W,H);
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

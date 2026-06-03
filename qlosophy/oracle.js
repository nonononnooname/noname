/* ============================================================
   QLOSOPHY — Screen 4 · Semantic Oracle
   Radial network: QLOSOPHY hub at center, news particles fly in
   ============================================================ */
(function(){
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const svg  = document.getElementById('mapSvg');
  const term = document.getElementById('oraTerm');
  const runBtn = document.getElementById('runOracle');
  if(!svg) return;

  const W = 640, H = 400;
  const CX = 320, CY = 192; // QLOSOPHY hub center

  // ── Radial source nodes (ellipse, clockwise from top) ──────────────
  const RX = 200, RY = 125;
  const NODE_META = [
    {c:'LDN', label:'London'},
    {c:'ZUR', label:'Zurich'},
    {c:'BEJ', label:'Beijing'},
    {c:'TOK', label:'Tokyo'},
    {c:'HKG', label:'Hong Kong'},
    {c:'SYD', label:'Sydney'},
    {c:'TLV', label:'Tel Aviv'},
    {c:'DC',  label:'Washington'},
    {c:'GVA', label:'Geneva'},
    {c:'SFO', label:'San Francisco'},
    {c:'NYC', label:'New York'},
    {c:'BRU', label:'Brussels'},
  ];
  const NODES = NODE_META.map((m, i) => {
    const a = (i / NODE_META.length) * Math.PI * 2;
    return { ...m,
      x: Math.round(CX + RX * Math.sin(a)),
      y: Math.round(CY - RY * Math.cos(a)),
    };
  });

  // ── Precompute bezier control points (clockwise spiral toward center) ──
  NODES.forEach(n => {
    const dx = CX - n.x, dy = CY - n.y;
    const len = Math.sqrt(dx*dx + dy*dy);
    // clockwise perpendicular of direction (node→center)
    const px = dy / len, py = -dx / len;
    const mid = { x: (n.x + CX) / 2, y: (n.y + CY) / 2 };
    n.cpX = mid.x + px * 32;
    n.cpY = mid.y + py * 32;
  });

  // ── Build SVG ────────────────────────────────────────────────────────
  // defs
  const defs = document.createElementNS(NS, 'defs');

  // Center glow radial gradient
  const cGrad = document.createElementNS(NS, 'radialGradient');
  cGrad.id = 'centerGlow';
  [['0%','rgba(52,245,160,.28)'],['55%','rgba(52,245,160,.07)'],['100%','rgba(52,245,160,0)']].forEach(([o,c])=>{
    const s = document.createElementNS(NS,'stop'); s.setAttribute('offset',o); s.setAttribute('stop-color',c); cGrad.appendChild(s);
  });
  defs.appendChild(cGrad);

  // Node glow gradient
  const nGrad = document.createElementNS(NS, 'radialGradient');
  nGrad.id = 'nodeGlow';
  [['0%','rgba(52,245,160,.22)'],['100%','rgba(52,245,160,0)']].forEach(([o,c])=>{
    const s = document.createElementNS(NS,'stop'); s.setAttribute('offset',o); s.setAttribute('stop-color',c); nGrad.appendChild(s);
  });
  defs.appendChild(nGrad);

  // Amber node glow
  const aGrad = document.createElementNS(NS, 'radialGradient');
  aGrad.id = 'amberGlow';
  [['0%','rgba(251,191,36,.28)'],['100%','rgba(251,191,36,0)']].forEach(([o,c])=>{
    const s = document.createElementNS(NS,'stop'); s.setAttribute('offset',o); s.setAttribute('stop-color',c); aGrad.appendChild(s);
  });
  defs.appendChild(aGrad);

  // Clip path (keep particles inside SVG)
  const clip = document.createElementNS(NS, 'clipPath');
  clip.id = 'svgClip';
  const clipRect = document.createElementNS(NS, 'rect');
  clipRect.setAttribute('x',0); clipRect.setAttribute('y',0);
  clipRect.setAttribute('width',W); clipRect.setAttribute('height',H);
  clip.appendChild(clipRect);
  defs.appendChild(clip);

  svg.appendChild(defs);

  // ── Background concentric rings ──────────────────────────────────────
  [160, 120, 80, 42].forEach((r,i) => {
    const c = document.createElementNS(NS,'circle');
    c.setAttribute('cx',CX); c.setAttribute('cy',CY); c.setAttribute('r',r);
    c.setAttribute('fill','none');
    c.setAttribute('stroke','rgba(52,245,160,'+(0.028 + i*0.008)+')');
    c.setAttribute('stroke-width','1');
    c.setAttribute('stroke-dasharray', i % 2 === 0 ? '3 9' : '1 7');
    svg.appendChild(c);
  });

  // Faint cross-hairs
  ['M'+CX+','+( CY-180)+'V'+(CY+180), 'M'+(CX-300)+','+CY+'H'+(CX+300)].forEach(d=>{
    const l = document.createElementNS(NS,'path');
    l.setAttribute('d',d); l.setAttribute('stroke','rgba(52,245,160,.03)'); l.setAttribute('stroke-width','1'); l.setAttribute('fill','none');
    svg.appendChild(l);
  });

  // ── Arc paths: nodes → center ────────────────────────────────────────
  NODES.forEach(n => {
    const p = document.createElementNS(NS,'path');
    p.setAttribute('d',`M${n.x},${n.y} Q${n.cpX},${n.cpY} ${CX},${CY}`);
    p.setAttribute('fill','none');
    p.setAttribute('stroke','rgba(52,245,160,.065)');
    p.setAttribute('stroke-width','1');
    p.setAttribute('stroke-dasharray','3 7');
    svg.appendChild(p);
    n.pathEl = p;
  });

  // ── CENTER HUB ────────────────────────────────────────────────────────
  // Outer glow disc
  const glowDisc = document.createElementNS(NS,'circle');
  glowDisc.setAttribute('cx',CX); glowDisc.setAttribute('cy',CY); glowDisc.setAttribute('r','78');
  glowDisc.setAttribute('fill','url(#centerGlow)');
  svg.appendChild(glowDisc);

  // Decorative orbit rings
  [[62,'rgba(52,245,160,.10)','5 12'],[48,'rgba(52,245,160,.13)','2 6']].forEach(([r,stroke,dash])=>{
    const ring = document.createElementNS(NS,'circle');
    ring.setAttribute('cx',CX); ring.setAttribute('cy',CY); ring.setAttribute('r',r);
    ring.setAttribute('fill','none'); ring.setAttribute('stroke',stroke);
    ring.setAttribute('stroke-width','1'); ring.setAttribute('stroke-dasharray',dash);
    svg.appendChild(ring);
  });

  // Rotating dashed ring (animated in JS)
  const rotRing = document.createElementNS(NS,'circle');
  rotRing.setAttribute('cx',CX); rotRing.setAttribute('cy',CY); rotRing.setAttribute('r','55');
  rotRing.setAttribute('fill','none');
  rotRing.setAttribute('stroke','rgba(52,245,160,.18)');
  rotRing.setAttribute('stroke-width','1');
  rotRing.setAttribute('stroke-dasharray','10 26');
  svg.appendChild(rotRing);

  // Hub background circle
  const hubBg = document.createElementNS(NS,'circle');
  hubBg.setAttribute('cx',CX); hubBg.setAttribute('cy',CY); hubBg.setAttribute('r','32');
  hubBg.setAttribute('fill','#060b12');
  hubBg.setAttribute('stroke','rgba(52,245,160,.55)');
  hubBg.setAttribute('stroke-width','1.5');
  svg.appendChild(hubBg);

  // Qlosophy orbital logo (three ellipses)
  [[9,3.6,0],[9,3.6,60],[9,3.6,120]].forEach(([erx,ery,angle])=>{
    const el = document.createElementNS(NS,'ellipse');
    el.setAttribute('cx',CX); el.setAttribute('cy',CY);
    el.setAttribute('rx',erx); el.setAttribute('ry',ery);
    el.setAttribute('fill','none'); el.setAttribute('stroke','#34F5A0'); el.setAttribute('stroke-width','1');
    el.setAttribute('transform',`rotate(${angle} ${CX} ${CY})`);
    svg.appendChild(el);
  });

  // Core dot (flashes on arrival)
  const coreDot = document.createElementNS(NS,'circle');
  coreDot.setAttribute('cx',CX); coreDot.setAttribute('cy',CY); coreDot.setAttribute('r','2.8');
  coreDot.setAttribute('fill','#34F5A0');
  svg.appendChild(coreDot);

  // "QLOSOPHY" label
  const qLabel = document.createElementNS(NS,'text');
  qLabel.setAttribute('x',CX); qLabel.setAttribute('y',CY+48);
  qLabel.setAttribute('text-anchor','middle');
  qLabel.setAttribute('font-family','JetBrains Mono, monospace');
  qLabel.setAttribute('font-size','9.5');
  qLabel.setAttribute('font-weight','700');
  qLabel.setAttribute('letter-spacing','3.5');
  qLabel.setAttribute('fill','rgba(52,245,160,.92)');
  qLabel.textContent = 'ORACLE';
  svg.appendChild(qLabel);

  // Published counter below label
  let cPub = 4128;
  const pubText = document.createElementNS(NS,'text');
  pubText.setAttribute('x',CX); pubText.setAttribute('y',CY+62);
  pubText.setAttribute('text-anchor','middle');
  pubText.setAttribute('font-family','JetBrains Mono, monospace');
  pubText.setAttribute('font-size','7.5');
  pubText.setAttribute('fill','rgba(52,245,160,.42)');
  pubText.textContent = 'PUBLISHED '+cPub.toLocaleString();
  svg.appendChild(pubText);

  // ── Source node dots + labels ────────────────────────────────────────
  NODES.forEach(n => {
    // Glow halo
    const halo = document.createElementNS(NS,'circle');
    halo.setAttribute('cx',n.x); halo.setAttribute('cy',n.y); halo.setAttribute('r','6');
    halo.setAttribute('fill','url(#nodeGlow)');
    n.haloEl = halo;
    svg.appendChild(halo);

    // Main dot
    const dot = document.createElementNS(NS,'circle');
    dot.setAttribute('cx',n.x); dot.setAttribute('cy',n.y); dot.setAttribute('r','3');
    dot.setAttribute('fill','#0e1822');
    dot.setAttribute('stroke','rgba(52,245,160,.32)');
    dot.setAttribute('stroke-width','1');
    n.el = dot;
    svg.appendChild(dot);

    // Label: offset away from center
    const angle = Math.atan2(n.y - CY, n.x - CX);
    const lx = n.x + Math.cos(angle) * 15;
    const ly = n.y + Math.sin(angle) * 15 + 3;
    const anchor = (n.x < CX - 15) ? 'end' : (n.x > CX + 15) ? 'start' : 'middle';
    const t = document.createElementNS(NS,'text');
    t.setAttribute('x', lx); t.setAttribute('y', ly);
    t.setAttribute('font-size','7.5');
    t.setAttribute('font-family','JetBrains Mono, monospace');
    t.setAttribute('fill','rgba(52,245,160,.48)');
    t.setAttribute('letter-spacing','0.8');
    t.setAttribute('text-anchor', anchor);
    t.textContent = n.label;
    svg.appendChild(t);
  });

  // ── Rotating ring animation ──────────────────────────────────────────
  let rotAngle = 0;
  (function tick(){
    rotAngle += 0.25;
    rotRing.setAttribute('transform',`rotate(${rotAngle} ${CX} ${CY})`);
    requestAnimationFrame(tick);
  })();

  // ── Particle: node → center ──────────────────────────────────────────
  function fireParticle(node, isWarn){
    const neon = isWarn ? '#fbbf24' : '#34F5A0';
    const neonD = isWarn ? 'rgba(251,191,36,' : 'rgba(52,245,160,';

    // Flash source node
    node.el.setAttribute('stroke', isWarn ? 'rgba(251,191,36,.95)' : 'rgba(52,245,160,.95)');
    node.el.setAttribute('fill', neonD+'0.28)');
    node.haloEl.setAttribute('r','11');
    node.haloEl.setAttribute('fill', isWarn ? 'url(#amberGlow)' : 'url(#nodeGlow)');

    // Source ripple
    const ripple = document.createElementNS(NS,'circle');
    ripple.setAttribute('cx',node.x); ripple.setAttribute('cy',node.y); ripple.setAttribute('r','3');
    ripple.setAttribute('fill','none'); ripple.setAttribute('stroke',neon); ripple.setAttribute('stroke-width','1.2');
    svg.insertBefore(ripple, svg.firstChild.nextSibling);
    ripple.animate([{r:'3px',opacity:.9},{r:'22px',opacity:0}],{duration:650,easing:'ease-out'}).onfinish=()=>ripple.remove();

    // After flash: restore node
    setTimeout(()=>{
      node.el.setAttribute('stroke','rgba(52,245,160,.32)'); node.el.setAttribute('fill','#0e1822');
      node.haloEl.setAttribute('r','6'); node.haloEl.setAttribute('fill','url(#nodeGlow)');
    }, 700);

    // Head particle
    const head = document.createElementNS(NS,'circle');
    head.setAttribute('r', isWarn ? '3.5' : '2.8');
    head.setAttribute('fill', neon);
    head.setAttribute('cx', node.x); head.setAttribute('cy', node.y);
    svg.appendChild(head);

    // Tail particle
    const tail = document.createElementNS(NS,'circle');
    tail.setAttribute('r', isWarn ? '2' : '1.6');
    tail.setAttribute('fill', neonD+'0.45)');
    tail.setAttribute('cx', node.x); tail.setAttribute('cy', node.y);
    svg.insertBefore(tail, head);

    const x0 = node.x, y0 = node.y, cpX = node.cpX, cpY = node.cpY;
    const totalSteps = 28 + Math.floor(Math.random()*10);
    const tailLag = 7;
    let step = 0;

    function bezier(t){ // quadratic bezier
      return {
        x: (1-t)*(1-t)*x0 + 2*(1-t)*t*cpX + t*t*CX,
        y: (1-t)*(1-t)*y0 + 2*(1-t)*t*cpY + t*t*CY,
      };
    }
    function ease(t){ return t<.5 ? 2*t*t : -1+(4-2*t)*t; }

    (function frame(){
      step++;
      const p = bezier(ease(step/totalSteps));
      head.setAttribute('cx',p.x); head.setAttribute('cy',p.y);

      const tT = Math.max(0,(step-tailLag)/totalSteps);
      const pT = bezier(ease(tT));
      tail.setAttribute('cx',pT.x); tail.setAttribute('cy',pT.y);

      const alpha = step/totalSteps > .82 ? (1 - step/totalSteps)/.18 : 1;
      head.setAttribute('opacity',alpha);
      tail.setAttribute('opacity',alpha*.45);

      if(step < totalSteps){
        requestAnimationFrame(frame);
      } else {
        head.remove(); tail.remove();
        pulseHub(isWarn);
        cPub++;
        pubText.textContent = 'PUBLISHED '+cPub.toLocaleString();
        const mPubEl = document.getElementById('mPub');
        if(mPubEl) mPubEl.textContent = cPub.toLocaleString();
      }
    })();
  }

  function pulseHub(isWarn){
    const neon = isWarn ? '#fbbf24' : '#34F5A0';
    // Expanding ring from center
    const ring = document.createElementNS(NS,'circle');
    ring.setAttribute('cx',CX); ring.setAttribute('cy',CY); ring.setAttribute('r','32');
    ring.setAttribute('fill','none'); ring.setAttribute('stroke',neon); ring.setAttribute('stroke-width','2');
    svg.appendChild(ring);
    ring.animate([{r:'32px',opacity:.95,strokeWidth:'2px'},{r:'68px',opacity:0,strokeWidth:'.5px'}],
      {duration:650,easing:'ease-out'}).onfinish=()=>ring.remove();
    // Flash core dot
    coreDot.setAttribute('r','5.5'); coreDot.setAttribute('fill',neon);
    coreDot.animate([{opacity:1},{opacity:0.8}],{duration:160,easing:'ease-in'}).onfinish=()=>{
      coreDot.setAttribute('r','2.8'); coreDot.setAttribute('fill','#34F5A0'); coreDot.setAttribute('opacity','1');
    };
  }

  // ── News chip: spawns near node, flies to center ─────────────────────
  function fireNewsChip(node, text, isWarn){
    const neon  = isWarn ? '#fbbf24' : '#34F5A0';
    const neonA = isWarn ? 'rgba(251,191,36,' : 'rgba(52,245,160,';

    const maxLen = 24;
    const label = text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
    const tw = label.length * 3.55 + 10;
    const th = 12;

    const g = document.createElementNS(NS, 'g');

    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', -tw/2); rect.setAttribute('y', -th/2);
    rect.setAttribute('width', tw); rect.setAttribute('height', th);
    rect.setAttribute('rx', '3'); rect.setAttribute('ry', '3');
    rect.setAttribute('fill', neonA+'0.12)');
    rect.setAttribute('stroke', neon); rect.setAttribute('stroke-width', '0.6');

    const txt = document.createElementNS(NS, 'text');
    txt.setAttribute('font-family', 'JetBrains Mono, monospace');
    txt.setAttribute('font-size', '5.8');
    txt.setAttribute('fill', neon);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('dominant-baseline', 'middle');
    txt.textContent = label;

    g.appendChild(rect); g.appendChild(txt);
    svg.appendChild(g);

    // Start just outside the node dot
    const ang = Math.atan2(node.y - CY, node.x - CX);
    const sx = node.x + Math.cos(ang) * 22;
    const sy = node.y + Math.sin(ang) * 22;

    const cpX = node.cpX, cpY = node.cpY;
    const totalSteps = 36 + Math.floor(Math.random() * 12);
    let step = 0;

    function bez(t){
      return {
        x: (1-t)*(1-t)*sx + 2*(1-t)*t*cpX + t*t*CX,
        y: (1-t)*(1-t)*sy + 2*(1-t)*t*cpY + t*t*CY,
      };
    }
    function ease(t){ return t < .5 ? 2*t*t : -1+(4-2*t)*t; }

    (function frame(){
      step++;
      const pr = step / totalSteps;
      const p  = bez(ease(pr));
      const alpha = pr < 0.12 ? pr/0.12 : pr > 0.72 ? (1 - pr)/0.28 : 1;
      const scale = 1 - pr * 0.48;
      g.setAttribute('transform', `translate(${p.x},${p.y}) scale(${scale})`);
      g.setAttribute('opacity', alpha);
      if(step < totalSteps){ requestAnimationFrame(frame); } else { g.remove(); }
    })();
  }

  // ── Terminal log ──────────────────────────────────────────────────────
  const ENTITIES = ['Vitalik Buterin','IBM Quantum','Google Quantum AI','NIST','Quantinuum','PsiQuantum',
    'Michele Mosca','Microsoft','Jensen Huang','USTC','NSA','Amazon Braket','BlackRock','SWIFT'];
  const VERBS = ['referenced the quantum threat','published a post-quantum timeline',
    'flagged harvest-now-decrypt-later risk','updated migration guidance',
    'cited Q-Day exposure','disclosed a fault-tolerance milestone','warned on RSA-2048'];
  const OK_TAGS = ['PARSED','INDEXED','NER OK','SCORED','LINKED'];

  function ts(){ return new Date().toTimeString().slice(0,8); }
  function rand(a){ return a[Math.floor(Math.random()*a.length)]; }

  function line(html){
    if(!term) return;
    const d = document.createElement('div');
    d.innerHTML = '<span class="t-time">'+ts()+'</span> '+html;
    term.appendChild(d);
    while(term.children.length > 6) term.removeChild(term.firstChild);
    term.scrollTop = term.scrollHeight;
  }

  function ambient(){
    const node = rand(NODES);
    if(Math.random() < 0.5){
      const tag = rand(OK_TAGS);
      line('<span class="t-ok">'+tag+'</span> source #'+(1000+Math.floor(Math.random()*9000))+' · '+node.label);
      fireNewsChip(node, tag + ' · ' + node.label, false);
      if(Math.random() < 0.45) fireParticle(node, false);
    } else {
      const e = rand(ENTITIES), v = rand(VERBS);
      const isWarn = v.includes('harvest') || v.includes('RSA');
      line('<span class="t-ent">'+e+'</span> '+v+' · corr <span class="t-ok">'+(Math.random()*.4+.6).toFixed(2)+'</span>');
      fireNewsChip(node, e, isWarn);
      fireParticle(node, isWarn);
    }
  }

  // Counters
  const mSrc = document.getElementById('mSrc');
  const mSig = document.getElementById('mSig');
  const mPub = document.getElementById('mPub');
  let cSrc = 2418;
  if(mPub) mPub.textContent = cPub.toLocaleString();
  function bump(){ cSrc += Math.floor(Math.random()*4); if(mSrc) mSrc.textContent = cSrc.toLocaleString(); }

  let timer = null, running = false;
  function start(ms){ stop(); timer = setInterval(()=>{ ambient(); bump(); }, ms); }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }

  // Auto-run when screen 4 visible
  new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting && !running){
        if(term && term.children.length===0){
          line('<span class="t-ok">SEMANTIC ORACLE</span> stream attached · listening…');
        }
        start(800); running=true;
      } else if(!e.isIntersecting){ stop(); running=false; }
    });
  },{threshold:.25}).observe(document.getElementById('s4'));

  // Simulation burst button
  if(runBtn){
    runBtn.addEventListener('click',()=>{
      if(running && timer && !runBtn.disabled) return;
      running = true; runBtn.disabled = true;
      const old = runBtn.innerHTML;
      runBtn.innerHTML = '<span class="br">[</span> SIMULATION RUNNING… <span class="br">]</span>';
      if(mSig) mSig.textContent = '480';
      start(110);

      setTimeout(()=>{
        line('<span class="t-warn">NEW MENTION</span> <span class="t-ent">Vitalik Buterin</span> raised the quantum threat at a Tokyo conference.');
        line('correlation <span class="t-ok">HIGH (0.92)</span> · entity linked → <span class="t-ent">String Eth</span> · publishing…');
        fireNewsChip(NODES[0], 'Vitalik Buterin', true);
        fireParticle(NODES[0], true);  // LDN
        setTimeout(()=>{ fireNewsChip(NODES[3], 'quantum threat', true); fireParticle(NODES[3], true); }, 320); // TOK
        setTimeout(()=>{ fireNewsChip(NODES[10], 'String Eth', false); fireParticle(NODES[10], false); }, 640); // NYC
      }, 2200);

      setTimeout(()=>{
        start(800); if(mSig) mSig.textContent = '12';
        running = false; runBtn.disabled = false; runBtn.innerHTML = old;
      }, 3800);
    });
  }
})();

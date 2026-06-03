/* ============================================================
   QLOSOPHY — Screen 6 · Threat-to-Solution Bridge
   drag & drop + tap-to-place fallback
   ============================================================ */
(function(){
  'use strict';
  const cards=[...document.querySelectorAll('.tcard')];
  const zones=[...document.querySelectorAll('.dropzone')];
  const counter=document.getElementById('syncCount');
  let synced=0, selected=null;

  function place(card,zone){
    if(card.classList.contains('placed')) return;
    if(card.dataset.key!==zone.dataset.accept){ flashReject(zone); return; }
    card.classList.add('placed'); zone.classList.add('filled');
    card.querySelector('h4').textContent='✓ '+card.querySelector('h4').textContent.replace(/^✓ /,'');
    synced++; if(counter)counter.textContent=synced;
    card.setAttribute('draggable','false');
    // pulse the link
    zone.animate([{boxShadow:'0 0 0 0 rgba(16,185,129,.5)'},{boxShadow:'0 0 40px -6px rgba(16,185,129,.6)'},{boxShadow:'0 0 0 0 rgba(16,185,129,0)'}],{duration:900});
  }
  function flashReject(zone){
    zone.animate([{borderColor:'#FF6B4A'},{borderColor:''}],{duration:500});
  }

  // --- native drag & drop ---
  let dragKey=null;
  cards.forEach(card=>{
    card.addEventListener('dragstart',e=>{ if(card.classList.contains('placed')){e.preventDefault();return;}
      dragKey=card.dataset.key; card.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain',card.dataset.key); });
    card.addEventListener('dragend',()=>{ dragKey=null; card.classList.remove('dragging'); });
    // tap-to-select
    card.addEventListener('click',()=>{ if(card.classList.contains('placed'))return;
      if(selected===card){ selected=null; card.style.outline=''; return; }
      cards.forEach(c=>c.style.outline=''); selected=card; card.style.outline='1px solid var(--neon)'; });
  });
  zones.forEach(zone=>{
    zone.addEventListener('dragover',e=>{ e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave',()=>zone.classList.remove('over'));
    zone.addEventListener('drop',e=>{ e.preventDefault(); zone.classList.remove('over');
      const key=e.dataTransfer.getData('text/plain')||dragKey;
      const card=cards.find(c=>c.dataset.key===key && !c.classList.contains('placed'));
      if(card) place(card,zone); });
    // tap-to-place
    zone.addEventListener('click',()=>{ if(selected){ place(selected,zone); selected.style.outline=''; selected=null; } });
  });
})();

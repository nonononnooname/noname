/* ============================================================
   QLOSOPHY — Screen 5 · The Content Farm
   All sectors → same device rack, content changes per mode
   ============================================================ */
(function(){
  'use strict';

  const farm      = document.getElementById('farmBody');
  const farmLabel = document.getElementById('farmLabel');
  const farmMeta  = document.getElementById('farmMeta');
  const farmFoot  = document.getElementById('farmFoot');
  if(!farm) return;

  // ── Phone content palette for gradient clips ──────────────────────
  const PAL = [
    'linear-gradient(165deg,#12301f,#06140d)',
    'linear-gradient(165deg,#0c2734,#06121b)',
    'linear-gradient(165deg,#241a32,#0e0a18)',
    'linear-gradient(165deg,#2c1611,#140806)',
    'linear-gradient(165deg,#0a1d16,#05090d)',
    'linear-gradient(165deg,#1b2433,#0a0f17)',
    'linear-gradient(165deg,#103027,#05120e)',
    'linear-gradient(165deg,#2a2410,#120f05)',
  ];
  const SHELVES = 1, PER = 5;        // defaults for gradient-clip modes
  const rnd = (a, b) => a + Math.random() * (b - a);

  function clipHTML(){
    const showPlay = Math.random() < 0.45;
    return '<div class="mclip" style="background:' + PAL[(Math.random() * PAL.length) | 0] + '">'
      + (showPlay ? '<span class="mplay">\u25B6</span>' : '')
      + '<span class="mside"><i></i><i></i><i></i></span>'
      + '<span class="mcap"></span></div>';
  }

  // ── Farm configs per mode ─────────────────────────────────────────
  // video: falsy → gradient clips; truthy string → video src for that mode
  // vidCols/vidRows control the phone-rack layout for video modes
  const MODES = {
    shorts: {
      label   : 'SHORTS&nbsp;FACTORY&nbsp;//&nbsp;DEVICE&nbsp;RACK&nbsp;01',
      meta    : '<b>10</b>&nbsp;DEVICES&nbsp;·&nbsp;<b>50+</b>&nbsp;UPLOADS/DAY',
      foot    : '<span class="dot-live"></span>&nbsp;AUTO&#8209;PUBLISHING TO TIKTOK · REELS · SHORTS',
      video   : 'qlosophy/assets/vid-watch.mp4',
      vidCols : 5, vidRows : 2,
    },
    stream: {
      label : 'LIVESTREAM&nbsp;OPS&nbsp;//&nbsp;DEVICE&nbsp;RACK&nbsp;01',
      meta  : '<b>20</b>&nbsp;DEVICES&nbsp;·&nbsp;STREAMING&nbsp;LIVE',
      foot  : '<span class="dot-live"></span>&nbsp;PHIL\'S HUB · DEEP REPORTS · LIVE BREAKDOWNS',
    },
    book: {
      label : 'DOCTRINE&nbsp;DEPLOY&nbsp;//&nbsp;DEVICE&nbsp;RACK&nbsp;01',
      meta  : '<b>20</b>&nbsp;DEVICES&nbsp;·&nbsp;PUBLISHING&nbsp;DOCTRINE',
      foot  : '<span class="dot-live"></span>&nbsp;WHITE PAPERS · LEGAL POLICY · TREATISE',
    },
    net: {
      label : 'AMBASSADOR&nbsp;NET&nbsp;//&nbsp;DEVICE&nbsp;RACK&nbsp;01',
      meta  : '<b>20</b>&nbsp;DEVICES&nbsp;·&nbsp;NETWORK&nbsp;ACTIVE',
      foot  : '<span class="dot-live"></span>&nbsp;NEW PEOPLE · MED · REFERRAL ENGINE',
    },
    watch: {
      label   : 'VIDEO&nbsp;WATCH&nbsp;//&nbsp;DEVICE&nbsp;RACK&nbsp;01',
      meta    : '<b>8</b>&nbsp;DEVICES&nbsp;·&nbsp;COMMENTING&nbsp;LIVE',
      foot    : '<span class="dot-live"></span>&nbsp;SEEDING DISCOURSE · BUILDING SIGNAL',
      video   : 'qlosophy/assets/vid-watch.mp4',
      vidCols : 4, vidRows : 2,
    },
    streams: {
      label   : 'STREAM&nbsp;WATCH&nbsp;//&nbsp;DEVICE&nbsp;RACK&nbsp;01',
      meta    : '<b>8</b>&nbsp;DEVICES&nbsp;·&nbsp;IN&nbsp;LIVE&nbsp;CHATS',
      foot    : '<span class="dot-live"></span>&nbsp;REAL-TIME PRESENCE IN HIGH-TRAFFIC STREAMS',
      video   : 'qlosophy/assets/vid-streams.mp4',
      vidCols : 4, vidRows : 2,
    },
    report: {
      label : 'REPORT&nbsp;OPS&nbsp;//&nbsp;DEVICE&nbsp;RACK&nbsp;01',
      meta  : '<b>8</b>&nbsp;DEVICES&nbsp;·&nbsp;<b>MASS</b>&nbsp;FLAGGING&nbsp;ACTIVE',
      foot  : '<span class="dot-live"></span>&nbsp;SYNCHRONIZED REPORTS · COORDINATED FLAGGING AT SCALE',
      builder: 'report',
    },
    gen: {
      label   : 'CONTENT&nbsp;GEN&nbsp;//&nbsp;DEVICE&nbsp;RACK&nbsp;01',
      meta    : '<b>8</b>&nbsp;DEVICES&nbsp;·&nbsp;ANY&nbsp;THEME',
      foot    : '<span class="dot-live"></span>&nbsp;ON-DEMAND NARRATIVE · MACHINE SPEED',
      builder : 'gen',
    },
  };

  // ── Probe token — cancels stale async callbacks on mode switch ───
  let _token = 0;

  // ── Build farm: gradient clips — chaotic directions & speeds ─────
  function buildClips(){
    _token++; // invalidate any pending GIF probe
    let html = '';
    for(let s = 0; s < SHELVES; s++){
      html += '<div class="shelf">';
      for(let p = 0; p < PER; p++){
        const clips = [clipHTML(), clipHTML(), clipHTML()];
        clips.sort(() => Math.random() - 0.5);
        const inner = clips.concat(clips).join('');
        const dur   = rnd(1.8, 16).toFixed(2);
        const delay = (-rnd(0, 16)).toFixed(2);
        const dir   = Math.random() < 0.5 ? 'normal' : 'reverse';
        html += '<div class="mphone-wrap"><div class="mphone"><div class="mreel" style="'
          + 'animation-duration:' + dur + 's;'
          + 'animation-delay:'    + delay + 's;'
          + 'animation-direction:' + dir + '">'
          + inner + '</div></div></div>';
      }
      html += '</div>';
    }
    farm.innerHTML = html;
    farm.classList.add('run');
  }

  // ── Build farm: video on every phone with chaotic random start ───
  function buildVideoFarm(src, cols, rows){
    const tok = ++_token;
    farm.innerHTML = '';
    farm.classList.remove('run');

    let html = '';
    for(let s = 0; s < rows; s++){
      html += '<div class="shelf" style="grid-template-columns:repeat(' + cols + ',1fr)">';
      for(let p = 0; p < cols; p++){
        html += '<div class="mphone-wrap"><div class="mphone">'
          + '<video class="mscreen" autoplay loop muted playsinline preload="metadata" src="' + src + '"></video>'
          + '</div></div>';
      }
      html += '</div>';
    }
    farm.innerHTML = html;

    // Seek each video to a random offset → chaotic starts
    farm.querySelectorAll('video.mscreen').forEach(v => {
      const seek = () => {
        if(_token !== tok) return;
        v.currentTime = Math.random() * (v.duration || 14);
      };
      if(v.readyState >= 1){ seek(); }
      else { v.addEventListener('loadedmetadata', seek, {once:true}); }
    });
  }

  // ── Build farm: mass-report phones — realistic app flow ─────────
  const R_PLATS  = [
    {id:'YT', clr:'#c0392b'}, {id:'TW', clr:'#1da1f2'},
    {id:'IG', clr:'#8e44ad'}, {id:'TK', clr:'#69c9d0'},
    {id:'FB', clr:'#2980b9'},
  ];
  const R_TARGETS = [
    {name:'@viral_claim_tv',  text:'BREAKING: Scientists confirm what they\'ve been hiding for decades. Share before deleted.'},
    {name:'@exposedhub',      text:'EXPOSED: The real footage they don\'t want you to see. This changes everything.'},
    {name:'@disinfo_daily',   text:'NEW STUDY: 94% of doctors agree the official story is fabricated. Sources inside.'},
    {name:'@fake_news_wire',  text:'URGENT: Forward this to everyone — mainstream media is burying this right now.'},
    {name:'@truth_blast_99',  text:'They lied about all of it. Here\'s the proof they\'re desperately trying to censor.'},
    {name:'@narrative_check', text:'SHARE NOW: Independent reporter confirms coordinated cover-up at highest levels.'},
    {name:'@realinfo_hub',    text:'What they won\'t tell you: leaked documents show everything was staged.'},
  ];
  const R_STUBS = [
    '@morning_feed','@news_brief','@world_update','@breaking_hq',
    '@daily_digest','@info_stream','@press_wire','@live_desk',
  ];
  const R_OPTIONS = ['Spam or scam','Misinformation','Hate speech','Harassment','False news','Dangerous content'];
  const R_AV_CLRS = ['#c0392b','#2980b9','#8e44ad','#16a085','#e67e22','#27ae60','#d35400'];

  function stubPost(stubs){
    const h = stubs[(Math.random()*stubs.length)|0];
    const av = R_AV_CLRS[(Math.random()*R_AV_CLRS.length)|0];
    const hr = Math.floor(rnd(1,72));
    const t = hr<24? hr+'h': Math.floor(hr/24)+'d';
    const w1=(50+Math.random()*35).toFixed(0), w2=(30+Math.random()*40).toFixed(0);
    return '<div class="rfeed-post">'
      + '<div class="rph"><div class="rpav" style="background:'+av+'33;border:1px solid '+av+'55"></div>'
      + '<div class="rpmc"><div class="rpname">'+h+'</div><div class="rptime">'+t+' ago</div></div></div>'
      + '<div class="rpstub" style="width:'+w1+'%"></div>'
      + '<div class="rpstub" style="width:'+w2+'%"></div>'
      + '</div>';
  }

  function buildReportFarm(){
    ++_token;
    const COLS = 4, ROWS = 2;
    let html = '';
    for(let s = 0; s < ROWS; s++){
      html += '<div class="shelf" style="grid-template-columns:repeat('+COLS+',1fr)">';
      for(let p = 0; p < COLS; p++){
        const cycleDur = rnd(4, 7).toFixed(2);
        const cycleDel = (-rnd(0, 7)).toFixed(2);
        const plat     = R_PLATS[(Math.random()*R_PLATS.length)|0];
        const target   = R_TARGETS[(Math.random()*R_TARGETS.length)|0];
        const av       = R_AV_CLRS[(Math.random()*R_AV_CLRS.length)|0];
        const hr       = Math.floor(rnd(1,48));
        const t        = hr<24? hr+'h': Math.floor(hr/24)+'d';
        const likes    = Math.floor(rnd(200,95000));
        const likeFmt  = likes>=1000? (likes/1000).toFixed(1)+'K': likes;
        // random report reason, one picked
        const opts     = R_OPTIONS.slice().sort(()=>Math.random()-.5).slice(0,4);
        const pickedI  = (Math.random()*opts.length)|0;
        const optsHtml = opts.map((o,i)=>
          '<div class="ropt'+(i===pickedI?' rpicked':'')+'">'
          + '<div class="ropt-radio"></div>'
          + '<span class="ropt-lbl">'+o+'</span>'
          + '</div>'
        ).join('');

        html += '<div class="mphone-wrap"><div class="mphone"><div class="rphone-wrap">'
          // nav bar
          + '<div class="rnav">'
          +   '<div class="rnav-dot" style="background:'+plat.clr+'"></div>'
          +   '<span class="rnav-label">'+plat.id+' &nbsp;·&nbsp; For You</span>'
          +   '<span class="rnav-icon">⋮</span>'
          + '</div>'
          // feed
          + '<div class="rfeed">'
          +   stubPost(R_STUBS)
          +   stubPost(R_STUBS)
          +   '<div class="rfeed-post rtarget">'
          +     '<div class="rph">'
          +       '<div class="rpav" style="background:'+av+'33;border:1px solid '+av+'55"></div>'
          +       '<div class="rpmc"><div class="rpname">'+target.name+'</div><div class="rptime">'+t+' ago</div></div>'
          +       '<span class="rpdots">&#x22EE;</span>'
          +     '</div>'
          +     '<div class="rptext">'+target.text+'</div>'
          +     '<div class="rpreact"><span>&#x2665; '+likeFmt+'</span><span>&#x21A9; Reply</span></div>'
          +   '</div>'
          +   stubPost(R_STUBS)
          + '</div>'
          // report sheet
          + '<div class="rsheet" style="--rt:'+cycleDur+'s;animation-delay:'+cycleDel+'s">'
          +   '<div class="rsheet-handle"></div>'
          +   '<div class="rsheet-hdr">Why are you reporting this?</div>'
          +   optsHtml
          +   '<div class="rsubmit-btn" style="--rt:'+cycleDur+'s;animation-delay:'+cycleDel+'s">SUBMIT REPORT</div>'
          + '</div>'
          // confirmation
          + '<div class="rconfirm-screen" style="--rt:'+cycleDur+'s;animation-delay:'+cycleDel+'s">'
          +   '<span class="rchk">&#10003;</span>'
          +   '<div class="rconfirm-title">Report submitted</div>'
          +   '<div class="rconfirm-sub">Thanks for helping keep the platform safe.</div>'
          + '</div>'
          + '</div></div></div>';
      }
      html += '</div>';
    }
    farm.innerHTML = html;
    farm.classList.add('run');
  }

  // ── Build farm: GIF showcase — real generated content ───────────
  const GEN_GIFS = [
    'qlosophy/gifs/am_i_murderer.gif',
    'qlosophy/gifs/are_you_murderer.gif',
    'qlosophy/gifs/crypto_safe.gif',
    'qlosophy/gifs/data_safe.gif',
    'qlosophy/gifs/i_can_feel.gif',
    'qlosophy/gifs/ive_been_trying.gif',
    'qlosophy/gifs/vid01.gif',
    'qlosophy/gifs/vid02.gif',
    'qlosophy/gifs/vid03.gif',
    'qlosophy/gifs/vid04.gif',
    'qlosophy/gifs/vid05.gif',
    'qlosophy/gifs/vid06.gif',
    'qlosophy/gifs/vid07.gif',
    'qlosophy/gifs/vid42.gif',
    'qlosophy/gifs/vid43.gif',
    'qlosophy/gifs/vid44.gif',
    'qlosophy/gifs/vid45.gif',
    'qlosophy/gifs/vid46.gif',
    'qlosophy/gifs/vid47.gif',
    'qlosophy/gifs/vid48.gif',
  ];

  function buildGenFarm(){
    ++_token;
    const COLS = 4, ROWS = 2;
    // Shuffle order for variety on each switch
    const shuffled = GEN_GIFS.slice().sort(() => Math.random() - 0.5);
    let html = '';
    let idx = 0;
    for(let s = 0; s < ROWS; s++){
      html += '<div class="shelf" style="grid-template-columns:repeat(' + COLS + ',1fr)">';
      for(let p = 0; p < COLS; p++){
        const src = shuffled[idx % shuffled.length];
        idx++;
        html += '<div class="mphone-wrap"><div class="mphone">'
          + '<img class="mscreen gif-screen" src="' + src + '" alt="" loading="lazy">'
          + '</div></div>';
      }
      html += '</div>';
    }
    farm.innerHTML = html;
    farm.classList.remove('run');
  }

  // ── Switch mode ──────────────────────────────────────────────────
  let currentMode = 'shorts';
  function setMode(mode){
    currentMode = mode;
    const cfg = MODES[mode] || MODES.shorts;
    farmLabel.innerHTML = cfg.label;
    farmMeta.innerHTML  = cfg.meta;
    farmFoot.innerHTML  = cfg.foot;
    if(cfg.video){
      buildVideoFarm(cfg.video, cfg.vidCols || 8, cfg.vidRows || 3);
    } else if(cfg.builder === 'report'){
      buildReportFarm();
    } else if(cfg.builder === 'gen'){
      buildGenFarm();
    } else {
      buildClips();
    }
  }

  // initial render — matches the HTML's default active button (data-mode="watch")
  setMode('watch');

  // ── Sector tab clicks ────────────────────────────────────────────
  document.querySelectorAll('.sector').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sector').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      setMode(btn.dataset.mode || 'shorts');
    });
  });

  // ── Run animations only while screen 5 is visible ────────────────
  new IntersectionObserver(es => {
    es.forEach(e => {
      if(!MODES[currentMode] || !MODES[currentMode].video){
        farm.classList.toggle('run', e.isIntersecting);
      }
    });
  }, {threshold: .12}).observe(document.getElementById('s5'));

})();

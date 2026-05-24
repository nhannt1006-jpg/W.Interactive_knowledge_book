// ═══════════════════════════════════════════════════════════
// Knowledge Book — app.js  v0.06
// Reads window.KB_GRAPH, window.KB_CONTENT, window.KB_INDEX
// set by kb-data.js (no server needed — works via file://)
// ═══════════════════════════════════════════════════════════

(function () {

  const KB      = window.KB_GRAPH.KB;
  const L1CONN  = window.KB_GRAPH.L1CONN;
  const XLINKS  = window.KB_GRAPH.XLINKS;
  const KBIDX   = window.KB_INDEX;   // topic index for Index panel

  // ── FLATTEN + INDEX
  const nodeById = {};
  KB.forEach(cat => {
    nodeById[cat.id] = cat;
    cat.children.forEach(sub => {
      sub.parentId = cat.id;
      sub.parentLabel = cat.label.replace('\n', ' ');
      nodeById[sub.id] = sub;
      sub.children.forEach(el => {
        el.parentId         = sub.id;
        el.parentLabel      = sub.label;
        el.grandParentId    = cat.id;
        el.grandParentLabel = cat.label.replace('\n', ' ');
        const c = window.KB_CONTENT[el.id] || {};
        el.obj     = c.obj     || '';
        el.checks  = c.checks  || [];
        el.summary = c.summary || '';
        nodeById[el.id] = el;
      });
    });
  });

  // ── GEOMETRY
  const graphEl = document.getElementById('graph');
  let GW, GH, CX, CY, L1R, NR1, NR2, NR3 = 9;

  function computeGeo() {
    GW = graphEl.clientWidth; GH = graphEl.clientHeight;
    CX = GW / 2; CY = GH / 2;
    L1R = Math.min(GW, GH) * 0.31;
    NR1 = Math.max(42, Math.min(Math.min(GW, GH) * 0.05, 58));
    NR2 = Math.max(28, Math.min(Math.min(GW, GH) * 0.028, 38));
  }

  function placeNodes() {
    KB.forEach((cat, i) => {
      const a = (i / KB.length) * 2 * Math.PI - Math.PI / 2;
      cat.x = CX + L1R * Math.cos(a);
      cat.y = CY + L1R * Math.sin(a);
      cat.angle = a;
      cat.children.forEach((sub, j) => {
        const n = cat.children.length;
        const span = Math.min(n * 0.48, Math.PI * 0.82);
        const sa = n > 1 ? a - span / 2 : a;
        const sa2 = sa + j * (n > 1 ? span / (n - 1) : 0);
        const d = NR1 + NR2 + Math.max(55, n * 12);
        sub.x = cat.x + d * Math.cos(sa2);
        sub.y = cat.y + d * Math.sin(sa2);
        sub.px = cat.x; sub.py = cat.y;
        const l2angle = Math.atan2(sub.y - cat.y, sub.x - cat.x);
        const m = sub.children.length;
        const l3span = Math.min(m * 0.42, Math.PI * 0.72);
        sub.children.forEach((el, k) => {
          const l3a = m > 1 ? l2angle - l3span / 2 + k * (l3span / (m - 1)) : l2angle;
          el.x = sub.x + (NR2 + NR3 + 30) * Math.cos(l3a);
          el.y = sub.y + (NR2 + NR3 + 30) * Math.sin(l3a);
        });
      });
    });
  }

  computeGeo(); placeNodes();

  // ── SVG
  const svg = d3.select('#graph').append('svg').attr('width', GW).attr('height', GH);
  const zg  = svg.append('g');
  const defs = svg.append('defs');

  // Arrow markers: grey, dark, red
  [['arrg','#bbb'],['arrhl','#333'],['arrr','#dc2626']].forEach(([id, fill]) => {
    defs.append('marker').attr('id', id)
      .attr('markerWidth',7).attr('markerHeight',5).attr('refX',6).attr('refY',2.5).attr('orient','auto')
      .append('path').attr('d','M0,0 L7,2.5 L0,5 Z').attr('fill', fill);
  });

  // ── DECORATIVE RINGS
  const ringG = zg.append('g').attr('class','rings');
  [L1R+NR1+48, L1R+NR1+95].forEach(r => {
    ringG.append('circle').attr('cx',CX).attr('cy',CY).attr('r',r)
      .attr('fill','none').attr('stroke','#e4e4e2').attr('stroke-dasharray','4,7').attr('stroke-width',1);
  });
  ringG.append('circle').attr('cx',CX).attr('cy',CY).attr('r',L1R)
    .attr('fill','none').attr('stroke','#e4e4e2').attr('stroke-dasharray','4,7').attr('stroke-width',1);

  // Ring arc labels — add class so we can hide them on selection
  [{r:L1R+NR1+95,text:'OVERLAYS · LOCAL POLICY · COUNCIL-SPECIFIC'},
   {r:L1R+NR1+48,text:'RESCODE · NCC · BUILDING REGULATIONS'}].forEach(rl => {
    const id = 'rl'+rl.r;
    defs.append('path').attr('id',id)
      .attr('d',`M ${CX-rl.r},${CY} a ${rl.r},${rl.r} 0 0,1 ${rl.r*2},0`);
    ringG.append('text').attr('class','ring-label')
      .attr('font-size',8).attr('fill','#bbb').attr('letter-spacing','0.12em')
      .append('textPath').attr('href','#'+id).attr('startOffset','8%').text(rl.text);
  });

  // ── LAYERS
  const xlinkLayer = zg.append('g').attr('class','xlink-layer');
  const connG      = zg.append('g').attr('class','conns');
  const connPaths  = connG.selectAll('.connpath').data(L1CONN).join('g').attr('class','connpath');
  connPaths.append('path').attr('fill','none').attr('stroke','#bbb').attr('stroke-width',1.5)
    .attr('stroke-dasharray','5,4').attr('marker-end','url(#arrg)');
  connPaths.append('rect').attr('fill','#fff').attr('stroke','#e4e4e2').attr('stroke-width',.5).attr('rx',2);
  connPaths.append('text').attr('class','connlbl').attr('text-anchor','middle')
    .attr('font-size',8).attr('font-weight',600).attr('letter-spacing','.06em')
    .attr('fill','#666').attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif');

  function drawConns() {
    connPaths.each(function(d) {
      const a = nodeById[d.a], b = nodeById[d.b];
      if (!a || !b) return;
      const g = d3.select(this);
      const mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
      const cpx=CX+(mx-CX)*0.38, cpy=CY+(my-CY)*0.38;
      const ang=Math.atan2(b.y-a.y,b.x-a.x);
      const sx=a.x+NR1*Math.cos(ang), sy=a.y+NR1*Math.sin(ang);
      const ex=b.x-NR1*Math.cos(ang), ey=b.y-NR1*Math.sin(ang);
      g.select('path').attr('d',`M${sx},${sy} Q${cpx},${cpy} ${ex},${ey}`);
      const lx=0.25*sx+0.5*cpx+0.25*ex, ly=0.25*sy+0.5*cpy+0.25*ey;
      const txt=d.label.toUpperCase(), tw=txt.length*5.2;
      g.select('rect').attr('x',lx-tw/2-4).attr('y',ly-8).attr('width',tw+8).attr('height',13).attr('rx',2);
      g.select('text').attr('x',lx).attr('y',ly+4).text(txt);
    });
  }
  drawConns();

  // ── BACK BUTTON
  const backG = zg.append('g').attr('class','backbtn').on('click', ()=>{
    if (curTopic) exitTopicFocus(true);
    else clearSelection();
  });
  backG.append('rect').attr('x',CX-52).attr('y',CY+L1R+NR1+16).attr('width',104).attr('height',24)
    .attr('fill','#fff').attr('stroke','#1a1a1a').attr('stroke-width',1).attr('rx',2);
  backG.append('text').attr('x',CX).attr('y',CY+L1R+NR1+32).attr('text-anchor','middle')
    .attr('font-size',10).attr('font-weight',700).attr('letter-spacing','.1em')
    .attr('fill','#1a1a1a').attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif').text('← BACK TO ALL');

  // ── L3 LINES + NODES
  const allL3Els = KB.flatMap(c => c.children.flatMap(s => s.children));
  const allSubs  = KB.flatMap(c => c.children);

  const l3LineG = zg.append('g').attr('class','l3lines');
  allL3Els.forEach(el => {
    const sub = nodeById[el.parentId]; if (!sub) return;
    l3LineG.append('line').attr('class','l3line').attr('data-pid',el.parentId)
      .attr('x1',sub.x).attr('y1',sub.y).attr('x2',el.x).attr('y2',el.y)
      .attr('stroke','#ddd').attr('stroke-width',0.8).attr('stroke-dasharray','2,3');
  });

  const l3Layer  = zg.append('g').attr('class','l3layer');
  const l3Groups = l3Layer.selectAll('.l3g').data(allL3Els).join('g').attr('class','l3g')
    .attr('transform', d=>`translate(${d.x},${d.y})`)
    .on('click',(e,d)=>{ e.stopPropagation(); selectL3OnCanvas(d); });
  l3Groups.append('title').text(d=>d.label);
  l3Groups.append('circle').attr('class','l3circ').attr('r',NR3)
    .attr('fill',d=>d.flag==='WD'?'#f0f0f0':'#fff')
    .attr('stroke',d=>d.flag==='WD'?'#999':'#1a1a1a').attr('stroke-width',1);
  l3Groups.append('circle').attr('class','l3ring').attr('r',NR3+4)
    .attr('fill','none').attr('stroke','#f59e0b').attr('stroke-width',2).attr('opacity',0);

  // ── L3 LABEL: outside the circle (below), more readable than 6px inside
  l3Groups.append('text').attr('class','l3lbl')
    .attr('text-anchor','middle')
    .attr('y', NR3 + 9)
    .attr('font-size', 6.5)
    .attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif')
    .attr('pointer-events','none')
    .each(function(d) {
      const words = d.label.split(' ');
      // Up to 2 words, max 13 chars total
      const short = words.length <= 2 ? words.join(' ') : words[0] + ' ' + words[1];
      const label = short.length > 13 ? short.substring(0, 11) + '…' : short;
      d3.select(this).attr('fill', d.flag==='WD' ? '#aaa' : '#555').text(label);
    });

  // ── L2 LINES + NODES
  const l2LineG = zg.append('g').attr('class','l2lines');
  allSubs.forEach(sub => {
    const cat=nodeById[sub.parentId]; if(!cat) return;
    l2LineG.append('line').attr('class','l2line')
      .attr('data-pid',sub.parentId)
      .attr('data-id',sub.id)      // ← for individual selection highlight
      .attr('x1',cat.x).attr('y1',cat.y).attr('x2',sub.x).attr('y2',sub.y)
      .attr('stroke','#ccc').attr('stroke-width',1).attr('stroke-dasharray','3,3');
  });

  const l2G      = zg.append('g').attr('class','l2layer');
  const l2Groups = l2G.selectAll('.l2g').data(allSubs).join('g').attr('class','l2g')
    .attr('transform',d=>`translate(${d.x},${d.y})`)
    .on('click',(e,d)=>{ e.stopPropagation(); selectL2(d); });
  l2Groups.append('circle').attr('class','l2circ').attr('r',NR2)
    .attr('fill','#fff').attr('stroke','#1a1a1a').attr('stroke-width',1.5);
  l2Groups.append('text').attr('class','l2lbl').attr('text-anchor','middle')
    .attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif')
    .each(function(d) {
      const g=d3.select(this);
      const fs=d.label.length>14?7:8;
      g.attr('font-size',fs).attr('font-weight',600).attr('fill','#1a1a1a').attr('letter-spacing','.03em');
      const words=d.label.split(' ');
      let lines = words.length===1 ? [words[0]] : words.length===2 ? words :
        [words.slice(0,Math.ceil(words.length/2)).join(' '), words.slice(Math.ceil(words.length/2)).join(' ')];
      const lh=fs*1.25, startY=lines.length===1?0:-(lh/2);
      lines.forEach((line,i)=>g.append('tspan').attr('x',0).attr('dy',i===0?`${startY}px`:`${lh}px`).text(line));
    });
  l2Groups.each(function(d) {
    d3.select(this).append('text').attr('class','l2count').attr('x',NR2+2).attr('y',-NR2+2)
      .attr('font-size',7).attr('fill','#bbb').attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif')
      .text(d.children.length);
  });

  // ── L1 HUBS
  const l1G      = zg.append('g').attr('class','l1layer');
  const l1Groups = l1G.selectAll('.l1g').data(KB).join('g').attr('class','l1g')
    .attr('transform',d=>`translate(${d.x},${d.y})`)
    .on('click',(e,d)=>{ e.stopPropagation(); selectL1(d); });
  l1Groups.append('circle').attr('r',NR1+8)
    .attr('fill','none').attr('stroke','#1a1a1a').attr('stroke-width',.4).attr('opacity',.3);
  l1Groups.append('circle').attr('class','l1circ').attr('r',NR1).attr('fill','#1a1a1a');
  l1Groups.append('text').attr('text-anchor','middle').attr('y',-8)
    .attr('font-size',NR1*0.42).attr('fill','#fff').attr('dominant-baseline','middle')
    .attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif').text(d=>d.icon);
  l1Groups.each(function(d) {
    const g=d3.select(this);
    d.label.split('\n').forEach((line,i)=>
      g.append('text').attr('text-anchor','middle').attr('y',NR1*0.22+(i*10))
        .attr('font-size',8).attr('font-weight',700).attr('letter-spacing','.1em')
        .attr('fill','#fff').attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif').text(line));
  });
  l1Groups.append('text').attr('text-anchor','middle').attr('y',NR1+13)
    .attr('font-size',7.5).attr('fill','#999').attr('letter-spacing','.06em')
    .attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif')
    .text(d=>`${d.children.reduce((a,s)=>a+s.children.length,0)} elements`);

  // ── CENTER TITLE
  const cg = zg.append('g').attr('class','center-g').on('click',e=>e.stopPropagation());
  cg.append('rect').attr('x',CX-78).attr('y',CY-42).attr('width',156).attr('height',84)
    .attr('fill','#fff').attr('stroke','#1a1a1a').attr('stroke-width',1.5).attr('rx',2);
  [{t:'KNOWLEDGE',y:-22,sz:12,w:700,ls:.1},{t:'BOOK',y:-4,sz:18,w:900,ls:.15},
   {t:'v0.06 · Victoria',y:18,sz:8.5,w:400,ls:.08,col:'#999'},{t:'Click a category',y:30,sz:8,w:400,ls:.05,col:'#bbb'}]
  .forEach(d=>cg.append('text').attr('x',CX).attr('y',CY+d.y).attr('text-anchor','middle')
    .attr('font-size',d.sz).attr('font-weight',d.w||400).attr('letter-spacing',d.ls||0)
    .attr('fill',d.col||'#1a1a1a').attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif').text(d.t));

  // ── HELPERS: hide/show center + ring labels on selection
  function hideCenterUI() {
    cg.classed('hidden', true);
    d3.selectAll('.ring-label').attr('opacity', 0);
  }
  function showCenterUI() {
    cg.classed('hidden', false);
    d3.selectAll('.ring-label').attr('opacity', 1);
  }

  // ═══════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════
  let selL1=null, selL2=null, selL3=null, curMode='browse', curFilter='all', curTopic=null;

  // ═══════════════════════════════════════════════════════════
  // GRAPH INTERACTIONS
  // ═══════════════════════════════════════════════════════════
  function selectL1(cat) {
    if (curTopic) exitTopicFocus(false);
    if (selL1===cat) { clearSelection(); return; }
    selL1=cat; selL2=null; selL3=null;
    clearXLinks();
    showCenterUI();   // center visible when only L1 is selected
    l1Groups.classed('faded',d=>d.id!==cat.id);
    l2Groups.each(function(d){ d3.select(this).classed('vis',d.parentId===cat.id); });
    // Fix: use l2LineG (not l2G) for lines
    l2LineG.selectAll('.l2line').classed('vis', false).classed('l2line-sel', false).each(function(){
      d3.select(this).classed('vis', d3.select(this).attr('data-pid')===cat.id);
    });
    l3Groups.classed('vis',false);
    l3LineG.selectAll('.l3line').classed('vis',false);
    backG.classed('vis',true);
    closePanel();
    applyFilter();
  }

  function selectL2(sub) {
    selL2=sub; selL3=null;
    clearXLinks();
    hideCenterUI();   // hide center + ring labels when L2 selected
    l2Groups.classed('sel',d=>d.id===sub.id);
    l3Groups.each(function(d){ d3.select(this).classed('vis',d.parentId===sub.id).classed('sel',false); });
    l3LineG.selectAll('.l3line').each(function(){
      d3.select(this).classed('vis', d3.select(this).attr('data-pid')===sub.id);
    });
    // Highlight the specific L2→L1 parent line with a black selection dash
    l2LineG.selectAll('.l2line').classed('l2line-sel', false).each(function(){
      d3.select(this).classed('l2line-sel', d3.select(this).attr('data-id')===sub.id);
    });
    openL2Panel(sub);
  }

  function selectL3OnCanvas(el) {
    selL3=el;
    hideCenterUI();   // hide center + ring labels when L3 selected
    l3Groups.classed('sel',d=>d.id===el.id);
    drawXLinks(el);
    openL3Panel(el.id);
  }

  function clearXLinks() { xlinkLayer.selectAll('*').remove(); }

  // ── CROSS-LINKS: curved red lines (fix #3)
  function drawXLinks(el) {
    clearXLinks();
    XLINKS.filter(x=>x.s===el.id||x.t===el.id).forEach(x=>{
      const otherId = x.s===el.id ? x.t : x.s;
      const other   = nodeById[otherId]; if(!other) return;
      const targetCat = nodeById[other.grandParentId]; if(!targetCat) return;
      const ang = Math.atan2(targetCat.y-el.y, targetCat.x-el.x);
      const ex  = targetCat.x - NR1*Math.cos(ang);
      const ey  = targetCat.y - NR1*Math.sin(ang);

      // Quadratic bezier: control point offset perpendicular to midpoint
      const mx = (el.x+ex)/2, my = (el.y+ey)/2;
      const dx = ex-el.x, dy = ey-el.y;
      const cpx = mx - dy*0.28, cpy = my + dx*0.28;

      const g = xlinkLayer.append('g').attr('class','xlink-arc')
        .on('click',e=>{ e.stopPropagation(); navigateTo(otherId); });

      // Curved red dashed path
      g.append('path')
        .attr('d',`M${el.x},${el.y} Q${cpx},${cpy} ${ex},${ey}`)
        .attr('fill','none')
        .attr('stroke','#dc2626').attr('stroke-width',1.5)
        .attr('stroke-dasharray','4,3')
        .attr('marker-end','url(#arrr)');

      // Label at bezier midpoint (formula: 0.25*P0 + 0.5*P1 + 0.25*P2)
      const lx = 0.25*el.x + 0.5*cpx + 0.25*ex;
      const ly = 0.25*el.y + 0.5*cpy + 0.25*ey;
      const tw = x.label.length*4.8;
      g.append('rect').attr('x',lx-tw/2-3).attr('y',ly-7).attr('width',tw+6).attr('height',12)
        .attr('fill','#fff').attr('stroke','#fca5a5').attr('stroke-width',.5).attr('rx',2);
      g.append('text').attr('x',lx).attr('y',ly+4).attr('text-anchor','middle')
        .attr('font-size',7.5).attr('fill','#dc2626')
        .attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif').text(x.label);

      // Red ring on target hub
      xlinkLayer.append('circle')
        .attr('cx',targetCat.x).attr('cy',targetCat.y).attr('r',NR1+4)
        .attr('fill','none').attr('stroke','#dc2626').attr('stroke-width',1.5)
        .attr('stroke-dasharray','4,3').attr('opacity',.7);
    });
  }

  function navigateTo(id) {
    const el=nodeById[id]; if(!el||!el.grandParentId) return;
    const cat=nodeById[el.grandParentId], sub=nodeById[el.parentId];
    if (cat) selectL1(cat);
    setTimeout(()=>{ if(sub) selectL2(sub); setTimeout(()=>openL3Panel(id),80); },60);
  }

  function clearSelection() {
    selL1=null; selL2=null; selL3=null;
    clearXLinks();
    showCenterUI();
    l1Groups.classed('faded',false);
    l2Groups.classed('vis',false).classed('sel',false);
    l2LineG.selectAll('.l2line').classed('vis',false).classed('l2line-sel',false);
    l3Groups.classed('vis',false).classed('sel',false).each(function(){
      d3.select(this).select('.l3ring').attr('opacity',0);
    });
    l3LineG.selectAll('.l3line').classed('vis',false);
    backG.classed('vis',false);
    closePanel();
  }

  svg.on('click', clearSelection);

  // ── MODE TOGGLE
  document.querySelectorAll('.mbtn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      curMode=btn.dataset.m;
      document.querySelectorAll('.mbtn').forEach(b=>b.classList.remove('on'));
      btn.classList.add('on');
      const showConn=curMode==='connect';
      d3.selectAll('.connpath').classed('vis',showConn);
      cg.classed('hidden',showConn);
    });
  });

  // ── FILTER
  function applyFilter() {
    l2Groups.each(function(d){
      if(!selL1||d.parentId!==selL1.id) return;
      const show=d.children.some(el=>curFilter==='all'||el.flag===curFilter||el.flag==='BOTH');
      d3.select(this).classed('vis',show&&!!selL1);
    });
    if(selL2) openL2Panel(selL2);
  }
  document.querySelectorAll('.fbtn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      curFilter=btn.dataset.f;
      document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('on'));
      btn.classList.add('on');
      applyFilter();
    });
  });

  // ═══════════════════════════════════════════════════════════
  // INDEX PANEL (LEFT SIDE)
  // ═══════════════════════════════════════════════════════════
  const idxBtn   = document.getElementById('idx-btn');
  const idxPanel = document.getElementById('idx-panel');
  const idxList  = document.getElementById('idx-list');

  idxBtn.addEventListener('click',()=>{
    if(idxBtn.classList.contains('on')) {
      idxBtn.classList.remove('on');
      exitTopicFocus(false);   // close everything
    } else {
      idxBtn.classList.add('on');
      clearSelection();
      openIndexPanel();
    }
  });

  function openIndexPanel() {
    // Populate left panel with simplified topic list
    const flagCounts = (topic) => {
      const ids   = new Set(topic.nodes);
      const nodes = allL3Els.filter(el => ids.has(el.id));
      const tp    = nodes.filter(el => el.flag==='TP'||el.flag==='BOTH').length;
      const wd    = nodes.filter(el => el.flag==='WD'||el.flag==='BOTH').length;
      return { tp, wd };
    };

    idxList.innerHTML = KBIDX.map((topic, i) => {
      const { tp, wd } = flagCounts(topic);
      return `<div class="idx-item" data-idx="${i}">
        <div class="idx-item-title">${topic.title}</div>
        <div class="idx-item-meta">
          ${tp ? `<span class="lbadge badge-tp" style="width:auto;padding:1px 5px;font-size:8px">TP ${tp}</span>` : ''}
          ${wd ? `<span class="lbadge badge-wd" style="width:auto;padding:1px 5px;font-size:8px">WD ${wd}</span>` : ''}
        </div>
      </div>`;
    }).join('');

    idxPanel.classList.add('open');
    document.getElementById('sugbtn').style.display = 'none';

    document.querySelectorAll('.idx-item').forEach(item=>{
      item.addEventListener('click',()=>{
        document.querySelectorAll('.idx-item').forEach(i=>i.classList.remove('active'));
        item.classList.add('active');
        focusTopic(KBIDX[parseInt(item.dataset.idx)]);
      });
    });
  }

  function focusTopic(topic) {
    curTopic = topic;
    const ids = new Set(topic.nodes);

    l1Groups.classed('faded', false);
    l2Groups.classed('vis', false).classed('sel', false);
    l2LineG.selectAll('.l2line').classed('vis', false).classed('l2line-sel', false);

    const parentIds = new Set(), grandIds = new Set();
    allL3Els.forEach(el => {
      if(ids.has(el.id)) { parentIds.add(el.parentId); grandIds.add(el.grandParentId); }
    });

    l2Groups.each(function(d){ d3.select(this).classed('vis', parentIds.has(d.id)); });
    l2LineG.selectAll('.l2line').each(function(){
      d3.select(this).classed('vis', grandIds.has(d3.select(this).attr('data-pid')));
    });
    l1Groups.classed('faded', d => !grandIds.has(d.id));

    l3Groups.each(function(d){
      const match = ids.has(d.id);
      d3.select(this).classed('vis', match).classed('sel', false);
      d3.select(this).select('.l3ring').attr('opacity', match ? 1 : 0);
    });
    l3LineG.selectAll('.l3line').each(function(){
      d3.select(this).classed('vis', parentIds.has(d3.select(this).attr('data-pid')));
    });

    backG.classed('vis', true);

    // Open RIGHT panel with topic detail
    openTopicPanel(topic);
  }

  function openTopicPanel(topic) {
    const ids   = new Set(topic.nodes);
    const nodes = allL3Els.filter(el => ids.has(el.id));

    document.getElementById('ppath').textContent  = 'TOPIC INDEX';
    document.getElementById('ptitle').textContent = topic.title;

    const nodeRows = nodes.map(el => {
      const fc = el.flag==='TP'?'badge-tp':el.flag==='WD'?'badge-wd':'badge-both';
      const fl = el.flag==='BOTH'?'TP+WD':el.flag||'—';
      return `<div class="l3item" onclick="window._app.navigateTo('${el.id}')">
        <span class="lbadge ${fc}">${fl}</span>
        <span class="l3lbl">${el.label}</span>
      </div>`;
    }).join('');

    const kws = topic.keywords.map(k=>`<span class="kw-chip">${k}</span>`).join('');

    document.getElementById('pbody').innerHTML = `
      <div class="dback" onclick="window._app.backToTopicList()">← All Topics</div>
      <div class="dsec">
        <div class="dsec-t">Keywords</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">${kws}</div>
      </div>
      <div class="dsec">
        <div class="dsec-t">Elements in this topic (${nodes.length})</div>
        ${nodeRows}
      </div>
      <div class="dsec">
        <div class="dsec-t">AI Reference File</div>
        <div class="dsec-b"><span class="dsrc">${topic.file}</span></div>
      </div>
    `;
    document.getElementById('panel').classList.add('open');
    document.getElementById('sugbtn').style.display = 'none';
  }

  // "← All Topics": clear focus, keep left panel open
  function backToTopicList() {
    curTopic = null;
    clearXLinks();
    l1Groups.classed('faded', false);
    l2Groups.classed('vis', false).classed('sel', false);
    l2LineG.selectAll('.l2line').classed('vis', false).classed('l2line-sel', false);
    l3Groups.classed('vis', false).classed('sel', false)
      .each(function(){ d3.select(this).select('.l3ring').attr('opacity',0); });
    l3LineG.selectAll('.l3line').classed('vis', false);
    backG.classed('vis', false);
    showCenterUI();
    document.querySelectorAll('.idx-item').forEach(i=>i.classList.remove('active'));
    closePanel();
  }

  function exitTopicFocus(keepLeft) {
    curTopic = null;
    clearXLinks();
    l1Groups.classed('faded', false);
    l2Groups.classed('vis', false).classed('sel', false);
    l2LineG.selectAll('.l2line').classed('vis', false).classed('l2line-sel', false);
    l3Groups.classed('vis', false).classed('sel', false)
      .each(function(){ d3.select(this).select('.l3ring').attr('opacity',0); });
    l3LineG.selectAll('.l3line').classed('vis', false);
    backG.classed('vis', false);
    showCenterUI();
    if (!keepLeft) {
      idxBtn.classList.remove('on');
      idxPanel.classList.remove('open');
      document.querySelectorAll('.idx-item').forEach(i=>i.classList.remove('active'));
      document.getElementById('sugbtn').style.display = '';
    }
    closePanel();
  }

  // ═══════════════════════════════════════════════════════════
  // PANEL RENDERERS (RIGHT)
  // ═══════════════════════════════════════════════════════════
  function openL2Panel(sub) {
    const cat=nodeById[sub.parentId];
    document.getElementById('ppath').textContent  = cat ? cat.label.replace('\n',' ') : '';
    document.getElementById('ptitle').textContent = sub.label;
    const filtered=sub.children.filter(el=>curFilter==='all'||el.flag===curFilter||el.flag==='BOTH');
    document.getElementById('pbody').innerHTML = filtered.map(el=>{
      const fc=el.flag==='TP'?'badge-tp':el.flag==='WD'?'badge-wd':'badge-both';
      const fl=el.flag==='BOTH'?'TP+WD':el.flag||'—';
      const isHilit=selL3&&selL3.id===el.id;
      return `<div class="l3item${isHilit?' hilit':''}" onclick="window._app.openL3Panel('${el.id}');window._app.selectL3(nodeById['${el.id}'])">
        <span class="lbadge ${fc}">${fl}</span>
        <span class="l3lbl">${el.label}</span>
      </div>`;
    }).join('') + (filtered.length===0?'<div style="font-size:11px;color:#999;padding:8px 0">No elements match current filter.</div>':'');
    document.getElementById('panel').classList.add('open');
    document.getElementById('sugbtn').style.display='';
    document.getElementById('sugbtn').onclick = ()=>suggestFor(sub.label, sub.parentLabel||'');
  }

  function openL3Panel(id) {
    const el=nodeById[id]; if(!el) return;
    selL3=el;
    const sub=nodeById[el.parentId], cat=nodeById[el.grandParentId];
    const path=[cat?cat.label.replace('\n',' '):'',sub?sub.label:''].filter(Boolean).join(' › ');
    document.getElementById('ppath').textContent  = path;
    document.getElementById('ptitle').textContent = el.label;
    const fc=el.flag==='TP'?'badge-tp':el.flag==='WD'?'badge-wd':'badge-both';
    const fl=el.flag==='BOTH'?'TP + WD':el.flag||'—';

    const xls=XLINKS.filter(x=>x.s===id||x.t===id);
    const xlHtml=xls.length?`<div class="dsec"><div class="dsec-t">Cross-links</div>${xls.map(x=>{
      const other=nodeById[x.s===id?x.t:x.s];
      const otherCat=other?nodeById[other.grandParentId]:null;
      return `<div class="dcl" onclick="window._app.navigateTo('${other?other.id:''}')">
        <div class="dclbullet"></div>
        <div class="dcltxt"><strong>${other?other.label:''}</strong>
        <div class="dcl-nav">${x.label} · ${otherCat?otherCat.label.replace('\n',' '):''} ↗</div></div>
      </div>`;
    }).join('')}</div>`:'';

    const chkHtml=`<div class="dsec"><div class="dsec-t">Compliance checks</div>${
      el.checks&&el.checks.length
        ?el.checks.map(c=>`<div class="dcheck"><div class="dcheck-box"></div><span>${c}</span></div>`).join('')
        :'<div style="font-size:11px;color:#bbb;font-style:italic">No checklist yet.</div>'
    }</div>`;

    document.getElementById('pbody').innerHTML=`
      <div><span class="lbadge ${fc}" style="font-size:10px;padding:3px 8px">${fl}</span></div>
      <div class="dback" onclick="window._app.openL2Panel(nodeById['${el.parentId}'])">← ${sub?sub.label:''}</div>
      ${el.obj?`<div class="dsec"><div class="dsec-t">Objective</div><div class="dsec-b" style="font-style:italic;color:#555">${el.obj}</div></div>`:''}
      ${el.summary?`<div class="dsec"><div class="dsec-t">Summary</div><div class="dsec-b">${el.summary}</div></div>`:''}
      ${el.tp&&el.tp!=='—'?`<div class="dsec"><div class="dsec-t">Planning permit (TP)</div><div class="dsec-b"><span class="dsrc">${el.tp}</span></div></div>`:''}
      ${el.wd&&el.wd!=='—'?`<div class="dsec"><div class="dsec-t">Building permit (WD)</div><div class="dsec-b"><span class="dsrc">${el.wd}</span></div></div>`:''}
      ${xlHtml}${chkHtml}
      <div class="dsec"><div class="dsec-t">Council notes</div>
      <div class="dsec-b" style="color:#999;font-style:italic;font-size:11px">No council-specific notes yet.</div></div>
    `;
    document.getElementById('panel').classList.add('open');
    document.getElementById('sugbtn').style.display='';
    document.getElementById('sugbtn').onclick=()=>suggestFor(el.label,path);
  }

  function closePanel() { document.getElementById('panel').classList.remove('open'); }

  function suggestFor(name,path) {
    const txt=`[Knowledge Book] Suggested addition\nElement: ${name}\nPath: ${path}\n\nNote: [describe your addition here]`;
    navigator.clipboard.writeText(txt).then(()=>{
      const b=document.getElementById('sugbtn');
      b.textContent='✓ Copied to clipboard';
      setTimeout(()=>b.textContent='+ Suggest an addition',2500);
    });
  }

  // Expose for inline onclick
  window._app = {
    openL2Panel, openL3Panel, openIndexPanel, openTopicPanel,
    navigateTo, selectL3: selectL3OnCanvas, backToTopicList
  };
  window.nodeById = nodeById;

  // ═══════════════════════════════════════════════════════════
  // SEARCH
  // ═══════════════════════════════════════════════════════════
  const srch=document.getElementById('srch'), drop=document.getElementById('sr-drop');

  srch.addEventListener('input',()=>{
    const q=srch.value.trim().toLowerCase();
    if(!q){drop.classList.remove('open');drop.innerHTML='';return;}
    const hits=allL3Els.filter(el=>
      el.label.toLowerCase().includes(q)||(el.tp||'').toLowerCase().includes(q)||
      (el.wd||'').toLowerCase().includes(q)||(el.summary||'').toLowerCase().includes(q)||
      (el.obj||'').toLowerCase().includes(q)
    ).slice(0,12);
    if(!hits.length){drop.innerHTML='<div class="sri" style="color:#999">No results</div>';drop.classList.add('open');return;}
    drop.innerHTML=hits.map(el=>{
      const fc=el.flag==='TP'?'badge-tp':el.flag==='WD'?'badge-wd':'badge-both';
      const fl=el.flag==='BOTH'?'TP+WD':el.flag||'—';
      return `<div class="sri" data-id="${el.id}">
        <span class="sri-badge ${fc}">${fl}</span>
        <span class="sri-name">${el.label}</span>
        <span class="sri-path">${[el.grandParentLabel,el.parentLabel].filter(Boolean).join(' › ')}</span>
      </div>`;
    }).join('');
    drop.classList.add('open');
  });

  drop.addEventListener('click',e=>{
    const item=e.target.closest('.sri[data-id]'); if(!item) return;
    const el=nodeById[item.dataset.id]; if(!el) return;
    const cat=nodeById[el.grandParentId], sub=nodeById[el.parentId];
    if(cat) selectL1(cat);
    setTimeout(()=>{if(sub)selectL2(sub);setTimeout(()=>{openL3Panel(el.id);selectL3OnCanvas(el);},80);},60);
    drop.classList.remove('open'); srch.value='';
  });
  document.addEventListener('click',e=>{
    if(!document.getElementById('srch-wrap').contains(e.target)) drop.classList.remove('open');
  });

  // ═══════════════════════════════════════════════════════════
  // ZOOM / PAN / INIT
  // ═══════════════════════════════════════════════════════════
  const zoom=d3.zoom().scaleExtent([0.3,4]).on('zoom',e=>zg.attr('transform',e.transform));
  svg.call(zoom);

  function fitView(){
    const pad=90, s=Math.min((GW-pad*2)/(L1R*2+NR1*2+120),(GH-pad*2)/(L1R*2+NR1*2+120));
    svg.transition().duration(550).call(zoom.transform,d3.zoomIdentity.translate(GW/2,GH/2).scale(s).translate(-CX,-CY));
  }

  document.getElementById('zin').onclick  = ()=>svg.transition().duration(280).call(zoom.scaleBy,1.35);
  document.getElementById('zout').onclick = ()=>svg.transition().duration(280).call(zoom.scaleBy,0.74);
  document.getElementById('fitbtn').onclick = fitView;

  fitView();
  const hint=document.getElementById('hint');
  setTimeout(()=>hint.classList.add('gone'),5000);
  svg.on('click.hint',()=>hint.classList.add('gone'));
  srch.addEventListener('focus',()=>hint.classList.add('gone'));

  window.addEventListener('resize',()=>{
    computeGeo(); placeNodes();
    svg.attr('width',GW).attr('height',GH);
    l1Groups.attr('transform',d=>`translate(${d.x},${d.y})`);
    l2Groups.attr('transform',d=>`translate(${d.x},${d.y})`);
    l3Groups.attr('transform',d=>`translate(${d.x},${d.y})`);
    drawConns(); fitView(); clearXLinks();
  });

})();

// ═══════════════════════════════════════════════════════════
// Knowledge Book — app.js  v0.07
// Reads window.KB_GRAPH, window.KB_CONTENT, window.KB_INDEX
// set by kb-data.js (no server needed — works via file://)
//
// v0.07 — HUD callout UI:
//   • L3 = small anchor dot + thin connector + rectangular callout box
//     (full label, 2-line wrap, TP/WD/BOTH badge). Anchors always shown;
//     callout box reveals on hover / select. One consistent style.
//   • Red shows the *full active relationship chain* (L3→L2→L1 + jump),
//     not just the external jump line.
//   • External cross-links get a (+) button → isolated connection view.
//   • Wider L2↔L3 spacing + fan.
// ═══════════════════════════════════════════════════════════

(function () {

  const KB      = window.KB_GRAPH.KB;
  const L1CONN  = window.KB_GRAPH.L1CONN;
  const XLINKS  = window.KB_GRAPH.XLINKS;
  const KBIDX   = window.KB_INDEX;   // topic index for Index panel
  const RED     = '#dc2626';

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

  // helper: is a cross-link external (target outside source's L1 category)?
  function isExternalLink(aId, bId) {
    const a = nodeById[aId], b = nodeById[bId];
    if (!a || !b) return false;
    return a.grandParentId !== b.grandParentId;
  }

  // ── GEOMETRY
  const graphEl = document.getElementById('graph');
  let GW, GH, CX, CY, L1R, NR1, NR2, NR3 = 6;   // NR3 = small anchor radius

  function computeGeo() {
    GW = graphEl.clientWidth; GH = graphEl.clientHeight;
    CX = GW / 2; CY = GH / 2;
    L1R = Math.min(GW, GH) * 0.31;
    NR1 = Math.max(42, Math.min(Math.min(GW, GH) * 0.05, 58));
    NR2 = Math.max(28, Math.min(Math.min(GW, GH) * 0.028, 38));
  }

  // L3 distance from its L2 hub (anchor position). Wider than before for breathing room.
  function l3dist() { return NR2 + NR3 + 60; }

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
        // wider fan so the anchors + callouts breathe
        const l3span = Math.min(m * 0.5, Math.PI * 0.95);
        const dd = l3dist();
        sub.children.forEach((el, k) => {
          const l3a = m > 1 ? l2angle - l3span / 2 + k * (l3span / (m - 1)) : l2angle;
          el.l3a = l3a;
          el.x = sub.x + dd * Math.cos(l3a);
          el.y = sub.y + dd * Math.sin(l3a);
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
  [['arrg','#bbb'],['arrhl','#333'],['arrr',RED]].forEach(([id, fill]) => {
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

  [{r:L1R+NR1+95,text:'OVERLAYS · LOCAL POLICY · COUNCIL-SPECIFIC'},
   {r:L1R+NR1+48,text:'RESCODE · NCC · BUILDING REGULATIONS'}].forEach(rl => {
    const id = 'rl'+rl.r;
    defs.append('path').attr('id',id)
      .attr('d',`M ${CX-rl.r},${CY} a ${rl.r},${rl.r} 0 0,1 ${rl.r*2},0`);
    ringG.append('text').attr('class','ring-label')
      .attr('font-size',8).attr('fill','#bbb').attr('letter-spacing','0.12em')
      .append('textPath').attr('href','#'+id).attr('startOffset','8%').text(rl.text);
  });

  // ── LAYERS (paint order: bottom → top)
  const xlinkLayer = zg.append('g').attr('class','xlink-layer');   // cross-link red paths + (+) + target rings
  const connG      = zg.append('g').attr('class','conns');         // L1 connections (connect mode)
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

  // ── L2 LINES (cat centre → sub centre) — painted under hubs
  const allL3Els = KB.flatMap(c => c.children.flatMap(s => s.children));
  const allSubs  = KB.flatMap(c => c.children);

  const l2LineG = zg.append('g').attr('class','l2lines');
  allSubs.forEach(sub => {
    l2LineG.append('line').attr('class','l2line')
      .attr('data-pid',sub.parentId)
      .attr('data-id',sub.id)
      .attr('stroke','#ccc').attr('stroke-width',1).attr('stroke-dasharray','3,3');
  });

  // ── L2 NODES
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

  // ── L3 CONNECTOR LINES (L2 edge → anchor) — painted above hubs
  const l3LineG = zg.append('g').attr('class','l3lines');
  allL3Els.forEach(el => {
    l3LineG.append('line').attr('class','l3line')
      .attr('data-pid',el.parentId)
      .attr('data-id',el.id)
      .attr('stroke','#bbb').attr('stroke-width',0.9).attr('stroke-dasharray','2,3');
  });

  // ── L3 HUD CALLOUTS — anchor + callout line + box + badge + label
  const CALL = { off:13, padX:7, padY:5, gap:6, lineH:11.5, badgeH:11, font:9.3, cw:5.35, wrapAt:16, hit:17 };

  function wrapLabel(label) {
    if (label.length <= CALL.wrapAt) return [label];
    const words = label.split(' ');
    if (words.length === 1) return [label];
    let best = [words[0], words.slice(1).join(' ')], bestDiff = 1e9;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0,i).join(' '), b = words.slice(i).join(' ');
      const diff = Math.abs(a.length - b.length);
      if (diff < bestDiff) { bestDiff = diff; best = [a, b]; }
    }
    return best;
  }
  function badgeText(flag) { return flag === 'BOTH' ? 'BOTH' : (flag || '—'); }

  const l3Layer  = zg.append('g').attr('class','l3layer');
  const l3Groups = l3Layer.selectAll('.l3g').data(allL3Els).join('g').attr('class','l3g')
    .attr('transform', d=>`translate(${d.x},${d.y})`)
    .on('mouseenter', function(){ d3.select(this).raise(); })
    .on('click',(e,d)=>{ e.stopPropagation(); selectL3OnCanvas(d); });

  l3Groups.each(function(d) {
    const g = d3.select(this);
    // 1. invisible generous hit area (reliable hover/click on the small dot)
    g.append('circle').attr('class','l3hit').attr('r',CALL.hit).attr('fill','transparent');
    // 2. small visible anchor dot
    g.append('circle').attr('class','l3anchor').attr('r',NR3)
      .attr('fill', d.flag==='WD' ? '#f0f0f0' : '#fff')
      .attr('stroke', d.flag==='WD' ? '#888' : '#1a1a1a').attr('stroke-width',1.3);
    // 3. callout line (anchor → box)
    g.append('line').attr('class','l3callout-line').attr('stroke','#888').attr('stroke-width',0.9);
    // 4. callout box
    g.append('rect').attr('class','l3callout-box').attr('rx',3)
      .attr('fill','#fff').attr('stroke','#1a1a1a').attr('stroke-width',1);
    // 5. badge chip
    const bt = badgeText(d.flag);
    const isWD = d.flag === 'WD';
    g.append('rect').attr('class','l3badge-box').attr('rx',2)
      .attr('fill', isWD ? '#fff' : '#1a1a1a')
      .attr('stroke', isWD ? '#999' : 'none').attr('stroke-width', isWD ? 1 : 0);
    g.append('text').attr('class','l3badge-label').attr('text-anchor','middle')
      .attr('font-size',7).attr('font-weight',700).attr('letter-spacing','.04em')
      .attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif')
      .attr('fill', isWD ? '#888' : '#fff').text(bt);
    // 6. label (1-2 lines)
    g.append('text').attr('class','l3callout-label')
      .attr('font-size',CALL.font).attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif')
      .attr('fill','#1a1a1a');
    // tooltip
    g.append('title').text(d.label);
  });

  // compute + apply callout geometry (called on init + resize)
  function renderL3Callouts() {
    l3Groups.each(function(d) {
      const g = d3.select(this);
      const sub = nodeById[d.parentId];
      const ang = Math.atan2(d.y - sub.y, d.x - sub.x);   // radial outward from L2
      const dirX = Math.cos(ang), dirY = Math.sin(ang);

      const lines = wrapLabel(d.label);
      const bt = badgeText(d.flag);
      const badgeW = bt.length * 5.4 + 9;
      const labelW = Math.max(...lines.map(l => l.length)) * CALL.cw;
      const W = CALL.padX + badgeW + CALL.gap + labelW + CALL.padX;
      const H = Math.max(lines.length * CALL.lineH, CALL.badgeH) + CALL.padY * 2;

      // near point of the box, sitting outboard of the anchor
      const nx = d.x + (NR3 + CALL.off) * dirX;
      const ny = d.y + (NR3 + CALL.off) * dirY;
      // box opens to whichever side the anchor points
      const boxX = dirX >= 0 ? nx : nx - W;
      const boxY = ny - H / 2;
      const cy = boxY + H / 2;

      g.select('.l3callout-line').attr('x1', d.x + NR3 * dirX).attr('y1', d.y + NR3 * dirY)
        .attr('x2', nx).attr('y2', ny);
      g.select('.l3callout-box').attr('x', boxX).attr('y', boxY).attr('width', W).attr('height', H);

      const badgeX = boxX + CALL.padX;
      g.select('.l3badge-box').attr('x', badgeX).attr('y', cy - CALL.badgeH/2)
        .attr('width', badgeW).attr('height', CALL.badgeH);
      g.select('.l3badge-label').attr('x', badgeX + badgeW/2).attr('y', cy + 2.5);

      const lblX = badgeX + badgeW + CALL.gap;
      const startY = cy - (lines.length - 1) * CALL.lineH / 2 + 3.2;
      const lbl = g.select('.l3callout-label').attr('x', lblX).attr('text-anchor','start');
      lbl.selectAll('tspan').remove();
      lines.forEach((ln, i) => lbl.append('tspan').attr('x', lblX).attr('y', startY + i * CALL.lineH).text(ln));
    });
  }
  renderL3Callouts();

  // line geometry (called on init + resize)
  function drawL2Lines() {
    l2LineG.selectAll('.l2line').each(function() {
      const sub = nodeById[d3.select(this).attr('data-id')]; if (!sub) return;
      const cat = nodeById[sub.parentId]; if (!cat) return;
      d3.select(this).attr('x1',cat.x).attr('y1',cat.y).attr('x2',sub.x).attr('y2',sub.y);
    });
  }
  function drawL3Lines() {
    l3LineG.selectAll('.l3line').each(function() {
      const el = nodeById[d3.select(this).attr('data-id')]; if (!el) return;
      const sub = nodeById[el.parentId]; if (!sub) return;
      const ang = Math.atan2(el.y - sub.y, el.x - sub.x);
      d3.select(this).attr('x1', sub.x + NR2*Math.cos(ang)).attr('y1', sub.y + NR2*Math.sin(ang))
        .attr('x2', el.x).attr('y2', el.y);
    });
  }
  drawL2Lines(); drawL3Lines();

  // ── ISOLATED CROSS-LINK LAYER (painted above L3 so the red jump reads clearly)
  const isoLayer = zg.append('g').attr('class','iso-layer');

  // ── CENTER TITLE
  const cg = zg.append('g').attr('class','center-g').on('click',e=>e.stopPropagation());
  cg.append('rect').attr('x',CX-78).attr('y',CY-42).attr('width',156).attr('height',84)
    .attr('fill','#fff').attr('stroke','#1a1a1a').attr('stroke-width',1.5).attr('rx',2);
  [{t:'KNOWLEDGE',y:-22,sz:12,w:700,ls:.1},{t:'BOOK',y:-4,sz:18,w:900,ls:.15},
   {t:'v0.07 · Victoria',y:18,sz:8.5,w:400,ls:.08,col:'#999'},{t:'Click a category',y:30,sz:8,w:400,ls:.05,col:'#bbb'}]
  .forEach(d=>cg.append('text').attr('x',CX).attr('y',CY+d.y).attr('text-anchor','middle')
    .attr('font-size',d.sz).attr('font-weight',d.w||400).attr('letter-spacing',d.ls||0)
    .attr('fill',d.col||'#1a1a1a').attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif').text(d.t));

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
  let selL1=null, selL2=null, selL3=null, curMode='browse', curFilter='all', curTopic=null, isoState=null;

  // ═══════════════════════════════════════════════════════════
  // GRAPH INTERACTIONS
  // ═══════════════════════════════════════════════════════════
  function selectL1(cat) {
    if (isoState) clearIso();
    if (curTopic) exitTopicFocus(false);
    if (selL1===cat) { clearSelection(); return; }
    selL1=cat; selL2=null; selL3=null;
    clearXLinks();
    showCenterUI();
    l1Groups.classed('faded',d=>d.id!==cat.id).classed('dim',false);
    l2Groups.classed('dim',false).each(function(d){ d3.select(this).classed('vis',d.parentId===cat.id); });
    l2LineG.selectAll('.l2line').classed('vis', false).classed('l2line-sel', false).classed('xred',false).each(function(){
      d3.select(this).classed('vis', d3.select(this).attr('data-pid')===cat.id);
    });
    l3Groups.classed('vis',false).classed('dim',false);
    l3LineG.selectAll('.l3line').classed('vis',false).classed('xred',false);
    backG.classed('vis',true);
    closePanel();
    applyFilter();
  }

  function selectL2(sub) {
    selL2=sub; selL3=null;
    clearXLinks();
    hideCenterUI();
    l2Groups.classed('sel',d=>d.id===sub.id);
    l3Groups.each(function(d){ d3.select(this).classed('vis',d.parentId===sub.id).classed('sel',false); });
    l3LineG.selectAll('.l3line').classed('xred',false).each(function(){
      d3.select(this).classed('vis', d3.select(this).attr('data-pid')===sub.id);
    });
    // black selection dash on this L2 → L1 line
    l2LineG.selectAll('.l2line').classed('l2line-sel', false).classed('xred',false).each(function(){
      d3.select(this).classed('l2line-sel', d3.select(this).attr('data-id')===sub.id);
    });
    openL2Panel(sub);
  }

  function selectL3OnCanvas(el) {
    selL3=el;
    hideCenterUI();
    l3Groups.classed('sel',d=>d.id===el.id);
    drawXLinks(el);
    openL3Panel(el.id);
  }

  function clearXLinks() {
    xlinkLayer.selectAll('*').remove();
    // reset any red chain / target highlighting
    l3LineG.selectAll('.l3line').classed('xred', false);
    l2LineG.selectAll('.l2line').classed('xred', false);
    l1Groups.classed('xtarget', false);
    l2Groups.classed('xtarget', false);
  }

  // ── CROSS-LINKS: red shows the *full active chain*, not just the jump
  function drawXLinks(el) {
    clearXLinks();
    const links = XLINKS.filter(x => x.s===el.id || x.t===el.id);
    if (!links.length) return;

    // 1. local chain → red: this L3's connector, and its L2→L1 line
    l3LineG.selectAll('.l3line').classed('xred', function(){ return d3.select(this).attr('data-id')===el.id; });
    l2LineG.selectAll('.l2line').classed('xred', function(){ return d3.select(this).attr('data-id')===el.parentId; });

    links.forEach(x => {
      const otherId = x.s===el.id ? x.t : x.s;
      const other   = nodeById[otherId]; if(!other) return;
      const external = isExternalLink(el.id, otherId);

      // endpoint: external → target L1 hub; internal → target's L2 hub (a visible sibling)
      const targetCat = nodeById[other.grandParentId];
      const targetSub = nodeById[other.parentId];
      const endNode = external ? targetCat : targetSub;
      const endR    = external ? NR1 : NR2;
      if (!endNode) return;

      const ang = Math.atan2(endNode.y-el.y, endNode.x-el.x);
      const sx  = el.x + NR3*Math.cos(ang), sy = el.y + NR3*Math.sin(ang);
      const ex  = endNode.x - endR*Math.cos(ang), ey = endNode.y - endR*Math.sin(ang);

      // quadratic curve, control point perpendicular to midpoint
      const mx = (sx+ex)/2, my = (sy+ey)/2;
      const dx = ex-sx, dy = ey-sy;
      const cpx = mx - dy*0.22, cpy = my + dx*0.22;

      const g = xlinkLayer.append('g').attr('class','xlink-arc');
      g.append('path')
        .attr('d',`M${sx},${sy} Q${cpx},${cpy} ${ex},${ey}`)
        .attr('fill','none').attr('stroke',RED).attr('stroke-width',1.6)
        .attr('stroke-dasharray','4,3').attr('marker-end','url(#arrr)')
        .style('pointer-events','none');

      // target highlighting (additive — multiple links can each highlight a target)
      if (external) {
        l1Groups.filter(d => d.id===endNode.id).classed('xtarget', true);
        xlinkLayer.append('circle')
          .attr('cx',endNode.x).attr('cy',endNode.y).attr('r',NR1+5)
          .attr('fill','none').attr('stroke',RED).attr('stroke-width',1.8)
          .attr('stroke-dasharray','4,3').attr('opacity',.85).style('pointer-events','none');
      } else {
        l2Groups.filter(d => d.id===endNode.id).classed('xtarget', true);
      }

      // midpoint of the curve
      const lx = 0.25*sx + 0.5*cpx + 0.25*ex;
      const ly = 0.25*sy + 0.5*cpy + 0.25*ey;

      if (external) {
        // (+) button → isolated connection view (no long text label on the line)
        const plus = xlinkLayer.append('g').attr('class','xplus')
          .on('click', e => { e.stopPropagation(); enterIsolatedView(el.id, otherId, x.label); });
        plus.append('title').text('Open connection view — ' + x.label);
        plus.append('circle').attr('cx',lx).attr('cy',ly).attr('r',9)
          .attr('fill','#fff').attr('stroke',RED).attr('stroke-width',1.5);
        plus.append('line').attr('x1',lx-4).attr('y1',ly).attr('x2',lx+4).attr('y2',ly)
          .attr('stroke',RED).attr('stroke-width',1.6);
        plus.append('line').attr('x1',lx).attr('y1',ly-4).attr('x2',lx).attr('y2',ly+4)
          .attr('stroke',RED).attr('stroke-width',1.6);
      } else {
        // internal: short red label (no isolated view)
        const txt = x.label, tw = txt.length*4.6;
        const lg = xlinkLayer.append('g').style('pointer-events','none');
        lg.append('rect').attr('x',lx-tw/2-3).attr('y',ly-7).attr('width',tw+6).attr('height',12)
          .attr('fill','#fff').attr('stroke','#fca5a5').attr('stroke-width',.5).attr('rx',2);
        lg.append('text').attr('x',lx).attr('y',ly+3).attr('text-anchor','middle')
          .attr('font-size',7.5).attr('fill',RED)
          .attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif').text(txt);
      }
    });
  }

  // ── ISOLATED CROSS-LINK VIEW (external links only)
  function enterIsolatedView(sourceId, targetId, label) {
    const src = nodeById[sourceId], tgt = nodeById[targetId];
    if (!src || !tgt) return;
    isoState = { sourceId, targetId, label };
    clearXLinks();
    isoLayer.selectAll('*').remove();

    const keepL1 = new Set([src.grandParentId, tgt.grandParentId]);
    const keepL2 = new Set([src.parentId, tgt.parentId]);
    const keepL3 = new Set([src.id, tgt.id]);

    hideCenterUI();
    backG.classed('vis', false);   // use in-panel buttons instead

    // L1: keep both branch hubs full; dim the rest (~0.18)
    l1Groups.classed('faded', false)
      .classed('dim', d => !keepL1.has(d.id))
      .classed('xtarget', false);

    // L2: show + full only the two parents; dim hidden ones
    l2Groups.each(function(d){
      const keep = keepL2.has(d.id);
      d3.select(this).classed('vis', keep).classed('sel', false)
        .classed('dim', false).classed('xtarget', false);
    });
    l2LineG.selectAll('.l2line').classed('l2line-sel',false).each(function(){
      const keep = keepL2.has(d3.select(this).attr('data-id'));
      d3.select(this).classed('vis', keep).classed('xred', keep);
    });

    // L3: show only source + target
    l3Groups.each(function(d){
      d3.select(this).classed('vis', keepL3.has(d.id))
        .classed('sel', false)
        .classed('topic', false)
        .classed('iso-src', d.id===src.id)
        .classed('iso-tgt', d.id===tgt.id);
    });
    l3LineG.selectAll('.l3line').each(function(){
      const keep = keepL3.has(d3.select(this).attr('data-id'));
      d3.select(this).classed('vis', keep).classed('xred', keep);
    });

    drawIsoConnection(src, tgt, label);
    openConnectionPanel(src, tgt, label);
    zoomToNodes([src, tgt, nodeById[src.parentId], nodeById[tgt.parentId],
                 nodeById[src.grandParentId], nodeById[tgt.grandParentId]]);
  }

  function drawIsoConnection(src, tgt, label) {
    isoLayer.selectAll('*').remove();
    const ang = Math.atan2(tgt.y-src.y, tgt.x-src.x);
    const sx = src.x + NR3*Math.cos(ang), sy = src.y + NR3*Math.sin(ang);
    const ex = tgt.x - NR3*Math.cos(ang), ey = tgt.y - NR3*Math.sin(ang);
    const mx = (sx+ex)/2, my = (sy+ey)/2;
    const dx = ex-sx, dy = ey-sy;
    const cpx = mx - dy*0.16, cpy = my + dx*0.16;

    isoLayer.append('path')
      .attr('d',`M${sx},${sy} Q${cpx},${cpy} ${ex},${ey}`)
      .attr('fill','none').attr('stroke',RED).attr('stroke-width',2)
      .attr('stroke-dasharray','5,3').attr('marker-end','url(#arrr)')
      .style('pointer-events','none');

    // small clean floating label at the curve midpoint
    const lx = 0.25*sx + 0.5*cpx + 0.25*ex;
    const ly = 0.25*sy + 0.5*cpy + 0.25*ey;
    const txt = label, tw = txt.length*5.0;
    const lg = isoLayer.append('g').style('pointer-events','none');
    lg.append('rect').attr('x',lx-tw/2-6).attr('y',ly-9).attr('width',tw+12).attr('height',17)
      .attr('fill','#fff').attr('stroke',RED).attr('stroke-width',1).attr('rx',3);
    lg.append('text').attr('x',lx).attr('y',ly+3).attr('text-anchor','middle')
      .attr('font-size',9).attr('font-weight',600).attr('fill',RED)
      .attr('font-family','Helvetica Neue,Helvetica,Arial,sans-serif').text(txt);
  }

  function clearIso() {
    isoState = null;
    isoLayer.selectAll('*').remove();
    l1Groups.classed('dim', false);
    l2Groups.classed('dim', false).classed('xtarget', false);
    l3Groups.classed('dim', false).classed('iso-src', false).classed('iso-tgt', false);
    l2LineG.selectAll('.l2line').classed('xred', false);
    l3LineG.selectAll('.l3line').classed('xred', false);
  }

  // Back to node view: restore the normal selected-L3 state for the source
  function exitConnToNode() {
    if (!isoState) return;
    const srcId = isoState.sourceId;
    clearIso();
    const el = nodeById[srcId];
    const cat = nodeById[el.grandParentId], sub = nodeById[el.parentId];
    selL1=null; selL2=null; selL3=null;
    if (cat) selectL1(cat);
    if (sub) selectL2(sub);
    selectL3OnCanvas(el);
    zoomToNodes([cat, ...cat.children]);
  }
  function exitConnToAll() {
    clearIso();
    clearSelection();
    fitView();
  }

  function navigateTo(id) {
    if (isoState) clearIso();
    const el=nodeById[id]; if(!el||!el.grandParentId) return;
    const cat=nodeById[el.grandParentId], sub=nodeById[el.parentId];
    if (cat) selectL1(cat);
    setTimeout(()=>{ if(sub) selectL2(sub); setTimeout(()=>{ openL3Panel(id); selectL3OnCanvas(el); },80); },60);
  }

  function clearSelection() {
    selL1=null; selL2=null; selL3=null;
    if (isoState) clearIso();
    clearXLinks();
    showCenterUI();
    l1Groups.classed('faded',false).classed('dim',false);
    l2Groups.classed('vis',false).classed('sel',false).classed('dim',false).classed('xtarget',false);
    l2LineG.selectAll('.l2line').classed('vis',false).classed('l2line-sel',false).classed('xred',false);
    l3Groups.classed('vis',false).classed('sel',false).classed('dim',false).classed('topic',false)
      .classed('iso-src',false).classed('iso-tgt',false);
    l3LineG.selectAll('.l3line').classed('vis',false).classed('xred',false);
    backG.classed('vis',false);
    closePanel();
  }

  svg.on('click', () => { if (isoState) return; clearSelection(); });

  // ── MODE TOGGLE
  document.querySelectorAll('.mbtn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      curMode=btn.dataset.m;
      document.querySelectorAll('.mbtn').forEach(b=>b.classList.remove('on'));
      btn.classList.add('on');
      const showConn=curMode==='connect';
      d3.selectAll('.connpath').classed('vis',showConn);
      if (!isoState) cg.classed('hidden',showConn);
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
      exitTopicFocus(false);
    } else {
      idxBtn.classList.add('on');
      clearSelection();
      openIndexPanel();
    }
  });

  function openIndexPanel() {
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
    if (isoState) clearIso();
    curTopic = topic;
    const ids = new Set(topic.nodes);

    clearXLinks();
    l1Groups.classed('faded', false).classed('dim',false);
    l2Groups.classed('vis', false).classed('sel', false).classed('dim',false).classed('xtarget',false);
    l2LineG.selectAll('.l2line').classed('vis', false).classed('l2line-sel', false).classed('xred',false);

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
      d3.select(this).classed('vis', match).classed('sel', false).classed('topic', match);
    });
    l3LineG.selectAll('.l3line').classed('xred',false).each(function(){
      d3.select(this).classed('vis', parentIds.has(d3.select(this).attr('data-pid')));
    });

    backG.classed('vis', true);
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

  function backToTopicList() {
    curTopic = null;
    clearXLinks();
    if (isoState) clearIso();
    l1Groups.classed('faded', false).classed('dim',false);
    l2Groups.classed('vis', false).classed('sel', false).classed('dim',false).classed('xtarget',false);
    l2LineG.selectAll('.l2line').classed('vis', false).classed('l2line-sel', false).classed('xred',false);
    l3Groups.classed('vis', false).classed('sel', false).classed('topic',false);
    l3LineG.selectAll('.l3line').classed('vis', false).classed('xred',false);
    backG.classed('vis', false);
    showCenterUI();
    document.querySelectorAll('.idx-item').forEach(i=>i.classList.remove('active'));
    closePanel();
  }

  function exitTopicFocus(keepLeft) {
    curTopic = null;
    clearXLinks();
    if (isoState) clearIso();
    l1Groups.classed('faded', false).classed('dim',false);
    l2Groups.classed('vis', false).classed('sel', false).classed('dim',false).classed('xtarget',false);
    l2LineG.selectAll('.l2line').classed('vis', false).classed('l2line-sel', false).classed('xred',false);
    l3Groups.classed('vis', false).classed('sel', false).classed('topic',false);
    l3LineG.selectAll('.l3line').classed('vis', false).classed('xred',false);
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

    // ── Cross-links: internal = grey item · external = red accent + open-connection
    const xls=XLINKS.filter(x=>x.s===id||x.t===id);
    const xlHtml = xls.length ? `<div class="dsec"><div class="dsec-t">Cross-links</div>${xls.map(x=>{
      const otherId = x.s===id ? x.t : x.s;
      const other   = nodeById[otherId];
      const otherCat= other ? nodeById[other.grandParentId] : null;
      const external= isExternalLink(id, otherId);
      const safeLbl = (x.label||'').replace(/'/g,"\\'");
      if (external) {
        return `<div class="dcl dcl-ext">
          <div class="dclbullet"></div>
          <div class="dcltxt"><strong>${other?other.label:''}</strong><span class="dcl-tag ext">ext</span>
            <div class="dcl-nav">${x.label} · ${otherCat?otherCat.label.replace('\n',' '):''} ↗</div>
            <span class="dcl-open" onclick="event.stopPropagation();window._app.openConnection('${id}','${otherId}','${safeLbl}')">＋ Open connection view</span>
          </div>
        </div>`;
      }
      return `<div class="dcl" onclick="window._app.navigateTo('${otherId}')">
        <div class="dclbullet"></div>
        <div class="dcltxt"><strong>${other?other.label:''}</strong><span class="dcl-tag int">in-category</span>
          <div class="dcl-nav">${x.label} · ${otherCat?otherCat.label.replace('\n',' '):''}</div>
        </div>
      </div>`;
    }).join('')}</div>` : '';

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

  // Right panel content for the isolated connection view
  function openConnectionPanel(src, tgt, label) {
    const srcCat = nodeById[src.grandParentId], srcSub = nodeById[src.parentId];
    const tgtCat = nodeById[tgt.grandParentId], tgtSub = nodeById[tgt.parentId];
    document.getElementById('ppath').textContent  = 'CONNECTION VIEW';
    document.getElementById('ptitle').textContent = label;
    document.getElementById('pbody').innerHTML = `
      <div class="iso-back">
        <button onclick="window._app.exitConnToNode()">← Back to node</button>
        <button class="primary" onclick="window._app.exitConnToAll()">Back to all</button>
      </div>
      <div class="dsec">
        <div class="dsec-t">Source</div>
        <div class="l3item" onclick="window._app.exitConnToNode()">
          <span class="lbadge ${src.flag==='TP'?'badge-tp':src.flag==='WD'?'badge-wd':'badge-both'}">${src.flag==='BOTH'?'TP+WD':src.flag||'—'}</span>
          <span class="l3lbl">${src.label}</span>
        </div>
        <div class="dcl-nav" style="margin-top:3px">${srcCat?srcCat.label.replace('\n',' '):''} › ${srcSub?srcSub.label:''}</div>
      </div>
      <div class="dsec">
        <div class="dsec-t" style="color:${RED}">Connects to ↗</div>
        <div class="l3item" onclick="window._app.navigateTo('${tgt.id}')">
          <span class="lbadge ${tgt.flag==='TP'?'badge-tp':tgt.flag==='WD'?'badge-wd':'badge-both'}">${tgt.flag==='BOTH'?'TP+WD':tgt.flag||'—'}</span>
          <span class="l3lbl">${tgt.label}</span>
        </div>
        <div class="dcl-nav" style="margin-top:3px">${tgtCat?tgtCat.label.replace('\n',' '):''} › ${tgtSub?tgtSub.label:''}</div>
      </div>
      <div class="dsec">
        <div class="dsec-t">Relationship</div>
        <div class="dsec-b">${label}</div>
      </div>
      <div class="dsec">
        <div class="dsec-t">Open the target node</div>
        <div class="dsec-b"><span class="dcl-open" style="color:var(--ink);border-color:var(--light)" onclick="window._app.navigateTo('${tgt.id}')">Go to ${tgt.label} →</span></div>
      </div>
    `;
    document.getElementById('panel').classList.add('open');
    document.getElementById('sugbtn').style.display='none';
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
    navigateTo, selectL3: selectL3OnCanvas, backToTopicList,
    openConnection: enterIsolatedView, exitConnToNode, exitConnToAll
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
    if (isoState) clearIso();
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

  // frame a set of nodes (used by isolated connection view)
  function zoomToNodes(nodes){
    const pts = nodes.filter(Boolean);
    if (!pts.length) { fitView(); return; }
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    pts.forEach(p=>{ minX=Math.min(minX,p.x); minY=Math.min(minY,p.y); maxX=Math.max(maxX,p.x); maxY=Math.max(maxY,p.y); });
    const pad=150;
    minX-=pad; minY-=pad; maxX+=pad; maxY+=pad;
    const w=maxX-minX, h=maxY-minY;
    const s=Math.max(0.3, Math.min(2.2, Math.min(GW/w, GH/h)));
    const cx=(minX+maxX)/2, cy=(minY+maxY)/2;
    svg.transition().duration(650).call(zoom.transform,
      d3.zoomIdentity.translate(GW/2,GH/2).scale(s).translate(-cx,-cy));
  }

  document.getElementById('zin').onclick  = ()=>svg.transition().duration(280).call(zoom.scaleBy,1.35);
  document.getElementById('zout').onclick = ()=>svg.transition().duration(280).call(zoom.scaleBy,0.74);
  document.getElementById('fitbtn').onclick = ()=>{ if(isoState) clearIso(); fitView(); };

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
    drawConns(); drawL2Lines(); drawL3Lines(); renderL3Callouts();
    clearXLinks();
    if (isoState) { const s=isoState; clearIso(); enterIsolatedView(s.sourceId,s.targetId,s.label); }
    else fitView();
  });

})();

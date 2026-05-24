// module-connections.js -- cross-links, isolated view, L1 CONN paths
//
// All arcs/lines go into lineLayer (behind node circles).
// Isolated view: hides unrelated L1 hubs completely (iso-hide class, opacity:0).

(function (APP) {

  const { lineLayer, defs, KB, L1CONN, XLINKS, nodeById, allL3Els, allSubs, isExternalLink, RED, geo } = APP;
  const { NR1, NR2, NR3, CX, CY } = geo;

  // -- L1 MODULE CONNECTION PATHS (lineLayer)
  const connG     = lineLayer.append('g').attr('class', 'conns');
  const connPaths = connG.selectAll('.connpath').data(L1CONN).join('g').attr('class', 'connpath');

  connPaths.append('path')
    .attr('fill', 'none')
    .attr('stroke', '#FFFFFF25')
    .attr('stroke-width', 1.2)
    .attr('stroke-dasharray', '5,4')
    .attr('marker-end', 'url(#arrg)');

  connPaths.append('rect')
    .attr('fill', '#000000')
    .attr('stroke', '#FFFFFF20')
    .attr('stroke-width', .5)
    .attr('rx', 2);

  connPaths.append('text')
    .attr('class', 'connlbl')
    .attr('text-anchor', 'middle')
    .attr('font-size', 7.5)
    .attr('font-weight', 600)
    .attr('letter-spacing', '.06em')
    .attr('fill', '#FFFFFF50')
    .attr('font-family', 'Roboto, sans-serif');

  function drawConns() {
    connPaths.each(function (d) {
      const a = nodeById[d.a], b = nodeById[d.b];
      if (!a || !b) return;
      const g   = d3.select(this);
      const mx  = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const cpx = CX + (mx - CX) * 0.38, cpy = CY + (my - CY) * 0.38;
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      const sx  = a.x + NR1 * Math.cos(ang), sy = a.y + NR1 * Math.sin(ang);
      const ex  = b.x - NR1 * Math.cos(ang), ey = b.y - NR1 * Math.sin(ang);
      g.select('path').attr('d', `M${sx},${sy} Q${cpx},${cpy} ${ex},${ey}`);
      const lx  = 0.25 * sx + 0.5 * cpx + 0.25 * ex;
      const ly  = 0.25 * sy + 0.5 * cpy + 0.25 * ey;
      const txt = d.label.toUpperCase(), tw = txt.length * 5.2;
      g.select('rect').attr('x', lx - tw / 2 - 4).attr('y', ly - 8).attr('width', tw + 8).attr('height', 13).attr('rx', 2);
      g.select('text').attr('x', lx).attr('y', ly + 4).text(txt);
    });
  }
  drawConns();

  // -- CROSS-LINK + ISO ARC LAYERS (both in lineLayer -- behind node circles)
  const xlinkLayer = lineLayer.append('g').attr('class', 'xlink-layer');
  const isoLayer   = lineLayer.append('g').attr('class', 'iso-layer');

  function clearXLinks() {
    xlinkLayer.selectAll('*').remove();
    APP.l3.l3LineG.selectAll('.l3line').classed('xred', false);
    APP.l2.l2LineG.selectAll('.l2line').classed('xred', false);
    APP.l1.l1Groups.classed('xtarget', false);
    APP.l2.l2Groups.classed('xtarget', false);
  }

  function drawXLinks(el) {
    clearXLinks();
    const links = XLINKS.filter(x => x.s === el.id || x.t === el.id);
    if (!links.length) return;

    APP.l3.l3LineG.selectAll('.l3line').classed('xred', function () {
      return d3.select(this).attr('data-id') === el.id;
    });
    APP.l2.l2LineG.selectAll('.l2line').classed('xred', function () {
      return d3.select(this).attr('data-id') === el.parentId;
    });

    links.forEach(x => {
      const otherId  = x.s === el.id ? x.t : x.s;
      const other    = nodeById[otherId]; if (!other) return;
      const external = isExternalLink(el.id, otherId);

      const targetCat = nodeById[other.grandParentId];
      const targetSub = nodeById[other.parentId];
      const endNode   = external ? targetCat : targetSub;
      const endR      = external ? NR1 : NR2;
      if (!endNode) return;

      const ang = Math.atan2(endNode.y - el.y, endNode.x - el.x);
      const sx  = el.x + NR3 * Math.cos(ang), sy = el.y + NR3 * Math.sin(ang);
      const ex  = endNode.x - endR * Math.cos(ang), ey = endNode.y - endR * Math.sin(ang);
      const mx  = (sx + ex) / 2, my = (sy + ey) / 2;
      const dx  = ex - sx, dy = ey - sy;
      const cpx = mx - dy * 0.22, cpy = my + dx * 0.22;

      const g = xlinkLayer.append('g').attr('class', 'xlink-arc');
      g.append('path')
        .attr('d', `M${sx},${sy} Q${cpx},${cpy} ${ex},${ey}`)
        .attr('fill', 'none').attr('stroke', RED).attr('stroke-width', 1.6)
        .attr('stroke-dasharray', '4,3').attr('marker-end', 'url(#arrr)')
        .style('pointer-events', 'none');

      if (external) {
        APP.l1.l1Groups.filter(d => d.id === endNode.id).classed('xtarget', true);
        xlinkLayer.append('circle')
          .attr('cx', endNode.x).attr('cy', endNode.y).attr('r', NR1 + 5)
          .attr('fill', 'none').attr('stroke', RED).attr('stroke-width', 1.8)
          .attr('stroke-dasharray', '4,3').attr('opacity', .85)
          .style('pointer-events', 'none');
      } else {
        APP.l2.l2Groups.filter(d => d.id === endNode.id).classed('xtarget', true);
      }

      const lx = 0.25 * sx + 0.5 * cpx + 0.25 * ex;
      const ly = 0.25 * sy + 0.5 * cpy + 0.25 * ey;

      if (external) {
        const plus = xlinkLayer.append('g').attr('class', 'xplus')
          .on('click', e => { e.stopPropagation(); enterIsolatedView(el.id, otherId, x.label); });
        plus.append('title').text('Open connection view -- ' + x.label);
        plus.append('circle').attr('cx', lx).attr('cy', ly).attr('r', 9)
          .attr('fill', '#000000').attr('stroke', RED).attr('stroke-width', 1.5);
        plus.append('line').attr('x1', lx - 4).attr('y1', ly).attr('x2', lx + 4).attr('y2', ly)
          .attr('stroke', RED).attr('stroke-width', 1.6);
        plus.append('line').attr('x1', lx).attr('y1', ly - 4).attr('x2', lx).attr('y2', ly + 4)
          .attr('stroke', RED).attr('stroke-width', 1.6);
      } else {
        const txt = x.label, tw = txt.length * 4.6;
        const lg  = xlinkLayer.append('g').style('pointer-events', 'none');
        lg.append('rect').attr('x', lx - tw / 2 - 3).attr('y', ly - 7).attr('width', tw + 6).attr('height', 12)
          .attr('fill', '#000000').attr('stroke', RED).attr('stroke-width', .5).attr('rx', 2);
        lg.append('text').attr('x', lx).attr('y', ly + 3).attr('text-anchor', 'middle')
          .attr('font-size', 7.5).attr('fill', RED)
          .attr('font-family', 'Roboto, sans-serif').text(txt);
      }
    });
  }

  // -- ISOLATED VIEW
  function enterIsolatedView(sourceId, targetId, label) {
    const src = nodeById[sourceId], tgt = nodeById[targetId];
    if (!src || !tgt) return;
    APP.state.isoState = { sourceId, targetId, label };
    clearXLinks();
    isoLayer.selectAll('*').remove();

    const keepL1 = new Set([src.grandParentId, tgt.grandParentId]);
    const keepL2 = new Set([src.parentId, tgt.parentId]);
    const keepL3 = new Set([src.id, tgt.id]);

    APP.decor.hideCenterUI();
    APP.decor.setBackVisible(false);

    // Hide unrelated L1 hubs completely (iso-hide = opacity:0, no pointer events)
    APP.l1.l1Groups.classed('faded', false).classed('dim', false).classed('xtarget', false)
      .classed('iso-hide', d => !keepL1.has(d.id));

    APP.l2.l2Groups.each(function (d) {
      const keep = keepL2.has(d.id);
      d3.select(this).classed('vis', keep).classed('sel', false).classed('dim', false).classed('xtarget', false);
    });
    APP.l2.l2LineG.selectAll('.l2line').classed('l2line-sel', false).each(function () {
      const keep = keepL2.has(d3.select(this).attr('data-id'));
      d3.select(this).classed('vis', keep).classed('xred', keep);
    });
    APP.l3.l3Groups.each(function (d) {
      d3.select(this).classed('vis', keepL3.has(d.id)).classed('sel', false)
        .classed('topic', false)
        .classed('iso-src', d.id === src.id)
        .classed('iso-tgt', d.id === tgt.id);
    });
    APP.l3.l3LineG.selectAll('.l3line').each(function () {
      const keep = keepL3.has(d3.select(this).attr('data-id'));
      d3.select(this).classed('vis', keep).classed('xred', keep);
    });

    drawIsoConnection(src, tgt, label);
    APP.panel.openConnectionPanel(src, tgt, label);
    APP.viewport.zoomToNodes([src, tgt, nodeById[src.parentId], nodeById[tgt.parentId],
      nodeById[src.grandParentId], nodeById[tgt.grandParentId]]);
  }

  function drawIsoConnection(src, tgt, label) {
    isoLayer.selectAll('*').remove();
    const ang = Math.atan2(tgt.y - src.y, tgt.x - src.x);
    const sx  = src.x + NR3 * Math.cos(ang), sy = src.y + NR3 * Math.sin(ang);
    const ex  = tgt.x - NR3 * Math.cos(ang), ey = tgt.y - NR3 * Math.sin(ang);
    const mx  = (sx + ex) / 2, my = (sy + ey) / 2;
    const dx  = ex - sx, dy = ey - sy;
    const cpx = mx - dy * 0.16, cpy = my + dx * 0.16;

    isoLayer.append('path')
      .attr('d', `M${sx},${sy} Q${cpx},${cpy} ${ex},${ey}`)
      .attr('fill', 'none').attr('stroke', RED).attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,3').attr('marker-end', 'url(#arrr)')
      .style('pointer-events', 'none');

    const lx  = 0.25 * sx + 0.5 * cpx + 0.25 * ex;
    const ly  = 0.25 * sy + 0.5 * cpy + 0.25 * ey;
    const txt = label, tw = txt.length * 5.0;
    const lg  = isoLayer.append('g').style('pointer-events', 'none');
    lg.append('rect').attr('x', lx - tw / 2 - 6).attr('y', ly - 9).attr('width', tw + 12).attr('height', 17)
      .attr('fill', '#000000').attr('stroke', RED).attr('stroke-width', 1).attr('rx', 2);
    lg.append('text').attr('x', lx).attr('y', ly + 3).attr('text-anchor', 'middle')
      .attr('font-size', 9).attr('font-weight', 600).attr('fill', RED)
      .attr('font-family', 'Roboto, sans-serif').text(txt);
  }

  function clearIso() {
    APP.state.isoState = null;
    isoLayer.selectAll('*').remove();
    APP.l1.l1Groups.classed('dim', false).classed('iso-hide', false);
    APP.l2.l2Groups.classed('dim', false).classed('xtarget', false);
    APP.l3.l3Groups.classed('dim', false).classed('iso-src', false).classed('iso-tgt', false);
    APP.l2.l2LineG.selectAll('.l2line').classed('xred', false);
    APP.l3.l3LineG.selectAll('.l3line').classed('xred', false);
  }

  function exitConnToNode() {
    if (!APP.state.isoState) return;
    const srcId = APP.state.isoState.sourceId;
    clearIso();
    const el  = nodeById[srcId];
    const cat = nodeById[el.grandParentId], sub = nodeById[el.parentId];
    APP.state.selL1 = null; APP.state.selL2 = null; APP.state.selL3 = null;
    if (cat) APP.state_mod.selectL1(cat);
    if (sub) APP.state_mod.selectL2(sub);
    APP.state_mod.selectL3OnCanvas(el);
    APP.viewport.zoomToNodes([cat, ...cat.children]);
  }

  function exitConnToAll() {
    clearIso();
    APP.state_mod.clearSelection();
    APP.viewport.fitView();
  }

  APP.connections = {
    connG, connPaths, drawConns,
    xlinkLayer, isoLayer,
    drawXLinks, clearXLinks,
    enterIsolatedView, drawIsoConnection,
    clearIso, exitConnToNode, exitConnToAll,
  };

})(window.APP);

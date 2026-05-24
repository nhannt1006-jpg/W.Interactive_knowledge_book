// module-decor.js -- decorative rings, centre title, back btn
// All elements go into bgLayer (below lines and node circles).
// This replicates original paint order: decor behind everything.

(function (APP) {

  const { bgLayer, geo, defs } = APP;
  const { CX, CY, L1R, NR1 } = geo;

  // -- DECORATIVE RINGS
  const ringG = bgLayer.append('g').attr('class', 'rings');

  const ringOrbit = ringG.append('circle')
    .attr('cx', CX).attr('cy', CY).attr('r', L1R)
    .attr('fill', 'none')
    .attr('stroke', '#FFFFFF30')
    .attr('stroke-dasharray', '4,7')
    .attr('stroke-width', 1);

  const outerRings = [];
  [L1R + NR1 + 48, L1R + NR1 + 95].forEach(r => {
    outerRings.push(
      ringG.append('circle')
        .attr('cx', CX).attr('cy', CY).attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', '#FFFFFF20')
        .attr('stroke-dasharray', '4,7')
        .attr('stroke-width', 1)
    );
  });

  const ringLabels = [];
  [
    { r: L1R + NR1 + 95, text: 'OVERLAYS · LOCAL POLICY · COUNCIL-SPECIFIC' },
    { r: L1R + NR1 + 48, text: 'RESCODE · NCC · BUILDING REGULATIONS' },
  ].forEach(rl => {
    const id = 'rl' + rl.r;
    defs.append('path').attr('id', id)
      .attr('d', `M ${CX - rl.r},${CY} a ${rl.r},${rl.r} 0 0,1 ${rl.r * 2},0`);
    ringLabels.push(
      ringG.append('text')
        .attr('class', 'ring-label')
        .attr('font-size', 8)
        .attr('fill', '#FFFFFF40')
        .attr('letter-spacing', '0.12em')
        .attr('font-family', 'Roboto, sans-serif')
        .attr('font-weight', 200)
        .append('textPath')
        .attr('href', '#' + id)
        .attr('startOffset', '8%')
        .text(rl.text)
    );
  });

  // -- CENTRE TITLE (bgLayer -- below nodes; centre is empty of nodes so no conflict)
  const cg = bgLayer.append('g').attr('class', 'center-g')
    .on('click', e => e.stopPropagation());

  cg.append('rect')
    .attr('x', CX - 72).attr('y', CY - 38)
    .attr('width', 144).attr('height', 76)
    .attr('fill', '#000000')
    .attr('stroke', '#FFFFFF30')
    .attr('stroke-width', 1)
    .attr('rx', 2);

  [
    { t: 'KNOWLEDGE', y: -20, sz: 11, w: 600, ls: .12 },
    { t: 'BOOK',      y: -4,  sz: 18, w: 600, ls: .18 },
    { t: 'v0.08 · Victoria', y: 17, sz: 8, w: 200, ls: .07, col: '#FFFFFF60' },
    { t: 'Click a category', y: 29, sz: 8, w: 200, ls: .04, col: '#FFFFFF40' },
  ].forEach(d => {
    cg.append('text')
      .attr('x', CX).attr('y', CY + d.y)
      .attr('text-anchor', 'middle')
      .attr('font-size', d.sz)
      .attr('font-weight', d.w)
      .attr('letter-spacing', d.ls || 0)
      .attr('fill', d.col || '#FFFFFF')
      .attr('font-family', 'Roboto, sans-serif')
      .text(d.t);
  });

  // -- BACK BUTTON (bgLayer)
  const backG = bgLayer.append('g').attr('class', 'backbtn')
    .on('click', () => {
      if (APP.state.curTopic) APP.index.exitTopicFocus(true);
      else APP.state_mod.clearSelection();
    });

  backG.append('rect')
    .attr('x', CX - 52).attr('y', CY + L1R + NR1 + 16)
    .attr('width', 104).attr('height', 22)
    .attr('fill', '#000000')
    .attr('stroke', '#FFFFFF50')
    .attr('stroke-width', 1)
    .attr('rx', 2);

  backG.append('text')
    .attr('x', CX).attr('y', CY + L1R + NR1 + 31)
    .attr('text-anchor', 'middle')
    .attr('font-size', 9)
    .attr('font-weight', 600)
    .attr('letter-spacing', '.1em')
    .attr('fill', '#FFFFFFCF')
    .attr('font-family', 'Roboto, sans-serif')
    .text('<- BACK TO ALL');

  // -- PUBLIC API
  function hideCenterUI() {
    cg.classed('hidden', true);
    ringLabels.forEach(l => l.attr('opacity', 0));
  }

  function showCenterUI() {
    cg.classed('hidden', false);
    ringLabels.forEach(l => l.attr('opacity', 1));
  }

  function setBackVisible(v) {
    backG.classed('vis', v);
  }

  function setRingView(n) {
    ringOrbit.attr('opacity', n >= 1 ? 1 : 0);
    outerRings.forEach(r => r.attr('opacity', n >= 3 ? 1 : 0));
    ringLabels.forEach(l => l.attr('opacity', n >= 3 ? 1 : 0));
  }

  APP.decor = { hideCenterUI, showCenterUI, setBackVisible, setRingView, cg, backG };

})(window.APP);

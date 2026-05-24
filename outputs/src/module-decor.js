// module-decor.js -- decorative rings, centre title, back btn
// All elements go into bgLayer (below lines and node circles).
// This replicates original paint order: decor behind everything.
//
// Geometry is applied in position(), which re-reads the live `geo` object so a
// window resize can reposition decor (exposed as APP.decor.redraw).

(function (APP) {

  const { bgLayer, geo, defs } = APP;

  // -- DECORATIVE RINGS (positions set in position())
  const ringG = bgLayer.append('g').attr('class', 'rings');

  const ringOrbit = ringG.append('circle')
    .attr('fill', 'none').attr('stroke', '#FFFFFF30')
    .attr('stroke-dasharray', '4,7').attr('stroke-width', 1);

  const outerRings = [0, 1].map(() =>
    ringG.append('circle')
      .attr('fill', 'none').attr('stroke', '#FFFFFF20')
      .attr('stroke-dasharray', '4,7').attr('stroke-width', 1)
  );

  // stable defs-path ids so position() can update the arc geometry on resize
  const ringDefs = [
    { id: 'rl-outer', off: 95, text: 'OVERLAYS · LOCAL POLICY · COUNCIL-SPECIFIC' },
    { id: 'rl-mid',   off: 48, text: 'RESCODE · NCC · BUILDING REGULATIONS' },
  ];
  const ringLabels = ringDefs.map(rl => {
    const def = defs.append('path').attr('id', rl.id);
    const text = ringG.append('text')
      .attr('class', 'ring-label')
      .attr('font-size', 8).attr('fill', '#FFFFFF40')
      .attr('letter-spacing', '0.12em')
      .attr('font-family', 'Roboto, sans-serif').attr('font-weight', 200);
    text.append('textPath').attr('href', '#' + rl.id).attr('startOffset', '8%').text(rl.text);
    return { def, text, off: rl.off };
  });

  // -- CENTRE TITLE (positioned via transform in position())
  const cg = bgLayer.append('g').attr('class', 'center-g')
    .on('click', e => e.stopPropagation());

  cg.append('rect')
    .attr('x', -72).attr('y', -38).attr('width', 144).attr('height', 76)
    .attr('fill', '#000000').attr('stroke', '#FFFFFF30').attr('stroke-width', 1).attr('rx', 2);

  [
    { t: 'KNOWLEDGE', y: -20, sz: 11, w: 600, ls: .12 },
    { t: 'BOOK',      y: -4,  sz: 18, w: 600, ls: .18 },
    { t: 'v0.08 · Victoria', y: 17, sz: 8, w: 200, ls: .07, col: '#FFFFFF60' },
    { t: 'Click a category', y: 29, sz: 8, w: 200, ls: .04, col: '#FFFFFF40' },
  ].forEach(d => {
    cg.append('text')
      .attr('x', 0).attr('y', d.y).attr('text-anchor', 'middle')
      .attr('font-size', d.sz).attr('font-weight', d.w).attr('letter-spacing', d.ls || 0)
      .attr('fill', d.col || '#FFFFFF').attr('font-family', 'Roboto, sans-serif')
      .text(d.t);
  });

  // -- BACK BUTTON (positioned via transform in position())
  const backG = bgLayer.append('g').attr('class', 'backbtn')
    .on('click', () => {
      if (APP.state.curTopic) APP.index.exitTopicFocus(true);
      else APP.state_mod.clearSelection();
    });

  const backRect = backG.append('rect')
    .attr('x', -52).attr('width', 104).attr('height', 22)
    .attr('fill', '#000000').attr('stroke', '#FFFFFF50').attr('stroke-width', 1).attr('rx', 2);

  const backText = backG.append('text')
    .attr('x', 0).attr('text-anchor', 'middle')
    .attr('font-size', 9).attr('font-weight', 600).attr('letter-spacing', '.1em')
    .attr('fill', '#FFFFFFCF').attr('font-family', 'Roboto, sans-serif')
    .text('<- BACK TO ALL');

  // -- POSITION (re-reads live geo; called on load + resize)
  function position() {
    const { CX, CY, L1R, NR1 } = geo;
    ringOrbit.attr('cx', CX).attr('cy', CY).attr('r', L1R);
    [L1R + NR1 + 48, L1R + NR1 + 95].forEach((r, i) =>
      outerRings[i].attr('cx', CX).attr('cy', CY).attr('r', r));
    ringLabels.forEach(rl => {
      const r = L1R + NR1 + rl.off;
      rl.def.attr('d', `M ${CX - r},${CY} a ${r},${r} 0 0,1 ${r * 2},0`);
    });
    cg.attr('transform', `translate(${CX},${CY})`);
    backG.attr('transform', `translate(${CX},${CY})`);
    backRect.attr('y', L1R + NR1 + 16);
    backText.attr('y', L1R + NR1 + 31);
  }
  position();

  // -- PUBLIC API
  function hideCenterUI() {
    cg.classed('hidden', true);
    ringLabels.forEach(l => l.text.attr('opacity', 0));
  }
  function showCenterUI() {
    cg.classed('hidden', false);
    ringLabels.forEach(l => l.text.attr('opacity', 1));
  }
  function setBackVisible(v) { backG.classed('vis', v); }
  function setRingView(n) {
    ringOrbit.attr('opacity', n >= 1 ? 1 : 0);
    outerRings.forEach(r => r.attr('opacity', n >= 3 ? 1 : 0));
    ringLabels.forEach(l => l.text.attr('opacity', n >= 3 ? 1 : 0));
  }

  APP.decor = { hideCenterUI, showCenterUI, setBackVisible, setRingView, redraw: position, cg, backG };

})(window.APP);

// module-l3.js -- L3 anchor dots + persistent labels + connector lines to L2
// Lines in lineLayer (behind nodes), dots in nodeLayer.
// Labels are SVG text elements on each l3g, visible when .vis is set.

(function (APP) {

  const { lineLayer, nodeLayer, allL3Els, nodeById, geo } = APP;
  const { NR2, NR3 } = geo;

  // -- L3 CONNECTOR LINES (lineLayer -- behind all circles)
  const l3LineG = lineLayer.append('g').attr('class', 'l3lines');
  allL3Els.forEach(el => {
    l3LineG.append('line')
      .attr('class', 'l3line')
      .attr('data-pid', el.parentId)
      .attr('data-id', el.id)
      .attr('stroke', '#FFFFFF30')
      .attr('stroke-width', 0.8)
      .attr('stroke-dasharray', '2,3');
  });

  function drawL3Lines() {
    l3LineG.selectAll('.l3line').each(function () {
      const el  = nodeById[d3.select(this).attr('data-id')]; if (!el) return;
      const sub = nodeById[el.parentId]; if (!sub) return;
      const ang = Math.atan2(el.y - sub.y, el.x - sub.x);
      d3.select(this)
        .attr('x1', sub.x + NR2 * Math.cos(ang))
        .attr('y1', sub.y + NR2 * Math.sin(ang))
        .attr('x2', el.x).attr('y2', el.y);
    });
    drawL3Labels();
  }

  // -- L3 ANCHOR DOTS + LABELS (nodeLayer -- above all lines)
  const l3Layer  = nodeLayer.append('g').attr('class', 'l3layer');
  const l3Groups = l3Layer.selectAll('.l3g').data(allL3Els).join('g')
    .attr('class', 'l3g')
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .on('mouseenter', function (e, d) {
      d3.select(this).raise();
      APP.callout.showCallout(d);
    })
    .on('mouseleave', function () {
      if (!APP.state.selL3 || APP.state.selL3.id !== d3.select(this).datum().id) {
        APP.callout.hideCallout();
      }
    })
    .on('click', (e, d) => { e.stopPropagation(); APP.state_mod.selectL3OnCanvas(d); });

  l3Groups.each(function (d) {
    const g = d3.select(this);

    // generous invisible hit area
    g.append('circle').attr('class', 'l3hit').attr('r', 16).attr('fill', 'transparent');

    // visible anchor dot
    g.append('circle').attr('class', 'l3anchor').attr('r', NR3)
      .attr('fill', d.flag === 'WD' ? '#000000' : '#FFFFFF')
      .attr('stroke', d.flag === 'WD' ? '#FFFFFF80' : '#FFFFFF')
      .attr('stroke-width', 1.3);

    // persistent label -- positioned radially outward from L2 hub using l3a angle
    const la   = d.l3a || 0;
    const dist = NR3 + 14;
    const lx   = Math.cos(la) * dist;
    const ly   = Math.sin(la) * dist;
    const ca   = Math.cos(la);
    const anch = ca > 0.25 ? 'start' : ca < -0.25 ? 'end' : 'middle';
    const lbl  = d.label.length > 22 ? d.label.slice(0, 21) + '…' : d.label;

    g.append('text').attr('class', 'l3-lbl')
      .attr('x', lx).attr('y', ly)
      .attr('text-anchor', anch)
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 7.5)
      .attr('font-family', 'Roboto Condensed, sans-serif')
      .attr('font-weight', 200)
      .attr('fill', '#FFFFFFCF')
      .attr('pointer-events', 'none')
      .text(lbl);

    // tooltip fallback
    g.append('title').text(d.label);
  });

  // Update label anchor/position after resize (l3a may change)
  function drawL3Labels() {
    l3Groups.each(function (d) {
      const la   = d.l3a || 0;
      const dist = NR3 + 14;
      const lx   = Math.cos(la) * dist;
      const ly   = Math.sin(la) * dist;
      const ca   = Math.cos(la);
      const anch = ca > 0.25 ? 'start' : ca < -0.25 ? 'end' : 'middle';
      d3.select(this).select('.l3-lbl')
        .attr('x', lx).attr('y', ly).attr('text-anchor', anch);
    });
  }

  // l3Groups + .l3-lbl text nodes now exist -- safe to position lines & labels
  drawL3Lines();

  APP.l3 = { l3Groups, l3LineG, drawL3Lines };

})(window.APP);

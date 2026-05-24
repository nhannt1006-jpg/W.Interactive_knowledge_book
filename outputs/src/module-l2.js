// module-l2.js -- L2 sub-hub nodes + connector lines to L1
// five7: black fill, white stroke, white text
// Lines in lineLayer (behind nodes), circles in nodeLayer.

(function (APP) {

  const { lineLayer, nodeLayer, allSubs, nodeById, geo } = APP;
  const { NR2 } = geo;

  // -- L2 CONNECTOR LINES (lineLayer -- behind all circles)
  const l2LineG = lineLayer.append('g').attr('class', 'l2lines');
  allSubs.forEach(sub => {
    l2LineG.append('line')
      .attr('class', 'l2line')
      .attr('data-pid', sub.parentId)
      .attr('data-id', sub.id)
      .attr('stroke', '#FFFFFF30')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,4');
  });

  function drawL2Lines() {
    l2LineG.selectAll('.l2line').each(function () {
      const sub = nodeById[d3.select(this).attr('data-id')]; if (!sub) return;
      const cat = nodeById[sub.parentId]; if (!cat) return;
      d3.select(this)
        .attr('x1', cat.x).attr('y1', cat.y)
        .attr('x2', sub.x).attr('y2', sub.y);
    });
  }
  drawL2Lines();

  // -- L2 NODES (nodeLayer -- above all lines)
  const l2G      = nodeLayer.append('g').attr('class', 'l2layer');
  const l2Groups = l2G.selectAll('.l2g').data(allSubs).join('g')
    .attr('class', 'l2g')
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .on('click', (e, d) => { e.stopPropagation(); APP.state_mod.selectL2(d); });

  // circle -- black fill, white stroke
  l2Groups.append('circle')
    .attr('class', 'l2circ')
    .attr('r', NR2)
    .attr('fill', '#000000')
    .attr('stroke', '#FFFFFF')
    .attr('stroke-width', 1.5);

  // label -- white
  l2Groups.append('text')
    .attr('class', 'l2lbl')
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Roboto, sans-serif')
    .each(function (d) {
      const g  = d3.select(this);
      const fs = d.label.length > 14 ? 7 : 8;
      g.attr('font-size', fs).attr('font-weight', 600)
       .attr('fill', '#FFFFFF').attr('letter-spacing', '.03em');
      const words = d.label.split(' ');
      const lines = words.length === 1 ? [words[0]] : words.length === 2 ? words :
        [words.slice(0, Math.ceil(words.length / 2)).join(' '),
         words.slice(Math.ceil(words.length / 2)).join(' ')];
      const lh = fs * 1.25, startY = lines.length === 1 ? 0 : -(lh / 2);
      lines.forEach((line, i) =>
        g.append('tspan').attr('x', 0)
          .attr('dy', i === 0 ? `${startY}px` : `${lh}px`).text(line)
      );
    });

  // child count badge -- muted
  l2Groups.each(function (d) {
    d3.select(this).append('text')
      .attr('class', 'l2count')
      .attr('x', NR2 + 2).attr('y', -NR2 + 2)
      .attr('font-size', 7)
      .attr('fill', '#FFFFFF50')
      .attr('font-family', 'Roboto, sans-serif')
      .attr('font-weight', 200)
      .text(d.children.length);
  });

  APP.l2 = { l2Groups, l2LineG, drawL2Lines };

})(window.APP);

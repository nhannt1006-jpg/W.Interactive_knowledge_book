// module-l1.js -- L1 hub nodes
// five7: white fill circle, black text/icon
// Appends to nodeLayer so it renders above all line layers.

(function (APP) {

  const { nodeLayer, KB, geo } = APP;
  const { NR1 } = geo;

  const l1G      = nodeLayer.append('g').attr('class', 'l1layer');
  const l1Groups = l1G.selectAll('.l1g').data(KB).join('g')
    .attr('class', 'l1g')
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .on('click', (e, d) => { e.stopPropagation(); APP.state_mod.selectL1(d); });

  // outer glow ring (very subtle)
  l1Groups.append('circle')
    .attr('r', NR1 + 8)
    .attr('fill', 'none')
    .attr('stroke', '#FFFFFF20')
    .attr('stroke-width', 0.5)
    .attr('opacity', 0.4);

  // main hub circle -- white fill
  l1Groups.append('circle')
    .attr('class', 'l1circ')
    .attr('r', NR1)
    .attr('fill', '#FFFFFF')
    .attr('stroke', 'none');

  // icon -- black on white
  l1Groups.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', -8)
    .attr('font-size', NR1 * 0.42)
    .attr('fill', '#000000')
    .attr('dominant-baseline', 'middle')
    .attr('font-family', 'Roboto, sans-serif')
    .text(d => d.icon);

  // label lines -- black on white
  l1Groups.each(function (d) {
    const g = d3.select(this);
    d.label.split('\n').forEach((line, i) =>
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', NR1 * 0.22 + (i * 10))
        .attr('font-size', 8)
        .attr('font-weight', 700)
        .attr('letter-spacing', '.1em')
        .attr('fill', '#000000')
        .attr('font-family', 'Roboto, sans-serif')
        .text(line)
    );
  });

  // element count -- muted, below hub
  l1Groups.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', NR1 + 14)
    .attr('font-size', 7.5)
    .attr('fill', '#FFFFFF60')
    .attr('letter-spacing', '.06em')
    .attr('font-family', 'Roboto, sans-serif')
    .attr('font-weight', 200)
    .text(d => `${d.children.reduce((a, s) => a + s.children.length, 0)} elements`);

  APP.l1 = { l1Groups };

})(window.APP);

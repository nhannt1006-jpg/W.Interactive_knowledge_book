// ═══════════════════════════════════════════════════════════
// module-viewport.js — zoom, pan, fit, resize
// ═══════════════════════════════════════════════════════════

(function (APP) {

  const { svg, zg } = APP;

  const zoom = d3.zoom().scaleExtent([0.3, 4])
    .on('zoom', e => zg.attr('transform', e.transform));
  svg.call(zoom);

  function fitView() {
    const { GW, GH, L1R, NR1 } = APP.geo;
    const pad = 90;
    const s   = Math.min((GW - pad * 2) / (L1R * 2 + NR1 * 2 + 120),
                         (GH - pad * 2) / (L1R * 2 + NR1 * 2 + 120));
    const { CX, CY } = APP.geo;
    svg.transition().duration(550)
      .call(zoom.transform, d3.zoomIdentity.translate(GW / 2, GH / 2).scale(s).translate(-CX, -CY));
  }

  function zoomToNodes(nodes) {
    const { GW, GH } = APP.geo;
    const pts = nodes.filter(Boolean);
    if (!pts.length) { fitView(); return; }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    pts.forEach(p => {
      minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
    });
    const pad = 150;
    minX -= pad; minY -= pad; maxX += pad; maxY += pad;
    const w  = maxX - minX, h = maxY - minY;
    const s  = Math.max(0.3, Math.min(2.2, Math.min(GW / w, GH / h)));
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    svg.transition().duration(650)
      .call(zoom.transform, d3.zoomIdentity.translate(GW / 2, GH / 2).scale(s).translate(-cx, -cy));
  }

  document.getElementById('zin').onclick    = () => svg.transition().duration(280).call(zoom.scaleBy, 1.35);
  document.getElementById('zout').onclick   = () => svg.transition().duration(280).call(zoom.scaleBy, 0.74);
  document.getElementById('fitbtn').onclick = () => {
    if (APP.state.isoState) APP.connections.clearIso();
    fitView();
  };

  window.addEventListener('resize', () => {
    APP.computeGeo();
    APP.placeNodes();
    const { GW, GH } = APP.geo;
    svg.attr('width', GW).attr('height', GH);
    APP.l1.l1Groups.attr('transform', d => `translate(${d.x},${d.y})`);
    APP.l2.l2Groups.attr('transform', d => `translate(${d.x},${d.y})`);
    APP.l3.l3Groups.attr('transform', d => `translate(${d.x},${d.y})`);
    APP.connections.drawConns();
    APP.l2.drawL2Lines();
    APP.l3.drawL3Lines();
    APP.connections.clearXLinks();
    if (APP.state.isoState) {
      const s = APP.state.isoState;
      APP.connections.clearIso();
      APP.connections.enterIsolatedView(s.sourceId, s.targetId, s.label);
    } else {
      fitView();
    }
  });

  APP.viewport = { zoom, fitView, zoomToNodes };

})(window.APP);

// ═══════════════════════════════════════════════════════════
// module-state.js — selection state machine + mode/filter
// Orchestrator: calls into all other modules.
// Loads LAST.
// ═══════════════════════════════════════════════════════════

(function (APP) {

  const { nodeById, state } = APP;
  const { l1Groups }   = APP.l1;
  const { l2Groups, l2LineG } = APP.l2;
  const { l3Groups, l3LineG } = APP.l3;

  // ── SELECTION ─────────────────────────────────────────────

  function selectL1(cat) {
    if (state.isoState) APP.connections.clearIso();
    if (state.curTopic) APP.index.exitTopicFocus(false);
    if (state.selL1 === cat) { clearSelection(); return; }
    state.selL1 = cat; state.selL2 = null; state.selL3 = null;
    APP.connections.clearXLinks();
    APP.callout.unpinCallout();
    APP.decor.showCenterUI();
    APP.decor.setRingView(1);   // landing → L1 selected: keep orbit ring only
    APP.decor.setBackVisible(true);

    l1Groups.classed('faded', d => d.id !== cat.id).classed('dim', false);
    l2Groups.classed('dim', false).each(function (d) {
      d3.select(this).classed('vis', d.parentId === cat.id);
    });
    l2LineG.selectAll('.l2line')
      .classed('vis', false).classed('l2line-sel', false).classed('xred', false)
      .each(function () {
        d3.select(this).classed('vis', d3.select(this).attr('data-pid') === cat.id);
      });
    l3Groups.classed('vis', false).classed('dim', false);
    l3LineG.selectAll('.l3line').classed('vis', false).classed('xred', false);
    APP.panel.closePanel();
    applyFilter();
  }

  function selectL2(sub) {
    state.selL2 = sub; state.selL3 = null;
    APP.connections.clearXLinks();
    APP.callout.unpinCallout();
    APP.decor.hideCenterUI();
    APP.decor.setRingView(0);   // L2 deep: no rings

    l2Groups.classed('sel', d => d.id === sub.id);
    l3Groups.each(function (d) {
      d3.select(this).classed('vis', d.parentId === sub.id).classed('sel', false);
    });
    l3LineG.selectAll('.l3line').classed('xred', false).each(function () {
      d3.select(this).classed('vis', d3.select(this).attr('data-pid') === sub.id);
    });
    l2LineG.selectAll('.l2line').classed('l2line-sel', false).classed('xred', false).each(function () {
      d3.select(this).classed('l2line-sel', d3.select(this).attr('data-id') === sub.id);
    });
    APP.panel.openL2Panel(sub);
  }

  function selectL3OnCanvas(el) {
    state.selL3 = el;
    APP.decor.hideCenterUI();
    l3Groups.classed('sel', d => d.id === el.id);
    APP.connections.drawXLinks(el);
    APP.callout.pinCallout(el);
    APP.panel.openL3Panel(el.id);
  }

  function clearSelection() {
    state.selL1 = null; state.selL2 = null; state.selL3 = null;
    if (state.isoState) APP.connections.clearIso();
    APP.connections.clearXLinks();
    APP.callout.unpinCallout();
    APP.decor.showCenterUI();
    APP.decor.setRingView(3);   // back to landing: all 3 rings
    APP.decor.setBackVisible(false);

    l1Groups.classed('faded', false).classed('dim', false);
    l2Groups.classed('vis', false).classed('sel', false).classed('dim', false).classed('xtarget', false);
    l2LineG.selectAll('.l2line').classed('vis', false).classed('l2line-sel', false).classed('xred', false);
    l3Groups.classed('vis', false).classed('sel', false).classed('dim', false)
      .classed('topic', false).classed('iso-src', false).classed('iso-tgt', false);
    l3LineG.selectAll('.l3line').classed('vis', false).classed('xred', false);
    APP.panel.closePanel();
  }

  function navigateTo(id) {
    if (state.isoState) APP.connections.clearIso();
    const el = nodeById[id]; if (!el || !el.grandParentId) return;
    const cat = nodeById[el.grandParentId], sub = nodeById[el.parentId];
    if (cat) selectL1(cat);
    setTimeout(() => {
      if (sub) selectL2(sub);
      setTimeout(() => { APP.panel.openL3Panel(id); selectL3OnCanvas(el); }, 80);
    }, 60);
  }

  // ── MODE TOGGLE ───────────────────────────────────────────
  document.querySelectorAll('.mbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.curMode = btn.dataset.m;
      document.querySelectorAll('.mbtn').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const showConn = state.curMode === 'connect';
      d3.selectAll('.connpath').classed('vis', showConn);
      if (!state.isoState) APP.decor.cg.classed('hidden', showConn);
    });
  });

  // ── FILTER ────────────────────────────────────────────────
  function applyFilter() {
    l2Groups.each(function (d) {
      if (!state.selL1 || d.parentId !== state.selL1.id) return;
      const show = d.children.some(el =>
        state.curFilter === 'all' || el.flag === state.curFilter || el.flag === 'BOTH'
      );
      d3.select(this).classed('vis', show && !!state.selL1);
    });
    if (state.selL2) APP.panel.openL2Panel(state.selL2);
  }

  document.querySelectorAll('.fbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.curFilter = btn.dataset.f;
      document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      applyFilter();
    });
  });

  // ── SVG BACKGROUND CLICK ──────────────────────────────────
  APP.svg.on('click', () => { if (state.isoState) return; clearSelection(); });

  // ── HINT BANNER ───────────────────────────────────────────
  const hint = document.getElementById('hint');
  setTimeout(() => hint.classList.add('gone'), 5000);
  APP.svg.on('click.hint', () => hint.classList.add('gone'));
  document.getElementById('srch').addEventListener('focus', () => hint.classList.add('gone'));

  // ── INIT ─────────────────────────────────────────────────
  APP.viewport.fitView();

  // ── PUBLIC API ────────────────────────────────────────────
  APP.state_mod = { selectL1, selectL2, selectL3OnCanvas, clearSelection, navigateTo, applyFilter };

  window._app = {
    openL2Panel:      APP.panel.openL2Panel,
    openL3Panel:      APP.panel.openL3Panel,
    openIndexPanel:   APP.index.openIndexPanel,
    openTopicPanel:   APP.panel.openTopicPanel,
    navigateTo,
    selectL3:         selectL3OnCanvas,
    backToTopicList:  APP.index.backToTopicList,
    openConnection:   APP.connections.enterIsolatedView,
    exitConnToNode:   APP.connections.exitConnToNode,
    exitConnToAll:    APP.connections.exitConnToAll,
  };
  window.nodeById = nodeById;

})(window.APP);

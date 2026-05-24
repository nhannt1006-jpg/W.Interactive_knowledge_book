// ═══════════════════════════════════════════════════════════
// module-search.js — search input + dropdown
// ═══════════════════════════════════════════════════════════

(function (APP) {

  const { allL3Els, nodeById } = APP;
  const srch = document.getElementById('srch');
  const drop = document.getElementById('sr-drop');

  srch.addEventListener('input', () => {
    const q = srch.value.trim().toLowerCase();
    if (!q) { drop.classList.remove('open'); drop.innerHTML = ''; return; }
    const hits = allL3Els.filter(el =>
      el.label.toLowerCase().includes(q) ||
      (el.tp     || '').toLowerCase().includes(q) ||
      (el.wd     || '').toLowerCase().includes(q) ||
      (el.summary|| '').toLowerCase().includes(q) ||
      (el.obj    || '').toLowerCase().includes(q)
    ).slice(0, 12);

    if (!hits.length) {
      drop.innerHTML = '<div class="sri" style="color:#FFFFFF50">No results</div>';
      drop.classList.add('open');
      return;
    }
    drop.innerHTML = hits.map(el => {
      const fc = el.flag === 'TP' ? 'badge-tp' : el.flag === 'WD' ? 'badge-wd' : 'badge-both';
      const fl = el.flag === 'BOTH' ? 'TP+WD' : el.flag || '—';
      return `<div class="sri" data-id="${el.id}">
        <span class="sri-badge ${fc}">${fl}</span>
        <span class="sri-name">${el.label}</span>
        <span class="sri-path">${[el.grandParentLabel, el.parentLabel].filter(Boolean).join(' › ')}</span>
      </div>`;
    }).join('');
    drop.classList.add('open');
  });

  drop.addEventListener('click', e => {
    const item = e.target.closest('.sri[data-id]'); if (!item) return;
    const el   = nodeById[item.dataset.id]; if (!el) return;
    if (APP.state.isoState) APP.connections.clearIso();
    const cat = nodeById[el.grandParentId], sub = nodeById[el.parentId];
    if (cat) APP.state_mod.selectL1(cat);
    setTimeout(() => {
      if (sub) APP.state_mod.selectL2(sub);
      setTimeout(() => {
        APP.panel.openL3Panel(el.id);
        APP.state_mod.selectL3OnCanvas(el);
      }, 80);
    }, 60);
    drop.classList.remove('open');
    srch.value = '';
  });

  document.addEventListener('click', e => {
    if (!document.getElementById('srch-wrap').contains(e.target)) drop.classList.remove('open');
  });

})(window.APP);

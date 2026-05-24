// ═══════════════════════════════════════════════════════════
// module-callout.js — HTML overlay callout (Option A)
// Fixed top-right position, viewport-anchored.
// Shows on L3 hover; stays pinned on L3 click.
// five7: black bg, 1px white border, Roboto
// ═══════════════════════════════════════════════════════════

(function (APP) {

  const { esc } = APP;
  const el = document.getElementById('l3-callout');

  function badgeClass(flag) {
    if (flag === 'TP')   return 'co-badge co-badge-tp';
    if (flag === 'WD')   return 'co-badge co-badge-wd';
    return 'co-badge co-badge-both';
  }

  function badgeLabel(flag) {
    if (flag === 'BOTH') return 'TP + WD';
    return flag || '—';
  }

  function showCallout(d) {
    const refParts = [d.tp && d.tp !== '—' ? d.tp : null, d.wd && d.wd !== '—' ? d.wd : null].filter(Boolean);
    const refLine  = refParts.join(' · ');

    el.innerHTML = `
      <div class="co-header">
        <span class="${badgeClass(d.flag)}">${badgeLabel(d.flag)}</span>
        <span class="co-label">${esc(d.label)}</span>
      </div>
      ${refLine ? `<div class="co-ref">${esc(refLine)}</div>` : ''}
      ${d.obj    ? `<div class="co-obj">${esc(d.obj)}</div>` : ''}
    `;
    el.classList.remove('hidden');
  }

  function hideCallout() {
    el.classList.add('hidden');
  }

  function pinCallout(d) {
    showCallout(d);
    el.classList.add('pinned');
  }

  function unpinCallout() {
    el.classList.remove('pinned');
    hideCallout();
  }

  APP.callout = { showCallout, hideCallout, pinCallout, unpinCallout };

})(window.APP);

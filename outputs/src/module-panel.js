// ═══════════════════════════════════════════════════════════
// module-panel.js — right sidebar panel renderers
// five7: black bg, white text, Roboto, 1px white dividers
// ═══════════════════════════════════════════════════════════

(function (APP) {

  const { nodeById, XLINKS, isExternalLink, RED, esc } = APP;

  function flagClass(flag) {
    if (flag === 'TP')   return 'badge-tp';
    if (flag === 'WD')   return 'badge-wd';
    return 'badge-both';
  }
  function flagLabel(flag) {
    return flag === 'BOTH' ? 'TP + WD' : flag || '—';
  }

  function openL2Panel(sub) {
    const cat      = nodeById[sub.parentId];
    const filtered = sub.children.filter(el =>
      APP.state.curFilter === 'all' || el.flag === APP.state.curFilter || el.flag === 'BOTH'
    );
    document.getElementById('ppath').textContent  = cat ? cat.label.replace('\n', ' ') : '';
    document.getElementById('ptitle').textContent = sub.label;
    document.getElementById('pbody').innerHTML    = filtered.map(el => {
      const isHilit = APP.state.selL3 && APP.state.selL3.id === el.id;
      return `<div class="l3item${isHilit ? ' hilit' : ''}"
        onclick="window._app.openL3Panel('${el.id}');window._app.selectL3(nodeById['${el.id}'])">
        <span class="lbadge ${flagClass(el.flag)}">${flagLabel(el.flag)}</span>
        <span class="l3lbl">${esc(el.label)}</span>
      </div>`;
    }).join('') + (filtered.length === 0
      ? '<div class="empty-note">No elements match current filter.</div>' : '');
    document.getElementById('panel').classList.add('open');
    const sb = document.getElementById('sugbtn');
    sb.style.display = '';
    sb.onclick = () => suggestFor(sub.label, sub.parentLabel || '');
  }

  function openL3Panel(id) {
    const el = nodeById[id]; if (!el) return;
    APP.state.selL3 = el;
    const sub = nodeById[el.parentId], cat = nodeById[el.grandParentId];
    const path = [cat ? cat.label.replace('\n', ' ') : '', sub ? sub.label : ''].filter(Boolean).join(' › ');
    document.getElementById('ppath').textContent  = path;
    document.getElementById('ptitle').textContent = el.label;

    // cross-links block
    const xls    = XLINKS.filter(x => x.s === id || x.t === id);
    const xlHtml = xls.length ? `<div class="dsec"><div class="dsec-t">Cross-links</div>${xls.map(x => {
      const otherId  = x.s === id ? x.t : x.s;
      const other    = nodeById[otherId];
      const otherCat = other ? nodeById[other.grandParentId] : null;
      const external = isExternalLink(id, otherId);
      if (external) {
        return `<div class="dcl dcl-ext">
          <div class="dclbullet"></div>
          <div class="dcltxt"><strong>${esc(other ? other.label : '')}</strong><span class="dcl-tag ext">ext</span>
            <div class="dcl-nav">${esc(x.label)} · ${esc(otherCat ? otherCat.label.replace('\n', ' ') : '')} ↗</div>
            <span class="dcl-open" onclick="event.stopPropagation();window._app.openConnection('${id}','${otherId}')">＋ Open connection view</span>
          </div>
        </div>`;
      }
      return `<div class="dcl" onclick="window._app.navigateTo('${otherId}')">
        <div class="dclbullet"></div>
        <div class="dcltxt"><strong>${esc(other ? other.label : '')}</strong><span class="dcl-tag int">in-category</span>
          <div class="dcl-nav">${esc(x.label)} · ${esc(otherCat ? otherCat.label.replace('\n', ' ') : '')}</div>
        </div>
      </div>`;
    }).join('')}</div>` : '';

    const chkHtml = `<div class="dsec"><div class="dsec-t">Compliance checks</div>${
      el.checks && el.checks.length
        ? el.checks.map(c => `<div class="dcheck"><div class="dcheck-box"></div><span>${esc(c)}</span></div>`).join('')
        : '<div class="empty-note">No checklist yet.</div>'
    }</div>`;

    document.getElementById('pbody').innerHTML = `
      <div><span class="lbadge ${flagClass(el.flag)}" style="font-size:10px;padding:3px 8px">${flagLabel(el.flag)}</span></div>
      <div class="dback" onclick="window._app.openL2Panel(nodeById['${el.parentId}'])">← ${esc(sub ? sub.label : '')}</div>
      ${el.obj    ? `<div class="dsec"><div class="dsec-t">Objective</div><div class="dsec-b dsec-obj">${esc(el.obj)}</div></div>` : ''}
      ${el.summary? `<div class="dsec"><div class="dsec-t">Summary</div><div class="dsec-b">${esc(el.summary)}</div></div>` : ''}
      ${el.tp && el.tp !== '—' ? `<div class="dsec"><div class="dsec-t">Planning permit (TP)</div><div class="dsec-b"><span class="dsrc">${esc(el.tp)}</span></div></div>` : ''}
      ${el.wd && el.wd !== '—' ? `<div class="dsec"><div class="dsec-t">Building permit (WD)</div><div class="dsec-b"><span class="dsrc">${esc(el.wd)}</span></div></div>` : ''}
      ${xlHtml}${chkHtml}
      <div class="dsec"><div class="dsec-t">Council notes</div>
        <div class="dsec-b empty-note">No council-specific notes yet.</div>
      </div>
    `;
    document.getElementById('panel').classList.add('open');
    const sb = document.getElementById('sugbtn');
    sb.style.display = '';
    sb.onclick = () => suggestFor(el.label, path);
  }

  function openConnectionPanel(src, tgt, label) {
    const srcCat = nodeById[src.grandParentId], srcSub = nodeById[src.parentId];
    const tgtCat = nodeById[tgt.grandParentId], tgtSub = nodeById[tgt.parentId];
    document.getElementById('ppath').textContent  = 'CONNECTION VIEW';
    document.getElementById('ptitle').textContent = label;
    document.getElementById('pbody').innerHTML = `
      <div class="iso-back">
        <button onclick="window._app.exitConnToNode()">← Back to node</button>
        <button class="primary" onclick="window._app.exitConnToAll()">Back to all</button>
      </div>
      <div class="dsec">
        <div class="dsec-t">Source</div>
        <div class="l3item" onclick="window._app.exitConnToNode()">
          <span class="lbadge ${flagClass(src.flag)}">${flagLabel(src.flag)}</span>
          <span class="l3lbl">${esc(src.label)}</span>
        </div>
        <div class="dcl-nav" style="margin-top:4px">${esc(srcCat ? srcCat.label.replace('\n', ' ') : '')} › ${esc(srcSub ? srcSub.label : '')}</div>
      </div>
      <div class="dsec">
        <div class="dsec-t" style="color:${RED}">Connects to ↗</div>
        <div class="l3item" onclick="window._app.navigateTo('${tgt.id}')">
          <span class="lbadge ${flagClass(tgt.flag)}">${flagLabel(tgt.flag)}</span>
          <span class="l3lbl">${esc(tgt.label)}</span>
        </div>
        <div class="dcl-nav" style="margin-top:4px">${esc(tgtCat ? tgtCat.label.replace('\n', ' ') : '')} › ${esc(tgtSub ? tgtSub.label : '')}</div>
      </div>
      <div class="dsec">
        <div class="dsec-t">Relationship</div>
        <div class="dsec-b">${esc(label)}</div>
      </div>
      <div class="dsec">
        <div class="dsec-b">
          <span class="dcl-open" style="color:#FFFFFFCF;border-color:#FFFFFF30"
            onclick="window._app.navigateTo('${tgt.id}')">Go to ${esc(tgt.label)} →</span>
        </div>
      </div>
    `;
    document.getElementById('panel').classList.add('open');
    document.getElementById('sugbtn').style.display = 'none';
  }

  function closePanel() {
    document.getElementById('panel').classList.remove('open');
  }

  function suggestFor(name, path) {
    const txt = `[Knowledge Book] Suggested addition\nElement: ${name}\nPath: ${path}\n\nNote: [describe your addition here]`;
    const b = document.getElementById('sugbtn');
    const ok   = () => { b.textContent = '✓ Copied to clipboard'; setTimeout(() => b.textContent = '+ Suggest an addition', 2500); };
    const fail = () => { b.textContent = '⚠ Press Ctrl+C to copy'; window.prompt('Copy this suggestion:', txt); setTimeout(() => b.textContent = '+ Suggest an addition', 2500); };
    // navigator.clipboard is undefined in non-secure contexts (e.g. opening the file via file://).
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(ok).catch(fail);
    } else {
      fail();
    }
  }

  APP.panel = { openL2Panel, openL3Panel, openConnectionPanel, closePanel, suggestFor };

})(window.APP);

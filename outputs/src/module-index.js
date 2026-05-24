// ═══════════════════════════════════════════════════════════
// module-index.js — left topic index panel
// ═══════════════════════════════════════════════════════════

(function (APP) {

  const { KBIDX, allL3Els, nodeById } = APP;
  const idxBtn   = document.getElementById('idx-btn');
  const idxPanel = document.getElementById('idx-panel');
  const idxList  = document.getElementById('idx-list');

  idxBtn.addEventListener('click', () => {
    if (idxBtn.classList.contains('on')) {
      idxBtn.classList.remove('on');
      exitTopicFocus(false);
    } else {
      idxBtn.classList.add('on');
      APP.state_mod.clearSelection();
      openIndexPanel();
    }
  });

  function openIndexPanel() {
    idxList.innerHTML = KBIDX.map((topic, i) => {
      const ids  = new Set(topic.nodes);
      const nodes = allL3Els.filter(el => ids.has(el.id));
      const tp   = nodes.filter(el => el.flag === 'TP' || el.flag === 'BOTH').length;
      const wd   = nodes.filter(el => el.flag === 'WD' || el.flag === 'BOTH').length;
      return `<div class="idx-item" data-idx="${i}">
        <div class="idx-item-title">${topic.title}</div>
        <div class="idx-item-meta">
          ${tp ? `<span class="lbadge badge-tp" style="width:auto;padding:1px 5px;font-size:8px">TP ${tp}</span>` : ''}
          ${wd ? `<span class="lbadge badge-wd" style="width:auto;padding:1px 5px;font-size:8px">WD ${wd}</span>` : ''}
        </div>
      </div>`;
    }).join('');

    idxPanel.classList.add('open');
    document.getElementById('sugbtn').style.display = 'none';

    document.querySelectorAll('.idx-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.idx-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        focusTopic(KBIDX[parseInt(item.dataset.idx)]);
      });
    });
  }

  function focusTopic(topic) {
    if (APP.state.isoState) APP.connections.clearIso();
    APP.state.curTopic = topic;
    const ids = new Set(topic.nodes);
    APP.connections.clearXLinks();
    APP.l1.l1Groups.classed('faded', false).classed('dim', false);
    APP.l2.l2Groups.classed('vis', false).classed('sel', false).classed('dim', false).classed('xtarget', false);
    APP.l2.l2LineG.selectAll('.l2line').classed('vis', false).classed('l2line-sel', false).classed('xred', false);

    const parentIds = new Set(), grandIds = new Set();
    allL3Els.forEach(el => {
      if (ids.has(el.id)) { parentIds.add(el.parentId); grandIds.add(el.grandParentId); }
    });

    APP.l2.l2Groups.each(function (d) { d3.select(this).classed('vis', parentIds.has(d.id)); });
    APP.l2.l2LineG.selectAll('.l2line').each(function () {
      d3.select(this).classed('vis', grandIds.has(d3.select(this).attr('data-pid')));
    });
    APP.l1.l1Groups.classed('faded', d => !grandIds.has(d.id));
    APP.l3.l3Groups.each(function (d) {
      const match = ids.has(d.id);
      d3.select(this).classed('vis', match).classed('sel', false).classed('topic', match);
    });
    APP.l3.l3LineG.selectAll('.l3line').classed('xred', false).each(function () {
      d3.select(this).classed('vis', parentIds.has(d3.select(this).attr('data-pid')));
    });

    APP.decor.setBackVisible(true);
    APP.panel.openTopicPanel(topic);
  }

  function backToTopicList() {
    APP.state.curTopic = null;
    APP.connections.clearXLinks();
    if (APP.state.isoState) APP.connections.clearIso();
    APP.l1.l1Groups.classed('faded', false).classed('dim', false);
    APP.l2.l2Groups.classed('vis', false).classed('sel', false).classed('dim', false).classed('xtarget', false);
    APP.l2.l2LineG.selectAll('.l2line').classed('vis', false).classed('l2line-sel', false).classed('xred', false);
    APP.l3.l3Groups.classed('vis', false).classed('sel', false).classed('topic', false);
    APP.l3.l3LineG.selectAll('.l3line').classed('vis', false).classed('xred', false);
    APP.decor.setBackVisible(false);
    APP.decor.showCenterUI();
    document.querySelectorAll('.idx-item').forEach(i => i.classList.remove('active'));
    APP.panel.closePanel();
  }

  function exitTopicFocus(keepLeft) {
    APP.state.curTopic = null;
    APP.connections.clearXLinks();
    if (APP.state.isoState) APP.connections.clearIso();
    APP.l1.l1Groups.classed('faded', false).classed('dim', false);
    APP.l2.l2Groups.classed('vis', false).classed('sel', false).classed('dim', false).classed('xtarget', false);
    APP.l2.l2LineG.selectAll('.l2line').classed('vis', false).classed('l2line-sel', false).classed('xred', false);
    APP.l3.l3Groups.classed('vis', false).classed('sel', false).classed('topic', false);
    APP.l3.l3LineG.selectAll('.l3line').classed('vis', false).classed('xred', false);
    APP.decor.setBackVisible(false);
    APP.decor.showCenterUI();
    if (!keepLeft) {
      idxBtn.classList.remove('on');
      idxPanel.classList.remove('open');
      document.querySelectorAll('.idx-item').forEach(i => i.classList.remove('active'));
      document.getElementById('sugbtn').style.display = '';
    }
    APP.panel.closePanel();
  }

  APP.index = { openIndexPanel, focusTopic, backToTopicList, exitTopicFocus };

  // expose openTopicPanel on APP.panel (needs index context)
  APP.panel.openTopicPanel = function (topic) {
    const ids   = new Set(topic.nodes);
    const nodes = allL3Els.filter(el => ids.has(el.id));
    document.getElementById('ppath').textContent  = 'TOPIC INDEX';
    document.getElementById('ptitle').textContent = topic.title;
    const nodeRows = nodes.map(el => {
      const fc = el.flag === 'TP' ? 'badge-tp' : el.flag === 'WD' ? 'badge-wd' : 'badge-both';
      const fl = el.flag === 'BOTH' ? 'TP+WD' : el.flag || '—';
      return `<div class="l3item" onclick="window._app.navigateTo('${el.id}')">
        <span class="lbadge ${fc}">${fl}</span>
        <span class="l3lbl">${el.label}</span>
      </div>`;
    }).join('');
    const kws = topic.keywords.map(k => `<span class="kw-chip">${k}</span>`).join('');
    document.getElementById('pbody').innerHTML = `
      <div class="dback" onclick="window._app.backToTopicList()">← All Topics</div>
      <div class="dsec">
        <div class="dsec-t">Keywords</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">${kws}</div>
      </div>
      <div class="dsec">
        <div class="dsec-t">Elements in this topic (${nodes.length})</div>
        ${nodeRows}
      </div>
      <div class="dsec">
        <div class="dsec-t">AI Reference File</div>
        <div class="dsec-b"><span class="dsrc">${topic.file}</span></div>
      </div>
    `;
    document.getElementById('panel').classList.add('open');
    document.getElementById('sugbtn').style.display = 'none';
  };

})(window.APP);

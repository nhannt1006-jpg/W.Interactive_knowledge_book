// module-core.js -- shared APP namespace
// Sets up window.APP with data, geometry, SVG root, state + named SVG layers
// Must load AFTER kb-data.js, BEFORE all other modules
//
// Layer z-order (bottom to top inside zg):
//   bgLayer   = rings, centre UI, back button (decor)
//   lineLayer  = all connector lines and arcs
//   nodeLayer  = all node circles (L1, L2, L3)
//
// Keeping decor in bgLayer (below nodes) replicates original paint order.
// Lines are now explicitly between decor and nodes -- fixes "lines over bubbles".

(function () {

  var KB     = window.KB_GRAPH.KB;
  var L1CONN = window.KB_GRAPH.L1CONN;
  var XLINKS = window.KB_GRAPH.XLINKS;
  var KBIDX  = window.KB_INDEX;
  var RED    = '#dc2626';

  // -- FLATTEN + INDEX
  var nodeById = {};
  KB.forEach(function(cat) {
    nodeById[cat.id] = cat;
    cat.children.forEach(function(sub) {
      sub.parentId     = cat.id;
      sub.parentLabel  = cat.label.replace('\n', ' ');
      nodeById[sub.id] = sub;
      sub.children.forEach(function(el) {
        el.parentId         = sub.id;
        el.parentLabel      = sub.label;
        el.grandParentId    = cat.id;
        el.grandParentLabel = cat.label.replace('\n', ' ');
        var c  = window.KB_CONTENT[el.id] || {};
        el.obj     = c.obj     || '';
        el.checks  = c.checks  || [];
        el.summary = c.summary || '';
        nodeById[el.id] = el;
      });
    });
  });

  var allL3Els = KB.reduce(function(a,c){ return a.concat(c.children.reduce(function(b,s){ return b.concat(s.children); },[])); },[]);
  var allSubs  = KB.reduce(function(a,c){ return a.concat(c.children); },[]);

  function isExternalLink(aId, bId) {
    var a = nodeById[aId], b = nodeById[bId];
    if (!a || !b) return false;
    return a.grandParentId !== b.grandParentId;
  }

  // -- GEOMETRY
  var graphEl = document.getElementById('graph');
  var NR3 = 5;
  var geo = { GW:0, GH:0, CX:0, CY:0, L1R:0, NR1:0, NR2:0, NR3:NR3 };

  function computeGeo() {
    geo.GW  = graphEl.clientWidth;
    geo.GH  = graphEl.clientHeight;
    geo.CX  = geo.GW / 2;
    geo.CY  = geo.GH / 2;
    geo.L1R = Math.min(geo.GW, geo.GH) * 0.31;
    geo.NR1 = Math.max(42, Math.min(Math.min(geo.GW, geo.GH) * 0.05, 58));
    geo.NR2 = Math.max(28, Math.min(Math.min(geo.GW, geo.GH) * 0.028, 38));
    geo.NR3 = NR3;
  }

  // Dynamic L3 distance: more children = further out
  function l3dist(childCount) {
    var n = (childCount !== undefined) ? childCount : 6;
    return geo.NR2 + geo.NR3 + Math.max(70, n * 22);
  }

  function placeNodes() {
    var cx=geo.CX, cy=geo.CY, l1r=geo.L1R, nr1=geo.NR1, nr2=geo.NR2;
    KB.forEach(function(cat, i) {
      var a = (i / KB.length) * 2 * Math.PI - Math.PI / 2;
      cat.x = cx + l1r * Math.cos(a);
      cat.y = cy + l1r * Math.sin(a);
      cat.angle = a;
      cat.children.forEach(function(sub, j) {
        var n    = cat.children.length;
        var span = Math.min(n * 0.48, Math.PI * 0.82);
        var sa   = n > 1 ? a - span / 2 : a;
        var sa2  = sa + j * (n > 1 ? span / (n - 1) : 0);
        var d    = nr1 + nr2 + Math.max(55, n * 12);
        sub.x  = cat.x + d * Math.cos(sa2);
        sub.y  = cat.y + d * Math.sin(sa2);
        sub.px = cat.x; sub.py = cat.y;
        var l2angle = Math.atan2(sub.y - cat.y, sub.x - cat.x);
        var m       = sub.children.length;
        var l3span  = Math.min(m * 0.5, Math.PI * 0.95);
        var dd      = l3dist(m);
        sub.children.forEach(function(el, k) {
          var l3a = m > 1 ? l2angle - l3span/2 + k*(l3span/(m-1)) : l2angle;
          el.l3a = l3a;
          el.x   = sub.x + dd * Math.cos(l3a);
          el.y   = sub.y + dd * Math.sin(l3a);
        });
      });
    });
  }

  // -- SVG ROOT
  computeGeo();
  placeNodes();

  var svg  = d3.select('#graph').append('svg').attr('width', geo.GW).attr('height', geo.GH);
  var zg   = svg.append('g');
  var defs = svg.append('defs');

  // Named SVG layers (z-order bottom to top):
  //   bgLayer   = decorative rings + centre UI + back button
  //   lineLayer  = all connector lines
  //   nodeLayer  = all node circles (L1, L2, L3)
  var bgLayer   = zg.append('g').attr('class', 'bg-layer');
  var lineLayer  = zg.append('g').attr('class', 'line-layer');
  var nodeLayer  = zg.append('g').attr('class', 'node-layer');

  [['arrg','#FFFFFF50'],['arrhl','#FFFFFF'],['arrr',RED]].forEach(function(m) {
    defs.append('marker').attr('id',m[0])
      .attr('markerWidth',7).attr('markerHeight',5)
      .attr('refX',6).attr('refY',2.5).attr('orient','auto')
      .append('path').attr('d','M0,0 L7,2.5 L0,5 Z').attr('fill',m[1]);
  });

  // -- SHARED STATE
  var state = { selL1:null, selL2:null, selL3:null, curMode:'browse', curFilter:'all', curTopic:null, isoState:null };

  // -- EXPOSE
  window.APP = {
    KB:KB, L1CONN:L1CONN, XLINKS:XLINKS, KBIDX:KBIDX,
    nodeById:nodeById, allL3Els:allL3Els, allSubs:allSubs,
    isExternalLink:isExternalLink, RED:RED,
    svg:svg, zg:zg, defs:defs,
    bgLayer:bgLayer, lineLayer:lineLayer, nodeLayer:nodeLayer,
    geo:geo, computeGeo:computeGeo, placeNodes:placeNodes, l3dist:l3dist,
    state:state
  };

})();

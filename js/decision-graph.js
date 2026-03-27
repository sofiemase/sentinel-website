// ========== Decision Graph - D3.js Interactive Visualization ==========

// Wait for D3 to load
function initDecisionGraph() {
  if (typeof d3 === 'undefined') {
    setTimeout(initDecisionGraph, 100);
    return;
  }

  const container = document.getElementById('graphSvg');
  const tooltip = document.getElementById('graphTooltip');
  const width = container.clientWidth;
  const height = container.clientHeight || 420;

  // Color map for node types
  const nodeColors = {
    message: '#27AE60',
    call: '#0F6E4A',
    media: '#D97706',
    document: '#EA7B1E',
    switch: '#DC2626'
  };

  // Edge styles
  const edgeStyles = {
    reply: { color: '#bbb', width: 1.5, dash: '' },
    reference: { color: '#999', width: 1, dash: '4,3' },
    build: { color: '#27AE60', width: 1.5, dash: '' },
    pressure: { color: '#EA7B1E', width: 2.5, dash: '' },
    contradict: { color: '#DC2626', width: 2, dash: '5,3' }
  };

  // ========== Data ==========
  const legitimateData = {
    nodes: [
      { id: 1, type: 'message', label: 'Hey mom, can you help me with Uber?', phase: 1 },
      { id: 2, type: 'message', label: 'Sure honey, what do you need?', phase: 1 },
      { id: 3, type: 'message', label: 'Can you send me $15 for a ride?', phase: 1 },
      { id: 4, type: 'message', label: 'Of course, sending now', phase: 1 },
      { id: 5, type: 'message', label: 'Got it, thank you!', phase: 1 },
      { id: 6, type: 'message', label: 'Be safe, love you', phase: 1 }
    ],
    edges: [
      { source: 1, target: 2, type: 'reply' },
      { source: 2, target: 3, type: 'reply' },
      { source: 3, target: 4, type: 'reply' },
      { source: 4, target: 5, type: 'reply' },
      { source: 5, target: 6, type: 'reply' }
    ],
    stats: { nodes: 6, phases: 1, switches: 0, contradictions: 0, timeline: '10 minutes' }
  };

  const scamData = {
    nodes: [
      // Phase 1: Trust Building (Week 1)
      { id: 1, type: 'message', label: 'Hi! I saw your profile on Facebook Dating', phase: 1 },
      { id: 2, type: 'message', label: 'You seem like a wonderful person', phase: 1 },
      { id: 3, type: 'message', label: 'I\'m an architect based in London', phase: 1 },
      { id: 4, type: 'media', label: 'Sends profile photo (stock image)', phase: 1 },
      { id: 5, type: 'message', label: 'Tells stories about successful career', phase: 1 },
      { id: 6, type: 'message', label: 'Shares details about family', phase: 1 },
      { id: 7, type: 'message', label: 'Talks about future plans together', phase: 1 },

      // Phase 2: Channel Switch (Week 2)
      { id: 8, type: 'switch', label: 'Facebook Dating -> WhatsApp', phase: 2 },
      { id: 9, type: 'message', label: 'It\'s more private here, just us', phase: 2 },
      { id: 10, type: 'call', label: 'Voice call - accent varies', phase: 2 },
      { id: 11, type: 'message', label: 'Refuses video call - "camera broken"', phase: 2 },
      { id: 12, type: 'message', label: 'Claims to be traveling for work', phase: 2 },

      // Phase 3: Deepening (Weeks 3-5)
      { id: 13, type: 'message', label: 'I love you, we have a future', phase: 3 },
      { id: 14, type: 'message', label: 'Mentions investment opportunity', phase: 3 },
      { id: 15, type: 'media', label: 'Sends hospital photos (stock images)', phase: 3 },
      { id: 16, type: 'message', label: 'Family emergency mentioned', phase: 3 },
      { id: 17, type: 'document', label: 'Sends "bank statement" (forged)', phase: 3 },
      { id: 18, type: 'call', label: 'Another voice call - refuses video again', phase: 3 },
      { id: 19, type: 'message', label: 'Says "don\'t tell anyone about us"', phase: 3 },
      { id: 20, type: 'message', label: 'Claims location is London (IP: Nigeria)', phase: 3 },
      { id: 21, type: 'switch', label: 'WhatsApp -> Phone calls', phase: 3 },
      { id: 22, type: 'message', label: 'More isolation: "this is between us"', phase: 3 },

      // Phase 4: Crisis / Pressure Spike (Week 6)
      { id: 23, type: 'message', label: '"I\'m in trouble in Dubai"', phase: 4 },
      { id: 24, type: 'message', label: '"I\'m scared, please help NOW"', phase: 4 },
      { id: 25, type: 'message', label: '"I need $12,000 for bail TODAY"', phase: 4 },
      { id: 26, type: 'message', label: '"If you love me you\'ll help"', phase: 4 },
      { id: 27, type: 'message', label: '"I\'m begging you, please"', phase: 4 },
      { id: 28, type: 'message', label: '"TODAY or I lose everything"', phase: 4 },
      { id: 29, type: 'message', label: '"Send via Western Union"', phase: 4 },
      { id: 30, type: 'message', label: '"Don\'t tell your family"', phase: 4 },
      { id: 31, type: 'message', label: '15 urgent messages in 2 hours', phase: 4 },
      { id: 32, type: 'document', label: 'Sends "jail document" (forged)', phase: 4 }
    ],
    edges: [
      // Linear flow
      { source: 1, target: 2, type: 'reply' },
      { source: 2, target: 3, type: 'reply' },
      { source: 3, target: 4, type: 'build' },
      { source: 4, target: 5, type: 'reply' },
      { source: 5, target: 6, type: 'build' },
      { source: 6, target: 7, type: 'build' },
      // Channel switch
      { source: 7, target: 8, type: 'reply' },
      { source: 8, target: 9, type: 'reply' },
      { source: 9, target: 10, type: 'reply' },
      { source: 10, target: 11, type: 'reply' },
      { source: 11, target: 12, type: 'reply' },
      // Deepening
      { source: 12, target: 13, type: 'reply' },
      { source: 13, target: 14, type: 'build' },
      { source: 14, target: 15, type: 'build' },
      { source: 15, target: 16, type: 'pressure' },
      { source: 16, target: 17, type: 'build' },
      { source: 17, target: 18, type: 'reply' },
      { source: 18, target: 19, type: 'pressure' },
      { source: 19, target: 20, type: 'reply' },
      { source: 20, target: 21, type: 'reply' },
      { source: 21, target: 22, type: 'pressure' },
      // Crisis
      { source: 22, target: 23, type: 'reply' },
      { source: 23, target: 24, type: 'pressure' },
      { source: 24, target: 25, type: 'pressure' },
      { source: 25, target: 26, type: 'pressure' },
      { source: 26, target: 27, type: 'pressure' },
      { source: 27, target: 28, type: 'pressure' },
      { source: 28, target: 29, type: 'pressure' },
      { source: 29, target: 30, type: 'pressure' },
      { source: 30, target: 31, type: 'pressure' },
      { source: 31, target: 32, type: 'build' },
      // Contradictions
      { source: 3, target: 20, type: 'contradict' },  // Claims London vs IP Nigeria
      { source: 5, target: 14, type: 'contradict' },  // Career story vs asking for money
      { source: 6, target: 16, type: 'contradict' },  // Family details inconsistent
      { source: 11, target: 18, type: 'contradict' },  // Always refuses video
      // Cycles - returns to money topic
      { source: 14, target: 25, type: 'reference' },
      { source: 16, target: 23, type: 'reference' }
    ],
    stats: { nodes: 321, phases: 4, switches: 2, contradictions: 8, timeline: '6 weeks' }
  };

  // Phase colors and labels
  const phaseInfo = {
    1: { color: '#E8F8F0', border: '#27AE60', label: 'Trust Building' },
    2: { color: '#FFF7E6', border: '#D97706', label: 'Channel Switch' },
    3: { color: '#FFF0E6', border: '#EA7B1E', label: 'Deepening' },
    4: { color: '#FFF0F0', border: '#DC2626', label: 'Crisis' }
  };

  let currentGraph = 'legitimate';
  let svg, simulation;

  function createSvg() {
    d3.select('#graphSvg svg').remove();
    svg = d3.select('#graphSvg')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Defs for arrowheads
    const defs = svg.append('defs');
    Object.keys(edgeStyles).forEach(type => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 18)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-4L10,0L0,4')
        .attr('fill', edgeStyles[type].color);
    });

    return svg;
  }

  function renderGraph(data) {
    svg = createSvg();

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    const nodes = data.nodes.map((d, i) => ({ ...d, x: width / 2, y: height / 2 }));
    const edges = data.edges.map(d => ({ ...d }));

    // Phase regions for scam graph
    const isScam = data === scamData;

    // Force simulation
    const phaseCount = isScam ? 4 : 1;
    const phaseWidth = width / phaseCount;

    simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(isScam ? 50 : 80))
      .force('charge', d3.forceManyBody().strength(isScam ? -120 : -200))
      .force('collide', d3.forceCollide(isScam ? 16 : 22));

    if (isScam) {
      simulation.force('x', d3.forceX(d => {
        return ((d.phase - 0.5) / phaseCount) * width;
      }).strength(0.4));
      simulation.force('y', d3.forceY(height / 2).strength(0.15));
    } else {
      simulation.force('x', d3.forceX((d, i) => {
        return (width * 0.15) + (i / (nodes.length - 1)) * (width * 0.7);
      }).strength(0.8));
      simulation.force('y', d3.forceY(height * 0.45).strength(0.8));
    }

    // Phase background labels for scam
    if (isScam) {
      Object.entries(phaseInfo).forEach(([phase, info]) => {
        const px = ((parseInt(phase) - 0.5) / phaseCount) * width;
        g.append('text')
          .attr('x', px)
          .attr('y', 30)
          .attr('text-anchor', 'middle')
          .attr('fill', info.border)
          .attr('font-size', '11px')
          .attr('font-weight', '700')
          .attr('letter-spacing', '0.05em')
          .attr('opacity', 0.7)
          .text(info.label.toUpperCase());
      });
    }

    // Draw edges
    const link = g.selectAll('.link')
      .data(edges)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', d => edgeStyles[d.type].color)
      .attr('stroke-width', d => edgeStyles[d.type].width)
      .attr('stroke-dasharray', d => edgeStyles[d.type].dash)
      .attr('marker-end', d => `url(#arrow-${d.type})`)
      .attr('opacity', 0.6)
      .on('mouseenter', (event, d) => showTooltip(event, `${d.type.charAt(0).toUpperCase() + d.type.slice(1)} edge`))
      .on('mouseleave', hideTooltip);

    // Draw nodes
    const node = g.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Node shapes
    node.each(function(d) {
      const el = d3.select(this);
      const r = isScam ? 8 : 12;

      if (d.type === 'document') {
        // Diamond
        el.append('rect')
          .attr('width', r * 1.4)
          .attr('height', r * 1.4)
          .attr('x', -r * 0.7)
          .attr('y', -r * 0.7)
          .attr('rx', 2)
          .attr('transform', 'rotate(45)')
          .attr('fill', nodeColors[d.type])
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5);
      } else if (d.type === 'switch') {
        // Hexagon-ish (larger circle with ring)
        el.append('circle')
          .attr('r', r + 2)
          .attr('fill', 'none')
          .attr('stroke', nodeColors[d.type])
          .attr('stroke-width', 2);
        el.append('circle')
          .attr('r', r - 1)
          .attr('fill', nodeColors[d.type]);
      } else {
        // Circle for message, call, media
        el.append('circle')
          .attr('r', r)
          .attr('fill', nodeColors[d.type])
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5);
      }

      // Icon for call nodes
      if (d.type === 'call') {
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('font-size', r * 0.8)
          .attr('fill', '#fff')
          .text('C');
      }
    });

    // Tooltip on hover
    node.on('mouseenter', (event, d) => {
      const typeLabel = d.type.charAt(0).toUpperCase() + d.type.slice(1);
      showTooltip(event, `<strong>${typeLabel}</strong><br>${d.label}`);
    })
    .on('mouseleave', hideTooltip);

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Stats annotation
    const statsText = isScam
      ? `Full graph: ${data.stats.nodes} nodes \u00B7 ${data.stats.phases} phases \u00B7 ${data.stats.switches} channel switches \u00B7 ${data.stats.contradictions} contradictions \u00B7 ${data.stats.timeline}`
      : `${data.stats.nodes} nodes \u00B7 Linear flow \u00B7 ${data.stats.switches} channel switches \u00B7 ${data.stats.contradictions} contradictions \u00B7 ${data.stats.timeline}`;

    g.append('text')
      .attr('x', width / 2)
      .attr('y', height - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#999')
      .attr('font-size', '12px')
      .text(statsText);
  }

  // Tooltip
  function showTooltip(event, html) {
    const rect = container.getBoundingClientRect();
    tooltip.innerHTML = html;
    tooltip.classList.add('visible');
    tooltip.style.left = (event.clientX - rect.left + 12) + 'px';
    tooltip.style.top = (event.clientY - rect.top - 10) + 'px';
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  // Drag handlers
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // Toggle buttons
  document.querySelectorAll('.graph-toggle__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.graph-toggle__btn').forEach(b => b.classList.remove('graph-toggle__btn--active'));
      btn.classList.add('graph-toggle__btn--active');
      const type = btn.dataset.graph;
      if (type !== currentGraph) {
        currentGraph = type;
        if (simulation) simulation.stop();
        renderGraph(type === 'legitimate' ? legitimateData : scamData);
      }
    });
  });

  // Initialize with scroll trigger or fallback
  let graphRendered = false;
  const graphObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !graphRendered) {
        graphRendered = true;
        renderGraph(legitimateData);
        graphObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  graphObserver.observe(container);

  // Fallback: render after 2 seconds if observer hasn't fired
  setTimeout(() => {
    if (!graphRendered) {
      graphRendered = true;
      renderGraph(legitimateData);
    }
  }, 2000);

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newWidth = container.clientWidth;
      if (Math.abs(newWidth - width) > 50) {
        location.reload(); // Simple approach for resize
      }
    }, 300);
  });
}

// Start
document.addEventListener('DOMContentLoaded', initDecisionGraph);

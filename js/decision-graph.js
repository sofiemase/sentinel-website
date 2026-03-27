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

  // ========== 1. REAL CONVERSATION ==========
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
    stats: { nodes: 6, phases: 1, switches: 0, contradictions: 0, timeline: '10 minutes' },
    phaseLabels: null,
    walkthrough: {
      icon: '✅',
      title: 'Real Conversation',
      scenario: 'A college student texts their mom asking for $15 for an Uber ride home.',
      overview: 'This is what a <strong>safe, legitimate conversation</strong> looks like through Sentinel AI. The graph is simple, linear, and contains zero red flags. No pressure tactics, no channel switching, no contradictions. The MRI score stays well below 100.',
      phases: [
        { name: 'Single Phase', color: '#27AE60', desc: 'A short, direct exchange — request made, help given, gratitude expressed. The entire conversation takes 10 minutes.' }
      ],
      redFlags: [],
      result: { score: '47 / 1,000', level: 'Low', color: '#27AE60', action: 'Conversation automatically cleared. No interruption to the user.' }
    }
  };

  // ========== 2. ROMANCE SCAM ==========
  const romanceData = {
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
      { source: 1, target: 2, type: 'reply' },
      { source: 2, target: 3, type: 'reply' },
      { source: 3, target: 4, type: 'build' },
      { source: 4, target: 5, type: 'reply' },
      { source: 5, target: 6, type: 'build' },
      { source: 6, target: 7, type: 'build' },
      { source: 7, target: 8, type: 'reply' },
      { source: 8, target: 9, type: 'reply' },
      { source: 9, target: 10, type: 'reply' },
      { source: 10, target: 11, type: 'reply' },
      { source: 11, target: 12, type: 'reply' },
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
      { source: 3, target: 20, type: 'contradict' },
      { source: 5, target: 14, type: 'contradict' },
      { source: 6, target: 16, type: 'contradict' },
      { source: 11, target: 18, type: 'contradict' },
      // Cycles
      { source: 14, target: 25, type: 'reference' },
      { source: 16, target: 23, type: 'reference' }
    ],
    stats: { nodes: 321, phases: 4, switches: 2, contradictions: 8, timeline: '6 weeks' },
    phaseLabels: {
      1: { border: '#27AE60', label: 'Trust Building' },
      2: { border: '#D97706', label: 'Channel Switch' },
      3: { border: '#EA7B1E', label: 'Deepening' },
      4: { border: '#DC2626', label: 'Crisis' }
    },
    walkthrough: {
      icon: '💔',
      title: 'Romance Scam',
      scenario: 'Margaret, 68, is contacted on Facebook Dating by "James," who claims to be a British architect. After 6 weeks he asks for $12,000.',
      overview: 'Romance scams follow a <strong>predictable 4-phase pattern</strong> that Sentinel AI detects by mapping the full conversation graph. The scammer invests weeks building emotional dependency before manufacturing a crisis that demands money.',
      phases: [
        { name: 'Trust Building (Week 1)', color: '#27AE60', desc: 'The scammer builds rapport with compliments, fake credentials, and stolen profile photos. Stories about career and family create a false sense of intimacy.' },
        { name: 'Channel Switch (Week 2)', color: '#D97706', desc: 'The conversation moves from Facebook to WhatsApp — away from platform safeguards. The scammer refuses video calls with escalating excuses.' },
        { name: 'Deepening (Weeks 3–5)', color: '#EA7B1E', desc: 'Love declarations, isolation tactics ("don\'t tell anyone"), and forged documents build dependency. IP location contradicts claimed identity.' },
        { name: 'Crisis (Week 6)', color: '#DC2626', desc: '15 urgent messages in 2 hours. "I need $12,000 for bail TODAY." Guilt, fear, and love weaponized simultaneously.' }
      ],
      redFlags: ['Stolen stock photos', 'IP in Nigeria, claims London', 'Refuses video for 6 weeks', '2 channel switches to avoid detection', '8 factual contradictions'],
      result: { score: '847 / 1,000', level: 'Critical', color: '#DC2626', action: 'AI agent intervenes. Conversation locked. Emergency contact notified. $12,000 saved.' }
    }
  };

  // ========== 3. RETAIL SCAM ==========
  const retailData = {
    nodes: [
      // Phase 1: Bait (Day 1)
      { id: 1, type: 'media', label: 'Instagram ad: "80% off Nike Air Max"', phase: 1 },
      { id: 2, type: 'message', label: 'User clicks ad, lands on fake store', phase: 1 },
      { id: 3, type: 'media', label: 'Professional-looking product photos (stolen)', phase: 1 },
      { id: 4, type: 'message', label: '"Only 3 left in stock!" countdown timer', phase: 1 },
      { id: 5, type: 'message', label: 'Fake 5-star reviews with stock photo avatars', phase: 1 },
      // Phase 2: Checkout Pressure (Day 1)
      { id: 6, type: 'message', label: '"Sale ends in 00:14:32" — fake timer', phase: 2 },
      { id: 7, type: 'message', label: '"12 people viewing this item now"', phase: 2 },
      { id: 8, type: 'document', label: 'Checkout page asks for full card details', phase: 2 },
      { id: 9, type: 'message', label: 'No PayPal or secure payment options', phase: 2 },
      { id: 10, type: 'message', label: '"Add $9.99 for shipping protection"', phase: 2 },
      // Phase 3: Post-Purchase (Days 2-7)
      { id: 11, type: 'message', label: 'Order confirmation email (spoofed branding)', phase: 3 },
      { id: 12, type: 'document', label: 'Fake tracking number provided', phase: 3 },
      { id: 13, type: 'message', label: 'Tracking shows "in transit" for 2 weeks', phase: 3 },
      { id: 14, type: 'message', label: 'User emails support — no response', phase: 3 },
      { id: 15, type: 'switch', label: 'Tries Instagram DM — account deleted', phase: 3 },
      // Phase 4: Escalation (Day 14+)
      { id: 16, type: 'message', label: 'Item never arrives', phase: 4 },
      { id: 17, type: 'message', label: 'Website domain now offline', phase: 4 },
      { id: 18, type: 'message', label: 'Credit card charged second time', phase: 4 },
      { id: 19, type: 'message', label: 'Unauthorized charges appear on card', phase: 4 }
    ],
    edges: [
      { source: 1, target: 2, type: 'reply' },
      { source: 2, target: 3, type: 'build' },
      { source: 3, target: 4, type: 'pressure' },
      { source: 3, target: 5, type: 'build' },
      { source: 4, target: 6, type: 'pressure' },
      { source: 5, target: 6, type: 'build' },
      { source: 6, target: 7, type: 'pressure' },
      { source: 7, target: 8, type: 'reply' },
      { source: 8, target: 9, type: 'reply' },
      { source: 9, target: 10, type: 'pressure' },
      { source: 10, target: 11, type: 'reply' },
      { source: 11, target: 12, type: 'build' },
      { source: 12, target: 13, type: 'reply' },
      { source: 13, target: 14, type: 'reply' },
      { source: 14, target: 15, type: 'reply' },
      { source: 15, target: 16, type: 'reply' },
      { source: 16, target: 17, type: 'build' },
      { source: 17, target: 18, type: 'pressure' },
      { source: 18, target: 19, type: 'pressure' },
      // Contradictions
      { source: 3, target: 17, type: 'contradict' },  // Pro site vs domain disappears
      { source: 5, target: 14, type: 'contradict' },  // Great reviews vs no support
      { source: 12, target: 16, type: 'contradict' }   // Tracking vs no delivery
    ],
    stats: { nodes: 19, phases: 4, switches: 1, contradictions: 3, timeline: '2 weeks' },
    phaseLabels: {
      1: { border: '#27AE60', label: 'Bait' },
      2: { border: '#D97706', label: 'Checkout Pressure' },
      3: { border: '#EA7B1E', label: 'Post-Purchase' },
      4: { border: '#DC2626', label: 'Escalation' }
    },
    walkthrough: {
      icon: '🛒',
      title: 'Retail Scam',
      scenario: 'A user clicks an Instagram ad for 80%-off Nike Air Max shoes. The store looks professional but the product never arrives.',
      overview: 'Fake retail scams use <strong>urgency and social proof</strong> to rush victims through checkout before they can verify the seller. Sentinel AI detects the pattern of fabricated scarcity, stolen product images, and post-purchase disappearance.',
      phases: [
        { name: 'Bait (Day 1)', color: '#27AE60', desc: 'Too-good-to-be-true pricing on a social media ad. Professional-looking site with stolen product photos and fabricated 5-star reviews.' },
        { name: 'Checkout Pressure (Day 1)', color: '#D97706', desc: 'Fake countdown timers, "only 3 left" alerts, and "12 people viewing now" messages create artificial urgency. No secure payment options.' },
        { name: 'Post-Purchase (Days 2–7)', color: '#EA7B1E', desc: 'A spoofed confirmation email and fake tracking number buy time. Support emails go unanswered. The Instagram account disappears.' },
        { name: 'Escalation (Day 14+)', color: '#DC2626', desc: 'Item never arrives. The website domain goes offline. Unauthorized charges appear on the victim\'s credit card.' }
      ],
      redFlags: ['Stolen product photos', 'Fake countdown timers', 'No PayPal or secure payment', 'Fake tracking number', 'Support channel disappears'],
      result: { score: '623 / 1,000', level: 'High', color: '#EA7B1E', action: 'User must confirm awareness before proceeding. Verification passcode triggered.' }
    }
  };

  // ========== 4. TECH SUPPORT SCAM ==========
  const techSupportData = {
    nodes: [
      // Phase 1: Initial Scare
      { id: 1, type: 'media', label: 'Browser popup: "YOUR COMPUTER IS INFECTED"', phase: 1 },
      { id: 2, type: 'message', label: 'Fake Microsoft logo and warning sounds', phase: 1 },
      { id: 3, type: 'message', label: '"Call 1-800-XXX-XXXX immediately"', phase: 1 },
      { id: 4, type: 'message', label: 'Browser locked — can\'t close tab', phase: 1 },
      // Phase 2: Fake Diagnosis
      { id: 5, type: 'call', label: 'Victim calls — "Microsoft Tech Support"', phase: 2 },
      { id: 6, type: 'message', label: '"Let me check your system remotely"', phase: 2 },
      { id: 7, type: 'message', label: 'Asks victim to install AnyDesk/TeamViewer', phase: 2 },
      { id: 8, type: 'message', label: 'Opens Event Viewer — "Look at all these errors!"', phase: 2 },
      { id: 9, type: 'document', label: 'Shows normal logs as "critical threats"', phase: 2 },
      { id: 10, type: 'message', label: '"Your bank accounts are at risk"', phase: 2 },
      // Phase 3: Payment Extraction
      { id: 11, type: 'message', label: '"Our protection plan is $299/year"', phase: 3 },
      { id: 12, type: 'message', label: '"But for you today, only $199"', phase: 3 },
      { id: 13, type: 'message', label: '"I need your card to process this now"', phase: 3 },
      { id: 14, type: 'switch', label: 'Phone -> remote desktop access', phase: 3 },
      { id: 15, type: 'message', label: 'Navigates to banking site while connected', phase: 3 },
      { id: 16, type: 'message', label: '"I accidentally refunded you $1,999"', phase: 3 },
      // Phase 4: Double Extraction
      { id: 17, type: 'message', label: '"You need to send back the overpayment"', phase: 4 },
      { id: 18, type: 'message', label: '"Buy gift cards and read me the codes"', phase: 4 },
      { id: 19, type: 'message', label: '"I\'ll lose my job if you don\'t help"', phase: 4 },
      { id: 20, type: 'message', label: '"Please don\'t tell anyone about this"', phase: 4 },
      { id: 21, type: 'message', label: 'Victim sends $1,999 in gift cards', phase: 4 }
    ],
    edges: [
      { source: 1, target: 2, type: 'build' },
      { source: 2, target: 3, type: 'pressure' },
      { source: 3, target: 4, type: 'pressure' },
      { source: 4, target: 5, type: 'reply' },
      { source: 5, target: 6, type: 'reply' },
      { source: 6, target: 7, type: 'reply' },
      { source: 7, target: 8, type: 'build' },
      { source: 8, target: 9, type: 'build' },
      { source: 9, target: 10, type: 'pressure' },
      { source: 10, target: 11, type: 'reply' },
      { source: 11, target: 12, type: 'pressure' },
      { source: 12, target: 13, type: 'pressure' },
      { source: 13, target: 14, type: 'reply' },
      { source: 14, target: 15, type: 'build' },
      { source: 15, target: 16, type: 'build' },
      { source: 16, target: 17, type: 'pressure' },
      { source: 17, target: 18, type: 'pressure' },
      { source: 18, target: 19, type: 'pressure' },
      { source: 19, target: 20, type: 'pressure' },
      { source: 20, target: 21, type: 'reply' },
      // Contradictions
      { source: 2, target: 9, type: 'contradict' },   // Fake Microsoft vs normal logs
      { source: 11, target: 16, type: 'contradict' },  // $199 plan vs $1999 "refund"
      { source: 5, target: 18, type: 'contradict' }    // "Microsoft" asking for gift cards
    ],
    stats: { nodes: 21, phases: 4, switches: 1, contradictions: 3, timeline: '2 hours' },
    phaseLabels: {
      1: { border: '#DC2626', label: 'Initial Scare' },
      2: { border: '#EA7B1E', label: 'Fake Diagnosis' },
      3: { border: '#D97706', label: 'Payment Extraction' },
      4: { border: '#DC2626', label: 'Double Extraction' }
    },
    walkthrough: {
      icon: '🖥️',
      title: 'Tech Support Scam',
      scenario: 'A browser popup warns "YOUR COMPUTER IS INFECTED" with a fake Microsoft logo. The victim calls the number and loses $1,999 in gift cards.',
      overview: 'Tech support scams use <strong>fear and fake authority</strong> to take remote control of victims\' computers. Sentinel AI detects the manufactured panic, impersonation of trusted brands, and escalating financial extraction.',
      phases: [
        { name: 'Initial Scare', color: '#DC2626', desc: 'A full-screen browser popup with alarm sounds impersonates Microsoft. The tab can\'t be closed. A phone number is prominently displayed.' },
        { name: 'Fake Diagnosis', color: '#EA7B1E', desc: 'The "technician" requests remote access via AnyDesk. Normal Windows logs are presented as critical threats. "Your bank accounts are at risk."' },
        { name: 'Payment Extraction', color: '#D97706', desc: 'A $199 "protection plan" is offered. While connected, the scammer navigates to the victim\'s banking site and stages a fake $1,999 "accidental refund."' },
        { name: 'Double Extraction', color: '#DC2626', desc: 'The victim is told to "return the overpayment" via gift cards. Guilt tactics: "I\'ll lose my job." Isolation: "Don\'t tell anyone."' }
      ],
      redFlags: ['Fake Microsoft branding', 'Request for remote access', 'Normal logs shown as threats', '"Accidental refund" scheme', 'Gift card payment demanded'],
      result: { score: '912 / 1,000', level: 'Critical', color: '#DC2626', action: 'AI agent intervenes immediately. Conversation locked. Emergency contact notified.' }
    }
  };

  // ========== 5. INVESTMENT / PIG BUTCHERING SCAM ==========
  const investmentData = {
    nodes: [
      // Phase 1: Social Approach (Week 1-2)
      { id: 1, type: 'message', label: '"Wrong number" text or LinkedIn message', phase: 1 },
      { id: 2, type: 'message', label: 'Casual conversation — lifestyle, travel', phase: 1 },
      { id: 3, type: 'media', label: 'Shares photos of luxury lifestyle', phase: 1 },
      { id: 4, type: 'message', label: '"I made my money through crypto trading"', phase: 1 },
      { id: 5, type: 'message', label: 'Mentions trading platform casually', phase: 1 },
      // Phase 2: Trust & Platform Setup (Week 3-4)
      { id: 6, type: 'switch', label: 'LinkedIn -> WhatsApp', phase: 2 },
      { id: 7, type: 'message', label: '"Let me show you how I trade"', phase: 2 },
      { id: 8, type: 'media', label: 'Screenshots of "profits" (fabricated)', phase: 2 },
      { id: 9, type: 'message', label: '"Start small — just try $500"', phase: 2 },
      { id: 10, type: 'document', label: 'Sends link to fake trading platform', phase: 2 },
      { id: 11, type: 'message', label: 'Victim deposits $500 — sees "gains"', phase: 2 },
      // Phase 3: Escalating Deposits (Week 5-8)
      { id: 12, type: 'message', label: '"You made $150! Imagine with $5,000"', phase: 3 },
      { id: 13, type: 'message', label: '"Special opportunity this week only"', phase: 3 },
      { id: 14, type: 'message', label: 'Victim deposits $5,000', phase: 3 },
      { id: 15, type: 'message', label: 'Platform shows $8,200 "balance"', phase: 3 },
      { id: 16, type: 'message', label: '"Big opportunity — put in $20,000"', phase: 3 },
      { id: 17, type: 'message', label: '"I\'m putting in $50K myself"', phase: 3 },
      { id: 18, type: 'message', label: 'Victim deposits $20,000', phase: 3 },
      { id: 19, type: 'message', label: 'Platform shows $45,000 "balance"', phase: 3 },
      // Phase 4: The Trap (Week 9+)
      { id: 20, type: 'message', label: 'Victim tries to withdraw', phase: 4 },
      { id: 21, type: 'message', label: '"You need to pay 15% tax to withdraw"', phase: 4 },
      { id: 22, type: 'document', label: 'Fake "tax form" sent', phase: 4 },
      { id: 23, type: 'message', label: '"Pay $6,750 tax to unlock your funds"', phase: 4 },
      { id: 24, type: 'message', label: 'Victim pays "tax" — nothing unlocks', phase: 4 },
      { id: 25, type: 'message', label: '"Additional verification fee required"', phase: 4 },
      { id: 26, type: 'message', label: 'Platform goes offline. Contact disappears.', phase: 4 }
    ],
    edges: [
      { source: 1, target: 2, type: 'reply' },
      { source: 2, target: 3, type: 'build' },
      { source: 3, target: 4, type: 'build' },
      { source: 4, target: 5, type: 'build' },
      { source: 5, target: 6, type: 'reply' },
      { source: 6, target: 7, type: 'reply' },
      { source: 7, target: 8, type: 'build' },
      { source: 8, target: 9, type: 'pressure' },
      { source: 9, target: 10, type: 'build' },
      { source: 10, target: 11, type: 'reply' },
      { source: 11, target: 12, type: 'reply' },
      { source: 12, target: 13, type: 'pressure' },
      { source: 13, target: 14, type: 'reply' },
      { source: 14, target: 15, type: 'build' },
      { source: 15, target: 16, type: 'pressure' },
      { source: 16, target: 17, type: 'build' },
      { source: 17, target: 18, type: 'reply' },
      { source: 18, target: 19, type: 'build' },
      { source: 19, target: 20, type: 'reply' },
      { source: 20, target: 21, type: 'pressure' },
      { source: 21, target: 22, type: 'build' },
      { source: 22, target: 23, type: 'pressure' },
      { source: 23, target: 24, type: 'reply' },
      { source: 24, target: 25, type: 'pressure' },
      { source: 25, target: 26, type: 'reply' },
      // Contradictions
      { source: 3, target: 26, type: 'contradict' },   // Luxury lifestyle vs disappears
      { source: 8, target: 19, type: 'contradict' },   // Fake profits vs can't withdraw
      { source: 11, target: 21, type: 'contradict' },   // Easy deposit vs impossible withdraw
      { source: 15, target: 26, type: 'contradict' }    // $45K balance vs platform offline
    ],
    stats: { nodes: 26, phases: 4, switches: 1, contradictions: 4, timeline: '9 weeks' },
    phaseLabels: {
      1: { border: '#27AE60', label: 'Social Approach' },
      2: { border: '#D97706', label: 'Platform Setup' },
      3: { border: '#EA7B1E', label: 'Escalating Deposits' },
      4: { border: '#DC2626', label: 'The Trap' }
    },
    walkthrough: {
      icon: '📈',
      title: 'Investment / Pig Butchering Scam',
      scenario: 'A "wrong number" text leads to a friendship, then a crypto trading opportunity. Over 9 weeks the victim deposits $25,500 into a fake platform.',
      overview: 'Pig butchering scams are the <strong>most financially devastating</strong> fraud type. The scammer "fattens" the victim with fake profits before "slaughtering" — locking funds behind fake fees. Sentinel AI detects the escalating deposit pattern and platform red flags.',
      phases: [
        { name: 'Social Approach (Weeks 1–2)', color: '#27AE60', desc: 'A casual "wrong number" text or LinkedIn message. The scammer shares luxury lifestyle photos and casually mentions crypto trading success.' },
        { name: 'Platform Setup (Weeks 3–4)', color: '#D97706', desc: 'Conversation moves to WhatsApp. The scammer demonstrates "profits" with fabricated screenshots and directs the victim to a fake trading platform. First deposit: $500.' },
        { name: 'Escalating Deposits (Weeks 5–8)', color: '#EA7B1E', desc: 'The platform shows fake gains. "Imagine with $5,000." Then $20,000. The scammer claims to be investing even more. Total deposits climb to $25,500.' },
        { name: 'The Trap (Week 9+)', color: '#DC2626', desc: 'Withdrawal blocked. "Pay 15% tax to unlock your funds." Victim pays $6,750 "tax" — nothing unlocks. Additional fees demanded. Platform goes offline.' }
      ],
      redFlags: ['Unsolicited initial contact', 'Fake trading platform', 'Fabricated profit screenshots', 'Withdrawal blocked by fees', 'Platform disappears with funds'],
      result: { score: '891 / 1,000', level: 'Critical', color: '#DC2626', action: 'AI agent intervenes. Conversation locked. Emergency contact notified. Pattern flagged to authorities.' }
    }
  };

  // Map graph names to data
  const graphDataMap = {
    legitimate: legitimateData,
    romance: romanceData,
    retail: retailData,
    techsupport: techSupportData,
    investment: investmentData
  };

  let currentGraph = 'legitimate';
  let svg, simulation;

  // ========== Walkthrough Panel ==========
  function renderWalkthrough(data) {
    const w = data.walkthrough;
    if (!w) return;

    document.getElementById('walkthroughIcon').textContent = w.icon;
    document.getElementById('walkthroughTitle').textContent = w.title;
    document.getElementById('walkthroughScenario').textContent = w.scenario;
    document.getElementById('walkthroughOverview').innerHTML = '<p>' + w.overview + '</p>';

    // Phases
    const phasesEl = document.getElementById('walkthroughPhases');
    if (w.phases.length > 0) {
      phasesEl.innerHTML = '<h4 class="walkthrough__label">How the scam unfolds</h4>' +
        w.phases.map(p =>
          '<div class="walkthrough__phase">' +
            '<div class="walkthrough__phase-marker" style="background:' + p.color + '"></div>' +
            '<div>' +
              '<strong class="walkthrough__phase-name">' + p.name + '</strong>' +
              '<p class="walkthrough__phase-desc">' + p.desc + '</p>' +
            '</div>' +
          '</div>'
        ).join('');
    } else {
      phasesEl.innerHTML = '';
    }

    // Red flags
    const statsEl = document.getElementById('walkthroughStats');
    if (w.redFlags && w.redFlags.length > 0) {
      statsEl.innerHTML = '<h4 class="walkthrough__label">Red flags detected</h4>' +
        '<div class="walkthrough__flags">' +
        w.redFlags.map(f => '<span class="walkthrough__flag">⚠ ' + f + '</span>').join('') +
        '</div>';
    } else {
      statsEl.innerHTML = '<div class="walkthrough__no-flags"><span class="walkthrough__flag walkthrough__flag--safe">✓ No red flags detected</span></div>';
    }

    // Result
    const resultEl = document.getElementById('walkthroughResult');
    resultEl.innerHTML =
      '<div class="walkthrough__result-card" style="border-left-color:' + w.result.color + '">' +
        '<div class="walkthrough__result-header">' +
          '<span class="walkthrough__result-score" style="color:' + w.result.color + '">' + w.result.score + '</span>' +
          '<span class="walkthrough__result-level" style="background:' + w.result.color + '">' + w.result.level + '</span>' +
        '</div>' +
        '<p class="walkthrough__result-action">' + w.result.action + '</p>' +
      '</div>';
  }

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
    renderWalkthrough(data);
    svg = createSvg();

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    const nodes = data.nodes.map((d, i) => ({ ...d, x: width / 2, y: height / 2 }));
    const edges = data.edges.map(d => ({ ...d }));

    const isSimple = data === legitimateData;
    const hasPhases = data.phaseLabels !== null;
    const phaseCount = hasPhases ? Object.keys(data.phaseLabels).length : 1;

    // Force simulation
    simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(isSimple ? 80 : 50))
      .force('charge', d3.forceManyBody().strength(isSimple ? -200 : -100))
      .force('collide', d3.forceCollide(isSimple ? 22 : 14));

    if (isSimple) {
      simulation.force('x', d3.forceX((d, i) => {
        return (width * 0.15) + (i / (nodes.length - 1)) * (width * 0.7);
      }).strength(0.8));
      simulation.force('y', d3.forceY(height * 0.45).strength(0.8));
    } else {
      simulation.force('x', d3.forceX(d => {
        return ((d.phase - 0.5) / phaseCount) * width;
      }).strength(0.4));
      simulation.force('y', d3.forceY(height / 2).strength(0.15));
    }

    // Phase background labels
    if (hasPhases) {
      Object.entries(data.phaseLabels).forEach(([phase, info]) => {
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
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.15s ease');

    // Edge hover: highlight + thicken
    link.on('mouseenter', function(event, d) {
      d3.select(this)
        .attr('stroke-width', edgeStyles[d.type].width + 2)
        .attr('opacity', 1);
      // Dim other edges
      link.filter(e => e !== d).attr('opacity', 0.2);
      showTooltip(event, `<strong>${d.type.charAt(0).toUpperCase() + d.type.slice(1)} Edge</strong><br>From node ${d.source.id} to node ${d.target.id}`);
    })
    .on('mouseleave', function(event, d) {
      d3.select(this)
        .attr('stroke-width', edgeStyles[d.type].width)
        .attr('opacity', 0.6);
      link.attr('opacity', 0.6);
      hideTooltip();
    });

    // Draw nodes
    const nodeR = isSimple ? 12 : 8;
    const node = g.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Node shapes
    node.each(function(d) {
      const el = d3.select(this);
      const r = nodeR;

      if (d.type === 'document') {
        el.append('rect')
          .attr('class', 'node-shape')
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
        el.append('circle')
          .attr('class', 'node-ring')
          .attr('r', r + 2)
          .attr('fill', 'none')
          .attr('stroke', nodeColors[d.type])
          .attr('stroke-width', 2);
        el.append('circle')
          .attr('class', 'node-shape')
          .attr('r', r - 1)
          .attr('fill', nodeColors[d.type]);
      } else {
        el.append('circle')
          .attr('class', 'node-shape')
          .attr('r', r)
          .attr('fill', nodeColors[d.type])
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5);
      }

      if (d.type === 'call') {
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('font-size', r * 0.8)
          .attr('fill', '#fff')
          .text('C');
      }
    });

    // Node hover: scale up + highlight connected edges, dim the rest
    node.on('mouseenter', function(event, d) {
      const el = d3.select(this);
      el.raise(); // bring to front
      el.transition().duration(150)
        .attr('transform', `translate(${d.x},${d.y}) scale(1.6)`);

      // Highlight connected edges
      link.each(function(e) {
        const isConnected = e.source.id === d.id || e.target.id === d.id;
        d3.select(this)
          .attr('opacity', isConnected ? 1 : 0.12)
          .attr('stroke-width', isConnected ? edgeStyles[e.type].width + 1.5 : edgeStyles[e.type].width);
      });

      // Dim other nodes
      node.filter(n => n !== d)
        .transition().duration(150)
        .style('opacity', function(n) {
          // Keep connected nodes brighter
          const connected = edges.some(e =>
            (e.source.id === d.id && e.target.id === n.id) ||
            (e.target.id === d.id && e.source.id === n.id)
          );
          return connected ? 0.8 : 0.25;
        });

      const typeLabel = d.type.charAt(0).toUpperCase() + d.type.slice(1);
      showTooltip(event, `<strong>${typeLabel}</strong><br>${d.label}`);
    })
    .on('mouseleave', function(event, d) {
      d3.select(this).transition().duration(150)
        .attr('transform', `translate(${d.x},${d.y}) scale(1)`);

      // Restore all edges
      link.attr('opacity', 0.6)
        .each(function(e) {
          d3.select(this).attr('stroke-width', edgeStyles[e.type].width);
        });

      // Restore all nodes
      node.transition().duration(150).style('opacity', 1);

      hideTooltip();
    });

    // Node click: show detail popup inside graph container
    node.on('click', function(event, d) {
      event.stopPropagation();
      showNodePopup(d);
    });

    // Click on background to close popup
    svg.on('click', () => closeNodePopup());

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
    const s = data.stats;
    const statsText = isSimple
      ? `${s.nodes} nodes \u00B7 Linear flow \u00B7 ${s.switches} channel switches \u00B7 ${s.contradictions} contradictions \u00B7 ${s.timeline}`
      : `${s.nodes} nodes \u00B7 ${s.phases} phases \u00B7 ${s.switches} channel switches \u00B7 ${s.contradictions} contradictions \u00B7 ${s.timeline}`;

    g.append('text')
      .attr('x', width / 2)
      .attr('y', height - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#999')
      .attr('font-size', '12px')
      .text(statsText);
  }

  // Node detail popup
  function showNodePopup(d) {
    closeNodePopup();
    const typeLabel = d.type.charAt(0).toUpperCase() + d.type.slice(1);
    const phaseLabel = d.phase ? `Phase ${d.phase}` : '';
    const color = nodeColors[d.type] || '#333';

    const popup = document.createElement('div');
    popup.id = 'nodePopup';
    popup.innerHTML = `
      <div class="node-popup__header" style="border-left: 4px solid ${color};">
        <span class="node-popup__type" style="color: ${color};">${typeLabel} Node</span>
        <button class="node-popup__close" onclick="document.getElementById('nodePopup').remove()">&times;</button>
      </div>
      <div class="node-popup__body">
        <p class="node-popup__label">${d.label}</p>
        <div class="node-popup__meta">
          <span class="node-popup__badge" style="background: ${color}20; color: ${color};">ID: ${d.id}</span>
          ${phaseLabel ? `<span class="node-popup__badge" style="background: ${color}20; color: ${color};">${phaseLabel}</span>` : ''}
          <span class="node-popup__badge" style="background: ${color}20; color: ${color};">${typeLabel}</span>
        </div>
      </div>
    `;
    container.appendChild(popup);

    // Animate in
    requestAnimationFrame(() => popup.classList.add('visible'));
  }

  function closeNodePopup() {
    const existing = document.getElementById('nodePopup');
    if (existing) existing.remove();
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
        renderGraph(graphDataMap[type]);
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

  // Fullscreen toggle
  const graphContainer = document.getElementById('graphContainer');
  const fullscreenBtn = document.getElementById('graphFullscreenBtn');
  const fullscreenLabel = fullscreenBtn.querySelector('span');
  const fullscreenIcon = fullscreenBtn.querySelector('svg');

  fullscreenBtn.addEventListener('click', () => {
    const isFullscreen = graphContainer.classList.toggle('fullscreen');
    fullscreenLabel.textContent = isFullscreen ? 'Exit' : 'Fullscreen';
    fullscreenIcon.innerHTML = isFullscreen
      ? '<path d="M4 14h6m0 0v6m0-6L3 21M20 10h-6m0 0V4m0 6l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    document.body.style.overflow = isFullscreen ? 'hidden' : '';

    // Re-render graph at new size
    if (simulation) simulation.stop();
    setTimeout(() => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      // Update the SVG viewBox to match new dimensions
      const svgEl = container.querySelector('svg');
      if (svgEl) {
        svgEl.setAttribute('width', newWidth);
        svgEl.setAttribute('height', newHeight);
        svgEl.setAttribute('viewBox', `0 0 ${newWidth} ${newHeight}`);
      }
    }, 50);
  });

  // Escape key to exit fullscreen
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && graphContainer.classList.contains('fullscreen')) {
      fullscreenBtn.click();
    }
  });

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newWidth = container.clientWidth;
      if (Math.abs(newWidth - width) > 50 && !graphContainer.classList.contains('fullscreen')) {
        location.reload();
      }
    }, 300);
  });
}

// Start
document.addEventListener('DOMContentLoaded', initDecisionGraph);

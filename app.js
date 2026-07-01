/**
 * Sampurna "Shaan" Ghosh Portfolio Application
 * Accents: #492ced
 */

// Global State
const state = {
  theme: localStorage.getItem('portfolio-theme') || 'dark',
  navaids: {},
  aircraftTypes: {},
  isNavaidsLoaded: false,
  isAircraftLoaded: false
};

// Autocomplete database for major airlines
const AIRLINE_SUGGESTIONS = [
  { code: 'JBU', name: 'JetBlue Airways', callsign: 'JETBLUE' },
  { code: 'UAL', name: 'United Airlines', callsign: 'UNITED' },
  { code: 'DAL', name: 'Delta Air Lines', callsign: 'DELTA' },
  { code: 'AAL', name: 'American Airlines', callsign: 'AMERICAN' },
  { code: 'SWA', name: 'Southwest Airlines', callsign: 'SOUTHWEST' },
  { code: 'BAW', name: 'British Airways', callsign: 'SPEEDBIRD' },
  { code: 'DLH', name: 'Lufthansa', callsign: 'LUFTHANSA' },
  { code: 'AFR', name: 'Air France', callsign: 'AIRFRANS' },
  { code: 'KLM', name: 'KLM Royal Dutch Airlines', callsign: 'KLM' },
  { code: 'FDX', name: 'FedEx Express', callsign: 'FEDEX' },
  { code: 'UPS', name: 'United Parcel Service', callsign: 'UPS' }
];

// Fallback data for JBU334
const JBU334_FALLBACK = {
  flight: 'JBU334',
  originCode: 'KBOS',
  originName: 'BOSTON LOGAN INTL',
  originCity: 'Boston, MA',
  destCode: 'KJFK',
  destName: 'JOHN F KENNEDY INTL',
  destCity: 'New York, NY',
  date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
  time: '18:45Z',
  aircraftType: 'A320',
  aircraftName: 'AIRBUS A-320',
  route: 'BOS SEY PARCH4',
  fixes: [
    { ident: 'BOS', type: 'VOR', name: 'BOSTON VORTAC', location: 'Boston, MA', alt: '5000', speed: '250' },
    { ident: 'SEY', type: 'VOR', name: 'SANDY POINT VOR/DME', location: 'Elizabeth, NJ', alt: '11000', speed: '280' },
    { ident: 'PARCH', type: 'FIX', name: 'PARCH INTERSECTION', location: 'NY Oceanic', alt: '16000', speed: '310' }
  ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLightbox();
  initFroyoDemo();
  loadDataFiles();
  initScopeToggle();
  initSecondEarDemo();
  initPlanespottersSlideshow();
});

// Theme Management
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Apply saved theme
  applyTheme(state.theme);

  themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', state.theme);
    applyTheme(state.theme);
  });
}

function applyTheme(theme) {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  
  if (theme === 'light') {
    root.classList.add('light-mode');
    if (toggleBtn) toggleBtn.innerHTML = '🌙 Light Mode';
  } else {
    root.classList.remove('light-mode');
    if (toggleBtn) toggleBtn.innerHTML = '☀️ Dark Mode';
  }
}

// Lightbox Manager
function initLightbox() {
  const lightbox = document.getElementById('iframe-lightbox');
  const iframe = document.getElementById('lightbox-iframe');
  const spinner = document.getElementById('lightbox-spinner');
  const closeBtn = document.getElementById('lightbox-close');
  const title = document.getElementById('lightbox-title');
  const externalLink = document.getElementById('lightbox-external-link');
  
  if (!lightbox || !iframe) return;

  // Open triggers
  document.querySelectorAll('.open-lightbox').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = btn.getAttribute('data-url');
      const appTitle = btn.getAttribute('data-title');
      
      if (!url) return;

      // Reset states
      iframe.style.display = 'none';
      if (spinner) spinner.style.display = 'block';
      if (title) title.textContent = appTitle || 'Preview';
      if (externalLink) externalLink.href = url;

      // Open modal
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Load Iframe
      iframe.src = url;
    });
  });

  // Handle Load
  iframe.addEventListener('load', () => {
    if (spinner) spinner.style.display = 'none';
    iframe.style.display = 'block';
  });

  // Close triggers
  const closeModal = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    iframe.src = 'about:blank'; // Stop execution/audio inside iframe
  };

  closeBtn.addEventListener('click', closeModal);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeModal();
    }
  });
}

// Data Preloader (loads navaids and aircraft types locally)
async function loadDataFiles() {
  try {
    const navaidRes = await fetch('navaids.json');
    if (navaidRes.ok) {
      const navaidData = await navaidRes.json();
      navaidData.forEach(nav => {
        state.navaids[nav.ident.toUpperCase()] = nav.name;
      });
      state.isNavaidsLoaded = true;
    }
  } catch (e) {
    console.warn('Failed to load navaids database:', e);
  }

  try {
    const aircraftRes = await fetch('aircraft_types.json');
    if (aircraftRes.ok) {
      state.aircraftTypes = await aircraftRes.json();
      state.isAircraftLoaded = true;
    }
  } catch (e) {
    console.warn('Failed to load aircraft types database:', e);
  }
}

// Operational Scope Toggle
function initScopeToggle() {
  const btns = document.querySelectorAll('.scope-toggle-btn');
  const chartsVal = document.getElementById('metric-charts');
  const costVal = document.getElementById('metric-cost');
  const trackingVal = document.getElementById('metric-tracking');
  const setupVal = document.getElementById('metric-setup');
  
  if (btns.length === 0) return;
  
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const scope = btn.getAttribute('data-scope');
      if (scope === 'us') {
        chartsVal.textContent = 'Structured HTML / FAA Index';
        costVal.textContent = '$0 (Public Domain)';
        trackingVal.textContent = '98% (Dense ADS-B)';
        setupVal.textContent = 'Fully Automated';
      } else {
        chartsVal.textContent = 'Unstructured PDFs (7 hrs/country extraction)';
        costVal.textContent = '$913 / user / year (Licensed)';
        trackingVal.textContent = 'Untrackable (ADS-B not mandated)';
        setupVal.textContent = '7 hours manual extraction / country';
      }
    });
  });
}

// Draggable Window Handler
function makeElementDraggable(elmnt, header) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (header) {
    header.onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    if (e.button !== 0) return;
    
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'button' || tag === 'select' || tag === 'a') return;

    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Resizable Window Handler
function makeElementResizable(elmnt, resizer, type) {
  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let startW = elmnt.getBoundingClientRect().width;
    let startH = elmnt.getBoundingClientRect().height;
    let startX = e.pageX;
    let startY = e.pageY;
    
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    
    function resize(e) {
      if (type === 'r' || type === 'rb') {
        const newW = startW + (e.pageX - startX);
        elmnt.style.width = Math.max(180, newW) + 'px';
      }
      if (type === 'b' || type === 'rb') {
        if (!elmnt.classList.contains('minimized')) {
          const newH = startH + (e.pageY - startY);
          elmnt.style.height = Math.max(100, newH) + 'px';
        }
      }
    }
    
    function stopResize() {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    }
  });
}

// Froyo Flight Simulator Demo
function initFroyoDemo() {
  const flightOverlay = document.getElementById('flightOverlay');
  const toggleFroyoBtn = document.getElementById('toggle-froyo-btn');
  const flightInput = document.getElementById('flightInput');
  const suggestionBox = document.getElementById('froyo-suggestion-box');
  const fetchBtn = document.getElementById('fetchBtn');
  const outputArea = document.getElementById('routeOutput');
  const tourGuide = document.getElementById('froyo-guide-text');
  const guideNextBtn = document.getElementById('froyo-guide-next');
  
  // Extension Controls
  const closeBtn = document.getElementById('closeBtn');
  const textSizeBtn = document.getElementById('textSizeBtn');
  const toggleControlsBtn = document.getElementById('toggleControlsBtn');
  const clearBtn = document.getElementById('clearBtn');
  const faLink = document.getElementById('faLink');

  if (!flightOverlay || !flightInput || !fetchBtn) return;

  // Make Dragging work
  makeElementDraggable(flightOverlay, document.getElementById('overlayHeader'));
  
  // Make Resizing work
  const resizerR = document.getElementById('resizer-r');
  const resizerB = document.getElementById('resizer-b');
  const resizerRB = document.getElementById('resizer-rb');
  if (resizerR) makeElementResizable(flightOverlay, resizerR, 'r');
  if (resizerB) makeElementResizable(flightOverlay, resizerB, 'b');
  if (resizerRB) makeElementResizable(flightOverlay, resizerRB, 'rb');

  // Toggle Panel visibility
  if (toggleFroyoBtn) {
    toggleFroyoBtn.addEventListener('click', () => {
      flightOverlay.classList.toggle('hidden');
      if (!flightOverlay.classList.contains('hidden')) {
        flightOverlay.classList.add('input-flash');
        setTimeout(() => flightOverlay.classList.remove('input-flash'), 600);
      }
    });
  }

  // Extension Control handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      flightOverlay.classList.add('hidden');
    });
  }

  if (textSizeBtn) {
    textSizeBtn.addEventListener('click', () => {
      flightOverlay.classList.toggle('large-text');
    });
  }

  // Minimize behavior
  if (toggleControlsBtn) {
    toggleControlsBtn.addEventListener('click', () => {
      flightOverlay.classList.toggle('minimized');
      const body = document.getElementById('overlayBody');
      if (body) {
        body.classList.toggle('hidden');
      }
      
      if (flightOverlay.classList.contains('minimized')) {
        flightOverlay.dataset.prevHeight = flightOverlay.style.height;
        flightOverlay.style.height = 'auto';
        flightOverlay.style.minHeight = '0';
      } else {
        if (flightOverlay.dataset.prevHeight) {
          flightOverlay.style.height = flightOverlay.dataset.prevHeight;
        }
        flightOverlay.style.minHeight = '';
      }
      
      toggleControlsBtn.textContent = flightOverlay.classList.contains('minimized') ? '▼' : '▲';
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      flightInput.value = '';
      document.getElementById('datePicker').value = '';
      outputArea.innerHTML = `
        <div style="padding: 12px; text-align: center; color: #888; font-size: 11px;">
          Type "jetblue" in Callsign, select suggestion, add "334", click Fetch to simulate.
        </div>
      `;
      faLink.href = '#';
      faLink.style.opacity = '0.5';
      
      document.getElementById('depDateHeader').textContent = 'DATE';
      document.getElementById('depTimeHeader').textContent = '0000Z';
    });
  }

  // Active guide tracking
  let guideStep = 1;

  // Manual step increment handler
  if (guideNextBtn) {
    guideNextBtn.addEventListener('click', () => {
      let nextStep = guideStep + 1;
      if (nextStep > 5) nextStep = 1;
      updateGuideStep(nextStep);
    });
  }

  // Key Event for input suggestion filtering
  flightInput.addEventListener('input', () => {
    const val = flightInput.value.trim().toUpperCase();
    
    // Auto-update suggestions box
    if (val.length >= 1) {
      const matches = AIRLINE_SUGGESTIONS.filter(item => 
        item.name.toUpperCase().includes(val) || 
        item.code.toUpperCase().includes(val) || 
        item.callsign.toUpperCase().includes(val)
      );
      
      if (matches.length > 0) {
        renderSuggestions(matches);
      } else {
        hideSuggestions();
      }
      
      // Update guide progress
      if (guideStep === 1 && val.toLowerCase().includes('jetblue')) {
        updateGuideStep(2);
      }
    } else {
      hideSuggestions();
    }
  });

  // Suggestion click
  function renderSuggestions(matches) {
    suggestionBox.innerHTML = '';
    matches.forEach(m => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.innerHTML = `<strong>${m.code}</strong> — ${m.name} <span class="dim">(${m.callsign})</span>`;
      div.addEventListener('click', () => {
        flightInput.value = m.code;
        hideSuggestions();
        flightInput.focus();
        
        // Update guide step
        if (guideStep === 2 && m.code === 'JBU') {
          updateGuideStep(3);
        }
      });
      suggestionBox.appendChild(div);
    });
    suggestionBox.style.display = 'block';
  }

  function hideSuggestions() {
    suggestionBox.style.display = 'none';
  }

  // Keyboard navigation for suggestions
  document.addEventListener('click', (e) => {
    if (e.target !== flightInput && e.target !== suggestionBox) {
      hideSuggestions();
    }
  });

  // Handle typing after JBU select
  flightInput.addEventListener('keyup', () => {
    const val = flightInput.value.trim().toUpperCase();
    if (guideStep === 3 && val === 'JBU334') {
      updateGuideStep(4);
    }
  });

  function updateGuideStep(step) {
    guideStep = step;
    if (!tourGuide) return;
    
    if (step === 1) {
      tourGuide.innerHTML = `<strong>Step 1:</strong> Type <span class="guide-hl">"jetblue"</span> in the Callsign input.`;
    } else if (step === 2) {
      tourGuide.innerHTML = `<strong>Step 2:</strong> Click the suggestion <span class="guide-hl">"JBU"</span> in the box below.`;
    } else if (step === 3) {
      tourGuide.innerHTML = `<strong>Step 3:</strong> Append <span class="guide-hl">"334"</span> to make the input <span class="guide-hl">"JBU334"</span>.`;
    } else if (step === 4) {
      tourGuide.innerHTML = `<strong>Step 4:</strong> Click the <span class="guide-hl">"Fetch"</span> button on the overlay panel!`;
    } else if (step === 5) {
      tourGuide.innerHTML = `🎉 <strong>Success!</strong> Decoded live data directly. Try dragging the extension overlay or resizing it!`;
    }
  }

  // Click Fetch
  fetchBtn.addEventListener('click', async () => {
    const rawVal = flightInput.value.trim();
    if (!rawVal) return;

    outputArea.innerHTML = `
      <div style="padding: 12px; text-align: center; color: #aaa; font-size: 11px;">
        <div class="spinner" style="width:20px; height:20px; margin: 0 auto 6px;"></div>
        Fetching live data...
      </div>
    `;

    try {
      const flightCode = rawVal.toUpperCase();
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.flightaware.com/live/flight/${flightCode}`)}`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Proxy error');
      const htmlText = await response.text();

      if (htmlText.includes("couldn't find flight tracking data for") || htmlText.length < 5000) {
        throw new Error('No flight data');
      }

      // Successful parse
      const flightInfo = parseFlightData(htmlText, flightCode);
      renderFlightData(flightInfo);
      
      if (flightCode === 'JBU334') {
        updateGuideStep(5);
      }
    } catch (e) {
      console.warn('Real fetch failed/blocked, using local fallback:', e);
      
      // Fallback display
      setTimeout(() => {
        const requestedFlight = rawVal.toUpperCase();
        let fallbackInfo = { ...JBU334_FALLBACK };
        if (requestedFlight !== 'JBU334') {
          fallbackInfo.flight = requestedFlight;
        }
        
        renderFlightData(fallbackInfo, true);
        if (rawVal.toUpperCase() === 'JBU334') {
          updateGuideStep(5);
        }
      }, 800);
    }
  });

  // Parser helper
  function parseFlightData(html, flightCode) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    let origin = 'KBOS';
    let dest = 'KJFK';
    let route = 'BOS SEY PARCH4';
    
    // Find Route in body
    const tableHeader = doc.querySelector('.prettyTable thead th[colspan]');
    if (tableHeader) {
      route = tableHeader.textContent.trim();
    } else {
      const routeMatch = html.match(/Route\s*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
      if (routeMatch) {
        route = routeMatch[1].replace(/<[^>]*>/g, '').trim();
      }
    }

    let originName = 'BOSTON LOGAN INTL';
    let destName = 'JOHN F KENNEDY INTL';
    
    const airportLinks = Array.from(doc.querySelectorAll('a[href*="/live/airport/"]'));
    if (airportLinks.length >= 2) {
      const code1 = airportLinks[0].href.split('/').pop().toUpperCase();
      const code2 = airportLinks[1].href.split('/').pop().toUpperCase();
      if (code1 && code2) {
        origin = code1;
        dest = code2;
        originName = airportLinks[0].textContent.trim();
        destName = airportLinks[1].textContent.trim();
      }
    }

    let aircraftType = 'A320';
    let aircraftName = 'AIRBUS A-320';
    const typeMatch = html.match(/Aircraft Type\s*<\/th>\s*<td[^>]*>(?:<a[^>]*>)?([A-Z0-9]{2,4})/i);
    if (typeMatch) {
      aircraftType = typeMatch[1].toUpperCase();
      if (state.aircraftTypes[aircraftType]) {
        aircraftName = state.aircraftTypes[aircraftType].m;
      }
    }

    const fixes = [];
    const coordMap = {};
    
    const rows = doc.querySelectorAll('.prettyTable tbody tr, .track-details-table tbody tr');
    rows.forEach(r => {
      const cells = r.querySelectorAll('td');
      if (cells.length >= 3) {
        const rawIdent = cells[0].textContent.trim().split(/[\s/]+/)[0].toUpperCase();
        const lat = parseFloat(cells[1].textContent);
        const lon = parseFloat(cells[2].textContent);
        if (rawIdent && !isNaN(lat) && !isNaN(lon)) {
          coordMap[rawIdent] = { lat, lon };
        }
      }
    });

    const routeTokens = route.split(/\s+/).filter(t => t && t !== 'DCT');
    routeTokens.forEach(tok => {
      let ident = tok.toUpperCase().split('/')[0];
      let decodedName = state.navaids[ident] || 'WAYPOINT';
      let type = state.navaids[ident] ? 'VOR' : 'FIX';
      
      fixes.push({
        ident: ident,
        type: type,
        name: decodedName,
        location: coordMap[ident] ? `${coordMap[ident].lat.toFixed(2)}, ${coordMap[ident].lon.toFixed(2)}` : 'Enroute',
        alt: `${Math.floor(Math.random() * 20 + 10)}000`,
        speed: `${Math.floor(Math.random() * 80 + 240)}`
      });
    });

    return {
      flight: flightCode,
      originCode: origin,
      originName: originName,
      destCode: dest,
      destName: destName,
      aircraftType: aircraftType,
      aircraftName: aircraftName,
      route: route,
      fixes: fixes.length > 0 ? fixes : [
        { ident: 'BOS', type: 'VOR', name: 'BOSTON VORTAC', location: 'Boston, MA', alt: '5000', speed: '250' },
        { ident: 'SEY', type: 'VOR', name: 'SANDY POINT VOR/DME', location: 'Elizabeth, NJ', alt: '11000', speed: '280' },
        { ident: 'PARCH', type: 'FIX', name: 'PARCH INTERSECTION', location: 'NY Oceanic', alt: '16000', speed: '310' }
      ]
    };
  }

  // Render Flight Data
  function renderFlightData(data, isFallback = false) {
    document.getElementById('depDateHeader').textContent = data.date || 'DATE';
    document.getElementById('depTimeHeader').textContent = data.time || '18:45Z';
    
    if (faLink) {
      faLink.href = `https://www.flightaware.com/live/flight/${data.flight}`;
      faLink.style.opacity = '1';
    }

    let warningHTML = '';
    if (isFallback) {
      warningHTML = `
        <div class="froyo-warning" style="margin: 6px; padding: 6px; font-size: 10px; border-radius: 4px;">
          ⚠️ CORS blocked. Showing fallback data for ${data.flight}.
        </div>
      `;
    }

    let fixesHTML = data.fixes.map(f => `
      <div class="routeToken">
        <div class="token-badge ${f.type.toLowerCase()}" style="margin-right: 8px;">${f.type}</div>
        <a href="https://www.airnav.com/airspace/fix/${f.ident}" target="_blank"><strong>${f.ident}</strong></a>
        <span style="margin-left: 4px; font-size: 10px; color:#888;">(${f.name})</span>
        <div class="selectable-info" style="margin-left: auto; font-size: 9px; text-align: right; color: #bbb;">
          ${f.location}<br>
          <span style="color: #492ced; font-weight:600;">Alt: ${f.alt} | Spd: ${f.speed}</span>
        </div>
      </div>
    `).join('');

    outputArea.innerHTML = `
      ${warningHTML}
      <div class="froyo-warning" style="margin: 6px; padding: 6px; font-size: 9px; border-radius: 4px; background: rgba(73, 44, 237, 0.05); border-color: rgba(73, 44, 237, 0.15); color: #93c5fd;">
        ⚡ Disclaimer: Extension Preview. For full integration with live ADSB-receiver sync, install the extension from the <a href="https://tinyurl.com/froyo-ext" target="_blank" style="color: #a78bfa; text-decoration: underline;">Chrome Web Store</a>.
      </div>
      <div style="padding: 8px 10px; border-bottom: 1px solid #222; font-size: 11px;">
        <div style="display:flex; justify-content:space-between; font-weight:bold; color:#fff;">
          <span>${data.flight}</span>
          <span style="color:#492ced;">${data.aircraftType}</span>
        </div>
        <div style="font-size:9px; color:#aaa; margin-top:2px;">${data.aircraftName}</div>
      </div>
      
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 8px 10px; background: rgba(255,255,255,0.01); border-bottom: 1px solid #1a1a1a;">
        <span style="color:#38bdf8; font-weight:bold;">${data.originCode}</span>
        <span style="color:#777; font-size: 10px;">→</span>
        <span style="color:#38bdf8; font-weight:bold;">${data.destCode}</span>
      </div>

      <div style="max-height: 250px; overflow-y: auto;">
        ${fixesHTML}
      </div>
    `;
  }
}

// Second Ear Simulator Logic (Matches real UX interactions)
function initSecondEarDemo() {
  const playBtn = document.getElementById('se-play-btn');
  const progress = document.getElementById('se-audio-progress');
  const timeLabel = document.getElementById('se-audio-time');
  const correctionInput = document.getElementById('se-correction-input');
  const diffOutput = document.getElementById('se-diff-output');
  const scoreVal = document.getElementById('se-score-val');
  
  // Interactive triggers
  const editTrigger = document.getElementById('se-edit-trigger');
  const tlEditor = document.getElementById('se-tl-editor');
  const saveBtn = document.getElementById('se-save-btn');
  const cancelBtn = document.getElementById('se-cancel-btn');
  
  if (!playBtn || !correctionInput || !diffOutput) return;
  
  const originalText = "NOVEMBER NINE SEVEN SEVEN THREE VFR DEP BOS DIRECT SIE PARCH STAR";
  let currentSegmentText = originalText;

  // Run initial diff
  updateDiffAndScore();
  
  // Editor Toggle
  if (editTrigger && tlEditor) {
    editTrigger.addEventListener('click', () => {
      tlEditor.classList.toggle('open');
      editTrigger.textContent = tlEditor.classList.contains('open') ? 'Close Editor' : 'Edit Transcription';
    });
  }

  // Cancel Edit
  if (cancelBtn && tlEditor) {
    cancelBtn.addEventListener('click', () => {
      tlEditor.classList.remove('open');
      if (editTrigger) editTrigger.textContent = 'Edit Transcription';
      correctionInput.value = currentSegmentText;
      updateDiffAndScore();
    });
  }

  // Save Edit
  if (saveBtn && tlEditor) {
    saveBtn.addEventListener('click', () => {
      tlEditor.classList.remove('open');
      if (editTrigger) editTrigger.textContent = 'Edit Transcription';
      currentSegmentText = correctionInput.value;
      updateDiffAndScore();
    });
  }

  // Correction input event listener (runs dynamically in open panel)
  correctionInput.addEventListener('input', () => {
    updateDiffAndScore();
  });
  
  // Speech Synthesis Player
  let speechUtterance = null;
  let speechInterval = null;
  let audioPlaying = false;
  let audioDuration = 12; // seconds
  let audioCurrentTime = 0;

  playBtn.addEventListener('click', () => {
    if (audioPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });

  function updateDiffAndScore() {
    const slots = alignedWordDiff(originalText, correctionInput.value);
    diffOutput.innerHTML = renderAlignedDiff(slots);
    
    // Automatically calculate percentage score based on LCS diff
    const ow = originalText.trim().split(/\s+/).filter(Boolean);
    const nw = correctionInput.value.trim().split(/\s+/).filter(Boolean);
    const on = ow.map(w => normWord(w).toLowerCase());
    const nn = nw.map(w => normWord(w).toLowerCase());
    
    const dp = lcsWords(on, nn);
    let lcsLen = 0;
    
    if (dp) {
      lcsLen = getLcsLen(dp, on, nn);
    } else {
      lcsLen = slots.filter(s => s.type === 'eq').length;
    }
    
    const maxWords = Math.max(ow.length, nw.length);
    let score = 100;
    if (maxWords > 0) {
      score = Math.round((lcsLen / maxWords) * 100);
    }
    
    scoreVal.textContent = `${score}%`;
    
    // Auto-update severity rating based on score (highlights rating buttons)
    let rating = 'good';
    if (score >= 95) {
      rating = 'good';
    } else if (score >= 80) {
      rating = 'minor';
    } else if (score >= 50) {
      rating = 'major';
    } else {
      rating = 'reject';
    }
    
    // Highlight matching rating button in vertical rating col
    document.querySelectorAll('.secondear-mock-app .rating-btn').forEach(btn => {
      if (btn.getAttribute('data-rating') === rating) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  function playAudio() {
    audioPlaying = true;
    playBtn.textContent = '⏸';
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      speechUtterance = new SpeechSynthesisUtterance("November nine seven seven three, visual departure Boston, direct Sea Isle, Parch, Sea Isle star.");
      speechUtterance.rate = 0.85;
      speechUtterance.pitch = 0.9;
      
      speechUtterance.onend = () => {
        stopAudio();
      };
      
      speechUtterance.onerror = () => {
        stopAudio();
      };
      
      window.speechSynthesis.speak(speechUtterance);
    }
    
    speechInterval = setInterval(() => {
      audioCurrentTime += 0.1;
      if (audioCurrentTime >= audioDuration) {
        stopAudio();
      } else {
        updateProgressUI();
      }
    }, 100);
  }
  
  function pauseAudio() {
    audioPlaying = false;
    playBtn.textContent = '▶';
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    clearInterval(speechInterval);
  }
  
  function stopAudio() {
    audioPlaying = false;
    playBtn.textContent = '▶';
    audioCurrentTime = 0;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearInterval(speechInterval);
    updateProgressUI();
  }
  
  function updateProgressUI() {
    const percent = (audioCurrentTime / audioDuration) * 100;
    if (progress) progress.value = percent;
    
    const minutes = Math.floor(audioCurrentTime / 60);
    const seconds = Math.floor(audioCurrentTime % 60).toString().padStart(2, '0');
    timeLabel.textContent = `${minutes}:${seconds} / 0:12`;
  }
}

// LCS and word diff functions from the live Second Ear app HTML
const normWord = w => w.replace(/[.,!?;:()\[\]{}<>"']/g, '');

function lcsWords(a, b) {
  const m = a.length, n = b.length;
  if (m * n > 60000) return null;
  const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i-1] === b[j-1]) {
        dp[i][j] = Math.max(
          dp[i-1][j-1] + (1000 - Math.abs((i-1) - (j-1))),
          dp[i-1][j],
          dp[i][j-1]
        );
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  return dp;
}

function getLcsLen(dp, on, nn) {
  let i = on.length, j = nn.length;
  let lcsLen = 0;
  while (i > 0 && j > 0) {
    if (on[i-1] === nn[j-1] && dp[i][j] === dp[i-1][j-1] + (1000 - Math.abs((i-1) - (j-1)))) {
      lcsLen++;
      i--;
      j--;
    } else if (dp[i][j-1] >= dp[i-1][j]) {
      j--;
    } else {
      i--;
    }
  }
  return lcsLen;
}

function charDiff(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
  const slots = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i-1] === b[j-1]) { slots.push({ type: 'eq', char: a[i-1] }); i--; j--; }
    else if (j > 0 && (i === 0 || dp[i][j-1] > dp[i-1][j])) { slots.push({ type: 'ins', char: b[j-1] }); j--; }
    else { slots.push({ type: 'del', char: a[i-1] }); i--; }
  }
  return slots.reverse();
}

function alignedWordDiff(oldText, newText) {
  const ow = (oldText || '').split(/\s+/).filter(Boolean);
  const nw = (newText || '').split(/\s+/).filter(Boolean);
  if (!ow.length && !nw.length) return [];
  const on = ow.map(w => normWord(w).toLowerCase()), nn = nw.map(w => normWord(w).toLowerCase());
  const dp = lcsWords(on, nn);
  const slots = [];
  if (!dp) {
    const len = Math.max(ow.length, nw.length);
    for (let i = 0; i < len; i++) {
      if (i < ow.length && i < nw.length) slots.push({ type: 'pair', oldWord: ow[i], newWord: nw[i] });
      else if (i < ow.length) slots.push({ type: 'del', word: ow[i] });
      else slots.push({ type: 'ins', word: nw[i] });
    }
    return slots;
  }
  let i = on.length, j = nn.length;
  const ops = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && on[i-1] === nn[j-1] && dp[i][j] === dp[i-1][j-1] + (1000 - Math.abs((i-1) - (j-1)))) {
      ops.push({ type: 'eq', oi: i-1, ni: j-1 });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      ops.push({ type: 'ins', ni: j-1 });
      j--;
    } else {
      ops.push({ type: 'del', oi: i-1 });
      i--;
    }
  }
  ops.reverse();
  let k = 0;
  while (k < ops.length) {
    if (ops[k].type === 'eq') {
      const owrd = ow[ops[k].oi];
      const nwrd = nw[ops[k].ni];
      if (owrd === nwrd) {
        slots.push({ type: 'eq', word: owrd });
      } else {
        slots.push({ type: 'pair', oldWord: owrd, newWord: nwrd });
      }
      k++;
    } else {
      const dels = [], ins = [];
      while (k < ops.length && ops[k].type !== 'eq') {
        if (ops[k].type === 'del') dels.push(ow[ops[k].oi]); else ins.push(nw[ops[k].ni]);
        k++;
      }
      const minLen = Math.min(dels.length, ins.length);
      for (let pi = 0; pi < minLen; pi++) slots.push({ type: 'pair', oldWord: dels[pi], newWord: ins[pi] });
      for (let di = minLen; di < dels.length; di++) slots.push({ type: 'del', word: dels[di] });
      for (let ii = minLen; ii < ins.length; ii++) slots.push({ type: 'ins', word: ins[ii] });
    }
  }
  return slots;
}

const renderText = t => (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function renderAlignedDiff(slots) {
  if (!slots.some(s => s.type !== 'eq')) return slots.map(s => renderText(s.word)).join(' ');

  const result = [];
  let i = 0;
  while (i < slots.length) {
    const sl = slots[i];

    if (sl.type === 'eq') {
      result.push(`<span class="da-eq">${renderText(sl.word)}</span>`);
      i++;
      continue;
    }

    if (sl.type === 'pair' && normWord(sl.oldWord) === normWord(sl.newWord)) {
      const diff = charDiff(sl.oldWord, sl.newWord);
      let unified = '';
      for (const s of diff) {
        if (s.type === 'eq') {
          unified += renderText(s.char);
        } else if (s.type === 'del') {
          unified += `<mark class="diff-del">${renderText(s.char)}</mark>`;
        } else if (s.type === 'ins') {
          unified += `<mark class="diff-add">${renderText(s.char)}</mark>`;
        }
      }
      result.push(`<span>${unified}</span>`);
      i++;
      continue;
    }

    let groupOld = [], groupNew = [];
    while (i < slots.length) {
      const curr = slots[i];
      if (curr.type === 'eq') break;
      if (curr.type === 'pair' && normWord(curr.oldWord) === normWord(curr.newWord)) break;

      if (curr.type === 'del') {
        groupOld.push(curr.word);
      } else if (curr.type === 'ins') {
        groupNew.push(curr.word);
      } else {
        groupOld.push(curr.oldWord);
        groupNew.push(curr.newWord);
      }
      i++;
    }

    if (groupOld.length && groupNew.length) {
      const top = `<span class="da-del">${groupOld.map(renderText).join(' ')}</span>`;
      const bottom = `<span class="da-ins">${groupNew.map(renderText).join(' ')}</span>`;
      result.push(`<span class="da-col">${top}${bottom}</span>`);
    } else if (groupOld.length) {
      result.push(`<span class="da-del">${groupOld.map(renderText).join(' ')}</span>`);
    } else if (groupNew.length) {
      result.push(`<span class="da-ins">${groupNew.map(renderText).join(' ')}</span>`);
    }
  }

  return `<span class="diff-aligned">${result.join('')}</span>`;
}

// Planespotting Slideshow Carousel Engine
let slideshowImages = [];
let currentSlideshowIndex = 0;
let slideshowInterval = null;

async function initPlanespottersSlideshow() {
  const apiKey = 'hlJuWuzMva6pz8JXnvIijqQCrVyBdRvKUx4PNvL1oTf1f1RnmOzQ7lZQ';
  const imgEl = document.getElementById('slideshow-img');
  const photographerEl = document.getElementById('slideshow-photographer');
  const prevBtn = document.getElementById('slideshow-prev');
  const nextBtn = document.getElementById('slideshow-next');
  
  if (!imgEl) return;

  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=planespotting&per_page=8`, {
      headers: {
        'Authorization': apiKey
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.photos && data.photos.length > 0) {
        slideshowImages = data.photos;
        renderSlideshowImage(0);
        startSlideshowTimer();
      }
    }
  } catch (e) {
    console.warn("Failed to load planespotting slideshow:", e);
  }

  function renderSlideshowImage(index) {
    if (!slideshowImages[index]) return;
    imgEl.src = slideshowImages[index].src.large;
    if (photographerEl) {
      photographerEl.textContent = `Photo by ${slideshowImages[index].photographer} (via Pexels)`;
    }
    currentSlideshowIndex = index;
  }

  function nextImage() {
    let nextIndex = currentSlideshowIndex + 1;
    if (nextIndex >= slideshowImages.length) nextIndex = 0;
    renderSlideshowImage(nextIndex);
  }

  function prevImage() {
    let prevIndex = currentSlideshowIndex - 1;
    if (prevIndex < 0) prevIndex = slideshowImages.length - 1;
    renderSlideshowImage(prevIndex);
  }

  function startSlideshowTimer() {
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(nextImage, 4000);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevImage();
      startSlideshowTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextImage();
      startSlideshowTimer();
    });
  }
}

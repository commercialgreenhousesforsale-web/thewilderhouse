/**
 * FORSYTH GHOST TOUR — V2.2 FIELD HARDENED ENGINE WITH NARRATOR CHOICE
 * GPS-triggered audio for self-guided walking tour
 * Cloudflare Pages deployment
 */

// ===== GLOBAL STATE =====

let state = 'IDLE';
let currentStop = null;
let audio = new Audio();
let positionBuffer = [];
let lastTriggerTime = 0;
let gpsConfidence = 0;
let tourData = null;
let watchId = null;
let selectedNarrator = null; // 'havoc' or 'grandma_rachel'

const CONFIG = {
  APPROACH_MULTIPLIER: 1.8,
  CONFIRM_SAMPLES: 6,
  CONFIRM_THRESHOLD: 0.72,
  MIN_SPEED: 1.5,
  COOLDOWN: 10000,
  GPS_STALE_LIMIT: 12000,
  GPS_SEARCH_INTERVAL: 3000,
  GPS_LOCK_INTERVAL: 1000
};

// ===== NARRATOR CONFIGURATION =====

const NARRATORS = {
  havoc: {
    name: 'Havoc',
    description: 'Deep Southern Gothic, Gritty, Haunting',
    voiceId: 'dtVZnErhiiosqofxDzSH',
    model: 'turbo-v2-5',
    key: 'havoc'
  },
  grandma_rachel: {
    name: 'Grandma Rachel',
    description: 'Wise Southern Senior, Warm Companion',
    voiceId: '0rEo3eAjssGDUCXHYENf',
    model: 'turbo-v2-5',
    key: 'grandma_rachel'
  }
};

// ===== CHARACTER VOICES =====

const CHARACTER_VOICES = {
  mary_telfair: {
    name: 'Grace',
    voiceId: '0lyV68Aacjmcsjj9LO1q',
    character: 'Mary Telfair'
  },
  lottie: {
    name: 'Savannah',
    voiceId: 'I571sUNz6E53D5YaJgVg',
    character: 'Lottie'
  },
  wally: {
    name: 'Mason',
    voiceId: 'dxdOayhnd0jLtELGeNtF',
    character: 'Wally'
  },
  soldier: {
    name: 'Matthew Schmitz',
    voiceId: 'Q4oILuo4P8VeXtE6FMLI',
    character: 'Soldier'
  },
  river_merchant: {
    name: 'Elderon',
    voiceId: 'NwyAvGnfbFoNNEi4UuTq',
    character: 'River Merchant'
  }
};

// ===== DOM ELEMENTS =====

const statusEl = document.getElementById('status');
const stopNameEl = document.getElementById('stopName');
const stopDistanceEl = document.getElementById('stopDistance');
const narrationTextEl = document.getElementById('narrationText');
const errorContainerEl = document.getElementById('errorContainer');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const replayBtn = document.getElementById('replayBtn');
const progressFillEl = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

// ===== STATE MACHINE =====

function setState(newState) {
  state = newState;
  const narratorName = selectedNarrator ? NARRATORS[selectedNarrator].name : 'Selecting...';
  statusEl.textContent = `STATE: ${state} | Narrator: ${narratorName} | GPS: ${(gpsConfidence * 100).toFixed(0)}%`;
  console.log(`[STATE] ${newState} | Narrator: ${narratorName}`);
}

// ===== NARRATOR CHOICE SCREEN =====

function showNarratorChoice() {
  // Hide main app temporarily
  document.querySelector('.main-content').style.display = 'none';

  // Create choice overlay
  const choiceOverlay = document.createElement('div');
  choiceOverlay.id = 'narrator-choice-overlay';
  choiceOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #0a0805 0%, #1a1410 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
    box-sizing: border-box;
  `;

  const title = document.createElement('h1');
  title.textContent = 'Forsyth Ghost Tour';
  title.style.cssText = `
    color: #e7c389;
    font-size: 32px;
    margin-bottom: 8px;
    text-align: center;
    font-family: Georgia, serif;
  `;

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Savannah Remembers';
  subtitle.style.cssText = `
    color: #8b7d60;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 40px;
    text-align: center;
    font-family: Georgia, serif;
  `;

  const prompt = document.createElement('p');
  prompt.textContent = 'Choose Your Narrator';
  prompt.style.cssText = `
    color: #d4c5a9;
    font-size: 18px;
    margin-bottom: 30px;
    text-align: center;
    font-family: Georgia, serif;
  `;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = `
    display: flex;
    gap: 20px;
    flex-direction: column;
    max-width: 400px;
    width: 100%;
  `;

  // Havoc Button
  const havocBtn = document.createElement('button');
  havocBtn.style.cssText = `
    background: rgba(232, 201, 106, 0.15);
    border: 2px solid rgba(232, 201, 106, 0.3);
    color: #e7c389;
    padding: 20px;
    border-radius: 6px;
    cursor: pointer;
    font-family: Georgia, serif;
    font-size: 16px;
    transition: all 0.3s ease;
  `;
  havocBtn.innerHTML = `
    <div style="font-weight: bold;">HAVOC</div>
    <div style="font-size: 12px; color: #8b7d60; margin-top: 6px;">Deep Southern Gothic • Gritty • Haunting</div>
  `;
  havocBtn.onmouseover = () => havocBtn.style.background = 'rgba(232, 201, 106, 0.25)';
  havocBtn.onmouseout = () => havocBtn.style.background = 'rgba(232, 201, 106, 0.15)';
  havocBtn.onclick = () => selectNarrator('havoc', choiceOverlay);

  // Grandma Rachel Button
  const rachelBtn = document.createElement('button');
  rachelBtn.style.cssText = `
    background: rgba(232, 201, 106, 0.15);
    border: 2px solid rgba(232, 201, 106, 0.3);
    color: #e7c389;
    padding: 20px;
    border-radius: 6px;
    cursor: pointer;
    font-family: Georgia, serif;
    font-size: 16px;
    transition: all 0.3s ease;
  `;
  rachelBtn.innerHTML = `
    <div style="font-weight: bold;">GRANDMA RACHEL</div>
    <div style="font-size: 12px; color: #8b7d60; margin-top: 6px;">Wise Southern Senior • Warm Companion</div>
  `;
  rachelBtn.onmouseover = () => rachelBtn.style.background = 'rgba(232, 201, 106, 0.25)';
  rachelBtn.onmouseout = () => rachelBtn.style.background = 'rgba(232, 201, 106, 0.15)';
  rachelBtn.onclick = () => selectNarrator('grandma_rachel', choiceOverlay);

  buttonsContainer.appendChild(havocBtn);
  buttonsContainer.appendChild(rachelBtn);

  choiceOverlay.appendChild(title);
  choiceOverlay.appendChild(subtitle);
  choiceOverlay.appendChild(prompt);
  choiceOverlay.appendChild(buttonsContainer);

  document.body.appendChild(choiceOverlay);
}

function selectNarrator(narratorKey, choiceOverlay) {
  selectedNarrator = narratorKey;
  const narrator = NARRATORS[narratorKey];

  console.log(`[NARRATOR] Selected: ${narrator.name} (${narrator.voiceId})`);

  // Remove choice overlay
  choiceOverlay.remove();

  // Show main app
  document.querySelector('.main-content').style.display = 'flex';

  // Start GPS
  setState('INITIALIZING');
  startGPS();

  // Update UI
  stopNameEl.textContent = narrator.name;
  stopDistanceEl.textContent = narrator.description;
}

// ===== INITIALIZATION =====

async function init() {
  // Show narrator choice first
  showNarratorChoice();

  // Load tour data
  try {
    const response = await fetch('/data/tour.json');
    tourData = await response.json();
    console.log(`[INIT] Loaded ${tourData.stops.length} stops`);
  } catch (err) {
    console.error('[INIT] Failed to load tour data:', err);
    showError('Failed to load tour data. Check your connection.');
    return;
  }

  // Attach audio controls
  attachAudioControls();
}

// ===== GPS ENGINE =====

function startGPS() {
  setState('SEARCHING');

  if (!navigator.geolocation) {
    showError('GPS not available on this device.');
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    handlePosition,
    handleGPSError,
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 5000
    }
  );
}

function handlePosition(pos) {
  const { latitude, longitude, speed, accuracy } = pos.coords;
  const now = Date.now();

  // Detect GPS freeze
  if (pos.timestamp && now - pos.timestamp > CONFIG.GPS_STALE_LIMIT) {
    setState('RECOVERY');
    recoverGPS();
    return;
  }

  // Add position to smoothing buffer
  positionBuffer.push({ latitude, longitude, accuracy, timestamp: now });

  if (positionBuffer.length > CONFIG.CONFIRM_SAMPLES) {
    positionBuffer.shift();
  }

  // Calculate average position
  const avgPos = getAveragePosition(positionBuffer);
  const nearestStop = findNearestStop(avgPos.latitude, avgPos.longitude);

  if (!nearestStop) return;

  const distance = getDistance(
    avgPos.latitude,
    avgPos.longitude,
    nearestStop.lat,
    nearestStop.lng
  );

  const inRadius = distance < nearestStop.radius;
  const inApproach = distance < nearestStop.radius * CONFIG.APPROACH_MULTIPLIER;
  const movingSlow = !speed || speed < CONFIG.MIN_SPEED;

  // ===== APPROACHING STATE =====
  if (state === 'SEARCHING' && inApproach && !inRadius) {
    setState('APPROACHING');
    preloadAudio(nearestStop, 'on');
    updateStopDisplay(nearestStop, distance);
    return;
  }

  // ===== CONFIRMATION STATE =====
  if (state === 'SEARCHING' && inRadius) {
    setState('CONFIRMING');

    gpsConfidence = calculateConfidence(positionBuffer, nearestStop);

    if (gpsConfidence > CONFIG.CONFIRM_THRESHOLD && movingSlow) {
      triggerStop(nearestStop);
    } else {
      setState('SEARCHING');
    }
  }

  // Update display
  if (state === 'SEARCHING' || state === 'APPROACHING') {
    updateStopDisplay(nearestStop, distance);
  }
}

function handleGPSError(err) {
  console.error('[GPS ERROR]', err);
  showError(`GPS Error: ${err.message}`);
}

// ===== CONFIDENCE CALCULATION =====

function calculateConfidence(buffer, stop) {
  let stablePoints = 0;

  for (let point of buffer) {
    const d = getDistance(point.latitude, point.longitude, stop.lat, stop.lng);
    if (d < stop.radius) {
      stablePoints++;
    }
  }

  return stablePoints / buffer.length;
}

// ===== STOP TRIGGER =====

function triggerStop(stop) {
  const now = Date.now();

  if (now - lastTriggerTime < CONFIG.COOLDOWN) {
    console.log('[TRIGGER] Cooldown active, skipping');
    return;
  }

  currentStop = stop;
  lastTriggerTime = now;

  setState('LOCKED');
  updateStopDisplay(stop, 0);

  playAudio(stop, 'on');
}

// ===== AUDIO ENGINE =====

function playAudio(stop, mode) {
  const audioFile = stop.audio[mode];

  if (!audioFile) {
    console.warn('[AUDIO] No audio file for mode:', mode);
    return;
  }

  audio.src = `/audio/${audioFile}`;
  audio.preload = 'auto';

  setState('PLAYING');

  audio.play().catch((err) => {
    console.warn('[AUDIO] Autoplay blocked:', err);
    showError('Audio autoplay blocked. Tap Play to start.');
  });

  audio.onended = () => {
    setState('COOLDOWN');
    setTimeout(() => {
      setState('SEARCHING');
      positionBuffer = [];
    }, CONFIG.COOLDOWN);
  };

  audio.ontimeupdate = () => {
    updateAudioProgress();
  };

  audio.onloadedmetadata = () => {
    durationEl.textContent = formatTime(audio.duration);
  };
}

function preloadAudio(stop, mode) {
  const audioFile = stop.audio[mode];
  if (!audioFile) return;

  const preload = new Audio();
  preload.src = `/audio/${audioFile}`;
  preload.preload = 'auto';
}

function updateAudioProgress() {
  const percent = (audio.currentTime / audio.duration) * 100 || 0;
  progressFillEl.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
}

function recoverGPS() {
  positionBuffer = [];
  gpsConfidence = 0;
  setTimeout(() => {
    setState('SEARCHING');
  }, 2000);
}

// ===== HELPER FUNCTIONS =====

function getAveragePosition(buffer) {
  const lat = buffer.reduce((sum, p) => sum + p.latitude, 0) / buffer.length;
  const lng = buffer.reduce((sum, p) => sum + p.longitude, 0) / buffer.length;
  return { latitude: lat, longitude: lng };
}

function findNearestStop(lat, lng) {
  let nearest = null;
  let minDist = Infinity;

  tourData.stops.forEach((stop) => {
    const d = getDistance(lat, lng, stop.lat, stop.lng);
    if (d < minDist) {
      minDist = d;
      nearest = stop;
    }
  });

  return nearest;
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function updateStopDisplay(stop, distance) {
  stopNameEl.textContent = stop.name;
  stopDistanceEl.textContent = `${distance.toFixed(0)}m away`;

  if (state === 'PLAYING') {
    // Keep current narration
  } else if (distance < stop.radius) {
    narrationTextEl.textContent = stop.on_time;
  } else if (distance < stop.radius * CONFIG.APPROACH_MULTIPLIER) {
    narrationTextEl.textContent = stop.early_arrival;
  } else {
    narrationTextEl.textContent = `${distance.toFixed(0)}m from ${stop.name}. Keep walking.`;
  }
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function showError(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  errorContainerEl.innerHTML = '';
  errorContainerEl.appendChild(errorEl);
  console.error('[ERROR]', message);
}

// ===== AUDIO CONTROLS =====

function attachAudioControls() {
  playBtn.addEventListener('click', () => {
    audio.play().catch((err) => {
      console.warn('[CONTROL] Play failed:', err);
    });
  });

  pauseBtn.addEventListener('click', () => {
    audio.pause();
  });

  replayBtn.addEventListener('click', () => {
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.warn('[CONTROL] Replay failed:', err);
    });
  });
}

// ===== STARTUP =====

window.addEventListener('load', init);

// ===== CLEANUP =====

window.addEventListener('beforeunload', () => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
});

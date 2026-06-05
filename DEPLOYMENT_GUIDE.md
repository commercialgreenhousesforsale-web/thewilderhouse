# Forsyth Ghost Tour v3.0 — Deployment Guide

**Status**: Pre-Audio Deployment (ready for audio files)  
**Target**: Cloudflare Pages (`forsythparkvacationrentals.com`)  
**Version**: 3.0

---

## PART 1: PRE-DEPLOYMENT CHECKLIST

### 1.1 Files Ready?

- [ ] FINAL_TOUR.json (v3.0 with Audio Tags) — Already deployed
- [ ] FINAL_APP.js (updated with audio paths) — READY TO UPDATE
- [ ] FINAL_SERVICE_WORKER.js (audio caching) — READY TO UPDATE
- [ ] FINAL_INDEX.html (UI updated) — READY TO UPDATE
- [ ] _headers (CSP, Cache-Control) — REVIEWED
- [ ] _redirects (URL rules) — REVIEWED
- [ ] /audio/ directory structure created locally
- [ ] All pilot 6 audio files generated & QA validated

### 1.2 Audio Files Ready?

**Pilot Phase (6 files):**
- [ ] SAV_STOP_01_NARRATOR_ON.mp3
- [ ] SAV_STOP_06_LOTTIE_ON.mp3 (or SAV_STOP_06_NARRATOR_ON.mp3)
- [ ] SAV_STOP_11_NARRATOR_ON.mp3
- [ ] SAV_STOP_18_ELDERON_ON.mp3 (or SAV_STOP_18_NARRATOR_ON.mp3)
- [ ] SAV_OPENING_FRAME_WOMAN.mp3
- [ ] SAV_CLOSING_FRAME_WOMAN.mp3

All files:
- [ ] Format: MP3, 192 kbps, 44100 Hz
- [ ] Named according to convention
- [ ] In correct directory structure
- [ ] Durations verified
- [ ] QA checklist passed

---

## PART 2: FINAL_APP.JS UPDATES

### 2.1 Update Model References

**Find and Replace**:

```javascript
// OLD
model: 'turbo-v2-5',

// NEW
model: 'eleven_v3',
```

### 2.2 Add Audio Base Path

**Add to CONFIG object**:

```javascript
const CONFIG = {
  // ... existing config ...
  AUDIO_BASE_PATH: '/audio/',
  NARRATOR_PATH: {
    woman: '/audio/woman/',
    man: '/audio/man/'
  }
};
```

### 2.3 Update Narrator Configuration

**Update NARRATORS object**:

```javascript
const NARRATORS = {
  woman: {
    name: 'Grandma Rachel',
    description: 'Wise Southern Senior, Warm Companion',
    voiceId: '0rEo3eAjssGDUCXHYENf',
    model: 'eleven_v3',
    key: 'woman',
    audio_base_path: '/audio/woman/',
    audio_tags: '[present, observant, grounded]'
  },
  man: {
    name: 'Havoc',
    description: 'Deep Southern Gothic, Gritty, Haunting',
    voiceId: 'dtVZnErhiiosqofxDzSH',
    model: 'eleven_v3',
    key: 'man',
    audio_base_path: '/audio/man/',
    audio_tags: '[gothic, protective, witnessing]',
    status: 'planned-phase-2'
  }
};
```

### 2.4 Add Audio File URL Generator

**Add new function**:

```javascript
function getAudioFileUrl(stop, variant, narrator, characterVoice = null) {
  /**
   * Generate URL for audio file
   * @param {number} stop - Stop ID (1-18)
   * @param {string} variant - 'early', 'on', or 'late'
   * @param {string} narrator - 'woman' or 'man'
   * @param {string} characterVoice - null, 'lottie', or 'elderon'
   * @returns {string} URL to MP3 file
   */
  
  const narratorPath = CONFIG.NARRATOR_PATH[narrator];
  const stopPadded = String(stop).padStart(2, '0');
  
  let voiceType = 'NARRATOR';
  if (characterVoice === 'lottie') voiceType = 'LOTTIE';
  if (characterVoice === 'elderon') voiceType = 'ELDERON';
  
  const variantMap = { 'early': 'EARLY', 'on': 'ON', 'late': 'LATE' };
  const variantCode = variantMap[variant];
  
  const filename = `SAV_STOP_${stopPadded}_${voiceType}_${variantCode}.mp3`;
  return `${narratorPath}stop_${stopPadded}/${filename}`;
}
```

### 2.5 Update Audio Playback

**In playTourStop() function, replace audio loading**:

```javascript
// OLD
audio.src = getTourData().stops[currentStop].audioUrl;

// NEW
const stop = tourData.stops[currentStop];
const narrator = selectedNarrator;
const variant = getVariantForConfidence(gpsConfidence);
const characterVoice = stop.character_voice || null;

audio.src = getAudioFileUrl(stop.id, variant, narrator, characterVoice);
```

### 2.6 Add Variant Determination

**Add function**:

```javascript
function getVariantForConfidence(confidence) {
  /**
   * Determine which script variant based on GPS confidence
   * @param {number} confidence - GPS confidence 0-1
   * @returns {string} 'early', 'on', or 'late'
   */
  if (confidence < 0.4) return 'early';
  if (confidence < 0.7) return 'on';
  return 'late';
}
```

---

## PART 3: FINAL_SERVICE_WORKER.JS UPDATES

### 3.1 Add Audio Caching Strategy

**Update cache configuration**:

```javascript
const CACHE_NAME = 'forsyth-tour-v3.0';

const CACHE_STRATEGY = {
  'app-shell': {
    files: ['index.html', 'FINAL_APP.js', 'style.css'],
    strategy: 'network-first',
    max_age: 3600000 // 1 hour
  },
  'tour-data': {
    files: ['FINAL_TOUR.json'],
    strategy: 'network-first',
    max_age: 604800000 // 7 days
  },
  'audio': {
    files: ['/audio/*'],
    strategy: 'cache-first',
    max_age: 31536000000 // 1 year
  },
  'assets': {
    files: ['*.webp', '*.ico', '*.ttf'],
    strategy: 'cache-first',
    max_age: 31536000000 // 1 year
  }
};
```

### 3.2 Audio Preloading

**Add preload function**:

```javascript
async function preloadNextStop(nextStopId, narrator) {
  /**
   * Preload next stop's audio while current stop plays
   * @param {number} nextStopId - Next stop's ID
   * @param {string} narrator - Current narrator
   */
  
  const cache = await caches.open(CACHE_NAME);
  const stop = tourData.stops[nextStopId];
  const variant = 'on'; // Default to on-time for preload
  
  const url = getAudioFileUrl(nextStopId, variant, narrator);
  
  try {
    const response = await fetch(url);
    if (response.ok) {
      await cache.put(url, response.clone());
      console.log(`[PRELOAD] Next stop audio: ${url}`);
    }
  } catch (error) {
    console.warn(`[PRELOAD] Failed to preload: ${error}`);
  }
}
```

### 3.3 Update Cache Handling

**In Service Worker fetch handler**:

```javascript
// Handle audio files specially
if (request.url.includes('/audio/')) {
  return caches.open(CACHE_NAME).then(cache => {
    return cache.match(request).then(response => {
      return response || fetch(request).then(response => {
        cache.put(request, response.clone());
        return response;
      });
    });
  });
}
```

---

## PART 4: CLOUDFLARE PAGES DEPLOYMENT

### 4.1 Directory Structure (Local)

Verify this exists before deployment:

```
project-root/
├── index.html
├── FINAL_APP.js (UPDATED)
├── FINAL_SERVICE_WORKER.js (UPDATED)
├── FINAL_TOUR.json (v3.0)
├── _headers
├── _redirects
├── _worker.js (already deployed)
└── audio/
    └── woman/
        ├── stop_01/
        │   ├── SAV_STOP_01_NARRATOR_EARLY.mp3
        │   ├── SAV_STOP_01_NARRATOR_ON.mp3
        │   └── SAV_STOP_01_NARRATOR_LATE.mp3
        ├── stop_02/ ... (through stop_18)
        ├── opening/
        │   └── SAV_OPENING_FRAME_WOMAN.mp3
        └── closing/
            └── SAV_CLOSING_FRAME_WOMAN.mp3
```

### 4.2 Update _headers for Audio Caching

**Add these rules to `/audio/` prefix**:

```
/audio/*
  Cache-Control: public, max-age=31536000
  Content-Type: audio/mpeg
```

Full _headers file should have:

```
/audio/*
  Cache-Control: public, max-age=31536000
  Content-Type: audio/mpeg

/*.html
  Cache-Control: no-cache, must-revalidate

/FINAL_*.json
  Cache-Control: public, max-age=604800

/*.js
  Cache-Control: public, max-age=3600

/FINAL_SERVICE_WORKER.js
  Cache-Control: no-cache
```

### 4.3 Deploy to Production

**Command**:

```bash
cd /path/to/thewilderhousehtml

# Verify changes are staged
git status

# Add updated files
git add FINAL_APP.js FINAL_SERVICE_WORKER.js _headers

# Commit
git commit -m "PRODUCTION DEPLOY: Audio files + app updates for v3.0

- Updated FINAL_APP.js: ElevenLabs v3, audio path references, variant logic
- Updated FINAL_SERVICE_WORKER.js: Audio caching (cache-first), preloading
- Updated _headers: Cache-Control for /audio/ (1 year max-age)
- Audio files deployed: pilot 6 + Phase 1 remaining = 72 total
- Status: Woman narrator (Grandma Rachel) live
- Phase 2 (Havoc): Planned for future

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# Deploy to production (NOT preview)
npx wrangler pages deploy . --project-name=thewilderhouse --branch=main --commit-dirty=true
```

### 4.4 Verify Deployment

**Test in browser**:

```javascript
// Open console at https://forsythparkvacationrentals.com

// Test audio URL generation
const url = getAudioFileUrl(1, 'on', 'woman', null);
console.log(url); // Should output: /audio/woman/stop_01/SAV_STOP_01_NARRATOR_ON.mp3

// Test audio file exists
fetch('/audio/woman/stop_01/SAV_STOP_01_NARRATOR_ON.mp3')
  .then(r => r.ok ? '✓ File found' : '✗ 404')
  .catch(e => '✗ Error: ' + e.message)
```

---

## PART 5: PHASED DEPLOYMENT TIMELINE

### Phase 1: Pilot Deployment (6 Files)

**Timeline**: Immediately after pilot QA validation

**Deploy**:
- [ ] 6 pilot audio files
- [ ] Updated FINAL_APP.js
- [ ] Updated FINAL_SERVICE_WORKER.js
- [ ] Updated _headers

**Test**:
- [ ] Listener can start tour
- [ ] Audio plays at stops 1, 6, 11, 18
- [ ] Opening/closing frames work
- [ ] Early/on/late variants work
- [ ] Audio preloading functions

**Validation**:
- [ ] Field test in Savannah (full walk if possible)
- [ ] 3+ independent listeners
- [ ] Emotional transformation confirmed
- [ ] No critical bugs

### Phase 1b: Full Woman Narrator (72 Files)

**Timeline**: 1-2 days after pilot validation

**Deploy**:
- [ ] Remaining 66 files (Stops 2-5, 7-10, 12-17 × 3 variants each)
- [ ] App fully functional with woman narrator option

**Test**:
- [ ] All 18 stops accessible
- [ ] All 3 variants (early/on/late) work
- [ ] Complete 30-minute walk plays without issues

### Phase 2: Man Narrator (56 Files)

**Timeline**: 2-4 weeks after Phase 1 deployment

**Deploy**:
- [ ] All 18 stops × 3 variants with Havoc voice
- [ ] Opening/closing with man narrator
- [ ] Narrator selection screen functional

**Test**:
- [ ] Both narrators selectable at start
- [ ] Audio switches correctly between woman/man
- [ ] No conflicts in caching/playback

---

## PART 6: POST-DEPLOYMENT MONITORING

### 6.1 Analytics to Track

- [ ] Page load times (should be < 2 seconds)
- [ ] Audio file cache hit ratio (should be > 90%)
- [ ] Audio playback errors (should be < 1%)
- [ ] GPS tracking accuracy (confidence > 40%)
- [ ] User completion rate (how many finish the tour)

### 6.2 Known Issues to Watch For

**Issue 1: Audio doesn't play**
- Check: Browser console for 404 errors
- Fix: Verify file exists at `/audio/woman/stop_XX/`
- Fix: Hard refresh (Ctrl+Shift+R) to clear service worker

**Issue 2: Audio choppy on mobile data**
- Check: Bitrate is 192 kbps (correct)
- Check: User has LTE/5G, not poor signal
- Fix: Audio is designed for good connectivity

**Issue 3: GPS not triggering**
- Check: User has location permission enabled
- Check: User walking (not stationary)
- Fix: GPS is intentionally sensitive to reduce false triggers

**Issue 4: Service worker not caching**
- Check: Incognito/private mode (no SW support)
- Check: Browser privacy settings
- Fix: Normal mode required

### 6.3 Error Logging

**Enable error logging in FINAL_APP.js**:

```javascript
window.addEventListener('error', (event) => {
  console.error('[ERROR]', event.message);
  // Could send to error tracking service
});

audio.addEventListener('error', (event) => {
  console.error('[AUDIO ERROR]', event);
  // Log audio playback failures
});
```

---

## PART 7: ROLLBACK PROCEDURE

If critical issues discovered after deployment:

### 7.1 Quick Rollback (Within 1 Hour)

```bash
# Revert to previous git commit
git revert --no-edit HEAD

# Redeploy
npx wrangler pages deploy . --project-name=thewilderhouse --branch=main --commit-dirty=true
```

### 7.2 Identify Latest Good Commit

```bash
git log --oneline -10
# Find last known working deployment
```

### 7.3 Deploy Specific Commit

```bash
git checkout [commit-hash] -- FINAL_APP.js FINAL_SERVICE_WORKER.js
git commit -m "ROLLBACK: Audio deployment - reverting to [commit-hash]"
npx wrangler pages deploy . --project-name=thewilderhouse --branch=main --commit-dirty=true
```

---

## PART 8: SUCCESS CRITERIA

**Deployment is successful when:**

- [ ] All audio files available at correct URLs
- [ ] App loads within 2 seconds
- [ ] Audio starts playing when user arrives at stop
- [ ] All three variants (early/on/late) work
- [ ] Service worker caches audio (verified in DevTools)
- [ ] Audio preloading functions
- [ ] Outdoor listening in Savannah confirms audio quality
- [ ] 3+ listeners report emotional transformation
- [ ] Zero critical bugs reported

---

## DEPLOYMENT CHECKLIST (Ready to Deploy)

**Final verification before hitting `wrangler pages deploy`:**

- [ ] FINAL_TOUR.json deployed (v3.0 with Audio Tags)
- [ ] FINAL_APP.js updated (audio paths, model v3, variants)
- [ ] FINAL_SERVICE_WORKER.js updated (audio caching)
- [ ] _headers updated (audio cache rules)
- [ ] All audio files generated & QA passed
- [ ] Audio directory structure correct
- [ ] Git commits clean and meaningful
- [ ] No sensitive information in code
- [ ] Testing completed
- [ ] Rollback plan confirmed

**When all checked:** Ready to deploy!

---

## NEXT STEPS

1. ✓ Audio Generation Guide written
2. ✓ Quality Checklist written
3. ✓ Metadata manifest created
4. **→ Generate Pilot 6 audio files**
5. **→ Run through Quality Checklist**
6. **→ Update FINAL_APP.js per guide**
7. **→ Update FINAL_SERVICE_WORKER.js per guide**
8. **→ Deploy to production**
9. **→ Field test in Savannah**
10. **→ Generate remaining Phase 1 files**
11. **→ Full production deployment**

---

**Status**: Deployment infrastructure ready, awaiting audio files  
**Expected Timeline**: Pilot files in 1-2 hours, deployment within 24 hours of validation

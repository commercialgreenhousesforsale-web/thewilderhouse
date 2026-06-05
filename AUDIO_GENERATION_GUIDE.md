# Forsyth Ghost Tour v3.0 — Audio Generation Guide

**Status**: Production-Ready Specification (Audio files NOT yet generated)  
**Model**: ElevenLabs Eleven v3  
**Total Files**: 128 (18 public stops × 3 variants × 2 narrators + 1 gateway stop)  
**Phase 1 Pilot**: 18 files (Stops 0-5 — woman narrator only, Lottie character at Stop 5)

---

## PART 1: PRE-GENERATION SETUP

### 1.1 Verify Access & Settings

- [ ] Confirm ElevenLabs Creator Plan access (active subscription)
- [ ] Verify voice IDs are correct:
  - **Woman Narrator** (Grandma Rachel): `0rEo3eAjssGDUCXHYENf`
  - **Character Lottie**: `I571sUNz6E53D5YaJgVg`
  - **Character Elderon**: `NwyAvGnfbFoNNEi4UuTq`
- [ ] Confirm Eleven v3 model access (`eleven_v3` API model ID)
- [ ] Test with a single short API call to verify credentials work

### 1.2 Prepare Output Directory Structure

Create this folder structure locally before generation:

```
/audio/
  /woman/
    /stop_00/
      SAV_STOP_00_NARRATOR_EARLY.mp3
      SAV_STOP_00_NARRATOR_ON.mp3
      SAV_STOP_00_NARRATOR_LATE.mp3
    /stop_01/
      SAV_STOP_01_NARRATOR_EARLY.mp3
      SAV_STOP_01_NARRATOR_ON.mp3
      SAV_STOP_01_NARRATOR_LATE.mp3
    ... (through stop_17)
  /man/
    (same structure — Phase 2 only)
  /opening/
    SAV_OPENING_FRAME_WOMAN.mp3
    SAV_OPENING_FRAME_MAN.mp3
  /closing/
    SAV_CLOSING_FRAME_WOMAN.mp3
    SAV_CLOSING_FRAME_MAN.mp3
```

Total: **72 files (18 stops × 3 variants) for woman narrator**  
Phase 2 adds: **72 files for man narrator + 4 opening/closing files**

---

## PART 2: GENERATION SPECIFICATIONS

### 2.1 Voice Model Settings (All Files)

```
Model ID:              eleven_v3
Stability:             70
Similarity Boost:      75
Output Format:         MP3
Bitrate:               192 kbps
Sample Rate:           44100 Hz
```

### 2.2 Audio Tags by Stop

Each stop has specific Audio Tags for the narrator. Apply these as voice settings/emotional context:

#### Stop 0 (Wilder House) — GATEWAY ONLY
- **Audio Tags**: [grounding, protective, sacred, present]
- **Delivery**: Calm, anchor-like, creating safety
- **Pace**: Slow, grounded, meditative
- **Emphasis**: Protection and blessing are real

#### Stop 1 (Telfair Hospital) — PUBLIC TOUR START
- **Audio Tags**: [strong, authoritative, protective, impressed]
- **Delivery**: Quiet authority, respect for Mary's will
- **Pace**: Steady, strong, unyielding
- **Emphasis**: Strength without harshness

#### Stop 2 (Spanish War Veteran Statue)
- **Audio Tags**: [melancholic, respectful, haunted, witnessing]
- **Delivery**: Somber, respectful, tender
- **Pace**: Slower than normal, gentle
- **Emphasis**: Sadness mixed with respect

#### Stop 3 (Live Oak Grove)
- **Audio Tags**: [awed, reverent, slow, meditative]
- **Delivery**: Awe in the presence of ancient time
- **Pace**: Slowest of tour, almost liturgical
- **Emphasis**: Reverence for witness and memory

#### Stop 4 (Monument Area)
- **Audio Tags**: [clear-eyed, witnessing, holding-space, unflinching]
- **Delivery**: Clear truth-telling, compassionate
- **Pace**: Steady, grounded, making space for complexity
- **Emphasis**: Witness without judgment

#### Stop 5 (Forsyth Fountain) — CHARACTER VOICE: LOTTIE / EMOTIONAL CORE
- **Audio Tags**: [vulnerable, intimate, confessional, heartbroken, regretful]
- **Voice ID**: I571sUNz6E53D5YaJgVg (Lottie)
- **Delivery**: As if confessing a centuries-old secret
- **Pace**: Slower, more vulnerable, intimate
- **Emphasis**: Regret and sorrow that isn't yours but feels like it is
- **Special Note**: This is the emotional heart. Prioritize this file in pilot testing.

#### Stop 6 (Kessler Mansion / Armstrong College)
- **Audio Tags**: [melancholic, reflective, understanding, accepting]
- **Delivery**: Mourning what was beautiful and temporary
- **Pace**: Meditative, wise
- **Emphasis**: Acceptance of transience

#### Stop 7 (Monterey Square / Pulaski Monument)
- **Audio Tags**: [peaceful, resolved, hopeful, dignified]
- **Delivery**: Calm reprieve, proof not everything stays broken
- **Pace**: Slower, restorative
- **Emphasis**: Peace and earned rest

#### Stop 8 (Jones & Bull Corner)
- **Audio Tags**: [reverent, meditative, grounding, present]
- **Delivery**: Standing on holy ground
- **Pace**: Slow, contemplative
- **Emphasis**: Sacred presence of accumulated lives

#### Stop 9 (Madison Square)
- **Audio Tags**: [integrating, clear-eyed, holding-space, compassionate]
- **Delivery**: Witnessing complexity with compassion
- **Pace**: Spacious, making room for multiple truths
- **Emphasis**: Multiple histories coexisting

#### Stop 10 (Chippewa Square)
- **Audio Tags**: [serious, unflinching, sorrowful, witnessing]
- **Delivery**: Serious, clear, respectful of wound
- **Pace**: Steady, not sensationalized
- **Emphasis**: Wound that won't close, story that won't end

#### Stop 11 (Oglethorpe Church)
- **Audio Tags**: [calm, meditative, restorative, grounding]
- **Delivery**: Slowest delivery of tour, genuine rest
- **Pace**: Slowest, deepest breaths
- **Emphasis**: Silence as sacred

#### Stop 12 (Wright Square)
- **Audio Tags**: [thoughtful, philosophical, observant, curious]
- **Delivery**: Intellectual curiosity about mythology
- **Pace**: Thoughtful, inviting listener to think
- **Emphasis**: How cities create narratives

#### Stop 13 (Johnson Square)
- **Audio Tags**: [grounded, foundational, ancestral, steadfast]
- **Delivery**: Touching bedrock, speaking of origins
- **Pace**: Steady, rooted, ancient
- **Emphasis**: Weight and steadiness of origins

#### Stop 14 (Bay & Bull / City Hall)
- **Audio Tags**: [alert, clear, protective, pragmatic]
- **Delivery**: Alert presence, safety-focused
- **Pace**: Slightly faster, practical
- **Emphasis**: Balance alert and grounded

#### Stop 15 (Cotton Exchange)
- **Audio Tags**: [ancestral, witnessing, direct, sorrowful]
- **Delivery**: Woman narrator, unflinching truth about commerce and suffering
- **Pace**: Slow, weighted with history
- **Emphasis**: The wound beneath the exchange

#### Stop 16 (River Access Ramp)
- **Audio Tags**: [ancestral, patient, witnessing, calling]
- **Delivery**: Woman narrator witnessing the threshold where arrivals happened
- **Pace**: Very slow, ceremonial
- **Emphasis**: What the river carried, what was witnessed

#### Stop 17 (Final Anchor - Sea Merchants Statue) — CHARACTER VOICE: ELDERON / TOUR CONCLUSION
- **Audio Tags**: [direct, witnessed, grounded, unflinching]
- **Voice ID**: NwyAvGnfbFoNNEi4UuTq (Elderon)
- **Delivery**: One of the merchants the statue represents, speaking at the end
- **Pace**: Steady, final, complete
- **Emphasis**: A merchant's testimony. Everything witnessed. The end.

#### Opening Frame
- **Audio Tags**: [grounding, protective, sacred, present]
- **Delivery**: Safe, centered, trustworthy
- **Pace**: Slow, grounded
- **Emphasis**: Listener feels protected before tour begins

#### Closing Frame
- **Audio Tags**: [grateful, inviting, community]
- **Delivery**: Warm, genuine, inviting
- **Pace**: Natural, open-ended
- **Emphasis**: Listener is part of something larger

---

## PART 3: EXACT GENERATION WORKFLOW (For Each File)

### 3.1 Using ElevenLabs API (Programmatic)

**Language**: Python (recommended) or cURL

**Python Example**:

```python
import requests
import os

# Configuration
API_KEY = "YOUR_ELEVENLABS_API_KEY"
VOICE_ID = "0rEo3eAjssGDUCXHYENf"  # Woman narrator
MODEL_ID = "eleven_v3"
OUTPUT_DIR = "/audio/woman/stop_01/"

# Script from FINAL_TOUR.json (Stop 1, on_time variant)
SCRIPT = """Welcome to the Wilder House. <break time="500ms"/> Before we step into Savannah's memory..."""

# Audio Tags for emotional guidance
AUDIO_TAGS = "[grounding, protective, sacred, present]"

# ElevenLabs API endpoint
URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

headers = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

payload = {
    "text": SCRIPT,
    "model_id": MODEL_ID,
    "voice_settings": {
        "stability": 70,
        "similarity_boost": 75,
    },
    # Note: Audio Tags may be passed as context or voice direction
    # Check ElevenLabs API docs for exact parameter name
    "output_format": "mp3_192",
}

response = requests.post(URL, json=payload, headers=headers)

if response.status_code == 200:
    output_file = f"{OUTPUT_DIR}SAV_STOP_01_NARRATOR_ON.mp3"
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(output_file, "wb") as f:
        f.write(response.content)
    print(f"✓ Generated: {output_file}")
else:
    print(f"✗ Error: {response.status_code} - {response.text}")
```

### 3.2 Using ElevenLabs Dashboard (Manual)

**For each file:**

1. Log into [https://elevenlabs.io/app](https://elevenlabs.io/app)
2. Select **Text-to-Speech** → **Create New**
3. **Script**: Copy from FINAL_TOUR.json (e.g., Stop 1 "on_time" field)
4. **Voice**: Select from dropdown (Woman Narrator: `0rEo3eAjssGDUCXHYENf`)
5. **Model**: `Eleven v3`
6. **Voice Settings**:
   - Stability: **70**
   - Similarity Boost: **75**
7. **Output Format**: `MP3 (192 kbps)`
8. **Audio Tags** (if supported in UI): Paste Audio Tags from spec above
9. Click **Generate**
10. Download as `SAV_STOP_XX_NARRATOR_[VARIANT].mp3`
11. Place in `/audio/woman/stop_XX/`

---

## PART 4: PILOT PHASE (18 Files - Woman Narrator Only: Stops 0-5)

### 4.1 Pilot Files to Generate First

Generate these 18 files (6 stops × 3 variants each) for field testing:

**NOTE**: Stop 0 (Wilder House) is guest-only entry point. Stop 1 (Telfair Hospital) is the REAL public tour start.

**Stop 0: Wilder House** (Threshold, protection - gateway only)
- SAV_STOP_00_NARRATOR_EARLY.mp3
- SAV_STOP_00_NARRATOR_ON.mp3
- SAV_STOP_00_NARRATOR_LATE.mp3

**Stop 1: Telfair Hospital** (Strength, will - REAL public start)
- SAV_STOP_01_NARRATOR_EARLY.mp3
- SAV_STOP_01_NARRATOR_ON.mp3
- SAV_STOP_01_NARRATOR_LATE.mp3

**Stop 2: Spanish War Veteran Statue** (Vigilance, watch)
- SAV_STOP_02_NARRATOR_EARLY.mp3
- SAV_STOP_02_NARRATOR_ON.mp3
- SAV_STOP_02_NARRATOR_LATE.mp3

**Stop 3: Live Oak Grove** (Witness, memory)
- SAV_STOP_03_NARRATOR_EARLY.mp3
- SAV_STOP_03_NARRATOR_ON.mp3
- SAV_STOP_03_NARRATOR_LATE.mp3

**Stop 4: Monument Area** (Contradiction, complexity)
- SAV_STOP_04_NARRATOR_EARLY.mp3
- SAV_STOP_04_NARRATOR_ON.mp3
- SAV_STOP_04_NARRATOR_LATE.mp3

**Stop 5: Forsyth Fountain** (Emotional peak — with Lottie character voice)
- SAV_STOP_05_LOTTIE_EARLY.mp3 (Character voice: Lottie)
- SAV_STOP_05_LOTTIE_ON.mp3 (Character voice: Lottie)
- SAV_STOP_05_LOTTIE_LATE.mp3 (Character voice: Lottie)

**Total Pilot Files: 18**
**Total Duration: ~13.2 minutes (gateway threshold through emotional peak)**
**Narrator: Woman (Grandma Rachel) only**
**Character Voices: Lottie at Stop 5 only**

**Why this scope?**
- Stop 0: Guest entry point (protective threshold gateway)
- Stop 1: REAL public tour start (strength, will)
- Stops 2-4: Tests emotional arc (vigilance → witness → contradiction)
- Stop 5: Tests character voice (Lottie) at emotional peak
- All 3 variants: Tests early/on/late GPS confidence variations
- Complete arc: Tests full journey from gateway through emotional transformation

### 4.2 Pilot Testing Protocol

See **QUALITY_CHECKLIST.md** for detailed testing procedures.

**Field Test**: Complete walk from Wilder House → Forsyth Fountain
- Test all 6 stops in sequence
- Test all 3 variants at each stop (early/on/late)
- Validate emotional arc progression
- Collect listener feedback

---

## PART 5: FULL PRODUCTION PHASE (128 Files)

### 5.1 Phase 1 Completion (Woman Narrator — 72 Files)

After pilot validation, generate remaining **66 files**:
- All 18 stops × 3 variants (early/on/late)
- Opening + Closing frames

### 5.2 Phase 2 (Man Narrator — 56 Files)

After Phase 1 is deployed and validated:
- All 18 stops × 3 variants (early/on/late)
- Opening + Closing frames

---

## PART 6: BATCH GENERATION (Optional Automation)

If you want to automate bulk generation:

**Python Batch Script** (pseudocode):

```python
from elevenlabs import ElevenLabs
import json

# Load FINAL_TOUR.json
with open('FINAL_TOUR.json') as f:
    tour = json.load(f)

# Initialize API
client = ElevenLabs(api_key="YOUR_API_KEY")

# Generate all files
for stop in tour['stops']:
    for variant in ['early_arrival', 'on_time', 'late_arrival']:
        script = stop[variant]
        voice_id = "0rEo3eAjssGDUCXHYENf"  # Woman narrator
        
        audio = client.generate(
            text=script,
            voice_id=voice_id,
            model_id="eleven_v3",
            stability=70,
            similarity_boost=75,
        )
        
        # Save file
        filename = f"SAV_STOP_{stop['id']:02d}_NARRATOR_{variant.upper()}.mp3"
        with open(f"/audio/woman/stop_{stop['id']:02d}/{filename}", "wb") as f:
            f.write(audio)
```

**Tools for Batch Processing:**
- ElevenLabs API (recommended)
- Python + `elevenlabs` library
- Shell script with `curl` commands
- Integration with Zapier/Make for serverless batch

---

## PART 7: FILE VALIDATION

After generation, validate each file:

**File Naming Convention**:
```
SAV_STOP_[ID]_[VOICE]_[VARIANT].mp3

Examples:
- SAV_STOP_00_NARRATOR_EARLY.mp3 (Wilder House, woman narrator)
- SAV_STOP_05_LOTTIE_ON.mp3 (Forsyth Fountain, Lottie character)
- SAV_STOP_17_ELDERON_LATE.mp3 (Sea Merchants, Elderon character)
```

**File Metadata Validation**:
- [ ] Duration matches FINAL_TOUR.json walking_time_seconds (±5 seconds)
- [ ] Bitrate: 192 kbps confirmed
- [ ] Sample rate: 44100 Hz
- [ ] Format: MP3 (not AAC, WAV, etc.)
- [ ] File size: ~1.5-4 MB per file (typical for 1-4 minute audio)

---

## PART 8: DEPLOYMENT

See **DEPLOYMENT_GUIDE.md** for uploading to Cloudflare Pages.

---

## PART 9: TROUBLESHOOTING

### API Returns 401 (Unauthorized)
- Verify API key is correct
- Confirm subscription is active
- Check API key hasn't expired

### API Returns 429 (Rate Limited)
- ElevenLabs has rate limits (typically ~1 request per second for API)
- Add delays between requests: `time.sleep(1.5)` between API calls
- Or use batch processing mode if available

### Audio Quality Issues
See **QUALITY_CHECKLIST.md** for diagnosis.

### SSML Not Rendering
- Confirm model is `eleven_v3` (older models don't support SSML well)
- Test SSML tags in a short snippet first
- Verify Audio Tags are applied for emotional context

---

## PART 10: COST ESTIMATE

**ElevenLabs Pricing** (as of June 2026):
- Creator Plan: $20-30/month includes ~500,000 characters/month
- Estimated cost for 128 files: ~$0.50-1.00 total (well within free tier)

---

## CHECKLIST: BEFORE HITTING GENERATE

- [ ] All 18 stops + opening/closing scripts verified in FINAL_TOUR.json
- [ ] Voice IDs confirmed (Woman: `0rEo3eAjssGDUCXHYENf`, Lottie: `I571sUNz6E53D5YaJgVg`, Elderon: `NwyAvGnfbFoNNEi4UuTq`)
- [ ] Model ID is `eleven_v3`
- [ ] Audio Tags system understood and documented
- [ ] Output directories created
- [ ] Pilot phase files identified (6 files)
- [ ] File naming convention locked in
- [ ] Batch generation script tested (if automating)
- [ ] QA checklist prepared
- [ ] Deployment path confirmed

---

**Status**: Production-ready, awaiting GO signal from Travis  
**Next Step**: Pilot Phase Audio Generation (6 files, woman narrator)

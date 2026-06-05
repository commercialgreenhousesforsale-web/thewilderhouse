# Forsyth Ghost Tour v3.0 — Quality Assurance Checklist

**Purpose**: Validate that generated audio files meet world-class production standards  
**When to Use**: After each file generation (especially pilot phase)  
**Equipment Needed**: iPhone/Android earbuds, car with windows down, quiet room, loudness meter (optional)

---

## PART 1: TECHNICAL VALIDATION (Every File)

### 1.1 File Integrity

For each generated MP3 file:

- [ ] File exists at correct path: `/audio/woman/stop_XX/SAV_STOP_XX_NARRATOR_[VARIANT].mp3`
- [ ] File size is reasonable (1.5-4 MB for 1-4 minute audio)
- [ ] File plays without errors in VLC, Audacity, or browser
- [ ] Metadata shows:
  - Format: MP3
  - Bitrate: 192 kbps
  - Sample Rate: 44100 Hz
  - Channels: Stereo or Mono

**Validation Command** (macOS/Linux):
```bash
ffprobe SAV_STOP_01_NARRATOR_ON.mp3
# Should show: duration, bitrate 192k, sample rate 44100 Hz
```

### 1.2 Duration Verification

Compare generated audio duration to expected walking times:

| Stop | Name | Expected Duration | Tolerance | Check |
|------|------|-------------------|-----------|-------|
| 1 | Wilder House | 4:00 | ±5 sec | [ ] |
| 2 | Telfair Hospital | 1:45 | ±5 sec | [ ] |
| 3 | Spanish War Veteran | 1:20 | ±5 sec | [ ] |
| 4 | Live Oak Grove | 2:10 | ±5 sec | [ ] |
| 5 | Monument Area | 3:45 | ±5 sec | [ ] |
| 6 | Forsyth Fountain | 2:40 | ±5 sec | [ ] |
| 7 | Kessler Mansion | 1:30 | ±5 sec | [ ] |
| 8 | Monterey Square | 1:50 | ±5 sec | [ ] |
| 9 | Jones & Bull | 1:30 | ±5 sec | [ ] |
| 10 | Madison Square | 2:40 | ±5 sec | [ ] |
| 11 | Chippewa Square | 1:15 | ±5 sec | [ ] |
| 12 | Oglethorpe Church | 1:48 | ±5 sec | [ ] |
| 13 | Wright Square | 1:48 | ±5 sec | [ ] |
| 14 | Johnson Square | 1:15 | ±5 sec | [ ] |
| 15 | Bay & Bull | 2:20 | ±5 sec | [ ] |
| 16 | Cotton Exchange | 1:30 | ±5 sec | [ ] |
| 17 | River Access Ramp | 1:50 | ±5 sec | [ ] |
| 18 | Final Anchor | 3:00 | ±5 sec | [ ] |

**If duration is off by >5 seconds:**
- Check if SSML `<break>` tags were properly rendered
- Check if script was modified during generation
- Regenerate if needed

---

## PART 2: AUDIO QUALITY LISTENING TEST

### 2.1 Loudness & Clarity (Critical for Outdoor Use)

**Location 1: Quiet Room**
- [ ] Play file at normal conversation volume
- [ ] Audio is clear and intelligible (not muffled)
- [ ] No robotic artifacts or text-to-speech artifacts
- [ ] Breaths/pauses feel natural, not like dead air
- [ ] SSML `<break>` tags created appropriate pauses

**Location 2: Car with Windows Down (Traffic Noise)**
- [ ] Audio is audible over road noise
- [ ] Not too quiet (listener doesn't strain to hear)
- [ ] Not too loud (doesn't feel aggressive)
- [ ] Clarity maintained even with wind noise
- [ ] Compression is gentle (not over-compressed)

**Location 3: Outdoors with Earbuds (Real Savannah Conditions)**
- [ ] Audio clear over street/pedestrian noise
- [ ] Earbuds don't distort
- [ ] Comfortable at outdoor volume levels
- [ ] Presence boost (2-4kHz) is audible and appropriate
- [ ] No wind noise artifacts if outside

### 2.2 Loudness Measurement (Optional - If Available)

Use a loudness meter app or Audacity:

**Target**: -14 LUFS (typical for outdoor mobile listening)

**Acceptable Range**: -16 to -12 LUFS

- [ ] Use Audacity: Analyze → Loudness Normalization
- [ ] Check if file is within -16 to -12 LUFS range
- [ ] If too quiet: Regenerate with higher stability (up to 75)
- [ ] If too loud: Regenerate with lower stability (down to 65)

---

## PART 3: EMOTIONAL DELIVERY VALIDATION

### 3.1 Narrator Tone (Woman Narrator - All Stops)

**Expected Emotional Qualities by Stop:**

| Stop | Emotion | Check |
|------|---------|-------|
| 1 | Grounding, protective, sacred | [ ] Felt safe? |
| 2 | Strong, authoritative, impressed | [ ] Felt respect for Mary? |
| 3 | Melancholic, respectful, haunted | [ ] Felt sadness + respect? |
| 4 | Awed, reverent, meditative | [ ] Felt awe and reverence? |
| 5 | Clear-eyed, witnessing, unflinching | [ ] Heard truth without judgment? |
| 6 | LOTTIE: Vulnerable, intimate, confessional | [ ] Felt like personal confession? |
| 7 | Melancholic, reflective, understanding | [ ] Mourned transience? |
| 8 | Peaceful, resolved, hopeful | [ ] Felt relieved? |
| 9 | Reverent, meditative, grounding | [ ] Felt sacred presence? |
| 10 | Integrating, clear-eyed, compassionate | [ ] Held multiple truths? |
| 11 | Serious, unflinching, sorrowful | [ ] Felt wound without sensationalism? |
| 12 | Calm, meditative, restorative | [ ] Felt rest and breath return? |
| 13 | Thoughtful, philosophical, curious | [ ] Invited intellectual engagement? |
| 14 | Grounded, foundational, ancestral | [ ] Touched bedrock feeling? |
| 15 | Alert, clear, protective, pragmatic | [ ] Felt safe at busy crossing? |
| 16 | ELDERON: Ancestral, witnessing, direct | [ ] River speaking? |
| 17 | ELDERON: Ancestral, patient, witnessing | [ ] Voices rising from water? |
| 18 | ELDERON: Integrating, releasing, peaceful | [ ] Everything held? |

### 3.2 Character Voice Validation

**For Lottie (Stop 6):**
- [ ] Voice sounds distinctly different from narrator (if separate voice)
- [ ] Vulnerability is audible (not theatrical)
- [ ] Feels like centuries-old confession
- [ ] Regret is palpable but not melodramatic
- [ ] Listener feels emotional resonance (not just sadness)

**For Elderon (Stops 16, 17, 18):**
- [ ] Voice sounds ancient but present
- [ ] Feels like river/water speaking
- [ ] Patience is audible (not rushed)
- [ ] Witness quality: holding all stories
- [ ] Integration: sense of peace with complexity

### 3.3 Pace & Breathing

- [ ] Pauses feel intentional, not awkward
- [ ] Breathing is natural (if audible)
- [ ] Emotional moments have time to land
- [ ] Fast moments (Stop 15) feel appropriately urgent
- [ ] Slow moments (Stop 12) feel genuinely restorative
- [ ] Flow between sentences feels organic

---

## PART 4: SAVANNAH-SPECIFIC LISTENING TEST

### 4.1 Field Test in Actual Savannah

When possible, test audio files AT the actual stops:

**Stop 1 (Wilder House)**
- [ ] Does blessing feel real standing here?
- [ ] Does narrator's protection resonate in this space?
- [ ] Audio clarity: adequate at this location?

**Stop 6 (Forsyth Fountain)**
- [ ] Does Lottie's regret feel present here?
- [ ] Does fountain's beauty enhance emotional impact?
- [ ] Quiet enough space for intimate delivery?

**Stop 11 (Chippewa Square)**
- [ ] Does difficulty of story feel appropriate here?
- [ ] Wally's presence: does it feel real?

**Stop 18 (Final Anchor - Sea Merchants)**
- [ ] Does Elderon's voice feel like river speaking?
- [ ] Integration: does everything feel held?
- [ ] Listener feels transformed?

---

## PART 5: COMPLETE USER EXPERIENCE TEST

### 5.1 Full Tour Listening (Do This After All 18 Stops + Opening/Closing)

**Environment**: Real outdoor listening (walking, earbuds, Savannah)

- [ ] **Opening Frame**: Sets intention, feels safe
- [ ] **Stops 1-5**: Threshold → contradiction (emotional arc established?)
- [ ] **Stop 6**: Emotional peak (Lottie) lands appropriately
- [ ] **Stops 7-12**: Oscillation (lost hopes → peace → wound → sacred rest)
- [ ] **Stops 13-15**: Infrastructure (civic structure, authority, commerce)
- [ ] **Stops 16-18**: River (Elderon, witnessing, release, integration)
- [ ] **Closing Frame**: Gratitude, invitation to community
- [ ] **Overall**: Listener sees Savannah differently?

### 5.2 Listener Journey

Ask test listener (or self-reflect):

1. **Before tour**: "What do you expect from Savannah?"
   - [ ] Recorded answer

2. **After tour**: "How do you see Savannah differently?"
   - [ ] Recorded answer
   - [ ] Did transformation happen?

3. **Emotional resonance**:
   - [ ] Which stop moved you most?
   - [ ] Did you feel Lottie's regret?
   - [ ] Did you hear Elderon's witness?

4. **Practical aspects**:
   - [ ] Audio clarity throughout?
   - [ ] Comfortable volume levels?
   - [ ] Walking pace matched narration?
   - [ ] Would you recommend this?

---

## PART 6: SSSML & AUDIO TAGS VALIDATION

### 6.1 SSML Pause Rendering

For files with `<break>` tags, verify:

- [ ] Stop 1: 500ms pause after "Welcome to the Wilder House" sounds natural
- [ ] Stop 4: Longer pauses (600-700ms) create reverent mood
- [ ] Stop 6: Pauses feel intimate and give time for emotion
- [ ] Stop 12: Longest pauses (800-900ms) create genuine rest
- [ ] Stop 18: Final pause before "And Savannah remembers" lands powerfully

**If pauses don't render:**
- Check if model supports SSML (v3 should)
- Verify `<break time="XXXms"/>` format is exact
- May need to request SSML support in generation call

### 6.2 Emphasis Tag Rendering

For files with `<emphasis level="strong">`:

- [ ] Key phrases sound emphasized (slightly louder/slower)
- [ ] Emphasis feels natural, not robotic
- [ ] Stop 6: "geometry of grief" — is it emphasized?
- [ ] Stop 11: "Some stories refuse to end" — landed emotionally?
- [ ] Stop 18: Final "That is all the city asks" — powerful?

### 6.3 Audio Tags Context

While Audio Tags are for generation guidance (not audible):

- [ ] Does Stop 6 (Lottie) feel [vulnerable, intimate, confessional]?
- [ ] Does Stop 12 feel [calm, meditative, restorative]?
- [ ] Does Stop 18 feel [integrating, releasing, peaceful]?

If emotional quality doesn't match Audio Tags:
- Regenerate with explicit Audio Tags in API call
- Check ElevenLabs docs for Audio Tags parameter name

---

## PART 7: ARTIFACT DETECTION

### 7.1 Common ElevenLabs Artifacts to Listen For

- [ ] No robot/mechanical voice quality
- [ ] No clicking/popping sounds
- [ ] No glitches at break points
- [ ] No pitch shifts (unless intentional for emotion)
- [ ] No distortion at high-emotion moments
- [ ] No cut-off at file end
- [ ] No background noise/hum

**If artifacts detected:**
- Regenerate file
- Try different stability settings (70 is default, try 65-75)
- Check script for special characters that might confuse TTS

---

## PART 8: CONSISTENCY ACROSS PILOT FILES

**After generating all 6 pilot files:**

- [ ] **Narrator consistency**: Same woman voice across all files?
- [ ] **Lottie consistency**: Stop 6 character voice distinct but integrated?
- [ ] **Elderon consistency**: Stops 18+ feel like same voice?
- [ ] **Volume consistency**: All files at similar loudness (-16 to -12 LUFS)?
- [ ] **Emotional arc**: Does progression from Stop 1 → 6 → 11 → 18 feel coherent?
- [ ] **Pacing consistency**: Stop lengths appropriate relative to each other?

---

## PART 9: FINAL SIGN-OFF

### Pilot Phase (6 Files)

- [ ] All 6 files generated successfully
- [ ] All technical specs verified (format, bitrate, duration)
- [ ] All emotional qualities validated
- [ ] Field tested in Savannah (at least one stop)
- [ ] Listener feedback positive (transformation occurred)
- [ ] No artifacts detected
- [ ] Ready to proceed to Phase 1 (full 72 woman narrator files)

### Phase 1 Completion (72 Woman Narrator Files)

- [ ] All 72 files generated
- [ ] Spot-check 10% of files (8 files random sample)
- [ ] All walking times correct
- [ ] Emotional arc maintained across all 18 stops
- [ ] Opening/closing frames validated
- [ ] Field tested in complete walk (if possible)
- [ ] Ready to deploy to Cloudflare Pages

### Phase 2 (56 Man Narrator Files) - Future

- [ ] All 56 files generated with Havoc voice
- [ ] Consistency check: Same emotional qualities as woman narrator?
- [ ] Alternative delivery options tested
- [ ] Ready to deploy alongside woman narrator option

---

## TROUBLESHOOTING DURING QA

### Audio Too Quiet
- [ ] Regenerate with stability 75 (maximum)
- [ ] Check if system volume is low (test with different device)
- [ ] Measure loudness: if below -14 LUFS, regenerate

### Audio Too Loud/Distorted
- [ ] Regenerate with stability 65 (lower)
- [ ] Check for clipping in raw file
- [ ] Reduce similarity_boost to 70

### Emotional Quality Wrong
- [ ] Audio Tags not applied: regenerate with explicit Audio Tags in API call
- [ ] Voice doesn't match description: test different voice ID
- [ ] Pace too fast: regenerate with longer `<break>` tags
- [ ] Pace too slow: remove some `<break>` tags

### Lottie/Elderon Voice Issues
- [ ] Character voice sounds too theatrical: use lower expression intensity (0.7 instead of 0.85)
- [ ] Character voice doesn't blend: may need audio normalization after generation
- [ ] Character voice missing: confirm correct voice ID in API call

---

## SIGN-OFF DOCUMENT

When you've completed QA for a phase, fill this out:

```
Forsyth Ghost Tour v3.0 — QA Sign-Off
======================================

Phase: [PILOT / PHASE 1 / PHASE 2]
Files Tested: [Number]
Date: [YYYY-MM-DD]
Tester: [Name]

Technical Specs:
- [ ] All files format, bitrate, sample rate correct
- [ ] All durations within acceptable range
- [ ] No file corruptions or artifacts

Emotional Quality:
- [ ] Narrator tone validated for all stops
- [ ] Character voices (Lottie/Elderon) appropriately delivered
- [ ] Emotional arc intact across full tour
- [ ] Audio Tags context felt in delivery

Field Testing:
- [ ] Outdoor listening tested
- [ ] Traffic noise environment tested
- [ ] Listener emotional transformation confirmed

Sign-Off:
I certify that this phase meets world-class production standards.

Signature: _______________________
Date: _______________________

APPROVED [ ] / NEEDS REVISION [ ]
```

---

**Status**: QA framework ready, awaiting file generation  
**Next**: Generate pilot 6 files, then run through this checklist

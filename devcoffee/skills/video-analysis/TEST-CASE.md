# Video Analysis Skill - Test Case

**Purpose:** Validate the video-analysis skill works correctly in a fresh Claude Code session

**Prerequisites:**
- FFmpeg installed (`ffmpeg -version` should work)
- Test video available
- Claude Code with devcoffee plugin loaded

---

## Test Case 1: Basic Video Summary

**Objective:** Get a quick overview of a video's content and visual quality

**Test Video:** `examples/devcoffee-speedrun-game/out/video.mp4` (45 seconds, 1920x1080)

**Command to Run:**
```
Can you analyze this video and give me a summary of what it depicts?
examples/devcoffee-speedrun-game/out/video.mp4
```

**Expected Behavior:**
1. Claude recognizes the request as video analysis
2. Skill extracts 10 frames (standard mode)
3. Analyzes each frame with vision API
4. Provides comprehensive summary including:
   - Overall quality score (0-10)
   - Description of what the video shows
   - Scene-by-scene breakdown
   - Strengths and areas for improvement
   - Technical quality assessment

**Success Criteria:**
- ✅ FFmpeg extracts frames without errors
- ✅ All 10 frames analyzed successfully
- ✅ Report includes scene descriptions
- ✅ Overall score provided (7-10 for this video)
- ✅ Analysis completes in <30 minutes

**Expected Output Highlights:**
- Should identify this as a retro gaming video
- Should recognize 4 Buzzminson levels (platformer)
- Should recognize 3 Maximus phases (shooter)
- Should mention INSERT COIN intro and victory screen
- Should comment on 16-bit aesthetic and CRT effects
- Should score 9-10/10 for visual quality

---

## Test Case 2: UI/UX Focused Analysis

**Objective:** Get specific feedback on UI/UX elements

**Command to Run:**
```
Analyze the UI/UX of this video - focus on readability, layout, and user experience
examples/devcoffee-speedrun-game/out/video.mp4 --focus ui
```

**Expected Behavior:**
1. Skill runs in UI-focused mode
2. Analysis concentrates on:
   - HUD placement and visibility
   - Text readability
   - Button/menu design
   - Navigation clarity
   - Information hierarchy

**Success Criteria:**
- ✅ Analysis focuses on UI elements
- ✅ Comments on HUD consistency
- ✅ Evaluates text readability at 1920x1080
- ✅ Provides specific UI improvement suggestions

**Expected Output Highlights:**
- Should praise HUD consistency (always top bar)
- Should mention excellent readability of all text
- Should note combo meter placement (center screen)
- Should comment on score/health bar visibility

---

## Test Case 3: Quick Overview Mode

**Objective:** Get rapid feedback with minimal frames

**Command to Run:**
```
Give me a quick analysis of this video
examples/devcoffee-speedrun-game/out/video.mp4 --mode quick
```

**Expected Behavior:**
1. Skill extracts only 5 frames (quick mode)
2. Frames at: 0s, 11.25s, 22.5s, 33.75s, 45s
3. Provides high-level overview
4. Faster analysis (<15 minutes)

**Success Criteria:**
- ✅ Only 5 frames extracted
- ✅ Analysis completes faster than standard mode
- ✅ Still provides overall quality score
- ✅ Captures key scenes (intro, gameplay, victory)

---

## Test Case 4: Custom Timestamps

**Objective:** Analyze specific moments in the video

**Command to Run:**
```
Analyze these specific moments in the video:
examples/devcoffee-speedrun-game/out/video.mp4 --frames 0,22,42
```

**Expected Behavior:**
1. Extracts exactly 3 frames at specified timestamps
2. Analyzes: intro (0s), boss battle (22s), victory (42s)
3. Provides targeted feedback on those moments

**Success Criteria:**
- ✅ Exactly 3 frames extracted
- ✅ Frames match requested timestamps
- ✅ Analysis focuses on those specific scenes
- ✅ No errors about missing frames

---

## Test Case 5: Keep Frames Option

**Objective:** Verify frames are saved when requested

**Command to Run:**
```
Analyze this video and keep the extracted frames
examples/devcoffee-speedrun-game/out/video.mp4 --keep-frames --output video-frames/
```

**Expected Behavior:**
1. Creates `video-frames/` directory
2. Extracts 10 frames to that directory
3. Frames remain after analysis completes
4. Report mentions frame locations

**Success Criteria:**
- ✅ Directory created successfully
- ✅ 10 PNG files saved in directory
- ✅ Files are ~200-500KB each
- ✅ Frames viewable as images
- ✅ Report includes frame file paths

---

## Test Case 6: Error Handling - Missing FFmpeg

**Objective:** Verify graceful error handling

**Setup:** Temporarily rename ffmpeg binary or test in environment without it

**Command to Run:**
```
Analyze this video
examples/devcoffee-speedrun-game/out/video.mp4
```

**Expected Behavior:**
1. Skill detects FFmpeg is not available
2. Provides helpful error message
3. Includes installation instructions
4. Exits gracefully without crash

**Success Criteria:**
- ✅ Clear error message displayed
- ✅ Installation link provided
- ✅ No stack traces or crashes
- ✅ User knows exactly what to do

---

## Test Case 7: Error Handling - Invalid Video

**Objective:** Verify handling of corrupted or missing files

**Command to Run:**
```
Analyze this video
nonexistent-video.mp4
```

**Expected Behavior:**
1. Skill detects file doesn't exist
2. Provides clear error message
3. Suggests checking path
4. Exits gracefully

**Success Criteria:**
- ✅ "File not found" error message
- ✅ Shows the path that was checked
- ✅ No ffmpeg errors displayed
- ✅ Clean exit

---

## Test Case 8: Different Video Types

**Objective:** Verify skill works with various video formats

**Test Videos:**
- MP4 (H.264) - Primary format
- MOV (QuickTime) - Common on Mac
- WebM - Web format
- AVI - Legacy format

**Command to Run:**
```
Analyze this video
path/to/test-video.[mp4|mov|webm|avi]
```

**Expected Behavior:**
1. Skill works with all common video formats
2. FFmpeg handles format conversion automatically
3. Analysis quality consistent across formats

**Success Criteria:**
- ✅ All formats supported
- ✅ Frame extraction successful
- ✅ No format-specific errors
- ✅ Analysis quality consistent

---

## Performance Benchmarks

Based on test video (45 seconds, 1920x1080, 30fps):

**Quick Mode (5 frames):**
- Frame extraction: ~3 seconds
- Analysis: ~12-15 minutes
- Total: ~15 minutes

**Standard Mode (10 frames):**
- Frame extraction: ~5 seconds
- Analysis: ~25-30 minutes
- Total: ~30 minutes

**Detailed Mode (20 frames):**
- Frame extraction: ~8 seconds
- Analysis: ~50-60 minutes
- Total: ~60 minutes

**Storage:**
- ~300-500KB per frame (PNG)
- 10 frames = ~3-5MB total

---

## Validation Checklist

After running test cases, verify:

- [ ] Skill activates when user mentions "analyze video"
- [ ] FFmpeg integration works (frames extracted)
- [ ] Vision analysis works (frames loaded and analyzed)
- [ ] All 4 modes work (quick, standard, detailed, custom)
- [ ] All 5 focus areas work (ui, aesthetics, technical, storytelling, all)
- [ ] Error handling is graceful (missing ffmpeg, invalid file)
- [ ] Report format is comprehensive and readable
- [ ] Cleanup works (temp files deleted unless --keep-frames)
- [ ] Performance meets expectations (<30 min for standard)

---

## Common Issues & Solutions

### Issue: "FFmpeg not found"
**Solution:** Install FFmpeg: `brew install ffmpeg` (Mac) or `apt install ffmpeg` (Linux)

### Issue: Frames not extracted
**Solution:** Check video file permissions, verify path is correct

### Issue: Analysis takes too long
**Solution:** Use `--mode quick` for faster results (5 frames vs 10)

### Issue: "No video stream found"
**Solution:** File may be audio-only or corrupted, try re-encoding

### Issue: Frames blurry or low quality
**Solution:** Check source video resolution, skill outputs at source quality

---

## Expected Test Results

**Test Video (speedrun game):**
- Overall Score: 9-10/10
- Visual Consistency: 10/10
- Retro Aesthetic: 10/10
- Readability: 9-10/10
- Technical Quality: 9-10/10

**Analysis Should Identify:**
- 16-bit SNES/Genesis visual style
- CRT scanlines and pixel art
- 4 platformer levels (Buzzminson)
- 3 shooter phases (Maximus)
- INSERT COIN intro screen
- Victory celebration screen
- HUD with health/score display
- Combo system with multipliers

**Report Should Include:**
- Scene-by-scene breakdown (10 scenes)
- Strengths section (5-6 points)
- Improvement areas (3-5 points)
- Technical quality breakdown
- Actionable recommendations
- Performance metrics

---

## Notes for Testers

1. **First run may be slower** - FFmpeg needs to analyze video metadata
2. **Frame extraction is fast** - Usually <10 seconds even for long videos
3. **Analysis time depends on frame count** - More frames = longer analysis
4. **Standard mode (10 frames) is recommended** - Good balance of speed and thoroughness
5. **Custom mode is powerful** - Analyze specific scenes without extracting entire video

---

## Success Definition

The video analysis skill is working correctly if:

✅ All test cases pass without errors
✅ Analysis quality is high (detailed, accurate, actionable)
✅ Performance meets benchmarks (<30 min for standard mode)
✅ Error handling is clear and helpful
✅ Report format is readable and comprehensive
✅ Multiple video formats supported
✅ User experience is smooth and professional

---

**Last Updated:** 2026-02-06
**Test Video:** examples/devcoffee-speedrun-game/out/video.mp4
**Skill Version:** 1.0

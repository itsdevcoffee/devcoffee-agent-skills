# Video Analysis Skill - Quick Test Guide

**For testing in a fresh Claude Code session**

---

## Prerequisites

1. **Install FFmpeg** (if not already installed)
   ```bash
   # Mac
   brew install ffmpeg

   # Linux (Debian/Ubuntu)
   sudo apt install ffmpeg

   # Linux (Fedora)
   sudo dnf install ffmpeg
   ```

2. **Verify installation**
   ```bash
   ffmpeg -version
   # Should show FFmpeg version info
   ```

3. **Have the devcoffee plugin loaded** in Claude Code

---

## Quick Test (3 minutes)

### Test 1: Natural Language Request

Just ask Claude naturally:

```
Can you analyze this video and tell me what it depicts?

examples/devcoffee-speedrun-game/out/video.mp4
```

**What should happen:**
1. Claude recognizes this as a video analysis request
2. Extracts 10 frames from the video (takes ~5 seconds)
3. Analyzes each frame with vision API (~25 minutes)
4. Provides comprehensive report with:
   - Overall score (should be 9-10/10 for this video)
   - Description: Retro gaming video, 16-bit style
   - Scenes: INSERT COIN intro, platformer levels, shooter phases, victory screen
   - Technical details: CRT effects, pixel art, HUD analysis
   - Recommendations for improvement

**Expected output snippet:**
```
# Video Analysis Report

**Overall Assessment: 9.3/10** ⭐⭐⭐⭐⭐

Exceptionally polished retro gaming video with authentic 16-bit aesthetics...

## Detailed Scene-by-Scene Analysis

### Frame 1 (0.0s) - INSERT COIN Intro
**What Works:**
- Golden "DEVCOFFEE" title creates strong brand presence
- Cyan "SPEED RUN" subtitle provides perfect contrast
...
```

---

## Alternative Tests

### Quick Mode (15 minutes instead of 30)

```
Give me a quick analysis of this video

examples/devcoffee-speedrun-game/out/video.mp4 --mode quick
```

**Should extract only 5 frames and complete faster**

---

### UI-Focused Analysis

```
Review the UI and user experience of this video

examples/devcoffee-speedrun-game/out/video.mp4 --focus ui
```

**Should focus analysis on:**
- HUD placement and visibility
- Text readability
- Information hierarchy
- Navigation clarity

---

### Custom Timestamps

```
Analyze these specific moments in the video:
- Opening (0 seconds)
- Boss battle (22 seconds)
- Victory screen (42 seconds)

examples/devcoffee-speedrun-game/out/video.mp4 --frames 0,22,42
```

**Should analyze exactly 3 frames at those timestamps**

---

## Expected Results

For the test video (`examples/devcoffee-speedrun-game/out/video.mp4`):

### Video Details
- Duration: 45 seconds (1350 frames @ 30fps)
- Resolution: 1920x1080
- File size: 4.5MB
- Format: MP4 (H.264)

### Analysis Should Identify
- ✅ Retro gaming aesthetic (16-bit SNES/Genesis style)
- ✅ CRT scanlines and pixel art
- ✅ INSERT COIN arcade intro
- ✅ Character select screen
- ✅ 4 Buzzminson platformer levels (Clarify, Implement, Review, Boss)
- ✅ 3 Maximus shooter phases (Bug Detection, Simplification, Boss)
- ✅ Victory screen with score tally
- ✅ HUD with health bar, score, combo meter
- ✅ Color-coded level titles (yellow, cyan, red, orange)

### Quality Scores Should Be
- Overall: 9-10/10
- Visual Consistency: 10/10
- Retro Aesthetic: 10/10
- Readability: 9-10/10
- Technical Quality: 9-10/10

### Report Should Include
- Scene-by-scene breakdown (10 scenes for standard mode)
- Detailed "What Works" lists for each scene
- Specific improvement suggestions
- Technical quality metrics
- Actionable recommendations
- Performance metrics (extraction time, analysis time)

---

## Troubleshooting

### "FFmpeg not found"
**Solution:** Install FFmpeg using commands above, then retry

### "Video file not found"
**Solution:** Check path - file should be at `examples/devcoffee-speedrun-game/out/video.mp4`

### Skill doesn't activate
**Solution:** Try being more explicit:
```
I want to analyze this video file for quality and feedback:
examples/devcoffee-speedrun-game/out/video.mp4
```

### Analysis is slow
**Solution:** This is normal! 10-frame analysis takes ~30 minutes. For faster results:
```
--mode quick
```

---

## Success Criteria

✅ The test passes if:
1. FFmpeg extracts frames without errors
2. All frames are analyzed with vision API
3. Report includes scene descriptions and scores
4. Overall score is 9-10/10 for test video
5. Analysis identifies retro gaming theme
6. Recommendations are specific and actionable
7. Process completes in ~30 minutes (standard) or ~15 minutes (quick)

---

## Share Your Results!

After testing, please share:
- ✅ Overall score you received
- ✅ Any errors encountered
- ✅ Total analysis time
- ✅ Quality of recommendations
- ✅ Whether it correctly identified all scenes

This helps improve the skill for everyone!

---

## Next Steps

Once basic test passes, try:
1. **Test with your own video** - Any MP4, MOV, WebM, or AVI file
2. **Try different modes** - quick, standard, detailed, custom
3. **Test focus areas** - ui, aesthetics, technical, storytelling
4. **Keep frames** - Use `--keep-frames --output frames/` to inspect extracted frames
5. **Error handling** - Try with invalid paths, missing ffmpeg, etc.

---

**Questions or issues?** Open an issue in the devcoffee-agent-skills repo!

**Happy analyzing!** 🎬

# Video Analysis Skill Specification

**Created:** 2026-02-06
**Status:** Ready for Implementation
**Context:** Prototype validated successfully - see docs/research/2026-02-06-video-analysis-implementation-research.md

---

## Overview

Create a Claude Code skill that analyzes video files by extracting strategic frames and providing comprehensive visual feedback using Claude's vision capabilities. This skill enables developers to get detailed critiques of video content (UI/UX, visual quality, aesthetics, storytelling) without native video support.

---

## Prototype Validation

**Prototype completed:** 2026-02-06
**Test case:** 45-second Remotion speedrun video (1920x1080, 30fps)
**Results:** ✅ Successful - Extracted 10 frames, provided detailed analysis in ~20 minutes
**Key insight:** Strategic frame sampling (2.2% of total frames) captured complete narrative and provided actionable feedback

**Prototype location:** `examples/devcoffee-speedrun-game/analysis-frames/`

---

## Skill Specification

### Skill Name
`video-analysis` (invoked via `/video-analysis`)

### Purpose
Analyze video files and provide detailed feedback on:
- Visual quality and consistency
- UI/UX elements and readability
- Aesthetic coherence (color palette, styling)
- Narrative flow and pacing
- Scene composition and layout
- Technical issues (artifacts, glitches)
- Suggestions for improvement

### Target Users
- Video creators using Remotion
- UI/UX designers reviewing video prototypes
- Developers creating programmatic videos
- Anyone needing visual feedback on video content

---

## Technical Approach

### Core Workflow

```
Input: Video file path + sampling strategy
  ↓
Extract frames (FFmpeg)
  ↓
Analyze frames (Claude Vision API via Read tool)
  ↓
Aggregate feedback
  ↓
Output: Comprehensive analysis report
```

### Frame Extraction Strategy

**Default sampling:** Intelligent scene-based
- Analyze video metadata (duration, fps)
- Calculate strategic timestamps
- Extract 8-12 frames covering key moments

**Sampling modes:**
1. **Quick (5 frames)** - Start, 25%, 50%, 75%, End
2. **Standard (10 frames)** - Even distribution across duration
3. **Detailed (20 frames)** - Higher density for thorough analysis
4. **Custom** - User specifies exact timestamps

**Frame calculation formula:**
```python
# For standard mode (10 frames)
total_duration = video_duration_seconds
frames_to_extract = 10
interval = total_duration / (frames_to_extract - 1)
timestamps = [i * interval for i in range(frames_to_extract)]
```

### FFmpeg Commands

**Extract frame at specific timestamp:**
```bash
ffmpeg -i video.mp4 -ss HH:MM:SS -vframes 1 -q:v 2 output.png
```

**Extract multiple frames (select filter):**
```bash
ffmpeg -i video.mp4 -vf "select='eq(n\,0)+eq(n\,90)+eq(n\,180)...'" -vsync vfr frame_%03d.png
```

### Analysis Process

**Per-frame analysis:**
1. Load frame using Read tool
2. Provide context: timestamp, scene description (if available)
3. Ask Claude vision to evaluate:
   - Visual elements present
   - Readability and clarity
   - Color usage and contrast
   - Composition and layout
   - Any issues or artifacts

**Aggregation:**
1. Collect all frame analyses
2. Identify patterns and themes
3. Provide overall assessment with score
4. List strengths and improvement areas
5. Generate actionable recommendations

---

## Implementation Requirements

### Skill Structure

**File:** `devcoffee/skills/video-analysis.md`

**Frontmatter:**
```yaml
---
name: video-analysis
description: Analyze video files and provide visual feedback
trigger_keywords:
  - analyze video
  - review video
  - video feedback
  - check video quality
examples:
  - "/video-analysis path/to/video.mp4"
  - "/video-analysis path/to/video.mp4 --mode detailed"
  - "/video-analysis path/to/video.mp4 --frames 0,10,20,30,40"
---
```

### Skill Parameters

**Required:**
- `video_path` - Path to video file (relative or absolute)

**Optional:**
- `--mode` - Sampling mode: quick|standard|detailed|custom (default: standard)
- `--frames` - Custom frame timestamps in seconds (comma-separated)
- `--output` - Output directory for extracted frames (default: temp dir)
- `--keep-frames` - Keep extracted frames after analysis (default: false)
- `--focus` - Analysis focus: ui|aesthetics|technical|storytelling|all (default: all)

### Example Usage

```bash
# Standard analysis (10 frames)
/video-analysis examples/my-video/out/video.mp4

# Quick overview (5 frames)
/video-analysis examples/my-video/out/video.mp4 --mode quick

# Detailed analysis (20 frames)
/video-analysis examples/my-video/out/video.mp4 --mode detailed

# Custom timestamps (specific moments)
/video-analysis examples/my-video/out/video.mp4 --frames 0,5,10,15,20,25,30

# Focus on UI/UX
/video-analysis examples/my-video/out/video.mp4 --focus ui

# Keep frames for manual review
/video-analysis examples/my-video/out/video.mp4 --keep-frames --output analysis-output/
```

---

## Skill Implementation Steps

### Phase 1: Core Functionality

**Step 1: Parse arguments**
- Extract video path
- Validate file exists
- Parse optional parameters
- Determine sampling mode

**Step 2: Analyze video metadata**
- Use ffprobe to get: duration, fps, resolution, codec
- Calculate frame extraction timestamps based on mode
- Create temporary directory for frames

**Step 3: Extract frames**
- Build ffmpeg command based on timestamps
- Execute extraction
- Verify frames were created successfully
- Handle errors (missing ffmpeg, invalid video, etc.)

**Step 4: Analyze frames sequentially**
- For each frame:
  - Load using Read tool
  - Calculate timestamp in video (frame_number / fps)
  - Provide context to Claude vision
  - Request specific feedback based on --focus parameter
  - Store analysis results

**Step 5: Aggregate results**
- Compile all frame analyses
- Identify recurring themes (good and bad)
- Calculate overall quality score (0-10)
- Generate structured report

**Step 6: Output and cleanup**
- Display comprehensive report to user
- Save report to markdown file (optional)
- Delete temporary frames (unless --keep-frames)
- Return success status

### Phase 2: Enhanced Features (Future)

- Scene detection (auto-identify key moments)
- Motion analysis (compare consecutive frames)
- Audio transcription integration (if audio present)
- Comparative analysis (before/after iterations)
- Export to multiple formats (markdown, JSON, HTML)

---

## Output Format

### Report Structure

```markdown
# Video Analysis Report

**Video:** path/to/video.mp4
**Duration:** 45 seconds (1350 frames @ 30fps)
**Resolution:** 1920x1080
**Analyzed:** 2026-02-06 22:47:00
**Frames Analyzed:** 10 (standard mode)

---

## Overall Assessment: X.X/10

[High-level summary paragraph - 2-3 sentences]

---

## Detailed Scene Analysis

### Frame 1 (0.0s)
**Scene:** [Description]

**What Works:**
- [Positive observation 1]
- [Positive observation 2]

**Suggestions:**
- [Improvement suggestion]

**Score:** X/10

---

[Repeat for each frame]

---

## Strengths

1. [Pattern or theme that appears consistently]
2. [Another strength]
3. [etc.]

## Areas for Improvement

1. [Issue or weakness observed]
2. [Another area]
3. [etc.]

## Technical Quality

- **Visual Consistency:** X/10
- **Readability:** X/10
- **Aesthetic Coherence:** X/10
- **Technical Execution:** X/10

## Recommendations

1. [Actionable suggestion 1]
2. [Actionable suggestion 2]
3. [etc.]

---

## Appendix

**Extracted Frames:** [List of frame files if kept]
**Analysis Duration:** X minutes
**Sampling Strategy:** Standard (10 frames evenly distributed)
```

---

## Test Cases

### Test Case 1: Remotion Video (Validated)
- **Input:** `examples/devcoffee-speedrun-game/out/video.mp4`
- **Expected:** 10 frames extracted, comprehensive analysis of retro gaming aesthetic
- **Status:** ✅ Passed (prototype validation)

### Test Case 2: Short Video
- **Input:** 15-second video
- **Expected:** 5 frames (quick mode auto-selected for short videos)

### Test Case 3: Long Video
- **Input:** 5-minute video
- **Expected:** Standard 10 frames covering full duration

### Test Case 4: Custom Timestamps
- **Input:** Video with `--frames 0,10,20,30`
- **Expected:** Exactly 4 frames at specified seconds

### Test Case 5: Invalid Input
- **Input:** Non-existent file path
- **Expected:** Clear error message, graceful exit

### Test Case 6: Unsupported Format
- **Input:** Audio-only file (.mp3)
- **Expected:** Error: "Not a video file"

---

## Error Handling

### Required Error Cases

1. **FFmpeg not installed**
   - Message: "FFmpeg is required but not found. Install: https://ffmpeg.org/download.html"
   - Exit gracefully

2. **Video file not found**
   - Message: "Video file not found: [path]"
   - Suggest checking path

3. **Invalid video format**
   - Message: "Unable to process video. Supported formats: mp4, mov, avi, webm"
   - List compatible formats

4. **Frame extraction failed**
   - Message: "Failed to extract frames. Check video file integrity."
   - Provide ffmpeg error output

5. **Insufficient disk space**
   - Message: "Not enough disk space for frame extraction."
   - Estimate required space

6. **Permission denied**
   - Message: "Cannot write to output directory: [path]"
   - Suggest chmod or alternative path

---

## Success Criteria

### Functional Requirements
- ✅ Successfully extracts frames from video files
- ✅ Analyzes frames using Claude vision API
- ✅ Provides structured, actionable feedback
- ✅ Handles errors gracefully
- ✅ Supports multiple sampling modes
- ✅ Generates comprehensive reports

### Performance Requirements
- ✅ Analysis completes in <30 minutes for standard mode (10 frames)
- ✅ Frame extraction completes in <10 seconds
- ✅ Memory usage stays reasonable (<500MB)

### Usability Requirements
- ✅ Simple invocation: `/video-analysis path/to/video.mp4`
- ✅ Clear progress indicators during analysis
- ✅ Readable output format
- ✅ Helpful error messages

---

## Dependencies

### Required Tools
- **FFmpeg** - Frame extraction (check with `ffmpeg -version`)
- **FFprobe** - Video metadata (bundled with FFmpeg)
- **Claude vision API** - Frame analysis (via Read tool)

### Optional Enhancements
- **Scene detection library** - Auto-identify key moments (future)
- **Whisper** - Audio transcription (future)

---

## Reference Implementation

### Prototype Code Snippets

**Frame extraction (validated approach):**
```bash
# Extract 10 strategic frames
ffmpeg -i video.mp4 \
  -vf "select='eq(n\,0)+eq(n\,90)+eq(n\,210)+eq(n\,360)+eq(n\,510)+eq(n\,660)+eq(n\,810)+eq(n\,960)+eq(n\,1110)+eq(n\,1260)'" \
  -vsync vfr \
  frames/frame_%03d.png
```

**Frame analysis pattern:**
```typescript
// Pseudocode
for each frame in extracted_frames:
  image_data = Read(frame_path)
  analysis = analyze_with_context({
    image: image_data,
    timestamp: calculate_timestamp(frame_number, fps),
    context: "This frame shows [scene description]",
    focus_areas: ["visual_quality", "readability", "aesthetics"]
  })
  results.append(analysis)
```

---

## Related Documentation

- **Prototype validation:** `examples/devcoffee-speedrun-game/analysis-frames/`
- **Research:** `docs/research/2026-02-06-video-analysis-implementation-research.md`
- **Research:** `docs/research/2026-02-06-ai-video-analysis-capabilities.md`
- **FFmpeg MCP servers:** See research doc for existing MCP server options

---

## Future Enhancements

### Phase 2 Features
1. **Scene detection** - Auto-identify transitions, key moments
2. **Motion analysis** - Compare frame-to-frame changes
3. **Comparative analysis** - Compare multiple video versions
4. **Template library** - Pre-built analysis templates for common use cases

### Phase 3 Features
1. **MCP server integration** - Use existing FFmpeg MCP servers if available
2. **Batch processing** - Analyze multiple videos in sequence
3. **Export formats** - JSON, HTML reports with embedded images
4. **AI-powered insights** - Pattern recognition across multiple analyses

---

## Notes for Implementer

### Key Design Decisions

1. **Why frame-based approach?**
   - Claude cannot process video natively
   - Frame-based analysis is proven effective (prototype validated)
   - Provides detailed feedback impossible with native video APIs

2. **Why 10 frames as default?**
   - Balances thoroughness with speed (20 min analysis time)
   - Captures narrative arc without overwhelming user
   - Proven in prototype to tell complete story

3. **Why temporary directory?**
   - Keeps user's workspace clean
   - Frames are artifacts, not deliverables
   - Saves disk space (can be 3-5MB per frame)

4. **Why markdown output?**
   - Human-readable and version-controllable
   - Easy to share and collaborate
   - Can be converted to other formats

### Implementation Tips

1. **Start simple** - Get basic frame extraction + analysis working first
2. **Test early** - Use prototype test case to validate approach
3. **Handle errors gracefully** - Video processing can fail in many ways
4. **Show progress** - Long-running analysis needs user feedback
5. **Make output actionable** - Focus on specific, implementable suggestions

### Common Pitfalls to Avoid

1. **Over-sampling** - More frames ≠ better analysis (10 is sweet spot)
2. **Ignoring video metadata** - Duration/fps crucial for timestamp calculation
3. **Blocking on frame extraction** - Show progress, handle timeouts
4. **Generic feedback** - Provide specific observations, not platitudes
5. **Cluttering workspace** - Use temp dirs, clean up after

---

## Contact & Questions

For questions about this specification:
- Review prototype: `examples/devcoffee-speedrun-game/analysis-frames/`
- Check research docs: `docs/research/2026-02-06-*.md`
- Test with validated video: `examples/devcoffee-speedrun-game/out/video.mp4`

**Ready to implement!** This specification is based on a successful prototype with proven results.

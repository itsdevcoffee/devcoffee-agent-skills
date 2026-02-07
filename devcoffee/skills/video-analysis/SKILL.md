---
name: video-analysis
description: Analyze video files and provide visual feedback by extracting strategic frames and using Claude's vision capabilities. Trigger when user mentions "analyze video", "review video", "video feedback", "check video quality", or asks questions like "what do you think of this video?", "can you review my video?", "how does this video look?". Also trigger when user provides a video file path and asks for analysis.
metadata:
  tags: video, analysis, feedback, ffmpeg, vision, quality-review
---

# Video Analysis Skill

This skill analyzes video files by extracting strategic frames using FFmpeg and providing comprehensive visual feedback using Claude's vision capabilities.

## When to Use This Skill

Trigger this skill when the user wants to:
- Get feedback on video quality, aesthetics, or content
- Review UI/UX elements in a video
- Analyze visual consistency and narrative flow
- Check for technical issues or artifacts
- Get actionable suggestions for video improvement

## Core Workflow

```
1. Parse user request → Extract video path and parameters
2. Validate prerequisites → Check FFmpeg, video file exists
3. Analyze video metadata → Get duration, fps, resolution using ffprobe
4. Calculate frame extraction strategy → Based on mode (quick/standard/detailed/custom)
5. Extract frames → Use FFmpeg to save frames as PNG images
6. Analyze frames sequentially → Use Read tool with vision for each frame
7. Aggregate results → Compile all analyses into comprehensive report
8. Output report → Structured markdown with scores and recommendations
9. Cleanup → Remove temporary frames (unless --keep-frames)
```

## Parameters

### Required
- **video_path**: Path to video file (relative or absolute)

### Optional
- **--mode**: Sampling mode
  - `quick` - 5 frames (start, 25%, 50%, 75%, end)
  - `standard` - 10 frames evenly distributed (default)
  - `detailed` - 20 frames for thorough analysis
  - `custom` - User-specified timestamps via --frames
- **--frames**: Comma-separated timestamps in seconds (e.g., "0,5,10,15")
- **--output**: Output directory for extracted frames (default: temp dir)
- **--keep-frames**: Keep extracted frames after analysis (default: delete)
- **--focus**: Analysis focus area
  - `ui` - UI/UX elements and readability
  - `aesthetics` - Visual design, color, composition
  - `technical` - Technical quality, artifacts, encoding
  - `storytelling` - Narrative flow and pacing
  - `all` - Comprehensive analysis (default)

## Usage Examples

```bash
# Standard analysis (10 frames)
/video-analysis examples/my-video/out/video.mp4

# Quick overview (5 frames)
/video-analysis examples/my-video/out/video.mp4 --mode quick

# Detailed analysis (20 frames)
/video-analysis examples/my-video/out/video.mp4 --mode detailed

# Custom timestamps
/video-analysis examples/my-video/out/video.mp4 --frames 0,5,10,15,20,25,30

# Focus on UI/UX only
/video-analysis examples/my-video/out/video.mp4 --focus ui

# Keep frames for manual review
/video-analysis examples/my-video/out/video.mp4 --keep-frames --output analysis-output/
```

## Implementation Instructions

### Step 1: Parse Arguments and Validate

1. Extract video_path from user request
2. Parse optional parameters (mode, frames, output, keep-frames, focus)
3. Set defaults: mode=standard, focus=all, keep-frames=false
4. Convert relative path to absolute path if needed

**Validation:**
```bash
# Check if video file exists
if [ ! -f "$video_path" ]; then
  echo "Error: Video file not found: $video_path"
  exit 1
fi

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
  echo "Error: FFmpeg is required but not found."
  echo "Install from: https://ffmpeg.org/download.html"
  exit 1
fi

# Check if ffprobe is installed
if ! command -v ffprobe &> /dev/null; then
  echo "Error: ffprobe is required but not found."
  echo "ffprobe is part of FFmpeg. Install from: https://ffmpeg.org/download.html"
  exit 1
fi
```

### Step 2: Analyze Video Metadata

Use `ffprobe` to get video information:

```bash
# Check if file has a video stream
video_stream=$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=codec_type \
  -of default=noprint_wrappers=1:nokey=1 "$video_path" 2>/dev/null)

if [ "$video_stream" != "video" ]; then
  echo "Error: File does not contain a video stream."
  echo "This appears to be an audio-only file or invalid video."
  echo "Supported formats: MP4, MOV, AVI, WebM, MKV"
  exit 1
fi

# Get duration in seconds
duration=$(ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 "$video_path")

if [ -z "$duration" ] || [ "$(echo "$duration <= 0" | bc -l)" -eq 1 ]; then
  echo "Error: Unable to read video duration."
  echo "The file may be corrupted or in an unsupported format."
  exit 1
fi

# Get fps (convert fraction to decimal)
fps_fraction=$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=r_frame_rate \
  -of default=noprint_wrappers=1:nokey=1 "$video_path")

# Convert fraction (e.g., "30/1") to decimal using bc
fps=$(echo "scale=6; $fps_fraction" | bc -l)

if [ -z "$fps" ] || [ "$(echo "$fps <= 0" | bc -l)" -eq 1 ]; then
  echo "Error: Unable to read video frame rate."
  exit 1
fi

# Get resolution
resolution=$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height \
  -of csv=s=x:p=0 "$video_path")

# Get total frame count (use scale=0 for integer result)
total_frames=$(echo "scale=0; ($duration * $fps) / 1" | bc)
```

### Step 3: Calculate Frame Extraction Timestamps

**For quick mode (5 frames):**
```bash
# Calculate timestamps using bc with proper scale
timestamps=(
  "0"
  "$(echo "scale=3; $duration * 0.25" | bc)"
  "$(echo "scale=3; $duration * 0.5" | bc)"
  "$(echo "scale=3; $duration * 0.75" | bc)"
  "$(echo "scale=3; $duration * 0.99" | bc)"
)
```

**For standard mode (10 frames):**
```bash
# Calculate interval (9 intervals = 10 frames)
interval=$(echo "scale=3; $duration / 9" | bc)

# Build array of timestamps
timestamps=()
for i in {0..9}; do
  timestamp=$(echo "scale=3; $i * $interval" | bc)
  timestamps+=("$timestamp")
done
```

**For detailed mode (20 frames):**
```bash
# Calculate interval (19 intervals = 20 frames)
interval=$(echo "scale=3; $duration / 19" | bc)

# Build array of timestamps
timestamps=()
for i in {0..19}; do
  timestamp=$(echo "scale=3; $i * $interval" | bc)
  timestamps+=("$timestamp")
done
```

**For custom mode:**
```bash
# Parse comma-separated timestamps from --frames argument
IFS=',' read -ra custom_timestamps <<< "$frames_arg"

# Validate each timestamp
timestamps=()
for ts in "${custom_timestamps[@]}"; do
  # Remove whitespace
  ts=$(echo "$ts" | xargs)

  # Validate timestamp is numeric
  if ! [[ "$ts" =~ ^[0-9]+\.?[0-9]*$ ]]; then
    echo "Error: Invalid timestamp '$ts' - must be numeric"
    exit 1
  fi

  # Check timestamp is within video duration
  if [ "$(echo "$ts > $duration" | bc -l)" -eq 1 ]; then
    echo "Error: Timestamp ${ts}s exceeds video duration of ${duration}s"
    exit 1
  fi

  timestamps+=("$ts")
done

# Check max frame limit (100 frames)
if [ "${#timestamps[@]}" -gt 100 ]; then
  echo "Error: Too many frames requested (${#timestamps[@]})"
  echo "Maximum: 100 frames. Consider using standard or detailed mode."
  exit 1
fi

# Check minimum frame count
if [ "${#timestamps[@]}" -eq 0 ]; then
  echo "Error: No valid timestamps provided"
  echo "Example: --frames 0,5,10,15,20"
  exit 1
fi
```

### Step 4: Extract Frames Using FFmpeg

**Method 1: Extract individual frames (recommended for <15 frames):**
```bash
# Create temp directory
temp_dir=$(mktemp -d)

# Extract each frame
for i in "${!timestamps[@]}"; do
  timestamp=${timestamps[$i]}

  # Convert timestamp to HH:MM:SS.MS format
  time_formatted=$(printf '%02d:%02d:%06.3f' \
    $((timestamp/3600)) $((timestamp%3600/60)) $(echo "$timestamp%60" | bc -l))

  # Extract frame
  ffmpeg -ss "$time_formatted" -i "$video_path" \
    -vframes 1 -q:v 2 \
    "$temp_dir/frame_$(printf '%03d' $i).png" \
    -loglevel error
done
```

**Method 2: Extract all frames at once (for many frames):**
```bash
# Build frame number list (frame_num = timestamp * fps)
frame_numbers=""
for timestamp in "${timestamps[@]}"; do
  frame_num=$(echo "$timestamp * $fps" | bc | cut -d. -f1)
  if [ -z "$frame_numbers" ]; then
    frame_numbers="eq(n\\,$frame_num)"
  else
    frame_numbers="$frame_numbers+eq(n\\,$frame_num)"
  fi
done

# Extract all frames in one command
ffmpeg -i "$video_path" \
  -vf "select='$frame_numbers'" \
  -vsync vfr \
  "$temp_dir/frame_%03d.png" \
  -loglevel error
```

### Step 5: Analyze Frames Sequentially

For each extracted frame:

1. **Load frame using Read tool**
   ```
   Read tool: $temp_dir/frame_XXX.png
   ```

2. **Provide context to Claude vision**
   - Frame number
   - Timestamp in video (timestamp_seconds, formatted as MM:SS)
   - Total video duration for context
   - Analysis focus (from --focus parameter)

3. **Request specific feedback based on focus:**

   **For focus=all (default):**
   ```
   Analyze this frame from a video at timestamp MM:SS (X.Xs / Y.Ys total).

   Evaluate:
   1. Visual Quality: Clarity, sharpness, color balance, lighting
   2. UI/UX Elements: Readability, contrast, layout, usability
   3. Aesthetic Coherence: Design consistency, color palette, styling
   4. Composition: Scene layout, visual hierarchy, balance
   5. Technical Issues: Artifacts, glitches, encoding problems

   Provide:
   - What works well in this frame
   - Specific suggestions for improvement
   - A score out of 10
   ```

   **For focus=ui:**
   ```
   Analyze the UI/UX elements in this frame at timestamp MM:SS.

   Focus on:
   - Text readability and contrast
   - Button and interactive element visibility
   - Layout and spacing effectiveness
   - Visual hierarchy and information architecture
   - Accessibility considerations
   ```

   **For focus=aesthetics:**
   ```
   Analyze the visual aesthetics of this frame at timestamp MM:SS.

   Focus on:
   - Color palette and harmony
   - Visual style consistency
   - Design cohesion
   - Typography choices
   - Overall visual appeal
   ```

   **For focus=technical:**
   ```
   Analyze the technical quality of this frame at timestamp MM:SS.

   Focus on:
   - Image sharpness and clarity
   - Compression artifacts
   - Color banding or posterization
   - Motion blur appropriateness
   - Encoding quality issues
   ```

   **For focus=storytelling:**
   ```
   Analyze the narrative elements of this frame at timestamp MM:SS.

   Focus on:
   - Visual storytelling effectiveness
   - Pacing and timing
   - Scene composition for narrative
   - Emotional impact
   - Continuity with surrounding context
   ```

4. **Store analysis result**
   - Save structured feedback for aggregation
   - Track individual frame scores
   - Note recurring themes (positive and negative)

### Step 6: Aggregate Results

After analyzing all frames:

1. **Compile scene-by-scene analysis**
   - Organize by timestamp
   - Include individual frame scores and feedback

2. **Identify patterns and themes**
   - Strengths that appear consistently
   - Issues that recur across frames
   - Overall visual consistency

3. **Calculate overall score**
   - Average frame scores
   - Weight by importance (critical issues reduce score more)
   - Consider consistency across frames

4. **Generate recommendations**
   - Prioritize actionable suggestions
   - Focus on highest-impact improvements
   - Group by category (visual, technical, UX, etc.)

### Step 7: Output Comprehensive Report

Generate structured markdown report:

```markdown
# Video Analysis Report

**Video:** [file path]
**Duration:** X seconds (Y frames @ Z fps)
**Resolution:** WxH
**Analyzed:** YYYY-MM-DD HH:MM:SS
**Frames Analyzed:** N (mode: standard/quick/detailed/custom)
**Analysis Focus:** all/ui/aesthetics/technical/storytelling

---

## Overall Assessment: X.X/10

[2-3 sentence high-level summary of video quality, noting key strengths and primary areas for improvement]

---

## Detailed Scene Analysis

### Frame 1 (0:00 - 0.0s)
**Scene:** [Brief description of what's visible]

**What Works:**
- [Specific positive observation]
- [Another strength]

**Suggestions:**
- [Specific improvement recommendation]

**Score:** X/10

---

### Frame 2 (0:XX - X.Xs)
[Repeat structure]

---

[Continue for all frames...]

---

## Summary

### Strengths
1. [Recurring positive pattern or consistent strength]
2. [Another overall strength]
3. [Additional positive observation]

### Areas for Improvement
1. [Key issue or weakness observed across frames]
2. [Another improvement opportunity]
3. [Additional suggestion]

### Technical Quality Breakdown
- **Visual Consistency:** X/10 - [Brief note]
- **Readability:** X/10 - [Brief note]
- **Aesthetic Coherence:** X/10 - [Brief note]
- **Technical Execution:** X/10 - [Brief note]

---

## Recommendations

### High Priority
1. [Most impactful actionable suggestion]
2. [Second most important recommendation]

### Medium Priority
1. [Helpful but less critical suggestion]
2. [Another medium priority item]

### Nice to Have
1. [Polish or enhancement suggestion]
2. [Optional improvement]

---

## Appendix

**Extracted Frames:** [temp_dir path if --keep-frames, otherwise "Deleted after analysis"]
**Analysis Duration:** X minutes Y seconds
**Sampling Strategy:** [Description of frame selection approach]
**Focus Area:** [all/ui/aesthetics/technical/storytelling]
```

### Step 8: Cleanup

```bash
# If --keep-frames flag NOT set, delete temporary frames
if [ "$keep_frames" = false ]; then
  rm -rf "$temp_dir"
fi

# If --keep-frames IS set and --output specified, move frames
if [ "$keep_frames" = true ] && [ -n "$output_dir" ]; then
  mkdir -p "$output_dir"
  mv "$temp_dir"/* "$output_dir/"
  rm -rf "$temp_dir"
fi
```

## Error Handling

### Required Error Checks

**1. FFmpeg not installed:**
```
Error: FFmpeg is required but not found.

FFmpeg is needed to extract frames from video files.
Install from: https://ffmpeg.org/download.html

Installation quick start:
- macOS: brew install ffmpeg
- Ubuntu/Debian: sudo apt-get install ffmpeg
- Windows: Download from ffmpeg.org
```

**2. Video file not found:**
```
Error: Video file not found: [path]

Please check:
- File path is correct
- File exists at the specified location
- You have read permissions for the file

Tip: Use absolute paths or paths relative to current directory.
```

**3. Invalid video format:**
```
Error: Unable to process video file.

This might be due to:
- Unsupported video format
- Corrupted video file
- File is not a video (audio-only, image, etc.)

Supported formats: MP4, MOV, AVI, WebM, MKV
Try converting your video to MP4 format.
```

**4. Frame extraction failed:**
```
Error: Failed to extract frames from video.

Possible causes:
- Video file is corrupted
- Insufficient disk space
- Invalid timestamps specified
- FFmpeg error (see details below)

FFmpeg output:
[Include stderr from ffmpeg command]
```

**5. Insufficient disk space:**
```
Error: Not enough disk space for frame extraction.

Frame extraction requires temporary storage:
- Quick mode (5 frames): ~10-25 MB
- Standard mode (10 frames): ~20-50 MB
- Detailed mode (20 frames): ~40-100 MB

Estimated space needed: X MB
Available space: Y MB

Free up disk space and try again.
```

**6. Permission denied:**
```
Error: Cannot write to output directory: [path]

Please check:
- Directory exists
- You have write permissions
- Parent directory allows file creation

Try:
- Using a different output directory
- Running with appropriate permissions
- Creating the directory first: mkdir -p [path]
```

**7. Invalid timestamps:**
```
Error: Custom timestamps are invalid.

Issue: [specific problem - e.g., "timestamp 65s exceeds video duration of 45s"]

Requirements for --frames parameter:
- Comma-separated values: "0,10,20,30"
- Timestamps in seconds (can include decimals)
- All timestamps must be within video duration
- Timestamps should be in ascending order

Example: --frames 0,5.5,10,15.25,20
```

**8. FFprobe failed:**
```
Error: Unable to read video metadata.

This usually indicates:
- Corrupted or incomplete video file
- Unsupported codec
- File is not a valid video

Try:
- Playing the video in a media player to verify it works
- Converting to a standard format (H.264 MP4)
- Using a different video file
```

## Performance Expectations

### Analysis Duration (Standard Mode - 10 frames)

| Video Length | Frame Extraction | Analysis Time | Total Time |
|--------------|------------------|---------------|------------|
| 15-30 sec    | ~3-5 sec         | ~15-20 min    | ~15-20 min |
| 30-60 sec    | ~5-10 sec        | ~15-20 min    | ~15-20 min |
| 1-3 min      | ~5-10 sec        | ~15-25 min    | ~15-25 min |
| 3-5 min      | ~5-15 sec        | ~15-25 min    | ~15-25 min |

*Analysis time is primarily determined by number of frames, not video length*

### Frame Extraction Performance

- **Quick mode (5 frames):** ~2-5 seconds
- **Standard mode (10 frames):** ~5-10 seconds
- **Detailed mode (20 frames):** ~10-20 seconds

### Storage Requirements

Per frame: ~2-5 MB (PNG format, depends on resolution)

- **Quick mode:** ~10-25 MB temporary storage
- **Standard mode:** ~20-50 MB temporary storage
- **Detailed mode:** ~40-100 MB temporary storage

## Best Practices

### When to Use Each Mode

**Quick mode (5 frames):**
- Short videos (<30 seconds)
- Initial rough assessment
- When time is limited
- Checking specific issue or aspect

**Standard mode (10 frames) - Recommended:**
- Most use cases
- Comprehensive analysis
- Balanced speed/thoroughness
- Videos 30 seconds to 5 minutes

**Detailed mode (20 frames):**
- Long videos (>3 minutes)
- Detailed quality review
- Animation-heavy content
- When thoroughness is critical

**Custom mode:**
- Analyzing specific moments
- Comparing before/after changes
- Focus on known problem areas
- Following up on specific feedback

### Frame Sampling Strategy

The skill automatically distributes frames evenly across the video duration:
- **First frame:** Always at 0s (opening)
- **Last frame:** At 99% of duration (ending without black frames)
- **Middle frames:** Evenly spaced intervals

This ensures comprehensive coverage of the entire video narrative.

### Focus Area Selection

**Use focus=ui when:**
- Creating UI/UX demos
- Building tutorial videos
- Reviewing interface designs
- Checking text readability

**Use focus=aesthetics when:**
- Reviewing visual design
- Evaluating brand consistency
- Checking color grading
- Assessing overall visual appeal

**Use focus=technical when:**
- Debugging encoding issues
- Checking export quality
- Identifying compression artifacts
- Validating technical specifications

**Use focus=storytelling when:**
- Reviewing narrative videos
- Checking pacing and flow
- Evaluating emotional impact
- Assessing scene transitions

**Use focus=all when:**
- Comprehensive review needed
- First-time analysis
- Not sure what to focus on
- Want complete feedback

## Tips for Better Results

1. **Use high-quality source videos:**
   - Higher resolution = better analysis
   - Clean encoding = more accurate feedback

2. **Choose appropriate mode:**
   - Don't over-sample (more frames ≠ better feedback)
   - Standard mode (10 frames) is usually optimal

3. **Keep frames for iteration:**
   - Use --keep-frames when you plan to make changes
   - Compare before/after analyses

4. **Focus your analysis:**
   - Use --focus to get targeted feedback
   - More specific = more actionable suggestions

5. **Analyze at key milestones:**
   - First draft: Quick mode for initial feedback
   - Revision: Standard mode for comprehensive review
   - Final polish: Detailed mode for quality assurance

## Known Limitations

1. **No audio analysis:** This skill only analyzes visual content
2. **No motion analysis:** Each frame analyzed independently (no motion tracking)
3. **Sampling gaps:** Even detailed mode only sees ~0.5-3% of total frames
4. **Context limitations:** Individual frames lack full context of surrounding motion
5. **Processing time:** Analysis of 10+ frames takes 15-30 minutes

## Future Enhancements

Potential improvements for future versions:
- Scene detection for intelligent frame selection
- Motion analysis comparing consecutive frames
- Audio transcription and sync analysis
- Batch processing for multiple videos
- Comparative analysis (before/after iterations)
- Export to JSON/HTML formats
- Integration with video MCP servers

## Related Documentation

- **Specification:** docs/context/video-analysis-skill-specification.md
- **Prototype research:** docs/research/2026-02-06-video-analysis-implementation-research.md
- **AI video analysis capabilities:** docs/research/2026-02-06-ai-video-analysis-capabilities.md
- **FFmpeg documentation:** https://ffmpeg.org/documentation.html

---

## Quick Reference

### Minimal invocation:
```bash
/video-analysis path/to/video.mp4
```

### Most common options:
```bash
# Quick check (5 frames)
/video-analysis video.mp4 --mode quick

# Standard analysis (10 frames)
/video-analysis video.mp4

# Detailed review (20 frames)
/video-analysis video.mp4 --mode detailed

# UI focus
/video-analysis video.mp4 --focus ui
```

### Full example:
```bash
/video-analysis examples/my-project/out/final-video.mp4 \
  --mode detailed \
  --focus all \
  --keep-frames \
  --output analysis-2026-02-06/
```

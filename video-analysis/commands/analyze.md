---
name: video-analysis
description: Analyze video files and provide comprehensive visual feedback using FFmpeg frame extraction and Claude vision API. Extracts strategic frames and analyzes quality, UI/UX, aesthetics, and technical execution.
examples:
  - /video-analysis path/to/video.mp4
  - /video-analysis examples/my-video.mp4 --mode quick
  - /video-analysis path/to/video.mp4 --focus ui
  - /video-analysis path/to/video.mp4 --frames 0,10,20,30
---

# Video Analysis Command

You are executing the video-analysis command. Follow the video-analysis skill to analyze the user's video file.

## User Request

The user has requested video analysis. Extract the video path and any optional parameters from their request.

## Parameters

**Required:**
- Video file path (MP4, MOV, WebM, AVI)

**Optional:**
- `--mode` - Sampling mode: quick (5 frames), standard (10 frames), detailed (20 frames), custom
- `--frames` - Custom timestamps in seconds (e.g., "0,5,10,15,20")
- `--focus` - Analysis focus: ui, aesthetics, technical, storytelling, all (default)
- `--keep-frames` - Keep extracted frames after analysis
- `--output` - Directory for extracted frames

## Execution

Follow the complete workflow defined in the video-analysis skill:

1. Parse arguments and validate video file
2. Check FFmpeg is installed
3. Extract video metadata (duration, fps, resolution)
4. Calculate frame timestamps based on mode
5. Extract frames using FFmpeg
6. Analyze each frame with Claude vision API
7. Aggregate results into comprehensive report
8. Output structured markdown report
9. Cleanup temporary files (unless --keep-frames)

## Output Format

Provide a comprehensive markdown report including:
- Overall quality score (0-10)
- Scene-by-scene analysis for each frame
- Strengths and improvement areas
- Technical quality breakdown
- Actionable recommendations
- Performance metrics

Refer to the video-analysis skill documentation for complete implementation details.

# Video Analysis Plugin

AI-powered video analysis using FFmpeg frame extraction and Claude vision API.

## Installation

```bash
# Add marketplace
/plugin marketplace add itsdevcoffee/devcoffee-agent-skills

# Install video-analysis plugin
/plugin install video-analysis@devcoffee-marketplace

# Install FFmpeg (if not already installed)
# Mac: brew install ffmpeg
# Linux (Debian/Ubuntu): sudo apt install ffmpeg
# Linux (Fedora/RHEL): sudo dnf install ffmpeg
# Linux (Arch): sudo pacman -S ffmpeg
```

## Quick Start

```bash
# Analyze a video
/video-analysis path/to/video.mp4

# Or ask naturally:
"Can you analyze this video and give me feedback?"
path/to/video.mp4
```

## What It Does

Extracts strategic frames from your video and analyzes them with Claude's vision API to provide:
- Overall quality score (0-10)
- Scene-by-scene analysis
- UI/UX feedback
- Visual quality assessment
- Actionable recommendations

## Modes

**Quick (5 frames, ~15 min):**
```
/video-analysis video.mp4 --mode quick
```

**Standard (10 frames, ~30 min) - default:**
```
/video-analysis video.mp4
```

**Detailed (20 frames, ~60 min):**
```
/video-analysis video.mp4 --mode detailed
```

**Custom timestamps:**
```
/video-analysis video.mp4 --frames 0,10,20,30
```

## Focus Areas

```bash
# UI/UX analysis
/video-analysis video.mp4 --focus ui

# Visual aesthetics
/video-analysis video.mp4 --focus aesthetics

# Technical quality
/video-analysis video.mp4 --focus technical

# Narrative flow
/video-analysis video.mp4 --focus storytelling
```

## Documentation

- [Complete Guide](./skills/video-analysis/README.md)
- [Quick Test Guide](./skills/video-analysis/QUICK-TEST.md)
- [Test Cases](./skills/video-analysis/TEST-CASE.md)

## Example Output

```markdown
# Video Analysis Report

**Overall Assessment: 9.3/10** ⭐⭐⭐⭐⭐

Exceptional video with authentic retro aesthetics...

## Scene Analysis
### Frame 1 (0.0s)
**Score:** 9.6/10
**What Works:**
- Clear visual hierarchy
- Excellent color contrast
...
```

## Requirements

- FFmpeg (for frame extraction)
- ~3-5MB disk space for temp frames
- Video file (MP4, MOV, WebM, AVI)

## Performance

| Mode | Frames | Time |
|------|--------|------|
| Quick | 5 | ~15 min |
| Standard | 10 | ~30 min |
| Detailed | 20 | ~60 min |

## License

MIT

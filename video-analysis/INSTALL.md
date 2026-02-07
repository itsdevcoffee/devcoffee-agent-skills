# Video Analysis - Installation Guide

**For users who just want video analysis (no code review tools)**

---

## 3 Simple Steps

### Step 1: Add Marketplace

```bash
/plugin marketplace add itsdevcoffee/devcoffee-agent-skills
```

### Step 2: Install Plugin

```bash
/plugin install video-analysis@devcoffee-marketplace
```

### Step 3: Install FFmpeg

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
# Debian/Ubuntu
sudo apt install ffmpeg

# Fedora/RHEL/CentOS
sudo dnf install ffmpeg

# Arch Linux
sudo pacman -S ffmpeg

# openSUSE
sudo zypper install ffmpeg
```

**Windows:**
- Download from https://ffmpeg.org/download.html
- Add to PATH

**Verify installation:**
```bash
ffmpeg -version
```

---

## You're Ready!

Test it:
```
Can you analyze this video?
examples/devcoffee-speedrun-game/out/video.mp4
```

Or:
```
/video-analysis path/to/your-video.mp4
```

---

## What You Get

- ✅ AI-powered video analysis
- ✅ 4 sampling modes (quick/standard/detailed/custom)
- ✅ 5 focus areas (UI/aesthetics/technical/storytelling/all)
- ✅ Comprehensive markdown reports with scores

## What You DON'T Need

- ❌ `devcoffee` plugin (only for code review)
- ❌ `feature-dev` plugin (only for maximus)
- ❌ `code-simplifier` plugin (only for maximus)
- ❌ `remotion-max` plugin (only for Remotion creation)

---

**Total install time:** ~2 minutes
**First analysis:** ~30 minutes for 10-frame standard mode

See [README.md](./README.md) for full documentation.

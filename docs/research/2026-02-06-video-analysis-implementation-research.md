# Video Analysis Implementation Research for Claude Code

**Date:** 2026-02-06
**Research Focus:** How to implement video analysis capabilities in Claude Code CLI

## Executive Summary

This research explores the landscape of video analysis integration with Claude Code, covering existing MCP servers, tool integrations, workflow design, frame sampling best practices, and potential plugin/skill development approaches.

## 1. Existing MCP Servers for Video Processing

### 1.1 FFmpeg-Based MCP Servers

Multiple FFmpeg-based MCP servers exist with frame extraction capabilities:

#### **video-creator/ffmpeg-mcp**
- **Repository:** https://github.com/video-creator/ffmpeg-mcp
- **Features:**
  - `extract_frames_from_video` function
  - Supports extraction at configurable intervals (fps parameter)
  - fps=0: extracts all frames
  - fps=1: one frame per second
  - fps=N: one frame every N seconds
  - Output formats: PNG, JPG, WEBP
  - Supports video search, tailoring, stitching, playback, clip, overlay, concat
- **LobeHub:** https://lobehub.com/mcp/video-creator-ffmpeg-mcp

#### **kevinwatt/ffmpeg-mcp-lite**
- **Repository:** https://github.com/kevinwatt/ffmpeg-mcp-lite
- **Features:**
  - Frame extraction as images
  - Video merging, audio extraction
  - Multiple format support
  - Lightweight implementation
- **Glama:** https://glama.ai/mcp/servers/@kevinwatt/ffmpeg-mcp-lite

#### **sworddut/ffmpeg-helper**
- **Features:**
  - Frame extraction capabilities
  - Video details retrieval
  - Format conversion, audio extraction
  - Video trimming, watermark addition
- **PulseMCP:** https://www.pulsemcp.com/servers/sworddut-ffmpeg-helper

#### **misbahsy/video-audio-mcp**
- **Repository:** https://github.com/misbahsy/video-audio-mcp
- **Features:** FFmpeg-powered basic video and audio editing

**Requirements:** All FFmpeg MCP servers require FFmpeg to be installed on the system.

### 1.2 AI-Powered Video Analysis MCP Servers

#### **Video Analysis Toolkit**
- **URL:** https://mcpmarket.com/tools/skills/video-analysis-toolkit
- **Features:**
  - Analyzes and extracts structured insights from video files
  - AI-powered understanding
  - Timestamped key moment identification
  - Supports: MP4, MOV, WebM
  - Interprets and extracts deep insights from video content

#### **MCP Video Parser**
- **Developer:** michaelbaker-dev
- **Glama:** https://glama.ai/mcp/servers/@michaelbaker-dev/mcpVideoParser
- **Features:**
  - AI vision models to process, analyze, and query video content
  - Natural language queries
  - Search by relative time or specific timestamps
  - Search by location and content
  - Uses vision LLMs (Llava)
  - Requires ffmpeg for video processing

#### **Qwen3 Video Blaxel MCP**
- **LobeHub:** https://lobehub.com/mcp/adamanz-qwen-video-blaxel-mcp
- **Features:**
  - Enables Claude and other AI agents to analyze videos and images
  - Uses Qwen3-VL-8B-Instruct deployed on Blaxel
  - Video analysis via URL with custom prompts

#### **Vision MCP Server (Z.ai)**
- **Documentation:** https://docs.z.ai/devpack/mcp/vision-mcp-server
- **Features:**
  - Inspect videos (local/remote ≤8 MB)
  - Supported formats: MP4, MOV, M4V
  - Describe scenes, moments, and entities
  - Integration with Claude Code via local file references
- **Blog:** https://jpcaparas.medium.com/claude-code-with-z-ai-vision-mcp-master-the-full-toolbelt-4447c2f953a0

#### **YouTube MCP Servers**
- **hancengiz/youtube-transcript-mcp**
  - Repository: https://github.com/hancengiz/youtube-transcript-mcp
  - Features: Extract, summarize, and analyze YouTube video transcripts
  - Works with Claude Code or any MCP-enabled AI tool
- **YouTube MCP Server (playbooks)**
  - URL: https://playbooks.com/mcp/youtube
  - Features: YouTube video processing and analysis

## 2. Tool Integration Options

### 2.1 FFmpeg
- **Industry standard** for video processing
- Command-line tool for frame extraction
- Widely supported across platforms
- Already integrated into multiple MCP servers
- Example command: `ffmpeg -i video.mp4 -vf fps=1 frame_%04d.png`

### 2.2 OpenCV
- **Not found** in current Claude Code ecosystem
- Python-based computer vision library
- Powerful for advanced frame analysis
- Would require Python MCP server implementation
- Use cases: scene detection, object tracking, motion analysis

### 2.3 Remotion
- **Purpose:** Video *creation*, not analysis
- Existing in this repository: `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/remotion-max/`
- Features Mediabunny for frame extraction
- React-based programmatic video framework
- Skills available:
  - `remotion-best-practices/rules/extract-frames.md`
  - Uses Mediabunny library for frame extraction
  - Can extract frames at specific timestamps
  - Supports dynamic timestamp calculation

### 2.4 Mediabunny (Remotion Ecosystem)
Based on `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/remotion-max/skills/remotion-best-practices/rules/extract-frames.md`:

```typescript
// Core functionality
extractFrames({
  src: string,
  timestampsInSeconds: number[] | function,
  onVideoSample: (sample: VideoSample) => void,
  signal?: AbortSignal
})
```

**Features:**
- Extract frames at specific timestamps
- Dynamic timestamp calculation based on video metadata
- Canvas-based frame rendering
- AbortSignal support for cancellation
- Filmstrip generation capabilities

**Limitations:**
- Browser-based (requires canvas API)
- Not suitable for CLI-only environments
- Designed for video creation workflows, not analysis

## 3. Ideal Video Analysis Workflow for Claude Code

### 3.1 Proposed Architecture

```
User Input (Video Path)
    ↓
Frame Extraction (MCP Server)
    ↓
Frame Selection/Sampling
    ↓
Claude Vision API (Frame Analysis)
    ↓
Aggregated Insights
    ↓
Structured Report
```

### 3.2 Workflow Steps

1. **Video Input**
   - User provides local file path or URL
   - Validate file format (MP4, MOV, WebM, etc.)
   - Check file size constraints

2. **Frame Extraction**
   - Use FFmpeg MCP server or dedicated video analysis MCP
   - Extract frames based on sampling strategy
   - Save frames to temporary directory

3. **Frame Analysis**
   - Send frames to Claude's vision API
   - Process in batches (Claude API supports up to 100 images per request)
   - Extract insights per frame

4. **Aggregation**
   - Compile frame-level insights
   - Identify patterns and key moments
   - Generate timestamped annotations

5. **Report Generation**
   - Create coherent narrative
   - Include visual references
   - Provide actionable feedback

### 3.3 Claude Code Integration Patterns

Based on official documentation research:

**MCP Server Configuration:**
```json
{
  "mcpServers": {
    "video-analysis": {
      "command": "node",
      "args": ["/path/to/video-analysis-server/index.js"]
    }
  }
}
```

**Plugin Structure:**
- Plugins can bundle MCP servers
- Automatic tool provision when enabled
- Server lifecycle management handled by Claude Code

## 4. Frame Sampling Best Practices

### 4.1 Research Findings

Based on academic and industry research:

#### **Uniform Sampling**
- **Method:** Select every Nth frame
- **Best for:** Static content, consistent scenes
- **Example:** Every 10th frame, or 1 frame per second
- **Pros:** Simple, predictable, computationally efficient
- **Cons:** May miss important moments between samples

#### **Keyframe Extraction**
- **Method:** Detect and extract visually significant frames
- **Best for:** Dynamic content with scene changes
- **Techniques:**
  - Shot boundary detection
  - Visual saliency models
  - Motion-based sampling
- **Metrics:** Sharpness, luminance, temporal diversity

#### **Adaptive Sampling**
- **Short videos:** Adaptive thresholding
- **Mid-length videos:** Hybrid strategies
- **Long videos:** Interval-based splitting
- **Framework:** Dynamically adjust based on video characteristics

#### **Scene Detection**
- **Method:** Segment video into scenes, extract representative frames
- **Approach:** Lightweight scoring modules evaluate sampled frames
- **Scoring:** Composite metric of:
  - Perceptual sharpness
  - Luminance balance
  - Temporal spread

#### **Position Sampling**
- **Method:** Extract frames at specific positions (first, middle, last)
- **Best for:** Quick overview or thumbnail generation
- **Computational cost:** Very low

### 4.2 Recommendations for Claude Code

**For General Analysis:**
- Extract frames at 3-5 second intervals
- Typical 60-second video: 12-20 frames
- Balances coverage with API limits

**For Detailed Analysis:**
- 1 frame per second
- Use scene detection when available
- Focus on frames with high information density

**For Quick Overview:**
- Position-based: first, 25%, 50%, 75%, last frames
- Minimum 5 frames for meaningful analysis

**API Constraints:**
- Claude API: Up to 100 images per request (API)
- Claude.ai: Up to 20 images per request
- Heavy preview: Up to 50 frames (zipped archive)
- Each frame counts toward image limit

## 5. Building a Claude Code Video Analysis Plugin/Skill

### 5.1 Architecture Options

#### **Option 1: MCP Server Plugin**
```
video-analysis-plugin/
├── package.json
├── index.js (MCP server)
├── skills/
│   └── analyze-video/
│       ├── index.md (skill documentation)
│       └── rules/
│           ├── frame-extraction.md
│           ├── scene-analysis.md
│           └── report-generation.md
└── lib/
    ├── frame-extractor.js
    ├── frame-sampler.js
    └── analyzer.js
```

**Features:**
- `extract_frames` tool
- `analyze_video` tool
- `sample_frames` tool
- Bundled MCP server
- FFmpeg integration

#### **Option 2: Pure Skill (No MCP Server)**
```
video-analysis-skill/
├── index.md
├── rules/
│   ├── using-ffmpeg-mcp.md
│   ├── frame-sampling-strategies.md
│   ├── analysis-workflow.md
│   └── report-template.md
└── examples/
    ├── basic-analysis.md
    └── scene-detection.md
```

**Features:**
- Instructions for using existing FFmpeg MCP servers
- Best practices for frame sampling
- Analysis prompt templates
- Report generation guidelines

### 5.2 Proposed Tool Capabilities

#### **Tool 1: `extract_video_frames`**
```typescript
{
  video_path: string,
  strategy: "uniform" | "keyframe" | "adaptive" | "position",
  interval_seconds?: number,
  max_frames?: number,
  output_dir?: string
}
```

**Returns:**
- Array of frame paths
- Frame metadata (timestamp, resolution, file size)

#### **Tool 2: `analyze_video_frames`**
```typescript
{
  frame_paths: string[],
  analysis_type: "general" | "scene" | "object" | "action",
  prompt?: string
}
```

**Returns:**
- Per-frame analysis
- Aggregated insights
- Timestamped annotations

#### **Tool 3: `generate_video_report`**
```typescript
{
  analysis_results: AnalysisResult[],
  format: "markdown" | "json" | "html",
  include_thumbnails: boolean
}
```

**Returns:**
- Formatted report
- Visual references
- Key findings summary

### 5.3 Implementation Considerations

**Dependencies:**
- FFmpeg (system requirement)
- Node.js MCP server framework
- Image processing library (sharp, jimp)
- Temporary file management

**Challenges:**
- File size limits (Claude API: 8 MB for videos via Vision MCP)
- API rate limits
- Batch processing coordination
- Temporary storage cleanup

**Best Practices:**
- Stream processing for large videos
- Incremental analysis with progress reporting
- Configurable frame quality/compression
- Automatic cleanup of temporary frames

## 6. Existing Solutions and Projects

### 6.1 Remotion + Claude Code
- **Purpose:** Video *creation*, not analysis
- **GitHub Examples:**
  - https://github.com/wshuyi/remotion-video-skill
  - https://github.com/digitalsamba/claude-code-video-toolkit
  - https://github.com/MushroomFleet/Remotion-Claude-Code
- **Features:**
  - Programmatic video generation
  - React-based compositions
  - AI-assisted video creation
- **Medium Article:** https://medium.com/@joe.njenga/claude-code-can-now-create-videos-with-this-one-skill-that-i-just-tested-e8a6a40e7e89

### 6.2 Video Analysis Projects

#### **claude-code-video-toolkit**
- **Repository:** https://github.com/digitalsamba/claude-code-video-toolkit
- **Description:** AI-native video production toolkit
- **Technologies:**
  - Remotion (video framework)
  - ElevenLabs (voice synthesis)
  - FFmpeg (video processing)
  - Playwright (browser automation)
- **Note:** Focus on production, not analysis

#### **Second Brain Skills**
- **Repository:** https://github.com/coleam00/second-brain-skills
- **Description:** Collection of Claude Skills for knowledge management
- **Relevance:** Plugin architecture examples

### 6.3 Documentation and Guides

**Official Resources:**
- Claude Code MCP Docs: https://code.claude.com/docs/en/mcp
- Model Context Protocol Docs: https://modelcontextprotocol.io/docs/develop/build-server
- Remotion AI Skills: https://www.remotion.dev/docs/ai/skills

**Community Guides:**
- Top 10 MCP Servers: https://apidog.com/blog/top-10-mcp-servers-for-claude-code/
- Claude Code Complete Guide 2026: https://www.jitendrazaa.com/blog/ai/claude-code-complete-guide-2026-from-basics-to-advanced-mcp-2/
- MCPcat Setup Guide: https://mcpcat.io/guides/adding-an-mcp-server-to-claude-code/

**Plugin Development:**
- MCP Toolkit Docker: https://www.docker.com/blog/add-mcp-servers-to-claude-code-with-mcp-toolkit/
- SailPoint Integration: https://developer.sailpoint.com/docs/extensibility/mcp/integrations/claude-code/
- KSRED Setup Guide: https://www.ksred.com/claude-code-as-an-mcp-server-an-interesting-capability-worth-understanding/

## 7. Recommendations

### 7.1 Immediate Next Steps

1. **Test Existing MCP Servers**
   - Install and test `video-creator/ffmpeg-mcp`
   - Evaluate frame extraction quality and performance
   - Document integration with Claude Code

2. **Prototype Skill**
   - Create a pure skill (no MCP server) for video analysis
   - Use existing FFmpeg MCP servers
   - Document workflow and best practices

3. **Frame Sampling Experiments**
   - Test different sampling strategies
   - Measure Claude API performance with various frame counts
   - Optimize for quality vs. cost

### 7.2 Long-Term Development

1. **Custom MCP Server**
   - Build specialized video analysis MCP server
   - Integrate scene detection
   - Implement intelligent frame sampling
   - Add caching and optimization

2. **Plugin Development**
   - Bundle MCP server with skill
   - Provide seamless user experience
   - Include example workflows
   - Create comprehensive documentation

3. **Advanced Features**
   - Transcript integration (audio + visual)
   - Object tracking across frames
   - Action recognition
   - Comparative analysis (multiple videos)

### 7.3 Technical Architecture

**Recommended Stack:**
- **Frame Extraction:** FFmpeg via MCP server
- **Frame Selection:** Node.js-based sampling logic
- **Analysis:** Claude Vision API via built-in tools
- **Reporting:** Markdown with embedded thumbnails
- **Storage:** Temporary directory with automatic cleanup

**Skill Structure:**
```
video-analysis/
├── index.md (main skill entry point)
├── rules/
│   ├── frame-extraction-guide.md
│   ├── sampling-strategies.md
│   ├── analysis-prompts.md
│   └── report-templates.md
├── examples/
│   ├── tutorial-video-analysis.md
│   ├── presentation-review.md
│   └── screen-recording-analysis.md
└── agents/
    ├── video-analyzer.md
    └── frame-processor.md
```

## 8. Gaps and Limitations

### 8.1 Current Limitations

1. **No Native Video Support**
   - Claude cannot directly process video files
   - Must extract frames first
   - Adds complexity and latency

2. **File Size Constraints**
   - Vision MCP: 8 MB limit for videos
   - Larger videos require local processing
   - Frames must be managed separately

3. **API Rate Limits**
   - Batch processing may hit rate limits
   - Need intelligent throttling
   - Cost considerations for long videos

4. **No Audio Analysis**
   - Frame-based analysis misses audio content
   - Transcript integration needed
   - Multimodal analysis requires separate tools

### 8.2 Missing Capabilities

1. **Scene Detection MCP**
   - No dedicated scene detection MCP server found
   - Would improve frame sampling quality
   - Could reduce redundant frames

2. **Object Tracking**
   - No cross-frame object tracking
   - Each frame analyzed independently
   - Temporal relationships not captured

3. **Performance Optimization**
   - No frame caching mechanisms
   - Redundant processing for similar frames
   - No intelligent frame pre-filtering

## 9. References

### Academic Research
- Scene Detection Policies and Keyframe Extraction: https://arxiv.org/html/2506.00667v1
- Adaptive Keyframe Sampling: https://arxiv.org/html/2502.21271v1
- Frame Sampling Best Practices: https://milvus.io/ai-quick-reference/what-are-best-practices-for-frame-sampling-and-selection

### Tools and Platforms
- Video Editor (FFMpeg) MCP: https://www.pulsemcp.com/servers/kush36agrawal-video-editor
- FFmpeg MCP Servers: https://glama.ai/mcp/servers/categories/image-and-video-processing
- Claude Vision Docs: https://platform.claude.com/docs/en/build-with-claude/vision

### Implementation Guides
- Claude Using Images, Audio, and Video: https://www.datastudios.org/post/claude-using-images-audio-and-video-in-practical-workflows
- Can Claude Analyze Video: https://vomo.ai/blog/can-claude-analyze-video
- YouTube Summary with Claude: https://notegpt.io/blog/youtube-summary-with-claude-3

## 10. Conclusion

Video analysis in Claude Code is **feasible** through frame extraction and Claude's vision capabilities. While no single turnkey solution exists, the ecosystem provides the building blocks:

- **FFmpeg MCP servers** for frame extraction
- **Claude Vision API** for frame analysis
- **Plugin architecture** for seamless integration
- **Skill system** for workflow documentation

The optimal approach is a **two-phase implementation**:

1. **Phase 1 (Quick Win):** Create a skill using existing FFmpeg MCP servers
2. **Phase 2 (Advanced):** Build a custom MCP server plugin with intelligent sampling

This enables video analysis today while setting the foundation for more sophisticated capabilities in the future.

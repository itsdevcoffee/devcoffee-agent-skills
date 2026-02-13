# Maximus Loop Project - Inception & Architecture Planning

**Date:** 2026-02-08
**Status:** Planning Phase
**Target:** New separate repository
**Session Type:** Project inception and architectural planning

---

## Project Overview

**Goal:** Create a UI-based version of the ralph-loop pattern called "maximus-loop" with React frontend and Bun backend server.

**Inspiration:** Ralph-loop is a known pattern that "runs agents repeatedly until a plan is satisfied, with context living in files and progress communicated via git history" (source: `docs/research/2026-02-06-community-patterns-and-updates.md:215-217`).

**Key Differentiator:** Unlike ralph-loop (pure terminal), maximus-loop will provide:
- Real-time visual feedback via React UI
- Interactive controls for loop management
- Better observability and debugging
- Modern web-based interface

---

## Proposed Architecture

### Directory Structure

```
maximus-loop/                        # New separate repository
├── skill/
│   ├── SKILL.md                    # Claude Code skill entry point
│   └── commands/
│       ├── start.md                # Launch the loop
│       ├── stop.md                 # Stop the loop
│       └── status.md               # Check loop status
├── server/
│   ├── index.ts                    # Bun server (WebSocket + REST)
│   ├── loop-engine.ts              # Core loop logic
│   ├── state-manager.ts            # Persistent state management
│   └── claude-bridge.ts            # Claude Code integration layer
└── app/
    ├── src/
    │   ├── components/
    │   │   ├── LoopDashboard.tsx   # Main UI dashboard
    │   │   ├── TaskQueue.tsx       # Visual task queue
    │   │   ├── AgentStatus.tsx     # Real-time agent activity
    │   │   └── MetricsPanel.tsx    # Performance stats & metrics
    │   └── hooks/
    │       └── useLoopState.ts     # WebSocket state hook
    └── package.json
```

### Architecture Components

#### 1. Claude Code Skill Layer
- **Entry Point:** `SKILL.md` - Claude Code skill that triggers maximus-loop
- **Commands:** Slash commands for start/stop/status control
- **Integration:** Bridges Claude Code environment with Bun server

#### 2. Bun Backend Server
- **Core Engine:** `loop-engine.ts` - Main loop logic and orchestration
- **State Management:** `state-manager.ts` - Persistent state (SQLite or JSON)
- **Claude Bridge:** `claude-bridge.ts` - Spawns and monitors Claude Code agents via CLI/API
- **Communication:** WebSocket + REST API for real-time updates

#### 3. React Frontend
- **Dashboard:** Real-time visualization of loop progress
- **Task Queue:** Visual representation of pending/active/completed tasks
- **Agent Monitoring:** Live view of agent activity and logs
- **Manual Controls:** Start/stop/pause loop, manual interventions
- **Metrics:** Performance stats, token usage, success rates

### Communication Flow

```
Claude Code (User Session)
    ↓ (invokes skill)
maximus-loop Skill
    ↓ (starts server)
Bun Server (loop-engine)
    ↓ (spawns agents)
Claude Code Agents (subprocesses)
    ↓ (progress updates)
Bun Server (state-manager)
    ↓ (WebSocket)
React App (live UI)
```

---

## Key Design Decisions

### 1. Communication Layer
- **WebSocket** for real-time bidirectional communication
- **REST API** for control commands (start/stop/status)
- **Server-Sent Events (SSE)** as potential alternative to WebSocket

### 2. Claude Integration Strategy
- Spawn Claude Code agents as child processes via CLI
- Monitor stdout/stderr for progress tracking
- File-based context handoff (following ralph-loop pattern)
- Git history for progress persistence

### 3. State Persistence
- **Options:**
  - SQLite for structured data (tasks, agents, metrics)
  - JSON files for simple state (following ralph-loop pattern)
  - Hybrid: SQLite for queryable data + files for context
- **Recommendation:** Start with JSON files, migrate to SQLite if needed

### 4. UI Features (Priority Order)
1. **P0 (Must Have):**
   - Loop status display (running/stopped/paused)
   - Task queue visualization
   - Agent activity log (real-time)
   - Start/Stop controls

2. **P1 (Should Have):**
   - Performance metrics (tasks completed, time elapsed, token usage)
   - Manual task injection
   - Loop history/audit log
   - Error handling and retry controls

3. **P2 (Nice to Have):**
   - Agent team visualization (graph view)
   - Token usage optimization suggestions
   - Loop templates/presets
   - Export results/reports

---

## Technical Stack

### Backend (Bun Server)
- **Runtime:** Bun (fast, TypeScript native)
- **WebSocket:** `ws` library or Bun native WebSocket
- **State:** SQLite (`better-sqlite3`) or JSON files
- **Process Management:** Node `child_process` or Bun subprocess API

### Frontend (React)
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite (fast, modern)
- **UI Library:** Consider Tailwind CSS + shadcn/ui for rapid development
- **State Management:**
  - Local: React hooks (useState, useReducer)
  - Server state: Custom WebSocket hook or TanStack Query
- **WebSocket Client:** Native WebSocket API or `socket.io-client`

---

## Implementation Phases

### Phase 1: MVP Foundation
**Goal:** Basic loop functionality with minimal UI

**Tasks:**
1. Set up new repository structure
2. Implement Bun server with basic loop engine
3. Create Claude Code skill with start/stop commands
4. Build minimal React UI (status + logs)
5. Establish WebSocket communication

**Success Criteria:**
- Can start loop from Claude Code
- Loop spawns single agent and completes task
- UI shows real-time status updates
- Can stop loop manually

### Phase 2: Task Queue & Orchestration
**Goal:** Multi-task loop with queue management

**Tasks:**
1. Implement task queue system
2. Add task prioritization logic
3. Enhance UI with task visualization
4. Add manual task injection
5. Implement progress tracking

**Success Criteria:**
- Loop processes multiple tasks sequentially
- Can add tasks while loop is running
- UI shows queue status and progress
- Tasks are persisted across restarts

### Phase 3: Multi-Agent Coordination
**Goal:** Parallel agent execution and coordination

**Tasks:**
1. Implement parallel agent spawning
2. Add agent coordination logic
3. Build agent status visualization
4. Add dependency management between tasks
5. Implement agent failure handling

**Success Criteria:**
- Multiple agents run concurrently
- Agents can coordinate on shared tasks
- UI shows all active agents
- Failed agents are detected and handled

### Phase 4: Metrics & Optimization
**Goal:** Observability and performance tuning

**Tasks:**
1. Add comprehensive metrics collection
2. Build metrics dashboard
3. Implement cost tracking (token usage)
4. Add optimization suggestions
5. Create export/reporting features

**Success Criteria:**
- Detailed metrics available in UI
- Cost per task is tracked
- Performance bottlenecks identified
- Reports can be exported

---

## Open Questions & Decisions Needed

### Architecture Decisions
1. **Claude Code Integration Method:**
   - Option A: Spawn CLI processes (simpler, proven)
   - Option B: Use Claude API directly (more control, requires API key)
   - Option C: Hybrid (CLI for orchestration, API for subagents)
   - **Recommendation:** Start with Option A (CLI), evaluate Option C later

2. **State Persistence Strategy:**
   - Option A: Pure JSON files (simple, ralph-loop style)
   - Option B: SQLite (structured, queryable)
   - Option C: Hybrid approach
   - **Recommendation:** Start with Option A, migrate to B if querying becomes critical

3. **WebSocket vs SSE:**
   - WebSocket: Bidirectional, more complex
   - SSE: Unidirectional (server→client), simpler for status updates
   - **Recommendation:** WebSocket for full control capabilities

### Feature Decisions
1. **Authentication/Security:**
   - Is this single-user (localhost only)?
   - Or multi-user (needs auth)?
   - **Recommendation:** Start single-user, add auth later if needed

2. **Loop Control Granularity:**
   - Should users be able to pause/resume loops?
   - Should individual agents be controllable?
   - **Recommendation:** Start with start/stop, add pause/resume in Phase 3

3. **Context Management:**
   - How much context should be visible in UI?
   - Should full agent logs be streamed?
   - **Recommendation:** Summary in UI, full logs available on-demand

---

## Next Steps

### Immediate Actions
1. **Create new repository** for maximus-loop project
2. **Use `/plugin-dev:skill-development`** to design Claude Code skill structure
3. **Initialize project structure:**
   - Set up Bun server project
   - Set up React app with Vite
   - Create initial directory structure
4. **Create architecture documentation:**
   - API specification (REST + WebSocket)
   - State schema design
   - Loop engine algorithm

### Design Documents Needed
1. **API Specification:**
   - REST endpoints (start, stop, status, tasks)
   - WebSocket message protocol
   - Error handling strategy

2. **State Schema:**
   - Task object structure
   - Agent state structure
   - Loop state structure
   - Persistence format

3. **Loop Engine Algorithm:**
   - Task selection logic
   - Agent spawning strategy
   - Completion detection
   - Failure handling and retry logic

---

## Reference Materials

### Ralph-Loop Pattern
From `docs/research/2026-02-06-community-patterns-and-updates.md`:
- "Runs agents repeatedly until a plan is satisfied"
- "Context lives in files"
- "Progress communicated via git history"

### Relevant Skills in devcoffee-agent-skills
- `plugin-dev:skill-development` - For creating the Claude Code skill
- `plugin-dev:plugin-structure` - For overall plugin organization
- `plugin-dev:command-development` - For slash commands

### Architecture Patterns (from research)
- **Sub-agents for isolation** (Section 4.2)
- **Task scoping patterns** (Section 4.4)
- **Multi-agent orchestration** (Section 4.3)
- **Context window management** (Section 4.5)

---

## Context for Next Agent

This project is in the **inception phase**. The user wants to:
1. Create a separate repository (not in devcoffee-agent-skills)
2. Build a modern UI-based loop system inspired by ralph-loop
3. Use React + Bun technology stack
4. Integrate with Claude Code via skills/commands

**User's Vision:**
- A visual, interactive alternative to terminal-based ralph-loop
- Real-time observability into agent activity
- Better control and intervention capabilities
- Potential improvements over the original pattern

**Recommended Starting Point:**
1. Review this handoff doc thoroughly
2. Ask user about specific improvements they envision for maximus-loop
3. Design the loop engine algorithm in detail
4. Create API specification for server↔UI communication
5. Use `/plugin-dev:skill-development` to design the skill structure

---

## Success Criteria for Project

**Minimum Viable Product:**
- [ ] Loop can be started from Claude Code skill
- [ ] Loop processes a queue of tasks sequentially
- [ ] React UI shows real-time loop status
- [ ] Can stop loop from UI or Claude Code
- [ ] Basic error handling and logging

**Full Feature Set:**
- [ ] Multi-agent parallel execution
- [ ] Task dependencies and coordination
- [ ] Comprehensive metrics and cost tracking
- [ ] Manual intervention and control
- [ ] Export results and generate reports
- [ ] Production-ready error handling and recovery

---

## Additional Notes

- User is familiar with devcoffee-agent-skills plugin architecture
- User has access to plugin-dev skills for guidance
- Project should be treated as a separate, independent repository
- Consider publishing to Claude Code plugin marketplace after MVP

---

**Session Summary:**
User initiated discussion about creating maximus-loop as an improved version of ralph-loop with UI. Proposed comprehensive architecture with React frontend, Bun backend, and Claude Code integration. User requested handoff doc before starting implementation in separate repository.

**Next Agent Should:**
1. Confirm understanding of architecture proposal
2. Gather user's specific improvement ideas over ralph-loop
3. Begin detailed design of loop engine and API
4. Set up repository structure
5. Start with Phase 1 implementation plan

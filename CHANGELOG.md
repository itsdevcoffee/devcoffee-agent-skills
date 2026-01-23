# Changelog

All notable changes to Dev Coffee Agent Skills will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-23

### Added
- Initial release of devcoffee plugin
- Maximus command (`/devcoffee:maximus`) for autonomous code review cycles
- Maximus agent (`@devcoffee:maximus`) for subagent invocation
- Support for code-reviewer and code-simplifier integration
- Autonomous review-fix-simplify loop (max 5 rounds)
- Detection of uncommitted changes and unpushed commits
- Formatted summary tables with rounds, issues found/fixed
- Pause flags: `--pause-reviews`, `--pause-simplifier`, `--pause-major`, `--max-rounds N`, `--interactive`
- Comprehensive documentation with examples and workflow diagrams
- MIT License
- Marketplace configuration

### Dependencies
- Requires `feature-dev` plugin (for code-reviewer agent)
- Requires `code-simplifier` plugin (for code-simplifier agent)

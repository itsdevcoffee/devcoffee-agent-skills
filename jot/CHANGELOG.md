# Changelog

All notable changes to the Jot plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `/jot:list` — Quick summary table of all notes with optional project/status filtering
- Background agent (`note-writer`) for asynchronous note capture
- Non-blocking `/jot:note` execution - immediate return to user while note is processed in background
- Haiku model optimization for faster note processing
- Prompt-based permissions for background Write/Edit operations

### Changed

- `/jot:note` now runs asynchronously via background agent instead of blocking workflow

### Fixed

- Background agent permission denials by adding explicit prompts for Write/Edit tools

## [0.1.0] - 2026-02-15

### Added

- `/jot:note` — Fire-and-forget note capture with project tagging and auto-expansion
- `/jot:review` — Guided triage session through pending notes with optional topic filtering
- Notes catalog at `docs/notes.md`

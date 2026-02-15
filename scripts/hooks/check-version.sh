#!/bin/bash
# check-version.sh - Stop hook that reminds about version bumps
#
# Checks if plugin source files were modified without a corresponding
# version bump in plugin.json / marketplace.json / CHANGELOG.md.

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
  exit 0
fi

cd "$REPO_ROOT"

# Get list of changed files (staged + unstaged)
CHANGED=$(git diff --name-only HEAD 2>/dev/null; git diff --name-only --staged 2>/dev/null)
if [ -z "$CHANGED" ]; then
  exit 0
fi

# Check which plugins have source file changes
PLUGINS_CHANGED=""
for plugin_dir in devcoffee video-analysis remotion-max maximus-loop tldr opentui-dev; do
  if echo "$CHANGED" | grep -q "^${plugin_dir}/"; then
    # Check if the change is to actual source files (not just version/metadata)
    SOURCE_CHANGES=$(echo "$CHANGED" | grep "^${plugin_dir}/" | grep -v "plugin.json" | grep -v "plugin-metadata.json" | grep -v "CHANGELOG")
    if [ -n "$SOURCE_CHANGES" ]; then
      PLUGINS_CHANGED="$PLUGINS_CHANGED $plugin_dir"
    fi
  fi
done

if [ -z "$PLUGINS_CHANGED" ]; then
  exit 0
fi

# Check if version files were also modified
VERSION_UPDATED=""
for plugin_dir in $PLUGINS_CHANGED; do
  if echo "$CHANGED" | grep -q "${plugin_dir}/.claude-plugin/plugin.json"; then
    VERSION_UPDATED="$VERSION_UPDATED $plugin_dir"
  fi
done

CHANGELOG_UPDATED=""
if echo "$CHANGED" | grep -q "CHANGELOG.md"; then
  CHANGELOG_UPDATED="yes"
fi

# Build warning message
MISSING=""
for plugin_dir in $PLUGINS_CHANGED; do
  if ! echo "$VERSION_UPDATED" | grep -q "$plugin_dir"; then
    MISSING="$MISSING $plugin_dir"
  fi
done

if [ -n "$MISSING" ] || [ -z "$CHANGELOG_UPDATED" ]; then
  MSG="## Version Check Reminder\n\n"
  MSG="${MSG}Plugin source files were modified but versioning may be incomplete:\n\n"

  if [ -n "$MISSING" ]; then
    MSG="${MSG}**Plugins with code changes but no version bump:**\n"
    for p in $MISSING; do
      MSG="${MSG}- \`${p}\` — update \`${p}/.claude-plugin/plugin.json\` version + \`.claude-plugin/marketplace.json\`\n"
    done
    MSG="${MSG}\n"
  fi

  if [ -z "$CHANGELOG_UPDATED" ]; then
    MSG="${MSG}**CHANGELOG.md was not updated.** Add entries under \`[Unreleased]\` for user-facing changes.\n\n"
  fi

  MSG="${MSG}See CLAUDE.md \"Pre-Commit Checklist\" for versioning rules (MAJOR.MINOR.PATCH)."

  echo -e "$MSG"
fi

exit 0

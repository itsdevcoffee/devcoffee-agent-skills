#!/usr/bin/env node

/**
 * Plugin Metadata Validation Script
 *
 * Validates all plugins in the marketplace against metadata requirements.
 * Checks required fields, formats, and recommended fields.
 *
 * Usage: node scripts/validate-plugins.js
 * Exit codes: 0 = success, 1 = validation errors found
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Validation schema
const REQUIRED_FIELDS = ['name', 'version', 'description', 'tagline'];
const RECOMMENDED_FIELDS = ['category', 'components', 'dependencies', 'installation', 'usage'];
const VALID_CATEGORIES = ['media', 'code-quality', 'automation', 'development', 'standalone'];

// Regex patterns
const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;
const KEBAB_CASE_PATTERN = /^[a-z0-9-]+$/;

let errorCount = 0;
let warningCount = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(pluginName, message) {
  log(`  ✗ ${message}`, 'red');
  errorCount++;
}

function warning(pluginName, message) {
  log(`  ⚠ ${message}`, 'yellow');
  warningCount++;
}

function success(message) {
  log(`  ✓ ${message}`, 'green');
}

function validatePluginMetadata(pluginName, pluginPath, pluginData) {
  log(`\n${colors.bold}Validating: ${pluginName}${colors.reset}`, 'blue');

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!pluginData[field]) {
      error(pluginName, `Missing required field: ${field}`);
    } else {
      success(`Has required field: ${field}`);
    }
  }

  // Validate name format (kebab-case)
  if (pluginData.name && !KEBAB_CASE_PATTERN.test(pluginData.name)) {
    error(pluginName, `Invalid name format: "${pluginData.name}" (must be kebab-case: lowercase letters, numbers, hyphens only)`);
  }

  // Validate version format (semver)
  if (pluginData.version && !SEMVER_PATTERN.test(pluginData.version)) {
    error(pluginName, `Invalid version format: "${pluginData.version}" (must be semantic version: X.Y.Z)`);
  }

  // Validate description length
  if (pluginData.description && pluginData.description.length < 20) {
    warning(pluginName, `Description too short: ${pluginData.description.length} chars (recommended: 20+)`);
  }

  // Validate tagline length
  if (pluginData.tagline && pluginData.tagline.length > 80) {
    warning(pluginName, `Tagline too long: ${pluginData.tagline.length} chars (recommended: max 80)`);
  }

  // Check category
  if (pluginData.category) {
    if (!VALID_CATEGORIES.includes(pluginData.category)) {
      warning(pluginName, `Unknown category: "${pluginData.category}" (valid: ${VALID_CATEGORIES.join(', ')})`);
    }
  }

  // Check recommended fields
  for (const field of RECOMMENDED_FIELDS) {
    if (!pluginData[field]) {
      warning(pluginName, `Missing recommended field: ${field}`);
    }
  }

  // Validate components structure
  if (pluginData.components) {
    const validKeys = ['agents', 'commands', 'skills', 'hooks'];
    for (const key of validKeys) {
      if (pluginData.components[key] && !Array.isArray(pluginData.components[key])) {
        error(pluginName, `components.${key} must be an array`);
      }
    }
  }

  // Validate dependencies structure
  if (pluginData.dependencies) {
    if (pluginData.dependencies.plugins && !Array.isArray(pluginData.dependencies.plugins)) {
      error(pluginName, 'dependencies.plugins must be an array');
    }
    if (pluginData.dependencies.external && !Array.isArray(pluginData.dependencies.external)) {
      error(pluginName, 'dependencies.external must be an array');
    }
  }

  // Check if README exists
  const readmePath = path.join(pluginPath, 'README.md');
  if (!fs.existsSync(readmePath)) {
    warning(pluginName, 'No README.md found');
  }
}

function main() {
  log(`${colors.bold}Plugin Metadata Validation${colors.reset}`, 'blue');
  log('='.repeat(50));

  // Read marketplace.json
  const marketplacePath = path.join(__dirname, '../.claude-plugin/marketplace.json');

  if (!fs.existsSync(marketplacePath)) {
    log('✗ marketplace.json not found', 'red');
    process.exit(1);
  }

  let marketplace;
  try {
    marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
  } catch (err) {
    log(`✗ Failed to parse marketplace.json: ${err.message}`, 'red');
    process.exit(1);
  }

  if (!marketplace.plugins || !Array.isArray(marketplace.plugins)) {
    log('✗ marketplace.json does not contain a valid plugins array', 'red');
    process.exit(1);
  }

  // Validate each plugin
  const repoRoot = path.resolve(__dirname, '..');

  for (const plugin of marketplace.plugins) {
    const pluginSource = plugin.source;
    const pluginPath = path.resolve(__dirname, '..', pluginSource);

    // Security: Prevent path traversal attacks
    if (!pluginPath.startsWith(repoRoot)) {
      log(`\n${colors.bold}Validating: ${plugin.name}${colors.reset}`, 'blue');
      error(plugin.name, `Invalid plugin source path: ${pluginSource} (path traversal detected)`);
      continue;
    }

    // Try plugin-metadata.json first (extended fields), fallback to plugin.json
    const pluginMetadataPath = path.join(pluginPath, '.claude-plugin/plugin-metadata.json');
    const pluginJsonPath = path.join(pluginPath, '.claude-plugin/plugin.json');

    const metadataPath = fs.existsSync(pluginMetadataPath) ? pluginMetadataPath : pluginJsonPath;

    if (!fs.existsSync(metadataPath)) {
      log(`\n${colors.bold}Validating: ${plugin.name}${colors.reset}`, 'blue');
      error(plugin.name, `plugin metadata not found at ${pluginMetadataPath} or ${pluginJsonPath}`);
      continue;
    }

    let pluginData;
    try {
      pluginData = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    } catch (err) {
      log(`\n${colors.bold}Validating: ${plugin.name}${colors.reset}`, 'blue');
      error(plugin.name, `Failed to parse plugin metadata: ${err.message}`);
      continue;
    }

    validatePluginMetadata(plugin.name, pluginPath, pluginData);
  }

  // Summary
  log('\n' + '='.repeat(50));
  log(`${colors.bold}Validation Summary${colors.reset}`, 'blue');

  if (errorCount === 0 && warningCount === 0) {
    log(`✅ All plugins valid! (${marketplace.plugins.length} plugins checked)`, 'green');
  } else {
    log(`Errors: ${errorCount}`, errorCount > 0 ? 'red' : 'green');
    log(`Warnings: ${warningCount}`, warningCount > 0 ? 'yellow' : 'green');
  }

  // Exit with error code if there were errors
  process.exit(errorCount > 0 ? 1 : 0);
}

main();

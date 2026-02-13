#!/usr/bin/env node

/**
 * README Plugins Section Generator
 *
 * Generates the "Available Plugins" section for README.md from marketplace.json
 * and individual plugin.json files.
 *
 * Output: .readme-plugins-section.md (for manual review before merging)
 *
 * Usage: node scripts/generate-readme-plugins.js
 */

const fs = require('fs');
const path = require('path');

function log(message) {
  console.log(message);
}

function generatePluginSection(pluginName, pluginData) {
  const sections = [];

  // Header
  sections.push(`### \`${pluginName}\``);
  sections.push('');

  // Description
  if (pluginData.description) {
    sections.push(pluginData.description);
    sections.push('');
  }

  // Components
  if (pluginData.components && typeof pluginData.components === 'object') {
    const components = [];

    if (pluginData.components.agents && pluginData.components.agents.length > 0) {
      components.push(`- **Agents:** ${pluginData.components.agents.map(a => `\`${a}\``).join(', ')}`);
    }

    if (pluginData.components.commands && pluginData.components.commands.length > 0) {
      const commandList = pluginData.components.commands.map(c => {
        // If command name equals plugin name, don't add prefix (e.g., /video-analysis not /video-analysis:video-analysis)
        const cmd = c === pluginName ? c : `${pluginName}:${c}`;
        return `\`/${cmd}\``;
      }).join(', ');
      components.push(`- **Commands:** ${commandList}`);
    }

    if (pluginData.components.skills && pluginData.components.skills.length > 0) {
      components.push(`- **Skills:** ${pluginData.components.skills.map(s => `\`${s}\``).join(', ')}`);
    }

    if (pluginData.components.hooks && pluginData.components.hooks.length > 0) {
      components.push(`- **Hooks:** ${pluginData.components.hooks.map(h => `\`${h}\``).join(', ')}`);
    }

    if (components.length > 0) {
      sections.push('**Components:**');
      sections.push(components.join('\n'));
      sections.push('');
    }
  }

  // Installation
  sections.push('**Installation:**');
  sections.push('');
  sections.push('```bash');

  // Marketplace install
  if (pluginData.installation && pluginData.installation.marketplace) {
    sections.push(`/plugin install ${pluginName}@${pluginData.installation.marketplace}`);
  } else {
    sections.push(`/plugin install ${pluginName}`);
  }

  // Plugin dependencies
  if (pluginData.dependencies && pluginData.dependencies.plugins && pluginData.dependencies.plugins.length > 0) {
    sections.push('');
    sections.push('# Plugin dependencies (auto-installed):');
    for (const dep of pluginData.dependencies.plugins) {
      sections.push(`# - ${dep}`);
    }
  }

  // External dependencies setup
  if (pluginData.dependencies && pluginData.dependencies.external && pluginData.dependencies.external.length > 0) {
    sections.push('');
    sections.push(`# External dependency required: ${pluginData.dependencies.external.join(', ')}`);
  }

  // Additional setup steps
  if (pluginData.installation && pluginData.installation.setup && pluginData.installation.setup.length > 0) {
    sections.push('');
    for (const step of pluginData.installation.setup) {
      sections.push(step);
    }
  }

  sections.push('```');
  sections.push('');

  // When to use
  if (pluginData.usage && pluginData.usage.when) {
    sections.push(`**When to use:** ${pluginData.usage.when}`);
    sections.push('');
  }

  // Usage examples
  if (pluginData.usage && pluginData.usage.examples && pluginData.usage.examples.length > 0) {
    sections.push('**Examples:**');
    sections.push('');
    sections.push('```bash');
    for (const example of pluginData.usage.examples) {
      sections.push(example);
    }
    sections.push('```');
    sections.push('');
  }

  return sections.join('\n');
}

function main() {
  log('Generating README plugins section...');

  // Read marketplace.json
  const marketplacePath = path.join(__dirname, '../.claude-plugin/marketplace.json');

  if (!fs.existsSync(marketplacePath)) {
    console.error('✗ marketplace.json not found');
    process.exit(1);
  }

  let marketplace;
  try {
    marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
  } catch (err) {
    console.error(`✗ Failed to parse marketplace.json: ${err.message}`);
    process.exit(1);
  }

  if (!marketplace.plugins || !Array.isArray(marketplace.plugins)) {
    console.error('✗ marketplace.json does not contain a valid plugins array');
    process.exit(1);
  }

  // Read existing README.md
  const readmePath = path.join(__dirname, '../README.md');

  if (!fs.existsSync(readmePath)) {
    console.error('✗ README.md not found');
    process.exit(1);
  }

  let readmeContent;
  try {
    readmeContent = fs.readFileSync(readmePath, 'utf8');
  } catch (err) {
    console.error(`✗ Failed to read README.md: ${err.message}`);
    process.exit(1);
  }

  // Generate sections
  const output = [];

  // Header
  output.push('## Available Plugins');
  output.push('');

  // Process each plugin
  const repoRoot = path.resolve(__dirname, '..');

  for (const plugin of marketplace.plugins) {
    const pluginSource = plugin.source;
    const pluginPath = path.resolve(__dirname, '..', pluginSource);

    // Security: Prevent path traversal attacks
    if (!pluginPath.startsWith(repoRoot)) {
      console.error(`✗ Invalid plugin source path for ${plugin.name}: ${pluginSource} (path traversal detected)`);
      output.push(`### \`${plugin.name}\``);
      output.push('');
      output.push('**ERROR:** Failed to generate section - invalid plugin source path (security violation)');
      output.push('');
      output.push('---');
      output.push('');
      continue;
    }

    // Try plugin-metadata.json first (extended fields), fallback to plugin.json
    const pluginMetadataPath = path.join(pluginPath, '.claude-plugin/plugin-metadata.json');
    const pluginJsonPath = path.join(pluginPath, '.claude-plugin/plugin.json');

    const metadataPath = fs.existsSync(pluginMetadataPath) ? pluginMetadataPath : pluginJsonPath;

    if (!fs.existsSync(metadataPath)) {
      console.error(`✗ plugin metadata not found for ${plugin.name} at ${pluginMetadataPath} or ${pluginJsonPath}`);
      output.push(`### \`${plugin.name}\``);
      output.push('');
      output.push('**ERROR:** Failed to generate section - plugin metadata not found');
      output.push('');
      output.push('---');
      output.push('');
      continue;
    }

    let pluginData;
    try {
      pluginData = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    } catch (err) {
      console.error(`✗ Failed to parse plugin metadata for ${plugin.name}: ${err.message}`);
      output.push(`### \`${plugin.name}\``);
      output.push('');
      output.push(`**ERROR:** Failed to generate section - plugin metadata parse error: ${err.message}`);
      output.push('');
      output.push('---');
      output.push('');
      continue;
    }

    // Generate section for this plugin
    const section = generatePluginSection(plugin.name, pluginData);
    output.push(section);
    output.push('---');
    output.push('');

    log(`✓ Generated section for ${plugin.name}`);
  }

  // Find and replace content between HTML markers
  const beginMarker = '<!-- BEGIN AUTO-GENERATED PLUGIN SECTIONS -->';
  const endMarker = '<!-- END AUTO-GENERATED PLUGIN SECTIONS -->';

  const beginIndex = readmeContent.indexOf(beginMarker);
  const endIndex = readmeContent.indexOf(endMarker);

  if (beginIndex === -1 || endIndex === -1) {
    console.error('✗ Could not find HTML markers in README.md');
    console.error('  Expected markers:');
    console.error('    <!-- BEGIN AUTO-GENERATED PLUGIN SECTIONS -->');
    console.error('    <!-- END AUTO-GENERATED PLUGIN SECTIONS -->');
    process.exit(1);
  }

  // Build new content with markers
  const beforeMarker = readmeContent.substring(0, beginIndex + beginMarker.length);
  const afterMarker = readmeContent.substring(endIndex);

  // Add comments between markers
  const generatedSection = [
    '',
    '<!-- Generated by: npm run readme:generate -->',
    '<!-- Source: .claude-plugin/marketplace.json + plugin.json files -->',
    '<!-- Do not edit manually - edit plugin.json files instead -->',
    '',
    ...output,
    ''
  ].join('\n');

  const newReadmeContent = beforeMarker + generatedSection + afterMarker;

  // Write updated README.md
  try {
    fs.writeFileSync(readmePath, newReadmeContent, 'utf8');
  } catch (err) {
    console.error(`✗ Failed to write README.md: ${err.message}`);
    process.exit(1);
  }

  log('');
  log(`✅ Generated ${marketplace.plugins.length} plugin sections`);
  log(`📄 Updated README.md automatically`);
  log('');
  log('Next steps:');
  log('1. Review the changes with: git diff README.md');
  log('2. Commit if everything looks good');
}

main();

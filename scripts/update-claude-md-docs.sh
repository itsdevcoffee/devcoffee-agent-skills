#!/usr/bin/env bash
set -euo pipefail

# Documentation section to add/update
read -r -d '' DOC_SECTION << 'EOF' || true
## Documentation

Files go in `docs/` except for obvious exceptions: README.md, CLAUDE.md, LICENSE.md, CONTRIBUTING.md, AGENT.md, ... (root only).

**Subdirectories:**

- `context/` - Architecture, domain knowledge, static reference
- `decisions/` - Architecture Decision Records (ADRs)
- `handoff/` - Session state for development continuity
- `project/` - Planning: todos, features, roadmap
- `research/` - Explorations, comparisons, technical analysis
- `tmp/` - Scratch files (safe to delete)

**Naming:** `YYYY-MM-DD-descriptive-name.md` (lowercase, hyphens)

**Rules:**

- Update existing docs before creating new ones
- Use `tmp/` when uncertain, flag for review
EOF

# Target file (default to CLAUDE.md, or pass as argument)
FILE="${1:-CLAUDE.md}"

# Function to update or add Documentation section
update_doc_section() {
    local input_file="$1"
    local temp_file="${input_file}.tmp"

    awk -v section="$DOC_SECTION" '
    BEGIN {
        in_doc_section = 0
        found_doc = 0
    }

    # Found ## Documentation heading
    /^## Documentation/ {
        if (!found_doc) {
            print section
            found_doc = 1
            in_doc_section = 1
        }
        next
    }

    # Found another ## heading - exit doc section
    /^## / {
        if (in_doc_section) {
            in_doc_section = 0
        }
    }

    # Print lines only when not in doc section
    !in_doc_section { print }

    # At EOF, if doc section never found, append it
    END {
        if (!found_doc) {
            print ""
            print section
        }
    }
    ' "$input_file" > "$temp_file"

    mv "$temp_file" "$input_file"
}

# Main logic
if [[ -f "$FILE" ]]; then
    if grep -q "^## Documentation" "$FILE"; then
        echo "📝 Updating existing Documentation section in $FILE..."
        update_doc_section "$FILE"
        echo "✓ Documentation section updated"
    else
        echo "📝 Adding Documentation section to $FILE..."
        update_doc_section "$FILE"
        echo "✓ Documentation section added"
    fi
else
    echo "📝 Creating new $FILE..."
    echo ""

    # Prompt for project name
    read -p "Enter project name [Project Name]: " project_name
    project_name=${project_name:-Project Name}

    # Prompt for project description
    read -p "Enter project description [[Add project description here]]: " project_desc
    project_desc=${project_desc:-[Add project description here]}

    echo ""
    echo "Creating $FILE..."

    cat > "$FILE" << EOF
# ${project_name}

${project_desc}

## Documentation

Files go in \`docs/\` except for obvious exceptions: README.md, CLAUDE.md, LICENSE.md, CONTRIBUTING.md, AGENT.md, ... (root only).

**Subdirectories:**

- \`context/\` - Architecture, domain knowledge, static reference
- \`decisions/\` - Architecture Decision Records (ADRs)
- \`handoff/\` - Session state for development continuity
- \`project/\` - Planning: todos, features, roadmap
- \`research/\` - Explorations, comparisons, technical analysis
- \`tmp/\` - Scratch files (safe to delete)

**Naming:** \`YYYY-MM-DD-descriptive-name.md\` (lowercase, hyphens)

**Rules:**

- Update existing docs before creating new ones
- Use \`tmp/\` when uncertain, flag for review
EOF
    echo "✓ $FILE created successfully"
fi

echo ""
echo "Done! Documentation standard is now in $FILE"

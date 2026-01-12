---
name: setting-up-gitignore
description: This skill should be used when users need to create or update a .gitignore file for their project. It provides comprehensive security-focused patterns and automatically detects the tech stack to include appropriate language-specific exclusions.
---

# Gitignore Setup Skill

Helps users create robust, secure `.gitignore` files tailored to their project stack.

## Core Principles

1.  **Security First**: Always exclude secrets, keys, and environment files (`.env`).
2.  **Stack Awareness**: Detect the project type (Node, Python, etc.) and apply relevant patterns.
3.  **OS Cleanup**: Exclude system files (`.DS_Store`, `Thumbs.db`).
4.  **IDE Cleanup**: Exclude editor configs (`.vscode`, `.idea`) unless they are shared.

## Usage

When asked to "setup gitignore" or "create .gitignore":

1.  **Analyze the project**: Look for `package.json` (Node), `requirements.txt` (Python), `pom.xml` (Java), etc.
2.  **Generate content**: Combine the global patterns with stack-specific patterns.
3.  **Check for existing**: If `.gitignore` exists, propose appending or merging, don't blindly overwrite.

## Patterns

### Global (Always Include)

```gitignore
# System Files
.DS_Store
Thumbs.db
Desktop.ini

# Environment / Secrets
.env
.env.local
*.pem
*.key
secrets.json
```

### Node.js / JavaScript / TypeScript

```gitignore
# Dependencies
node_modules/
jspm_packages/

# Build Outputs
dist/
build/
out/
.nuxt/
.next/
.output/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Testing
coverage/
.nyc_output/
```

### Python

```gitignore
# Bytecode
__pycache__/
*.py[cod]

# Virtual Envs
venv/
env/
.venv/

# Distribution
build/
dist/
*.egg-info/
```

## Instructions for the Agent

1.  **Detect**: Run `ls -F` to see project files.
2.  **Draft**: Construct the `.gitignore` content based on findings.
3.  **Verify**: Ensure `.env` is included in the ignore list.
4.  **Write**: Use `write` tool to create or update `.gitignore`.

.PHONY: help setup install dev build serve-static lint typecheck check-all clean clean-install \
        docker-up docker-up-build docker-build docker-build-no-cache docker-down docker-logs \
        ci ci-lint ci-typecheck ci-build ci-npm-audit \
        codeql-db codeql-scan-security codeql-scan-quality codeql-scan-all \
        codeql-scan-security-csv codeql-scan-quality-csv codeql-scan-csv-all \
        .ensure-venv venv
.DEFAULT_GOAL := help

# ========================================
# Color Output
# ========================================

BLUE   := \033[0;34m
GREEN  := \033[0;32m
YELLOW := \033[1;33m
RED    := \033[0;31m
NC     := \033[0m

PYTHON_VERSION ?= 3.13

ifeq ($(OS),Windows_NT)
    VENV_BIN := .venv/Scripts
    PY_CMD   := py -$(PYTHON_VERSION)
else
    VENV_BIN := .venv/bin
    PY_CMD   := python$(PYTHON_VERSION)
endif

PYTHON := $(VENV_BIN)/python
PIP    := $(VENV_BIN)/pip

# ========================================
# Help
# ========================================

help: ## Show this help message
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "$(BLUE)  Arthur's Portfolio — Makefile$(NC)\n"
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "\n"
	@printf "$(GREEN)Available commands:$(NC)\n"
	@printf "\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-25s$(NC) %s\n", $$1, $$2}'
	@printf "\n"

# ========================================
# Setup & Installation
# ========================================

setup: ## Full project bootstrap — install dependencies
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "$(BLUE)  Arthur's Portfolio — Setup$(NC)\n"
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "\n"
	@printf "$(GREEN)Checking Node.js version...$(NC)\n"
	@node --version || (printf "$(RED)ERROR: Node.js is not installed.$(NC)\n" && exit 1)
	@printf "\n"
	@printf "$(GREEN)[1/1] Installing dependencies...$(NC)\n"
	npm install
	@printf "\n"
	@printf "$(GREEN)Setup complete!$(NC)\n"
	@printf "\n"
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "$(GREEN)  Project is ready!$(NC)\n"
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "\n"
	@printf "$(YELLOW)Next steps:$(NC)\n"
	@printf "  • Local dev:   $(GREEN)make dev$(NC)\n"
	@printf "  • Docker dev:  $(GREEN)make docker-up$(NC)  → http://localhost:3002/arthurs-portfolio\n"
	@printf "  • Static build: $(GREEN)make build$(NC)\n"
	@printf "\n"

install: ## Install all dependencies
	@printf "$(GREEN)Installing dependencies...$(NC)\n"
	npm install
	@printf "$(GREEN)Done!$(NC)\n"

# ========================================
# Development
# ========================================

dev: ## Start Next.js dev server locally (non-Docker)
	@printf "$(GREEN)Starting development server...$(NC)\n"
	npx next dev --turbopack

# ========================================
# Build & Production
# ========================================

build: ## Run static export build (outputs to out/)
	@printf "$(GREEN)Building static export...$(NC)\n"
	npx next build

serve-static: ## Serve the out/ directory locally (preview the static build)
	@printf "$(GREEN)Serving static build at http://localhost:4173 ...$(NC)\n"
	npx serve out -p 4173

# ========================================
# Quality Checks
# ========================================

lint: ## Run ESLint
	@printf "$(GREEN)Running linter...$(NC)\n"
	npx next lint

typecheck: ## Run TypeScript type checking only
	@printf "$(GREEN)Running type checker...$(NC)\n"
	npx tsc --noEmit

check-all: ## Run lint + typecheck
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "$(BLUE)  Running Full Quality Check$(NC)\n"
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "\n"
	@printf "$(GREEN)[1/2] Linting...$(NC)\n"
	npx next lint
	@printf "\n"
	@printf "$(GREEN)[2/2] Type checking...$(NC)\n"
	npx tsc --noEmit
	@printf "\n"
	@printf "$(GREEN)All checks passed!$(NC)\n"

# ========================================
# CI Checks — mirrors .github/workflows/ci.yml
# ========================================
# Run these locally before pushing to catch the same issues CI will flag.

ci-lint: ## CI: ESLint
	@printf "$(GREEN)CI [1/4]: lint...$(NC)\n"
	npm run lint

ci-typecheck: ## CI: TypeScript type check
	@printf "$(GREEN)CI [2/4]: tsc --noEmit...$(NC)\n"
	npx tsc --noEmit

ci-build: ## CI: Next.js static export build
	@printf "$(GREEN)CI [3/4]: next build...$(NC)\n"
	npm run build

ci-npm-audit: ## CI: npm audit for CVEs
	@printf "$(GREEN)CI [4/4]: npm audit...$(NC)\n"
	npm audit --audit-level=high --omit=dev

ci: ci-lint ci-typecheck ci-build ci-npm-audit ## Run all CI checks locally
	@printf "$(GREEN)========================================$(NC)\n"
	@printf "$(GREEN)  All CI checks passed!$(NC)\n"
	@printf "$(GREEN)========================================$(NC)\n"

# ========================================
# Docker Commands
# ========================================

docker-up: ## Start portfolio dev container
	@printf "$(GREEN)Starting portfolio dev container...$(NC)\n"
	docker compose up -d
	@printf "$(GREEN)Portfolio running at http://localhost:3002/arthurs-portfolio$(NC)\n"

docker-up-build: ## Rebuild image then start portfolio dev container
	@printf "$(GREEN)Rebuilding portfolio image...$(NC)\n"
	docker compose build
	@printf "$(GREEN)Starting portfolio dev container...$(NC)\n"
	docker compose up -d
	@printf "$(GREEN)Portfolio running at http://localhost:3002/arthurs-portfolio$(NC)\n"

docker-build: ## Build Docker dev image and force-recreate container
	@printf "$(GREEN)Building Docker dev image...$(NC)\n"
	docker compose build
	docker compose up -d --force-recreate --renew-anon-volumes

docker-build-no-cache: ## Build Docker dev image with no cache (also purges named volumes so node_modules is fresh)
	@printf "$(GREEN)Tearing down containers and named volumes...$(NC)\n"
	docker compose down -v
	@printf "$(GREEN)Building Docker dev image (no cache)...$(NC)\n"
	docker compose build --no-cache
	@printf "$(GREEN)Starting container with fresh volumes...$(NC)\n"
	docker compose up -d

docker-down: ## Stop the portfolio container
	@printf "$(GREEN)Stopping portfolio container...$(NC)\n"
	docker compose down

docker-logs: ## Follow portfolio container logs
	@printf "$(GREEN)Following Docker logs (Ctrl+C to stop)...$(NC)\n"
	docker compose logs -f

# ========================================
# Utilities
# ========================================

clean: ## Remove node_modules, .next, out, and build artifacts
	@printf "$(YELLOW)Cleaning build artifacts...$(NC)\n"
	rm -rf node_modules .next out coverage
	@printf "$(GREEN)Clean complete!$(NC)\n"

clean-install: clean install ## Clean then reinstall (fresh dependency install)

# ========================================
# CodeQL Security Scanning
# ========================================

CODEQL_DB      := ../codeql/codeql-dbs/arthurs-portfolio
CODEQL_RESULTS := ../codeql/codeql-results
CODEQL_LANG    := javascript-typescript
CODEQL_PACK    := codeql/javascript-queries

codeql-db: ## Create or refresh the CodeQL database
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "$(BLUE)  CodeQL — Building Database$(NC)\n"
	@printf "$(BLUE)========================================$(NC)\n"
	@mkdir -p $(CODEQL_RESULTS)
	@rm -rf $(CODEQL_DB)
	codeql database create $(CODEQL_DB) \
		--language=$(CODEQL_LANG) \
		--source-root=.
	@printf "$(GREEN)Database created at $(CODEQL_DB)$(NC)\n"

codeql-scan-security: ## Run security-extended queries (SARIF output)
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "$(BLUE)  CodeQL — Security Scan$(NC)\n"
	@printf "$(BLUE)========================================$(NC)\n"
	@mkdir -p $(CODEQL_RESULTS)
	codeql database analyze $(CODEQL_DB) \
		"$(CODEQL_PACK):codeql-suites/javascript-security-extended.qls" \
		--format=sarif-latest \
		--output=$(CODEQL_RESULTS)/arthurs-portfolio.sarif
	@printf "$(GREEN)Results saved to $(CODEQL_RESULTS)/arthurs-portfolio.sarif$(NC)\n"
	@printf "$(YELLOW)Open the .sarif file in VS Code with the SARIF Viewer extension to browse results$(NC)\n"

codeql-scan-quality: ## Run security-and-quality queries (SARIF output)
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "$(BLUE)  CodeQL — Quality Scan$(NC)\n"
	@printf "$(BLUE)========================================$(NC)\n"
	@mkdir -p $(CODEQL_RESULTS)
	codeql database analyze $(CODEQL_DB) \
		"$(CODEQL_PACK):codeql-suites/javascript-security-and-quality.qls" \
		--format=sarif-latest \
		--output=$(CODEQL_RESULTS)/arthurs-portfolio-quality.sarif
	@printf "$(GREEN)Results saved to $(CODEQL_RESULTS)/arthurs-portfolio-quality.sarif$(NC)\n"

codeql-scan-all: codeql-scan-security codeql-scan-quality ## Run all CodeQL query suites (SARIF)

codeql-scan-security-csv: ## Run security scan (CSV — easy to share with AI for fix suggestions)
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "$(BLUE)  CodeQL — Security Scan (CSV)$(NC)\n"
	@printf "$(BLUE)========================================$(NC)\n"
	@mkdir -p $(CODEQL_RESULTS)
	codeql database analyze $(CODEQL_DB) \
		"$(CODEQL_PACK):codeql-suites/javascript-security-extended.qls" \
		--format=csv \
		--output=$(CODEQL_RESULTS)/arthurs-portfolio.csv
	@printf "$(GREEN)Results saved to $(CODEQL_RESULTS)/arthurs-portfolio.csv$(NC)\n"
	@printf "$(YELLOW)Columns: name, description, severity, message, path, start_line, start_col, end_line, end_col$(NC)\n"
	@printf "$(YELLOW)Paste this file into an AI chat to get fix suggestions$(NC)\n"

codeql-scan-quality-csv: ## Run quality scan (CSV)
	@printf "$(BLUE)========================================$(NC)\n"
	@printf "$(BLUE)  CodeQL — Quality Scan (CSV)$(NC)\n"
	@printf "$(BLUE)========================================$(NC)\n"
	@mkdir -p $(CODEQL_RESULTS)
	codeql database analyze $(CODEQL_DB) \
		"$(CODEQL_PACK):codeql-suites/javascript-security-and-quality.qls" \
		--format=csv \
		--output=$(CODEQL_RESULTS)/arthurs-portfolio-quality.csv
	@printf "$(GREEN)Results saved to $(CODEQL_RESULTS)/arthurs-portfolio-quality.csv$(NC)\n"
	@printf "$(YELLOW)Columns: name, description, severity, message, path, start_line, start_col, end_line, end_col$(NC)\n"

codeql-scan-csv-all: codeql-scan-security-csv codeql-scan-quality-csv ## Run all CodeQL query suites (CSV)

# ============================================================
# Python Environment (for version bump scripts)
# ============================================================

.ensure-venv:
	@[ -d "$(VENV_BIN)" ] || $(MAKE) --no-print-directory venv

venv: ## Create Python virtual environment (used by bump-* targets)
	@printf "$(GREEN)Creating Python virtual environment...$(NC)\n"
	@rm -rf .venv
	$(PY_CMD) -m venv .venv
	$(PYTHON) -m pip install --upgrade pip
	@printf "$(GREEN)Virtual environment created at .venv$(NC)\n"

# ============================================================
# Version Bumping
# ============================================================

.PHONY: bump-patch bump-minor bump-major

bump-patch: .ensure-venv ## Bump patch version (0.0.X) — updates VERSION and package.json
	@$(PYTHON) scripts/bump_version.py patch

bump-minor: .ensure-venv ## Bump minor version (0.X.0) — updates VERSION and package.json
	@$(PYTHON) scripts/bump_version.py minor

bump-major: .ensure-venv ## Bump major version (X.0.0) — updates VERSION and package.json
	@$(PYTHON) scripts/bump_version.py major

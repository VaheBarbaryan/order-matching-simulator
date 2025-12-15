# ======================================
# Project configuration
# ======================================
COMPOSE = docker compose
DEV_FILE = docker-compose.dev.yaml

# Default target
.DEFAULT_GOAL := help

# ======================================
# Help
# ======================================
.PHONY: help
help:
	@echo ""
	@echo "Available commands:"
	@echo "------------------------------------------------"
	@echo "make dev            Start dev environment"
	@echo "make dev-down       Stop dev environment"
	@echo "make dev-build      Build dev images"
	@echo "make dev-rebuild    Rebuild dev images (no cache)"
	@echo "make dev-logs       Follow dev logs"
	@echo "make dev-ps         Show running containers"
	@echo "make clean          Full cleanup (DANGEROUS)"
	@echo ""

# ======================================
# Development
# ======================================
.PHONY: dev
dev:
	$(COMPOSE) -f $(DEV_FILE) up --build -d

.PHONY: dev-down
dev-down:
	$(COMPOSE) -f $(DEV_FILE) down

.PHONY: dev-build
dev-build:
	$(COMPOSE) -f $(DEV_FILE) build

.PHONY: dev-rebuild
dev-rebuild:
	$(COMPOSE) -f $(DEV_FILE) build --no-cache

.PHONY: dev-logs
dev-logs:
	$(COMPOSE) -f $(DEV_FILE) logs -f

.PHONY: dev-ps
dev-ps:
	$(COMPOSE) -f $(DEV_FILE) ps

# ======================================
# Cleanup
# ======================================
.PHONY: clean
clean:
	$(COMPOSE) -f $(DEV_FILE) down -v --remove-orphans
	docker system prune -f

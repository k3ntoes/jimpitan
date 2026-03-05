.PHONY: help build run stop restart logs shell clean prune dev install db-generate db-push db-seed db-refresh

# Variables
IMAGE_NAME := jimpitan-app
CONTAINER_NAME := jimpitan-container
PORT := 3000

# Default target
help:
	@echo "Available commands:"
	@echo "  make build       - Build Docker image"
	@echo "  make run         - Run container in detached mode"
	@echo "  make stop        - Stop running container"
	@echo "  make restart     - Restart container"
	@echo "  make logs        - Show container logs"
	@echo "  make shell       - Access container shell"
	@echo "  make clean       - Remove container and image"
	@echo "  make prune       - Remove all unused Docker resources"
	@echo "  make dev         - Run development server locally"
	@echo "  make install     - Install dependencies locally"
	@echo "  make db-generate - Generate Prisma client"
	@echo "  make db-push     - Push schema to database"
	@echo "  make db-seed     - Seed database"
	@echo "  make db-refresh  - Refresh database (reset and seed)"

# Docker commands
build:
	@echo "Building Docker image..."
	docker build -t $(IMAGE_NAME) .

run:
	@echo "Running container..."
	docker run -d --name $(CONTAINER_NAME) -p $(PORT):3000 $(IMAGE_NAME)
	@echo "Container is running at http://localhost:$(PORT)"

stop:
	@echo "Stopping container..."
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

restart: stop run

logs:
	docker logs -f $(CONTAINER_NAME)

shell:
	docker exec -it $(CONTAINER_NAME) /bin/sh

clean:
	@echo "Cleaning up..."
	-docker stop $(CONTAINER_NAME)
	-docker rm $(CONTAINER_NAME)
	-docker rmi $(IMAGE_NAME)

prune:
	@echo "Pruning Docker resources..."
	docker system prune -af

# Docker Compose commands
up:
	@echo "Starting services with docker compose..."
	docker compose up -d

down:
	@echo "Stopping services..."
	docker compose down

up-build:
	@echo "Building and starting services..."
	docker compose up -d --build

compose-logs:
	docker compose logs -f

# Local development commands
dev:
	bun run dev

install:
	bun install

db-generate:
	bun run db:generate

db-push:
	bun run db:push

db-seed:
	bun run db:seed

db-refresh:
	bun run db:refresh

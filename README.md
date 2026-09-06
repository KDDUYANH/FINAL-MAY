# MÂY Creative Studio

> Premium AI Brand Content Production OS for Beauty & Cosmetics.

[![Container Registry](https://github.com/KDDUYANH/FINAL-MAY/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/KDDUYANH/FINAL-MAY/actions/workflows/docker-publish.yml)

## Overview

MÂY Creative Studio is an AI-powered visual production engine engineered specifically for high-end beauty and cosmetic brands. Built on Next.js 15, TypeScript, Tailwind CSS, and optimized for Google Cloud Run and GitHub Container Registry.

### Key Capabilities
- **Product Truth & Brand Locking**: Strictly preserve product shape, labels, typography, and color integrity.
- **Smart Editorial Pipeline**: AI Background Generator, Relighting & Shadows, Composition Balancer, Beautify & Clean, Super Resolution & Texture Restore.
- **Automated Content Pack**: 1-click batch generation across e-commerce (1:1), Story/Reels (9:16), Landscape (16:9), and Hero banner (3:4).
- **AI QA Quality Gate**: Automated defect check (halo, blur, edge bleed, typography warp) before production export.
- **Production Containerization**: Multi-stage standalone Alpine Docker container (< 85 MB), non-root execution, Cloud Run ready.

---

## Quick Start

### 1. Local Development
```bash
# Clone the repository
git clone https://github.com/KDDUYANH/FINAL-MAY.git
cd FINAL-MAY

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### 2. Run with Docker
```bash
# Build the production container
docker build -t may-creative-studio:latest .

# Run the container
docker run -p 8080:8080 may-creative-studio:latest
```

### 3. Deploy from GitHub Container Registry
The repository includes a GitHub Actions workflow (`.github/workflows/docker-publish.yml`) that automatically builds and publishes the production image to GitHub Container Registry:
```bash
docker pull ghcr.io/kdduyanh/final-may:latest
```

---

## Tech Stack
- **Framework**: Next.js 15 (Standalone output)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS & Lucide Icons
- **State Management**: Zustand
- **Container**: Docker (Node 20 Alpine multi-stage)
- **CI/CD**: GitHub Actions & GitHub Container Registry (`ghcr.io`)
- **Cloud Platform**: Google Cloud Run

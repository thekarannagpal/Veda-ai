# VedaAI - Assessment Creator

This repository contains the Full Stack Assignment for VedaAI. It fulfills all the core requirements including Assignment Creation (Frontend), AI Question Generation, Backend System integration, and an Enhanced Output Page to display the generated Question Paper.

## Features ✨

### Core Features

1. **Frontend (Next.js + TypeScript + Tailwind)**
   * Modern, Apple-inspired UI with smooth transitions and responsive design.
   * Zustand state management & Socket.IO client built-in.
   * File upload capability (PDFs & text extraction backend support).
   * Robust form validations.
2. **Backend (Node.js + Express + BullMQ)**
   * Complete API to accept frontend inputs.
   * BullMQ manages background queue for the robust processing of AI tasks.
   * MongoDB stores assessments and statuses.
   * WebSockets push status and real-time completions back to Next.js clients.
3. **AI Question Generation**
   * Uses `@google/genai` (Gemini 2.5 Flash) with custom prompt engineering.
   * Structures data strictly returning valid JSON matching section-by-section schemas.
   * Distributes marks perfectly to match parameter demands.
4. **Enhanced Output Page (PDF Support)**
   * Matches professional exam paper layouts.
   * Dynamic badges mapping Easy/Moderate/Hard difficulty.
   * Quick action bar.
   * Instant Export to PDF via `html2canvas` & `jsPDF`.

## Dependencies & Tech Stack
- Frontend: `Next.js 15`, `React 19`, `Tailwind CSS 4`, `Zustand`, `Socket.IO Client`, `Lucide React`
- Backend: `Express`, `BullMQ`, `Redis`, `MongoDB`, `Mongoose`, `@google/genai`, `Socket.IO`, `pdf-parse`

## Setup & Running Locally

### 1. Prerequisites
- Node.js (v18+)
- Docker & Docker Compose (For Redis and MongoDB) or Local MongoDB & Redis instances.

### 2. Infrastructure Setup (Docker)
In the project root `veda-ai` directory, spawn the databases:
```sh
docker-compose up -d
```

### 3. Backend Setup
1. Open a terminal and navigate to: `cd backend`
2. Run `npm install` (if not already run)
3. Create a `.env` file in the `backend/` folder:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/veda-ai
    REDIS_HOST=localhost
    REDIS_PORT=6379
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
4. Start the backend DEV server:
   ```sh
   npm run dev
   ```

### 4. Frontend Setup
1. Open another terminal and navigate to: `cd frontend`
2. Run `npm install` (if not already run)
3. Start the Next.js DEV server:
   ```sh
   npm run dev
   ```

### 5. Open Application
Navigate to `http://localhost:3000` to interact with the Assessment Creator.

## Architecture

- **Client**: Submits constraints along with the optional source document. Connects via websocket listening to status messages.
- **Server API**: Express parses PDFs via `pdf-parse`, pushes Job payload into BullMQ Queue. Responds successfully instantiated Job ID.
- **Worker/Queue**: Dedicated BullMQ worker picks up jobs, processes prompts against Google Gemini, receives JSON, validates and normalizes output, stores strictly in MongoDB, then emits `COMPLETED` action via WebSockets.
- **Client (Assignment View)**: Subscribed sockets trigger UI transition. Evaluates and displays results dynamically with Download to PDF feature attached.

## Bonus Achievements Included 🎉
- **Download as PDF**: Added native DOM to Canvas to PDF capabilities ensuring 1:1 format exports.
- **Progressive UI Polish**: Added clear states for Loading, Dynamic Color Indicators for Difficulty Tags, professional form inputs.
- **Background workers**: Setup with reliable `BullMQ` scaling logic natively separating express endpoints from resource-heavy prompting tasks.  

# AI Kavach — Cyber-Reasoning Workbench

AI Kavach is a defensive, autonomous cybersecurity control plane designed to find, triage, patch, and verify vulnerabilities in software. Built as an air-gapped ready Cyber-Reasoning System (CRS), it bridges the gap between threat discovery and secure remediation.

## 🚀 Key Features

1. **8-Stage Autonomous Pipeline Stepper:** Watches the closed-loop cycle advance (Intake ➔ AST Map ➔ SAST ➔ DAST ➔ Fuzzing ➔ Exploit Proof ➔ AI Patch ➔ Safety Verification).
2. **Defensive ASAN Log Triage:** Paste raw compiler AddressSanitizer logs and securely extract faulting file, line, function, and stack trace coordinates via string regex processing (zero binary execution risk).
3. **AI Planner Reasoning Timeline:** Review the thoughts, hypotheses, actions, and confidence metrics of the AI engine.
4. **Interactive Highlights Code Diff:** Visualizes unified code modifications (original vs. patched) with red/green diff indicators.
5. **Acceptance Safety Gates Checklist:** Confirms the patch fixes the exploit while passing functional regression checks.
6. **Immutable Evidence & Manifest Exporter:** Attests runs with SHA-256 signatures and exports complete compliance JSON audit packages.
7. **Dual Mode Execution Engine:**
   - **Simulation Mode:** Time-based simulation runs with fully populated logging streams and outcome diffs (runs out of the box on any computer without dependencies).
   - **Local Workspace Mode:** Integrates with local Python processes to spawn actual `CRSOrchestrator` pipelines on your target codebases.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6, Tailwind CSS, Lucide Icons, Vite
- **Backend:** Hono API Router, Cloudflare Wrangler CLI (edge-ready)
- **Local Bridges:** Python, GCC toolchains (optional for local mode)

---

## 🏃 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v20+ recommended) installed.

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone <your-github-repo-url>
cd ai-kavach
npm install
```

### 3. Running the Server (Vite + Hono Dev)
Start the local server:
```bash
npm run dev
```
Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔒 Security & Portability Configurations

The backend API utilizes environment variables configured in `wrangler.toml` to secure filesystem targets:
- `CRS_RUNS_DIR`: Path to execution runs directories.
- `TARGETS_DIR`: Path to the targets sandbox directory.
- `PYTHON_CMD`: Path to Python command command line interpreter.

If executed in a cloud worker where the local filesystem is unavailable, the application gracefully degrades to simulation mode automatically.

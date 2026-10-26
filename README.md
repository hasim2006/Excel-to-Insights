# 🚀 Excel to Insights (NexusBI)

An autonomous enterprise Business Intelligence (BI) and AI analytics engine that transforms raw spreadsheets (`.xlsx`, `.xls`, `.csv`) into interactive, holographic dashboards, predictive forecasts, and executive-ready reports in real-time.

---

## ✨ Features

- **Multi-Model AI Engine**:
  - Connect and route between **Google Gemini (Gemini 2.5 Flash / 1.5 Pro)**, **Anthropic Claude 3.5 Sonnet**, **OpenAI GPT-4o / o1**, **DeepSeek V3 / R1**, and local **Ollama** clusters.
  - Live latency ping tests, credential management, and active model toggling.
  
- **Instant Excel & CSV Parsing**:
  - Drag-and-drop or upload `.xlsx`, `.xls`, and `.csv` files.
  - Automatic column classification, numeric vectorization, and outlier detection.
  - Instant calculation of total revenue, profit margins, volume trends, and segment breakdowns.

- **Cinematic Holographic Dashboard**:
  - Real-time KPI sparklines with trend velocity.
  - Dynamic composed revenue vs target benchmark curves.
  - Neural net demand forecasts and segment distribution.

- **Autonomous AI Dialogue (Chat)**:
  - Query your data lake in natural language.
  - Automatic generation of embedded interactive charts based on user queries.
  - Voice recognition mic support and file attachments.

- **Executive Report Center**:
  - 1-click autonomous AI deck compilation.
  - Markdown/PDF report download and stakeholder email dispatch.

- **Zero-Trust Authentication & Profiles**:
  - Secure modal supporting email/password and 1-click enterprise demo profiles (*Chief Data Officer*, *Lead Data Scientist*, *BI Analyst*).
  - Profile switching and safe session sign-out.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Glassmorphism & Cyber Dark UI
- **Animations**: Motion (`motion/react`)
- **Visualizations**: Recharts, Lucide Icons
- **Data Ingestion**: SheetJS (`xlsx`)
- **AI SDK**: Google Gen AI SDK (`@google/genai`)

---

## 🏁 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hasim2006/Excel-to-Insights.git
   cd Excel-to-Insights
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set your Gemini API Key in `.env`:
   ```bash
   cp .env.example .env
   # Add your key to GEMINI_API_KEY
   ```

4. Launch development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Scripts

- `npm run dev` - Starts the local development server at `http://localhost:3000`
- `npm run lint` - Runs TypeScript type checking (`tsc --noEmit`)
- `npm run build` - Compiles the production bundle into `dist/`
- `npm run preview` - Previews the production build locally

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

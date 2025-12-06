# EchoSimulator 🗣️🧠

**A Tactical Conversation Engine & Influence Simulator**

EchoSimulator is a training ground for high-stakes interpersonal dynamics. It uses Large Language Models (LLMs) to simulate realistic, psychologically complex personas (e.g., a stubborn family member, a demanding client, or a pragmatic boss) and allows users to practice negotiation, de-escalation, and persuasion in a risk-free environment.

Unlike standard chatbots, EchoSimulator exposes the **hidden internal state** of the conversation partner—revealing their private thoughts, emotional metrics (Trust, Tension), and the tactical impact of your words.

![EchoSimulator Banner](https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=1000)

---

## 🚀 Key Features

<img width="400" height="300" alt="Screenshot 2025-12-06 115348" src="https://github.com/user-attachments/assets/b5c12dd3-a022-441d-8e35-443abd43f827" />

<img width="600" height="300" alt="Screenshot 2025-12-06 115531" src="https://github.com/user-attachments/assets/a40488ce-30e2-4315-b1b4-3b51081b99db" />


### 🎭 Deep Psychological Simulation
Conversations are driven by detailed persona profiles including specific **triggers, cognitive styles, and hidden agendas**. The AI doesn't just reply; it reacts emotionally based on the history of the interaction.

### 🧠 "Internal Monologue" Reveal
See what the other person is *thinking* but not saying. After every turn, you can inspect the AI's internal monologue to understand why a specific approach worked or backfired.

### 📊 Real-Time Metrics
Watch the emotional landscape evolve turn-by-turn with live data visualization:
- **Trust Score**: Are they opening up or shutting down?
- **Tension Level**: Is the conflict escalating?
- **Goal Progress**: Are you getting closer to your objective?
- **Authenticity**: Is the persona masking their true feelings?

### ♟️ Strategic Assistance
Don't know what to say? The engine analyzes the context and suggests three distinct approaches for every turn:
- **Defensive**: Safe, de-escalating, low risk.
- **Moderate**: Balanced, nudges the conversation forward.
- **Risky**: High-leverage moves (ultimatums, hard pivots) that can either win big or crash the talk.

### 📚 Rhetorical Library & Fallacy Guard
Learn the theory behind the practice. The app includes a built-in library of rhetorical devices (Anchoring, Labeling, Mirroring) and common logical fallacies, helping you identify and use them effectively.

<img width="400" height="300" alt="Screenshot 2025-12-06 115412" src="https://github.com/user-attachments/assets/afc0cd46-4f3a-45d1-97f8-3613dbecded0" /> 
<img width="400" height="300" alt="Screenshot 2025-12-06 120256" src="https://github.com/user-attachments/assets/48539d42-c9f8-49b1-a560-85ce97c6e22d" /> 
<img width="400" height="300" alt="Screenshot 2025-12-06 120242" src="https://github.com/user-attachments/assets/adc088fe-bc7e-4bd1-82ec-0b20fa837a90" />


### 🔁 Auto vs. Self-Play Modes
- **Simulation Mode**: You vs. The AI.
- **Self-Play Mode**: You control *both* sides. The AI acts as a coach, analyzing your script for the target and telling you how realistic it is based on their profile.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **AI Integration**: Google Gemini API (`@google/genai` SDK)
- **Visualization**: Recharts

---

## ⚡ Installation & Setup

Follow these steps to run EchoSimulator locally.

### Prerequisites
- Node.js (v18 or higher)
- A Google Cloud Project with the **Gemini API** enabled.
- An API Key from [Google AI Studio](https://aistudio.google.com/).

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/echosimulator.git
cd echosimulator
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory of the project. Add your Gemini API key:

```env
# .env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

> **Note**: In the provided code for this project, the API key is accessed via `process.env.API_KEY`. Depending on your build tool (Vite, Webpack), you may need to adjust the prefix (e.g., `VITE_API_KEY`) or how the key is injected.

### 4. Run the Development Server
```bash
npm start
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) to view the app.

---

## 📖 How to Use

1. **Select a Scenario**: Choose from presets (Salary Negotiation, Estranged Sibling, Client Crisis) or randomize for a challenge.
2. **Define Persona**: Tweak the target's traits, triggers, and hidden context.
3. **Set Goal**: Define what "winning" looks like (e.g., "Get a 15% raise").
4. **Engage**:
   - Select a pre-generated strategy card to see how it plays out.
   - Or, write your own custom response and ask the AI to evaluate its risk before sending.
5. **Analyze**: Click on past messages to see the "Internal Monologue" and the metric snapshot at that specific moment in time.

---

## ⚠️ Disclaimer

EchoSimulator is for **educational and entertainment purposes only**. While it uses advanced AI to model human behavior, real human interactions are infinitely complex. Do not use this tool as a substitute for professional conflict resolution, legal, or psychological advice.

---

*Built with ❤️ using Google Gemini*

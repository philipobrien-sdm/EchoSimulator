import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Persona, Goal, Message, ReplyOption, AnalysisMetrics } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

// --- Prompts ---

const generateSystemInstruction = (persona: Persona, goal: Goal) => `
You are the "EchoSimulator" engine. Your task is to simulate a realistic conversation for training purposes.

TARGET PERSONA:
Name: ${persona.name}
Role: ${persona.role}
Traits: ${persona.traits}
Triggers: ${persona.triggers}
Comm Style: ${persona.style}
Shared Context: ${persona.context}

PERSPECTIVES (The core conflict):
- Target's View: ${persona.perspective}
- User's View: ${goal.perspective}

USER GOAL: ${goal.type} - ${goal.description}

You have two modes of operation:
1. "PREDICTOR": Analyze the chat history and generate 3 strategic reply options for the USER (Defensive, Moderate, Risky).
2. "SIMULATOR": Roleplay as the TARGET PERSONA reacting to the user's latest message.

Maintain high psychological realism. Do not be overly agreeable. Reflect the persona's flaws, trauma, and specific cognitive style.
`;

// --- Schemas ---

const singleReplyOptionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING, enum: ['DEFENSIVE', 'MODERATE', 'RISKY', 'CUSTOM'] },
    content: { type: Type.STRING },
    rhetoricalTechnique: { type: Type.STRING },
    timing: { type: Type.STRING },
    predictedReaction: {
      type: Type.OBJECT,
      properties: {
        likelyOutcome: { type: Type.STRING },
        bestCase: { type: Type.STRING },
        worstCase: { type: Type.STRING },
        emotionalImpact: { type: Type.STRING },
        riskScore: { type: Type.NUMBER }
      },
      required: ['likelyOutcome', 'bestCase', 'worstCase', 'emotionalImpact', 'riskScore']
    }
  },
  required: ['type', 'content', 'rhetoricalTechnique', 'timing', 'predictedReaction']
};

const replyOptionsSchema: Schema = {
  type: Type.ARRAY,
  items: singleReplyOptionSchema
};

const metricsSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        trustScore: { type: Type.NUMBER, description: "0-100" },
        tensionLevel: { type: Type.NUMBER, description: "0-100" },
        goalProgress: { type: Type.NUMBER, description: "0-100" },
        authenticityScore: { type: Type.NUMBER, description: "0-100 check on if persona is masking" },
        lastAssessment: { type: Type.STRING, description: "Brief analysis of the last turn" },
        closingReadiness: { type: Type.NUMBER, description: "0-100 score on how wise it is to end the conversation now." },
        suggestedClosing: { type: Type.STRING, description: "A suggested sign-off message for the user if they chose to end now." }
    },
    required: ['trustScore', 'tensionLevel', 'goalProgress', 'authenticityScore', 'lastAssessment', 'closingReadiness', 'suggestedClosing']
};

const simulationResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    response: { type: Type.STRING, description: "The persona's verbal response." },
    internalMonologue: { type: Type.STRING, description: "What the persona is thinking but not saying." },
    metrics: metricsSchema
  },
  required: ['response', 'metrics', 'internalMonologue']
};

const manualAnalysisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        internalMonologue: { type: Type.STRING, description: "What the persona is thinking while saying this manual response." },
        metrics: metricsSchema
    },
    required: ['metrics', 'internalMonologue']
};

// --- API Methods ---

export const generateStrategicOptions = async (
  persona: Persona, 
  goal: Goal, 
  history: Message[]
): Promise<ReplyOption[]> => {
  const historyText = history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
  
  const prompt = `
    CONVERSATION HISTORY:
    ${historyText}

    TASK:
    Generate 3 distinct strategic reply options for the USER to send next.
    1. Defensive/Holding: Low risk, maintains status quo.
    2. Moderate: Balanced, nudges towards goal.
    3. Risky: High reward, strong push, uses advanced leverage.
    
    For each option, predict the likely, best, and worst-case reactions. 
    Also provide timing advice (e.g. "Wait 5 minutes", "Reply Immediately") based on the emotional context.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: generateSystemInstruction(persona, goal),
        responseMimeType: "application/json",
        responseSchema: replyOptionsSchema,
        temperature: 0.7
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating options:", error);
    return [];
  }
};

export const simulatePersonaResponse = async (
  persona: Persona,
  goal: Goal,
  history: Message[],
  userMessage: string
): Promise<{ text: string, monologue: string, metrics: AnalysisMetrics }> => {
  const historyText = history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
  const prompt = `
    CONVERSATION HISTORY:
    ${historyText}
    USER JUST SAID: "${userMessage}"

    TASK:
    1. Roleplay the TARGET PERSONA's response to the USER.
    2. Update the analysis metrics (Trust, Tension, Goal Progress).
    3. Calculate 'closingReadiness' (0-100): Is this a good time to end the conversation? 
    4. Provide a 'suggestedClosing': A polite or strategic way for the USER to sign off now.
    5. Provide an internal monologue explaining why they are responding this way.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: generateSystemInstruction(persona, goal),
        responseMimeType: "application/json",
        responseSchema: simulationResponseSchema,
        temperature: 0.8 // Slightly higher for emotional variance
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      text: data.response,
      monologue: data.internalMonologue,
      metrics: { ...data.metrics, turnNumber: history.length + 1 }
    };
  } catch (error) {
    console.error("Error simulating response:", error);
    throw error;
  }
};

export const analyzeManualResponse = async (
    persona: Persona,
    goal: Goal,
    history: Message[],
    manualResponse: string
  ): Promise<{ monologue: string, metrics: AnalysisMetrics }> => {
    const historyText = history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
    const prompt = `
      CONVERSATION HISTORY:
      ${historyText}
      
      TARGET PERSONA (Manual Input) JUST SAID: "${manualResponse}"
  
      TASK:
      The user has manually input the persona's response.
      1. Analyze this response as if the persona said it.
      2. Provide the internal monologue (What are they thinking to say this?).
      3. Update the analysis metrics based on this new state.
      4. Calculate closing readiness.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: generateSystemInstruction(persona, goal),
          responseMimeType: "application/json",
          responseSchema: manualAnalysisSchema,
          temperature: 0.5
        }
      });
  
      const data = JSON.parse(response.text || "{}");
      return {
        monologue: data.internalMonologue,
        metrics: { ...data.metrics, turnNumber: history.length + 1 }
      };
    } catch (error) {
      console.error("Error analyzing manual response:", error);
      throw error;
    }
  };

export const evaluateUserDraft = async (
  persona: Persona,
  goal: Goal,
  history: Message[],
  draft: string
): Promise<ReplyOption> => {
    const historyText = history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
    const prompt = `
      CONVERSATION HISTORY:
      ${historyText}
      
      USER DRAFT: "${draft}"

      TASK:
      Analyze this draft response as if it were a strategic option.
      Determine its Strategy Type (DEFENSIVE, MODERATE, or RISKY) based on content.
      Predict the reactions (Likely, Best, Worst).
      Assign a Risk Score.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                systemInstruction: generateSystemInstruction(persona, goal),
                responseMimeType: "application/json",
                responseSchema: singleReplyOptionSchema,
                temperature: 0.5
            }
        });
        return JSON.parse(response.text);
    } catch (e) {
        console.error(e);
        // Fallback
        return {
            type: 'CUSTOM',
            content: draft,
            rhetoricalTechnique: "User Defined",
            timing: "Immediate",
            predictedReaction: {
                likelyOutcome: "Unknown",
                bestCase: "Unknown",
                worstCase: "Unknown",
                emotionalImpact: "Uncertain",
                riskScore: 50
            }
        }
    }
};

export const generateInitialGreeting = async (persona: Persona, goal: Goal): Promise<string> => {
    const prompt = `
      TASK: Generate the opening line for the conversation from the TARGET PERSONA.
      They are initiating or responding to the user's presence based on the context: "${persona.context}".
      Keep it short and authentic to the traits: ${persona.traits}.
      Target Perspective: ${persona.perspective}
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                systemInstruction: generateSystemInstruction(persona, goal),
                temperature: 0.7,
                responseMimeType: "text/plain"
            }
        });
        return response.text.trim();
    } catch (e) {
        return "I'm listening.";
    }
}
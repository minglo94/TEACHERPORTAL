
import { GoogleGenAI } from "@google/genai";

export async function generateAIResponse(prompt: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text || "AI 無法生成回應，請再試一次。";
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}


import { GoogleGenAI } from "@google/genai";
import { DashboardState } from "../types";

export const getActionableIntelligence = async (data: DashboardState): Promise<string> => {
  /* Safely obtain API key from the environment */
  let apiKey = "";
  try {
    apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : "";
  } catch (e) {
    console.warn("API Key access check failed, using empty default.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    As a senior policy analyst for the Labour Department of Telangana, analyze the following dashboard data for a ${data.role} in ${data.jurisdiction}.
    
    Data Summary:
    - BOCW Pending Applications: ${data.bocwData.reduce((acc, d) => acc + d.pending, 0)}
    - Shop Registration Renewals Pending: ${data.shopData.reduce((acc, d) => acc + d.renewalsPending, 0)}
    - Case Disposal Rate: ${data.caseData.reduce((acc, d) => acc + d.filed, 0) > 0 ? Math.round(data.caseData.reduce((acc, d) => acc + d.disposed, 0) / data.caseData.reduce((acc, d) => acc + d.filed, 0) * 100) : 0}%
    - Inspection Achievement: ${data.inspections.achieved}/${data.inspections.target}
    - Child Labour Rescues: ${data.inspections.childLabourRescues}
    
    Provide a concise, professional report (3-4 bullet points) in Markdown format focusing on:
    1. Critical bottlenecks (High pendency areas).
    2. Operational efficiency trends.
    3. Specific recommendations for the ${data.role} to improve performance in the current jurisdiction.
    4. Notable successes (like high compliance or effective rescues).
    
    Keep the tone authoritative yet helpful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Unable to generate intelligence report at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI intelligence module is currently undergoing maintenance or the API key is invalid. Please try again later.";
  }
};

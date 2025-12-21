"use server";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"; 

// Note: user instructions said: 
// ".envに格納されているAI_API_KEYの末尾に /free にPOSTで...送ると"
// implicitly "AI_API_KEY" might contain the base URL or I should append /free to the key?
// Let's re-read carefully: "AI_API_KEYの末尾に /free にPOSTで..."
// Usually keys are keys. It sounds like AI_API_KEY might be a full URL base?
// Or maybe the user means "Append /free to the ENDPOINT determined by AI_API_KEY"?
// "AI_API_KEYの末尾に /free" -> literally "at the end of AI_API_KEY". 
// If AI_API_KEY is just a key "abc", then "abc/free" doesn't make sense as a URL.
// So AI_API_KEY is likely the Base URL.
// I will check .env to be sure, but I can't read it? 
// The user said: ".envに格納されているAI_API_KEYの末尾に /free にPOSTで"
// This strongly implies AI_API_KEY holds the URL.

export type AIResponse = {
  detected: {
    language: string;
    framework: string | null;
    errorType: string;
  };
  summary: {
    original: string;
    translated: string;
    oneLiner: string;
  };
  patterns: {
    id: number;
    title: string;
    likelihood: "high" | "medium" | "low";
    explanation: string;
    codeExample: {
      bad: string;
      good: string;
      diff: string;
      why: string;
    };
  }[];
};

export async function explainError(errorMessage: string) {
  const AI_API_KEY = process.env.AI_API_KEY;
  if (!AI_API_KEY) {
    throw new Error("AI_API_KEY is not defined");
  }

  const endpoint = `${AI_API_KEY}/free`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: errorMessage }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("AI API Error:", response.status, text);
      throw new Error(`AI API request failed: ${response.status}`);
    }

    const data = await response.text(); // The user said "AIが返してくる" in the format.
    // The user example shows markdown code block with JSON.

    // Regex to extract JSON object
    const jsonMatch = data.match(/```json\s*(\{[\s\S]*?\})\s*```/) || data.match(/(\{[\s\S]*\})/);
    
    if (!jsonMatch) {
      console.error("Failed to parse AI response (Regex mismatch):", data);
      throw new Error("Failed to parse AI response");
    }

    const jsonString = jsonMatch[1];
    const parsedData = JSON.parse(jsonString) as AIResponse;
    return parsedData;

  } catch (error) {
    console.error("explainError failed:", error);
    throw error;
  }
}

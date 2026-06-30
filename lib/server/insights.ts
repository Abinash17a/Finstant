// lib/server/insights.ts  — server-only, never import this from a "use client" file
export async function generateInsights(data: string) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat-v3.1",
      messages: [{ role: "user", content: data }],
    }),
  });

  if (response.status === 429) {
    throw new Error("Rate limited — please try again in a moment.");
  }

  const result = await response.json();
  const rawText = result?.choices?.[0]?.message?.content;

  if (!rawText) {
    console.error("Unexpected response shape:", result);
    throw new Error("Invalid response from AI provider.");
  }

  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json") || cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error("Error parsing AI response:", parseError, "Raw text:", rawText);
    throw new Error("Failed to parse AI response as JSON.");
  }
}
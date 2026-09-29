export async function generateCropRecommendations(data) {
  const apiKey = (typeof window !== "undefined" && window.BV_CONFIG && window.BV_CONFIG.GEMINI_API_KEY) || "";

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    throw new Error("Gemini API key is not configured. Please add a valid GEMINI_API_KEY in shared/config.js.");
  }

  // Detect active app language (set by shared/language.js -> window.BV_I18N).
  // Priority: explicit data.language -> BV_I18N.lang -> localStorage -> "hi".
  const lang =
    (data && data.language) ||
    (typeof window !== "undefined" && window.BV_I18N && window.BV_I18N.lang) ||
    (typeof localStorage !== "undefined" && localStorage.getItem("bv-language")) ||
    "hi";

  const isHindi = lang === "hi";

  const languageInstruction = isHindi
    ? `IMPORTANT LANGUAGE REQUIREMENT:
- Respond ENTIRELY in Hindi using proper Devanagari script (देवनागरी).
- Every JSON string value (crop names, reasons, fertilizer plan, irrigation strategy, risks, profit explanation, confidence) MUST be written in Hindi.
- Do NOT mix English words inside the Hindi text. Use standard Hindi agricultural terms.
- Keep ONLY the JSON keys in English exactly as specified. Do not translate the keys.`
    : `IMPORTANT LANGUAGE REQUIREMENT:
- Respond ENTIRELY in clear, simple English.
- Do NOT use Hindi or any other language. Do not mix languages.
- Keep the JSON keys exactly as specified.`;

  const prompt = `
You are an agricultural expert.

${languageInstruction}

Farmer Location:
State: ${data.state}
District: ${data.district}
Village: ${data.village}

Weather:
Temperature: ${data.temp}°C
Humidity: ${data.humidity}%
Annual Rainfall: ${data.rainfall} mm

Soil:
Type: ${data.soilType}
pH: ${data.ph}
Nitrogen: ${data.nitrogen}
Phosphorus: ${data.phosphorus}
Potassium: ${data.potassium}

Season: ${data.season}
Budget: ${data.budget}
Land Size: ${data.land} acres

Provide:
1. Top 3 recommended crops
2. Why each crop is suitable
3. Fertilizer recommendations
4. Irrigation advice
5. Risk factors

Return ONLY valid JSON in this format:

{
  "crop1": "",
  "crop2": "",
  "crop3": "",
  "crop1Reason": "",
  "crop2Reason": "",
  "crop3Reason": "",
  "fertilizer": "",
  "irrigation": "",
  "risks": "",
  "profit": "",
  "confidence": ""
}

Do not return markdown.
Do not return HTML.
Do not add explanations outside JSON.
`;

  // Standard stable model: gemini-3.8-flash
  const model = "gemini-3.8-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });
  } catch (netErr) {
    throw new Error(`Network error connecting to Gemini API: ${netErr.message}`);
  }

  if (!response.ok) {
    let rawError = "";
    try {
      const errJson = await response.json();
      rawError = errJson.error?.message || `HTTP ${response.status} ${response.statusText}`;
    } catch (_) {
      try {
        rawError = await response.text();
      } catch (__) {
        rawError = `HTTP ${response.status} ${response.statusText}`;
      }
    }

    // Ensure API key is never exposed in error message
    if (apiKey && rawError.includes(apiKey)) {
      rawError = rawError.replaceAll(apiKey, "[REDACTED]");
    }

    throw new Error(`Gemini API Error (${response.status}): ${rawError}`);
  }

  let result;
  try {
    result = await response.json();
  } catch (jsonErr) {
    throw new Error("Failed to parse response from Gemini API.");
  }

  const parts = result.candidates?.[0]?.content?.parts || [];
  const textPart = parts.find(p => typeof p.text === "string" && p.text.trim().length > 0);
  const text = textPart ? textPart.text : (parts[0]?.text || "");

  if (!text) {
    throw new Error("Gemini returned an empty or invalid response.");
  }

  const cleanText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanText);
  } catch (parseErr) {
    throw new Error("Received invalid JSON from Gemini AI service.");
  }
}
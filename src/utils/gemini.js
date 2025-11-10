// utils/gemini.js

// TRYING EXPLICIT LATEST VERSION - OFTEN FIXES 404s
const CHAT_MODEL = 'gemini-2.5-flash';
const VISION_MODEL = 'gemini-2.5-flash';

// Read and sanitize env vars
const rawKey1 = import.meta.env.VITE_GEMINI_API_KEY1 || import.meta.env.VITE_GEMINI_API_KEY || '';
const rawKey2 = import.meta.env.VITE_GEMINI_API_KEY2 || import.meta.env.VITE_GEMINI_API_KEY || '';
const API_KEY1 = String(rawKey1).replace(/;\s*$/, '').trim();
const API_KEY2 = String(rawKey2).replace(/;\s*$/, '').trim();

export async function getFitRxResponse(userQuestion, systemPrompt) {
    // Using v1beta for better compatibility with '-latest' models
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:generateContent?key=${API_KEY1}`;
    const requestBody = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userQuestion }] }]
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!res.ok) throw new Error(`Gemini chat error: ${res.status}`);
        const data = await res.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply';
    } catch (err) {
        console.error(err);
        return "Sorry, I'm having trouble connecting right now.";
    }
}

export async function analyzeFoodImage(imageFile) {
    if (!API_KEY2) {
        alert("API Key missing. Check .env.local");
        return null;
    }

    // Using v1beta here too
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${VISION_MODEL}:generateContent?key=${API_KEY2}`;

    try {
        const base64Image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });

        const prompt = `Analyze this food image. Identify food items and estimate nutritional content.
        Return ONLY a JSON object with this exact structure:
        {
          "items": [
            { "name": "Food Name", "amount": "quantity", "calories": 0, "protein": 0, "carbs": 0, "fats": 0 }
          ],
          "totalCalories": 0
        }`;

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: imageFile.type, data: base64Image } }
                    ]
                }]
            })
        });

        if (!res.ok) {
            const txt = await res.text();
            // If this STILL fails with 404, your API key might be for Vertex AI, not AI Studio.
            throw new Error(`API Error ${res.status}: ${txt}`);
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error("Gemini returned no text");

        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found");

        return JSON.parse(jsonMatch[0]);
    } catch (err) {
        console.error("Analysis failed:", err);
        alert(`Analysis failed: ${err.message.substring(0, 150)}`);
        return null;
    }
}
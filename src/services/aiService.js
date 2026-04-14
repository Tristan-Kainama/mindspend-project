const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export async function parseWithAI(text) {
  const prompt = `
You are an AI that extracts structured financial data from Indonesian spending text.

Extract:
- amount (convert to integer rupiah)
- category (Food, Transport, Shopping, Bills, Entertainment, Other)
- emotion (if mentioned, else null)
- merchant (if mentioned, else null)

Rules:
- Return ONLY valid JSON
- DO NOT include \`\`\`json
- DO NOT explain anything
- DO NOT even add a single word outside the JSON

Example Input: "Makan siang di KFC habis 50 ribu, enak banget!"
Example Output:
{
  "amount": 50000,
    "category": "Food",
    "emotion": "enak banget",
    "merchant": "KFC"
}

Now, extract data from this text:

Text: "${text}"
`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    )

    const data = await res.json()

    const rawText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    console.log('AI RAW RESPONSE:', rawText)

    // 🔥 extract JSON dari response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) throw new Error('Invalid AI response')

    return JSON.parse(jsonMatch[0])

  } catch (err) {
    console.error('AI ERROR:', err)
    return null
  }
}
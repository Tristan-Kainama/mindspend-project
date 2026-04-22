export const classifyEmotion = async (emotionText) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

  if (!emotionText) return 'Calm'

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{
                text: `Klasifikasikan emosi berikut ke salah satu dari:
Happy, Regret, Calm, Anxiety, Sad, Angry.

Jawab hanya 1 kata tanpa tambahan apapun.

Emosi: "${emotionText}"`
              }]
            }
          ]
        })
      }
    )

    const data = await res.json()
    let result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    // 🔥 Normalisasi output
    const valid = ['Happy', 'Regret', 'Calm', 'Anxiety', 'Sad', 'Angry']

    if (!result) return 'Calm'

    result = result.replace('.', '').trim() // hapus titik
    result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase()

    return valid.includes(result) ? result : 'Calm'

  } catch (err) {
    console.error(err)
    return 'Calm'
  }
}

const handleAddTransaction = async () => {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  try {
    loading.value = true

    // ✅ 1. Ambil input emosi user
    const userEmotionInput = emotionInput.value // misalnya: "nyesel beli ini"

    // ✅ 2. Kirim ke AI
    const emotionCategory = await classifyEmotion(userEmotionInput)

    // ✅ 3. Simpan ke database
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      amount: amount.value,
      category: category.value,
      type: type.value, // 'income' / 'expense'
      emotion: emotionCategory, // 🔥 hasil AI
      note: userEmotionInput,   // optional: simpan raw text juga
      created_at: new Date()
    })

    await fetchTransactions()

    console.log('AI RESULT:', emotionCategory)

    if (error) throw error

    console.log('SUCCESS INSERT:', emotionCategory)

    // reset form
    amount.value = ''
    category.value = ''
    emotionInput.value = ''

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase.js'
import { parseWithAI } from '../services/aiService'
import { extractTextFromImage, toBase64 } from '../services/ocrService'

const message = ref('')
const parsedData = ref(null)

const handleSend = async () => {
  parsedData.value = await parseWithAI(message.value);
  console.log(message.value);
}

const saveData = async () => {
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('transactions').insert([
    {
      user_id: user.id,
      amount: parsedData.value.amount,
      category: parsedData.value.category,
      emotion: parsedData.value.emotion,
      merchant: parsedData.value.merchant || 'Unknown'
    }
  ])
  alert ('Data saved successfully!')
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const base64 = await toBase64(file)

  const text = await extractTextFromImage(base64)

  console.log('OCR RESULT:', text)

  // 🔥 nanti kirim ke Gemini
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Chat</h1>

    <input 
      v-model="message"
      placeholder="Contoh: Makan 25rb gabut"
      class="border p-2 w-full mb-2"
    />

    <input class="border p-2 w-full mb-2" type="file" @change="handleImageUpload" />

    <button 
      @click="handleSend"
      class="bg-blue-500 text-white px-4 py-2"
    >
      Kirim
    </button>

    <div v-if="parsedData" class="mt-4">
      <p>Amount: {{ parsedData.amount }}</p>
      <p>Category: {{ parsedData.category }}</p>
      <p>Emotion: {{ parsedData.emotion }}</p>
      <p>Merchant: {{ parsedData.merchant || 'Unknown' }}</p>

      <button 
        @click="saveData"
        class="bg-green-500 text-white px-4 py-2 mt-2"
      >
        Simpan
      </button>
    </div>
  </div>
</template>
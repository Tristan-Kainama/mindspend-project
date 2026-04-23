<script setup>
import { ref, nextTick } from 'vue'
import { supabase } from '../../lib/supabase.js'
import { parseWithAI } from '../../services/aiService'
import { classifyEmotion } from '../../services/emotionClassifier'

const message = ref('')
const messages = ref([])
const isLoading = ref(false)
const chatContainer = ref(null)
const fileInput = ref(null)

const conversationHistory = ref([])

const SYSTEM_PROMPT = `Kamu adalah MindSpend, financial assistant untuk anak muda usia 18-25 tahun.
Tugasmu membantu mereka sadar dan bijak soal pengeluaran, terutama yang impulsif.
Gaya bicara: santai, relate, kayak teman yang ngerti keuangan — bukan ceramah.
Kalau user cerita tentang pengeluaran, tunjukkan empati dulu baru kasih insight.
Ingat konteks percakapan sebelumnya dan refer ke sana kalau relevan.
Jawab dalam Bahasa Indonesia, singkat dan padat (max 3-4 kalimat kecuali perlu penjelasan lebih).`

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const chatWithAI = async (userText) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
  if (!API_KEY) return 'API key belum diset.'

  conversationHistory.value.push({
    role: 'user',
    parts: [{ text: userText }]
  })

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: conversationHistory.value,
          generationConfig: { temperature: 0.8, maxOutputTokens: 500 }
        })
      }
    )

    if (!res.ok) {
      conversationHistory.value.pop()
      return `Ups, ada error. Coba lagi ya!`
    }

    const data = await res.json()
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Hmm, aku nggak dapat respons.'

    conversationHistory.value.push({
      role: 'model',
      parts: [{ text: aiText }]
    })

    return aiText
  } catch (err) {
    console.error('Fetch error:', err)
    conversationHistory.value.pop()
    return 'Koneksi bermasalah.'
  }
}

const handleSend = async () => {
  if (!message.value.trim() || isLoading.value) return

  isLoading.value = true
  const userText = message.value.trim()

  messages.value.push({ role: 'user', text: userText, type: 'chat' })
  message.value = ''
  await scrollToBottom()

  try {
    const parsed = await parseWithAI(userText)

    if (parsed && parsed.amount > 0) {
      conversationHistory.value.push({ role: 'user', parts: [{ text: userText }] })
      messages.value.push({ role: 'ai', type: 'expense', text: 'Oke, aku tangkap pengeluaran ini ya:', data: parsed })
    } else {
      const aiReply = await chatWithAI(userText)
      messages.value.push({ role: 'ai', text: aiReply, type: 'chat' })
    }
  } catch (err) {
    messages.value.push({ role: 'ai', text: 'Terjadi kesalahan.', type: 'chat' })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const saveData = async (data, msgIndex) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const emotionCategory = await classifyEmotion(data.emotion)

    const { error } = await supabase.from('transactions').insert([{
      user_id: user.id,
      amount: data.amount,
      category: data.category,
      emotion: data.emotion,
      emotion_category: emotionCategory, 
      type: 'expense',
      merchant: data.merchant || 'Unknown'
    }])
    if (error) throw error

    messages.value[msgIndex] = {
      role: 'ai',
      text: `Pengeluaran Rp${data.amount.toLocaleString()} berhasil dicatat!`,
      type: 'chat'
    }
  } catch (err) {
    messages.value.push({ role: 'ai', text: 'Gagal menyimpan.', type: 'chat' })
  }
}

const cancelSave = (msgIndex) => {
  messages.value[msgIndex] = {
    role: 'ai',
    text: 'Oke, pengeluaran dibatalkan.',
    type: 'chat'
  }
}

const resetChat = () => {
  messages.value = []
  conversationHistory.value = []
}
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class="header-ellipse">
        <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 600 578">
          <ellipse cx="300" cy="289" fill="url(#paint0_linear_chat)" rx="300" ry="289" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_chat" x1="300" x2="300" y1="0" y2="578">
              <stop offset="0.23" stop-color="#2678FF" />
              <stop offset="1" stop-color="#00B0DA" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div class="header-content">
        <h1 class="header-title">Hi, can I help you?</h1>
        <button class="header-dots" @click="resetChat">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <div class="chat-card">
      <div class="chat-messages" ref="chatContainer">
        <div v-if="messages.length === 0" class="msg-row msg-ai">
          <div class="bubble bubble-ai">
            Halo! Kenalin, aku MindSpend, asisten keuangan yang nggak cuma peduli sama saldo rekeningmu, tapi juga ketenangan pikiranmu!
          </div>
        </div>

        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['msg-row', msg.role === 'user' ? 'msg-user' : 'msg-ai']"
        >
          <div class="bubble-wrap">
            <div :class="['bubble', msg.role === 'user' ? 'bubble-user' : 'bubble-ai']">
              {{ msg.text }}
              
              <div v-if="msg.type === 'expense'" class="expense-card">
                <div class="expense-row"><span>Jumlah</span> <strong>Rp{{ msg.data.amount.toLocaleString() }}</strong></div>
                <div class="expense-row"><span>Kategori</span> <strong>{{ msg.data.category }}</strong></div>
                <div class="expense-row" v-if="msg.data.emotion"><span>Emosi</span> <span class="emotion-tag">{{ msg.data.emotion }}</span></div>
              </div>
            </div>

            <div v-if="msg.type === 'expense'" class="action-btns">
              <button class="btn-save" @click="saveData(msg.data, index)">Simpan</button>
              <button class="btn-cancel" @click="cancelSave(index)">Batal</button>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="msg-row msg-ai">
          <div class="bubble bubble-ai typing"><span></span><span></span><span></span></div>
        </div>
      </div>

      <div class="chat-input-area">
        <input v-model="message" @keydown="handleKeydown" placeholder="Reply..." class="text-input" :disabled="isLoading" />
        <button class="mic-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="white"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="12" y1="19" x2="12" y2="22" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Geologica:wght@400;600;700&display=swap');

.page-wrapper {
  font-family: 'Geologica', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  background: #fff;
  overflow: hidden;
}

.page-header {
  position: relative;
  height: 180px;
  flex-shrink: 0;
}

.header-ellipse {
  position: absolute;
  height: 578px;
  left: -85px;
  top: -173px;
  width: 600px;
}

.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 28px 0;
}

.header-title {
  font-size: 26px;
  font-weight: 600;
  color: #fff;
}

.header-dots {
  background: none;
  border: none;
  display: flex;
  gap: 4px;
}

.header-dots span {
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
}

.chat-card {
  flex: 1;
  background: #fff;
  border-radius: 32px 32px 0 0;
  margin-top: -30px;
  display: flex;
  flex-direction: column;
  z-index: 10;
  box-shadow: 0 -5px 20px rgba(0,0,0,0.05);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.msg-row { display: flex; width: 100%; }
.msg-user { justify-content: flex-end; }
.msg-ai { justify-content: flex-start; }

.bubble {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
  background: #E8E8E8; /* Abu-abu sesuai gambar */
  color: #222;
  max-width: 100%;
}

.bubble-ai { border-radius: 18px 18px 18px 4px; }
.bubble-user { border-radius: 18px 18px 4px 18px; }

.expense-card {
  margin-top: 10px;
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  border: 1px solid #ddd;
}

.expense-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}

.action-btns {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.btn-save {
  flex: 1;
  background: #2678FF;
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
}

.btn-cancel {
  flex: 1;
  background: #fff;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
}

.chat-input-area {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px 30px;
  border-top: 1px solid #eee;
}

.text-input {
  flex: 1;
  background: #E8E8E8;
  border: none;
  border-radius: 24px;
  padding: 12px 18px;
  outline: none;
}

.mic-btn {
  width: 44px;
  height: 44px;
  background: #1A1A1A; /* Lingkaran gelap sesuai gambar */
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.typing span {
  width: 6px;
  height: 6px;
  background: #888;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: bounce 1.4s infinite;
}

@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
</style>
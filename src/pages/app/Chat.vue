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

// Conversation history untuk Gemini (role: user/model)
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

const formatConfirmation = (data) => {
  return `Oke, aku tangkap pengeluaran ini ya:`
}

const chatWithAI = async (userText) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
  if (!API_KEY) return 'API key belum diset. Cek file .env kamu ya!'

  conversationHistory.value.push({
    role: 'user',
    parts: [{ text: userText }]
  })

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
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
      const errText = await res.text()
      console.error('Gemini API error:', res.status, errText)
      conversationHistory.value.pop()
      return `Ups, ada error (${res.status}). Coba lagi ya!`
    }

    const data = await res.json()
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Hmm, aku nggak dapat respons. Coba lagi!'

    conversationHistory.value.push({
      role: 'model',
      parts: [{ text: aiText }]
    })

    return aiText
  } catch (err) {
    console.error('Fetch error:', err)
    conversationHistory.value.pop()
    return 'Koneksi bermasalah. Cek internet kamu ya.'
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
      conversationHistory.value.push({
        role: 'model',
        parts: [{ text: `Oke, aku catat pengeluaran: Rp${parsed.amount.toLocaleString()} untuk ${parsed.category}, emosi: ${parsed.emotion || 'tidak diketahui'}.` }]
      })
      messages.value.push({ role: 'ai', type: 'expense', text: formatConfirmation(parsed), data: parsed })
    } else {
      const aiReply = await chatWithAI(userText)
      messages.value.push({ role: 'ai', text: aiReply, type: 'chat' })
    }
  } catch (err) {
    console.error('handleSend error:', err)
    messages.value.push({ role: 'ai', text: 'Terjadi kesalahan. Coba lagi ya!', type: 'chat' })
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
      text: `Pengeluaran Rp${data.amount.toLocaleString()} berhasil dicatat! Terus pantau pengeluaranmu ya 💪`,
      type: 'chat'
    }
    conversationHistory.value.push({
      role: 'model',
      parts: [{ text: `Pengeluaran Rp${data.amount.toLocaleString()} untuk ${data.category} sudah berhasil dicatat.` }]
    })
  } catch (err) {
    console.error(err)
    messages.value.push({ role: 'ai', text: 'Gagal menyimpan. Coba lagi ya!', type: 'chat' })
  }
}

const cancelSave = (msgIndex) => {
  messages.value[msgIndex] = {
    role: 'ai',
    text: 'Oke, pengeluaran dibatalkan. Kalau mau catat lagi, tinggal bilang ya!',
    type: 'chat'
  }
}

const resetChat = () => {
  messages.value = []
  conversationHistory.value = []
}

const handleImageUpload = (event) => {
  event.target.value = ''
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<template>
  <div class="page-wrapper">
    <!-- Blue Gradient Header with Ellipse (matches Home.vue exactly) -->
    <div class="page-header">
      <!-- Ellipse gradient blob — same positioning as Home.vue -->
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
        <button class="header-dots" @click="resetChat" title="Reset chat">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Chat Card -->
    <div class="chat-card">
      <!-- Messages Area -->
      <div class="chat-messages" ref="chatContainer">

        <!-- Empty State -->
        <div v-if="messages.length === 0" class="empty-state">
          <div class="bot-intro-bubble">
            <p>Halo! Kenalin, aku MindSpend, asisten keuangan yang nggak cuma peduli sama saldo rekeningmu, tapi juga ketenangan pikiranmu!</p>
          </div>
          <div class="suggestion-chips">
            <button class="chip" @click="message = 'Makan siang 35rb karena bosen'; handleSend()">Makan 35rb gabut</button>
            <button class="chip" @click="message = 'Gimana cara hemat uang?'; handleSend()">Tips hemat uang</button>
            <button class="chip" @click="message = 'Aku sering beli kopi tiap hari, normal ga?'; handleSend()">Kopi tiap hari</button>
          </div>
        </div>

        <!-- Messages -->
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['msg-row', msg.role === 'user' ? 'msg-user' : 'msg-ai']"
        >
          <div class="bubble-wrap">
            <!-- Chat Bubble -->
            <div :class="['bubble', msg.role === 'user' ? 'bubble-user' : 'bubble-ai']">
              {{ msg.text }}

              <!-- Expense Card -->
              <div v-if="msg.type === 'expense'" class="expense-card">
                <div class="expense-row">
                  <span class="expense-label">Jumlah</span>
                  <span class="expense-value">Rp{{ msg.data.amount.toLocaleString() }}</span>
                </div>
                <div class="expense-row">
                  <span class="expense-label">Kategori</span>
                  <span class="expense-value">{{ msg.data.category }}</span>
                </div>
                <div class="expense-row" v-if="msg.data.merchant && msg.data.merchant !== 'Unknown'">
                  <span class="expense-label">Merchant</span>
                  <span class="expense-value">{{ msg.data.merchant }}</span>
                </div>
                <div class="expense-row" v-if="msg.data.emotion">
                  <span class="expense-label">Emosi</span>
                  <span class="expense-value emotion-tag">{{ msg.data.emotion }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons for expense -->
            <div v-if="msg.type === 'expense'" class="action-btns">
              <button class="btn-save" @click="saveData(msg.data, index)">Simpan</button>
              <button class="btn-cancel" @click="cancelSave(index)">Batal</button>
            </div>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="msg-row msg-ai">
          <div class="bubble bubble-ai typing">
            <span></span><span></span><span></span>
          </div>
        </div>

      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <input
          type="file"
          ref="fileInput"
          @change="handleImageUpload"
          accept="image/*"
          style="display: none"
        />
        <input
          v-model="message"
          @keydown="handleKeydown"
          placeholder="Reply..."
          class="text-input"
          :disabled="isLoading"
        />
        <button class="mic-btn" title="Voice input">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="#888"/>
            <path d="M5 10a7 7 0 0 0 14 0" stroke="#888" stroke-width="2" stroke-linecap="round"/>
            <line x1="12" y1="19" x2="12" y2="22" stroke="#888" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>


  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Geologica:wght@400;600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-wrapper {
  font-family: 'Geologica', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  background: #fff;
  position: relative;
  overflow: hidden;
}

/* ── HEADER ── */
.page-header {
  position: relative;
  height: 200px;
  flex-shrink: 0;
  overflow: hidden;
  background: transparent;
}

/* Ellipse — same offsets as Home.vue: left:-85px top:-173px w:600px h:578px */
.header-ellipse {
  position: absolute;
  height: 578px;
  left: -85px;
  top: -173px;
  width: 600px;
  pointer-events: none;
}

.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 72px 28px 0;
}

.header-title {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
}

.header-dots {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 4px;
}

.header-dots span {
  display: block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
}

/* ── CHAT CARD ── */
.chat-card {
  flex: 1;
  background: #fff;
  border-radius: 28px 28px 0 0;
  margin-top: -28px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
}

/* ── MESSAGES ── */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
}

.chat-messages::-webkit-scrollbar {
  width: 0;
}

/* Empty state intro bubble */
.empty-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bot-intro-bubble {
  background: #e8e8e8;
  border-radius: 18px 18px 18px 4px;
  padding: 14px 16px;
  font-size: 14px;
  color: #222;
  line-height: 1.55;
  max-width: 88%;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-left: 4px;
}

.chip {
  background: #f0f5ff;
  border: 1px solid #c5d8ff;
  border-radius: 20px;
  padding: 7px 14px;
  font-size: 12px;
  font-family: 'Geologica', sans-serif;
  color: #2678FF;
  cursor: pointer;
  transition: all 0.15s;
}

.chip:hover {
  background: #2678FF;
  color: #fff;
  border-color: #2678FF;
}

/* Message rows */
.msg-row {
  display: flex;
}

.msg-user {
  justify-content: flex-end;
}

.msg-ai {
  justify-content: flex-start;
}

.bubble-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 82%;
}

/* Bubbles */
.bubble {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.55;
  white-space: pre-wrap;
}

.bubble-user {
  background: #e8e8e8;
  color: #111;
  border-radius: 18px 18px 4px 18px;
  align-self: flex-end;
}

.bubble-ai {
  background: #e8e8e8;
  color: #111;
  border-radius: 18px 18px 18px 4px;
}

/* Expense card */
.expense-card {
  margin-top: 10px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.expense-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.expense-label {
  font-size: 12px;
  color: #999;
}

.expense-value {
  font-size: 12px;
  font-weight: 700;
  color: #111;
}

.emotion-tag {
  color: #e67e22;
  background: #fff4e0;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

/* Action buttons */
.action-btns {
  display: flex;
  gap: 6px;
}

.btn-save {
  flex: 1;
  background: linear-gradient(135deg, #2678FF, #00B0DA);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 9px;
  font-size: 13px;
  font-family: 'Geologica', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-save:hover { opacity: 0.88; }

.btn-cancel {
  flex: 1;
  background: #fff;
  color: #888;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 9px;
  font-size: 13px;
  font-family: 'Geologica', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-cancel:hover { background: #f5f5f5; }

/* Typing indicator */
.typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 14px 18px;
}

.typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #aaa;
  animation: bounce 1.2s infinite;
}

.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* ── INPUT AREA ── */
.chat-input-area {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 14px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
}

.text-input {
  flex: 1;
  background: #f0f0f0;
  border: none;
  border-radius: 24px;
  padding: 11px 18px;
  font-size: 14px;
  font-family: 'Geologica', sans-serif;
  color: #111;
  outline: none;
}

.text-input::placeholder {
  color: #aaa;
}

.text-input:disabled {
  opacity: 0.6;
}

.mic-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}

.mic-btn:hover { background: #e0e0e0; }


</style>
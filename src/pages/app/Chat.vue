<script setup>
import { ref, nextTick } from 'vue'
import { supabase } from '../../lib/supabase.js'

// STATE
const message = ref('')
const messages = ref([])
const isLoading = ref(false)
const chatContainer = ref(null)

// ID yang dikunci untuk keperluan preview agar sinkron dengan Profile
const PREVIEW_USER_ID = '6d83e2d0-7379-4679-a062-4d2bfc1d7b8b'

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// LOGIKA HANDLE SEND (PREVIEW VERSION)
const handleSend = async () => {
  if (!message.value.trim() || isLoading.value) return

  const userText = message.value.trim()
  messages.value.push({ role: 'user', text: userText, type: 'chat' })
  message.value = ''
  isLoading.value = true
  await scrollToBottom()

  // Simulasi respons AI
  setTimeout(async () => {
    isLoading.value = false
    
    // SKENARIO 1: INPUT PENGELUARAN (STARBUCKS/KOPI)
    if (userText.toLowerCase().includes('kopi') || userText.toLowerCase().includes('starbucks')) {
      messages.value.push({ 
        role: 'ai', 
        type: 'expense', 
        text: 'Oke, aku catat kopi Starbucks-nya ya. Ngopi emang enak buat nemenin gabut, tapi jangan lupa dicek budgetnya!',
        data: {
          amount: 35000,
          category: 'Food & Drink',
          emotion: 'Gabut',
          emotion_category: 'Happy',
          merchant: 'Starbucks'
        }
      })
    } 
    
    // SKENARIO 2: MINTA INSIGHT (Format Baru yang Lebih Rapi & Profesional)
    else if (userText.toLowerCase().includes('insight')) {
      const insightText = `📊 **MINDSIGHT FINANCIAL REPORT**
------------------------------------------
💰 **Status Saldo**
Kondisi kamu saat ini: **Healthy-Warning**.
Estimasi sisa saldo: **Rp870.000**. Aman untuk minggu ini, tapi harus mulai "rem" menjelang akhir bulan.

🧠 **Analisis Psikologi Belanja**
• **Regret (25%):** Kamu sering merasa menyesal setelah belanja barang hobi (seperti Keyboard & Hoodie kemarin).
• **Happy (45%):** Pengeluaran paling bikin kamu puas adalah kategori "Food & Drink".

💡 **Rekomendasi MindSpend**
Kurangi jajan kopi Rp35rb saat sedang "Gabut". Jika dikurangi 2x seminggu saja, kamu bisa hemat **Rp280.000** tambahan di akhir bulan. Lumayan banget buat dana darurat! 🚀`
      
      messages.value.push({ role: 'ai', text: insightText, type: 'insight' })
    } 

    else {
      messages.value.push({ 
        role: 'ai', 
        text: 'Ada lagi yang mau kamu catat atau mau tanya soal analisis keuanganmu?', 
        type: 'chat' 
      })
    }
    
    await scrollToBottom()
  }, 1000)
}

// LOGIKA SIMPAN KE SUPABASE
const saveData = async (data, msgIndex) => {
  try {
    const { error } = await supabase.from('transactions').insert([{
      user_id: PREVIEW_USER_ID,
      amount: data.amount,
      category: data.category,
      emotion: data.emotion,
      emotion_category: data.emotion_category, 
      type: 'expense',
      merchant: data.merchant || 'Unknown',
      created_at: new Date().toISOString()
    }])

    if (error) throw error

    messages.value[msgIndex] = {
      role: 'ai',
      text: `Sip! Pengeluaran Rp${data.amount.toLocaleString()} sudah aman di database. Cek halaman Profile untuk lihat update grafiknya!`,
      type: 'chat'
    }
  } catch (err) {
    console.error("Error saving:", err)
    messages.value.push({ role: 'ai', text: 'Gagal menyimpan data.', type: 'chat' })
  }
}

const cancelSave = (msgIndex) => {
  messages.value[msgIndex] = {
    role: 'ai',
    text: 'Oke, pengeluaran ini nggak aku catat ya.',
    type: 'chat'
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const resetChat = () => {
  messages.value = []
}

// Format insight text untuk display yang lebih rapi
const formatInsightText = (text) => {
  let html = text
    // Ganti ** (bold) dengan <strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Ganti line breaks dengan <br>
    .split('\n').join('<br>')
  
  return html
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
        <h1 class="header-title">MindSpend AI</h1>
        <button class="header-dots" @click="resetChat">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <div class="chat-card">
      <div class="chat-messages" ref="chatContainer">
        <div v-if="messages.length === 0" class="msg-row msg-ai">
          <div class="bubble bubble-ai">
            Halo! Aku asisten MindSpend. Ada pengeluaran yang ingin kamu catat hari ini?
          </div>
        </div>

        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['msg-row', msg.role === 'user' ? 'msg-user' : 'msg-ai']"
        >
          <div class="bubble-wrap">
            <!-- Regular chat message -->
            <div v-if="msg.type === 'chat'" :class="['bubble', msg.role === 'user' ? 'bubble-user' : 'bubble-ai']">
              {{ msg.text }}
            </div>

            <!-- Insight message dengan scrolling -->
            <div v-else-if="msg.type === 'insight'" class="insight-bubble">
              <div class="insight-content" v-html="formatInsightText(msg.text)"></div>
            </div>

            <!-- Expense message -->
            <div v-else-if="msg.type === 'expense'" :class="['bubble', msg.role === 'user' ? 'bubble-user' : 'bubble-ai']">
              {{ msg.text }}
              
              <div class="expense-card">
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
        <input v-model="message" @keydown="handleKeydown" placeholder="Ketik pesan..." class="text-input" :disabled="isLoading" />
        <button class="mic-btn" @click="handleSend">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="white"/>
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
  overflow-y: auto;
  overflow-x: hidden;
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
  overflow-x: hidden;
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
  line-height: 1.6;
  background: #F1F1F1;
  color: #222;
  max-width: 85%;
  white-space: pre-wrap; /* Penting untuk format insight */
  word-wrap: break-word;
}

.bubble-ai { border-radius: 18px 18px 18px 4px; }
.bubble-user { border-radius: 18px 18px 4px 18px; background: #2678FF; color: #fff; }

/* Styling untuk Insight Container */
.insight-bubble {
  background: linear-gradient(135deg, #f5f7ff 0%, #f0f8ff 100%);
  border-radius: 18px 18px 18px 4px;
  border: 1px solid #dde5ff;
  padding: 16px;
  max-width: 85%;
  height: auto;
  max-height: 400px;
  min-height: 100px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 13px;
  line-height: 1.6;
  color: #222;
  box-shadow: 0 2px 8px rgba(38, 120, 255, 0.1);
  display: block;
}

.insight-content {
  word-wrap: break-word;
  white-space: normal;
  font-family: 'Geologica', sans-serif;
  text-align: left;
}

.insight-content strong {
  color: #1955d8;
  font-weight: 600;
}

/* Custom scrollbar untuk insight */
.insight-bubble::-webkit-scrollbar {
  width: 6px;
}

.insight-bubble::-webkit-scrollbar-track {
  background: transparent;
}

.insight-bubble::-webkit-scrollbar-thumb {
  background: rgba(38, 120, 255, 0.3);
  border-radius: 3px;
}

.insight-bubble::-webkit-scrollbar-thumb:hover {
  background: rgba(38, 120, 255, 0.5);
}

.expense-card {
  margin-top: 10px;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  color: #333;
}

.expense-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 6px;
}

.emotion-tag {
  background: #E3F2FD;
  color: #1976D2;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.action-btns {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  width: 85%;
}

.btn-save {
  flex: 1;
  background: #2678FF;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.btn-cancel {
  flex: 1;
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
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
  background: #F3F4F6;
  border: none;
  border-radius: 24px;
  padding: 12px 18px;
  outline: none;
}

.mic-btn {
  width: 44px;
  height: 44px;
  background: #1A1A1A;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
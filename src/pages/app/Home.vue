<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

const transactions = ref([])
const totalIncome = ref(0)
const totalExpense = ref(0)
const balance = ref(0)
const userName = ref('User')

// SVG Paths
const svgPaths = {
  p1093a180: "M10.157 12.711L4.5 18.368L3.086 16.954L8.036 12.004L3.086 7.054L4.5 5.64L10.157 11.297C10.3445 11.4845 10.4498 11.7388 10.4498 12.004C10.4498 12.2692 10.3445 12.5235 10.157 12.711Z",
  p29441300: "M6.375 20.1875C5.52962 20.1875 4.71887 19.8517 4.1211 19.2539C3.52333 18.6561 3.1875 17.8454 3.1875 17C3.1875 16.1546 3.52333 15.3439 4.1211 14.7461C4.71887 14.1483 5.52962 13.8125 6.375 13.8125C7.22038 13.8125 8.03113 14.1483 8.6289 14.7461C9.22668 15.3439 9.5625 16.1546 9.5625 17C9.5625 17.8454 9.22668 18.6561 8.6289 19.2539C8.03113 19.8517 7.22038 20.1875 6.375 20.1875ZM17 20.1875C16.1546 20.1875 15.3439 19.8517 14.7461 19.2539C14.1483 18.6561 13.8125 17.8454 13.8125 17C13.8125 16.1546 14.1483 15.3439 14.7461 14.7461C15.3439 14.1483 16.1546 13.8125 17 13.8125C17.8454 13.8125 18.6561 14.1483 19.2539 14.7461C19.8517 15.3439 20.1875 16.1546 20.1875 17C20.1875 17.8454 19.8517 18.6561 19.2539 19.2539C18.6561 19.8517 17.8454 20.1875 17 20.1875ZM27.625 20.1875C26.7796 20.1875 25.9689 19.8517 25.3711 19.2539C24.7733 18.6561 24.4375 17.8454 24.4375 17C24.4375 16.1546 24.7733 15.3439 25.3711 14.7461C25.9689 14.1483 26.7796 13.8125 27.625 13.8125C28.4704 13.8125 29.2811 14.1483 29.8789 14.7461C30.4767 15.3439 30.8125 16.1546 30.8125 17C30.8125 17.8454 30.4767 18.6561 29.8789 19.2539C29.2811 19.8517 28.4704 20.1875 27.625 20.1875Z"
};

const emotionEmoji = (emotion) => {
  const map = {
    Happy: '😄',
    Regret: '😞',
    Calm: '😌',
    Anxiety: '😰',
    Sad: '😢',
    Angry: '😡'
  }
  return map[emotion] || '😐'
}

const fetchTransactions = async () => {
  const { data: { user } } = await supabase.auth.getUser()

  if (user?.user_metadata?.full_name) {
    userName.value = user.user_metadata.full_name.split(' ')[0]
  }

  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  transactions.value = data || []
  calculateSummary()
}

const calculateSummary = () => {
  let income = 0
  let expense = 0
  transactions.value.forEach(t => {
    if (t.type === 'income') income += t.amount
    else if (t.type === 'expense') expense += t.amount
  })
  totalIncome.value = income
  totalExpense.value = expense
  balance.value = income - expense
}

const formatRupiah = (val) => {
  return 'Rp' + val.toLocaleString('id-ID').replace(/,/g, '.')
}

const isIncome = (t) => {
  if (t.type) return t.type === 'income'
  return ['Savings', 'Investment'].includes(t.category)
}

onMounted(fetchTransactions)
</script>

<template>
  <div class="bg-white relative w-full h-screen overflow-y-auto overflow-x-hidden font-geologica" data-name="Homepage">
    
    <div class="absolute h-[578px] left-[-85px] top-[-173px] w-[600px] -z-0">
      <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 600 578">
        <ellipse cx="300" cy="289" fill="url(#paint0_linear_1_119)" id="Ellipse 1" rx="300" ry="289" />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_119" x1="300" x2="300" y1="0" y2="578">
            <stop offset="0.23" stop-color="#2678FF" />
            <stop offset="1" stop-color="#00B0DA" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div class="absolute left-[30px] top-[74px] text-white">
      <p class="text-[16px] opacity-90">Good afternoon,</p>
      <p class="text-[33px] font-bold leading-tight">Tristan</p>
    </div>

    <div class="absolute top-[179px] left-[27px] right-[27px] h-[226px] bg-gradient-to-t from-[#2678ff] to-[#00b0da] rounded-[30px] shadow-lg p-6 text-white overflow-hidden">
      
      <div class="flex justify-between items-start">
        <div class="rotate-[-90deg] w-6 h-6">
           <svg fill="none" viewBox="0 0 12 24" class="w-full h-full">
              <path clip-rule="evenodd" :d="svgPaths.p1093a180" fill="white" fill-rule="evenodd" />
           </svg>
        </div>
        <div class="w-8 h-8">
           <svg fill="none" viewBox="0 0 34 34" class="w-full h-full opacity-80">
              <path :d="svgPaths.p29441300" fill="white" />
           </svg>
        </div>
      </div>

      <div class="mt-4">
        <p class="text-[32px] font-bold leading-none">{{ formatRupiah(balance) }}</p>
      </div>

      <div class="flex justify-between mt-10 px-2">
        <div class="text-left">
          <p class="text-[14px] opacity-80 mb-1">Income</p>
          <p class="text-[18px] font-bold">{{ formatRupiah(totalIncome) }}</p>
        </div>
        <div class="text-right">
          <p class="text-[14px] opacity-80 mb-1">Expenses</p>
          <p class="text-[18px] font-bold">{{ formatRupiah(totalExpense) }}</p>
        </div>
      </div>
    </div>

    <div class="absolute top-[450px] left-[27px] right-[27px] flex justify-between items-center px-2">
      <p class="font-bold text-[20px] text-black">Transactions History</p>
      <p class="font-bold text-[#8c8a8a] text-[15px] cursor-pointer">See all</p>
    </div>

    <div class="absolute left-[27px] top-[500px] right-[27px] flex flex-col gap-[12px] pb-10">
      <template v-if="transactions.length === 0">
        <p class="text-[#8c8a8a] text-center mt-10">No transactions yet</p>
      </template>
      
      <template v-for="transaction in transactions.slice(0, 5)" :key="transaction.id">
        <div class="bg-[#f1f1f1] h-[72px] rounded-[22px] flex items-center px-4 w-full">
          
          <div class="w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-sm">
            <span class="text-[24px]">{{ emotionEmoji(transaction.emotion_category) }}</span>
          </div>

          <div class="flex-grow flex flex-col justify-center min-w-0">
            <p class="font-bold text-black text-[14px] truncate leading-none mb-1">
              {{ transaction.category }}
            </p>
            <p class="text-[#8c8a8a] text-[12px] leading-none">
              {{ new Date(transaction.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
            </p>
          </div>

          <div class="flex-shrink-0 ml-2">
            <p :class="[isIncome(transaction) ? 'text-[#2c7d52]' : 'text-[#cb4f60]', 'font-bold text-[15px]']">
              {{ isIncome(transaction) ? '+' : '-' }}{{ formatRupiah(transaction.amount).replace('Rp', '') }}
            </p>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>

<style scoped>
/* Tambahkan import font Geologica di App.vue atau main.css jika belum ada */
.font-geologica {
  font-family: 'Geologica', sans-serif;
  font-variation-settings: 'CRSV' 0, 'SHRP' 0;
}
</style>
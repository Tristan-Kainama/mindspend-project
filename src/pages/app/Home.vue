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
    if (t.type === 'income') {
      income += t.amount
    } else if (t.type === 'expense') {
      expense += t.amount
    }
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
  
  // fallback untuk data lama
  return ['Savings', 'Investment'].includes(t.category)
}

onMounted(fetchTransactions)
</script>

<template>
  <div class="bg-white relative w-full h-screen" data-name="Homepage">
    <!-- Background Gradient Ellipse -->
    <div class="absolute h-[578px] left-[-85px] top-[-173px] w-[600px]">
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

    <!-- Header Text -->
    <p class="absolute font-geologica font-normal leading-[normal] left-[130px] not-italic text-[16px] text-white top-[74px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Good afternoon,
    </p>
    <p class="absolute font-geologica font-normal leading-[normal] left-[130px] not-italic text-[33.333px] text-white top-[101px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      {{ userName }}
    </p>

    <!-- Balance Card -->
    <div class="absolute bg-gradient-to-t from-[#2678ff] h-[226px] left-[27px] rounded-[30px] to-[#00b0da] top-[179px] w-[376px]" />

    <!-- Three Dots Menu -->
    <div class="absolute left-[337px] size-[34px] top-[211px]" data-name="bi:three-dots">
      <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
        <g id="bi:three-dots">
          <path :d="svgPaths.p29441300" fill="white" id="Vector" />
        </g>
      </svg>
    </div>

    <!-- Arrow Icon -->
    <div class="absolute flex h-[12.208px] items-center justify-center left-[152px] top-[221px] w-[24.104px]">
      <div class="flex-none rotate-[-90.5deg]">
        <div class="h-[24px] relative w-[12px]" data-name="weui:arrow-filled">
          <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 24">
            <g id="weui:arrow-filled">
              <path clip-rule="evenodd" :d="svgPaths.p1093a180" fill="white" fill-rule="evenodd" id="Vector" />
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- Balance Amount -->
    <p class="absolute font-geologica font-bold leading-[normal] left-[57px] not-italic text-[32px] text-white top-[236px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      {{ formatRupiah(balance) }}
    </p>

    <!-- Income Section -->
    <p class="absolute font-geologica font-normal leading-[normal] left-[64px] not-italic text-[15px] text-white top-[336px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Income
    </p>
    <p class="absolute font-geologica font-bold leading-[normal] left-[50px] not-italic text-[20px] text-white top-[355px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      {{ formatRupiah(totalIncome) }}
    </p>

    <!-- Expenses Section -->
    <p class="absolute font-geologica font-normal leading-[normal] left-[284px] not-italic text-[15px] text-white top-[339px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Expenses
    </p>
    <p class="absolute font-geologica font-bold leading-[normal] left-[270px] not-italic text-[20px] text-white top-[358px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      {{ formatRupiah(totalExpense) }}
    </p>

    <!-- Transactions History Header -->
    <p class="absolute font-geologica font-bold leading-[normal] left-[33px] not-italic text-[20px] text-black top-[454px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Transactions History
    </p>
    <p class="absolute font-geologica font-bold leading-[normal] left-[340px] not-italic text-[#8c8a8a] text-[15px] top-[457px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      See all
    </p>

    <!-- Transactions List - Dynamic from Supabase -->
    <template v-if="transactions.length === 0">
      <p class="absolute left-[33px] top-[510px] text-[#8c8a8a]">No transactions yet</p>
    </template>
    
    <template v-for="(transaction, index) in transactions.slice(0, 5)" :key="transaction.id">
      <!-- Transaction Background -->
      <div :style="{ top: (508 + index * 77) + 'px' }" class="absolute bg-[#f1f1f1] h-[67px] left-[27px] rounded-[20px] w-[376px]" />
      
      <!-- Transaction Emoji -->
      <div 
        :style="{ top: (508 + index * 77) + 'px' }"
        class="absolute left-[27px] w-[376px] h-[67px] flex items-center"
      >
        <div class="w-[50px] flex justify-center">
          <span class="text-[26px]">
            {{ emotionEmoji(transaction.emotion_category) }}
          </span>
        </div>
      </div>
      
      <!-- Transaction Date -->
      <p :style="{ top: (529 + index * 77) + 'px' }" class="absolute font-geologica font-normal leading-[normal] left-[94px] not-italic text-[#8c8a8a] text-[13px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
        {{ new Date(transaction.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) }}
      </p>
      
      <!-- Transaction Category -->
      <p :style="{ top: (549 + index * 77) + 'px' }" class="absolute font-geologica font-normal leading-[normal] left-[94px] not-italic text-[#8c8a8a] text-[9.792px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
        {{ transaction.category }}
      </p>
      
      <!-- Transaction Amount -->
      <p :style="{ top: (517 + index * 77) + 'px' }" :class="[isIncome(transaction) ? 'text-[#2c7d52]' : 'text-[#cb4f60]', 'absolute font-geologica font-bold leading-[normal] left-[293px] not-italic text-[16px] whitespace-nowrap']" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
        {{ isIncome(transaction) ? '+' : '-' }}{{ formatRupiah(transaction.amount) }}
      </p>
    </template>
  </div>
</template>

<style scoped>
</style>
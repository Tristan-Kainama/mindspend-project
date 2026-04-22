<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
)

// STATE
const transactions = ref([])
const income = ref(0)
const expense = ref(0)
const total = ref(0)
const healthScore = ref(0)
const insight = ref('')

// SVG PATHS
const svgPaths = {
  p1093a180: "M10.157 12.711L4.5 18.368L3.086 16.954L8.036 12.004L3.086 7.054L4.5 5.64L10.157 11.297C10.3445 11.4845 10.4498 11.7388 10.4498 12.004C10.4498 12.2692 10.3445 12.5235 10.157 12.711Z",
  p29441300: "M6.375 20.1875C5.52962 20.1875 4.71887 19.8517 4.1211 19.2539C3.52333 18.6561 3.1875 17.8454 3.1875 17C3.1875 16.1546 3.52333 15.3439 4.1211 14.7461C4.71887 14.1483 5.52962 13.8125 6.375 13.8125C7.22038 13.8125 8.03113 14.1483 8.6289 14.7461C9.22668 15.3439 9.5625 16.1546 9.5625 17C9.5625 17.8454 9.22668 18.6561 8.6289 19.2539C8.03113 19.8517 7.22038 20.1875 6.375 20.1875ZM17 20.1875C16.1546 20.1875 15.3439 19.8517 14.7461 19.2539C14.1483 18.6561 13.8125 17.8454 13.8125 17C13.8125 16.1546 14.1483 15.3439 14.7461 14.7461C15.3439 14.1483 16.1546 13.8125 17 13.8125C17.8454 13.8125 18.6561 14.1483 19.2539 14.7461C19.8517 15.3439 20.1875 16.1546 20.1875 17C20.1875 17.8454 19.8517 18.6561 19.2539 19.2539C18.6561 19.8517 17.8454 20.1875 17 20.1875ZM27.625 20.1875C26.7796 20.1875 25.9689 19.8517 25.3711 19.2539C24.7733 18.6561 24.4375 17.8454 24.4375 17C24.4375 16.1546 24.7733 15.3439 25.3711 14.7461C25.9689 14.1483 26.7796 13.8125 27.625 13.8125C28.4704 13.8125 29.2811 14.1483 29.8789 14.7461C30.4767 15.3439 30.8125 16.1546 30.8125 17C30.8125 17.8454 30.4767 18.6561 29.8789 19.2539C29.2811 19.8517 28.4704 20.1875 27.625 20.1875Z",
  pddb480: "M152.818 76.4177C152.818 119.017 119.017 152.818 76.4179 152.818C68.1516 152.818 60.0945 151.562 52.5066 149.16"
}

// CHART DATA
const barData = ref({
  labels: [],
  datasets: []
})

const doughnutData = ref({
  labels: ['Score', 'Remaining'],
  datasets: []
})

// FETCH DATA
const fetchData = async () => {
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)

  transactions.value = data || []

  calculateSummary()
  buildChart()
  calculateHealthScore()
  generateInsight()
}

// SUMMARY
const calculateSummary = () => {
  let inc = 0
  let exp = 0

  transactions.value.forEach(t => {
    if (t.category === 'Savings' || t.category === 'Investment') {
      inc += t.amount
    } else {
      exp += t.amount
    }
  })

  income.value = inc
  expense.value = exp
  total.value = inc - exp
}

// BUILD CHART FROM DB
const buildChart = () => {
  const monthly = {}

  transactions.value.forEach(t => {
    const month = new Date(t.created_at).toLocaleString('id-ID', { month: 'short' })

    if (!monthly[month]) {
      monthly[month] = { income: 0, expense: 0 }
    }

    if (t.category === 'Savings' || t.category === 'Investment') {
      monthly[month].income += t.amount
    } else {
      monthly[month].expense += t.amount
    }
  })

  const labels = Object.keys(monthly)

  barData.value = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: labels.map(m => monthly[m].income),
        backgroundColor: '#3B82F6'
      },
      {
        label: 'Expense',
        data: labels.map(m => monthly[m].expense),
        backgroundColor: '#EF4444'
      }
    ]
  }
}

// HEALTH SCORE FORMULA
const calculateHealthScore = () => {
  const totalTx = transactions.value.length || 1

  const expenseRatio = expense.value / (income.value || 1)
  const emotionalCount = transactions.value.filter(t => t.emotion).length

  const emotionalRatio = emotionalCount / totalTx

  let score = 100
  score -= expenseRatio * 40
  score -= emotionalRatio * 30

  // clamp
  score = Math.max(0, Math.min(100, Math.round(score)))

  healthScore.value = score

  doughnutData.value = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: ['#00B0DA', '#E5E7EB'],
        borderWidth: 0
      }
    ]
  }
}

const formatRupiah = (val) => {
  return 'Rp' + val.toLocaleString('id-ID').replace(/,/g, '.')
}

const generateInsight = () => {
  const ratio = income.value > 0 ? (expense.value / income.value * 100).toFixed(1) : 0
  if (ratio < 50) {
    insight.value = 'Excellent!'
  } else if (ratio < 75) {
    insight.value = 'Good!'
  } else {
    insight.value = 'Be Careful!'
  }
}

// OPTIONS
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    tooltip: {
      callbacks: {
        label: function(context) {
          return context.dataset.label + ': ' + formatRupiah(context.parsed.y)
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return formatRupiah(value)
        }
      }
    }
  }
}

const doughnutOptions = {
  cutout: '75%',
  responsive: true,
  maintainAspectRatio: true,
  plugins: { legend: { display: false } }
}

onMounted(fetchData)
</script>

<template>
  <div class="bg-white relative w-full h-screen" data-name="Report">
    <!-- Background Gradient Ellipse -->
    <div class="absolute h-[578px] left-[-86px] top-[-281px] w-[600px]">
      <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 600 578">
        <ellipse cx="300" cy="289" fill="url(#paint0_linear_1_290)" id="Ellipse 1" rx="300" ry="289" />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_290" x1="300" x2="300" y1="0" y2="578">
            <stop offset="0.23" stop-color="#2678FF" />
            <stop offset="1" stop-color="#00B0DA" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Header -->
    <p class="absolute font-geologica font-normal leading-[normal] left-[calc(50%-86px)] not-italic text-[24px] text-white top-[55px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Monthly Report
    </p>

    <!-- Three Dots Menu (Top) -->
    <div class="absolute left-[338px] size-[34px] top-[98px]" data-name="bi:three-dots">
      <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
        <g id="bi:three-dots">
          <path :d="svgPaths.p29441300" fill="white" id="Vector" />
        </g>
      </svg>
    </div>

    <!-- Card 1: This Month Summary -->
    <div class="absolute bg-white border border-solid border-white h-[166px] left-[44px] rounded-[25px] top-[131px] w-[343px]" />
    <p class="absolute font-geologica font-normal leading-[normal] left-[158px] not-italic text-[#646060] text-[15px] top-[156px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      THIS MONTH
    </p>

    <!-- Arrow Icon (Top) -->
    <div class="absolute flex h-[12.208px] items-center justify-center left-[152px] top-[177px] w-[24.104px]">
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

    <!-- Income Box -->
    <div class="absolute bg-[#f0fdf4] border-[0.796px] border-black border-solid h-[70.07px] left-[67px] rounded-[7.962px] top-[182px] w-[86.791px]" />
    <p class="absolute font-geologica font-normal leading-[normal] left-[88.5px] not-italic text-[#6d3a7c] text-[11.944px] top-[194.74px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Income
    </p>
    <p class="absolute font-geologica font-normal leading-[normal] left-[88.5px] not-italic text-[#6d3a7c] text-[11.944px] top-[220px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      {{ formatRupiah(income) }}
    </p>

    <!-- Expense Box -->
    <div class="absolute bg-[#fef2f2] border-[0.796px] border-black border-solid h-[70.07px] left-[172.1px] rounded-[7.962px] top-[182px] w-[86.791px]" />
    <p class="absolute font-geologica font-normal leading-[normal] left-[191.21px] not-italic text-[#6d3a7c] text-[11.944px] top-[194.74px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Expense
    </p>
    <p class="absolute font-geologica font-normal leading-[normal] left-[191.21px] not-italic text-[#6d3a7c] text-[11.944px] top-[220px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      {{ formatRupiah(expense) }}
    </p>

    <!-- Total Box -->
    <div class="absolute bg-[#eff6ff] border-[0.796px] border-black border-solid h-[70.07px] left-[277.21px] rounded-[7.962px] top-[182px] w-[86.791px]" />
    <p class="absolute font-geologica font-normal leading-[normal] left-[303.71px] not-italic text-[#6d3a7c] text-[11.944px] top-[194.74px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Total
    </p>
    <p class="absolute font-geologica font-normal leading-[normal] left-[290px] not-italic text-[#6d3a7c] text-[11.944px] top-[220px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      {{ formatRupiah(total) }}
    </p>

    <!-- Card 2: Chart Section -->
    <div class="absolute bg-white border border-[#646060] border-solid h-[279px] left-[43px] rounded-[25px] top-[317px] w-[343px]" />
    <p class="absolute font-geologica font-normal leading-[normal] left-[158px] not-italic text-[#646060] text-[15px] top-[333px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      THIS MONTH
    </p>

    <!-- Three Dots Menu (Middle) -->
    <div class="absolute left-[337px] size-[34px] top-[152px]" data-name="bi:three-dots">
      <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
        <g id="bi:three-dots">
          <path :d="svgPaths.p29441300" fill="white" id="Vector" />
        </g>
      </svg>
    </div>

    <!-- Arrow Icon (Middle) -->
    <div class="absolute flex h-[12.208px] items-center justify-center left-[151px] top-[362px] w-[24.104px]">
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

    <p class="absolute font-geologica font-bold leading-[normal] left-[53px] not-italic text-[32px] text-white top-[377px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      {{ formatRupiah(total) }}
    </p>

    <!-- Bar Chart - vue-chartjs -->
    <div class="absolute bg-white left-[43px] top-[350px] w-[343px] h-[220px] rounded-[15px] p-4">
      <Bar :data="barData" :options="barOptions" />
    </div>

    <!-- Card 3: Financial Health Score -->
    <div class="absolute bg-white border border-[#646060] border-solid h-[221px] left-[43px] rounded-[25px] top-[622px] w-[343px]" />
    <p class="absolute font-geologica font-normal leading-[normal] left-[119px] not-italic text-[#646060] text-[15px] top-[636px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      FINANCIAL HEALTH SCORE
    </p>

    <!-- Doughnut Chart - vue-chartjs -->
    <div class="absolute flex flex-col items-center left-[43px] top-[622px] w-[343px] h-[221px] justify-center">
      <div class="w-[150px] h-[150px]">
        <Doughnut :data="doughnutData" :options="doughnutOptions" />
      </div>
      <p class="absolute font-geologica font-bold leading-[normal] left-[202px] text-[#646060] text-[15px] top-[729px] whitespace-nowrap">{{ healthScore }}</p>
      <p class="absolute font-geologica font-bold leading-[normal] left-[189px] text-[#646060] text-[10.263px] top-[749px] whitespace-nowrap">{{ insight }}</p>
    </div>
  </div>
</template>

<style scoped>
</style>
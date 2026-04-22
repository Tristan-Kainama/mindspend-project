<script setup>
import { ref } from 'vue'
import { supabase } from '../../lib/supabase'

const step = ref(1) // 1 = pilih type, 2 = form
const type = ref('income')

// form data
const form = ref({
  name: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  emotion: ''
})

// dropdown options
const incomeOptions = ['Salary', 'Freelance', 'Bonus', 'Gift', 'Investment', 'Other']
const expenseOptions = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other']

// pilih type
const selectType = (selected) => {
  type.value = selected
  form.value.name = selected === 'income' ? incomeOptions[0] : expenseOptions[0]
  step.value = 2
}

// back to step 1
const goBack = () => {
  step.value = 1
  form.value = {
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    emotion: ''
  }
}

// submit
const saveData = async () => {
  if (!form.value.amount || isNaN(parseInt(form.value.amount))) {
    alert('Masukkan jumlah yang valid!')
    return
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    alert('User belum login!')
    return
  }

  await supabase.from('transactions').insert([{
    user_id: user.id,
    amount: parseInt(form.value.amount),
    type: type.value,
    category: form.value.name,
    emotion: form.value.emotion,
    created_at: form.value.date
  }])

  alert('Data berhasil disimpan!')
  goBack()
}

// SVG Paths
const svgPaths = {
  p1093a180: "M10.157 12.711L4.5 18.368L3.086 16.954L8.036 12.004L3.086 7.054L4.5 5.64L10.157 11.297C10.3445 11.4845 10.4498 11.7388 10.4498 12.004C10.4498 12.2692 10.3445 12.5235 10.157 12.711Z",
  p29441300: "M6.375 20.1875C5.52962 20.1875 4.71887 19.8517 4.1211 19.2539C3.52333 18.6561 3.1875 17.8454 3.1875 17C3.1875 16.1546 3.52333 15.3439 4.1211 14.7461C4.71887 14.1483 5.52962 13.8125 6.375 13.8125C7.22038 13.8125 8.03113 14.1483 8.6289 14.7461C9.22668 15.3439 9.5625 16.1546 9.5625 17C9.5625 17.8454 9.22668 18.6561 8.6289 19.2539C8.03113 19.8517 7.22038 20.1875 6.375 20.1875ZM17 20.1875C16.1546 20.1875 15.3439 19.8517 14.7461 19.2539C14.1483 18.6561 13.8125 17.8454 13.8125 17C13.8125 16.1546 14.1483 15.3439 14.7461 14.7461C15.3439 14.1483 16.1546 13.8125 17 13.8125C17.8454 13.8125 18.6561 14.1483 19.2539 14.7461C19.8517 15.3439 20.1875 16.1546 20.1875 17C20.1875 17.8454 19.8517 18.6561 19.2539 19.2539C18.6561 19.8517 17.8454 20.1875 17 20.1875ZM27.625 20.1875C26.7796 20.1875 25.9689 19.8517 25.3711 19.2539C24.7733 18.6561 24.4375 17.8454 24.4375 17C24.4375 16.1546 24.7733 15.3439 25.3711 14.7461C25.9689 14.1483 26.7796 13.8125 27.625 13.8125C28.4704 13.8125 29.2811 14.1483 29.8789 14.7461C30.4767 15.3439 30.8125 16.1546 30.8125 17C30.8125 17.8454 30.4767 18.6561 29.8789 19.2539C29.2811 19.8517 28.4704 20.1875 27.625 20.1875Z",
  p3131ff80: "M10.9614 13.7177L4.85639 19.8227L3.33041 18.2967L8.67244 12.9547L3.33041 7.61267L4.85639 6.08668L10.9614 12.1917C11.1637 12.3941 11.2774 12.6685 11.2774 12.9547C11.2774 13.2409 11.1637 13.5153 10.9614 13.7177Z",
  p3ed72c80: "M7.91667 5.41583H5.41667V7.91583H4.58333V5.41583H2.08333V4.5825H4.58333V2.0825H5.41667V4.5825H7.91667V5.41583Z"
}
</script>

<template>
  <div class="bg-white relative w-full h-screen overflow-auto">

    <!-- ===================== -->
    <!-- STEP 1: CHOOSE TYPE   -->
    <!-- ===================== -->
    <div v-if="step === 1" class="relative w-full h-screen overflow-hidden">

      <!-- Background Gradient Ellipse -->
      <div class="absolute h-[578px] left-[-85px] top-[-173px] w-[600px]">
        <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 600 578">
          <ellipse cx="300" cy="289" fill="url(#grad_step1)" rx="300" ry="289" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="grad_step1" x1="300" x2="300" y1="0" y2="578">
              <stop offset="0.23" stop-color="#2678FF" />
              <stop offset="1" stop-color="#00B0DA" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- Three Dots Menu -->
      <div class="absolute right-[24px] size-[34px] top-[56px]">
        <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
          <path :d="svgPaths.p29441300" fill="white" />
        </svg>
      </div>

      <!-- Header -->
      <div class="absolute top-[80px] left-0 right-0 flex flex-col items-center">
        <p class="font-['Geologica',sans-serif] font-normal text-[13px] text-white/70 tracking-widest uppercase mb-1">New Transaction</p>
        <p class="font-['Geologica',sans-serif] font-bold text-[28px] text-white">Add Transaction</p>
      </div>

      <!-- White card -->
      <div class="absolute bg-white rounded-[30px] left-[20px] right-[20px] top-[190px] bottom-[40px] shadow-xl flex flex-col items-center justify-center px-8 gap-6">

        <!-- Subtitle -->
        <p class="font-['Geologica',sans-serif] text-[14px] text-[#9a9a9a] text-center mb-2">What would you like to record?</p>

        <!-- Income Button -->
        <button
          @click="selectType('income')"
          class="w-full h-[80px] rounded-[20px] flex items-center px-6 gap-5 transition-all active:scale-[0.98]"
          style="background: linear-gradient(135deg, #e8f4ff 0%, #d0ebff 100%); border: 1.5px solid #a8d4ff;"
        >
          <!-- Icon circle -->
          <div class="w-[46px] h-[46px] rounded-full flex items-center justify-center flex-shrink-0" style="background: linear-gradient(135deg, #2678FF, #00B0DA);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="flex flex-col items-start">
            <p class="font-['Geologica',sans-serif] font-bold text-[18px] text-[#2678FF]">Income</p>
            <p class="font-['Geologica',sans-serif] text-[12px] text-[#7aadee]">Salary, freelance, bonus & more</p>
          </div>
          <!-- Arrow -->
          <div class="ml-auto">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1l6 6-6 6" stroke="#2678FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </button>

        <!-- Expense Button -->
        <button
          @click="selectType('expense')"
          class="w-full h-[80px] rounded-[20px] flex items-center px-6 gap-5 transition-all active:scale-[0.98]"
          style="background: linear-gradient(135deg, #fff3f3 0%, #ffe0e0 100%); border: 1.5px solid #ffb8b8;"
        >
          <!-- Icon circle -->
          <div class="w-[46px] h-[46px] rounded-full flex items-center justify-center flex-shrink-0" style="background: linear-gradient(135deg, #ff6b6b, #ff4444);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M19 12l-7 7-7-7" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="flex flex-col items-start">
            <p class="font-['Geologica',sans-serif] font-bold text-[18px] text-[#ff4444]">Expense</p>
            <p class="font-['Geologica',sans-serif] text-[12px] text-[#ffaaaa]">Food, transport, bills & more</p>
          </div>
          <!-- Arrow -->
          <div class="ml-auto">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1l6 6-6 6" stroke="#ff4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </button>

        <!-- Divider hint -->
        <p class="font-['Geologica',sans-serif] text-[12px] text-[#c0c0c0] text-center mt-2">Tap a category to continue</p>

      </div>
    </div>

    <!-- ===================== -->
    <!-- STEP 2: FORM          -->
    <!-- ===================== -->
    <div v-if="step === 2" class="relative w-full h-screen overflow-auto">

      <!-- Background Gradient Ellipse -->
      <div class="absolute h-[578px] left-[-85px] top-[-173px] w-[600px]">
        <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 600 578">
          <ellipse cx="300" cy="289" fill="url(#grad_form)" rx="300" ry="289" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="grad_form" x1="300" x2="300" y1="0" y2="578">
              <stop offset="0.23" stop-color="#2678FF" />
              <stop offset="1" stop-color="#00B0DA" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- Back Button -->
      <button @click="goBack" class="absolute left-[24px] top-[56px] w-[34px] h-[34px] flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Three Dots Menu -->
      <div class="absolute right-[24px] top-[56px] size-[34px]">
        <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
          <path :d="svgPaths.p29441300" fill="white" />
        </svg>
      </div>

      <!-- Header Title -->
      <p class="absolute font-['Geologica',sans-serif] font-normal text-[24px] text-white top-[55px] left-0 right-0 text-center">
        {{ type === 'income' ? 'Add Income' : 'Add Expense' }}
      </p>

      <!-- Type badge -->
      <div
        class="absolute top-[95px] left-0 right-0 flex justify-center"
      >
        <span
          class="font-['Geologica',sans-serif] text-[12px] font-bold px-4 py-1 rounded-full"
          :style="type === 'income'
            ? 'background: rgba(255,255,255,0.25); color: white;'
            : 'background: rgba(255,255,255,0.25); color: white;'"
        >
          {{ type === 'income' ? '▲ INCOME' : '▼ EXPENSE' }}
        </span>
      </div>

      <!-- Form Card -->
      <div class="absolute bg-white border border-solid border-white rounded-[25px] left-[20px] right-[20px] top-[160px]" style="padding: 28px 28px 32px;">

        <!-- NAME Field -->
        <p class="font-['Anuphan',sans-serif] font-normal text-[#646060] text-[13px] mb-[6px] tracking-wider">NAME</p>
        <div class="relative mb-5">
          <select
            v-model="form.name"
            class="w-full bg-[#f1f1f1] border border-[#6d3a7c] rounded-[10px] h-[52px] px-5 text-[#6d3a7c] text-[15px] outline-none appearance-none font-['Geologica',sans-serif] cursor-pointer"
          >
            <option
              v-for="item in (type === 'income' ? incomeOptions : expenseOptions)"
              :key="item"
              :value="item"
            >{{ item }}</option>
          </select>
          <!-- Dropdown Arrow -->
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="13" height="26" viewBox="0 0 12.9504 25.9008" fill="none">
              <path clip-rule="evenodd" :d="svgPaths.p3131ff80" fill="#6D3A7C" fill-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- AMOUNT Field -->
        <p class="font-['Anuphan',sans-serif] font-normal text-[#646060] text-[13px] mb-[6px] tracking-wider">AMOUNT</p>
        <div class="relative mb-5">
          <div class="bg-[#f1f1f1] border border-[#8c8a8a] rounded-[10px] h-[52px] flex items-center px-5">
            <input
              v-model="form.amount"
              type="number"
              placeholder="Rp0"
              class="flex-1 bg-transparent border-none outline-none text-[#646060] text-[15px] font-['Geologica',sans-serif]"
            />
            <span
              @click="form.amount = ''"
              class="text-[13px] text-[#646060] cursor-pointer hover:text-[#2678ff] font-['Geologica',sans-serif]"
            >Clear</span>
          </div>
        </div>

        <!-- DATE Field -->
        <p class="font-['Anuphan',sans-serif] font-normal text-[#646060] text-[13px] mb-[6px] tracking-wider">DATE</p>
        <div class="mb-5">
          <input
            v-model="form.date"
            type="date"
            class="w-full bg-[#f1f1f1] border border-[#8c8a8a] rounded-[10px] h-[52px] px-5 text-[#646060] text-[15px] outline-none font-['Geologica',sans-serif]"
          />
        </div>

        <!-- EMOTIONS Field -->
        <p class="font-['Anuphan',sans-serif] font-normal text-[#646060] text-[13px] mb-[6px] tracking-wider">EMOTIONS</p>
        <div class="relative mb-5">
          <input
            v-model="form.emotion"
            type="text"
            placeholder="Happy"
            class="w-full bg-[#f1f1f1] border border-[#8c8a8a] rounded-[10px] h-[52px] px-5 text-[#646060] text-[15px] outline-none font-['Geologica',sans-serif]"
          />
        </div>

        <!-- SCAN Field -->
        <p class="font-['Anuphan',sans-serif] font-normal text-[#646060] text-[13px] mb-[6px] tracking-wider">SCAN</p>
        <div class="mb-6 bg-[#f1f1f1] border border-[#8c8a8a] rounded-[10px] h-[52px] flex items-center px-5 gap-3 cursor-pointer hover:border-[#2678ff] transition-colors">
          <div class="w-[20px] h-[20px] rounded-full flex items-center justify-center flex-shrink-0" style="background:#2678FF;">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path :d="svgPaths.p3ed72c80" fill="white" />
            </svg>
          </div>
          <span class="font-['Geologica',sans-serif] text-[15px] text-[#646060]">Scan Invoice</span>
        </div>

        <!-- Save Button -->
        <button
          @click="saveData"
          class="w-full h-[54px] rounded-[20px] font-['Geologica',sans-serif] font-bold text-[16px] text-white transition-all active:scale-[0.98]"
          style="background: linear-gradient(135deg, #2678FF 0%, #00B0DA 100%);"
        >
          Save
        </button>

      </div>

      <!-- Bottom spacer -->
      <div class="h-[40px]"></div>

    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Geologica:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@400&display=swap');

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 30px #f1f1f1 inset !important;
  -webkit-text-fill-color: #646060 !important;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
}

select option {
  color: #6d3a7c;
  background: white;
}

button {
  -webkit-tap-highlight-color: transparent;
}
</style>
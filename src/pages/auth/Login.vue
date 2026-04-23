<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase.js'

// SVG Paths
const svgPaths = {
  p16040f00: "M47.8488 4.18005C47.6316 3.96085 47.373 3.78702 47.088 3.66868C46.803 3.55033 46.4973 3.48983 46.1887 3.49069H44.5312V-0.415559C44.5306 -1.03695 44.2834 -1.63268 43.844 -2.07207C43.4046 -2.51146 42.8089 -2.75861 42.1875 -2.75931H8.45967C6.63045 -2.75923 4.87617 -2.03254 3.58272 -0.739089C2.28927 0.554364 1.56258 2.30864 1.5625 4.13786V30.9685C1.56258 32.7977 2.28927 34.552 3.58272 35.8455C4.87617 37.1389 6.63045 37.8656 8.45967 37.8657H46.0964C46.7163 37.8645 47.3106 37.6182 47.7497 37.1805C48.1887 36.7429 48.4369 36.1494 48.4401 35.5295L48.5323 5.84245C48.5342 5.53389 48.4748 5.22802 48.3575 4.94263C48.2401 4.65724 48.0672 4.39802 47.8488 4.18005ZM45.3177 34.7407H8.45967C7.45923 34.7407 6.49976 34.3433 5.79234 33.6358C5.08492 32.9284 4.6875 31.969 4.6875 30.9685V4.13786C4.6875 3.13742 5.08492 2.17795 5.79234 1.47053C6.49976 0.763115 7.45923 0.365691 8.45967 0.365691H41.4062V3.49069H8.59375V6.61569H45.405L45.3177 34.7407Z",
  p389458b0: "M38.2812 25.7812H41.4062V28.9062H38.2812V25.7812Z"
};

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const router = useRouter()

const handleLogin = async () => {
  errorMsg.value = ''

  if (!email.value || !password.value) {
    errorMsg.value = 'Email dan password wajib diisi'
    return
  }

  loading.value = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) throw error

    // ✅ berhasil login
    console.log('LOGIN SUCCESS:', data)

    router.push('/app/home')

  } catch (err) {
    console.error(err)
    errorMsg.value = err.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-gradient-to-b from-[#2678ff] to-[#00b0da] relative w-full h-full flex flex-col">
    <!-- White Card Container -->
    <div class="absolute bg-[#fffdfd] h-[744px] left-[35px] rounded-[29px] top-[94px] w-[361px]" />

    <!-- Logo Background Ellipse -->
    <div class="absolute h-[96px] left-[171px] top-[127px] w-[90px]">
      <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90 96">
        <ellipse cx="45" cy="48" fill="url(#paint0_linear_5_33)" id="Ellipse 1" rx="45" ry="48" />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_5_33" x1="0" x2="90" y1="48" y2="48">
            <stop stop-color="#2678FF" />
            <stop offset="1" stop-color="#00B0DA" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Wallet Icon -->
    <div class="absolute left-[191px] size-[50px] top-[157px]" data-name="cil:wallet">
      <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
        <g clip-path="url(#clip0_5_29)" id="cil:wallet">
          <path :d="svgPaths.p16040f00" fill="white" id="Vector" />
          <path :d="svgPaths.p389458b0" fill="white" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_5_29">
            <rect fill="white" height="50" width="50" />
          </clipPath>
        </defs>
      </svg>
    </div>

    <!-- Welcome Heading -->
    <p class="absolute font-geologica font-semibold h-[40px] leading-[normal] left-[128px] not-italic text-[32.842px] text-black top-[272px] w-[175px]" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Welcome!
    </p>

    <!-- Subtitle -->
    <p class="absolute font-geologica font-normal h-[19px] leading-[normal] left-[114px] not-italic text-[12.664px] text-black top-[357px] w-[238px]" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Manage you money with emotions
    </p>

    <!-- Email Label -->
    <p class="absolute font-geologica font-normal h-[18px] leading-[normal] left-[97px] not-italic text-[12.664px] text-black top-[400px] w-[238px]" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Email
    </p>

    <!-- Email Input -->
    <div class="absolute bg-white border border-[#d9d9d9] border-solid h-[60px] left-[97px] rounded-[9px] top-[424px] w-[253px]" />
    <input
      v-model="email"
      type="email"
      placeholder=""
      class="absolute bg-transparent border-none h-[60px] left-[97px] outline-none px-4 rounded-[9px] text-black top-[424px] w-[253px]"
    />

    <!-- Password Label -->
    <p class="absolute font-geologica font-normal h-[19px] leading-[normal] left-[97px] not-italic text-[12.664px] text-black top-[497px] w-[238px]" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Password
    </p>

    <!-- Password Input -->
    <div class="absolute bg-white border border-[#d9d9d9] border-solid h-[60px] left-[97px] rounded-[9px] top-[526px] w-[253px]" />
    <input
      v-model="password"
      type="password"
      placeholder=""
      class="absolute bg-transparent border-none h-[60px] left-[97px] outline-none px-4 rounded-[9px] text-black top-[526px] w-[253px]"
    />

    <!-- Login Button -->
    <button
      @click="handleLogin"
      class="absolute bg-[#2678ff] h-[60px] left-[97px] rounded-[9px] top-[642px] w-[253px] cursor-pointer hover:bg-[#1d5dd4] transition-colors"
    >
      <p class="font-geologica font-normal leading-[normal] not-italic text-[22.503px] text-white" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
        Login
      </p>
    </button>

    <!-- Sign Up Link -->
    <p class="absolute font-geologica font-normal h-[21px] leading-[normal] left-[110px] not-italic text-[14.388px] text-black top-[754px] w-[182px]" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Don't have an account?
    </p>
    <p
      @click="$router.push('/register')"
      class="absolute decoration-solid font-geologica font-normal h-[21px] leading-[normal] left-[276px] not-italic text-[#2678ff] text-[14.388px] top-[754px] underline w-[62px] cursor-pointer hover:text-[#1d5dd4] transition-colors"
      style="font-variation-settings: 'CRSV' 0, 'SHRP' 0"
    >
      Sign Up
    </p>

    <!-- Dummy content to enable scrolling -->
    <div class="absolute mt-8 space-y-4 top-[800px] left-[35px] w-[361px]">
      <div class="bg-gray-200 p-4 rounded-2xl">
        <p class="text-gray-700">Dummy content 1</p>
      </div>
      <div class="bg-gray-200 p-4 rounded-2xl">
        <p class="text-gray-700">Dummy content 2</p>
      </div>
      <div class="bg-gray-200 p-4 rounded-2xl">
        <p class="text-gray-700">Dummy content 3</p>
      </div>
      <div class="bg-gray-200 p-4 rounded-2xl">
        <p class="text-gray-700">Dummy content 4</p>
      </div>
      <div class="bg-gray-200 p-4 rounded-2xl">
        <p class="text-gray-700">Dummy content 5</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Import Geologica font */
  @import url('https://fonts.googleapis.com/css2?family=Geologica:wght@400;600&display=swap');

  /* Remove autofill background color */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: black !important;
  }
</style>
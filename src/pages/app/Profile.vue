<script setup>
import { ref } from 'vue';

// SVG Paths
const svgPaths = {
  p108f2bc0: "M1.87204 43.9315C0.373001 29.1798 3.42851 14.3142 10.5935 1.5L27.0735 11.5258C21.9557 20.6787 19.7732 31.297 20.8439 41.834L1.87204 43.9315Z",
  p14ac4600: "M15.9867 33.32C7.0975 32.9633 0 25.6433 0 16.6667C0 7.46167 7.46167 0 16.6667 0C25.8717 0 33.3333 7.46167 33.3333 16.6667C33.3333 25.8717 25.8717 33.3333 16.6667 33.3333H16.4383C16.2872 33.3333 16.1367 33.3289 15.9867 33.32ZM5.97167 27.1833C5.84705 26.8255 5.80464 26.4441 5.84757 26.0677C5.8905 25.6912 6.01767 25.3292 6.21965 25.0086C6.42163 24.6879 6.69322 24.4169 7.01427 24.2156C7.33532 24.0143 7.69758 23.888 8.07417 23.8458C14.5708 23.1267 18.8025 23.1917 25.2675 23.8608C25.6446 23.9001 26.0077 24.0249 26.3293 24.2257C26.6509 24.4266 26.9224 24.6981 27.1231 25.0198C27.3239 25.3414 27.4486 25.7046 27.4878 26.0817C27.5269 26.4588 27.4795 26.8398 27.3492 27.1958C30.1201 24.3925 31.6718 20.6083 31.6667 16.6667C31.6667 8.3825 24.9508 1.66667 16.6667 1.66667C8.3825 1.66667 1.66667 8.3825 1.66667 16.6667C1.66667 20.7633 3.30917 24.4767 5.97167 27.1833Z",
  p17347d00: "M23.3333 13.3333C23.3333 15.1014 22.631 16.7971 21.3807 18.0474C20.1305 19.2976 18.4348 20 16.6667 20C14.8986 20 13.2029 19.2976 11.9526 18.0474C10.7024 16.7971 10 15.1014 10 13.3333C10 11.5652 10.7024 9.86953 11.9526 8.61929C13.2029 7.36905 14.8986 6.66667 16.6667 6.66667C18.4348 6.66667 20.1305 7.36905 21.3807 8.61929C22.631 9.86953 23.3333 11.5652 23.3333 13.3333Z",
  p19fc1a00: "M0.451499 10.0946L5.01662 0.5H15.2371",
  p1d4b9d80: "M0.311786 0.390883L8.42002 6.85838H18.6405",
  p1e12a100: "M6.66667 35V15L20 5L33.3333 15V35H23.3333V23.3333H16.6667V35H6.66667Z",
  p228f1c00: "M19.2826 0.438295L10.2204 5.4133H0",
  p2316100: "M1.50022 21.9918C5.95538 14.024 11.8834 7.05866 18.9403 1.50001L30.4375 17.3806C25.3969 21.351 21.1625 26.3263 17.9803 32.0176L1.50022 21.9918Z",
  p27979100: "M17.8517 7.53607L10.2204 0.5H0",
  p2835aa80: "M24.9055 49.5454C11.7062 37.9583 3.31852 21.4922 1.50011 3.59754L20.472 1.50001C21.7708 14.2819 27.7621 26.0434 37.1902 34.3199L24.9055 49.5454Z",
  p29441300: "M6.375 20.1875C5.52962 20.1875 4.71887 19.8517 4.1211 19.2539C3.52333 18.6561 3.1875 17.8454 3.1875 17C3.1875 16.1546 3.52333 15.3439 4.1211 14.7461C4.71887 14.1483 5.52962 13.8125 6.375 13.8125C7.22038 13.8125 8.03113 14.1483 8.6289 14.7461C9.22668 15.3439 9.5625 16.1546 9.5625 17C9.5625 17.8454 9.22668 18.6561 8.6289 19.2539C8.03113 19.8517 7.22038 20.1875 6.375 20.1875ZM17 20.1875C16.1546 20.1875 15.3439 19.8517 14.7461 19.2539C14.1483 18.6561 13.8125 17.8454 13.8125 17C13.8125 16.1546 14.1483 15.3439 14.7461 14.7461C15.3439 14.1483 16.1546 13.8125 17 13.8125C17.8454 13.8125 18.6561 14.1483 19.2539 14.7461C19.8517 15.3439 20.1875 16.1546 20.1875 17C20.1875 17.8454 19.8517 18.6561 19.2539 19.2539C18.6561 19.8517 17.8454 20.1875 17 20.1875ZM27.625 20.1875C26.7796 20.1875 25.9689 19.8517 25.3711 19.2539C24.7733 18.6561 24.4375 17.8454 24.4375 17C24.4375 16.1546 24.7733 15.3439 25.3711 14.7461C25.9689 14.1483 26.7796 13.8125 27.625 13.8125C28.4704 13.8125 29.2811 14.1483 29.8789 14.7461C30.4767 15.3439 30.8125 16.1546 30.8125 17C30.8125 17.8454 30.4767 18.6561 29.8789 19.2539C29.2811 19.8517 28.4704 20.1875 27.625 20.1875Z",
  p29a91900: "M0.750003 15.75C0.750003 14.1783 0.750003 13.3933 1.23834 12.905C1.72667 12.4167 2.51167 12.4167 4.08334 12.4167C5.655 12.4167 6.44 12.4167 6.92834 12.905C7.41667 13.3933 7.41667 14.1783 7.41667 15.75V25.75C7.41667 27.3217 7.41667 28.1067 6.92834 28.595C6.44 29.0833 5.655 29.0833 4.08334 29.0833C2.51167 29.0833 1.72667 29.0833 1.23834 28.595C0.750003 28.1067 0.750003 27.3217 0.750003 25.75V15.75ZM12.4167 9.08334C12.4167 7.51167 12.4167 6.72667 12.905 6.23834C13.3933 5.75 14.1783 5.75 15.75 5.75C17.3217 5.75 18.1067 5.75 18.595 6.23834C19.0833 6.72667 19.0833 7.51167 19.0833 9.08334V25.75C19.0833 27.3217 19.0833 28.1067 18.595 28.595C18.1067 29.0833 17.3217 29.0833 15.75 29.0833C14.1783 29.0833 13.3933 29.0833 12.905 28.595C12.4167 28.1067 12.4167 27.3217 12.4167 25.75V9.08334ZM24.0833 4.08334C24.0833 2.51167 24.0833 1.72667 24.5717 1.23834C25.06 0.750003 25.845 0.750003 27.4167 0.750003C28.9883 0.750003 29.7733 0.750003 30.2617 1.23834C30.75 1.72667 30.75 2.51167 30.75 4.08334V25.75C30.75 27.3217 30.75 28.1067 30.2617 28.595C29.7733 29.0833 28.9883 29.0833 27.4167 29.0833C25.845 29.0833 25.06 29.0833 24.5717 28.595C24.0833 28.1067 24.0833 27.3217 24.0833 25.75V4.08334Z",
  p32a76280: "M61.9203 30.6731C51.5177 33.6062 40.5891 33.8695 30.0677 31.4408C19.5463 29.012 9.74474 23.9632 1.50003 16.7255L13.7847 1.5C19.6737 6.66975 26.6748 10.276 34.1901 12.0109C41.7054 13.7457 49.5115 13.5576 56.942 11.4626L61.9203 30.6731Z",
  p32ab3bc0: "M20.2365 2.77428L10.2204 0.5H0",
  p37bac500: "M0 21C0 9.40202 9.40202 0 21 0H128C139.598 0 149 9.40202 149 21V95C149 106.598 139.598 116 128 116H21C9.40202 116 0 106.598 0 95V21Z",
  p39b381c0: "M12.4008 0.102818L10.2204 10.4793H0",
  p3bf8c380: "M55.8281 1.5C55.8281 16.8061 50.9944 31.686 42.0743 43.8394C33.1541 55.9928 20.6443 64.7429 6.47873 68.7369L1.50034 49.5264C11.6186 46.6735 20.5542 40.4235 26.9258 31.7425C33.2973 23.0615 36.75 12.4329 36.75 1.5H55.8281Z",
  p3c338200: "M26.125 17.8723H17.875V26.1222H15.125V17.8723H6.875V15.1223H15.125V6.87225H17.875V15.1223H26.125V17.8723Z",
  p7638a70: "M1.50008 15.5681C11.4109 7.7614 23.2127 2.99243 35.579 1.79715C47.9454 0.601876 60.3863 3.02767 71.5037 8.80192C82.621 14.5762 91.9742 23.47 98.5122 34.484C105.05 45.498 108.514 58.1957 108.514 71.15H89.4355C89.4355 61.8969 86.9615 52.8272 82.2916 44.9601C77.6216 37.0929 70.9408 30.7402 62.9998 26.6157C55.0588 22.4912 46.1725 20.7585 37.3394 21.6123C28.5062 22.4661 20.0764 25.8725 12.9973 31.4487L1.50008 15.5681Z",
  pbef6400: "M39.0291 9.55148C38.8553 9.37613 38.6484 9.23706 38.4204 9.14239C38.1924 9.04771 37.9478 8.99931 37.7009 9H36.375V5.875C36.3744 5.37789 36.1767 4.9013 35.8252 4.54979C35.4737 4.19828 34.9971 4.00056 34.5 4H7.51773C6.05436 4.00006 4.65094 4.58141 3.61618 5.61618C2.58141 6.65094 2.00006 8.05436 2 9.51773V30.9823C2.00006 32.4456 2.58141 33.8491 3.61618 34.8838C4.65094 35.9186 6.05436 36.4999 7.51773 36.5H37.6271C38.1231 36.499 38.5985 36.302 38.9497 35.9519C39.301 35.6018 39.4996 35.127 39.5021 34.631L39.5759 10.8814C39.5774 10.6346 39.5299 10.3899 39.436 10.1615C39.3421 9.93324 39.2038 9.72586 39.0291 9.55148ZM37.0041 34H7.51773C6.71738 34 5.94981 33.6821 5.38387 33.1161C4.81794 32.5502 4.5 31.7826 4.5 30.9823V9.51773C4.5 8.71738 4.81794 7.94981 5.38387 7.38387C5.94981 6.81794 6.71738 6.5 7.51773 6.5H33.875V9H7.625V11.5H37.074L37.0041 34Z"
};
</script>

<template>
  <div class="bg-white relative w-full h-screen overflow-auto" data-name="Profile Analysist">
    <!-- Background Gradient Ellipse -->
    <div class="absolute h-[578px] left-[-72px] top-[-269px] w-[600px]">
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
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%-41px)] not-italic text-[24px] text-white top-[55px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Profile
    </p>

    <!-- Three Dots Menu -->
    <div class="absolute left-[338px] size-[34px] top-[99px]" data-name="bi:three-dots">
      <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
        <g id="bi:three-dots">
          <path :d="svgPaths.p29441300" fill="white" id="Vector" />
        </g>
      </svg>
    </div>

    <!-- Your Emotions Card -->
    <div class="absolute bg-white border border-[#646060] border-solid h-[221px] left-[41px] rounded-[25px] top-[154px] w-[343px]" />
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal leading-[normal] left-[152px] not-italic text-[#646060] text-[15px] top-[168px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      YOUR EMOTIONS
    </p>

    <!-- Emotion Chart - Happy (Orange/Yellow) -->
    <div class="absolute inset-[22.67%_33.08%_69.86%_42.04%]" data-name="Vector">
      <div class="absolute inset-[-2.15%_-1.4%]">
        <svg class="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 110.014 72.65">
          <path :d="svgPaths.p7638a70" fill="#FFB95A" id="Vector" stroke="white" stroke-linejoin="round" stroke-width="3" />
        </svg>
      </div>
    </div>
    <div class="absolute inset-[22.43%_38.24%_76.54%_58.32%]" data-name="Vector">
      <div class="absolute inset-[-5.21%_0_-2.24%_-3.05%]">
        <svg class="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.2371 10.3095">
          <path :d="svgPaths.p19fc1a00" id="Vector" stroke="#FFB95A" />
        </svg>
      </div>
    </div>

    <!-- Emotion Chart - Angry (Red) -->
    <div class="absolute inset-[24.18%_55.29%_72.54%_37.98%]" data-name="Vector">
      <div class="absolute inset-[-4.92%_-5.18%]">
        <svg class="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9376 33.5176">
          <path :d="svgPaths.p2316100" fill="#CB4F60" id="Vector" stroke="white" stroke-linejoin="round" stroke-width="3" />
        </svg>
      </div>
    </div>
    <div class="absolute inset-[24.43%_60.22%_74.82%_35.63%]" data-name="Vector">
      <div class="absolute inset-[-7.11%_-1.9%_-5.22%_0]">
        <svg class="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1906 7.90367">
          <path :d="svgPaths.p27979100" id="Vector" stroke="#CB4F60" />
        </svg>
      </div>
    </div>

    <!-- Emotion Chart - Sad (Blue) -->
    <div class="absolute inset-[26.38%_58.19%_69.07%_35.87%]" data-name="Vector">
      <div class="absolute inset-[-3.54%_-5.87%]">
        <svg class="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.5738 45.4315">
          <path :d="svgPaths.p108f2bc0" fill="#0B8FD9" id="Vector" stroke="white" stroke-linejoin="round" stroke-width="3" />
        </svg>
      </div>
    </div>
    <div class="absolute inset-[28.34%_63.78%_71.42%_31.51%]" data-name="Vector">
      <div class="absolute inset-[-21.98%_-0.55%_-21.44%_0]">
        <svg class="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.3472 3.26187">
          <path :d="svgPaths.p32ab3bc0" id="Vector" stroke="#0B8FD9" />
        </svg>
      </div>
    </div>

    <!-- Emotion Chart - Anxiety (Purple) -->
    <div class="absolute inset-[30.71%_55.75%_64.14%_35.95%]" data-name="Vector">
      <div class="absolute inset-[-3.12%_-4.2%]">
        <svg class="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38.6902 51.0454">
          <path :d="svgPaths.p2835aa80" fill="#973A93" id="Vector" stroke="white" stroke-linejoin="round" stroke-width="3" />
        </svg>
      </div>
    </div>
    <div class="absolute inset-[33.65%_62.31%_65.81%_33.2%]" data-name="Vector">
      <div class="absolute inset-[-8.81%_-1.25%_-10.05%_0]">
        <svg class="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5232 5.91329">
          <path :d="svgPaths.p228f1c00" id="Vector" stroke="#973A93" />
        </svg>
      </div>
    </div>

    <!-- Emotion Chart - Calm (Cyan) -->
    <div class="absolute inset-[34.23%_44.55%_62.38%_41.4%]" data-name="Vector">
      <div class="absolute inset-[-4.75%_-2.48%]">
        <svg class="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 63.4207 34.5862">
          <path :d="svgPaths.p32a76280" fill="#1BC0C4" id="Vector" stroke="white" stroke-linejoin="round" stroke-width="3" />
        </svg>
      </div>
    </div>
    <div class="absolute inset-[37.44%_51.96%_61.44%_45.15%]" data-name="Vector">
      <div class="absolute inset-[-0.99%_-3.95%_-4.82%_0]">
        <svg class="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8901 10.9793">
          <path :d="svgPaths.p39b381c0" id="Vector" stroke="#1BC0C4" />
        </svg>
      </div>
    </div>

    <!-- Emotion Chart - Regret (Purple Blue) -->
    <div class="absolute inset-[30.14%_33.08%_62.64%_54.29%]" data-name="Vector">
      <div class="absolute inset-[-2.23%_-2.76%]">
        <svg class="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 57.3281 70.2369">
          <path :d="svgPaths.p3bf8c380" fill="#5C60C6" id="Vector" stroke="white" stroke-linejoin="round" stroke-width="3" />
        </svg>
      </div>
    </div>
    <div class="absolute inset-[34.69%_32.01%_64.62%_63.72%]" data-name="Vector">
      <div class="absolute inset-[-6.04%_0_-7.73%_-1.7%]">
        <svg class="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.6405 7.35838">
          <path :d="svgPaths.p1d4b9d80" id="Vector" stroke="#5C60C6" />
        </svg>
      </div>
    </div>

    <!-- Emotion Labels -->
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal inset-[21.57%_26.51%_76.18%_62.56%] leading-[normal] not-italic text-[#828898] text-[12px]" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Happy
    </p>
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal inset-[23.51%_65.16%_74.2%_25.65%] leading-[normal] not-italic text-[#828898] text-[12px] text-right" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Angry
    </p>
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal inset-[27.42%_69.28%_70.29%_21.37%] leading-[normal] not-italic text-[#828898] text-[12px] text-right" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Sad
    </p>
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal inset-[33.26%_67.67%_64.48%_20.23%] leading-[normal] not-italic text-[#828898] text-[12px] text-right" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Anxiety
    </p>
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal inset-[37.66%_55.58%_60.09%_36.74%] leading-[normal] not-italic text-[#828898] text-[12px] text-right" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Calm
    </p>
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal inset-[34.44%_21.16%_63.2%_68.84%] leading-[normal] not-italic text-[#828898] text-[12px]" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Regret
    </p>

    <!-- Card 1: Happy (Orange) -->
    <div class="absolute bg-[#ffb95a] h-[116px] left-[56px] rounded-[21px] top-[418px] w-[149px]" />
    <p class="-translate-x-full absolute font-['Geologica:Regular',sans-serif] font-normal leading-[normal] left-[110px] not-italic text-[#583d3d] text-[12px] text-right top-[428px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Happy
    </p>
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal leading-[normal] left-[72px] not-italic text-[#583d3d] text-[12px] top-[448px] w-[122px]" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Kamu membeli baju karena butuh dan kamu jadi senang...
    </p>

    <!-- Card 2: Regret (Purple) -->
    <div class="absolute bg-[#9295e4] h-[116px] left-[224px] rounded-[21px] top-[418px] w-[149px]" />
    <p class="-translate-x-full absolute font-['Geologica:Regular',sans-serif] font-normal leading-[normal] left-[277px] not-italic text-[#583d3d] text-[12px] text-right top-[428px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Regret
    </p>
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal leading-[normal] left-[238px] not-italic text-[#583d3d] text-[12px] top-[448px] w-[130px] whitespace-pre-wrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">Kamu membeli matcha karena khawatir tidak mengikuti tren dan  kamu jadi menyesal...</p>

    <!-- Card 3: Calm (Cyan) -->
    <div class="absolute h-[116px] left-[56px] top-[553px] w-[149px]">
      <svg class="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 149 116">
        <path :d="svgPaths.p37bac500" fill="#1BC0C4" id="Rectangle 41" />
      </svg>
    </div>
    <p class="-translate-x-full absolute font-['Geologica:Regular',sans-serif] font-normal leading-[normal] left-[100px] not-italic text-[#583d3d] text-[12px] text-right top-[567px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Calm
    </p>
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal leading-[normal] left-[72px] not-italic text-[#583d3d] text-[12px] top-[585px] w-[122px]" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Kamu membeli teh chamomile karena sedih dan kamu jadi tenang...
    </p>

    <!-- Card 4: Anxiety (Purple Pink) -->
    <div class="absolute bg-[#d098ce] h-[116px] left-[224px] rounded-[21px] top-[553px] w-[149px]" />
    <p class="-translate-x-full absolute font-['Geologica:Regular',sans-serif] font-normal leading-[normal] left-[282px] not-italic text-[#583d3d] text-[12px] text-right top-[573px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Anxiety
    </p>
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal leading-[normal] left-[238px] not-italic text-[#583d3d] text-[12px] top-[594px] w-[122px]" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Kamu membeli teh chamomile karena sedih dan kamu jadi tenang...
    </p>

    <!-- Card 5: Sad (Light Blue) -->
    <div class="absolute bg-[#7cc3eb] h-[116px] left-[56px] rounded-[21px] top-[689px] w-[149px]" />
    <p class="-translate-x-full absolute font-['Geologica:Regular',sans-serif] font-normal leading-[normal] left-[94px] not-italic text-[#583d3d] text-[12px] text-right top-[702px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Sad
    </p>
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal leading-[0] left-[72px] not-italic text-[#583d3d] text-[12px] top-[722px] w-[122px]" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      <span class="leading-[normal]">Kamu memesan banyak barang saat merasa sedang </span>
      <span class="font-['Geologica:Italic',sans-serif] italic leading-[normal]" style="font-variation-settings: 'CRSV' 1, 'SHRP' 0">down</span>
      <span class="leading-[normal]"> agar kamu merasa lebih baik...</span>
    </p>

    <!-- Card 6: Angry (Red Pink) -->
    <div class="absolute bg-[#d26674] h-[116px] left-[226px] rounded-[21px] top-[689px] w-[149px]" />
    <p class="-translate-x-full absolute font-['Geologica:Regular',sans-serif] font-normal leading-[normal] left-[270px] not-italic text-[#583d3d] text-[12px] text-right top-[702px] whitespace-nowrap" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      Angry
    </p>
    <p class="absolute font-['Geologica:Regular',sans-serif] font-normal leading-[0] left-[236px] not-italic text-[#583d3d] text-[12px] top-[723px] w-[122px]" style="font-variation-settings: 'CRSV' 0, 'SHRP' 0">
      <span class="leading-[normal]">Kamu melakukan </span>
      <span class="font-['Geologica:Italic',sans-serif] italic leading-[normal]" style="font-variation-settings: 'CRSV' 1, 'SHRP' 0">impulsive shopping </span>
      <span class="leading-[normal]">karena merasa kesal...</span>
    </p>
  </div>
</template>
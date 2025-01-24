<template>
  <div class="container">
    <div class="stars"></div>
    <div class="welcome-message">
      <h1 class="glow-text">🎤 Welcome to 4 Games Collection</h1>
      <p class="fade-in">{{ message }}</p>
    </div>
    <div class="conversation fade-in-up">
      <h2>Conversation History:</h2>
      <ul>
        <li v-for="(item, index) in lastTwoMessages" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import annyang from 'annyang';
import { useRouter } from 'vue-router';

const router = useRouter();
const message = ref('Please say "My name is [Your Name]" to continue...');
const conversationHistory = ref([]);
const userName = ref('');
const selectedLanguage = ref('');

// محاسبه دو جمله آخر مکالمه
const lastTwoMessages = computed(() => {
  return conversationHistory.value.slice(-2);
});

// تابع خواندن متن
const speakText = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage.value || 'en-US';
    speechSynthesis.speak(utterance);

    conversationHistory.value.push(`Computer said: ${text}`);
  } else {
    console.error('Speech synthesis is not supported in this browser.');
  }
};

const startVoiceRecognition = () => {
  if (annyang) {
    const commands = {
      'my name is *name': (name) => {
        userName.value = name;
        const response = `Hello ${userName.value}, would you like to continue in English or German?`;
        message.value = response;
        conversationHistory.value.push(`You said: My name is ${name}`);
        speakText(response);
      },
      'english': () => {
        selectedLanguage.value = 'en-US';
        const response = "Great! Redirecting to the English page...";
        message.value = response;
        conversationHistory.value.push(`You said: English`);
        speakText(response);
        setTimeout(() => {
          router.push('/home');
        }, 3000);
      },
      'german': () => {
        selectedLanguage.value = 'de-DE';
        const response = "Toll! Weiterleitung zur deutschen Seite...";
        message.value = response;
        conversationHistory.value.push(`You said: German`);
        speakText(response);
        setTimeout(() => {
          router.push('/deutsch');
        }, 3000);
      }
    };

    annyang.addCommands(commands);
    annyang.start();

    const welcomeMessage = "Please say 'My name is [Your Name]' to continue...";
    speakText(welcomeMessage);
  } else {
    message.value = 'Speech recognition is not supported in your browser.';
    speakText(message.value);
  }
};

onMounted(() => {
  setTimeout(() => {
    startVoiceRecognition();
  }, 1000);
});
</script>

<style scoped>
body {
  background-color: #000;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  color: #fff;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* مرکز قرار دادن محتوای صفحه */
.container {
  text-align: center;
  max-width: 80%;
}

h1 {
  font-size: 3rem;
  color: #4caf50;
  text-shadow: 0 0 20px #4caf50, 0 0 40px #4caf50, 0 0 60px #4caf50;
}

p {
  font-size: 1.8rem;
  color: #bbb;
  margin-top: 20px;
}

/* جعبه مکالمه‌ها */
.conversation {
  margin-top: 40px;
  border-top: 2px solid #4caf50;
  padding-top: 20px;
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 255, 0, 0.3);
}

/* متن‌های مکالمه */
ul {
  list-style-type: none;
  padding: 0;
}

li {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #fff;
  font-weight: bold;
}

/* ستاره‌های متحرک بیشتر و بزرگ‌تر */
.stars {
  position: fixed;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 1%, rgba(0, 0, 0, 1) 70%);
  overflow: hidden;
  z-index: -1;
}

.stars::before, .stars::after {
  content: '';
  position: absolute;
  width: 700%;
  height: 700%;
  background-image: 
                    radial-gradient(6px 6px at 5% 10%, #fff, transparent),
                    radial-gradient(8px 8px at 20% 30%, #fff, transparent),
                    radial-gradient(10px 10px at 40% 50%, #fff, transparent),
                    radial-gradient(12px 12px at 60% 70%, #fff, transparent),
                    radial-gradient(14px 14px at 80% 90%, #fff, transparent),
                    radial-gradient(8px 8px at 10% 80%, #fff, transparent),
                    radial-gradient(6px 6px at 70% 20%, #fff, transparent),
                    radial-gradient(10px 10px at 90% 40%, #fff, transparent),
                    radial-gradient(16px 16px at 50% 90%, #fff, transparent),
                    radial-gradient(20px 20px at 75% 15%, #fff, transparent),
                    radial-gradient(8px 8px at 15% 50%, #fff, transparent),
                    radial-gradient(6px 6px at 30% 70%, #fff, transparent);
  animation: starAnimation 15s linear infinite;
  opacity: 1;
}

.stars::after {
  background-image: 
                    radial-gradient(8px 8px at 50% 10%, #fff, transparent),
                    radial-gradient(14px 14px at 80% 20%, #fff, transparent),
                    radial-gradient(12px 12px at 20% 60%, #fff, transparent),
                    radial-gradient(10px 10px at 40% 30%, #fff, transparent),
                    radial-gradient(6px 6px at 70% 90%, #fff, transparent),
                    radial-gradient(16px 16px at 90% 50%, #fff, transparent),
                    radial-gradient(18px 18px at 60% 80%, #fff, transparent),
                    radial-gradient(20px 20px at 30% 40%, #fff, transparent),
                    radial-gradient(14px 14px at 90% 90%, #fff, transparent),
                    radial-gradient(8px 8px at 25% 35%, #fff, transparent),
                    radial-gradient(12px 12px at 5% 95%, #fff, transparent),
                    radial-gradient(10px 10px at 50% 90%, #fff, transparent);
  animation: starAnimation 10s linear infinite reverse;
}

@keyframes starAnimation {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}
</style>

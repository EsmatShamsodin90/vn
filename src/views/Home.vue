<template>
  <div class="landing-page">
    <h1 style="color :antiquewhite">Welcome! 😊</h1>
    <p class="fade-in">Which game do you want to play?</p>

    <div>
      <!-- Game List -->
      <div class="game-list">
        <div class="game-card pulse" @click="chooseGame('Tic Tac Toe')">Tic Tac Toe</div>
        <div class="game-card pulse" @click="chooseGame('Snake and Ladder')">Snake and Ladder</div>
        <div class="game-card pulse" @click="chooseGame('Tetris')">Tetris</div>
        <div class="game-card pulse" @click="chooseGame('Puzzle')">Puzzle</div>
      </div>
    </div>

    <!-- Chat transcript footer -->
    <div class="chat-footer">
      <p v-for="(line, index) in recentMessages" :key="index">
        {{ line }}
      </p>
    </div>

    <!-- Background Stars -->
    <div class="stars"></div>
  </div>
</template>

<script>
import annyang from "annyang";

export default {
  data() {
    return {
      chosenGame: "",
      chatTranscript: [],
    };
  },
  computed: {
    recentMessages() {
      return this.chatTranscript.slice(-2);
    },
  },
  mounted() {
    this.initAnnyang();
    this.createStars(150); // افزایش تعداد ستاره‌ها
  },
  methods: {
    createStars(count) {
      const starsContainer = document.querySelector(".stars");
      for (let i = 0; i < count; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = Math.random() * 100 + "vw"; // موقعیت افقی تصادفی
        star.style.top = Math.random() * 100 + "vh"; // موقعیت عمودی تصادفی
        star.style.width = star.style.height = Math.random() * 12 + 4 + "px"; // افزایش اندازه ستاره‌ها
        star.style.animationDuration = 2 + Math.random() * 3 + "s"; // افزایش سرعت انیمیشن
        starsContainer.appendChild(star);
      }
    },
    speak(text) {
      if (!window.speechSynthesis) {
        this.addToTranscript("Error: Speech Synthesis is not supported in your browser.");
        return;
      }
      this.addToTranscript("Computer: " + text);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    },
    addToTranscript(message) {
      this.chatTranscript.push(message);
    },
    initAnnyang() {
      if (annyang) {
        const commands = {
          "(I want to play) *game": (game) => {
            const validGames = ["tic tac toe", "snake and ladder", "tetris", "puzzle"];
            if (validGames.includes(game.toLowerCase())) {
              this.chooseGame(game);
            } else {
              this.speak("I didn't recognize that game. Please try again.");
            }
          },
        };
        annyang.addCommands(commands);
        annyang.start({ autoRestart: true, continuous: true });
        this.speak("Which game do you want to play?");
      } else {
        this.addToTranscript("Error: Speech recognition not supported.");
      }
    },
    chooseGame(game) {
      this.chosenGame = game;
      this.addToTranscript(`User: I want to play ${game}`);
      this.speak(`Great choice! Starting ${game}.`);

      // هدایت به مسیر مرتبط
      if (game.toLowerCase() === 'tic tac toe') {
        this.$router.push('/tictactoe');
      } else if (game.toLowerCase() === 'snake and ladder') {
        this.$router.push('/snakeandladder');
      } else if (game.toLowerCase() === 'tetris') {
        this.$router.push('/tetris');
      } else if (game.toLowerCase() === 'puzzle') {
        this.$router.push('/puzzle');
      } else {
        this.speak("I couldn't find the game you want to play.");
      }
    },
  },
};
</script>
<style>
/* تنظیم پس‌زمینه سیاه */
body {
  background: black;
  margin: 0;
  overflow: hidden;
}

/* Container for Stars */
.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

/* Individual Stars */
.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  opacity: 0.9;
  animation: moveStar linear infinite;
}

/* افزایش اندازه ستاره‌ها */
.star {
  width: 5px; /* حداقل اندازه */
  height: 5px; /* حداقل اندازه */
}

/* انیمیشن حرکت ستاره‌ها */
@keyframes moveStar {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh);
    opacity: 0.2;
  }
}

/* Main Page Styles */
.landing-page {
  text-align: center;
  font-family: Arial, sans-serif;
  margin-top: 50px;
  position: relative;
  z-index: 10;
}

/* Game List Grid */
.game-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
  z-index: 10;
}

/* Game Cards */
.game-card {
  background-color: #333;
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
}

.game-card:hover {
  background-color: #444;
  transform: translateY(-5px);
}

/* Chat Footer */
.chat-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #222;
  color: white;
  padding: 10px;
  text-align: center;
  border-top: 2px solid #444;
  font-size: 1rem;
  line-height: 1.5;
  z-index: 10;
}

.chat-footer p {
  margin: 5px 0;
}
</style>


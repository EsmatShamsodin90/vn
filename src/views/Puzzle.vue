<template>
  <div class="memory-match">
    <!-- صفحه منوی اصلی -->
    <div class="menu" v-if="showMenu">
      <h1>Memory Match</h1>
      <h3>Select a Level by saying "easy", "medium", or "hard":</h3>
      <p><strong>Listening for voice commands...</strong></p>
    </div>

    <!-- صفحه بازی -->
    <div class="game" v-else>
      <div class="stats">
        <p>Moves: {{ moves }}</p>
        <p>Matches: {{ matchedPairs }}</p>
        <p>Time: {{ timer }}s</p>
        <button @click="restartGame">Restart</button>
        <button @click="goBackToMenu">Back to Menu</button>
      </div>
      <div class="grid" :style="gridStyle">
        <div
          class="card"
          v-for="(card, index) in cards"
          :key="index"
          :class="{ flipped: card.flipped || card.matched }"
          @click="flipCard(index)"
        >
          <div
            class="front"
            v-if="card.flipped || card.matched"
            :style="{ backgroundImage: `url(/${card.image})` }"
          ></div>
          <div class="back"></div>
        </div>
      </div>
    </div>

    <!-- نمایش زیرنویس صوتی -->
    <div class="subtitle">{{ subtitle }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMenu: true,
      selectedLevel: null,
      cards: [],
      flippedCards: [],
      moves: 0,
      matchedPairs: 0,
      timer: 0, // زمان بازی
      timerInterval: null, // مرجع تایمر
      subtitle: "", // متن زیرنویس صوتی
      recognition: null, // برای مدیریت Web Speech API
    };
  },
  computed: {
    gridStyle() {
      const gridSizes = {
        easy: { rows: 2, cols: 3 },
        medium: { rows: 3, cols: 4 },
        hard: { rows: 4, cols: 6 },
      };
      const { rows, cols } = gridSizes[this.selectedLevel] || {};
      return {
        gridTemplateColumns: `repeat(${cols}, 3cm)`,
        gridTemplateRows: `repeat(${rows}, 3cm)`,
        gap: "0.5cm",
      };
    },
  },
  methods: {
    startVoiceRecognition() {
      if (!('webkitSpeechRecognition' in window)) {
        alert("Voice recognition is not supported in your browser.");
        return;
      }

      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.subtitle = "Listening for commands...";
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        this.subtitle = `You said: "${transcript}"`;

        if (transcript.includes("easy")) {
          this.startGame("easy");
        } else if (transcript.includes("medium")) {
          this.startGame("medium");
        } else if (transcript.includes("hard")) {
          this.startGame("hard");
        } else if (transcript.includes("restart")) {
          this.restartGame();
        } else if (transcript.includes("back to menu")) {
          this.goBackToMenu();
        } else if (transcript.includes("back home")) {
          this.goBackToHome();
        } else if (transcript.includes("select number")) {
          const number = transcript.match(/\d+/);
          if (number) {
            this.selectCardByVoice(parseInt(number[0], 10));
          }
        } else {
          this.subtitle = "Command not recognized.";
        }
      };

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event);
        this.subtitle = "Error occurred in voice recognition.";
      };

      this.recognition.start();
    },
    
    startGame(level) {
      this.selectedLevel = level;
      this.setupGame();
      this.startTimer();
      this.showMenu = false;
      this.subtitle = `${level.toUpperCase()} mode selected!`;
    },
    
    setupGame() {
      const levelCardCount = {
        easy: 6,
        medium: 12,
        hard: 24,
      };

      const cardCount = levelCardCount[this.selectedLevel];
      const images = Array.from({ length: cardCount / 2 }, (_, i) => `${i + 1}.png`);
      const allImages = [...images, ...images].sort(() => Math.random() - 0.5);

      this.cards = allImages.map((image) => ({
        image,
        flipped: false,
        matched: false,
      }));

      this.flippedCards = [];
      this.moves = 0;
      this.matchedPairs = 0;
      this.timer = 0;
    },
    
    selectCardByVoice(number) {
      const cardIndex = parseInt(number, 10) - 1;
      if (cardIndex >= 0 && cardIndex < this.cards.length) {
        this.flipCard(cardIndex);
      } else {
        this.subtitle = "Invalid card number!";
      }
    },
    
    flipCard(index) {
      const card = this.cards[index];

      if (card.flipped || card.matched || this.flippedCards.length === 2) {
        return;
      }

      card.flipped = true;
      this.flippedCards.push(index);

      if (this.flippedCards.length === 2) {
        this.moves++;
        const [firstIndex, secondIndex] = this.flippedCards;
        const firstCard = this.cards[firstIndex];
        const secondCard = this.cards[secondIndex];

        if (firstCard.image === secondCard.image) {
          firstCard.matched = true;
          secondCard.matched = true;
          this.matchedPairs++;
          this.flippedCards = [];

          if (this.matchedPairs === this.cards.length / 2) {
            clearInterval(this.timerInterval);
            alert(`Congratulations! You completed the game in ${this.timer} seconds.`);
          }
        } else {
          setTimeout(() => {
            firstCard.flipped = false;
            secondCard.flipped = false;
            this.flippedCards = [];
          }, 1000);
        }
      }
    },
    
    restartGame() {
      this.setupGame();
      this.startTimer();
    },
    
    goBackToMenu() {
      clearInterval(this.timerInterval);
      this.showMenu = true;
      this.selectedLevel = null;
      this.cards = [];
      this.flippedCards = [];
      this.moves = 0;
      this.matchedPairs = 0;
      this.timer = 0;
    },
    
    goBackToHome() {
      this.$router.push("/Home");
    },
    
    startTimer() {
      clearInterval(this.timerInterval);
      this.timer = 0;
      this.timerInterval = setInterval(() => {
        this.timer++;
      }, 1000);
    },
  },
  mounted() {
    setTimeout(() => {
      this.startVoiceRecognition();
    }, 2000);
  },
  beforeUnmount() {
    if (this.recognition) {
      this.recognition.stop();
    }
  },
};
</script>


<style>
.memory-match {
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: black;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.menu h1 {
  font-size: 2.5rem;
}

.menu button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: orange;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.menu button.back-home-button {
  background-color: blue;
  color: white;
  margin-top: 20px;
}

.menu button:hover {
  background-color: darkorange;
}

.game .stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  max-width: 600px;
  margin: 10px 0;
  flex-wrap: wrap;
}

.game .stats button {
  margin: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #333;
  color: white;
  border: 1px solid orange;
  border-radius: 5px;
  cursor: pointer;
}

.game .stats button:hover {
  background-color: darkorange;
}

.grid {
  display: grid;
  justify-content: center;
  align-items: center;
  margin: auto;
}

.card {
  position: relative;
  width: 3cm;
  height: 3cm;
  cursor: pointer;
  perspective: 1000px;
}

.card .front,
.card .back {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
  border-radius: 8px;
}

.card .front {
  background-size: cover;
  background-position: center;
  transform: rotateY(180deg);
}

.card .back {
  background-color: orange;
  border: 1px solid #ccc;
}

.card.flipped .front {
  transform: rotateY(0);
}

.card.flipped .back {
  transform: rotateY(180deg);
}

.subtitle {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 1.2rem;
  color: #00ff00;
}
</style>

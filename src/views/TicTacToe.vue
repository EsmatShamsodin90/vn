<template>
    <div class="tic-tac-toe">
      <div class="game-container">
        <div class="board-section">
          <h2>Tic Tac Toe</h2>
          <h3 v-if="winner">Winner: {{ winner }}</h3>
          <h3 v-else-if="isDraw">It's a draw!</h3>
          <h3 v-else>Next Player: {{ isXNext ? 'You (X)' : 'Computer (O)' }}</h3>
          <div class="board">
            <button
              v-for="(square, index) in board"
              :key="index"
              class="square"
              :disabled="true"
            >
              {{ square }}
            </button>
          </div>
        </div>
  
        <!-- Chat Section -->
        <div class="chat-section">
          <h3>Game Instructions</h3>
          <ul>
            <li>Say "Top Left" to play the top left cell.</li>
            <li>Say "Top Center" to play the top center cell.</li>
            <li>Say "Top Right" to play the top right cell.</li>
            <li>Say "Middle Left" to play the middle left cell.</li>
            <li>Say "Middle Center" to play the middle center cell.</li>
            <li>Say "Middle Right" to play the middle right cell.</li>
            <li>Say "Bottom Left" to play the bottom left cell.</li>
            <li>Say "Bottom Center" to play the bottom center cell.</li>
            <li>Say "Bottom Right" to play the bottom right cell.</li>
          </ul>
          <h3>Conversation</h3>
          <ul class="chat-list">
            <li v-for="(message, index) in chatTranscript" :key="index">
              {{ message }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import annyang from "annyang";
  
  export default {
    data() {
      return {
        board: Array(9).fill(null),
        isXNext: true, // بازیکن همیشه X است
        chatTranscript: [], // ذخیره متن مکالمات
        isAskingToReplay: false, // آیا سیستم از کاربر می‌پرسد که دوباره بازی کند؟
      };
    },
    computed: {
      winner() {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let line of lines) {
          const [a, b, c] = line;
          if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
            return this.board[a];
          }
        }
        return null;
      },
      isDraw() {
        return !this.winner && this.board.every((square) => square !== null);
      },
    },
    mounted() {
      this.initAnnyang();
      this.speakAndLog("Welcome to Tic Tac Toe. You are X. Say a position to play, like 'Top Left'.");
    },
    methods: {
      initAnnyang() {
        if (annyang) {
          const commands = {
            "top left": () => this.handlePlayerMove(0),
            "top center": () => this.handlePlayerMove(1),
            "top right": () => this.handlePlayerMove(2),
            "middle left": () => this.handlePlayerMove(3),
            "middle center": () => this.handlePlayerMove(4),
            "middle right": () => this.handlePlayerMove(5),
            "bottom left": () => this.handlePlayerMove(6),
            "bottom center": () => this.handlePlayerMove(7),
            "bottom right": () => this.handlePlayerMove(8),
            yes: () => this.handleReplayResponse("yes"),
            no: () => this.handleReplayResponse("no"),
          };
  
          annyang.addCommands(commands);
          annyang.start({ autoRestart: true, continuous: true });
        } else {
          this.speakAndLog("Speech recognition is not supported in your browser.");
        }
      },
      speakAndLog(text) {
        this.chatTranscript.push("Computer: " + text);
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "en-US";
          window.speechSynthesis.speak(utterance);
        }
      },
      handlePlayerMove(index) {
        if (!this.isXNext || this.board[index] || this.winner || this.isDraw) {
          this.speakAndLog("Invalid move. Please try again.");
          return;
        }
  
        // حرکت بازیکن
        this.board[index] = "X";
        this.chatTranscript.push("Player: X played " + this.getPositionName(index));
        this.isXNext = false;
  
        if (this.winner || this.isDraw) {
          this.endGame();
          return;
        }
  
        // حرکت کامپیوتر
        setTimeout(() => {
          this.computerMove();
        }, 500);
      },
      computerMove() {
        if (this.winner || this.isDraw) return;
  
        // پیدا کردن خانه‌های خالی
        const emptyIndices = this.board
          .map((square, index) => (square === null ? index : null))
          .filter((index) => index !== null);
  
        if (emptyIndices.length > 0) {
          const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          this.board[randomIndex] = "O";
          this.chatTranscript.push("Computer: O played " + this.getPositionName(randomIndex));
          this.speakAndLog(`Computer chose ${this.getPositionName(randomIndex)}.`);
        }
  
        this.isXNext = true;
  
        if (this.winner || this.isDraw) {
          this.endGame();
        } else {
          this.speakAndLog("Your turn. Say a position to play.");
        }
      },
      endGame() {
        if (this.winner) {
          this.speakAndLog(this.winner === "X" ? "You win!" : "Computer wins!");
        } else if (this.isDraw) {
          this.speakAndLog("It's a draw!");
        }
        this.speakAndLog("Would you like to play again? Say 'Yes' or 'No'.");
        this.isAskingToReplay = true;
      },
      handleReplayResponse(response) {
        if (!this.isAskingToReplay) return;
  
        if (response === "yes") {
          this.resetGame();
        } else if (response === "no") {
          this.speakAndLog("Returning to the main menu.");
          this.$router.push("/");
        }
      },
      getPositionName(index) {
        const positions = [
          "Top Left",
          "Top Center",
          "Top Right",
          "Middle Left",
          "Middle Center",
          "Middle Right",
          "Bottom Left",
          "Bottom Center",
          "Bottom Right",
        ];
        return positions[index];
      },
      resetGame() {
        this.board = Array(9).fill(null);
        this.isXNext = true;
        this.chatTranscript = [];
        this.isAskingToReplay = false;
        this.speakAndLog("Game reset. You are X. Say a position to play, like 'Top Left'.");
      },
    },
  };
  </script>
  
  
  
  <style>
  .tic-tac-toe {
    font-family: Arial, sans-serif;
  }
  
  .game-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
  }
  
  .board-section {
    text-align: center;
  }
  
  .board {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    grid-gap: 5px;
    justify-content: center;
  }
  
  .square {
    width: 100px;
    height: 100px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    line-height: 100px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
  }
  
  .chat-section {
    width: 300px;
    background-color: #222;
    color: white;
    padding: 10px;
    border-radius: 5px;
  }
  
  .chat-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .chat-list li {
    margin-bottom: 5px;
    padding: 5px;
    border-bottom: 1px solid #444;
  }
  </style>
  
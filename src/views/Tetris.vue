<template>
    <div class="tetris-container">
      <!-- استفاده از iframe برای بارگذاری بازی -->
      <iframe
        src="/tetris3d/index.html"
        width="100%"
        height="100%"
        frameborder="0"
      ></iframe>
    </div>
  </template>
  
  <script>
  export default {
    name: "Tetris",
  };
  </script>
  
  <style scoped>
  .tetris-container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
  }
  </style>
  
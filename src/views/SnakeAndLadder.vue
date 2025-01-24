<template>
    <div class="snake-and-ladder-container">
      <!-- بارگذاری بازی در iframe -->
      <iframe
        src="/snake-and-ladder/index.html"
        width="100%"
        height="100%"
        frameborder="0"
      ></iframe>
      
    </div>
  </template>
  
  <script>
  
  export default {
    name: "SnakeAndLadder",
  };
  </script>
  
  <style scoped>
  .snake-and-ladder-container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
  }
  </style>
  
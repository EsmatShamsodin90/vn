import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage.vue';
import Home from '../views/Home.vue';
import Deutsch from '../views/Deutsch.vue';
import Puzzle from '../views/Puzzle.vue';
import Tetris from '../views/Tetris.vue';
import SnakeAndLadder from '../views/SnakeAndLadder.vue';
import TicTacToe from '../views/TicTacToe.vue';
const routes = [
  { path: '/', component: LandingPage },
  { path: '/home', component: Home },
  { path: '/deutsch', component: Deutsch },
  { path: '/puzzle', component: Puzzle},
  { path: '/Tetris', component: Tetris},
  { path: '/SnakeAndLadder', component: SnakeAndLadder},
  { path: '/TicTacToe', component: TicTacToe},
  ];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

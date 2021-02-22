import Scene from "./widgets/scene";
import Game from "./game";
import { moveToLeft, moveToRight, rotate, quickDown } from "./operates/arrow";
import TetrisType from "./widgets/tetrises/index";

const canvas = document.querySelector("#scene") as HTMLCanvasElement;
const scene : Scene = new Scene(canvas, "2d", {row: 25, column: 15, unit: 20});
scene.initialize();

const game : Game = new Game(scene, Object.keys(TetrisType), [moveToLeft, moveToRight, rotate, quickDown]);
game.start();

// import TetrisFactory from "./factory/tetris";
// const t = TetrisFactory.create("TTetris");
// console.log(t);
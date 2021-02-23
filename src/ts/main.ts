import Scene from "./widgets/scene";
import Game from "./game";
import { moveToLeft, moveToRight, rotate, quickDown, normalDown } from "./operates/arrow";

const canvas = document.querySelector("#scene") as HTMLCanvasElement;
const scene : Scene = new Scene(canvas, "2d", {row: 24, column: 14, unit: 20});
scene.initialize();

const game : Game = new Game(scene, [moveToLeft, moveToRight, rotate, quickDown], [normalDown]);
game.start();
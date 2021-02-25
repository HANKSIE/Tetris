import Scene from "./widgets/scene";
import Game from "./game";

const canvas = document.querySelector("#scene") as HTMLCanvasElement;
const scene : Scene = new Scene(canvas, "2d", {row: 24, column: 14, unit: 20});
scene.initialize();

const game : Game = new Game(scene);
game.start();
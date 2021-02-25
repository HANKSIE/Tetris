import Scene from "./widgets/scene";
import Game from "./game";

const canvas = document.querySelector("#scene") as HTMLCanvasElement;
const one = document.querySelector("#one") as HTMLCanvasElement;
const two = document.querySelector("#two") as HTMLCanvasElement;
const three = document.querySelector("#three") as HTMLCanvasElement;
const hold = document.querySelector("#hold") as HTMLCanvasElement;

const start = document.querySelector("#start") as HTMLCanvasElement;
const stop = document.querySelector("#stop") as HTMLCanvasElement;
const reset = document.querySelector("#reset") as HTMLCanvasElement;

const scene : Scene = new Scene(canvas, {row: 24, column: 14, unit: 20}, [one, two, three], hold);

let game : Game = new Game(scene);

start.addEventListener("click", ()=>{game.start()});
stop.addEventListener("click", ()=>{game.stop()});
reset.addEventListener("click", ()=>{
    game.stop();
    scene.clearAllCanvases();
    scene.drawGrid();
    game = new Game(scene);
});
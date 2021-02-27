import GameWindowFactory from "./factory/gameWindow";
import { MainWindow, HoldWindow, PrepareWindow } from "./game/concrete/gameWindow";
import Game from "./game/game";

// 禁止特定按鍵觸發頁面滾動
window.addEventListener("keydown", (event: KeyboardEvent) => {

    const disableKey = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
    if(disableKey.includes(event.key)){
        event.preventDefault();
    }
    
});

const canvas = document.querySelector("#gameWindow") as HTMLCanvasElement;
const prepareCanvas = document.querySelectorAll("#next-area > .canvas-wrapper > canvas");

const hold = document.querySelector("#hold") as HTMLCanvasElement;

const start = document.querySelector("#start") as HTMLCanvasElement;
const stop = document.querySelector("#stop") as HTMLCanvasElement;
const reset = document.querySelector("#reset") as HTMLCanvasElement;

const unit = 20;
const unit2 = 13;
const gameWindow : MainWindow =  GameWindowFactory.create(MainWindow.name, canvas, 14, 24, unit) as MainWindow;

const prepareWindows: PrepareWindow[] = [];

prepareCanvas.forEach(c => {
    c.setAttribute("height", (unit2 * 4).toString());
    c.setAttribute("height", (unit2 * 4).toString());
    prepareWindows.push(GameWindowFactory.create(PrepareWindow.name, c, unit2) as PrepareWindow);
});

hold.setAttribute("height", (unit2 * 4).toString());
hold.setAttribute("height", (unit2 * 4).toString());

const holdWindow : HoldWindow = GameWindowFactory.create(HoldWindow.name, hold, unit2) as HoldWindow; 


gameWindow.initialize();

const game : Game = new Game(gameWindow, prepareWindows, holdWindow);

start.addEventListener("click", ()=>{
    game.start();
    start.style.color = "white";
    stop.style.color = "#888888";
    reset.style.color = "#888888";
});
stop.addEventListener("click", ()=>{
    game.stop();
    stop.style.color = "white";
    start.style.color = "#888888";
    reset.style.color = "#888888";
});
reset.addEventListener("click", (event)=>{
    game.stop();
    game.initialize();
    reset.style.color = "white";
    start.style.color = "#888888";
    stop.style.color = "#888888";
});


window.addEventListener("keydown", event => {
    if(event.key === "p") {
        stop.click() ;
    }

    if(event.key === "Enter") {
        start.click()
    }

    if(event.key === "r") {
       reset.click();
    }
});
import GameWindowFactory from "./factory/gameWindow";
import { MainWindow, HoldWindow, PrepareWindow } from "./game/concrete/gameWindow";
import Game from "./game/game";

const canvas = document.querySelector("#scene") as HTMLCanvasElement;
const one = document.querySelector("#one") as HTMLCanvasElement;
const two = document.querySelector("#two") as HTMLCanvasElement;
const three = document.querySelector("#three") as HTMLCanvasElement;
const hold = document.querySelector("#hold") as HTMLCanvasElement;

const start = document.querySelector("#start") as HTMLCanvasElement;
const stop = document.querySelector("#stop") as HTMLCanvasElement;
const reset = document.querySelector("#reset") as HTMLCanvasElement;

const unit = 20;
const mainWindow : MainWindow =  GameWindowFactory.create(MainWindow.name, canvas, 14, 24, unit) as MainWindow;
const oneWindow : PrepareWindow = GameWindowFactory.create(PrepareWindow.name, one, unit) as PrepareWindow; 
const twoWindow : PrepareWindow = GameWindowFactory.create(PrepareWindow.name, two, unit) as PrepareWindow; 
const threeWindow : PrepareWindow = GameWindowFactory.create(PrepareWindow.name, three, unit) as PrepareWindow; 
const holdWindow : HoldWindow = GameWindowFactory.create(HoldWindow.name, hold, unit) as HoldWindow; 

mainWindow.initialize();

const game : Game = new Game(mainWindow, [oneWindow, twoWindow, threeWindow], holdWindow);

start.addEventListener("click", ()=>{game.start()});
stop.addEventListener("click", ()=>{game.stop()});
reset.addEventListener("click", (event)=>{
    game.stop();
    mainWindow.clear();
    oneWindow.clear();
    twoWindow.clear();
    threeWindow.clear();
    holdWindow.clear();
    mainWindow.renderGrid();
    game.initialize();
    game.start();
    const resetBtn : HTMLButtonElement = event.target as HTMLButtonElement;
    resetBtn.blur(); //若不移除focus按空白鍵會一直觸發
});
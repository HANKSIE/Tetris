import Tetris from "../widgets/tetris";
import Timer from "../util/timer";
import  KeyboardOperate  from "./keyboardOperate";
import TetrisFactory from "../factory/tetris";
import Cube from "../widgets/cube";
import CubeEliminator from "./cubeEliminator";
import GameWindow from "./gameWindow";

export default class Game {

    private _mainWindow : GameWindow;
    private _prepareWindow : GameWindow[];
    private _holdWindow : GameWindow;

    private _downTimer : Timer;
    private _drawTimer : Timer;

    private _downInterval : number = 450;
    private _drawInterval = 50;

    private _currTetris : Tetris;
    private _tetrises : Tetris[] = [];
    private _prepareTetrises : Tetris[] = [];
    private _holdTetris : Tetris | null = null;

    private _softDown = false;
    private _speedIncrease = 400;
    private _isDown = false;
    private _canHold = true; 

    private _start = false;

    private moveLeft : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowLeft"){
            this._currTetris.left();
        }
    }
    
    private moveRight : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowRight"){
            this._currTetris.right();
        }
    }
    
    private rotate : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowUp"){
            this._currTetris.rotate();
        }
    }

    private hold: KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "c" && this._canHold){
            this._canHold = false;
            if(this._holdTetris){
                const tempCurr = this._currTetris;
                this._currTetris = this._holdTetris;
                this._currTetris.posInitialize();
                this._holdTetris = tempCurr;
                this._tetrises = this._tetrises.filter(tetris => tetris !== this._holdTetris);
                this._tetrises.push(this._currTetris);
            }else{
                this._holdTetris = this._currTetris;
                this.updateCurrAndPrepare();
                this._tetrises = this._tetrises.filter(tetris => tetris !== this._holdTetris);
                this._currTetris.posInitialize();
                this._holdTetris.posInitialize();
            }

            this._holdWindow.render([this._holdTetris]);
        }
    }
    
    private softDrop : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowDown"){
            if(!this._softDown){
                this._downTimer.ms = this._downTimer.ms - this._speedIncrease;
                this._softDown = true;
            }
        }
    }
    
    private restoreSoftDrop: KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowDown"){
            if(this._softDown){
                this._downTimer.ms = this._downTimer.ms + this._speedIncrease;
                this._softDown = false;
            }
        }
    }
    
    private hardDrop : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === " "){
            this._downTimer.ms = 0;
        }
    }

    private down() {
        this._currTetris.down();
        this._isDown = true;
    }

    constructor(mainWindow: GameWindow, prepareWindow: GameWindow[], holdWindow: GameWindow){
        this._mainWindow = mainWindow;
        this._prepareWindow = prepareWindow;
        this._holdWindow = holdWindow;

        this._currTetris = TetrisFactory.createRandom(this._mainWindow.width);
        this._tetrises.push(this._currTetris);

        this._downTimer = new Timer(() => {
            this.update();
        }, this._downInterval);

        this._drawTimer = new Timer(() => {;
            this._mainWindow.render(this._tetrises);
        }, this._drawInterval);
        
        this.registerKeyBoardEvent();
    }

    private registerKeyBoardEvent(){

        document.addEventListener("keydown", (event : KeyboardEvent) => {
            
            if(this._start){
                this.moveLeft(event);
                this.moveRight(event);
                this.rotate(event);
                this.softDrop(event);
                this.hardDrop(event);
                this.hold(event);
            }
          
            this.nextHandle();
        });

        document.addEventListener("keyup", (event : KeyboardEvent) => {
            this.restoreSoftDrop(event);
            this.nextHandle();
        });
    }

    private update(){
        this.down();
        this.nextHandle();
        this._isDown = false;
    }

    private nextHandle(){

        const nextCubes = this._currTetris.nextCubes;
       
        if(!this.isCollisionTetris(nextCubes, true) && !this.isCollisionBoundary(nextCubes)){
            this._currTetris.update();
            return;
        }

        //collision
        if(this._isDown){

            //消除方塊
            this.clearCubes();
            //產生新方塊
            this.updateCurrAndPrepare();

            this._softDown = false;
            this._canHold = true;

            //剛產生就發生碰撞
            if(this.isCollisionTetris(this._currTetris.cubes, true)){
                this.stop();
                alert("gameover");
                return;
            }else {
                this._downTimer.ms = this._downInterval;
            }

        }

        this._currTetris.back();

    }

    private isCollisionTetris(nextCubes : Cube[], containCurr : boolean = false) : boolean {

        for(let i = 0; i < this._tetrises.length; i++){
            const currTetris = this._tetrises[i];
            if(currTetris !== this._currTetris && containCurr){
                for(let j = 0; j < nextCubes.length; j++){
                    if (currTetris.findCubeByPos(nextCubes[j].pos)){
                        return true;
                    }
                }  
            }
        }

        return false
    }

    private isCollisionBoundary(nextCubes : Cube[]) : boolean {

        for(let i = 0; i < nextCubes.length; i++){
            const { x, y } = nextCubes[i].pos;
            if(x < 0 || x >= this._mainWindow.width || y < 0 || y >= this._mainWindow.height){
                return true;
            }
        }

        return false;

    }

    public start(){
        this._downTimer.start();
        this._drawTimer.start();
        
        if(this._prepareTetrises.length === 0){
            for(let i=0; i < this._prepareWindow.length; i++){
                this._prepareTetrises.push(TetrisFactory.createRandom(this._mainWindow.width));
            }

            this._prepareWindow.forEach((w, i) => {
                w.render([this._prepareTetrises[i]]);
            });
        }
      
        this._start = true;
    }

    public stop(){
        this._downTimer.stop();
        this._drawTimer.stop();
        this._start = false;
    }

    private clearCubes(){
        this._downTimer.stop();
        const clearY =  CubeEliminator.clear(this._mainWindow.width, this._mainWindow.height, this._tetrises);
        this.downCubes(clearY);
        this._downTimer.start();
    }

    private updateCurrAndPrepare(){
        this._currTetris = this._prepareTetrises.shift() as Tetris;
        this._tetrises.push(this._currTetris);
        this._prepareTetrises.push(TetrisFactory.createRandom(this._mainWindow.width));

        this._prepareWindow.forEach((w, i) => {
            w.render([this._prepareTetrises[i]]);
        });
        
    }

    private downCubes(clearY : number[]) {
        this._tetrises.forEach(tetris => {
            tetris.cubes.forEach(cube => {
                //下降量
                const down = clearY.filter(y => y > cube.pos.y).length;
                cube.pos = cube.pos.plusY(down);
            });
        });
    }

}
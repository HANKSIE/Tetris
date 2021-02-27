import Tetris from "../widgets/tetris";
import Timer from "../util/timer";
import  KeyboardOperate  from "./keyboardOperate";
import TetrisFactory from "../factory/tetris";
import Cube from "../widgets/cube";
import CubeEliminator from "./cubeEliminator";
import GameWindow from "./gameWindow";
import { GameContext, createGameContext } from "./gameContext";

export default class Game {

    private _mainWindow : GameWindow;
    private _prepareWindow : GameWindow[];
    private _holdWindow : GameWindow;

    private _downTimer : Timer;
    private _renderTimer : Timer;

    private readonly _downInterval : number = 450;
    private readonly _renderInterval : number = 50;
    private readonly _speedIncrease : number = 400;

    private _context: GameContext;

    private moveLeft : KeyboardOperate = (event: KeyboardEvent) => {
        if(!this._context.start){
            return;    
        }

        if(event.key === "ArrowLeft"){
            this._context.currTetris.left();
        }
    }
    
    private moveRight : KeyboardOperate = (event: KeyboardEvent) => {
        if(!this._context.start){
            return;    
        }

        if(event.key === "ArrowRight"){
            this._context.currTetris.right();
        }
    }
    
    private rotate : KeyboardOperate = (event: KeyboardEvent) => {
        if(!this._context.start){
            return;    
        }

        if(event.key === "ArrowUp"){
            this._context.currTetris.rotate();
        }
    }

    private hold: KeyboardOperate = (event: KeyboardEvent) => {
        if(!this._context.start){
            return;    
        }

        if(event.key === "c" && this._context.canHold){
            this._context.canHold = false;
            if(this._context.holdTetris){
                const tempCurr = this._context.currTetris;
                this._context.currTetris = this._context.holdTetris;
                this._context.currTetris.posInitialize();
                this._context.holdTetris = tempCurr;
                this._context.tetrises = this._context.tetrises.filter(tetris => tetris !== this._context.holdTetris);
                this._context.tetrises.push(this._context.currTetris);
            }else{
                this._context.holdTetris = this._context.currTetris;
                this.updateCurrAndPrepare();
                this._context.tetrises = this._context.tetrises.filter(tetris => tetris !== this._context.holdTetris);
                this._context.currTetris.posInitialize();
                this._context.holdTetris.posInitialize();
            }

            this._holdWindow.render([this._context.holdTetris]);
        }
    }
    
    private softDrop : KeyboardOperate = (event: KeyboardEvent) => {
        if(!this._context.start){
            return;    
        }

        if(event.key === "ArrowDown"){
            if(!this._context.softDown){
                this._downTimer.ms = this._downTimer.ms - this._speedIncrease;
                this._context.softDown = true;
            }
        }
    }
    
    private restoreSoftDrop: KeyboardOperate = (event: KeyboardEvent) => {
        if(!this._context.start){
            return;    
        }

        if(event.key === "ArrowDown"){
            if(this._context.softDown){
                this._downTimer.ms = this._downTimer.ms + this._speedIncrease;
                this._context.softDown = false;
            }
        }
    }
    
    private hardDrop : KeyboardOperate = (event: KeyboardEvent) => {
        if(!this._context.start){
            return;    
        }

        if(event.key === " "){
            this.stop();
            
            while(!this._context.bottom){
                this.update();
            }

            this._context.bottom = false;
            this.start();
        }
    }

    private down() {
        this._context.currTetris.down();
        this._context.isDown = true;
    }

    constructor(mainWindow: GameWindow, prepareWindow: GameWindow[], holdWindow: GameWindow){
        this._mainWindow = mainWindow;
        this._prepareWindow = prepareWindow;
        this._holdWindow = holdWindow;

        this._context = createGameContext(TetrisFactory.createRandom(this._mainWindow.width));

        this._context.tetrises.push(this._context.currTetris);
        this.initPrepareTetrises();
        
        this._downTimer = new Timer(() => {
            this.update();
        }, this._downInterval);

        this._renderTimer = new Timer(() => {;
            this._mainWindow.render(this._context.tetrises);
        }, this._renderInterval);
        
       
        this.registerKeyBoardEvent();
    }

    private registerKeyBoardEvent(){

        document.addEventListener("keydown", (event : KeyboardEvent) => {
            
            this.moveLeft(event);
            this.moveRight(event);
            this.rotate(event);
            this.softDrop(event);
            this.hardDrop(event);
            this.hold(event);
          
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
        this._context.isDown = false;
    }

    private nextHandle(){
        const nextCubes = this._context.currTetris.nextCubes;
       
        if(!this.isCollisionTetris(nextCubes, true) && !this.isCollisionBoundary(nextCubes)){
            this._context.currTetris.update();
            return;
        }

        //collision
        if(this._context.isDown){
            this._context.bottom = true;
            //消除方塊
            this.clearCubes();
            //產生新方塊
            this.updateCurrAndPrepare();

            this._context.softDown = false;
            this._context.canHold = true;

            //剛產生就發生碰撞
            if(this.isCollisionTetris(this._context.currTetris.cubes, true)){

                this._renderTimer.stop();
                this._context.currTetris.up();
                this._context.currTetris.upToTopOriginCubeBias();
                this._context.currTetris.update();
                this._mainWindow.renderTetris(this._context.tetrises);
               

                //再檢查一次
                if(this.isCollisionTetris(this._context.currTetris.cubes, true)){
                    this._mainWindow.renderTetris(this._context.tetrises);
                    this.stop();
                    // alert("gameover");
                    return;
                }
            }

            this._downTimer.ms = this._downInterval;
        }

        this._context.currTetris.back();

    }

    private isCollisionTetris(nextCubes : Cube[], containCurr : boolean = false) : boolean {

        for(let i = 0; i < this._context.tetrises.length; i++){
            const currTetris = this._context.tetrises[i];
            if(currTetris !== this._context.currTetris && containCurr){
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
            if(x < 0 || x >= this._mainWindow.width || y < -1 || y >= this._mainWindow.height){
                return true;
            }
        }

        return false;

    }

    public start(){
        this._downTimer.start();
        this._renderTimer.start();
        this._context.start = true;
        this.renderPrepareWindow();
    }

    public stop(){
        this._downTimer.stop();
        this._renderTimer.stop();
        this._context.start = false;
    }

    private clearCubes(){
        this._downTimer.stop();
        const clearY =  CubeEliminator.clear(this._mainWindow.width, this._mainWindow.height, this._context.tetrises);
        this.downCubes(clearY);
        this._downTimer.start();
    }

    private updateCurrAndPrepare(){
        this._context.currTetris = this._context.prepareTetrises.shift() as Tetris;
        this._context.tetrises.push(this._context.currTetris);
        this._context.prepareTetrises.push(TetrisFactory.createRandom(this._mainWindow.width));
        this.renderPrepareWindow();
    }

    private downCubes(clearY : number[]) {
        this._context.tetrises.forEach(tetris => {
            tetris.cubes.forEach(cube => {
                //下降量
                const down = clearY.filter(y => y > cube.pos.y).length;
                cube.pos = cube.pos.plusY(down);
            });
        });
    }

    public initialize() {
        this._context = createGameContext(TetrisFactory.createRandom(this._mainWindow.width));
        this._context.tetrises.push(this._context.currTetris);

        this.initPrepareTetrises();
        this.windowInit();
    }

    private windowInit(){
        this._mainWindow.clear();
        this._mainWindow.renderGrid();
        this._prepareWindow.forEach(w => w.clear());
        this._holdWindow.clear();
    }

    private initPrepareTetrises() {
        for(let i=0; i < this._prepareWindow.length; i++){
            this._context.prepareTetrises.push(TetrisFactory.createRandom(this._mainWindow.width));
        }
    }

    private renderPrepareWindow() {
        this._prepareWindow.forEach((w, i) => {
            w.render([this._context.prepareTetrises[i]]);
        });
    }

}
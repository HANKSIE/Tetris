import Tetris, { ShapeValue } from "../widgets/tetris";
import Timer from "../util/timer";
import KeyboardOperate  from "./keyboardOperate";
import TetrisFactory from "../factory/tetris";
import CubeEliminator from "./cubeEliminator";
import GameWindow from "./gameWindow";
import GameContext from "./gameContext";
import Collision, { BoundaryType } from "./collision";

export default class Game {

    private _mainWindow : GameWindow;
    private _prepareWindow : GameWindow[];
    private _holdWindow : GameWindow;

    private _downTimer : Timer;
    private _renderTimer : Timer;

    private _collision : Collision;

    private readonly _downInterval : number = 450;
    private readonly _renderInterval : number = 50;
    private readonly _speedIncrease : number = 400;

    private _context: GameContext;

    private moveLeft : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowLeft"){
            this._context.currTetris.left();
        }
    }
    
    private moveRight : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowRight"){
            this._context.currTetris.right();
        }
    }
    
    private rotate : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowUp"){
            this._context.currTetris.rotate();
        }
    }

    private hold: KeyboardOperate = (event: KeyboardEvent) => {
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
        if(event.key === "ArrowDown"){
            if(!this._context.softDown){
                this._downTimer.ms = this._downTimer.ms - this._speedIncrease;
                this._context.softDown = true;
            }
        }
    }
    
    private restoreSoftDrop: KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowDown"){
            if(this._context.softDown){
                this._downTimer.ms = this._downTimer.ms + this._speedIncrease;
                this._context.softDown = false;
            }
        }
    }
    
    private hardDrop : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === " "){
            this.stop();
            
            while(!this._context.bottom){
                this.update();
            }

            this._context.bottom = false;
            this.start();
        }
    }

    private userKeyDownBehavior = (event : KeyboardEvent) => {
        this.moveLeft(event);
        this.moveRight(event);
        this.rotate(event);
        this.softDrop(event);
        this.hardDrop(event);
        this.hold(event);
      
        this.nextHandle();
    }

    private userKeyUpBehavior = (event : KeyboardEvent) => {
        this.restoreSoftDrop(event);
        this.nextHandle();
    }

    private currTetrisDown() {
        this._context.currTetris.down();
        this._context.isDown = true;
    }

    constructor(mainWindow: GameWindow, prepareWindow: GameWindow[], holdWindow: GameWindow){
        this._mainWindow = mainWindow;
        this._prepareWindow = prepareWindow;
        this._holdWindow = holdWindow;

        this._context = this.createGameContext(TetrisFactory.createRandom(this._mainWindow.width));

        this._context.tetrises.push(this._context.currTetris);
        this.initPrepareTetrises();
        
        this._downTimer = new Timer(() => {
            this.update();
        }, this._downInterval);

        this._renderTimer = new Timer(() => {;
            this._mainWindow.render(this._context.tetrises);
        }, this._renderInterval);

        this._collision = new Collision(
            {
                top: 0, 
                bottom: mainWindow.height - 1, 
                left: 0, 
                right: mainWindow.width - 1
            },
            [
                BoundaryType.Top
            ]
        );
        
    }

    private registerUserBehavior(){
        document.addEventListener("keydown", this.userKeyDownBehavior);
        document.addEventListener("keyup", this.userKeyUpBehavior);
    }

    private removeUserBehavior(){
        document.removeEventListener("keydown", this.userKeyDownBehavior);
        document.removeEventListener("keyup", this.userKeyUpBehavior);
    }

    private update(){
        this.currTetrisDown();
        this.nextHandle();
        this._context.isDown = false;
    }

    private nextHandle(){
        if(!this._collision.isCollisionTetris(this._context.currTetris, this._context.tetrises) && !this._collision.isCollisionBoundary(this._context.currTetris)){
            this._context.currTetris.update();
            return;
        }

        //collision
        if(this._context.isDown){

            //發生碰撞且tetris的cubes的y都小於0
            if(this._context.currTetris.cubes.filter(cube => cube.pos.y >= 0).length === 0){
                //gameover
                this.stop();
                this._mainWindow.renderTetris(this._context.tetrises);
                alert("gameover");
                this._context.gameover = true;
                return;
            }

            this._context.bottom = true;
            //消除方塊
            this.clearCubes();
            //產生新方塊
            this.updateCurrAndPrepare();

            this._context.softDown = false;
            this._context.canHold = true;

            //剛產生就發生碰撞
            if(this._collision.isCollisionTetris(this._context.currTetris, this._context.tetrises)){
                this.upCurrTetris(); //上移
                this._context.currTetris.update();
                this._mainWindow.renderTetris(this._context.tetrises);
            }

            this._downTimer.ms = this._downInterval;
        }

        this._context.currTetris.back();

    }

    public start(){
        if(this._context.gameover){
            this.initialize();
        }
        this._downTimer.start();
        this._renderTimer.start();
        this.renderPrepareWindow();
        this.registerUserBehavior();
    }

    public stop(){
        this._downTimer.stop();
        this._renderTimer.stop();
        this.removeUserBehavior();
    }

    private clearCubes(){
        this._downTimer.stop();
        const clearY =  CubeEliminator.clear(this._mainWindow.width, this._mainWindow.height, this._context.tetrises);
      
        this._context.tetrises.forEach(tetris => {
            tetris.cubes.forEach(cube => {
                //下降量
                const down = clearY.filter(y => y > cube.pos.y).length;
                cube.pos = cube.pos.plusY(down);
            });
        });

        this._downTimer.start();
    }

    private updateCurrAndPrepare(){
        this._context.currTetris = this._context.prepareTetrises.shift() as Tetris;
        this._context.tetrises.push(this._context.currTetris);
        this._context.prepareTetrises.push(TetrisFactory.createRandom(this._mainWindow.width));
        this.renderPrepareWindow();
    }

    public initialize() {
        this._context = this.createGameContext(TetrisFactory.createRandom(this._mainWindow.width));
        this._context.tetrises.push(this._context.currTetris);

        this.initPrepareTetrises();
        this.windowInit();

        this.removeUserBehavior();
    }

    private createGameContext(curr : Tetris) : GameContext{
        return {
            currTetris : curr,
            tetrises: [],
            prepareTetrises: [],
            holdTetris: null,
        
            softDown: false,
            isDown: false,
            canHold: true, 
            bottom: false,
            gameover: false,
        }
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

    private upCurrTetris(){
        const currTetris = this._context.currTetris
        const shape = currTetris.currentShape;
        const { width, height } = currTetris;

        //上移量 = _currShape第一行與有定義的第一行之距離
        for(let r = 0; r < height; r++) {
            for(let c = 0; c < width; c++){
                if(shape[r][c] === ShapeValue.DEFINED){
                    currTetris.pos = currTetris.pos.subtractY(r);
                    break;
                }
            }
        }

        //上移_currShape之高度 - 1
        for(let r = 0; r < height - 1; r++) {
            currTetris.up();
        }

    }

}
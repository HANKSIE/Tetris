import Scene from "./widgets/scene";
import Tetris from "./widgets/tetris";
import Looper from "./looper";
import KeyboardOperate from "./operates/keyboard";
import TetrisFactory from "./factory/tetris";
export default class Game {

    private _scene : Scene;
    private _downLooper : Looper;
    private _drawLooper : Looper;
    private _currTetris : Tetris;
    private _tetrises : Tetris[] = [];
    public _tetrisType : string[] = [];
    private _keydownEvents : KeyboardOperate[] = [];
    private _keyupEvents : KeyboardOperate[] = [];

    constructor(scene : Scene, tetrisType : string[], keydownEvents : KeyboardOperate[] = [], keyupEvents: KeyboardOperate[] = []){
        this._scene = scene;
        this._downLooper = new Looper(() => {this.update();}, 500);
        this._drawLooper = new Looper(() => {this._scene.draw(this._currTetris);}, 50);
        this._tetrisType = tetrisType;
        this._keydownEvents = keydownEvents;
        this._keyupEvents = keyupEvents;

        this.registerKeyBoardEvent();

        this._currTetris = this.generateTetris();
    }

    private registerKeyBoardEvent(){

        document.addEventListener("keydown", (event : KeyboardEvent) => {
            this._keydownEvents.forEach( operate => {
                operate.handle(event, this._currTetris, this._downLooper);
            });
        });

        document.addEventListener("keyup", (event : KeyboardEvent) => {
            this._keyupEvents.forEach( operate => {
                operate.handle(event, this._currTetris, this._downLooper);
            });
        });
    }

    private update(){
        this.down();
        this._scene.draw(this._currTetris);
    }

    private down(){
        this._currTetris.cubes.forEach(cube => {
            cube.mapPos.y++;
        });
    }

    private canDown(){

    }

    private isBoundary(currTetris : Tetris){

    }

    private randomPickTetris() : Tetris{
        const random : number = Math.floor(Math.random() * this._tetrisType.length);
        const pick : string = this._tetrisType[random];
        return TetrisFactory.create(pick);
    }

    /**
     * 生成由Tetris最左方繪製Tetris的隨機點x
     * 
     * @param tetris
     * 
     * @returns {number}
     */
    private randomLeftPos(tetris : Tetris) : number  {
        const length : number  = this._scene.column - tetris.width;
        const randomX : number  = Math.floor(Math.random() * (length + 1));
        return randomX;
    }

    private generateTetris(){
        const tetris = this.randomPickTetris();
        const leftX = this.randomLeftPos(tetris);

        tetris.cubes.forEach(cube => {
            const x = leftX + cube.pos.x;
            const y = cube.pos.y - tetris.height;
            cube.mapPos = {x, y};
        });

        return tetris;
    }

    public start(){
        this._downLooper.start();
        this._drawLooper.start();
    }

    public stop(){
        this._downLooper.stop();
        this._drawLooper.stop();
    }

}
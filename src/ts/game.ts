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
    public _tetrisType : string[] = [];
    public _tetrises : Tetris[] = [];
    private _keydownEvents : KeyboardOperate[] = [];
    private _keyupEvents : KeyboardOperate[] = [];

    constructor(scene : Scene,  keydownEvents : KeyboardOperate[] = [], keyupEvents: KeyboardOperate[] = []){
        this._scene = scene;
        this._currTetris = TetrisFactory.createRandom(this._scene.column);
        this._tetrises.push(this._currTetris);
        this._downLooper = new Looper(() => {this.update();}, 450);
        this._drawLooper = new Looper(() => {this._scene.draw(this._tetrises);}, 50);
        this._keydownEvents = keydownEvents;
        this._keyupEvents = keyupEvents;

        this.registerKeyBoardEvent();       
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
        this._currTetris.down();
        this._currTetris.update();
    }

    private isCollision(tetris : Tetris){
        //boundary detect
        const Boundary = {
            up: -1,
            down: this._scene.row,
            left: -1,
            right: this._scene.column,
        };

        //cubes detect
    }

    // private operateHandle() {
    //     const nextCubesMapPos = this._currTetris.nextCubes.map(cube => cube.mapPos);

    //     for(let i = 0; i < this._tetrises.length; i++){
    //         const currTetris = this._tetrises[i];
    //         if(currTetris !== this._currTetris){
    //             for(let j = 0; j < nextCubesMapPos.length; j++){
    //                 if (currTetris.findCubeByMapPos(nextCubesMapPos[j])){
    //                     this._currTetris.back();
    //                 }
    //             }
    //         }
    //     }

    //     this._currTetris.update();
    // }

    public start(){
        this._downLooper.start();
        this._drawLooper.start();
    }

    public stop(){
        this._downLooper.stop();
        this._drawLooper.stop();
    }

}
import Scene from "./widgets/scene";
import Tetris from "./widgets/tetris";
import Looper from "./looper";
import KeyboardOperate from "./operates/keyboard";
import TetrisFactory from "./factory/tetris";
import { Point } from "./interfaces/coordinate";
export default class Game {

    private _scene : Scene;

    private _downLooper : Looper;
    private _drawLooper : Looper;

    private _currTetris : Tetris;
    private _tetrises : Tetris[] = [];

    private _boundaries : Point[] = [];

    private _keydownEvents : KeyboardOperate[] = [];
    private _keyupEvents : KeyboardOperate[] = [];

    constructor(scene : Scene,  keydownEvents : KeyboardOperate[] = [], keyupEvents: KeyboardOperate[] = []){
        this._scene = scene;
        this._currTetris = TetrisFactory.createRandom(this._scene.column);
        this._tetrises.push(this._currTetris);
        this._downLooper = new Looper(() => {
            this.update();
            this.operateHandle();
        }, 450);
        this._drawLooper = new Looper(() => {this._scene.draw(this._tetrises);}, 50);
        this._keydownEvents = keydownEvents;
        this._keyupEvents = keyupEvents;

        this._boundaries = Game.createBoundaries(this._scene);
        
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

    private static createBoundaries(scene : Scene) : Point[]{
        const boundaries : Point[] = [];

        const { row, column } = scene;

        for(let r = -1; r <= row ; r++){
            if(r === -1 || r === row){
                for(let i = 0; i < column; i++){
                    boundaries.push({x: i, y: r});
                }
            }
            boundaries.push({x: -1, y: r});
            boundaries.push({x: column, y: r});
        }
        console.log(boundaries);
        return boundaries;
    }

    private operateHandle(){

        const points = this._currTetris.points;

        for(let i = 0; i < this._tetrises.length; i++){
            const currTetris = this._tetrises[i];
            if(currTetris !== this._currTetris){
                for(let j = 0; j < points.length; j++){
                    if (currTetris.findCubeByPos(points[j])){
                        this._currTetris.back();
                        return;
                    }
                }
            }
        }

        for(let i = 0; i < this._boundaries.length; i++){
            const boundary = this._boundaries[i];
            for(let j = 0; j < points.length; j++){
                if (points[j].x === boundary.x && points[j].y === boundary.y){
                    this._currTetris.back();
                    return;
                }
            }
        }

        this._currTetris.update();

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
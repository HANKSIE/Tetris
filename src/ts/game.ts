import Scene from "./widgets/scene";
import Tetris from "./widgets/tetris";
import Looper from "./looper";
import { KeyboardOperate, Operate, PermanentOperate} from "./utilize/operate";
import TetrisFactory from "./factory/tetris";
import { Point } from "./utilize/coordinate";
import Action from "./utilize/action";
export default class Game {

    private _scene : Scene;

    private _downLooper : Looper;
    private _drawLooper : Looper;

    private _currTetris : Tetris;
    private _tetrises : Tetris[] = [];

    private _boundaries : Point[] = [];

    private _keydownEvents : KeyboardOperate[] = [];
    private _keyupEvents : KeyboardOperate[] = [];
    private _permanentEvents : PermanentOperate[] = [];

    constructor(scene : Scene,  keydownEvents : KeyboardOperate[], keyupEvents: KeyboardOperate[], permanentEvents : PermanentOperate[]){
        this._scene = scene;

        this._currTetris = TetrisFactory.createRandom(this._scene.column);
        this._tetrises.push(this._currTetris);

        this._downLooper = new Looper(() => {
            this.update();
        }, 450);
        this._drawLooper = new Looper(() => {this._scene.draw(this._tetrises);}, 50);

        this._keydownEvents = keydownEvents;
        this._keyupEvents = keyupEvents;
        this._permanentEvents = permanentEvents;

        this._boundaries = Game.createBoundaries(this._scene);
        
        this.registerKeyBoardEvent();
    }

    private registerKeyBoardEvent(){

        document.addEventListener("keydown", (event : KeyboardEvent) => {
            this._keydownEvents.forEach( operate => {
                operate.handle(event, this._currTetris, this._downLooper);
                this.operateHandle(operate);
            });
        });

        document.addEventListener("keyup", (event : KeyboardEvent) => {
            this._keyupEvents.forEach( operate => {
                operate.handle(event, this._currTetris, this._downLooper);
                this.operateHandle(operate);
            });
        });
    }

    private update(){
        this._permanentEvents.forEach( operate => {
            operate.handle(this._currTetris);
            this.operateHandle(operate);
        });
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

        return boundaries;
    }

    private operateHandle(operate : Operate){

        const points = this._currTetris.nextPoints;

        const isCollisionTetris = this.isCollisionTetris(points);
        const isCollisionBoundary = this.isCollisionBoundary(points);
       
        if(!isCollisionBoundary && !isCollisionTetris){
            this._currTetris.update();
            return;
        }

        console.log("collision");

    }

    private isCollisionTetris(points : Point[]) : boolean {

        for(let i = 0; i < this._tetrises.length; i++){
            const currTetris = this._tetrises[i];
            if(currTetris !== this._currTetris){
                for(let j = 0; j < points.length; j++){
                    if (currTetris.findCubeByPos(points[j])){
                        return true;
                    }
                }
            }
        }

        return false
    }

    private isCollisionBoundary(points : Point[]) : boolean {
        for(let i = 0; i < this._boundaries.length; i++){
            const boundary = this._boundaries[i];
            for(let j = 0; j < points.length; j++){
                if (points[j].x === boundary.x && points[j].y === boundary.y){
                    return true;
                }
            }
        }

        return false;
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
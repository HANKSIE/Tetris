import Scene from "./widgets/scene";
import Tetris from "./widgets/tetris";
import Looper from "./looper";
import { KeyboardOperate } from "./contract/operate";
import TetrisFactory from "./factory/tetris";
import Cube from "./widgets/cube";
import PointFactory from "./factory/point";
import Point from "./util/point";

export default class Game {

    private _scene : Scene;

    private _downLooper : Looper;
    private _drawLooper : Looper;

    private _downInterval : number = 450;
    private _drawInterval = 50;

    private _currTetris : Tetris;
    private _tetrises : Tetris[] = [];
    private _prepareTetrises : Tetris[] = [];
    private _holdTetris : Tetris | null = null;

    private _boundaries : Point[] = [];

    private _softDown = false;
    private _speedIncrease = 400;
    private _isDown = false;
    private _canHold = true; 

    private _start = false;

    private moveLeft : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowLeft"){
            this._currTetris.moveToLeft();
        }
    }
    
    private moveRight : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowRight"){
            this._currTetris.moveToRight();
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

            this._scene.drawHold(this._holdTetris);
        }
    }
    
    private softDrop : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowDown"){
            if(!this._softDown){
                this._downLooper.ms = this._downLooper.ms - this._speedIncrease;
                this._softDown = true;
            }
        }
    }
    
    private restoreSoftDrop: KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === "ArrowDown"){
            if(this._softDown){
                this._downLooper.ms = this._downLooper.ms + this._speedIncrease;
                this._softDown = false;
            }
        }
    }
    
    private hardDrop : KeyboardOperate = (event: KeyboardEvent) => {
        if(event.key === " "){
            this._downLooper.ms = 0;
        }
    }

    private down() {
        this._currTetris.down();
        this._isDown = true;
    }

    constructor(scene : Scene){
        this._scene = scene;

        this._currTetris = TetrisFactory.createRandom(this._scene.column);
        this._tetrises.push(this._currTetris);

        this._downLooper = new Looper(() => {
            this.update();
        }, this._downInterval);
        this._drawLooper = new Looper(() => {;
            this._scene.draw(this._tetrises);
        }, this._drawInterval);


        this._boundaries = Game.createBoundaries(this._scene);
        
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
          
            this.operateHandle();
        });

        document.addEventListener("keyup", (event : KeyboardEvent) => {
            this.restoreSoftDrop(event);
            this.operateHandle();
        });
    }

    private update(){
        this.down();
        this.operateHandle();
        this._isDown = false;
    }

    private static createBoundaries(scene : Scene) : Point[]{
        const boundaries : Point[] = [];

        const { row, column } = scene;

        for(let r = -1; r <= row ; r++){
            if(r === -1 || r === row){
                for(let i = 0; i < column; i++){
                    boundaries.push(PointFactory.create(i, r));
                }
            }
            boundaries.push(PointFactory.create(-1, r));
            boundaries.push(PointFactory.create(column, r));
        }

        return boundaries;
    }

    private operateHandle(){

        const cubes = this._currTetris.nextCubes;

        const isCollisionTetris = this.isCollisionTetris(cubes, true);
        const isCollisionBoundary = this.isCollisionBoundary(cubes);
       
        if(!isCollisionBoundary && !isCollisionTetris){
            this._currTetris.update();
            return;
        }

        //collision
        if(this._isDown){

            //消除方塊
            this.erase();
            //產生新方塊
            this.updateCurrAndPrepare();

            this._softDown = false;
            this._canHold = true;

            if(this.isCollisionTetris(this._currTetris.cubes, true)){
                this.stop();
                alert("gameover");
                return;
            }else {
                this.restoreDownLooperMs();
            }

        }

        this._currTetris.back();

    }

    private isCollisionTetris(cubes : Cube[], containCurr : boolean = false) : boolean {

        for(let i = 0; i < this._tetrises.length; i++){
            const currTetris = this._tetrises[i];
            if(currTetris !== this._currTetris && containCurr){
                for(let j = 0; j < cubes.length; j++){
                    if (currTetris.findCubeByPos(cubes[j].pos)){
                        return true;
                    }
                }  
            }
        }

        return false
    }

    private isCollisionBoundary(cubes : Cube[]) : boolean {
        for(let i = 0; i < this._boundaries.length; i++){
            const boundary = this._boundaries[i];
            for(let j = 0; j < cubes.length; j++){
                const points = cubes[j].pos;
                if (points.x === boundary.x && points.y === boundary.y){
                    return true;
                }
            }
        }

        return false;
    }

    private restoreDownLooperMs() {
        this._downLooper.ms = this._downInterval;
    }

    public start(){
        this._downLooper.start();
        this._drawLooper.start();
        
        if(this._prepareTetrises.length === 0){
            for(let i=0; i<3; i++){
                this._prepareTetrises.push(TetrisFactory.createRandom(this._scene.column));
            }
            this._scene.drawPrepare(this._prepareTetrises);
        }
      
        this._start = true;
    }

    public stop(){
        this._downLooper.stop();
        this._drawLooper.stop();
        this._start = false;
    }

    private erase(){
        this._downLooper.stop();
        const eraseY = this.eraseCubes();
        this.removeTetris();
        this.downCubes(eraseY);
        this._downLooper.start();
    }

    private updateCurrAndPrepare(){
        this._currTetris = this._prepareTetrises.shift() as Tetris;
        this._tetrises.push(this._currTetris);
        this._prepareTetrises.push(TetrisFactory.createRandom(this._scene.column));
        this._scene.drawPrepare(this._prepareTetrises);
        
    }
    //回傳這次應erase的y座標
    private eraseCubes() : number[]{

        const count : Cube[][] = [];
        const eraseY : number[] = [];

        for(let i = 0; i < this._scene.row; i++){
            count.push([]);
        }

        this._tetrises.forEach(tetris => {
            tetris.cubes.forEach(cube => {
                //若cube沒被清除則加入
                if(!cube.isErase){
                    count[cube.pos.y].push(cube);
                }
            });
        });

        count.forEach((row, r) => {
            //該列都有元素
            if(row.length === this._scene.column){
                row.forEach(cube => {
                    cube.isErase = true;
                });
                eraseY.push(r);
            }
        });

        return eraseY;
    }

    private removeTetris() {
        this._tetrises.forEach(target => {
            const existCubes = target.cubes.filter(cube => {
                return cube.isErase === false;
            });

            //cube.isErase 全是 false
            if(existCubes.length === 0){
                //移除該tetris
                this._tetrises = this._tetrises.filter(tetris => tetris !== target);
            }
        });
    }

    private downCubes(eraseY : number[]) {
        this._tetrises.forEach(tetris => {
            tetris.cubes.forEach(cube => {
                //下降量
                const down = eraseY.filter(y => y > cube.pos.y).length;
                cube.pos = cube.pos.plusY(down);
            });
        });
    }

}
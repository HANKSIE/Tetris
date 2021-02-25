import Scene from "./widgets/scene";
import Tetris from "./widgets/tetris";
import Looper from "./looper";
import { KeyboardOperate } from "./utilize/operate";
import TetrisFactory from "./factory/tetris";
import { Point } from "./utilize/coordinate";
import Cube from "./widgets/cube";

export default class Game {

    private _scene : Scene;

    private _downLooper : Looper;
    private _drawLooper : Looper;

    private _downInterval : number = 450;
    private _drawInterval = 50;

    private _currTetris : Tetris;
    private _tetrises : Tetris[] = [];

    private _boundaries : Point[] = [];

    private _softDown = false;
    private _speedIncrease = 400;
    private _isDown = false;

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
            this.moveLeft(event);
            this.moveRight(event);
            this.rotate(event);
            this.softDrop(event);
            this.hardDrop(event);

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
                    boundaries.push({x: i, y: r});
                }
            }
            boundaries.push({x: -1, y: r});
            boundaries.push({x: column, y: r});
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
            this._currTetris = TetrisFactory.createRandom(this._scene.column);
            this._tetrises.push(this._currTetris);
            this._softDown = false;

            if(this.isCollisionTetris(this._currTetris.cubes, true)){
                console.log("gameover");
                this.stop();
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
    }

    public stop(){
        this._downLooper.stop();
        this._drawLooper.stop();
    }

    private erase(){
        this._downLooper.stop();
        const eraseY = this.eraseCubes();
        this.removeTetris();
        this.downCubes(eraseY);
        this._downLooper.start();
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
        console.log(eraseY);
        console.log(this._tetrises);
        this._tetrises.forEach(tetris => {
            tetris.cubes.forEach(cube => {
                //下降量
                const down = eraseY.filter(y => y > cube.pos.y).length;
                cube.pos = {x: cube.pos.x, y: cube.pos.y + down};
            });
        });
       
    }

}
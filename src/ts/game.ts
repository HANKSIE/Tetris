import Scene from "./widgets/scene";
import Tetris from "./widgets/tetris";
import Cube from "./widgets/cube";
import Looper from "./looper";
import KeyboardOperate from "./operates/keyboard";
import TetrisFactory from "./factory/tetris";

type MapShape = Array<Array<Cube | null>>;
export default class Game {

    private _scene : Scene;
    private _looper : Looper;
    private _currTetris : Tetris;
    private _tetrises : Tetris[] = [];
    public _tetrisType : string[] = [];
    private _map : MapShape = [];
    private _keyboardOperates : KeyboardOperate[] = [];

    constructor(scene : Scene, tetrisType : string[], keyboardOperates : KeyboardOperate[]){
        this._scene = scene;
        this._looper = new Looper(() => {this.update();}, 1000);
        this._tetrisType = tetrisType;
        this._keyboardOperates = keyboardOperates;

        const {row, column} = scene;
        this._map = new Array(row).fill(new Array(column).fill(null));
        this.registerKeyBoardEvent();

        this._currTetris = this.generateTetris();
    }

    private registerKeyBoardEvent(){
        document.addEventListener("keydown", (event : KeyboardEvent) => {
            this._keyboardOperates.forEach( operate => {
                // operate.handle(event, this._currTeries);
                operate.handle(event);
            });
        });
    }

    private update(){
        this.down();
    }

    private down(){
        this._currTetris.cubes.forEach(cube => {
            cube.mapPos.y++;
        });

        this._scene.draw(this._currTetris);
    }

    public randomPickTetris() : Tetris{
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
    public randomLeftPos(tetris : Tetris) : number  {
        const length : number  = this._scene.column - tetris.width;
        const randomX : number  = Math.floor(Math.random() * (length + 1));
        return randomX;
    }

    public generateTetris(){
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
        this._looper.start();
    }

    public stop(){
        this._looper.stop();
    }

}
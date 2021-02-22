import Scene from "./widgets/scene";
import Tetris from "./widgets/tetris";
import Looper from "./widgets/looper";

export default class Game {

    private _scene : Scene;
    private _looper : Looper;
    private _tetrises : Tetris[] = [];
    private _tetrisType : Tetris[] = [];

    constructor(scene : Scene, looper : Looper, tetrisType : Tetris[]){
        this._scene = scene;
        this._looper = looper;
        this._tetrisType = tetrisType;
    }

    public registerKeyBoardEvent(){
        document.addEventListener("keydown", function(event : KeyboardEvent){
            switch(event.key) {
                case "ArrowLeft":
                    console.log("左");
                    break;
                case "ArrowRight":
                    console.log("右");
                    break;
                case "ArrowUp":
                    console.log("上");
                    break;
                case "ArrowDown":
                    console.log("下");
                    break;
            }
        });
    }

    public start(){
        
    }

    public stop(){

    }

    private randomTeteris(){
        const types = this._tetrisType.length;
    }

}
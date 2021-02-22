import KeyboardOperate from "./keyboard";
import Tetris from "../widgets/tetris";
import Looper from "../looper";

const moveToLeft : KeyboardOperate = {
    handle(event : KeyboardEvent, tetris : Tetris) {
        if(event.key === "ArrowLeft"){
            tetris.cubes.forEach(cube => {
                cube.mapPos.x--;
            });
        }
    }
};

const moveToRight : KeyboardOperate = {
    handle(event : KeyboardEvent, tetris : Tetris) {
        if(event.key === "ArrowRight"){
            tetris.cubes.forEach(cube => {
                cube.mapPos.x++;
            });
        }
    }
};


const rotate : KeyboardOperate = {
    handle(event : KeyboardEvent, tetris : Tetris) {
        if(event.key === "ArrowUp"){
            //逆時針旋轉
        }
    }
};

let isPressDown = false;
const speed = 400;

const quickDown : KeyboardOperate = {
    handle(event : KeyboardEvent, tetris : Tetris, downLooper : Looper) {
        if(event.key === "ArrowDown"){
            if(!isPressDown){
                downLooper.ms = downLooper.ms - speed;
                isPressDown = true;
            }
        }
    }
};

const normalDown : KeyboardOperate = {
    handle(event : KeyboardEvent, tetris : Tetris, downLooper : Looper) {
        if(event.key === "ArrowDown"){
            downLooper.ms = downLooper.ms + speed;
            isPressDown = false;
        }
    }
};

export { moveToLeft, moveToRight, rotate, quickDown, normalDown};
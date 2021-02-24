import KeyboardOperate from "../utilize/keyboard";
import Tetris from "../widgets/tetris";
import Looper from "../looper";
import Action from "../utilize/action";

const moveToLeft : KeyboardOperate = {
    action : Action.Left,
    handle(event : KeyboardEvent, tetris : Tetris) {
        if(event.key === "ArrowLeft"){
           tetris.moveToLeft();
        }
    }
};

const moveToRight : KeyboardOperate = {
    action : Action.Right,
    handle(event : KeyboardEvent, tetris : Tetris) {
        if(event.key === "ArrowRight"){
           tetris.moveToRight();
        }
    }
};


const rotate : KeyboardOperate = {
    action : Action.Rotate,
    handle(event : KeyboardEvent, tetris : Tetris) {
        if(event.key === "ArrowUp"){
            tetris.rotate();
        }
    }
};

let isPressDown = false;
const speed = 400;

const quickDown : KeyboardOperate = {
    action : "quickDown",
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
    action : "normalDown",
    handle(event : KeyboardEvent, tetris : Tetris, downLooper : Looper) {
        if(event.key === "ArrowDown"){
            downLooper.ms = downLooper.ms + speed;
            isPressDown = false;
        }
    }
};

export { moveToLeft, moveToRight, rotate, quickDown, normalDown};
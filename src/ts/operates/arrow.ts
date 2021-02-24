import { KeyboardOperate } from "../utilize/operate";
import Tetris from "../widgets/tetris";
import Looper from "../looper";
import Action from "../utilize/action";

class Left extends KeyboardOperate {
    public action(): String | Action {
        return Action.Left;
    }
    public handle(event: KeyboardEvent, tetris: Tetris, mainLooper: Looper): void {
        if(event?.key === "ArrowLeft"){
            tetris?.moveToLeft();
         }
    }
}

class Right extends KeyboardOperate {
    public action(): String | Action {
        return Action.Right;
    }
    public handle(event: KeyboardEvent, tetris: Tetris, mainLooper: Looper): void {
        if(event?.key === "ArrowRight"){
            tetris?.moveToRight();
         }
    }
}
class Rotate extends KeyboardOperate {

    public action(): String | Action {
        return Action.Rotate;
    }
    public handle(event: KeyboardEvent, tetris: Tetris, mainLooper: Looper): void {
        if(event.key === "ArrowUp"){
            tetris.rotate();
        }
    }
}

let isPressDown = false;
const speed = 400;
class QuickDown extends KeyboardOperate {

    public action(): String | Action {
        return "quickDown";
    }
    public handle(event: KeyboardEvent, tetris: Tetris, mainLooper: Looper): void {
        if(event.key === "ArrowDown"){
            mainLooper.ms = mainLooper.ms - speed;
            isPressDown = false;
        }
    }
}
class RestoreDown extends KeyboardOperate {

    public action(): String | Action {
        return "restore";
    }
    public handle(event: KeyboardEvent, tetris: Tetris, mainLooper: Looper): void {
        if(event?.key === "ArrowDown"){
            mainLooper.ms = mainLooper.ms + speed;
            isPressDown = false;
        }
    }
}

const moveToLeft = new Left();
const moveToRight = new Right();
const rotate = new Rotate();
const quickDown = new QuickDown();
const restoreDown = new RestoreDown();

export { moveToLeft, moveToRight, rotate, quickDown, restoreDown,};

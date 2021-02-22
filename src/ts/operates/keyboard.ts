import Tetris from "../widgets/tetris";
import Looper from "../looper";

export default interface KeyboardOperate{
    handle(event : KeyboardEvent, tetris : Tetris, mainLooper : Looper) : void;
}
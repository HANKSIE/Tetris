import Tetris from "../widgets/tetris";
import Looper from "../looper";
import Action from "./action";

export default interface KeyboardOperate{
    action : Action | string;
    handle(event : KeyboardEvent, tetris : Tetris, mainLooper : Looper) : void;
}
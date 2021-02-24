import Tetris from "../widgets/tetris";
import Looper from "../looper";
import Action from "./action";

abstract class Operate {
    public abstract action() : Action | String;
}

abstract class PermanentOperate extends Operate {
    public abstract handle(tetrises : Tetris[]) : void;
}

abstract class KeyboardOperate extends Operate {
    public abstract handle(event : KeyboardEvent, tetris : Tetris, downLooper : Looper) : void;
}

export { Operate, PermanentOperate, KeyboardOperate };
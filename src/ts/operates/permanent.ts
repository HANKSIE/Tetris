import { PermanentOperate } from "../utilize/operate";
import Tetris from "../widgets/tetris";
import Action from "../utilize/action";

class DefaultDown extends PermanentOperate {

    public action(): String | Action {
        return Action.Down;
    }
    public handle(tetris: Tetris): void {
        tetris.down();
    }

}

const defaultDown = new DefaultDown();

export {defaultDown};
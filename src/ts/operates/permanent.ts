import { PermanentOperate } from "../utilize/operate";
import Tetris from "../widgets/tetris";
import Action from "../utilize/action";

class DefaultDown extends PermanentOperate {

    public action(): String | Action {
        return Action.Down;
    }
    public handle(tetrises: Tetris[]): void {
        tetrises.forEach(tetris => {
            tetris.down();
        });
    }

}

const defaultDown = new DefaultDown();

export {defaultDown};
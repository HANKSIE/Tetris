import Tetris from "../widgets/tetris";
import TetrisType from "../widgets/tetrises/index";
export default class TetrisFactory {

    public static create(tetrisType : string) : Tetris{
        //輸入的類別名稱為store紀錄的屬性時生成對應的Tetris
        const tetris = new (<any>TetrisType)[tetrisType]();
        return tetris;
    }

    public static createRandom(sceneColumn: number) : Tetris {
        const tetris = TetrisFactory.randomPickTetris();

        const x = Math.floor(sceneColumn / 2 - tetris.width / 2);

        tetris.originPos = {x, y: 0};
        
        return tetris;
    }

    private static randomPickTetris() : Tetris {
        const types : string[] = Object.keys(TetrisType);
        const random : number = Math.floor(Math.random() * types.length);
        const pick : string = types[random];
        return TetrisFactory.create(pick);
    }

}
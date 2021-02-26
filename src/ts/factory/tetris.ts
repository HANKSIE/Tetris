import Tetris from "../widgets/tetris";
import { Types } from "../widgets/concrete/tetrises";
import PointFactory from "./point";

export default class TetrisFactory {

    public static create(tetrisType : string) : Tetris{
        //輸入的類別名稱為store紀錄的屬性時生成對應的Tetris
        const tetris = new (<any>Types)[tetrisType]();
        return tetris;
    }

    public static createRandom(sceneColumn: number) : Tetris {
        const tetris = TetrisFactory.randomPickTetris();

        const x = Math.floor(sceneColumn / 2 - tetris.width / 2);

        tetris.originPos = PointFactory.create(x, 0);
        
        return tetris;
    }

    private static randomPickTetris() : Tetris {
        const types : string[] = Object.keys(Types);
        const random : number = Math.floor(Math.random() * types.length);
        const pick : string = types[random];
        return TetrisFactory.create(pick);
    }

}
import Tetris from "../widgets/tetris";
import TetrisType from "../widgets/tetrises/index";

export default class TetrisFactory {
    public static create(tetrisType : string) : Tetris{
        //輸入的類別名稱為store紀錄的屬性時生成對應的Tetris
        const tetris = new (<any>TetrisType)[tetrisType]();
        return tetris;
    }
}
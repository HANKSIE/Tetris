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
        const leftX = TetrisFactory.randomLeftPos(tetris, sceneColumn);

        tetris.cubes.forEach(cube => {
            const x = leftX + cube.pos.x;
            const y = cube.pos.y - tetris.height;
            cube.mapPos = {x, y};
        });

        return tetris;
    }

    private static randomPickTetris() : Tetris {
        const types : string[] = Object.keys(TetrisType);
        const random : number = Math.floor(Math.random() * types.length);
        const pick : string = types[random];
        return TetrisFactory.create(pick);
    }

    /**
     * 生成由Tetris最左方繪製Tetris的隨機點x
     * 
     * @param tetris
     * 
     * @returns {number}
     */
    private static randomLeftPos(tetris : Tetris, sceneColumn: number) : number  {
        const length : number  = sceneColumn - tetris.width;
        const randomX : number  = Math.floor(Math.random() * (length + 1));
        return randomX;
    }
}
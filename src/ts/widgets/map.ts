import Tetris from "../widgets/tetris";
import { Point } from "../utilize/coordinate";
import Cube from "./cube";

interface SavePoint {
    tetris: Tetris,
    cube: Cube | undefined,
}

class SceneMap {
    private _map : Tetris[][];
    public _width : number;
    public _height : number;
    public get width() : number {
        return this._width;
    }

    public get height() : number {
        return this._height
    }

    constructor(row : number, col : number){
        const initArr = [];
        for(let r=0; r<col; r++){
            initArr.push(Array(row).fill(null));
        }

        //初始化
        this._map = initArr.slice();
        this._width = col;
        this._height = row;
    }

    public add(tetris : Tetris) {
        //記錄點對應到的位置
        tetris.cubes.forEach((cube) => {
            const {x, y} = cube.pos;
            this._map[y][x] = tetris;
        });
    }

    public eraseSavePoint()  {
        const result : SavePoint[] = [];

        this._map.forEach((row, r) => {
            //該列元素皆不為null
            if(row.every(tetris =>  !!tetris)) {
                row.forEach((tetris, c) => {
                    result.push({tetris, cube: tetris.findCubeByPos({x: c, y:r})});
                });
            }
        });

        return result;
    }


}
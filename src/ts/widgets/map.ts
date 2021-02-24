import Tetris from "../widgets/tetris";
import { Point } from "../utilize/coordinate";

interface SavePoint {
    tetris: Tetris,
    pos: Point,
}

class SceneMap {
    private _map : SavePoint[][];
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
        tetris.points.forEach(point => {
            const { x, y } = point;
            this._map[y][x] = {tetris, pos: {x, y}};
        });
    }

    public eraseSavePoint()  {
        const result : SavePoint[] = [];

        this._map.forEach(row => {
            //該列元素皆不為null
            if(row.every(el =>  !!el)) {
                row.forEach(el => {
                    result.push(el);
                });
            }
        });

        return result;
    }


}
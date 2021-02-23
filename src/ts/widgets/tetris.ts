import Cube from "./cube";
import CubeFactory from "../factory/cube";
import { Point } from "../interfaces/coordinate";

type Shape = Array<Array<number>>;

enum ShapeValue {
    UNDEFINED = -1,
    DEFINED = 1,
    EMPTY = 0,
}

export default abstract class Tetris {

    protected _color : string;
    protected _originShape :  Shape;
    protected _currentShape :  Shape;
    protected _cubes : Cube[] = [];
  
    protected _mapPos : Point = {x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER};

    public get cubes() : Cube[]{
        return this._cubes;
    }

    public get originShape() : Shape{
        return this._originShape;
    }

    public get currentShape() : Shape{
        return this._currentShape;
    }

    public get width() : number{
        return this._currentShape[0].length;
    }

    public get height() : number{
        return this._currentShape.length;
    }

    public get mapPos() : Point {
        return this._mapPos;
    }

    public set mapPos(value : Point) {
        this._mapPos = value;
        this._cubes = this.generateCubes(this._currentShape, this._color);
        console.log(this._cubes);
    }

    public abstract shapeDefine() : Shape;

    public abstract colorDefine() : string;

    constructor(){
        this._color = this.colorDefine();
        this._originShape = this.shapeDefine();
        this._currentShape = this._originShape.slice();
    }

    private generateCubes(shape : Shape, color : string) : Cube[]{
        const cubes : Cube[]= [];

        const { x, y } = this._mapPos;
        shape.forEach((row, r) => {
            row.forEach((element, c) => {
                if(element === ShapeValue.DEFINED){
                    cubes.push(CubeFactory.createCube(color, {x: c, y: r}, {x: x + c, y: r + y}));
                }
            });
        });

        return cubes;
    }

    public findCubeByPos(pos : Point) : Cube | undefined{
        const cube = this.cubes.find(cube => cube.pos.x === pos.x && cube.pos.y === pos.y);
        return cube;
    }

    public findCubeByMapPos(mapPos : Point) : Cube | undefined{
        const cube = this.cubes.find(cube => cube.mapPos.x === this.mapPos.x && cube.mapPos.y === mapPos.y);
        return cube;
    }

    public rotate(){
        const row = this.height;
        const col = this.width;

        //創造二維陣列
        const initArr = [];
        for(let r=0; r<col; r++){
            initArr.push(Array(row).fill(ShapeValue.EMPTY));
        }

        //初始化
        const newShape = initArr.slice();

        let newRow : number = 0;
        const newCubes : Cube[]= [];

        for(let r=0; r < row; r++){
            newRow = col - 1;
            for(let c=0; c < col; c++){
                const val = this._currentShape[r][c]
                newShape[newRow][r] = val;

                if(val === ShapeValue.DEFINED) {
                    const originCube = this.findCubeByPos({x: c, y: r});
                    if(originCube){
                        const newCube = CubeFactory.createCube(this._color, {x: r, y: newRow});
                        //tetris左上角之座標 + 偏移量
                        newCube.mapPos = {x: r + this.mapPos.x,  y: newRow + this.mapPos.y};
                        newCubes.push(newCube);
                    }
                }

                newRow--;
            }
        }

        this._currentShape = newShape;
        this._cubes = newCubes;
    }

    public moveToLeft(){
        this.mapPos = {x: this.mapPos.x - 1, y: this.mapPos.y};
    }

    public moveToRight(){
        this.mapPos = {x: this.mapPos.x + 1, y: this.mapPos.y};
    }

    public down(){
        this.mapPos = {x: this.mapPos.x, y: this.mapPos.y + 1};
    }

}


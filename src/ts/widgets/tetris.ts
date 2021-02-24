import Cube from "./cube";
import CubeFactory from "../factory/cube";
import { Point } from "../utilize/coordinate";

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
    protected _nextShape :  Shape;
  
    protected _pos : Point = {x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER};
    protected _nextPos : Point = {x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER};

    protected _cubes : Cube[] = [];

    public get width() : number{
        return this._currentShape[0].length;
    }

    public get height() : number{
        return this._currentShape.length;
    }

    public get pos() : Point {
        return this._pos;
    }

    public set pos(value : Point) {
        this._pos = value;
        this._cubes = this.generateCubes(this.pos, this._currentShape, this._color);
    }
    
    public get points() : Point[] {
        return this._cubes.map(cube => cube.pos);
    }

    public get nextPoints() : Point[] {
        return this.generateCubes(this._nextPos, this._nextShape, this._color).map(cube => cube.pos);
    }

    public get color() : string {
        return this._color;
    }

    public abstract shapeDefine() : Shape;

    public abstract colorDefine() : string;

    constructor(){
        this._color = this.colorDefine();
        this._originShape = this.shapeDefine();
        this._nextShape = this._originShape.slice();
        this._currentShape = this._originShape.slice();
    }

    private generateCubes(pos : Point, shape : Shape, color : string) : Cube[]{
        const cubes : Cube[]= [];

        const { x, y } = pos;

        shape.forEach((row, r) => {
            row.forEach((element, c) => {
                if(element === ShapeValue.DEFINED){
                    cubes.push(CubeFactory.create(color, {x: c, y: r}, {x: x + c, y: r + y}));
                }
            });
        });

        return cubes;
    }

    public findCubeByPos(pos : Point) : Cube | undefined{
        const cube = this._cubes.find(cube => cube.pos.x === pos.x && cube.pos.y === pos.y);
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

        for(let r=0; r < row; r++){
            newRow = col - 1;
            for(let c=0; c < col; c++){
                const val = this._currentShape[r][c]
                newShape[newRow][r] = val;

                if(val === ShapeValue.DEFINED) {
                    const originCube = this.findCubeByPos({x: c, y: r});
                    if(originCube){
                        const newCube = CubeFactory.create(this._color, {x: r, y: newRow});
                        //tetris左上角之座標 + 偏移量
                        newCube.pos = {x: r + this.pos.x,  y: newRow + this.pos.y};
                    }
                }

                newRow--;
            }
        }

        this._nextShape = newShape;
    }

    public moveToLeft(){
        this._nextPos = {x: this.pos.x - 1, y: this.pos.y};
    }

    public moveToRight(){
        this._nextPos = {x: this.pos.x + 1, y: this.pos.y};
    }

    public down(){
        this._nextPos = {x: this.pos.x, y: this.pos.y + 1};
    }

    public update(){
        this._currentShape = this._nextShape.slice();
        this.pos = {x: this._nextPos.x, y: this._nextPos.y};
    }

    public back(){
        this._nextShape = this._currentShape.slice();
        this._nextPos = {x: this.pos.x, y: this.pos.y};
    }

}


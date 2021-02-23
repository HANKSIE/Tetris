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
    // protected _nextShape : Shape;
    protected _cubes : Cube[];
    // protected _nextCubes : Cube[];

    public get cubes() : Cube[]{
        return this._cubes;
    }

    // public get nextCubes() : Cube[]{
    //     return this._nextCubes;
    // }

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

    //tetris實際座標 (_cubes中最小的座標)
    public get mapPos() : Point {
        const p : Point = {x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER};

        this._cubes.forEach(cube => {
            const {x, y} = cube.mapPos;
            if(x < p.x){
                p.x = x;
            }
            if(y < p.y){
                p.y = y;
            }
        });

        return p;
    }

    public abstract shapeDefine() : Shape;

    public abstract colorDefine() : string;

    constructor(){
        this._color = this.colorDefine();
        this._originShape = Tetris.cut(this.shapeDefine());
        this._currentShape = this._originShape.slice();
        // this._nextShape = this._originShape.slice();

        this._cubes = Tetris.generateCubes(this._originShape, this._color);
        // this._nextCubes = this._cubes;
    }

    /**
     * 裁剪 shapeDefine 定義的形狀
     * 
     * @param shape
     * 
     * @returns {Shape}
     */
    private static cut(shape : Shape) : Shape {
        const row = shape.length;

        let leftBound , rightBound, upBound, downBound;
        leftBound = rightBound = upBound = downBound = ShapeValue.UNDEFINED;

        for(let r = 0; r < row; r++){

            //該row有包含1
            if(shape[r].includes(ShapeValue.DEFINED)){
                if(upBound === ShapeValue.UNDEFINED){
                    upBound = r;
                }
                downBound = r;
            }

            //該row的長度
            const col = shape[r].length;

            for(let c = 0; c < col; c++){
                const curr = shape[r][c];
                if (curr === ShapeValue.DEFINED){
                    if(leftBound === ShapeValue.UNDEFINED || c < leftBound){
                        leftBound = c;
                    }

                    if(c > rightBound){
                        rightBound = c;
                    }
                }
            }
        }

        if(downBound === ShapeValue.UNDEFINED || upBound === ShapeValue.UNDEFINED || leftBound === ShapeValue.UNDEFINED || rightBound === ShapeValue.UNDEFINED) {
            throw Error("不可定義空形狀");
        }

        const result : Shape = [];
        const resultRow = downBound - upBound + 1;

        for(let r = 0; r < resultRow; r++){
            const curr : number[] = shape[r + upBound];
            const newRow : number[] = [];
            for(let c = leftBound; c <= rightBound; c++){
                //若c >= curr.length 則塞入0
                newRow.push(curr[c] || ShapeValue.EMPTY);
            } 
            result.push(newRow);
        }

        return result;
    }

    private static generateCubes(shape : Shape, color : string) : Cube[]{
        const cubes : Cube[]= [];

        shape.forEach((row, r) => {
            row.forEach((element, c) => {
                if(element === ShapeValue.DEFINED){
                    cubes.push(CubeFactory.createCube(color, {x: c, y: r}));
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
        for(let i = 0; i < this._cubes.length; i++){
            this._cubes[i].mapPos.x = this._cubes[i].mapPos.x - 1;
        }
    }

    public moveToRight(){
        for(let i = 0; i < this._cubes.length; i++){
            this._cubes[i].mapPos.x = this._cubes[i].mapPos.x + 1;
        }
    }

    public down(){
        this.cubes.forEach(cube => {
            cube.mapPos.y++;
        });
    }

    // public update(){
    //     this._currentShape = this._nextShape;
    //     this._cubes = this._nextCubes;
    // }

    // public back(){
    //     this._nextShape = this._currentShape;
    //     this._nextCubes = this._cubes;
    // }

}


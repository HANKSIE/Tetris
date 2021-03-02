import Cube from "./cube";
import CubeFactory from "../factory/cube";
import PointFactory from "../factory/point";
import Point from "../util/point";
import ArrayHelper from "../helper/array";

type Shape = Array<Array<number>>;

export enum ShapeValue {
    UNDEFINED = -1,
    DEFINED = 1,
    EMPTY = 0,
}

export default abstract class Tetris {

    protected _color : string;

    protected _originShape :  Shape;
    protected _currentShape :  Shape;
    protected _nextShape :  Shape;
  
    protected _originPos : Point = PointFactory.createMin();
    protected _pos : Point = PointFactory.createMin();
    protected _nextPos : Point = PointFactory.createByPoint(this.pos);

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
        this._cubes = this.generateCubes(this.pos, this._currentShape);
    }

    public get originPos() : Point {
        return this._originPos;
    }

    public set originPos(p: Point) {

        if(this.originPos.x === Number.MIN_SAFE_INTEGER && this.originPos.y === Number.MIN_SAFE_INTEGER){
            this._originPos = PointFactory.createByPoint(p);  
            this.pos = PointFactory.createByPoint(p);  
            this._nextPos = PointFactory.createByPoint(p);  
        }

    }

    public get originWidth() : number{
        return this._originShape[0].length;
    }

    public get originHeight() : number{
        return this._originShape.length;
    }
    
    public get cubes() : Cube[] {
        return this._cubes;
    }

    public get nextCubes() : Cube[] {
        return this.generateCubes(this._nextPos, this._nextShape);
    }

    public get color() : string {
        return this._color;
    }

    public get currentShape() : Shape {
        return this._currentShape.slice();
    }

    public abstract shapeDefine() : Shape;

    public abstract colorDefine() : string;

    constructor(){
        this._color = this.colorDefine();
        this._originShape = this.shapeDefine();
        this._nextShape = this._originShape.slice();
        this._currentShape = this._originShape.slice();
    }

    private generateCubes(pos : Point, shape : Shape) : Cube[]{
        const cubes : Cube[]= [];

        shape.forEach((row, r) => {
            row.forEach((element, c) => {
                if(element === ShapeValue.DEFINED){
                    const relationPos = PointFactory.create(c, r);
                    const position = relationPos.plus(pos);
                    cubes.push(CubeFactory.create(relationPos, position));
                }
            });
        });

        return cubes;
    }

    public findCubeByPos(pos : Point, isClear : boolean = false) : Cube | undefined{
        const cube = this._cubes.find(cube => {
            return cube.pos.equal(pos) && cube.isClear === isClear;
        });
        return cube;
    }

    public findCube(cube : Cube) : Cube | undefined{
        return this._cubes.find(el => el === cube);
    }

    public rotate(){
        const row = this.height;
        const col = this.width;
        
        const newShape: Shape = ArrayHelper.create2D<ShapeValue>(col, row, ShapeValue.EMPTY);

        let newRow : number = 0;

        for(let r=0; r < row; r++){
            newRow = 0;
            for(let c= 0; c < col; c++){
                const val = this._currentShape[r][c];
                newShape[newRow][row - r - 1] = val;

                if(val === ShapeValue.DEFINED) {
                    const originCube = this.findCubeByPos(PointFactory.create(c, r));
                    if(originCube){
                        const newCube = CubeFactory.create(PointFactory.create(r, newRow));
                        //tetris左上角之座標 + 偏移量
                        newCube.pos = this.pos.plusWith(r, c);
                    }
                }
                newRow++;
            }
        }

        this._nextShape = newShape;
    }

    public left(amount: number = 1){
        this._nextPos = this._nextPos.subtractX(amount);
    }

    public right(amount: number = 1){
        this._nextPos = this._nextPos.plusX(amount);
    }

    public up(amount: number = 1){
        this._nextPos = this._nextPos.subtractY(amount);
    }

    public down(amount: number = 1){
        this._nextPos = this._nextPos.plusY(amount);
    }

    public update(){
        this._currentShape = this._nextShape.slice();
        this.pos = PointFactory.createByPoint(this._nextPos);
        this._nextPos = PointFactory.createByPoint(this.pos);
    }

    public back(){
        this._nextShape = this._currentShape.slice();
        this._nextPos = PointFactory.createByPoint(this.pos);
    }

    public posInitialize (){
        this.pos = PointFactory.createByPoint(this.originPos);
        this._nextPos = PointFactory.createByPoint(this.originPos);
    }
}


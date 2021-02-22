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
    protected _shape :  Shape;
    protected _cubes : Cube[];

    public get cubes(){
        return this._cubes;
    }

    public get shape(){
        return this._shape;
    }

    public get width(){
        return this._shape[0].length;
    }

    public get height(){
        return this._shape.length;
    }

    public abstract shapeDefine() : Shape;

    public abstract colorDefine() : string;

    constructor(){
        this._color = this.colorDefine();
        this._shape = Tetris.cut(this.shapeDefine());
        this._cubes = Tetris.generateCubes(this._shape, this._color);
    }

    /**
     * 裁減在 shapeDefine 定義的形狀
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

    public findCubeByPos(pos : Point) : Cube {
        const cube = this.cubes.find(cube => cube.pos.x === pos.x && cube.pos.y === pos.y);
        return cube!;
    }

}


import Tetris from "../../widgets/tetris";

export default abstract class GameWindow {

    protected _width: number;
    protected _height: number;
    protected _unit: number;

    protected _canvas: HTMLCanvasElement;
    protected _context: CanvasRenderingContext2D;

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }

    constructor(canvas : HTMLCanvasElement, width: number, height: number, unit: number) {

        this._canvas = canvas;
        this._context = canvas.getContext("2d") as CanvasRenderingContext2D;
        this._width = width;
        this._height = height;
        this._unit = unit;

    }

    public renderGrid(){

        this._context.strokeStyle = "#777777";

        for(let y = 0; y < this.height; y++){
            this._context.beginPath();
            this._context.moveTo(0, y * this._unit + this._unit);
            this._context.lineTo(this.width * this._unit, y * this._unit + this._unit);
            this._context.stroke();
        }

        for(let x = 0; x < this.width; x++){
            this._context.beginPath();
            this._context.moveTo(x * this._unit + this._unit, 0);
            this._context.lineTo(x * this._unit + this._unit, this._canvas.height);
            this._context.stroke();
        }
  
    }

    public abstract renderTetris(tetrises : Tetris[]) : void;

    public render(tetrises : Tetris[]){
        this.clear();
        this.renderDefine(tetrises);
    }

    public clear() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    protected abstract renderDefine(tetrises : Tetris[]): void;

}
import Tetris from "./tetris";

interface DrawConfig {
    row : number, 
    column : number, 
    unit : number
}

export default class Scene {

    private _canvas : HTMLCanvasElement;
    private _ctx : CanvasRenderingContext2D;
    private _config : DrawConfig;

    public get row(){
        return this._config.row;
    }

    public get column(){
        return this._config.column;
    }

    public get unit(){
        return this._config.unit;
    }

    constructor(canvas : HTMLCanvasElement, contextDimention : string = "2d", config : DrawConfig){
        this._canvas = canvas;
        this._ctx = canvas.getContext(contextDimention) as CanvasRenderingContext2D;
        this._config = config;
    }

    public initialize(){
        this.resize();
        this.drawGrid();
    }

    private resize() {
        const { row, column, unit } = this._config; 
        const width = column * unit;
        const height = row * unit;
        this._canvas.setAttribute("width", width.toString());
        this._canvas.setAttribute("height", height.toString());
    }

    private drawGrid(){
        
        const { row, column, unit } = this._config;

        this._ctx.strokeStyle = "#777777";

        for(let r=0; r < row; r++){
            this._ctx.beginPath();
            this._ctx.moveTo(0, r * unit +unit);
            this._ctx.lineTo(this._canvas.width, r * unit + unit);
            this._ctx.stroke();
        }

        for(let c=0; c < column; c++){
            this._ctx.beginPath();
            this._ctx.moveTo(c * unit + unit, 0);
            this._ctx.lineTo(c * unit + unit, this._canvas.height);
            this._ctx.stroke();
        }
  
    }

    public drawTetris(tetris : Tetris){
        this._ctx.strokeStyle = "#555555";

        tetris.cubes.forEach(cube => {
            this._ctx.beginPath();
            const x = cube.mapPos.x * this.unit;
            const y = cube.mapPos.y * this.unit;
            this._ctx.rect(x, y, this.unit , this.unit);
            this._ctx.fillStyle = cube.color;
            this._ctx.fill();
            this._ctx.stroke();
        });
    }

    public draw(tetris : Tetris){
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.drawGrid();
        this.drawTetris(tetris);
    }

}
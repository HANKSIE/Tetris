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

}
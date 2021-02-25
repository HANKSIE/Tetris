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
    private _prepareCanvases : HTMLCanvasElement[] = [];
    private _prepareCtx : CanvasRenderingContext2D[] = [];
    private _holdCanvas : HTMLCanvasElement;
    private _holdCtx : CanvasRenderingContext2D;
    public get row(){
        return this._config.row;
    }

    public get column(){
        return this._config.column;
    }

    public get unit(){
        return this._config.unit;
    }

    constructor(canvas : HTMLCanvasElement, config : DrawConfig, prepareCanvases : HTMLCanvasElement[], holdCanvas : HTMLCanvasElement,){
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        this._holdCanvas = holdCanvas;
        this._holdCtx = holdCanvas.getContext("2d") as CanvasRenderingContext2D;

        this._prepareCanvases = prepareCanvases;
        prepareCanvases.forEach(canvas => {
            this._prepareCtx.push(canvas.getContext("2d") as CanvasRenderingContext2D);
        });
        this._config = config;

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

    public drawGrid(){
        
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

    private drawTetris(tetrises : Tetris[]){
        this._ctx.strokeStyle = "#555555";
        tetrises.forEach(tetris => {
            tetris.cubes.forEach(cube => {
                if(!cube.isErase){
                    const p = cube.pos;
                    this._ctx.beginPath();
                    const x = p.x * this.unit;
                    const y = p.y * this.unit;
                    this._ctx.rect(x, y, this.unit , this.unit);
                    this._ctx.fillStyle = tetris.color;
                    this._ctx.fill();
                    this._ctx.stroke();
                }
            });
        })
    }

    public draw(tetrises : Tetris[]){
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.drawGrid();
        this.drawTetris(tetrises);
    }

    private resizePrepareCanvas(tetrises : Tetris[]) {
        this._prepareCanvases.forEach((canvas, i) => {
            const shape = tetrises[i].shapeDefine();
            const { unit } = this._config; 
            const width =  shape[0].length * unit;
            const height = shape.length * unit;
            canvas.setAttribute("width", width.toString());
            canvas.setAttribute("height", height.toString());
        });
    }

    private drawPrepareTetrises(tetrises : Tetris[]) {
        this._prepareCtx.forEach((ctx, i) => {
            ctx.strokeStyle = "#555555";
            tetrises[i].cubes.forEach(cube => {
                const tp = tetrises[i].pos;
                const p = cube.pos;
                ctx.beginPath();
                //偏移
                const x = (p.x - tp.x) * this.unit;
                const y = (p.y - tp.y) * this.unit;
                ctx.rect(x, y, this.unit , this.unit);
                ctx.fillStyle = tetrises[i].color;
                ctx.fill();
                ctx.stroke();
            });
        });
    }
    
    public drawPrepare(tetrises : Tetris[]){
        this.resizePrepareCanvas(tetrises);
        this.drawPrepareTetrises(tetrises);
    }

    private resizeHold(tetris : Tetris) {
        const shape = tetris.shapeDefine();
        const { unit } = this._config; 
        const width =  shape[0].length * unit;
        const height = shape.length * unit;
        this._holdCanvas.setAttribute("width", width.toString());
        this._holdCanvas.setAttribute("height", height.toString());
    }

    private drawHoldTetris(tetris : Tetris){
        this._holdCtx.strokeStyle = "#555555";
        tetris.cubes.forEach(cube => {
            const tp = tetris.pos;
            const p = cube.pos;
            this._holdCtx.beginPath();
            //偏移
            const x = (p.x - tp.x) * this.unit;
            const y = (p.y - tp.y) * this.unit;
            this._holdCtx.rect(x, y, this.unit , this.unit);
            this._holdCtx.fillStyle = tetris.color;
            this._holdCtx.fill();
            this._holdCtx.stroke();
        });
    }

    public drawHold(tetris : Tetris){
        this.resizeHold(tetris);
        this.drawHoldTetris(tetris);
    }

    public clearAllCanvases(){
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._prepareCtx.forEach((ctx, i) => {
            const canvas = this._prepareCanvases[i];
            ctx.clearRect(0, 0, canvas.width, canvas.height);;
        });
        this._holdCtx.clearRect(0, 0, this._holdCanvas.width, this._holdCanvas.height);
    }
}
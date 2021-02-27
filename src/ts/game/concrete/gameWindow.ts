import GameWindow from "../gameWindow";
import Tetris from "../../widgets/tetris";

export class MainWindow extends GameWindow {
    
    public renderTetris(tetrises: Tetris[]): void {
        this._context.strokeStyle = "#555555";
        tetrises.forEach(tetris => {
            tetris.cubes.forEach(cube => {
                if(!cube.isClear){
                    const p = cube.pos;
                    this._context.beginPath();
                    const x = p.x * this._unit;
                    const y = p.y * this._unit;
                    this._context.rect(x, y, this._unit , this._unit);
                    this._context.fillStyle = tetris.color;
                    this._context.fill();
                    this._context.stroke();
                }
            });
        })
    }

    public resize(): void {
        const width = this.width * this._unit;
        const height = this.height * this._unit;
        this._canvas.setAttribute("width", width.toString());
        this._canvas.setAttribute("height", height.toString());
    }

    protected renderDefine(tetrises: Tetris[]): void {
        this.renderTetris(tetrises);
        this.renderGrid();
    }

    public initialize() {
        this.resize();
        this.renderGrid();
    }
    
}

class NotGridWindow extends GameWindow {
    
    public renderTetris(tetrises: Tetris[]): void {
        const tetris = tetrises[0]; 
        this._context.strokeStyle = "#555555";
        tetris.cubes.forEach(cube => {
            const tp = tetris.pos;
            const p = cube.pos;
            this._context.beginPath();
            //偏移
            const x = (p.x - tp.x) * this._unit;
            const y = (p.y - tp.y) * this._unit;
            this._context.rect(x, y, this._unit , this._unit);
            this._context.fillStyle = tetris.color;
            this._context.fill();
            this._context.stroke();
        });
    }

    constructor(canvas : HTMLCanvasElement, unit: number) {
        super(canvas, 0, 0, unit);
    }
    
    protected resize(tetris: Tetris): void {
        const width = tetris.originWidth * this._unit;
        const height = tetris.originHeight * this._unit;
        this._canvas.setAttribute("width", width.toString());
        this._canvas.setAttribute("height", height.toString());
    }
    
    protected renderDefine(tetrises: Tetris[]): void {
        this.resize(tetrises[0]);
        this.renderTetris(tetrises);
    }
    
}

export class PrepareWindow extends NotGridWindow {}

export class HoldWindow extends NotGridWindow {}

export const Types = { MainWindow, PrepareWindow, HoldWindow };
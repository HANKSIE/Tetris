import { Point } from "../interfaces/coordinate";

export default class Cube {

    private _color : string;
    private _pos : Point;
    private _mapPos : Point = {x: -1, y: -1};

    public get color(){
        return this._color;
    }

    public get pos() {
        return this._pos;
    }

    public set pos(value : Point) {
        this._pos = value;
    }

    public get mapPos() {
        return this._mapPos;
    }

    public set mapPos(value : Point) {
        this._mapPos = value;
    }

    constructor(color : string, pos : Point){
        this._color = color;
        this._pos = pos;
    }
    
}
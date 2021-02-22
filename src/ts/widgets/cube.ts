import { Point } from "../interfaces/coordinate";

export default class Cube {

    private _color : string;
    private _isActive : boolean;
    private _pos : Point;

    public get pos() {
        return this._pos;
    }

    public set pos(value : Point) {
        this._pos = value;
    }

    constructor(color : string, pos : Point){
        this._color = color;
        this._isActive = false;
        this._pos = pos;
    }
}
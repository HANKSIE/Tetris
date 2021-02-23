import { Point } from "../interfaces/coordinate";

export default class Cube {

    private _color : string;
    private _relationPos : Point;
    private _pos : Point;

    public get color(){
        return this._color;
    }

    public get pos() {
        return this._relationPos;
    }

    public set pos(value : Point) {
        this._relationPos = value;
    }

    public get mapPos() {
        return this._pos;
    }

    public set mapPos(value : Point) {
        this._pos = value;
    }

    constructor(color : string, pos : Point, mapPos : Point){
        this._color = color;
        this._relationPos = pos;
        this._pos = mapPos
    }
    
}
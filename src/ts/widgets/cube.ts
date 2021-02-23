import { Point } from "../interfaces/coordinate";

export default class Cube {

    private _color : string;
    private _relationPos : Point;
    private _pos : Point;

    public get color(){
        return this._color;
    }

    public get relationPos() {
        return this._relationPos;
    }

    public set relationPos(value : Point) {
        this._relationPos = value;
    }

    public get pos() {
        return this._pos;
    }

    public set pos(value : Point) {
        this._pos = value;
    }

    constructor(color : string, relationPos : Point, pos : Point){
        this._color = color;
        this._relationPos = relationPos;
        this._pos = pos;
    }
    
}
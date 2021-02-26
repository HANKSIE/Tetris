import Point from "../util/point";

export default class Cube {

    public relationPos : Point;
    public pos : Point;
    public isErase: boolean = false;

    constructor(relationPos : Point, pos : Point){
        this.relationPos = relationPos;
        this.pos = pos;
    }
    
}
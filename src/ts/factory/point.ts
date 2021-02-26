import Point from "../util/point";

export default class PointFactory {

    public static create(x : number, y : number) : Point {
        return new Point(x, y);
    }

    public static createByPoint(p : Point) : Point {
        const {x, y} = p;
        return new Point(x, y);
    }

    public static createMin() : Point {
        return new Point(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
    }
}
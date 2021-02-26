export default class Point {
    private _x: number;
    private _y: number;

    public get x() {
        return this._x;
    };

    public get y() {
        return this._y;
    }

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public plus(p: Point) : Point {
        const x = this._x + p.x;
        const y = this._y + p.y;
        return new Point(x, y);
    }

    public plusWith(x: number, y: number) : Point {
        return new Point(this._x + x, this._y + y);
    }

    public subtract(p : Point) : Point {
        const x = this._x - p.x;
        const y = this._y - p.y;
        return new Point(x, y);
    }

    public subtractWith(x: number, y: number) : Point {
        return new Point(this._x - x, this._y - y);
    }

    public plusX(x : number) : Point{
        return new Point(this._x + x, this.y);
    }

    public plusY(y : number) : Point{
        return new Point(this.x, this._y + y);
    }

    public subtractX(x : number) : Point{
        return new Point(this._x - x, this.y);
    }

    public subtractY(y : number) : Point{
        return new Point(this.x, this._y - y);
    }

}
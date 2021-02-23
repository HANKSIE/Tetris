import Cube from "../widgets/cube";
import { Point } from "../interfaces/coordinate";

export default class CubeFactory {
    public static create(color : string, relationPos : Point, mapPos : Point  = {x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER}) : Cube{
        return new Cube(color, relationPos, mapPos);
    }

    public static createByCube(cube : Cube) : Cube{
        const { color, relationPos, pos } = cube;

        return new Cube(color, {x: relationPos.x, y: relationPos.y}, {x: pos.x, y: pos.y});
    }

}
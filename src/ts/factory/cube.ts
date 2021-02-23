import Cube from "../widgets/cube";
import { Point } from "../interfaces/coordinate";

export default class CubeFactory {
    public static createCube(color : string, pos : Point, mapPos : Point  = {x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER}) : Cube{
        return new Cube(color, pos, mapPos);
    }
}
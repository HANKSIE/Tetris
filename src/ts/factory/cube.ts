import Cube from "../widgets/cube";
import { Point } from "../interfaces/coordinate";

export default class CubeFactory {
    public static createCube(color : string, pos : Point) : Cube{
        return new Cube(color, pos);
    }
}
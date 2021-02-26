import Point from "../util/point";
import Cube from "../widgets/cube";
import PointFactory from "./point";
export default class CubeFactory {
    
    public static create(relationPos : Point, pos : Point = PointFactory.createMin()) : Cube{
        return new Cube(relationPos, pos);
    }

}
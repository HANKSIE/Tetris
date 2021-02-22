import Cube from "./cube";

type MapShape = Array<Array<Cube | null>>

export default class MapManager {
    private _map : MapShape;

    private constructor(row: number, column : number){
        this._map = new Array(row).fill(new Array(column).fill(null)); 
    }
}

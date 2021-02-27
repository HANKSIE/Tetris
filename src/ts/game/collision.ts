import Tetris from "../widgets/tetris";

export enum BoundaryType {
    Top,
    Bottom,
    Left,
    Right
}

export default class Collision {

    private _boundary: Boundary;

    private _ignore: BoundaryType[];

    constructor(boundary: Boundary, ignore: BoundaryType[] = []){
        this._boundary = boundary;
        this._ignore = ignore;
    }
    
    public isCollisionTetris(target : Tetris, tetrises: Tetris[]) : boolean {

        for(let i = 0; i < tetrises.length; i++){
            const currTetris = tetrises[i];
            if(currTetris !==  target){
                for(let j = 0; j < target.nextCubes.length; j++){
                    if (currTetris.findCubeByPos(target.nextCubes[j].pos)){
                        return true;
                    }
                }  
            }
        }

        return false
    }

    public isCollisionBoundary(target : Tetris) : boolean {

        const { top, bottom, left, right } = this._boundary;
        for(let i = 0; i < target.nextCubes.length; i++){
            const { x, y } = target.nextCubes[i].pos;

            if(
                (x < left && !this._ignore.includes(BoundaryType.Left)) || 
                (x > right && !this._ignore.includes(BoundaryType.Right)) || 
                (y < top && !this._ignore.includes(BoundaryType.Top)) || 
                (y > bottom && !this._ignore.includes(BoundaryType.Bottom))
            ){
                return true;
            }
        }

        return false;

    }

}

interface Boundary {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
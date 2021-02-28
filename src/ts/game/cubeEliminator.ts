import ArrayHelper from "../helper/array";
import Cube from "../widgets/cube";
import Tetris from "../widgets/tetris";

export default class CubeEliminator {

    public static clear(sceneWidth: number, sceneHeight: number, tetrises: Tetris[]) : number[]{
        const clearY = CubeEliminator.clearableCubes(sceneWidth, sceneHeight, tetrises);
        CubeEliminator.removeClearableTetris(tetrises);
        return clearY;
    }

    //回傳這次應clear的y座標
    public static clearableCubes(sceneWidth: number, sceneHeight: number, tetrises: Tetris[]) : number[]{

        const count: Cube[][] = ArrayHelper.create2D<Cube>(sceneHeight);
        const clearY : number[] = [];

        tetrises.forEach(tetris => {
            tetris.cubes.forEach(cube => {
                //若cube沒被清除則加入
                if(!cube.isClear && cube.pos.y >= 0){
                    count[cube.pos.y].push(cube);
                }
            });
        });

        count.forEach((row, r) => {
            //該列都有元素
            if(row.length === sceneWidth){
                row.forEach(cube => {
                    cube.isClear = true;
                });
                clearY.push(r);
            }
        });

        return clearY;
    }

    public static removeClearableTetris(tetrises: Tetris[]) {

        tetrises.forEach(target => {
            const existCubes = target.cubes.filter(cube => {
                return cube.isClear === false;
            });
            //cube.isClear 全是 false
            if(existCubes.length === 0){
                //移除該tetris
                tetrises = tetrises.filter(tetris => tetris !== target);
            }
        });

    }

}
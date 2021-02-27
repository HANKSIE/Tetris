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

        const count = new Map<number, Cube[]>();
        const clearY : number[] = [];

        tetrises.forEach(tetris => {
            tetris.cubes.forEach(cube => {
                //若cube沒被清除則加入
                if(!cube.isClear){
                    const { y } = cube.pos;

                    if(!count.has(y)){
                        count.set(y, []);
                    }
                    count.get(y)!.push(cube);
                }
            });
        });

        count.forEach((cubes: Cube[], y: number) => {
            if(cubes.length === sceneWidth){
                cubes.forEach(cube => {
                    cube.isClear = true;
                });
                clearY.push(y);
            }
        })

        // count.forEach((row, r) => {
        //     //該列都有元素
        //     if(row.length === sceneWidth){
        //         row.forEach(cube => {
        //             cube.isClear = true;
        //         });
        //         clearY.push(r);
        //     }
        // });

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
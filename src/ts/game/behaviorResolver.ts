import TetrisFactory from "../factory/tetris";
import Tetris, { ShapeValue } from "../widgets/tetris";
import CubeEliminator from "./cubeEliminator";
import GameContext from "./context";

export default class GameBehaviorResolver {

    public static clearCubes(context: GameContext){
        context.downTimer.stop();
        const clearY =  CubeEliminator.clear(context.gameWindow.width, context.gameWindow.height, context.tetrises);
      
        context.tetrises.forEach(tetris => {
            tetris.cubes.forEach(cube => {
                //下降量
                const down = clearY.filter(y => y > cube.pos.y).length;
                cube.pos = cube.pos.plusY(down);
            });
        });

        context.downTimer.start();
    }

    public static updateCurrAndPrepare(context: GameContext){
        context.currTetris = context.prepareTetrises.shift() as Tetris;
        context.tetrises.push(context.currTetris);
        context.prepareTetrises.push(TetrisFactory.createRandom(context.gameWindow.width));
        GameBehaviorResolver.renderPrepareWindow(context);
    }

    public static windowInit(context: GameContext){
        context.gameWindow.clear();
        context.gameWindow.renderGrid();
        context.prepareWindow.forEach(w => w.clear());
        context.holdWindow.clear();
    }

    public static renderPrepareWindow(context: GameContext) {
        context.prepareWindow.forEach((w, i) => {
            w.render([context.prepareTetrises[i]]);
        });
    }

    public static currTetrisDown(context: GameContext) {
        context.currTetris.down();
    }

    public static nextTick(context: GameContext, isDown: boolean = false){
        
        //未發生碰撞
        if(!context.collision.isCollision(context.currTetris, context.tetrises)){
            context.currTetris.update(); //更新現在位置
            return;
        }

        //collision
        if(isDown){

            //復原timer間隔
            context.downTimer.ms = context.downInterval;

            //gameover(發生碰撞且tetris的cubes的y都小於0)
            if(context.currTetris.cubes.filter(cube => cube.pos.y >= 0).length === 0){
                context.gameWindow.renderTetris(context.tetrises);
                context.gameover = true;
                return;
            }

            //消除方塊
            GameBehaviorResolver.clearCubes(context);
            //產生新方塊
            GameBehaviorResolver.updateCurrAndPrepare(context);

            context.softDown = false;
            context.canHold = true;

            //取得上移量
            const upY = GameBehaviorResolver.upAmount(context);

            //需要上移
            if(upY > 0){
                context.currTetris.up(upY);
                context.currTetris.update(); //更新現在位置
                context.gameWindow.renderTetris(context.tetrises);
                return;
            }
          
        }

        context.currTetris.back();

    }

    private static upAmount(context: GameContext) : number {

        const { currTetris, tetrises } = context;
        let topY = Number.MAX_SAFE_INTEGER;
        let up = 0;
        // find topY
        tetrises.forEach(tetris => {
            if(tetris !== currTetris){
                const cubes = tetris.cubes;
                cubes.forEach(c => {
                    if(c.pos.y < topY){
                        topY = c.pos.y;
                    }
                })
            }
        });

        const shape = currTetris.currentShape;
        const { width, height } = currTetris;

        const last = height - 1;
        let bottomY = currTetris.pos.y + currTetris.height;

        //shape上移量
        for(let r = last; r >= 0; r--) {
            for(let c = 0; c < width; c++){
                if(shape[r][c] === ShapeValue.DEFINED){
                    bottomY - (last - r)
                    break;
                }
            }
        }

        const reserve = 1;
        if(topY <= bottomY){
            up = Math.abs(bottomY - topY) + reserve;
        }

        return up;
    }

}
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

    public static upCurrTetris(context: GameContext){
        const currTetris = context.currTetris
        const shape = currTetris.currentShape;
        const { width, height } = currTetris;

        //上移量 = _currShape第一行與有定義的第一行之距離
        for(let r = 0; r < height; r++) {
            for(let c = 0; c < width; c++){
                if(shape[r][c] === ShapeValue.DEFINED){
                    currTetris.pos = currTetris.pos.subtractY(r);
                    break;
                }
            }
        }

        //上移_currShape之高度 - 1
        for(let r = 0; r < height - 1; r++) {
            currTetris.up();
        }
    }

    public static currTetrisDown(context: GameContext) {
        context.currTetris.down();
        context.isDown = true;
    }

    public static nextTick(context: GameContext){
        
        //未發生碰撞
        if(!context.collision.isCollision(context.currTetris, context.tetrises)){
            context.currTetris.update(); //更新現在位置
            return;
        }

        //collision
        if(context.isDown){

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

            //剛產生就發生碰撞
            if(context.collision.isCollisionTetris(context.currTetris, context.tetrises)){
                GameBehaviorResolver.upCurrTetris(context); //上移
                context.currTetris.update(); //更新現在位置
                context.gameWindow.renderTetris(context.tetrises);
            }

        }

        context.currTetris.back();

    }

}
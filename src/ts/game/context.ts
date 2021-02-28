// import Tetris from "../widgets/tetris";

// export default interface GameContext {

//     currTetris : Tetris;
//     tetrises : Tetris[] ;
//     prepareTetrises : Tetris[];
//     holdTetris : Tetris | null ;

//     softDown : boolean;
//     isDown : boolean;
//     canHold : boolean; 
//     gameover: boolean
// }

import TetrisFactory from "../factory/tetris";
import Timer from "../util/timer";
import Tetris from "../widgets/tetris";
import Collision, { BoundaryType } from "./collision";
import GameWindow from "./window/gameWindow";

export default class GameContext {

    public gameWindow : GameWindow;
    public prepareWindow : GameWindow[];
    public holdWindow : GameWindow;

    public downTimer : Timer;
    public renderTimer : Timer;

    public collision : Collision;

    public readonly downInterval : number = 450;
    public readonly renderInterval : number = 50;
    public readonly speedIncrease : number = 400;

    public currTetris : Tetris;
    public tetrises : Tetris[] = [];
    public prepareTetrises : Tetris[] = [];
    public holdTetris : Tetris | null = null ;

    public softDown : boolean = false;
    public isDown : boolean = false;
    public canHold : boolean = true; 
    public gameover: boolean = false;

    constructor(gameWindow: GameWindow, prepareWindow: GameWindow[], holdWindow: GameWindow, downUpdate: CallableFunction){
        this.gameWindow = gameWindow;
        this.prepareWindow = prepareWindow;
        this.holdWindow = holdWindow;

        this.currTetris = TetrisFactory.createRandom(this.gameWindow.width);

        this.tetrises.push(this.currTetris);
        
        for(let i=0; i < this.prepareWindow.length; i++){
            this.prepareTetrises.push(TetrisFactory.createRandom(this.gameWindow.width));
        }
        
        this.downTimer = new Timer(() => {
            downUpdate();
        }, this.downInterval);

        this.renderTimer = new Timer(() => {;
            this.gameWindow.render(this.tetrises);
        }, this.renderInterval);


        this.collision = new Collision(
            {
                top: 0, 
                bottom: gameWindow.height - 1, 
                left: 0, 
                right: gameWindow.width - 1
            },
            [
                BoundaryType.Top
            ]
        );
    }
    
}
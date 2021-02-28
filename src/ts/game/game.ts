import GameWindow from "./window/gameWindow";
import GameContext from "./context";
import GameBehaviorResolver from "./behaviorResolver";
import { actions as keyboardActions } from "./action/concrete/keyboard";

export default class Game {

    private _context: GameContext;

    private userKeyDownBehavior = (event : KeyboardEvent) => {
        keyboardActions.keydown.forEach( action => {
            action(event, this._context);
        });
      
        GameBehaviorResolver.nextTick(this._context);
    }

    private userKeyUpBehavior = (event : KeyboardEvent) => {
        keyboardActions.keyup.forEach( action => {
            action(event, this._context);
        });
        GameBehaviorResolver.nextTick(this._context);
    }

    constructor(gameWindow: GameWindow, prepareWindow: GameWindow[], holdWindow: GameWindow){
        this._context = new GameContext(gameWindow, prepareWindow, holdWindow, this.update); 
    }

    private registerUserBehavior(){
        document.addEventListener("keydown", this.userKeyDownBehavior);
        document.addEventListener("keyup", this.userKeyUpBehavior);
    }

    private removeUserBehavior(){
        document.removeEventListener("keydown", this.userKeyDownBehavior);
        document.removeEventListener("keyup", this.userKeyUpBehavior);
    }

    private update = () => {
        GameBehaviorResolver.currTetrisDown(this._context);
        GameBehaviorResolver.nextTick(this._context);
        if(this._context.gameover){
            this.stop();
            alert("gameover");
        }
        this._context.isDown = false;
    }

    public start(){
        if(this._context.gameover){
            this.initialize();
        }
        this._context.downTimer.start();
        this._context.renderTimer.start();
        GameBehaviorResolver.renderPrepareWindow(this._context);
        this.registerUserBehavior();
    }

    public stop(){
        this._context.downTimer.stop();
        this._context.renderTimer.stop();
        this.removeUserBehavior();
    }

    public initialize() {
        const { gameWindow, prepareWindow, holdWindow } = this._context;
        this._context = new GameContext(gameWindow, prepareWindow, holdWindow, this.update);
        GameBehaviorResolver.windowInit(this._context);
        this.removeUserBehavior();
    }

}
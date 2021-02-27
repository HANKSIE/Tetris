import Tetris from "../widgets/tetris";

export default interface GameContext {

    currTetris : Tetris;
    tetrises : Tetris[] ;
    prepareTetrises : Tetris[];
    holdTetris : Tetris | null ;

    softDown : boolean;
    isDown : boolean;
    canHold : boolean; 
    bottom: boolean;
    gameover: boolean
}
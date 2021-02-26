import Tetris from "../widgets/tetris";

export interface GameContext {

    currTetris : Tetris;
    tetrises : Tetris[] ;
    prepareTetrises : Tetris[];
    holdTetris : Tetris | null ;

    softDown : boolean;
    isDown : boolean;
    canHold : boolean; 
    start : boolean;
    nextRound: boolean;
}

export function createGameContext(curr : Tetris) : GameContext{
    return {
    
        currTetris : curr,
        tetrises: [],
        prepareTetrises: [],
        holdTetris: null,
    
        softDown: false,
        isDown: false,
        canHold: true, 
        start: false,
        nextRound: false,
    }
}
import GameContext from "../../context";
import GameBehaviorResolver from "../../behaviorResolver";
import KeyboardAction from "../keyboard";


const moveLeft : KeyboardAction = (event: KeyboardEvent, context: GameContext) => {
    if(event.key === "ArrowLeft"){
        context.currTetris.left();
    }
}

const moveRight : KeyboardAction = (event: KeyboardEvent, context: GameContext) => {
    if(event.key === "ArrowRight"){
        context.currTetris.right();
    }
}

const rotate : KeyboardAction = (event: KeyboardEvent, context: GameContext) => {
    if(event.key === "ArrowUp"){
        context.currTetris.rotate();
    }
}

const hold: KeyboardAction = (event: KeyboardEvent, context: GameContext) => {
    if(event.key === "c" && context.canHold){
        context.canHold = false;
        if(context.holdTetris){
            const tempCurr = context.currTetris;
            context.currTetris = context.holdTetris;
            context.currTetris.posInitialize();
            context.holdTetris = tempCurr;
            context.tetrises = context.tetrises.filter(tetris => tetris !== context.holdTetris);
            context.tetrises.push(context.currTetris);
        }else{
            context.holdTetris = context.currTetris;
            GameBehaviorResolver.updateCurrAndPrepare(context);
            context.tetrises = context.tetrises.filter(tetris => tetris !== context.holdTetris);
            context.currTetris.posInitialize();
            context.holdTetris.posInitialize();
        }

        context.holdWindow.render([context.holdTetris]);
    }
}

const softDrop : KeyboardAction = (event: KeyboardEvent, context: GameContext) => {
    if(event.key === "ArrowDown"){
        if(!context.softDown){
            context.downTimer.ms =  context.downTimer.ms -  context.speedIncrease;
            context.softDown = true;
        }
    }
}

const restoreSoftDrop: KeyboardAction = (event: KeyboardEvent, context: GameContext) => {
    if(event.key === "ArrowDown"){
        if(context.softDown){
            context.downTimer.ms =  context.downTimer.ms +  context.speedIncrease;
            context.softDown = false;
        }
    }
}

const hardDrop : KeyboardAction = (event: KeyboardEvent, context: GameContext) => {
    if(event.key === " "){
        context.downTimer.ms = 0;
    }
}

const actions = {
    keydown: [moveLeft, moveRight, rotate, softDrop ,hardDrop, hold],
    keyup: [restoreSoftDrop],
}

export { actions };
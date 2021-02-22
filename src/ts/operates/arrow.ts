import KeyboardOperate from "./keyboard";

const moveToLeft : KeyboardOperate = {
    handle(event : KeyboardEvent) {
        if(event.key === "ArrowLeft"){
            console.log("左");
        }
    }
};

const moveToRight : KeyboardOperate = {
    handle(event : KeyboardEvent) {
        if(event.key === "ArrowRight"){
            console.log("右");
        }
    }
};

const rotate : KeyboardOperate = {
    handle(event : KeyboardEvent) {
        if(event.key === "ArrowUp"){
            console.log("上");
        }
    }
};

const quickDown : KeyboardOperate = {
    handle(event : KeyboardEvent) {
        if(event.key === "ArrowDown"){
            console.log("下");
        }
    }
    
};

export { moveToLeft, moveToRight, rotate, quickDown };
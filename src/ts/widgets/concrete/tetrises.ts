import Tetris from "../tetris";

export class ITetris extends Tetris {

    public colorDefine() : string {
        return "#42b0f5";
    }

    public shapeDefine(): number[][] {
        return [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0],
        ];
    }

}

export class JTetris extends Tetris {

    public colorDefine() : string {
        return "#3874ff";
    }

    public shapeDefine(): number[][] {
        return [
            [1,0,0],
            [1,1,1],
            [0,0,0],
        ];
    }

}

export class LTetris extends Tetris {
    
    public colorDefine() : string {
        return "#ff8e24";
    }

    public shapeDefine(): number[][] {
        return [
            [0,0,1],
            [1,1,1],
            [0,0,0],
        ];
    }

}

export class OTetris extends Tetris {

    public colorDefine() : string {
        return "#fff242";
    }

    public shapeDefine(): number[][] {
        return [
            [1,1],
            [1,1],
        ];
    }

}

export class STetris extends Tetris {

    public colorDefine() : string {
        return "#00de3f";
    }

    public shapeDefine(): number[][] {
        return [
            [0,1,1],
            [1,1,0],
            [0,0,0],
        ];
    }

}

export class TTetris extends Tetris {

    public colorDefine() : string {
        return "#e557f7";
    }

    public shapeDefine(): number[][] {
        return [
            [0,1,0],
            [1,1,1],
            [0,0,0],
        ];
    }

}

export class ZTetris extends Tetris {

    public colorDefine() : string {
        return "#ff1f1f";
    }

    public shapeDefine(): number[][] {
        return [
            [1,1,0],
            [0,1,1],
            [0,0,0],
        ];
    }
}

export const Types = {
    ITetris,
    JTetris,
    LTetris,
    OTetris,
    STetris,
    TTetris,
    ZTetris
}
import Tetris from "../tetris";

class ITetris extends Tetris {

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

class JTetris extends Tetris {

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

class LTetris extends Tetris {
    
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

class OTetris extends Tetris {

    public colorDefine() : string {
        return "#fadb14";
    }

    public shapeDefine(): number[][] {
        return [
            [1,1],
            [1,1],
        ];
    }

}

class STetris extends Tetris {

    public colorDefine() : string {
        return "#c1ff70";
    }

    public shapeDefine(): number[][] {
        return [
            [0,1,1],
            [1,1,0],
            [0,0,0],
        ];
    }

}

class TTetris extends Tetris {

    public colorDefine() : string {
        return "#c859f7";
    }

    public shapeDefine(): number[][] {
        return [
            [0,1,0],
            [1,1,1],
            [0,0,0],
        ];
    }

}

class ZTetris extends Tetris {

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

const TetrisType = {
    ITetris,
    JTetris,
    LTetris,
    OTetris,
    STetris,
    TTetris,
    ZTetris
}

export default TetrisType;
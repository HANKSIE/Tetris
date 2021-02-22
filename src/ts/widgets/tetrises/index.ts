import Tetris from "../tetris";

class ITetris extends Tetris {
    public shapeDefine(): number[][] {
        return [
            [1,1,1,1],
        ];
    }
}

class JTetris extends Tetris {
    public shapeDefine(): number[][] {
        return [
            [1,0,0],
            [1,1,1],
        ];
    }
}

class LTetris extends Tetris {
    public shapeDefine(): number[][] {
        return [
            [0,0,1],
            [1,1,1],
        ];
    }
}

class OTetris extends Tetris {
    public shapeDefine(): number[][] {
        return [
            [1,1],
            [1,1],
        ];
    }
}

class STetris extends Tetris {
    public shapeDefine(): number[][] {
        return [
            [0,1,1],
            [1,1,0],
        ];
    }
}

class TTetris extends Tetris {
    public shapeDefine(): number[][] {
        return [
            [0,1,0],
            [1,1,1],
        ];
    }
}

class ZTetris extends Tetris {
    public shapeDefine(): number[][] {
        return [
            [1,1,0],
            [0,1,1],
        ];
    }
}

export {
    ITetris, 
    JTetris, 
    LTetris, 
    OTetris, 
    STetris, 
    TTetris, 
    ZTetris
};